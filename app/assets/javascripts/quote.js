class Quote {
  constructor(config) {
    this.errors = null;
    this.onOpen = config.onOpen;
    this.staticMapURL = null;
    
    this.handleErrors = this.handleErrors.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.addListeners();
  }
  
  addListeners() {
    $("#submitQuoteModal").on("show.bs.modal", this.handleOpenModal);
    const quoteFormNode = document.getElementById("new_quote");
    quoteFormNode.addEventListener("ajax:error", this.handleErrors);
    quoteFormNode.addEventListener("ajax:success", this.handleSuccess);
    $("#successModal").on("hide.bs.modal", this.handleSuccessModalClose)
  }

  handleOpenModal() {
    let quoteData = this.onOpen();
    let polygonsLatLngs = this.getPolygonsJSON(quoteData.polygons);

    const primaryAddressNode = document.getElementById("primaryAddressModal");
    const secondaryAddressNode = document.getElementById("secondaryAddressModal");
    while (primaryAddressNode.firstChild) { primaryAddressNode.removeChild(primaryAddressNode.firstChild) }
    while (secondaryAddressNode.firstChild) { secondaryAddressNode.removeChild(secondaryAddressNode.firstChild) }
    
    let splitAddress = quoteData.geocodedAddress.split(",");
    const div = document.createElement("div");
    div.innerText = splitAddress.shift();
    primaryAddressNode.appendChild(div);
    splitAddress.forEach(element => {
      const div = document.createElement("div");
      div.innerText = element;
      secondaryAddressNode.appendChild(div);
    }); 

    this.updateStaticMap(quoteData.polygons);

    // document.getElementById("areaModal").innerText = `${quoteData.totalAreaInSqFt.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
    document.getElementById("areaModal").innerText = quoteData.totalAreaInSqFt.toLocaleString(undefined, {maximumFractionDigits: 0});
    document.getElementById("subTotalModal").innerText = quoteData.subTotal.toLocaleString(undefined, {maximumFractionDigits: 2});
    document.getElementById("serviceExpeditionDetails").innerText = `${quoteData.serviceExpeditionDetails} ${quoteData.serviceExpeditionTime}`;
    document.getElementById("serviceExpeditionCost").innerText = quoteData.serviceExpeditionCost;
    document.getElementById("saltBagsQuantityModal").innerText = quoteData.saltBagsQuantity;
    document.getElementById("saltBagsDueModal").innerText = quoteData.saltBagsDue;
    document.getElementById("totalModal").innerText = quoteData.totalDue.toLocaleString(undefined, {maximumFractionDigits: 2});

    document.getElementById("quote_address").value = quoteData.geocodedAddress;
    document.getElementById("quote_area").value = quoteData.totalAreaInSqFt;
    document.getElementById("quote_total").value = quoteData.totalDue;
    document.getElementById("quote_polygons").value = polygonsLatLngs;
    document.getElementById("quote_static_map_URL").value = this.staticMapURL;
    document.getElementById("quote_service_expedition_cost").value = quoteData.serviceExpeditionCost;
    document.getElementById("quote_service_expedition_time").value = quoteData.serviceExpeditionTime;
    document.getElementById("quote_salt_bags_quantity").value = quoteData.saltBagsQuantity;
    document.getElementById("quote_salt_bags_due").value = quoteData.saltBagsDue;
  }

  updateStaticMap(polygons) {
    const APIkey = document.getElementById("map").getAttribute("data-api-key");
    const polygonOptions = "path=color:0x61D5DD|fillcolor:0x61D5DD|weight:5|";
    let polygonsStringArray = polygons.map(p => { 
      let coordString = this.vertexToString(p);
      return polygonOptions + coordString;
    });

    this.staticMapURL = `https://maps.googleapis.com/maps/api/staticmap?${polygonsStringArray.join("&")}&zoom=20&size=512x512&maptype=satellite&key=${APIkey}`
    document.getElementById("staticMap").setAttribute("src", this.staticMapURL);
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

  getPolygonsJSON(polygons){
    let polygonsLatLngs = polygons.map(p => { 
      return p.getPath().getArray().map(vertex => { return vertex.toJSON() })
    });
    return JSON.stringify(polygonsLatLngs);
  }

  handleErrors(event) {
    this.errors = event.detail[0].errors;
    const errorNode = document.getElementById("quote_modal_errors");
    Dom.showNode(errorNode);
    errorNode.innerText = this.errors.join(", ");
    document.getElementsByClassName("quote_email")[0].classList.add("m-0");
  }

  handleSuccess(event) {
    $("#submitQuoteModal").modal("hide");
    $("#successModal").modal("show");
  }

  handleSuccessModalClose() {
    location.reload();
  }
}

