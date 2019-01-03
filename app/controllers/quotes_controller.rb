class QuotesController < ApplicationController
  def new
    @quote = Quote.new
    @lead = Lead.new
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
      :static_map_URL
      )  
  end
  
end
