Rails.application.routes.draw do
  get 'hello_world', to: 'hello_world#index'
  root 'quotes#new'
  resources :quotes, only: [:new, :create] 
  resources :leads, only: [:create]
end
