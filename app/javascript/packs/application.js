/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb
//= require 'dom'

import ShovelSquadMap from '../../assets/javascripts/map'
import Lead from '../../assets/javascripts/lead'

window.initMap = function() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadApp);
  } else {
    loadApp();
  }
}

window.loadApp = function () {
  new ShovelSquadMap();
  new Lead();
  $('#addressInput').focus(); //TODO not working
}