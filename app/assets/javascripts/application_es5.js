"use strict";

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
var constants = {
  // sets up map zoom close enough to see street details
  ZOOM: 15,
  // sets loading map centerd in Eagle Ridge area
  CENTER_MAP_LOCATION: {
    lat: 49.2860,
    lng: -122.8130
  },
  SQ_FT_CONVERT: 10.764,
  // sets map boundaries to Port Moody and North Coquitlam
  DEFAULT_BOUNDARIES: {
    NORTH_EAST: [49.327512, -122.755847],
    SOUTH_WEST: [49.271039, -122.892113]
  }
};

function initMap() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadApp);
  } else {
    loadApp();
  }
}

function loadApp() {
  new ShovelSquadMap();
  new Lead();
  $('#addressInput').focus(); //TODO not working
}

;
var Dom = {
  showNode: function showNode(node) {
    node.classList.remove("hidden");
  },
  hideNode: function hideNode(node) {
    node.classList.add("hidden");
  }
};

var Lead =
/*#__PURE__*/
function () {
  function Lead() {
    _classCallCheck(this, Lead);

    this.addListeners();
  }

  _createClass(Lead, [{
    key: "addListeners",
    value: function addListeners() {
      var leadFormNode = document.getElementById("new_lead");
      leadFormNode.addEventListener("ajax:error", this.handleErrors);
      leadFormNode.addEventListener("ajax:success", this.handleSuccess);
    }
  }, {
    key: "handleErrors",
    value: function handleErrors(event) {
      this.errors = event.detail[0].errors;
      var errorNode = document.getElementById("lead_errors");
      Dom.showNode(errorNode);
      errorNode.innerText = this.errors.join(".\n");
    }
  }, {
    key: "handleSuccess",
    value: function handleSuccess(event) {
      $('#collapseLead').collapse('toggle');
      $("#successModal").modal("show");
    }
  }]);

  return Lead;
}();

;

