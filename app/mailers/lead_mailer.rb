class LeadMailer < ApplicationMailer
  def new_lead(lead)
    @lead = lead
    
    mail(
      to: "SnowQueen@winterhelpers.com",
      from: "SnowQueen@winterhelpers.com",
      subject: "Phone call requested #{@lead.phone_number}"
    )
  end
end
