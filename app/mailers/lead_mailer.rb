class LeadMailer < ApplicationMailer
  def new_lead(lead)
    @lead = lead
    
    mail(
      subject: "Phone call requested #{@lead.phone_number}"
    )
  end
end
