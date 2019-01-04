class LeadMailer < ApplicationMailer
  def new_lead(lead)
    @lead = lead
    
    mail(
      to: "info@shovelsquad.com",
      from: "info@shovelsquad.com",
      subject: "Phone call requested #{@lead.phone_number}"
    )
  end
end
