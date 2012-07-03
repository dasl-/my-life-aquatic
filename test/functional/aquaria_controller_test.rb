require 'test_helper'

class AquariaControllerTest < ActionController::TestCase
  setup do
    @aquarium = aquaria(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:aquaria)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create aquarium" do
    assert_difference('Aquarium.count') do
      post :create, aquarium: { name: @aquarium.name }
    end

    assert_redirected_to aquarium_path(assigns(:aquarium))
  end

  test "should show aquarium" do
    get :show, id: @aquarium
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @aquarium
    assert_response :success
  end

  test "should update aquarium" do
    put :update, id: @aquarium, aquarium: { name: @aquarium.name }
    assert_redirected_to aquarium_path(assigns(:aquarium))
  end

  test "should destroy aquarium" do
    assert_difference('Aquarium.count', -1) do
      delete :destroy, id: @aquarium
    end

    assert_redirected_to aquaria_path
  end
end
