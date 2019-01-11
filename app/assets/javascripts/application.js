// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery3
//= require popper
//= require bootstrap
//= require rails-ujs
//= require activestorage
//= require_tree .

const constants = {
  // sets up map zoom close enough to see street details
  ZOOM: 15,
  // sets loading map centerd in Eagle Ridge area
  CENTER_MAP_LOCATION: {lat: 49.2860, lng: -122.8130},
  SQ_FT_CONVERT: 10.764,
  // price to be defined by Snow Queen
  PRICE_PER_SQ_FT: 0.15,
  // sets map boundaries to Port Moody and North Coquitlam
  DEFAULT_BOUNDARIES: {
    NORTH_EAST: [49.327512, -122.755847],
    SOUTH_WEST: [49.271039, -122.892113],
  }
}

function initMap() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadApp);
  } else {
    loadApp();
  }
}

function loadApp() {
  const quotingPanel = new QuotingPanel();
  new Map({
    onGeocodingResponse: quotingPanel.showAddress,
    onPolygonsChanged: quotingPanel.handlePolygonChanged,
  });
  new Quote({
    onOpen: quotingPanel.getData,
  });
}
