class QuotesController < ApplicationController

  def new
    @quote = Quote.new
    @lead = Lead.new
    @price_per_salt_bag = Quote::PRICE_PER_SALT_BAG
    @price_per_sq_ft = Quote::PRICE_PER_SQ_FT
    @min_charge = Quote::MIN_CHARGE
    @discount = Quote::DISCOUNT
  end

  def create
    @quote = Quote.new quote_params
    if @quote.save
      token = params[:token_id]
  
      charge = Stripe::Charge.create({
          amount: @quote.total_in_cents,
          currency: 'cad',
          description: "Shovel Squad service # #{@quote.id}",
          source: token,
      })
      @quote.add_payment_id(charge["id"])
      # TODO: hacking handling errors
      QuoteMailer.new_quote(@quote).deliver
      render json: { id: @quote.id }, status: :ok
    else
      render json: { errors: @quote.errors.full_messages}, status: :unprocessable_entity
    end

  rescue Exception => e
    Rails.logger.debug e.inspect
    Rails.logger.debug e.message
    render json: { errors: [e.message]}, status: :unprocessable_entity  
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
      :polygons_coordinates, 
      :service_expedition_time,
      :salt_bags_quantity,
      )  
  end
  
end
