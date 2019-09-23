import Dom from './dom'
// import ShovelSquadStripe from './stripe'
import constants from './constants'
import 'whatwg-fetch'
import "@babel/polyfill"

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
    // this.subTotal = 0;
    // this.grandTotal = 0;
    // this.serviceExpeditionCost = 0; // needs improvement to start according to controller variables
    // this.serviceExpeditionLabel = 'FREE in 24hrs';  // needs improvement to start according to controller variables
    // this.serviceExpeditionTime = 'free'; // needs improvement to start according to controller variables
    // this.saltBagsQuantity = 0;
    // this.saltBagPrice = priceList.PRICE_PER_SALT_BAG;
    // this.saltBagsDue = null;
    // this.discount = priceList.DISCOUNT;
    // this.isCreditCardComplete = false;

    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleGeocodingResponse = this.handleGeocodingResponse.bind(this);
    this.handlePolygonCreated = this.handlePolygonCreated.bind(this);
    this.handleRemoveLastPolygon = this.handleRemoveLastPolygon.bind(this);
    this.handleRemoveAllPolygons = this.handleRemoveAllPolygons.bind(this);
    // this.handleDoneSelecting = this.handleDoneSelecting.bind(this);
    // this.updateStaticMapOnSummary = this.updateStaticMapOnSummary.bind(this);
    // this.handleExpeditionInfoClick = this.handleExpeditionInfoClick.bind(this);
    // this.handleAddBagClick = this.handleAddBagClick.bind(this);
    // this.handleRemoveBagClick = this.handleRemoveBagClick.bind(this);
    // this.handleDoneAddOns = this.handleDoneAddOns.bind(this);
    // this.handleAcceptTermsChecked = this.handleAcceptTermsChecked.bind(this);
    // this.onCreditCardInputChange = this.onCreditCardInputChange.bind(this);
    // this.handlePaymentSubmit = this.handlePaymentSubmit.bind(this);
    // this.handleTokenReceived = this.handleTokenReceived.bind(this);
    this.addListeners();
    // this.updateGrandTotal();
    // this.stripe = new ShovelSquadStripe({
    //   onCreditCardInputChange: this.onCreditCardInputChange,
    // });
    // $(function () {
    //   $('[data-toggle="tooltip"]').tooltip()
    // })
  }

  initMap() {
    return new google.maps.Map(document.getElementById('map'), {
      zoom: constants.ZOOM,
      center: constants.CENTER_MAP_LOCATION,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      tilt:0,
      disableDefaultUI: true,
      zoomControl: true,
    });
  }

  initDrawingManager() {
    const drawingOptions = {
      fillColor: '#BD2226',
      fillOpacity: 0.3,
      strokeWeight: 5,
      strokeColor: '#BD2226',
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
    removeControlDiv.classList.add('map-btn', 'btn-lg', 'btn-success', 'm-1', 'font-weight-bold')
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
    // TODO execute search when autocomplete option has been selected doesnt work
    // autocomplete.addListener('place_changed', this.handleSearchSubmit);
  }

  addListeners() {
    document.getElementById('addressSearchBar').addEventListener('keyup', this.enableFindButton)
    document.getElementById('addressSearchBar').addEventListener('submit', this.handleSearchSubmit);
    this.drawingManager.addListener('polygoncomplete', this.handlePolygonCreated);
    this.removeLastControl.addEventListener('click', this.handleRemoveLastPolygon);
    this.removeAllControl.addEventListener('click', this.handleRemoveAllPolygons);
    // document.getElementById('doneSelectingArea').addEventListener('click', this.handleDoneSelecting);
    // Array.from(document.getElementsByName("serviceExpeditionCost")).forEach((element) => {
    //   element.addEventListener('click', this.handleExpeditionInfoClick);
    // });
    // document.getElementById("addBag").addEventListener('click', this.handleAddBagClick);
    // document.getElementById("removeBag").addEventListener('click', this.handleRemoveBagClick);
    // document.getElementById("doneAddOns").addEventListener('click', this.handleDoneAddOns);
    // document.getElementById("quote_email").addEventListener('keyup', () => this.enableSubmitButton);
    // document.getElementById("quote_phone_number").addEventListener('keyup', () => this.enableSubmitButton);
    // document.getElementById('acceptTerms').addEventListener('click', this.handleAcceptTermsModal);
    // document.getElementById('quote_accept_terms').addEventListener('change', this.handleAcceptTermsChecked);
    // document.getElementById('contact-info-form').addEventListener('submit', this.handlePaymentSubmit);
    // document.getElementById('closeSuccess').addEventListener('click', this.reloadPage);
  }

  enableFindButton(){
    document.getElementById('addressSubmit').classList.remove('disabled');
    document.getElementById('addressSubmit').disabled = false;

  }

  handleSearchSubmit(event) {
    event.preventDefault();
    // this.showNextSection('collapseFindAddress', 'collapseMap');
    // document.getElementById('checkMarkAddress').classList.remove('hidden');

    if (this.marker) { this.marker.setMap(null) }
    if (this.polygons.length > 0) {
      this.polygons.forEach(p => { p.setMap(null) });
      this.polygons = [];
      this.handlePolygonChanged(this.polygons);
    }
    let address = document.getElementById('addressInput').value;
    this.geocodeAddress(address);
  }

  // showNextSection(collapseNode, showNode) {
  //   document.getElementById(collapseNode).classList.remove('show');
  //   document.getElementById(showNode).classList.add('show');
  // }

  handlePolygonChanged() {
    this.totalAreaInSqFt = this.convertToSqFt(this.aggregateAreaInMts());
    // this.subTotal = this.calculateSubTotal();
    this.updateAreaOnSummary();
    // this.updateGrandTotal();
    // if (this.totalAreaInSqFt <= 0) {
    //   document.getElementById('checkMarkArea').classList.add('hidden');
    //   document.getElementById('doneSelectingArea').classList.add('disabled');
    //   document.getElementById('doneSelectingArea').disabled = true;
    //   document.getElementById('submitPayment').classList.add('disabled');
    //   document.getElementById('submitPayment').disabled = true;
    // } else {
    //   document.getElementById('checkMarkArea').classList.remove('hidden');
    //   document.getElementById('doneSelectingArea').classList.remove('disabled');
    //   document.getElementById('doneSelectingArea').disabled = false;
    // }
    // document.getElementById('areaSelectHint').classList.remove('hidden');
    // this.enableSubmitButton();
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

  // calculateSubTotal() {
  //   return this.totalAreaInSqFt * priceList.PRICE_PER_SQ_FT;
  // }

  updateAreaOnSummary() {
    Dom.showNode(document.getElementById('summaryArea'))
    // Dom.showNode(document.getElementById('summaryAreaMobile'))
    this.updateAmount('areaInSqFt', this.totalAreaInSqFt, 0)
    // this.updateAmount('areaInSqFtMobile', this.totalAreaInSqFt, 0)
    // this.updateAmount('subTotalDue', this.subTotal, 2)
    // this.updateAmount('subTotalDueMobile', this.subTotal, 2)
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
      // const primaryAddressMobileNode = document.getElementById('primaryAddressMobile');
      const secondaryAddressNode = document.getElementById('secondaryAddress');
      // const secondaryAddressMobileNode = document.getElementById('secondaryAddressMobile');
      while (primaryAddressNode.firstChild) { primaryAddressNode.removeChild(primaryAddressNode.firstChild) }
      // while (primaryAddressMobileNode.firstChild) { primaryAddressMobileNode.removeChild(primaryAddressMobileNode.firstChild) }
      while (secondaryAddressNode.firstChild) { secondaryAddressNode.removeChild(secondaryAddressNode.firstChild) }
      // while (secondaryAddressMobileNode.firstChild) { secondaryAddressMobileNode.removeChild(secondaryAddressMobileNode.firstChild) }

      let splitAddress = geocodedAddress.split(',');
      const div = document.createElement('div');
      let street = splitAddress.shift();
      div.innerText = street;
      // primaryAddressMobileNode.innerText = street;
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
        // secondaryAddressMobileNode.appendChild(small);
        // secondaryAddressMobileNode.appendChild(document.createElement('br'));
      });
    Dom.showNode(document.getElementById('summary'));
    Dom.showNode(document.getElementById('summaryAddress'));
    // Dom.showNode(document.getElementById('footerAddress'));
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

  // handleDoneSelecting() {
  //   this.showNextSection('collapseMap', 'collapseAddOns');
  //   this.updateStaticMapOnSummary(this.polygons);
  // }

  // updateStaticMapOnSummary(polygons) {
  //   const APIkey = document.getElementById("map").getAttribute("data-api-key");
  //   const polygons_string = polygons.map(p => {
  //     let coordString = this.vertexToString(p);
  //     return mapOptions.POLYGON_OPTIONS + coordString;
  //   }).join('&');

  //   const staticMapURL = `${mapOptions.BASE_URL}${polygons_string}&zoom=${mapOptions.ZOOM}&size=${mapOptions.SIZE}&maptype=${mapOptions.MAP_TYPE}&key=${APIkey}`
  //   document.getElementById("staticMap").setAttribute("src", staticMapURL)
  //   document.getElementById("staticMapMobile").setAttribute("src", staticMapURL)
  //   document.getElementById("staticMap").classList.remove("hidden");
  //   document.getElementById("staticMapMobile").classList.remove("hidden");
  // }

  vertexToString(polygon) {
    let vertexArray = polygon.getPath().getArray();
    let coordArray =  vertexArray.map(vertex => {
      return [vertex.lat(), vertex.lng()].join(",");
    });
    let firstCoord = [vertexArray[0].lat(), vertexArray[0].lng()].join(",")
    coordArray.push(firstCoord);
    return coordArray.join("|");
  }

  // handleExpeditionInfoClick(event) {
  //   Dom.showNode(document.getElementById('summaryExpeditionOptions'));
  //   Dom.showNode(document.getElementById('summaryExpeditionOptionsMobile'));
  //   this.serviceExpeditionCost = Number.parseFloat(event.target.value);
  //   this.serviceExpeditionLabel = event.target.dataset.label;
  //   this.serviceExpeditionTime = event.target.id;
  //   document.getElementById('summaryServiceExpeditionTime').innerText = this.serviceExpeditionLabel;
  //   document.getElementById('summaryServiceExpeditionTimeMobile').innerText = this.serviceExpeditionLabel;
  //   this.updateAmount('serviceExpeditionDue', this.serviceExpeditionCost, 2);
  //   this.updateAmount('serviceExpeditionDueMobile', this.serviceExpeditionCost, 2);
  //   this.updateGrandTotal();
  // }

  // handleAddBagClick() {
  //   this.saltBagsQuantity += 1;
  //   this.updateSaltBagsTotals();
  // }

  // handleRemoveBagClick() {
  //   if (this.saltBagsQuantity > 0) {
  //     this.saltBagsQuantity -= 1;
  //     this.updateSaltBagsTotals();
  //   }
  // }

  // updateSaltBagsTotals() {
  //   this.saltBagsDue = this.saltBagsQuantity * this.saltBagPrice;
  //   this.updateTotalSaltBags();
  //   this.updateGrandTotal();
  // }

  // updateTotalSaltBags() {
  //   this.updateAmount('numberOfBags', this.saltBagsQuantity, 0);
  //   this.updateAmount('summaryNumberOfBags', this.saltBagsQuantity, 0);
  //   document.getElementById('summarySaltBagsMobile').innerText = this.saltBagsQuantity + " additional de-icer bags";
  //   this.updateAmount('saltBagsDue', this.saltBagsDue, 2);
  //   this.updateAmount('saltBagsDueMobile', this.saltBagsDue, 2);
  //   Dom.showNode(document.getElementById("summarySaltBags"));
  //   Dom.showNode(document.getElementById("summarySaltBagsMobileOptions"));
  // }

  // handleDoneAddOns() {
  //   this.showNextSection('collapseAddOns', 'collapseContactAndPaymentInfo');
  //   document.getElementById('checkMarkAddOns').classList.remove('hidden');

  // }

  // updateGrandTotal() {
  //   let grandTotalBeforeDiscount = this.subTotal + this.serviceExpeditionCost + this.saltBagsDue;
  //   this.updateDiscount(grandTotalBeforeDiscount);
  //   this.grandTotal = Math.max(grandTotalBeforeDiscount, priceList.MIN_CHARGE) * this.discount;
  //   if (this.grandTotal > (priceList.MIN_CHARGE * this.discount)) {
  //     Dom.hideNode(document.getElementById('minChargeNote'));
  //     Dom.hideNode(document.getElementById('minChargeNoteMobile'));
  //   } else {
  //     Dom.showNode(document.getElementById('minChargeNote'));
  //     Dom.showNode(document.getElementById('minChargeNoteMobile'));
  //   }
  //   this.updateAmount('totalDue', this.grandTotal, 2)
  //   this.updateAmount('totalDueMobile', this.grandTotal, 2)
  // }

  // updateDiscount(grandTotalBeforeDiscount) {
  //   this.updateAmount('summaryDiscountAmount', this.discount * 100, 0)
  //   this.updateAmount('totalDiscount', grandTotalBeforeDiscount * (- this.discount), 2)
  // }

  // handleAcceptTermsChecked() {
  //   if (document.getElementById('quote_accept_terms').checked) {
  //     this.enableSubmitButton();
  //   } else {
  //     document.getElementById('submitPayment').classList.add('disabled');
  //     document.getElementById('submitPayment').disabled = false;;
  //   }
  // }

  // handleAcceptTermsModal() {
  //   document.getElementById('quote_accept_terms').checked = true;

  // }

  // onCreditCardInputChange(cardInputIsComplete) {
  //   this.isCreditCardComplete = cardInputIsComplete;
  //   this.enableSubmitButton();
  //   Dom.hideNode(document.getElementById("contact_info_errors"))
  // }

  // enableSubmitButton() {
  //   const requiredFieldsAreNotEmpty = ['quote_email', 'quote_phone_number'].every((id) => {
  //     return document.getElementById(id).value !== "";
  //   });

  //   const isTermsTrue = document.getElementById('quote_accept_terms').checked;

  //   if (requiredFieldsAreNotEmpty && this.isCreditCardComplete && isTermsTrue && this.totalAreaInSqFt > 0) {
  //     const submitPaymentButton = document.getElementById('submitPayment')
  //     submitPaymentButton.classList.remove('disabled');
  //     submitPaymentButton.disabled = false;
  //   }
  // }

  // handlePaymentSubmit(event) {
  //   event.preventDefault();
  //   document.getElementById('submitPayment').classList.add('disabled');
  //   document.getElementById('submitPayment').disabled = true;
  //   this.stripe.getToken(this.handleTokenReceived);
  // }

  // handleTokenReceived(token) {
  //   const form = document.getElementById('contact-info-form');
  //   const formData = new FormData(form);
  //   const coordinates = this.polygons.map(p => {
  //     return p.getPath().getArray().map(vertex => { return vertex.toJSON() })
  //   });

  //   const postData = {
  //     quote: {
  //       email: document.getElementsByName("quote[email]")[0].value,
  //       phone_number: document.getElementsByName("quote[phone_number]")[0].value,
  //       first_name: document.getElementsByName("quote[first_name]")[0].value,
  //       last_name: document.getElementsByName("quote[last_name]")[0].value,
  //       comments: document.getElementsByName("quote[comments]")[0].value,
  //       terms: document.getElementsByName("quote[terms]")[0].checked,
  //       address: this.geocodedAddress,
  //       area: this.totalAreaInSqFt,
  //       polygons_coordinates: JSON.stringify(coordinates),
  //       service_expedition_time: this.serviceExpeditionTime,
  //       salt_bags_quantity: this.saltBagsQuantity,
  //     },
  //     token_id: token.id,
  //   };

  //   fetch(form.action, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       'X-CSRF-Token': Rails.csrfToken(),
  //     },
  //     body: JSON.stringify(postData)
  //   }).then( res => res.json()).then( data => {
  //     if (data.errors) {
  //       const errorNode = document.getElementById("contact_info_errors");
  //       Dom.showNode(errorNode);
  //       errorNode.innerText = data.errors.join(".\n");
  //     } else {
  //       $('#collapseContactAndPaymentInfo').collapse('toggle');
  //       document.getElementById('checkMarkPayment').classList.remove('hidden');
  //       $("#successModal").modal("show");
  //     }
  //   }).catch(() => { $("#serverErrorModal").modal("show")}); // TODO: modal displaying error 
  // }

  reloadPage() {
    location.reload();
  }

}

export default ShovelSquadMap;
