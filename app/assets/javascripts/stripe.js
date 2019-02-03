class ShovelSquadStripe {
  constructor(config) {
    // Create a Stripe client.
    this.stripe = Stripe(stripeKey);

    // Create an instance of Elements.
    const elements = this.stripe.elements();

    // Custom styling can be passed to options when creating an Element.
    // (Note that this demo uses a wider set of styles than the guide below.)
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
    this.card.addEventListener('change', function(event) {
      const displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    // // Handle form submission.
    // const form = document.getElementById('payment-form');
    // form.addEventListener('submit', function(event) {
    //   event.preventDefault();
    
      // stripe.createToken(card).then(function(result) {
      //   if (result.error) {
      //     // Inform the user if there was an error.
      //     const errorElement = document.getElementById('card-errors');
      //     errorElement.textContent = result.error.message;
      //   } else {
      //     // Send the token to your server.
      //     stripeTokenHandler(result.token);
          
      //   }
      // });
      // return false;
    // });
    
    // Submit the form with the token ID.
  //   function stripeTokenHandler(token) {
  //     // Making a POST to /charges
  //     const form = document.getElementById('payment-form');
  //     const email = document.getElementById('quote_email').value

  //     fetch(form.action, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify({ 
  //         stripeToken: token.id,
  //         email: email,

  //       })
  //     }).then( res => res.json()).then( data => {
  // // TODO display error if data.error else 
  //       console.log(data)
  //     })
  //   }

  }

  getToken(callback) {
    this.stripe.createToken(this.card).then(function(result) {
      if (result.error) {
        // Inform the user if there was an error.
        const errorElement = document.getElementById('card-errors');
        errorElement.textContent = result.error.message;
      } else {
        // Send the token to your server.
        callback(result.token);
        
      }
    });
  }
}