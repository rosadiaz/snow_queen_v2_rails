# README

This README would normally document whatever steps are necessary to get the
application up and running.

* Ruby version 2.5.1

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...
# snow_queen

Snow Queen is a rails backend application to generate quotes for snow clearing and salting services. 

The application uses Google APIs to search for an address, the customer then marks the area to be serviced. The area calculated, along with specifications provided by the customer like: steps, hidden paths, ________, and a text area for additional notes to the service provider. This information adjusts the total to be paid for the service. When the quote is accepted, the application requests contact information for the customer and sends an email with the entered information, map, and total payment due to customer and to the service provider for revision.

Design and branding was provided by _________ (in the mean time I will come up with something that hopefully is not offensive to the untrained eye)

## Installation

Use the package manager [pip](https://pip.pypa.io/en/stable/) to install foobar.

```bash
pip install foobar
```

## Usage

```python
import foobar

foobar.pluralize('word') # returns 'words'
foobar.pluralize('goose') # returns 'geese'
foobar.singularize('phenomena') # returns 'phenomenon'
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Support
If help is required regarding this application, you can contact rosa_at_gmail.com

## Roadmap
Future versions will have the following features:

* React front end
* Option of delimiting a service area and notifying if an address is outside of its limits
* SnowQueen admin customer will be able to log in and keep track of quotes and mark as jobs finished or cancelled.
* SnowQueen admin can update quotes if the needs to be adjustments and notify customer of changes
* Accept payments from customers at time of quote request
* Customer can log in and rate the service received after job is done


## License
[MIT](https://choosealicense.com/licenses/mit/)