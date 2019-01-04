class QuotingPanel {
  constructor() {
    this.polygons = {};
    this.geocodedAddress = null;
    this.totalAreaInSqFt = null;
    this.subTotal = null;
    this.serviceExpeditionCost = null;
    this.totalDue = null;

    this.showAddress = this.showAddress.bind(this);
    this.handlePolygonChanged = this.handlePolygonChanged.bind(this);
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
      document.getElementById("displayAddress").classList.remove("hidden");
      document.getElementById("step2").classList.remove("hidden");
    }
  }

  handlePolygonChanged(polygons) {
    document.getElementById("step2").classList.add("hidden");
    this.polygons = polygons;
    this.totalAreaInSqFt = this.convertToSqFt(this.aggregateAreaInMts());
    this.updateAreaNode();
    this.subTotal = this.calculateSubTotal();
    this.updateSubTotalNode();
    this.showTotalsNode();
    this.totalDue = this.calculateTotalDue();
    this.updateTotalDueNode();
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

  showTotalsNode() {
    document.getElementById("displayTotals").classList.remove("hidden");
  }
  
  calculateTotalDue() {
    let serviceExpeditionCost = 0 || this.serviceExpeditionCost;
    let totalDue = this.subTotal + serviceExpeditionCost;
    if (totalDue >= constants.MIN_CHARGE) {
      return totalDue;
    }
    return constants.MIN_CHARGE;
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
    document.getElementsByName("serviceExpeditionCost").forEach((element) => { 
      element.addEventListener('click', (event) => { 
        const serviceExpeditionCost = Number.parseFloat(event.target.value);
        this.handleServiceExpeditionChange(serviceExpeditionCost); 
      });
    });
  }

  handleServiceExpeditionChange(serviceExpeditionCost) {
    this.serviceExpeditionCost = serviceExpeditionCost;
    this.totalDue = this.calculateTotalDue();
    this.updateTotalDueNode();
  }

  getData() {
    return {
      polygons: this.polygons,
      geocodedAddress: this.geocodedAddress || "",
      totalAreaInSqFt: this.totalAreaInSqFt, 
      totalDue: this.totalDue,
      totalDue: this.totalDue,
    }
  }

  handleSearchAddressClick() {
    $("#addressSubmitModal").modal("show");
  }
}

