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
    this.subTotal = 0;
    this.grandTotal = 0;
    this.serviceExpeditionCost = 0; // needs improvement to start according to controller variables
    this.serviceExpeditionLabel = 'FREE in 24hrs';  // needs improvement to start according to controller variables
    this.serviceExpeditionTime = 'free'; // needs improvement to start according to controller variables
    this.saltBagsQuantity = 0;
    this.saltBagPrice = priceList.PRICE_PER_SALT_BAG;
    this.saltBagsDue = null;
    this.isCreditCardComplete = false;

    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleGeocodingResponse = this.handleGeocodingResponse.bind(this);
    this.handlePolygonCreated = this.handlePolygonCreated.bind(this);
    this.handleRemoveLastPolygon = this.handleRemoveLastPolygon.bind(this);
    this.handleRemoveAllPolygons = this.handleRemoveAllPolygons.bind(this);
    this.handleDoneSelecting = this.handleDoneSelecting.bind(this);
    this.handleExpeditionInfoClick = this.handleExpeditionInfoClick.bind(this);
    this.handleAddBagClick = this.handleAddBagClick.bind(this);
    this.handleRemoveBagClick = this.handleRemoveBagClick.bind(this);
    this.handleDoneAddOns = this.handleDoneAddOns.bind(this);
    this.onCreditCardInputChange = this.onCreditCardInputChange.bind(this);
    this.handlePaymentSubmit = this.handlePaymentSubmit.bind(this);
    this.handleTokenReceived = this.handleTokenReceived.bind(this);
    this.addListeners();
    this.updateGrandTotal();
    this.stripe = new ShovelSquadStripe({
      onCreditCardInputChange: this.onCreditCardInputChange,
    });
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
    document.getElementById('doneSelectingArea').addEventListener('click', this.handleDoneSelecting);
    document.getElementsByName("serviceExpeditionCost").forEach((element) => { 
      element.addEventListener('click', this.handleExpeditionInfoClick); 
    });
    document.getElementById("addBag").addEventListener('click', this.handleAddBagClick);
    document.getElementById("removeBag").addEventListener('click', this.handleRemoveBagClick);
    document.getElementById("doneAddOns").addEventListener('click', this.handleDoneAddOns);
    document.getElementById("quote_email").addEventListener('keyup', () => this.enableSubmitButton);
    document.getElementById("quote_phone_number").addEventListener('keyup', () => this.enableSubmitButton);
    document.getElementById('contact-info-form').addEventListener('submit', this.handlePaymentSubmit);
  }

  enableFindButton(){
    document.getElementById('addressSubmit').classList.remove('disabled');
  }
  
  handleSearchSubmit(event) {
    this.showNextSection('collapseFindAddress', 'collapseMap');
    
    if (this.marker) { this.marker.setMap(null) }
    if (this.polygons.length > 0) {
      this.polygons.forEach(p => { p.setMap(null) });
      this.polygons = [];
      this.handlePolygonChanged(this.polygons);
    }
    let address = document.getElementById('addressInput').value;
    this.geocodeAddress(address);
  }

  showNextSection(collapseNode, showNode) {
    event.preventDefault();
    document.getElementById(collapseNode).classList.remove('show');
    document.getElementById(showNode).classList.add('show');
  }

  handlePolygonChanged() {
    this.totalAreaInSqFt = this.convertToSqFt(this.aggregateAreaInMts());
    this.subTotal = this.calculateSubTotal();
    this.updateAreaOnSummary();
    this.updateGrandTotal();
    document.getElementById('doneSelectingArea').classList.remove('disabled');
    document.getElementById('areaSelectHint').classList.remove('hidden');

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

  calculateSubTotal() {
    return this.totalAreaInSqFt * priceList.PRICE_PER_SQ_FT;
  }

  updateAreaOnSummary() {
    Dom.showNode(document.getElementById('summaryArea'))
    this.updateAmount('areaInSqFt', this.totalAreaInSqFt, 0)
    this.updateAmount('subTotalDue', this.subTotal, 2)
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
      div.innerText = splitAddress.shift();
      div.classList.add('primary-address');
      primaryAddressNode.appendChild(div);
      splitAddress.forEach(element => {
        const div = document.createElement('div');
        div.innerText = element;
        div.classList.add('secondary-address');
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

  handleDoneSelecting() {
    this.showNextSection('collapseMap', 'collapseAddOns');
  }

  handleExpeditionInfoClick(event) {
    Dom.showNode(document.getElementById('summaryExpeditionOptions'));
    this.serviceExpeditionCost = Number.parseFloat(event.target.value);
    this.serviceExpeditionLabel = event.target.dataset.label;
    this.serviceExpeditionTime = event.target.id;
    document.getElementById('summaryServiceExpeditionTime').innerText = this.serviceExpeditionLabel
    this.updateAmount('serviceExpeditionDue', this.serviceExpeditionCost, 2)
    this.updateGrandTotal();
  }

  handleAddBagClick() {
    this.saltBagsQuantity += 1;
    this.updateSaltBagsTotals();
  }

  handleRemoveBagClick() {
    if (this.saltBagsQuantity > 0) {
      this.saltBagsQuantity -= 1;
      this.updateSaltBagsTotals();
    }
  }
  
  updateSaltBagsTotals() {
    this.saltBagsDue = this.saltBagsQuantity * this.saltBagPrice;
    this.updateTotalSaltBags();
    this.updateGrandTotal();
  }
  
  updateTotalSaltBags() {
    this.updateAmount('numberOfBags', this.saltBagsQuantity, 0);
    Dom.showNode(document.getElementById("summarySaltBags"));
    this.updateAmount('summaryNumberOfBags', this.saltBagsQuantity, 0);
    this.updateAmount('saltBagsDue', this.saltBagsDue, 2);
  }

  handleDoneAddOns() {
    this.showNextSection('collapseAddOns', 'collapseContactAndPaymentInfo');
  }

  updateGrandTotal() {
    let grandTotal = this.subTotal + this.serviceExpeditionCost + this.saltBagsDue;
    this.grandTotal = Math.max(grandTotal, priceList.MIN_CHARGE);
    if (this.grandTotal > priceList.MIN_CHARGE) {
      Dom.hideNode(document.getElementById('minChargeNote'))
    } else {
      Dom.showNode(document.getElementById('minChargeNote'))
    }
    this.updateAmount('totalDue', this.grandTotal, 2)
  }

  onCreditCardInputChange(cardInputIsComplete) {
    this.isCreditCardComplete = cardInputIsComplete;
    this.enableSubmitButton();
  }

  enableSubmitButton() {
    const requiredFieldsAreNotEmpty = ['quote_email', 'quote_phone_number'].every((id) => {
      return document.getElementById(id).value !== "";
    });

    if (requiredFieldsAreNotEmpty && this.isCreditCardComplete) {
      document.getElementById('submitPayment').classList.remove('disabled');
    }
  }

  handlePaymentSubmit(event) {
    event.preventDefault();
    
    this.stripe.getToken(this.handleTokenReceived)
// TODO disable button, change text to wait for payment
// TODO enable button if errors after payment
  }

  handleTokenReceived(token) {
    const form = document.getElementById('contact-info-form');
    const formData = new FormData(form);

    const postData = {
      quote: {
        email: formData.get("quote[email]"),
        phone_number: formData.get("quote[phone_number]"),
        first_name: formData.get("quote[first_name]"),
        last_name: formData.get("quote[last_name]"),
        comments: formData.get("quote[comments]"),
        address: this.geocodedAddress,
        area: this.totalAreaInSqFt,
        // polygons: this.polygons, TODO SEND ONLY LAT LNG ARRAY
        // static_map_URL: _____
        service_expedition_time: this.serviceExpeditionTime,
        salt_bags_quantity: this.saltBagsQuantity,
      },
      token_id: token.id,
    };

    fetch(form.action, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(postData)
    }).then( res => res.json()).then( data => {
      console.log("data", data);
      if (data.errors) {
        const errorNode = document.getElementById("contact_info_errors");
        Dom.showNode(errorNode);
        errorNode.innerText = data.errors.join(".\n");
      } else {

        // TODO show success modal with quote id --> data.id
        // TODO reload page when closing modal
      }
    })
  }

}
