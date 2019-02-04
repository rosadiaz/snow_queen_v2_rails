class ChangePolygonsColumnToPolygonsCoordinatesToQuotes < ActiveRecord::Migration[5.2]
  def change
    rename_column :quotes, :polygons, :polygons_coordinates
  end
end
