class ShovelSquadMap {
  constructor(config) {
    this.map = this.initMap();
    this.drawingManager = this.initDrawingManager();
    this.removeLastControl = this.initRemoveControls('Click to remove selected area from the map','Remove last');
    this.removeAllControl = this.initRemoveControls('Click to remove ALL selected areas from the map', 'Remove All');
    this.geocoder = this.initGeocoder();
    this.autocomplete = this.initAutocomplete();
    this.marker = null;
    this.geocodedAddress = null;
    this.polygons = [];
    this.totalAreaInSqFt = null;
    // this.onGeocodingResponse = config.onGeocodingResponse;
    // this.onPolygonsChanged = config.onPolygonsChanged;

    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleGeocodingResponse = this.handleGeocodingResponse.bind(this);
    this.handlePolygonCreated = this.handlePolygonCreated.bind(this);
    this.handleRemoveLastPolygon = this.handleRemoveLastPolygon.bind(this);
    this.handleRemoveAllPolygons = this.handleRemoveAllPolygons.bind(this);
    this.handlePolygonChanged = this.handlePolygonChanged.bind(this);
    this.addListeners();
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
  
  initRemoveControls(title, label) {
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

  initAutocomplete(){
    const defaultBoundaries = new google.maps.LatLngBounds(
      new google.maps.LatLng(...constants.DEFAULT_BOUNDARIES.SOUTH_WEST),
      new google.maps.LatLng(...constants.DEFAULT_BOUNDARIES.NORTH_EAST),
    );
    const options= {
      bounds: defaultBoundaries,
      types: ['address'],
      componentRestrictions: {country: 'ca'}
    };

    const input = document.getElementById('addressInput');
    const autocomplete = new google.maps.places.Autocomplete(input, options);
  }

  addListeners() {
    document.getElementById('addressSearchBar').addEventListener('keyup', this.enableFindButton)
    document.getElementById('addressSearchBar').addEventListener('submit', this.handleSearchSubmit);
    this.drawingManager.addListener('polygoncomplete', this.handlePolygonCreated);
    this.removeLastControl.addEventListener('click', this.handleRemoveLastPolygon);
    this.removeAllControl.addEventListener('click', this.handleRemoveAllPolygons);
  }

  enableFindButton(){
    document.getElementById('addressSubmit').classList.remove('disabled');
  }
  
  handleSearchSubmit(event) {
    event.preventDefault();
    document.getElementById('collapseFindAddress').classList.remove('show');
    document.getElementById('collapseMap').classList.add('show');
    
    if (this.marker) { this.marker.setMap(null) }
    if (this.polygons.length > 0) {
      this.polygons.forEach(p => { p.setMap(null) });
      this.polygons = [];
      this.handlePolygonChanged(this.polygons);
    }
    let address = document.getElementById('addressInput').value;
    this.geocodeAddress(address);
  }

  geocodeAddress(address) {
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
      // this.onGeocodingResponse(this.geocodedAddress);
      this.updateAddressOnSummary(this.geocodedAddress);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  }

  updateAddressOnSummary(geocodedAddress) {
    if (geocodedAddress) {
      this.geocodedAddress = geocodedAddress;
      const primaryAddressNode = document.getElementById("primaryAddress");
      const secondaryAddressNode = document.getElementById("secondaryAddress");
      while (primaryAddressNode.firstChild) { primaryAddressNode.removeChild(primaryAddressNode.firstChild) }
      while (secondaryAddressNode.firstChild) { secondaryAddressNode.removeChild(secondaryAddressNode.firstChild) }
      
      let splitAddress = geocodedAddress.split(",");
      const div = document.createElement("div");
      div.innerText = splitAddress.shift();
      div.classList.add("primary-address");
      primaryAddressNode.appendChild(div);
      splitAddress.forEach(element => {
        const div = document.createElement("div");
        div.innerText = element;
        div.classList.add("secondary-address");
        secondaryAddressNode.appendChild(div);
      });
    Dom.showNode(document.getElementById("summary"));
    Dom.showNode(document.getElementById("summaryAddress"));
    }
  }

  handlePolygonCreated(polygon){
    this.polygons.push(polygon)
    this.handlePolygonChanged();
  }

  handleRemoveLastPolygon() {
    this.polygons.pop().setMap(null);
    this.handlePolygonChanged(this.polygons);
  }

  handleRemoveAllPolygons() {
    this.polygons.forEach(p => p.setMap(null));
    this.polygons = [];
    this.handlePolygonChanged(this.polygons);
  }

  handlePolygonChanged() {
    // this.polygons = polygons;
    this.totalAreaInSqFt = this.convertToSqFt(this.aggregateAreaInMts());
    console.log("this.totalAreaInSqFt: ", this.totalAreaInSqFt);
    // this.updateAreaNode();
    // this.subTotal = this.calculateSubTotal();
    // this.updateSubTotalNode();
    // this.showTotalsNode();
    // this.updateGrandTotal();
    // Dom.showNode(document.getElementById("displayServiceExpedition"));
    // Dom.showNode(document.getElementById("grandTotal"));
  }

  aggregateAreaInMts() {
    let totalAreaInMts = 0;
    this.polygons.forEach((p) => { 
      let areaInMts = google.maps.geometry.spherical.computeArea(p.getPath());
      totalAreaInMts += areaInMts;
    });
    return totalAreaInMts;
  }

  convertToSqFt(totalAreaInMts) {
    return totalAreaInMts * constants.SQ_FT_CONVERT;
  }

  }
}
