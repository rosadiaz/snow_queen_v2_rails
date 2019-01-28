class Quote < ApplicationRecord
  validates :email, presence: true
  validates :address, presence: true
  validates :phone_number, presence: true, telephone_number: {country: proc{|record| :ca}, types: [:fixed_line, :mobile, :area_code_optional]}

  # PRICES SET BY SHOVEL SQUAD 
  PRICE_PER_SQ_FT = 0.36
  PRICE_PER_SALT_BAG = 35
  MIN_CHARGE = 150
  SERVICE_EXPEDITION_OPTIONS = {
    (SERVICE_TIME_URGENT = :urgent) => 99.99,
    (SERVICE_TIME_SOON = :soon) => 49.99,
    (SERVICE_TIME_FREE = :free) => 0,
  }

  before_create do
    self.price_per_sq_ft = PRICE_PER_SQ_FT
    self.price_per_salt_bag = PRICE_PER_SALT_BAG
    self.min_charge = MIN_CHARGE
    self.total = self.area * self.price_per_sq_ft
    self.service_expedition_cost = SERVICE_EXPEDITION_OPTIONS.fetch(self.service_expedition_time.to_sym)
    self.total += self.service_expedition_cost
    self.total += self.salt_bags_quantity * self.price_per_salt_bag
    self.total = [self.total, self.min_charge].max
  end

  before_update do
    # When allowing previous quote updates, make sure the prices are persistent to the original quote
    self.errors.add(:base, "Quote changes have not been implemented")
    throw :abort
  end

end
