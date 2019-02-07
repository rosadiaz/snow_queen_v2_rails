class Quote < ApplicationRecord
  validates :email, presence: true
  validates :address, presence: true
  validates :phone_number, presence: true, telephone_number: {country: proc{|record| :ca}, types: [:fixed_line, :mobile, :area_code_optional]}
  # validates :terms, acceptance: true
  validates :terms, inclusion: { in: [true], message: " and Conditions must be accepted"}

  # PRICES SET BY SHOVEL SQUAD 
  PRICE_PER_SQ_FT = 0.25
  PRICE_PER_SALT_BAG = 35
  MIN_CHARGE = 150
  SERVICE_EXPEDITION_OPTIONS = {
    (SERVICE_TIME_URGENT = :urgent) => 99.99,
    (SERVICE_TIME_SOON = :soon) => 49.99,
    (SERVICE_TIME_FREE = :free) => 0,
  }
  DISCOUNT = 0.5

  before_create do
    self.price_per_sq_ft = PRICE_PER_SQ_FT
    self.price_per_salt_bag = PRICE_PER_SALT_BAG
    self.min_charge = MIN_CHARGE
    self.discount = DISCOUNT
    self.total = area * price_per_sq_ft
    self.service_expedition_cost = SERVICE_EXPEDITION_OPTIONS.fetch(service_expedition_time.to_sym)
    self.total += service_expedition_cost
    self.total += salt_bags_quantity * price_per_salt_bag
    self.total = [total, min_charge].max * discount
  end

  before_update do
    # When allowing previous quote updates, make sure the prices are persistent to the original quote
    errors.add(:base, "Quote changes have not been implemented")
    throw :abort
  end

  def total_in_cents
    (total * 100).to_i 
  end

  def add_payment_id(charge_id)
    raise "Payment ID already exists" if payment_id
    # This skips validations because the quote needs to have a payment id after saving quote
    update_column(:payment_id, charge_id)
  end

end
