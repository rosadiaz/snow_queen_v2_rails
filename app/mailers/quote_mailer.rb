class QuoteMailer < ApplicationMailer
  def new_quote(quote)
    @quote = quote
    
    mail(
      to: @quote.email,
      from: "info@shovelsquad.com",
      bcc: "info@shovelsquad.com",
      subject: "Service request ##{@quote.id}"
    )
  end

end
