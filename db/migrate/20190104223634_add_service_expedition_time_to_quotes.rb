class AddServiceExpeditionTimeToQuotes < ActiveRecord::Migration[5.2]
  def change
    add_column :quotes, :service_expedition_time, :string
  end
end
