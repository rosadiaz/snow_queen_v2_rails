class AddServiceExpeditionCostToQuotes < ActiveRecord::Migration[5.2]
  def change
    add_column :quotes, :service_expedition_cost, :float
  end
end
