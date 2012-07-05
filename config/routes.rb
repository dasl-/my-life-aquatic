MyAquarium::Application.routes.draw do
  resources :aquaria

  root :to => 'aquaria#index'

  match "/pusher/auth" => 'pusher#auth'
end
