require "./app/services/static_map_url_builder.rb"

class QuoteMailer < ApplicationMailer
  
  def new_quote(quote)
    @quote = quote
    @static_map_URL = ::StaticMapUrlBuilder.build(@quote.polygons_coordinates)

    mail(
      to: @quote.email,
      subject: "Service request ##{@quote.id}"
    )
  end

end 