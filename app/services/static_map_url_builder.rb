class StaticMapUrlBuilder
  BASE_URL = "https://maps.googleapis.com/maps/api/staticmap?"
  POLYGON_OPTIONS = "path=color:0x61D5DD|fillcolor:0x61D5DD|weight:5|"
  ZOOM = "20"
  SIZE = "512x512"
  MAP_TYPE = "satellite"

  def self.build(polygons_coordinates)
    polygons_strings = build_coordinates_strings(polygons_coordinates)
    polygons = polygons_strings.map { |string| POLYGON_OPTIONS + string}.join("&")
    api_key = Rails.application.credentials.google_api
    "#{BASE_URL}#{polygons}&zoom=#{ZOOM}&size=#{SIZE}&maptype=#{MAP_TYPE}&key=#{api_key}"
  end

  def self.build_coordinates_strings(polygons_coordinates)
    parsed_json = ActiveSupport::JSON.decode(polygons_coordinates)

    return parsed_json.map { 
      |polygon| polygon.map { 
        |coord| coord.values.join(",") 
      }.join("|")
    }

  end
end
