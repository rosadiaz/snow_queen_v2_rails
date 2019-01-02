class LeadsController < ApplicationController
  def new
    @lead = Lead.new
  end

  def create
    @lead = Lead.new lead_params
    if @lead.save
      # LeadMailer.new_lead(@lead).deliver
      render json: {}, status: :ok
    else
      render json: { errors: @lead.errors.full_messages}, status: :unprocessable_entity
    end
  end

  private
  def lead_params
    params.require(:lead).permit(
      :first_name, 
      :last_name, 
      :phone_number, 
      )  
  end
end
