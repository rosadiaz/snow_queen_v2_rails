
// Create a Stripe client.
const stripe = Stripe(stripeKey);

// Create an instance of Elements.
const elements = stripe.elements();

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

// Create an instance of the card Element.
const card = elements.create('card', {style: style});


document.addEventListener('DOMContentLoaded', () => {
  // Add an instance of the card Element into the `card-element` <div>.
  card.mount('#card-element');
  
  // Handle real-time validation errors from the card Element.
  card.addEventListener('change', function(event) {
    const displayError = document.getElementById('card-errors');
    if (event.error) {
      displayError.textContent = event.error.message;
    } else {
      displayError.textContent = '';
    }
  });

  // Handle form submission.
  const form = document.getElementById('payment-form');
  form.addEventListener('submit', function(event) {
    debugger;
    event.preventDefault();
  
    stripe.createToken(card).then(function(result) {
      if (result.error) {
        // Inform the user if there was an error.
        debugger;
        const errorElement = document.getElementById('card-errors');
        errorElement.textContent = result.error.message;
      } else {
        // Send the token to your server.
        stripeTokenHandler(result.token);
      }
    });
    return false;
  });
  
  // Submit the form with the token ID.
  function stripeTokenHandler(token) {
    debugger;
    // Insert the token ID into the form so it gets submitted to the server
    const form = document.getElementById('payment-form');
    const hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);
    console.log("**********************token **************: ", token);
  
    // Submit the form
    // form.submit();
  }

});
