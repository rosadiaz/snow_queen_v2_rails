class AddPricesToQuote < ActiveRecord::Migration[5.2]
  def change
    add_column :quotes, :price_per_sq_ft, :decimal, precision: 10, scale: 2
    add_column :quotes, :min_charge, :decimal, precision: 10, scale: 2
    add_column :quotes, :price_per_salt_bag, :decimal, precision: 10, scale: 2
  end
end
