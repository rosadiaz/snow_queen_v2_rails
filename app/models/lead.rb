class Lead < ApplicationRecord
  validates :phone_number, presence: true, telephone_number: {country: proc{|record| :ca}, types: [:fixed_line, :mobile, :area_code_optional]}
  validates :first_name, presence: true
  validates :last_name, presence: true
end
