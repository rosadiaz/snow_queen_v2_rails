class ChargesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    
    # token = params[:stripeToken]

    # charge = Stripe::Charge.create({
    #     amount: 99,
    #     currency: 'cad',
    #     description: 'Example charge',
    #     source: token,
    # })

    # render json: params
    # rescue Exception => e
    #   # flash[:error] = e.message
    #   # redirect_to new_quote_path
    #   Rails.logger.debug e.inspect
    #   Rails.logger.debug e.message
    #   render json: { error: e.message}, status: :unprocessable_entity     

  end

end