var ShovelSquadMap =
/*#__PURE__*/
function () {
  function ShovelSquadMap(config) {
    _classCallCheck(this, ShovelSquadMap);

    this.map = this.initMap();
    this.drawingManager = this.initDrawingManager();
    this.removeLastControl = this.initRemoveControls('Click to remove selected area from the map', 'Remove last');
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

    this.serviceExpeditionLabel = 'FREE in 24hrs'; // needs improvement to start according to controller variables

    this.serviceExpeditionTime = 'free'; // needs improvement to start according to controller variables

    this.saltBagsQuantity = 0;
    this.saltBagPrice = priceList.PRICE_PER_SALT_BAG;
    this.saltBagsDue = null;
    this.discount = priceList.DISCOUNT;
    this.isCreditCardComplete = false;
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleGeocodingResponse = this.handleGeocodingResponse.bind(this);
    this.handlePolygonCreated = this.handlePolygonCreated.bind(this);
    this.handleRemoveLastPolygon = this.handleRemoveLastPolygon.bind(this);
    this.handleRemoveAllPolygons = this.handleRemoveAllPolygons.bind(this);
    this.handleDoneSelecting = this.handleDoneSelecting.bind(this);
    this.updateStaticMapOnSummary = this.updateStaticMapOnSummary.bind(this);
    this.handleExpeditionInfoClick = this.handleExpeditionInfoClick.bind(this);
    this.handleAddBagClick = this.handleAddBagClick.bind(this);
    this.handleRemoveBagClick = this.handleRemoveBagClick.bind(this);
    this.handleDoneAddOns = this.handleDoneAddOns.bind(this);
    this.handleAcceptTermsChecked = this.handleAcceptTermsChecked.bind(this);
    this.onCreditCardInputChange = this.onCreditCardInputChange.bind(this);
    this.handlePaymentSubmit = this.handlePaymentSubmit.bind(this);
    this.handleTokenReceived = this.handleTokenReceived.bind(this);
    this.addListeners();
    this.updateGrandTotal();
    this.stripe = new ShovelSquadStripe({
      onCreditCardInputChange: this.onCreditCardInputChange
    });
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }

  _createClass(ShovelSquadMap, [{
    key: "initMap",
    value: function initMap() {
      return new google.maps.Map(document.getElementById('map'), {
        zoom: constants.ZOOM,
        center: constants.CENTER_MAP_LOCATION,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        tilt: 0
      });
    }
  }, {
    key: "initDrawingManager",
    value: function initDrawingManager() {
      var drawingOptions = {
        fillColor: '#BD2226',
        fillOpacity: 0.3,
        strokeWeight: 5,
        strokeColor: '#BD2226',
        clickable: false,
        zIndex: 1
      };
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
      });
    }
  }, {
    key: "initRemoveControls",
    value: function initRemoveControls(title, label) {
      var removeControlDiv = document.createElement('button');
      removeControlDiv.classList.add('map-btn', 'btn-lg', 'btn-success', 'm-1', 'font-weight-bold');
      removeControlDiv.title = title;
      removeControlDiv.innerHTML = label;
      removeControlDiv.index = 1;
      this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(removeControlDiv);
      return removeControlDiv;
    }
  }, {
    key: "initGeocoder",
    value: function initGeocoder() {
      return new google.maps.Geocoder();
    }
  }, {
    key: "initAutocomplete",
    value: function initAutocomplete() {
      var defaultBoundaries = new google.maps.LatLngBounds(_construct(google.maps.LatLng, _toConsumableArray(constants.DEFAULT_BOUNDARIES.SOUTH_WEST)), _construct(google.maps.LatLng, _toConsumableArray(constants.DEFAULT_BOUNDARIES.NORTH_EAST)));
      var options = {
        bounds: defaultBoundaries,
        types: ['address'],
        componentRestrictions: {
          country: 'ca'
        }
      };
      var input = document.getElementById('addressInput');
      var autocomplete = new google.maps.places.Autocomplete(input, options); // TODO execute search when autocomplete option has been selected doesnt work
      // autocomplete.addListener('place_changed', this.handleSearchSubmit);
    }
  }, {
    key: "addListeners",
    value: function addListeners() {
      var _this = this;

      document.getElementById('addressSearchBar').addEventListener('keyup', this.enableFindButton);
      document.getElementById('addressSearchBar').addEventListener('submit', this.handleSearchSubmit);
      this.drawingManager.addListener('polygoncomplete', this.handlePolygonCreated);
      this.removeLastControl.addEventListener('click', this.handleRemoveLastPolygon);
      this.removeAllControl.addEventListener('click', this.handleRemoveAllPolygons);
      document.getElementById('doneSelectingArea').addEventListener('click', this.handleDoneSelecting);
      Array.from(document.getElementsByName("serviceExpeditionCost")).forEach(function (element) {
        element.addEventListener('click', _this.handleExpeditionInfoClick);
      });
      document.getElementById("addBag").addEventListener('click', this.handleAddBagClick);
      document.getElementById("removeBag").addEventListener('click', this.handleRemoveBagClick);
      document.getElementById("doneAddOns").addEventListener('click', this.handleDoneAddOns);
      document.getElementById("quote_email").addEventListener('keyup', function () {
        return _this.enableSubmitButton;
      });
      document.getElementById("quote_phone_number").addEventListener('keyup', function () {
        return _this.enableSubmitButton;
      });
      document.getElementById('acceptTerms').addEventListener('click', this.handleAcceptTermsModal);
      document.getElementById('quote_accept_terms').addEventListener('change', this.handleAcceptTermsChecked);
      document.getElementById('contact-info-form').addEventListener('submit', this.handlePaymentSubmit);
      document.getElementById('closeSuccess').addEventListener('click', this.reloadPage);
    }
  }, {
    key: "enableFindButton",
    value: function enableFindButton() {
      document.getElementById('addressSubmit').classList.remove('disabled');
      document.getElementById('addressSubmit').disabled = false;
    }
  }, {
    key: "handleSearchSubmit",
    value: function handleSearchSubmit(event) {
      event.preventDefault();
      this.showNextSection('collapseFindAddress', 'collapseMap');
      document.getElementById('checkMarkAddress').classList.remove('hidden');

      if (this.marker) {
        this.marker.setMap(null);
      }

      if (this.polygons.length > 0) {
        this.polygons.forEach(function (p) {
          p.setMap(null);
        });
        this.polygons = [];
        this.handlePolygonChanged(this.polygons);
      }

      var address = document.getElementById('addressInput').value;
      this.geocodeAddress(address);
    }
  }, {
    key: "showNextSection",
    value: function showNextSection(collapseNode, showNode) {
      document.getElementById(collapseNode).classList.remove('show');
      document.getElementById(showNode).classList.add('show');
    }
  }, {
    key: "handlePolygonChanged",
    value: function handlePolygonChanged() {
      this.totalAreaInSqFt = this.convertToSqFt(this.aggregateAreaInMts());
      this.subTotal = this.calculateSubTotal();
      this.updateAreaOnSummary();
      this.updateGrandTotal();

      if (this.totalAreaInSqFt <= 0) {
        document.getElementById('checkMarkArea').classList.add('hidden');
        document.getElementById('doneSelectingArea').classList.add('disabled');
        document.getElementById('doneSelectingArea').disabled = true;
      } else {
        document.getElementById('checkMarkArea').classList.remove('hidden');
        document.getElementById('doneSelectingArea').classList.remove('disabled');
        document.getElementById('doneSelectingArea').disabled = false;
      }

      document.getElementById('areaSelectHint').classList.remove('hidden');
    }
  }, {
    key: "convertToSqFt",
    value: function convertToSqFt(totalAreaInMts) {
      return totalAreaInMts * constants.SQ_FT_CONVERT;
    }
  }, {
    key: "aggregateAreaInMts",
    value: function aggregateAreaInMts() {
      var totalAreaInMts = 0;
      this.polygons.forEach(function (p) {
        var areaInMts = google.maps.geometry.spherical.computeArea(p.getPath());
        totalAreaInMts += areaInMts;
      });
      return totalAreaInMts;
    }
  }, {
    key: "calculateSubTotal",
    value: function calculateSubTotal() {
      return this.totalAreaInSqFt * priceList.PRICE_PER_SQ_FT;
    }
  }, {
    key: "updateAreaOnSummary",
    value: function updateAreaOnSummary() {
      Dom.showNode(document.getElementById('summaryArea'));
      this.updateAmount('areaInSqFt', this.totalAreaInSqFt, 0);
      this.updateAmount('subTotalDue', this.subTotal, 2);
    }
  }, {
    key: "updateAmount",
    value: function updateAmount(id, amount, precision) {
      var node = document.getElementById(id);
      node.innerText = "".concat(amount.toLocaleString(undefined, {
        maximumFractionDigits: precision
      }));
    }
  }, {
    key: "geocodeAddress",
    value: function geocodeAddress(address) {
      this.geocoder.geocode({
        'address': address,
        'region': 'CA'
      }, this.handleGeocodingResponse);
    }
  }, {
    key: "handleGeocodingResponse",
    value: function handleGeocodingResponse(results, status) {
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
  }, {
    key: "updateAddressOnSummary",
    value: function updateAddressOnSummary(geocodedAddress) {
      if (geocodedAddress) {
        this.geocodedAddress = geocodedAddress;
        var primaryAddressNode = document.getElementById('primaryAddress');
        var secondaryAddressNode = document.getElementById('secondaryAddress');

        while (primaryAddressNode.firstChild) {
          primaryAddressNode.removeChild(primaryAddressNode.firstChild);
        }

        while (secondaryAddressNode.firstChild) {
          secondaryAddressNode.removeChild(secondaryAddressNode.firstChild);
        }

        var splitAddress = geocodedAddress.split(',');
        var div = document.createElement('div');
        div.innerText = splitAddress.shift();
        div.classList.add('primary-address');
        primaryAddressNode.appendChild(div);
        splitAddress.forEach(function (element) {
          var div = document.createElement('div');
          div.innerText = element;
          div.classList.add('secondary-address');
          secondaryAddressNode.appendChild(div);
        });
        Dom.showNode(document.getElementById('summary'));
        Dom.showNode(document.getElementById('summaryAddress'));
      }
    }
  }, {
    key: "handlePolygonCreated",
    value: function handlePolygonCreated(polygon) {
      this.polygons.push(polygon);
      this.handlePolygonChanged();
    }
  }, {
    key: "handleRemoveLastPolygon",
    value: function handleRemoveLastPolygon() {
      this.polygons.pop().setMap(null);
      this.handlePolygonChanged(this.polygons);
    }
  }, {
    key: "handleRemoveAllPolygons",
    value: function handleRemoveAllPolygons() {
      this.polygons.forEach(function (p) {
        return p.setMap(null);
      });
      this.polygons = [];
      this.handlePolygonChanged(this.polygons);
    }
  }, {
    key: "handleDoneSelecting",
    value: function handleDoneSelecting() {
      this.showNextSection('collapseMap', 'collapseAddOns');
      this.updateStaticMapOnSummary(this.polygons);
    }
  }, {
    key: "updateStaticMapOnSummary",
    value: function updateStaticMapOnSummary(polygons) {
      var _this2 = this;

      var APIkey = document.getElementById("map").getAttribute("data-api-key");
      var polygons_string = polygons.map(function (p) {
        var coordString = _this2.vertexToString(p);

        return mapOptions.POLYGON_OPTIONS + coordString;
      }).join('&');
      var staticMapURL = "".concat(mapOptions.BASE_URL).concat(polygons_string, "&zoom=").concat(mapOptions.ZOOM, "&size=").concat(mapOptions.SIZE, "&maptype=").concat(mapOptions.MAP_TYPE, "&key=").concat(APIkey);
      document.getElementById("staticMap").setAttribute("src", staticMapURL);
      document.getElementById("staticMap").classList.remove("hidden");
    }
  }, {
    key: "vertexToString",
    value: function vertexToString(polygon) {
      var vertexArray = polygon.getPath().getArray();
      var coordArray = vertexArray.map(function (vertex) {
        return [vertex.lat(), vertex.lng()].join(",");
      });
      var firstCoord = [vertexArray[0].lat(), vertexArray[0].lng()].join(",");
      coordArray.push(firstCoord);
      return coordArray.join("|");
    }
  }, {
    key: "handleExpeditionInfoClick",
    value: function handleExpeditionInfoClick(event) {
      Dom.showNode(document.getElementById('summaryExpeditionOptions'));
      this.serviceExpeditionCost = parseFloat(event.target.value);
      this.serviceExpeditionLabel = event.target.dataset.label;
      this.serviceExpeditionTime = event.target.id;
      document.getElementById('summaryServiceExpeditionTime').innerText = this.serviceExpeditionLabel;
      this.updateAmount('serviceExpeditionDue', this.serviceExpeditionCost, 2);
      this.updateGrandTotal();
    }
  }, {
    key: "handleAddBagClick",
    value: function handleAddBagClick() {
      this.saltBagsQuantity += 1;
      this.updateSaltBagsTotals();
    }
  }, {
    key: "handleRemoveBagClick",
    value: function handleRemoveBagClick() {
      if (this.saltBagsQuantity > 0) {
        this.saltBagsQuantity -= 1;
        this.updateSaltBagsTotals();
      }
    }
  }, {
    key: "updateSaltBagsTotals",
    value: function updateSaltBagsTotals() {
      this.saltBagsDue = this.saltBagsQuantity * this.saltBagPrice;
      this.updateTotalSaltBags();
      this.updateGrandTotal();
    }
  }, {
    key: "updateTotalSaltBags",
    value: function updateTotalSaltBags() {
      this.updateAmount('numberOfBags', this.saltBagsQuantity, 0);
      Dom.showNode(document.getElementById("summarySaltBags"));
      this.updateAmount('summaryNumberOfBags', this.saltBagsQuantity, 0);
      this.updateAmount('saltBagsDue', this.saltBagsDue, 2);
    }
  }, {
    key: "handleDoneAddOns",
    value: function handleDoneAddOns() {
      this.showNextSection('collapseAddOns', 'collapseContactAndPaymentInfo');
      document.getElementById('checkMarkAddOns').classList.remove('hidden');
    }
  }, {
    key: "updateGrandTotal",
    value: function updateGrandTotal() {
      var grandTotalBeforeDiscount = this.subTotal + this.serviceExpeditionCost + this.saltBagsDue;
      this.updateDiscount(grandTotalBeforeDiscount);
      this.grandTotal = Math.max(grandTotalBeforeDiscount, priceList.MIN_CHARGE) * this.discount;

      if (this.grandTotal > priceList.MIN_CHARGE) {
        Dom.hideNode(document.getElementById('minChargeNote'));
      } else {
        Dom.showNode(document.getElementById('minChargeNote'));
      }

      this.updateAmount('totalDue', this.grandTotal, 2);
    }
  }, {
    key: "updateDiscount",
    value: function updateDiscount(grandTotalBeforeDiscount) {
      this.updateAmount('summaryDiscountAmount', this.discount * 100, 0);
      this.updateAmount('totalDiscount', grandTotalBeforeDiscount * -this.discount, 2);
    }
  }, {
    key: "handleAcceptTermsChecked",
    value: function handleAcceptTermsChecked() {
      if (document.getElementById('quote_accept_terms').checked) {
        this.enableSubmitButton();
      } else {
        document.getElementById('submitPayment').classList.add('disabled');
        document.getElementById('submitPayment').disabled = false;
        ;
      }
    }
  }, {
    key: "handleAcceptTermsModal",
    value: function handleAcceptTermsModal() {
      document.getElementById('quote_accept_terms').checked = true;
    }
  }, {
    key: "onCreditCardInputChange",
    value: function onCreditCardInputChange(cardInputIsComplete) {
      this.isCreditCardComplete = cardInputIsComplete;
      this.enableSubmitButton();
      Dom.hideNode(document.getElementById("contact_info_errors"));
    }
  }, {
    key: "enableSubmitButton",
    value: function enableSubmitButton() {
      var requiredFieldsAreNotEmpty = ['quote_email', 'quote_phone_number'].every(function (id) {
        return document.getElementById(id).value !== "";
      });
      var isTermsTrue = document.getElementById('quote_accept_terms').checked;

      if (requiredFieldsAreNotEmpty && this.isCreditCardComplete && isTermsTrue) {
        var submitPaymentButton = document.getElementById('submitPayment');
        submitPaymentButton.classList.remove('disabled');
        submitPaymentButton.disabled = false;
      }
    }
  }, {
    key: "handlePaymentSubmit",
    value: function handlePaymentSubmit(event) {
      event.preventDefault();
      document.getElementById('submitPayment').classList.add('disabled');
      document.getElementById('submitPayment').disabled = true;
      this.stripe.getToken(this.handleTokenReceived);
    }
  }, {
    key: "handleTokenReceived",
    value: function handleTokenReceived(token) {
      var form = document.getElementById('contact-info-form');
      var formData = new FormData(form);
      var coordinates = this.polygons.map(function (p) {
        return p.getPath().getArray().map(function (vertex) {
          return vertex.toJSON();
        });
      });
      var postData = {
        quote: {
          email: document.getElementsByName("quote[email]")[0].value,
          phone_number: document.getElementsByName("quote[phone_number]")[0].value,
          first_name: document.getElementsByName("quote[first_name]")[0].value,
          last_name: document.getElementsByName("quote[last_name]")[0].value,
          comments: document.getElementsByName("quote[comments]")[0].value,
          terms: document.getElementsByName("quote[terms]")[0].checked,
          address: this.geocodedAddress,
          area: this.totalAreaInSqFt,
          polygons_coordinates: JSON.stringify(coordinates),
          service_expedition_time: this.serviceExpeditionTime,
          salt_bags_quantity: this.saltBagsQuantity
        },
        token_id: token.id
      };
      fetch(form.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'X-CSRF-Token': Rails.csrfToken()
        },
        body: JSON.stringify(postData)
      }).then(function (res) {
        return res.json();
      }).then(function (data) {

        if (data.errors) {
          var errorNode = document.getElementById("contact_info_errors");
          Dom.showNode(errorNode);
          errorNode.innerText = data.errors.join(".\n");
        } else {
          $('#collapseContactAndPaymentInfo').collapse('toggle');
          document.getElementById('checkMarkPayment').classList.remove('hidden');
          $("#successModal").modal("show");
        }
      });
    }
  }, {
    key: "reloadPage",
    value: function reloadPage() {
      location.reload();
    }
  }]);

  return ShovelSquadMap;
}();

