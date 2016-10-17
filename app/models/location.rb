# == Schema Information
#
# Table name: locations
#
#  id         :integer          not null, primary key
#  number     :string           not null
#  street     :string           not null
#  city       :string           not null
#  country    :string           not null
#  addr_name  :string
#  apt_number :string
#  state      :string
#  zip        :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Location < ActiveRecord::Base
  has_many :requests
  belongs_to :business
end
