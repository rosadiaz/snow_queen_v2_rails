ActiveAdmin.register Quote do
# See permitted parameters documentation:
# https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
#
# permit_params :list, :of, :attributes, :on, :model
#
# or
#
# permit_params do
#   permitted = [:permitted, :attributes]
#   permitted << :other if params[:action] == 'create' && current_user.admin?
#   permitted
# end
  filter :email
  filter :first_name
  filter :last_name
  filter :address
  filter :created_at
  filter :total

  index do
    selectable_column
    id_column
    column :email
    column :first_name
    column :last_name
    column :address
    column :created_at
    actions
  end


  show do
    attributes_table do
      row :email
      row :address
      row :area do |quote|
        number_with_precision(quote.area, precision: 0, delimiter: ",")  
      end
      row :total do |quote|
        number_to_currency(quote.total)
      end
      row :comments
      row :first_name
      row :last_name
      row :map do |quote|
        image_tag quote.static_map_URL
      end
    end
    active_admin_comments
  end

end