;

var Quote =
/*#__PURE__*/
function () {
  function Quote(config) {
    _classCallCheck(this, Quote);

    this.errors = null;
    this.onOpen = config.onOpen;
    this.staticMapURL = null;
    this.totalDue = 0;
    this.handleErrors = this.handleErrors.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.addListeners();
  }

  _createClass(Quote, [{
    key: "addListeners",
    value: function addListeners() {
      var grandTotalNode = document.getElementById('totalDue');
      grandTotalNode.innerText = this.calculateTotalDue(); // $("#submitQuoteModal").on("show.bs.modal", this.handleOpenModal);
      // const quoteFormNode = document.getElementById("new_quote");
      // quoteFormNode.addEventListener("ajax:error", this.handleErrors);
      // quoteFormNode.addEventListener("ajax:success", this.handleSuccess);
      // $("#successModal").on("hide.bs.modal", this.handleSuccessModalClose)
    }
  }, {
    key: "calculateTotalDue",
    value: function calculateTotalDue() {
      // this.totalDue = this.subTotal + this.serviceExpeditionCost + this.saltBagsDue;
      return Math.max(this.totalDue, priceList.MIN_CHARGE);
    }
  }, {
    key: "handleOpenModal",
    value: function handleOpenModal() {
      var quoteData = this.onOpen();
      var polygonsLatLngs = this.getPolygonsJSON(quoteData.polygons);
      var primaryAddressNode = document.getElementById("primaryAddressModal");
      var secondaryAddressNode = document.getElementById("secondaryAddressModal");

      while (primaryAddressNode.firstChild) {
        primaryAddressNode.removeChild(primaryAddressNode.firstChild);
      }

      while (secondaryAddressNode.firstChild) {
        secondaryAddressNode.removeChild(secondaryAddressNode.firstChild);
      }

      var splitAddress = quoteData.geocodedAddress.split(",");
      var div = document.createElement("div");
      div.innerText = splitAddress.shift();
      primaryAddressNode.appendChild(div);
      splitAddress.forEach(function (element) {
        var div = document.createElement("div");
        div.innerText = element;
        secondaryAddressNode.appendChild(div);
      });
      this.updateStaticMap(quoteData.polygons);
      document.getElementById("quoteModalArea").innerText = quoteData.totalAreaInSqFt.toLocaleString(undefined, {
        maximumFractionDigits: 0
      });
      document.getElementById("subTotalModal").innerText = quoteData.subTotal.toLocaleString(undefined, {
        maximumFractionDigits: 2
      });
      document.getElementById("serviceExpeditionLabel").innerText = quoteData.serviceExpeditionLabel;
      document.getElementById("serviceExpeditionCost").innerText = quoteData.serviceExpeditionCost;
      document.getElementById("saltBagsQuantityModal").innerText = quoteData.saltBagsQuantity;
      document.getElementById("quoteModalSaltBagsDue").innerText = quoteData.saltBagsDue;
      document.getElementById("totalModal").innerText = quoteData.totalDue.toLocaleString(undefined, {
        maximumFractionDigits: 2
      });
      document.getElementById("quote_address").value = quoteData.geocodedAddress;
      document.getElementById("quote_area").value = quoteData.totalAreaInSqFt;
      document.getElementById("quote_polygons").value = polygonsLatLngs;
      document.getElementById("quote_static_map_URL").value = this.staticMapURL;
      document.getElementById("quote_service_expedition_cost").value = quoteData.serviceExpeditionCost;
      document.getElementById("quote_service_expedition_time").value = quoteData.serviceExpeditionTime;
      document.getElementById("quote_salt_bags_quantity").value = quoteData.saltBagsQuantity;
    }
  }, {
    key: "updateStaticMap",
    value: function updateStaticMap(polygons) {
      var _this3 = this;

      var APIkey = document.getElementById("map").getAttribute("data-api-key");
      var polygonOptions = "path=color:0x61D5DD|fillcolor:0x61D5DD|weight:5|";
      var polygonsStringArray = polygons.map(function (p) {
        var coordString = _this3.vertexToString(p);

        return polygonOptions + coordString;
      });
      this.staticMapURL = "https://maps.googleapis.com/maps/api/staticmap?".concat(polygonsStringArray.join("&"), "&zoom=20&size=512x512&maptype=satellite&key=").concat(APIkey);
      document.getElementById("staticMap").setAttribute("src", this.staticMapURL);
    }
  }, {
    key: "vertexToString",
    value: function vertexToString(polygon) {
      var vertexArray = polygon.getPath().getArray();
      var coordArray = vertexArray.map(function (vertex) {
        return [vertex.lat(), vertex.lng()].join(",");
      });
      var firstCoord = [vertexArray[0].lat(), vertexArray[0].lng()].join(",");
      coordArray.push(firstCoord);
      return coordArray.join("|");
    }
  }, {
    key: "getPolygonsJSON",
    value: function getPolygonsJSON(polygons) {
      var polygonsLatLngs = polygons.map(function (p) {
        return p.getPath().getArray().map(function (vertex) {
          return vertex.toJSON();
        });
      });
      return JSON.stringify(polygonsLatLngs);
    }
  }, {
    key: "handleErrors",
    value: function handleErrors(event) {
      this.errors = event.detail[0].errors;
      var errorNode = document.getElementById("quote_modal_errors");
      Dom.showNode(errorNode);
      errorNode.innerText = this.errors.join(", ");
      document.getElementsByClassName("quote_email")[0].classList.add("m-0");
    }
  }, {
    key: "handleSuccess",
    value: function handleSuccess(event) {
      $("#submitQuoteModal").modal("hide");
      $("#successModal").modal("show");
    }
  }, {
    key: "handleSuccessModalClose",
    value: function handleSuccessModalClose() {
      location.reload();
    }
  }]);

  return Quote;
}();

