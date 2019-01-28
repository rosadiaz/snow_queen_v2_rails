class AddPhoneNumberToQuote < ActiveRecord::Migration[5.2]
  def change
    add_column :quotes, :phone_number, :string
  end
end
