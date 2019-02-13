class ShovelSquadStripe {
  constructor(config) {
    this.stripe = Stripe(stripeKey);
    this.onStripeChange = config.onCreditCardInputChange;

    const elements = this.stripe.elements();
    // Custom styling can be passed to options when creating an Element.
    const style = {
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

    this.card = elements.create('card', {style: style});
    this.card.mount('#card-element');

    // Handle real-time validation errors from the card Element.
    this.card.addEventListener('change', (event) => {
      this.onStripeChange(event.complete);
      const displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });
  }

  getToken(callback) {
    this.stripe.createToken(this.card).then(function(result) {
      if (result.error) {
        // Inform the user if there was an error.
        const errorElement = document.getElementById('card-errors');
        errorElement.textContent = result.error.message;
      } else {
        // Send the token to shovel squad server.
        callback(result.token);
      }
    });
  }
}

export default ShovelSquadStripe;
