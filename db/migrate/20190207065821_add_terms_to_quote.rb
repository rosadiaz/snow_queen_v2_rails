class AddTermsToQuote < ActiveRecord::Migration[5.2]
  def change
    add_column :quotes, :terms, :boolean
  end
end
