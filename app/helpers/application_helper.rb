module ApplicationHelper
  def render_pusher_key
  	if Rails.env.production?
  	  return "'e82f5cd951da24bf59a4'"
  	else
      return "'14bbe7d2ac1504c5683f'"
    end
  end
end
