class QuoteMailer < ApplicationMailer
  def new_quote(quote)
    @quote = quote
    base_URL = "https://maps.googleapis.com/maps/api/staticmap?"
    polygon_options = "path=color:0x61D5DD|fillcolor:0x61D5DD|weight:5|"
    polygons_strings = build_coordinates_strings
    polygons = polygons_strings.map { |string| polygon_options + string}.join("&")
    zoom = "20"
    size = "512x512"
    map_type = "satellite"
    api_key = "AIzaSyDafFObZ3lBKKVKjYwxGL2xcvqVEwC68XY"
    @static_map_URL = "#{base_URL}#{polygons}&zoom=#{zoom}&size=#{size}&maptype=#{map_type}&key=#{api_key}"
    
    mail(
      to: @quote.email,
      subject: "Service request ##{@quote.id}"
    )
  end

  private
  def build_coordinates_strings
    parsed_json = ActiveSupport::JSON.decode(@quote.polygons_coordinates)

    return parsed_json.map { 
      |polygon| polygon.map { 
        |coord| coord.values.join(",") 
      }.join("|")
    }

  end

end 