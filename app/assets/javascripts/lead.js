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
    const errorNode = document.getElementById("modal_errors");
    Dom.showNode(errorNode);
    errorNode.innerText = this.errors.join(", ");
    document.getElementsByClassName("lead_email")[0].classList.add("m-0");
  }

  handleSuccess(event) {
    $("#leadSubmitModal").modal("hide");
  }
}