class CreateAquaria < ActiveRecord::Migration
  def change
    create_table :aquaria do |t|
      t.string :name

      t.timestamps
    end
  end
end
