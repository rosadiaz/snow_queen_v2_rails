class AddStaticMapUrlToQuote < ActiveRecord::Migration[5.2]
  def change
    add_column :quotes, :static_map_URL, :string
  end
end
