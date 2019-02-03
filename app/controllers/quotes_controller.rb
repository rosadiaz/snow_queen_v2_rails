class QuotesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def new
    @quote = Quote.new
    @lead = Lead.new
    @price_per_salt_bag = Quote::PRICE_PER_SALT_BAG
    @price_per_sq_ft = Quote::PRICE_PER_SQ_FT
    @min_charge = Quote::MIN_CHARGE
  end

  def create
    # token = params[:stripeToken]

    # charge = Stripe::Charge.create({
    #     amount: 99,
    #     currency: 'cad',
    #     description: 'Example charge',
    #     source: token,
    # })

    @quote = Quote.new quote_params
    if @quote.save
      # @quote.payment_id = charge.id
      # TODO: hacking handling errors
      QuoteMailer.new_quote(@quote).deliver
      render json: {}, status: :ok
    else
      render json: { errors: @quote.errors.full_messages}, status: :unprocessable_entity
    end

  rescue Exception => e
    Rails.logger.debug e.inspect
    Rails.logger.debug e.message
    render json: { error: e.message}, status: :unprocessable_entity  
  end

  private
  def quote_params
    params.require(:quote).permit(
      :email, 
      :phone_number,
      :first_name, 
      :last_name, 
      :address, 
      :area, # TODO: remove
      :comments, 
      :polygons, 
      :static_map_URL, # TODO: remove
      :service_expedition_time,
      :salt_bags_quantity,
      )  
  end
  
end
