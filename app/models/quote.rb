class Quote < ApplicationRecord
  validates :email, presence: true
  validates :address, presence: true
  validates :service_expedition_cost, presence:true

end
