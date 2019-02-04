class AddDiscountToQuote < ActiveRecord::Migration[5.2]
  def change
    add_column :quotes, :discount, :decimal, precision: 10, scale: 2
  end
end
