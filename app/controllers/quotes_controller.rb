class QuotesController < ApplicationController
  def new
    @quote = Quote.new
    @lead = Lead.new
    @price_per_salt_bag = Quote::PRICE_PER_SALT_BAG
    @price_per_sq_ft = Quote::PRICE_PER_SQ_FT
    @min_charge = Quote::MIN_CHARGE
  end

  def create
    @quote = Quote.new quote_params
    if @quote.save
      # TODO: hacking handling errors
      QuoteMailer.new_quote(@quote).deliver
      render json: {}, status: :ok
    else
      render json: { errors: @quote.errors.full_messages}, status: :unprocessable_entity
    end
  end

  private
  def quote_params
    params.require(:quote).permit(
      :email, 
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