;

var QuotingPanel =
/*#__PURE__*/
function () {
  function QuotingPanel() {
    _classCallCheck(this, QuotingPanel);

    this.polygons = {};
    this.geocodedAddress = null;
    this.totalAreaInSqFt = null;
    this.subTotal = null;
    this.serviceExpeditionCost = 0; // needs improvement to start according to controller variables

    this.serviceExpeditionLabel = 'FREE in 24hrs'; // needs improvement to start according to controller variables

    this.serviceExpeditionTime = 'free'; // needs improvement to start according to controller variables

    this.saltBagsQuantity = 0;
    this.saltBagPrice = priceList.PRICE_PER_SALT_BAG;
    this.saltBagsDue = null;
    this.totalDue = null;
    this.showAddress = this.showAddress.bind(this);
    this.handlePolygonChanged = this.handlePolygonChanged.bind(this);
    this.handleExpeditionInfoClick = this.handleExpeditionInfoClick.bind(this);
    this.handleAddBagClick = this.handleAddBagClick.bind(this);
    this.handleRemoveBagClick = this.handleRemoveBagClick.bind(this);
    this.getData = this.getData.bind(this); // this.addListeners();
  }

  _createClass(QuotingPanel, [{
    key: "showAddress",
    value: function showAddress(geocodedAddress) {
      if (geocodedAddress) {
        this.geocodedAddress = geocodedAddress;
        var primaryAddressNode = document.getElementById("primaryAddress");
        var secondaryAddressNode = document.getElementById("secondaryAddress");

        while (primaryAddressNode.firstChild) {
          primaryAddressNode.removeChild(primaryAddressNode.firstChild);
        }

        while (secondaryAddressNode.firstChild) {
          secondaryAddressNode.removeChild(secondaryAddressNode.firstChild);
        }

        var splitAddress = geocodedAddress.split(",");
        var div = document.createElement("div");
        div.innerText = splitAddress.shift();
        div.classList.add("primary-address");
        primaryAddressNode.appendChild(div);
        splitAddress.forEach(function (element) {
          var div = document.createElement("div");
          div.innerText = element;
          div.classList.add("secondary-address");
          secondaryAddressNode.appendChild(div);
        });
        Dom.showNode(document.getElementById("displayAddress"));
        Dom.showNode(document.getElementById("step2"));
      }
    }
  }, {
    key: "handlePolygonChanged",
    value: function handlePolygonChanged(polygons) {
      Dom.hideNode(document.getElementById("step2"));
      this.polygons = polygons;
      this.totalAreaInSqFt = this.convertToSqFt(this.aggregateAreaInMts());
      this.updateAreaNode();
      this.subTotal = this.calculateSubTotal();
      this.updateSubTotalNode();
      this.showTotalsNode();
      this.updateGrandTotal();
      Dom.showNode(document.getElementById("displayServiceExpedition"));
      Dom.showNode(document.getElementById("grandTotal"));
    }
  }, {
    key: "aggregateAreaInMts",
    value: function aggregateAreaInMts() {
      var totalAreaInMts = 0;
      this.polygons.forEach(function (p) {
        var areaInMts = google.maps.geometry.spherical.computeArea(p.getPath());
        totalAreaInMts += areaInMts;
      });
      return totalAreaInMts;
    }
  }, {
    key: "convertToSqFt",
    value: function convertToSqFt(totalAreaInMts) {
      return totalAreaInMts * constants.SQ_FT_CONVERT;
    }
  }, {
    key: "updateAreaNode",
    value: function updateAreaNode() {
      var areaNode = document.getElementById("calculatedArea");
      areaNode.innerText = "".concat(this.totalAreaInSqFt.toLocaleString(undefined, {
        maximumFractionDigits: 0
      }));
    }
  }, {
    key: "calculateSubTotal",
    value: function calculateSubTotal() {
      return this.totalAreaInSqFt * priceList.PRICE_PER_SQ_FT;
    }
  }, {
    key: "updateSubTotalNode",
    value: function updateSubTotalNode() {
      this.updateAmountNode("subTotalDue", this.subTotal, 2);
    }
  }, {
    key: "updateTotalSaltBagsNode",
    value: function updateTotalSaltBagsNode() {
      var numberOfBagsNode = document.getElementById("numberOfBags");
      numberOfBagsNode.innerText = "".concat(this.saltBagsQuantity);
      var bagsDueNode = document.getElementById("saltBagsDue");
      bagsDueNode.innerText = "".concat(this.saltBagsDue);
      this.updateTotalDueNode();
    }
  }, {
    key: "showTotalsNode",
    value: function showTotalsNode() {
      Dom.showNode(document.getElementById("displayTotals"));
    }
  }, {
    key: "updateGrandTotal",
    value: function updateGrandTotal() {
      this.totalDue = this.calculateTotalDue();
      this.updateTotalDueNode();
    }
  }, {
    key: "calculateTotalDue",
    value: function calculateTotalDue() {
      var totalDue = this.subTotal + this.serviceExpeditionCost + this.saltBagsDue;
      return Math.max(totalDue, priceList.MIN_CHARGE);
    }
  }, {
    key: "updateTotalDueNode",
    value: function updateTotalDueNode() {
      this.updateAmountNode("totalDue", this.totalDue, 2);
      this.updateAmountNode("totalModal", this.totalDue, 2);
    }
  }, {
    key: "updateAmountNode",
    value: function updateAmountNode(id, amount, precision) {
      var node = document.getElementById(id);
      node.innerText = "".concat(amount.toLocaleString(undefined, {
        maximumFractionDigits: precision
      }));
    }
  }, {
    key: "addListeners",
    value: function addListeners() {
      var _this4 = this;

      document.getElementById("SubmitQuote").addEventListener('submit', this.handleSubmitQuoteClick);
      document.getElementById("searchAddressButton").addEventListener('click', this.handleSearchAddressClick);
      var quotingPanel = this;
      Array.from(document.getElementsByName("serviceExpeditionCost")).forEach(function (element) {
        element.addEventListener('click', _this4.handleExpeditionInfoClick);
      });
      document.getElementById("addBag").addEventListener('click', this.handleAddBagClick);
      document.getElementById("removeBag").addEventListener('click', this.handleRemoveBagClick);
    }
  }, {
    key: "handleSubmitQuoteClick",
    value: function handleSubmitQuoteClick(event) {
      event.preventDefault();
    }
  }, {
    key: "handleSearchAddressClick",
    value: function handleSearchAddressClick() {
      $("#submitAddressModal").modal("show");
    }
  }, {
    key: "handleAddBagClick",
    value: function handleAddBagClick() {
      this.saltBagsQuantity += 1;
      this.updateSaltBagsTotals();
      Dom.showNode(document.getElementById("displaySaltBags"));
      Dom.showNode(document.getElementById("quoteModalSaltBags"));
      ;
    }
  }, {
    key: "handleRemoveBagClick",
    value: function handleRemoveBagClick() {
      if (this.saltBagsQuantity > 0) {
        this.saltBagsQuantity -= 1;
      }

      this.updateSaltBagsTotals();
    }
  }, {
    key: "handleExpeditionInfoClick",
    value: function handleExpeditionInfoClick(event) {
      var serviceExpeditionCost = parseFloat(event.target.value);
      var serviceExpeditionLabel = event.target.dataset.label;
      var serviceExpeditionTime = event.target.id;
      this.updateServiceExpeditionInfo(serviceExpeditionCost, serviceExpeditionLabel, serviceExpeditionTime);
    }
  }, {
    key: "updateServiceExpeditionInfo",
    value: function updateServiceExpeditionInfo(serviceExpeditionCost, serviceExpeditionLabel, serviceExpeditionTime) {
      this.serviceExpeditionCost = serviceExpeditionCost;
      this.serviceExpeditionLabel = serviceExpeditionLabel;
      this.serviceExpeditionTime = serviceExpeditionTime;
      this.updateGrandTotal();
    }
  }, {
    key: "updateSaltBagsTotals",
    value: function updateSaltBagsTotals() {
      this.saltBagsDue = this.saltBagsQuantity * this.saltBagPrice;
      this.updateTotalSaltBagsNode();
      this.updateGrandTotal();
    }
  }, {
    key: "getData",
    value: function getData() {
      return {
        polygons: this.polygons,
        geocodedAddress: this.geocodedAddress || "",
        totalAreaInSqFt: this.totalAreaInSqFt,
        subTotal: this.subTotal,
        serviceExpeditionCost: this.serviceExpeditionCost,
        serviceExpeditionLabel: this.serviceExpeditionLabel,
        serviceExpeditionTime: this.serviceExpeditionTime,
        saltBagsQuantity: this.saltBagsQuantity,
        saltBagsDue: this.saltBagsDue,
        totalDue: this.totalDue
      };
    }
  }]);

  return QuotingPanel;
}();

;

var ShovelSquadStripe =
/*#__PURE__*/
function () {
  function ShovelSquadStripe(config) {
    var _this5 = this;

    _classCallCheck(this, ShovelSquadStripe);

    this.stripe = Stripe(stripeKey);
    this.onStripeChange = config.onCreditCardInputChange;
    var elements = this.stripe.elements(); // Custom styling can be passed to options when creating an Element.

    var style = {
      base: {
        color: '#32325d',
        lineHeight: '18px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };
    this.card = elements.create('card', {
      style: style
    });
    this.card.mount('#card-element'); // Handle real-time validation errors from the card Element.

    this.card.addEventListener('change', function (event) {
      _this5.onStripeChange(event.complete);

      var displayError = document.getElementById('card-errors');

      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });
  }

  _createClass(ShovelSquadStripe, [{
    key: "getToken",
    value: function getToken(callback) {
      this.stripe.createToken(this.card).then(function (result) {
        if (result.error) {
          // Inform the user if there was an error.
          var errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
        } else {
          // Send the token to shovel squad server.
          callback(result.token);
        }
      });
    }
  }]);

  return ShovelSquadStripe;
}();

;
