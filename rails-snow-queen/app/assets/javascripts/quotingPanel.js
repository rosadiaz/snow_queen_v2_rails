class QuotingPanel {
  constructor() {
    this.polygons = {};
    this.geocodedAddress = null;
    this.totalAreaInSqFt = null;
    this.totalDue = null;

    this.showAddress = this.showAddress.bind(this);
    this.handlePolygonChanged = this.handlePolygonChanged.bind(this);
    this.getData = this.getData.bind(this);
    this.addListeners();
  }

  showAddress(geocodedAddress) {
    if (geocodedAddress) {
      this.geocodedAddress = geocodedAddress;
      const addressNode = document.getElementById("displayAddress");
      let splitAddress = geocodedAddress.split(",");
      while (addressNode.firstChild) { addressNode.removeChild(addressNode.firstChild) }
      splitAddress.forEach(element => {
        const div = document.createElement("div");
        div.innerText = element;
        addressNode.appendChild(div);
      });
      addressNode.classList.remove("hidden");
      document.getElementById("searchAddressButton").classList.remove("hidden");

      const addressNodeInModal = document.getElementById("addressModal");
      addressNodeInModal.innerText = splitAddress;
    }
  }

  handlePolygonChanged (polygons) {
    this.polygons = polygons;
    this.totalAreaInSqFt = this.convertToSqFt(this.aggregateAreaInMts());
    this.totalDue = this.calculateTotalDue();
    this.updateAreaNode();
    this.updateTotalDueNode();
    this.showTotalsNode();

    const APIkey = document.getElementById("map").getAttribute("data-api-key");
    const polygonOptions = "path=color:0xff0000ff|fillcolor:0x00ff00ff|weight:5|"
    let polygonsStringArray = this.polygons.map(p => { 
      let vertexArray = p.getPath().getArray()
      let coordArray =  vertexArray.map(vertex => { 
        return vertex.lat() + "," + vertex.lng();
      })
      let firstCoord = [vertexArray[0].lat(), vertexArray[0].lng()].join(",")
      coordArray.push(firstCoord)
      return polygonOptions + coordArray.join("|")
    });

    const staticMapNode = document.getElementById("staticMap")
    const img = document.createElement("img");
    let staticMapURL = `https://maps.googleapis.com/maps/api/staticmap?${polygonsStringArray.join("&")}&zoom=20&size=512x512&key=${APIkey}`
    img.setAttribute("src", staticMapURL);
    while (staticMapNode.firstChild) { staticMapNode.removeChild(staticMapNode.firstChild) }
    staticMapNode.appendChild(img);
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

  calculateTotalDue() {
    return this.totalAreaInSqFt * constants.PRICE_PER_SQ_FT;
  }

  showTotalsNode() {
    document.getElementById("displayTotals").classList.remove("hidden");
  }
  
  updateAreaNode() {
    const areaNode = document.getElementById("calculatedArea");
    areaNode.innerText = `${this.totalAreaInSqFt.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
  }

  updateTotalDueNode() {
    const areaNodeInModal = document.getElementById("areaModal");
    areaNodeInModal.innerText = `${this.totalAreaInSqFt.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
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
  }

  getData() {
    return {
      polygons: this.polygons,
      geocodedAddress: this.geocodedAddress || "",
      totalAreaInSqFt: this.totalAreaInSqFt, 
      totalDue: this.totalDue,
    }
  }

  handleSearchAddressClick() {
    $("#submitQuoteModal").modal("show");
  }
}

