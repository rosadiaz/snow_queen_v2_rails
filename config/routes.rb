Rails.application.routes.draw do
  devise_for :users
  root 'quotes#new'
  resources :quotes, only: [:new, :create] 
end
