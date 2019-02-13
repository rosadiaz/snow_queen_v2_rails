class Lead {
  constructor() {
    this.addListeners();
  }
  
  addListeners() {
    const leadFormNode = document.getElementById("new_lead");
    leadFormNode.addEventListener("ajax:error", this.handleErrors);
    leadFormNode.addEventListener("ajax:success", this.handleSuccess);
  }

  handleErrors(event) {
    this.errors = event.detail[0].errors;
    const errorNode = document.getElementById("lead_errors");
    Dom.showNode(errorNode);
    errorNode.innerText = this.errors.join(".\n");
  }

  handleSuccess(event) {
    $('#collapseLead').collapse('toggle');
    $("#successModal").modal("show");

  }
}

export default Lead;