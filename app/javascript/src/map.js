import Dom from './dom'
import constants from './constants'
import 'whatwg-fetch'
import "@babel/polyfill"
import html2canvas from 'html2canvas'

class ShovelSquadMap {
  constructor(config) {
    this.map = this.initMap();
    this.drawingManager = this.initDrawingManager();
    this.removeLastControl = this.initRemoveControls('Click to remove selected area from the map','Remove last','removeLast');
    this.removeAllControl = this.initRemoveControls('Click to remove ALL selected areas from the map', 'Remove All', 'removeAll');
    this.geocoder = this.initGeocoder();
    this.autocomplete = this.initAutocomplete();
    this.marker = null;
    this.geocodedAddress = null;
    this.polygons = [];
    this.totalAreaInSqFt = null;

    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleGeocodingResponse = this.handleGeocodingResponse.bind(this);
    this.handlePolygonCreated = this.handlePolygonCreated.bind(this);
    this.handleRemoveLastPolygon = this.handleRemoveLastPolygon.bind(this);
    this.handleRemoveAllPolygons = this.handleRemoveAllPolygons.bind(this);
    this.printScreen = this.printScreen.bind(this);
    this.checkKey = this.checkKey.bind(this);
    this.addListeners();
  }

  initMap() {
    return new google.maps.Map(document.getElementById('map'), {
      zoom: constants.ZOOM,
      center: constants.CENTER_MAP_LOCATION,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      tilt:0,
      disableDefaultUI: true,
      zoomControl: true,
      rotateControl: true,
    });
  }

