class Quote < ApplicationRecord
  validates :email, presence: true
  validates :address, presence: true

end
