class AddEmailIndexToQuotes < ActiveRecord::Migration[5.2]
  def change
    add_index :quotes, :email
  end
end
