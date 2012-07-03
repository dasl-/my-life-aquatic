class AquariaController < ApplicationController
  # GET /aquaria
  # GET /aquaria.json
  def index
    @aquaria = Aquarium.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @aquaria }
    end
  end

  # GET /aquaria/1
  # GET /aquaria/1.json
  def show
    @aquarium = Aquarium.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @aquarium }
    end
  end

  # GET /aquaria/new
  # GET /aquaria/new.json
  def new
    @aquarium = Aquarium.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @aquarium }
    end
  end

  # GET /aquaria/1/edit
  def edit
    @aquarium = Aquarium.find(params[:id])
  end

  # POST /aquaria
  # POST /aquaria.json
  def create
    @aquarium = Aquarium.new(params[:aquarium])

    respond_to do |format|
      if @aquarium.save
        format.html { redirect_to @aquarium, notice: 'Aquarium was successfully created.' }
        format.json { render json: @aquarium, status: :created, location: @aquarium }
      else
        format.html { render action: "new" }
        format.json { render json: @aquarium.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /aquaria/1
  # PUT /aquaria/1.json
  def update
    @aquarium = Aquarium.find(params[:id])

    respond_to do |format|
      if @aquarium.update_attributes(params[:aquarium])
        format.html { redirect_to @aquarium, notice: 'Aquarium was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @aquarium.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /aquaria/1
  # DELETE /aquaria/1.json
  def destroy
    @aquarium = Aquarium.find(params[:id])
    @aquarium.destroy

    respond_to do |format|
      format.html { redirect_to aquaria_url }
      format.json { head :no_content }
    end
  end
end
