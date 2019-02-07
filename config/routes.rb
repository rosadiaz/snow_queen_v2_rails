Rails.application.routes.draw do
  get 'react', to: 'react#index'
  root 'quotes#new'
  resources :quotes, only: [:new, :create] 
  resources :leads, only: [:create]
end
