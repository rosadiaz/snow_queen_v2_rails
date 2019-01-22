class RemoveSaltBagsDueFromQuotes < ActiveRecord::Migration[5.2]
  def change
    remove_column :quotes, :salt_bags_due, :float
  end
end
