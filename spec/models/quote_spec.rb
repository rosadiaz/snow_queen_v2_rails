require "rails_helper"
RSpec.describe Quote do
  describe "create" do
    let(:area) { 1000 }
    let(:service_expedition_time) { Quote::SERVICE_TIME_SOON }
    let(:new_quote) { Quote.create(address: "address", email: "email@me.com", area: area, service_expedition_time: service_expedition_time, salt_bags_quantity: 1) }
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

    it "sets correct total" do
      area_subtotal = new_quote.area * new_quote.price_per_sq_ft
      salt_bag_subtotal = new_quote.salt_bags_quantity * new_quote.price_per_salt_bag
      expected_total = area_subtotal + new_quote.service_expedition_cost + salt_bag_subtotal
      expect(new_quote.total).to eq(expected_total)
    end

    context "when total is less than minimum charge" do  
      let(:area) { 1 }
      let(:service_expedition_time) { Quote::SERVICE_TIME_FREE }
      it "sets total to minimum charge" do
        expect(new_quote.total).to eq(new_quote.min_charge)
      end
    end
    
  end
end