class CreateQuotes < ActiveRecord::Migration[5.2]
  def change
    create_table :quotes do |t|
      t.string :address
      t.float :area
      t.float :total
      t.string :email
      t.text :comments
      t.string :first_name
      t.string :last_name

      t.timestamps
    end
  end
end
