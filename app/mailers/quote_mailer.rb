class QuoteMailer < ApplicationMailer
  def new_quote(quote)
    @quote = quote
    
    mail(
      to: @quote.email,
      subject: "Service request ##{@quote.id}"
    )
  end

end
