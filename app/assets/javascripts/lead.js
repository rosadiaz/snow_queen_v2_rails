class Lead {
  constructor() {
    this.addListeners();
  }
  
  addListeners() {
    const leadFormNode = document.getElementById("new_lead");
    leadFormNode.addEventListener("ajax:error", this.handleErrors);
    leadFormNode.addEventListener("ajax:success", this.handleSuccess);
    $("#successModal").on("hide.bs.modal", this.handleSuccessModalClose)
  }

  handleErrors(event) {
    this.errors = event.detail[0].errors;
    const errorNode = document.getElementById("lead_modal_errors");
    Dom.showNode(errorNode);
    errorNode.innerText = this.errors.join("\n");
  }

  handleSuccess(event) {
    $("#leadSubmitModal").modal("hide");
  }
}