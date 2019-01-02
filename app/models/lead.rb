class Lead < ApplicationRecord
  validates :phone_number, presence: true
  validates :first_name, presence: true
  validates :last_name, presence: true
end
