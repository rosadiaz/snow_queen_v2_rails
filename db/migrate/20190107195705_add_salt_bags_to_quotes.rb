class AddSaltBagsToQuotes < ActiveRecord::Migration[5.2]
  def change
    add_column :quotes, :salt_bags_quantity, :integer
    add_column :quotes, :salt_bags_due, :float
  end
end
