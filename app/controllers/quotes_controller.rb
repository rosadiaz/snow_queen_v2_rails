class QuotesController < ApplicationController
  def new
    @quote = Quote.new
    @lead = Lead.new
    @service_expedition_options = [
      {label: 'URGENT in ', time: '3hrs', price: 99.99},
      {label: 'In the next', time: '8hrs', price: 49.99},
      {label: 'FREE', time: '24hrs', price: 0},
    ]
    @salt_bag_price = Quote::PRICE_PER_SALT_BAG
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
      :total, # TODO: remove
      :comments, 
      :polygons, 
      :static_map_URL, # TODO: remove
      :service_expedition_cost, # TODO: remove
      :service_expedition_time,
      :salt_bags_quantity,
      :salt_bags_due, # TODO: remove
      )  
  end
  
end
