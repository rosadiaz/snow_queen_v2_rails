class Quote < ApplicationRecord
  validates :email, presence: true
  validates :address, presence: true

  # PRICES SET BY SHOVEL SQUAD 
  PRICE_PER_SQ_FT = 0.36
  PRICE_PER_SALT_BAG = 35
  MIN_CHARGE = 150

  before_create do
    self.price_per_sq_ft = PRICE_PER_SQ_FT
    self.price_per_salt_bag = PRICE_PER_SALT_BAG
    self.min_charge = MIN_CHARGE
  end


end
