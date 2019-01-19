require "rails_helper"
RSpec.describe Quote do
  describe "create" do
    let(:new_quote) { Quote.create(address: "address", email: "email@me.com") }
    it "sets price per square foot" do
      expect(new_quote.price_per_sq_ft).to eq(Quote::PRICE_PER_SQ_FT)  
    end

    it "sets price per salt bag" do
      expect(new_quote.price_per_salt_bag).to eq(Quote::PRICE_PER_SALT_BAG)
    end

    it "sets minimum charge" do
      expect(new_quote.min_charge).to eq(Quote::MIN_CHARGE)  
    end

    it "raises an error when updating a quote" do
      new_quote.address = "new address" 
      expect(new_quote.save).to eq(false)
    end
    
  end
end