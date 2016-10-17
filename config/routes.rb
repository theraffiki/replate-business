Rails.application.routes.draw do
  devise_for :businesses
  devise_for :admins
  get 'styles' => 'pages#style'
end
