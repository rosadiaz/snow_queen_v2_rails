class AddPolygonsToQuote < ActiveRecord::Migration[5.2]
  def change
    add_column :quotes, :polygons, :JSON
  end
end
