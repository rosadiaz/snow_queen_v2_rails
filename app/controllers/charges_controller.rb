class ChargesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    
    token = params[:stripeToken]

    charge = Stripe::Charge.create({
        amount: 999,
        currency: 'cad',
        description: 'Example charge',
        source: token,
    })

    render json: params
  end
end
