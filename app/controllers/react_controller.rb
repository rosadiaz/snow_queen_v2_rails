class ReactController < ApplicationController
  layout "react_layout"

  def index
    @react_props = { name: "Jef & Rosa - this came from the rails controller" }
  end
end
