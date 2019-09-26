/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

import ShovelSquadMap from '../src/map'
import html2canvas from 'html2canvas';
import Lead from '../src/lead'

window.initMap = function() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadApp);
  } else {
    loadApp();
  }
}

window.loadApp = function () {
  new ShovelSquadMap();
  $('#addressInput').focus();
  let link = document.getElementById("printScreen");
  link.addEventListener("click", function(event){
    // hide map buttons
    //instead of 👇document.body make container for only map and summary 
    html2canvas(document.body, {useCORS:true, allowTaint: true, scale: 1} ).then(function(canvas) {
      let newLink = document.createElement("a")
      newLink.download = "image.jpg"; //change file name to address??
      newLink.href = canvas.toDataURL("image/jpeg",0.8).replace(/^data:image\/[^;]/, 'data:application/octet-stream');
      newLink.click();
      //turn on map buttons
    });
  });
}
