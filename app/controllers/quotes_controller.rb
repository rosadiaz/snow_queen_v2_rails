class QuotesController < ApplicationController
  def new
    @quote = Quote.new
    @lead = Lead.new
    @service_expedition_time = [
      {label: 'URGENT in ', id: '3hrs', price: 99.99},
      {label: 'In the next', id: '8hrs', price: 49.99},
      {label: 'FREE', id: '24hrs', price: 0},
    ]
    @salt_bag_price = 35
  end

  def create
    @quote = Quote.new quote_params
    if @quote.save
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
      :area, 
      :total, 
      :comments, 
      :polygons, 
      :static_map_URL,
      :service_expedition_cost,
      :service_expedition_time,
      )  
  end
  
end
