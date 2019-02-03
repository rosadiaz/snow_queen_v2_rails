class ChangeTotalColumnTypeToDecimalToQuote < ActiveRecord::Migration[5.2]
  def change
    change_column :quotes, :total, :decimal, precision: 10, scale: 2
  end
end
