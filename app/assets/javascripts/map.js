class Map {
  constructor(config) {
    this.map = this.initMap();
    this.drawingManager = this.initDrawingManager();
    this.removeLastControl = this.initRemoveLastControls('Click to remove selected area from the map','Remove last');
    this.removeAllControl = this.initRemoveLastControls('Click to remove ALL selected areas from the map', 'Remove All');
    this.geocoder = this.initGeocoder();
    this.marker = null;
    this.geocodedAddress = null;
    this.polygons = [];
    this.onGeocodingResponse = config.onGeocodingResponse;
    this.onPolygonsChanged = config.onPolygonsChanged;

    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleGeocodingResponse = this.handleGeocodingResponse.bind(this);
    this.handlePolygonCreated = this.handlePolygonCreated.bind(this);
    this.handleRemoveLastPolygon = this.handleRemoveLastPolygon.bind(this);
    this.handleRemoveAllPolygons = this.handleRemoveAllPolygons.bind(this);
    this.addListeners();
    this.showAddressModal();
  }

  
  initMap() {
    return new google.maps.Map(document.getElementById('map'), {
      zoom: constants.ZOOM,
      center: constants.CENTER_MAP_LOCATION,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      tilt:0
    });
  }
  
  initDrawingManager() {
    const drawingOptions = {
      fillColor: '#2DC1D6',
      fillOpacity: 0.3,
      strokeWeight: 5,
      strokeColor: '#2DC1D6',
      clickable: false,
      zIndex: 1
    }
    return new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['polygon']
      },
      map: this.map,
      polygonOptions: drawingOptions,
      rectangleOptions: drawingOptions
    })
  }
  
  initRemoveLastControls(title, label) {
    const removeControlDiv = document.createElement('button');
    removeControlDiv.classList.add('map-btn')
    removeControlDiv.title = title;
    removeControlDiv.innerHTML = label;

    removeControlDiv.index = 1;
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(removeControlDiv);

    return removeControlDiv;
  }

  initGeocoder() {
    return new google.maps.Geocoder();
  }

  addListeners() {
    document.getElementById('AddressSearchModal').addEventListener('submit', this.handleSearchSubmit);
    this.drawingManager.addListener('polygoncomplete', this.handlePolygonCreated);
    this.removeLastControl.addEventListener('click', this.handleRemoveLastPolygon);
    this.removeAllControl.addEventListener('click', this.handleRemoveAllPolygons);
  }

  showAddressModal(){
    const addressSubmitModal = $('#addressSubmitModal')
    addressSubmitModal.modal('show');
    addressSubmitModal.keyup(function() {
      $('input[type=submit]').removeAttr('disabled').removeClass('disabled');
    });
  }
  
  handleSearchSubmit(event) {
    event.preventDefault();
    $('#addressSubmitModal').modal('hide')
    if (this.marker) { this.marker.setMap(null) }
    if (this.polygons.length > 0) {
      this.polygons.forEach(p => { p.setMap(null) });
      this.polygons = [];
      this.onPolygonsChanged(this.polygons);
    }
    this.geocodeAddress();
  }

  geocodeAddress() {
    let address = document.getElementById('address').value;
    this.geocoder.geocode({'address': address, 'region': 'CA'}, this.handleGeocodingResponse);
  }

  handleGeocodingResponse(results, status) {
    if (status === 'OK') {
      this.map.panTo(results[0].geometry.location);
      this.map.setZoom(20);
      this.marker = new google.maps.Marker({
        map: this.map,
        position: results[0].geometry.location
      });
      this.geocodedAddress = results[0].formatted_address;
      this.onGeocodingResponse(this.geocodedAddress);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  }

  handlePolygonCreated(polygon){
    this.polygons.push(polygon)
    this.onPolygonsChanged(this.polygons);
  }

  handleRemoveLastPolygon() {
    this.polygons.pop().setMap(null);
    this.onPolygonsChanged(this.polygons);
  }

  handleRemoveAllPolygons() {
    this.polygons.forEach(p => { p.setMap(null) });
    this.polygons = [];
    this.onPolygonsChanged(this.polygons);
  }
}
