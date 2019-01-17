class QuotingPanel {
  constructor() {
    this.polygons = {};
    this.geocodedAddress = null;
    this.totalAreaInSqFt = null;
    this.subTotal = null;
    this.serviceExpeditionCost = 0; // needs improvement to start according to controller variables
    this.serviceExpeditionDetails = 'FREE';  // needs improvement to start according to controller variables
    this.serviceExpeditionTime = '24hrs'; // needs improvement to start according to controller variables
    this.saltBagsQuantity = 0;
    this.saltBagPrice = 35; // needs improvement to start according to controller variables
    this.saltBagsDue = null;
    this.totalDue = null;

    this.showAddress = this.showAddress.bind(this);
    this.handlePolygonChanged = this.handlePolygonChanged.bind(this);
    this.handleExpeditionInfoClick = this.handleExpeditionInfoClick.bind(this);
    this.getData = this.getData.bind(this);
    this.addListeners();
  }

  showAddress(geocodedAddress) {
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
      Dom.showNode(document.getElementById("displayAddress"));
      Dom.showNode(document.getElementById("step2"));
    }
  }

  handlePolygonChanged(polygons) {
    Dom.hideNode(document.getElementById("step2"));
    this.polygons = polygons;
    this.totalAreaInSqFt = this.convertToSqFt(this.aggregateAreaInMts());
    this.updateAreaNode();
    this.subTotal = this.calculateSubTotal();
    this.updateSubTotalNode();
    this.showTotalsNode();
    this.totalDue = this.calculateTotalDue();
    this.updateTotalDueNode();
    Dom.showNode(document.getElementById("displayServiceExpedition"));
    Dom.showNode(document.getElementById("grandTotal"));
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

  updateAreaNode() {
    const areaNode = document.getElementById("calculatedArea");
    areaNode.innerText = `${this.totalAreaInSqFt.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
  }

  calculateSubTotal() {
    return this.totalAreaInSqFt * constants.PRICE_PER_SQ_FT;
  }

  updateSubTotalNode() {
    const subTotalNode = document.getElementById("subTotalDue");
    subTotalNode.innerText = `${(this.subTotal).toLocaleString(undefined, {maximumFractionDigits: 2})}`;
  }

  updateTotalSaltBagsNode() {
    const numberOfBagsNode = document.getElementById("numberOfBags");
    numberOfBagsNode.innerText = `${this.saltBagsQuantity}`;
    const bagsDueNode = document.getElementById("saltBagsDue");
    bagsDueNode.innerText = `${this.saltBagsDue}`;
    this.updateTotalDueNode();
  }

  showTotalsNode() {
    Dom.showNode(document.getElementById("displayTotals"));
  }
  
  calculateTotalDue() {
    let totalDue = this.subTotal + this.serviceExpeditionCost + this.saltBagsDue;
    return Math.max(totalDue, constants.MIN_CHARGE);
  }

  updateTotalDueNode() {
    const totalDueNode = document.getElementById("totalDue");
    totalDueNode.innerText = `${this.totalDue.toLocaleString(undefined, {maximumFractionDigits: 2})}`;

    const totalDueNodeInModal = document.getElementById("totalModal");
    totalDueNodeInModal.innerText = `${this.totalDue.toLocaleString(undefined, {maximumFractionDigits: 2})}`;
  }

  addListeners() {
    document.getElementById("SubmitQuote").addEventListener('submit', (event) => { event.preventDefault() });
    document.getElementById("searchAddressButton").addEventListener('click', this.handleSearchAddressClick);
    const quotingPanel = this;
    document.getElementsByName("serviceExpeditionCost").forEach((element) => { 
      element.addEventListener('click', this.handleExpeditionInfoClick); 
    });
    document.getElementById("addBag").addEventListener('click', (event) => { this.handleAddSaltBag() });
    document.getElementById("removeBag").addEventListener('click', (event) => { this.handleRemoveSaltBag() });
  }

  handleExpeditionInfoClick(event) {
    const serviceExpeditionCost = Number.parseFloat(event.target.value);
    const serviceExpeditionDetails = event.target.dataset.label;
    const serviceExpeditionTime = event.target.id;
    this.updateServiceExpeditionInfo(serviceExpeditionCost, serviceExpeditionDetails, serviceExpeditionTime); 
  }

  updateServiceExpeditionInfo(serviceExpeditionCost, serviceExpeditionDetails, serviceExpeditionTime) {
    this.serviceExpeditionCost = serviceExpeditionCost;
    this.serviceExpeditionDetails = serviceExpeditionDetails;
    this.serviceExpeditionTime = serviceExpeditionTime;
    this.totalDue = this.calculateTotalDue();
    this.updateTotalDueNode();
  }

  handleAddSaltBag() {
    this.saltBagsQuantity += 1;
    this.updateSaltBagsTotals();
    Dom.showNode(document.getElementById("displaySaltBags"));
    Dom.showNode(document.getElementById("saltBagsQuoteModal"));
  }

  handleRemoveSaltBag() {
    if (this.saltBagsQuantity > 0) {
      this.saltBagsQuantity -= 1;
    }
    this.updateSaltBagsTotals();
  }

  updateSaltBagsTotals() {
    this.saltBagsDue = this.saltBagsQuantity * this.saltBagPrice;
    this.updateTotalSaltBagsNode();
    this.totalDue = this.calculateTotalDue();
    this.updateTotalDueNode();
  }

  getData() {
    return {
      polygons: this.polygons,
      geocodedAddress: this.geocodedAddress || "",
      totalAreaInSqFt: this.totalAreaInSqFt, 
      subTotal: this.subTotal,
      serviceExpeditionCost: this.serviceExpeditionCost,
      serviceExpeditionDetails: this.serviceExpeditionDetails,
      serviceExpeditionTime: this.serviceExpeditionTime,
      saltBagsQuantity: this.saltBagsQuantity,
      saltBagsDue: this.saltBagsDue,
      totalDue: this.totalDue,
    }
  }

  handleSearchAddressClick() {
    $("#addressSubmitModal").modal("show");
  }
}

