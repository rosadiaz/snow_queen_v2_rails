class QuotingPanel {
  constructor() {
    this.polygons = {};
    this.geocodedAddress = null;
    this.totalAreaInSqFt = null;
    this.subTotal = null;
    this.service_expedition_cost = null;
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
    let service_expedition_cost = 0 || this.service_expedition_cost;
    let subTotal = this.totalAreaInSqFt * constants.PRICE_PER_SQ_FT;
    let totalDue = subTotal + service_expedition_cost;
    if (totalDue >= constants.MIN_CHARGE) {
      return totalDue;
    }
    return constants.MIN_CHARGE;
  }
  
  // updateTotalDueNode() {
  //   const areaNodeInModal = document.getElementById("areaModal");
  //   areaNodeInModal.innerText = `${this.totalAreaInSqFt.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
  // }

  updateTotalDueNode() {
    const totalDueNode = document.getElementById("totalDue");
    totalDueNode.innerText = `${this.totalDue.toLocaleString(undefined, {maximumFractionDigits: 2})}`;

    const totalDueNodeInModal = document.getElementById("totalModal");
    totalDueNodeInModal.innerText = `${this.totalDue.toLocaleString(undefined, {maximumFractionDigits: 2})}`;
  }

  addListeners() {
    document.getElementById("SubmitQuote").addEventListener('submit', (event) => { event.preventDefault() });
    document.getElementById("searchAddressButton").addEventListener('click', this.handleSearchAddressClick);
    $('input[type=radio]').click(function(){
      this.service_expedition_cost = this.value;
  });
  }

  getData() {
    return {
      polygons: this.polygons,
      geocodedAddress: this.geocodedAddress || "",
      totalAreaInSqFt: this.totalAreaInSqFt, 
      subTotal: this.subTotal,
      totalDue: this.totalDue,
    }
  }

  handleSearchAddressClick() {
    $("#addressSubmitModal").modal("show");
  }
}

