MyAquarium::Application.routes.draw do
  resources :aquaria

  root :to => 'aquaria#index'
end
