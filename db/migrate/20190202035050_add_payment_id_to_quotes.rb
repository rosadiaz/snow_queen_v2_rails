class AddPaymentIdToQuotes < ActiveRecord::Migration[5.2]
  def change
    add_column :quotes, :payment_id, :string
  end
end