  initDrawingManager() {
    const drawingOptions = {
      fillColor: '#fabc09',
      fillOpacity: 0.6,
      strokeWeight: 4,
      strokeColor: '#fabc09',
      clickable: false,
      zIndex: 1,
      editable: true,
    }
    return new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['polygon']
      },
      map: this.map,
      polygonOptions: drawingOptions,
    })
  }

  initRemoveControls(title, label, id) {
    const removeControlDiv = document.createElement('button');
    removeControlDiv.classList.add('map-btn', 'btn-lg', 'btn-primary', 'm-1', 'font-weight-bold')
    removeControlDiv.title = title;
    removeControlDiv.innerHTML = label;
    removeControlDiv.id = id;

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
    // TODO execute search when autocomplete option has been selected doesnt work
    // autocomplete.addListener('place_changed', this.handleSearchSubmit);
  }

  addListeners() {
    document.getElementById('addressSearchBar').addEventListener('keyup', this.enableFindButton)
    document.getElementById('addressSearchBar').addEventListener('submit', this.handleSearchSubmit);
    this.drawingManager.addListener('polygoncomplete', this.handlePolygonCreated);
    this.removeLastControl.addEventListener('click', this.handleRemoveLastPolygon);
    this.removeAllControl.addEventListener('click', this.handleRemoveAllPolygons);
    document.getElementById('printScreen').addEventListener('click', this.printScreen);
    document.addEventListener('keydown', this.checkKey);
  }

  enableFindButton(){
    document.getElementById('addressSubmit').classList.remove('disabled');
    document.getElementById('addressSubmit').disabled = false;

  }

  handleSearchSubmit(event) {
    event.preventDefault();

    if (this.marker) { this.marker.setMap(null) }
    if (this.polygons.length > 0) {
      this.polygons.forEach(p => { p.setMap(null) });
      this.polygons = [];
      this.handlePolygonChanged(this.polygons);
    }
    let address = document.getElementById('addressInput').value;
    this.geocodeAddress(address);
  }

  handlePolygonChanged() {
    this.totalAreaInSqFt = this.convertToSqFt(this.aggregateAreaInMts());
    this.updateAreaOnSummary();
  }

  convertToSqFt(totalAreaInMts) {
    return totalAreaInMts * constants.SQ_FT_CONVERT;
  }

  aggregateAreaInMts() {
    let totalAreaInMts = 0;
    this.polygons.forEach((p) => {
      let areaInMts = google.maps.geometry.spherical.computeArea(p.getPath());
      totalAreaInMts += areaInMts;
    });
    return totalAreaInMts;
  }

  updateAreaOnSummary() {
    Dom.showNode(document.getElementById('summaryArea'))
    this.updateAmount('areaInSqFt', this.totalAreaInSqFt, 0)
  }

  updateAmount(id, amount, precision) {
    const node = document.getElementById(id);
    node.innerText = `${amount.toLocaleString(undefined, {maximumFractionDigits: precision})}`;
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
      this.updateAddressOnSummary(this.geocodedAddress);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  }

  updateAddressOnSummary(geocodedAddress) {
    if (geocodedAddress) {
      this.geocodedAddress = geocodedAddress;
      const primaryAddressNode = document.getElementById('primaryAddress');
      const secondaryAddressNode = document.getElementById('secondaryAddress');
      while (primaryAddressNode.firstChild) { primaryAddressNode.removeChild(primaryAddressNode.firstChild) }
      while (secondaryAddressNode.firstChild) { secondaryAddressNode.removeChild(secondaryAddressNode.firstChild) }

      let splitAddress = geocodedAddress.split(',');
      const div = document.createElement('div');
      let street = splitAddress.shift();
      div.innerText = street;
      div.classList.add('primary-address');
      primaryAddressNode.appendChild(div);

      splitAddress.forEach(element => {
        const div = document.createElement('div');
        const small = document.createElement('small');
        div.innerText = element;
        small.innerText = element;
        div.classList.add('secondary-address');
        small.classList.add('secondary-address');
        secondaryAddressNode.appendChild(div);
      });
    Dom.showNode(document.getElementById('summary'));
    Dom.showNode(document.getElementById('summaryAddress'));
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

  vertexToString(polygon) {
    let vertexArray = polygon.getPath().getArray();
    let coordArray =  vertexArray.map(vertex => {
      return [vertex.lat(), vertex.lng()].join(",");
    });
    let firstCoord = [vertexArray[0].lat(), vertexArray[0].lng()].join(",")
    coordArray.push(firstCoord);
    return coordArray.join("|");
  }

  checkKey(e) {
    switch (e.keyCode) {
      case 37:
        // left arrow
        this.map.panBy(-100,0);
        break;
      case 38:
        // up arrow
        this.map.panBy(0,-100);
        break;
      case 39:
        // right arrow
        this.map.panBy(100,0);
        break;
      case 40:
        // down arrow
        this.map.panBy(0,100);
        break;
      case 27:
        // ESC key
        let currentDrawingMode = this.drawingManager.getDrawingMode();
        if (currentDrawingMode == null) {
          this.drawingManager.setOptions ({
            drawingMode : 'polygon',
          })
        } else {
          this.drawingManager.setOptions ({
            drawingMode : null,
          })
        }
        break; 
      case 187:
        let currentZoom = this.map.getZoom();
        this.map.setZoom(currentZoom + 1);
        break;
      case 189:
        currentZoom = this.map.getZoom();
        this.map.setZoom(currentZoom - 1);
        break;
    }
  }
  
  printScreen(){
    let link = document.getElementById("printArea");
    // hide map buttons
    document.getElementById("removeLast").classList.add('hidden');
    document.getElementById("removeAll").classList.add('hidden');
    this.map.setOptions({ zoomControl: false });
    this.drawingManager.setOptions({ drawingControl: false });
    setTimeout(()=>{
      html2canvas(link, {useCORS:true, allowTaint: true, scale: 1} ).then((canvas) => {
        let newLink = document.createElement("a");
        let splitAddress = this.geocodedAddress.split(',');
        let street = splitAddress.shift().split(' ').join('_');
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        newLink.download = `${year}${month}${day}_${street}.jpg`;
        newLink.href = canvas.toDataURL("image/jpeg",0.8).replace(/^data:image\/[^;]/, 'data:application/octet-stream');
        newLink.click();
        // show map buttons
        document.getElementById("removeLast").classList.remove('hidden');
        document.getElementById("removeAll").classList.remove('hidden');
        this.map.setOptions({ zoomControl: true });
        this.drawingManager.setOptions({ drawingControl: true });
      }, 300);
    })
  }
  
  reloadPage() {
    location.reload();
  }

}

export default ShovelSquadMap;
