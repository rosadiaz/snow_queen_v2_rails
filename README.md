# SHOVEL SQUAD QUOTING TOOL

Shovel Squad is a quote generator that uses satellite imaging to calculate the area and request snow clearing and salting services for residential jobs reducing the overhead of the company since it eliminates the need to survey the area making the process fast and efficient for the potential customers and the business.

Technology: Ruby on Rails, Google APIs and libraries (Geocoding API, Geolocation API, Drawing and Geometry library, Static Maps, Places), Heroku, Bootstrap.
Note: this project is split into Rails and React sub-repos on GitHub


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

ShovelSquad is a rails backend application to generate quotes for snow clearing and salting services. 

The application uses Google APIs to search for an address, the customer then marks the area to be serviced. The area calculated, along with specifications provided by the customer like: steps, hidden paths, ________, and a text area for additional notes to the service provider. This information adjusts the total to be paid for the service. When the quote is accepted, the application requests contact information for the customer and sends an email with the entered information, map, and total payment due to customer and to the service provider for revision.

Design and branding was provided by _________ (in the mean time I will come up with something that hopefully is not offensive to the untrained eye)

## Installation

To setup mailing account, refer to file local_env.yml.example, make a copy of the file and remove extension .example and replace contents.
To use gmail, generate app specific password


Use the package manager [pip](https://pip.pypa.io/en/stable/) to install foobar.

```bash
pip install foobar
```

## Usage

To change constants like the price list, refer to file 'quote.rb'
To change service expedition times and descriptions, refer to file 'en.yml'
To change email sender, cc, and bcc, refer to file 'application_mailer.rb'
<!-- TODO: UPDATE INFORMATION -->
To change mailing account, refer to file local_env.yml, replace contents
To change Google API key, refer to file credentials.yml.enc, access via terminal: EDITOR='code --wait' rails credentials:edit
<!-- TODO set static map options in one location -->
To change static map options update constants in map.js and quote_mailer.rb

<!-- TODO: Give master.key to ShovelSquad manager-->

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Support
If help is required regarding this application, you can contact rosa_at_gmail.com

## Roadmap
Future versions will have the following features:

* React front end
* Option of delimiting a service area and notifying if an address is outside of its limits
* Shovel Squad admin customer will be able to log in and keep track of quotes and mark as jobs finished or cancelled.
* Shovel Squad admin can update quotes if the needs to be adjustments and notify customer of changes
* Accept payments from customers at time of quote request
* Customer can log in and rate the service received after job is done


## License
[MIT](https://choosealicense.com/licenses/mit/)


Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

Prerequisites
What things you need to install the software and how to install them

Give examples
Installing
A step by step series of examples that tell you how to get a development env running

Say what the step will be

Give the example
And repeat

until finished
End with an example of getting some data out of the system or using it for a little demo

Running the tests
Explain how to run the automated tests for this system

Break down into end to end tests
Explain what these tests test and why

Give an example
And coding style tests
Explain what these tests test and why

Give an example
Deployment
Add additional notes about how to deploy this on a live system

Built With
Dropwizard - The web framework used
Maven - Dependency Management
ROME - Used to generate RSS Feeds
Contributing
Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests to us.

Versioning
We use SemVer for versioning. For the versions available, see the tags on this repository.

Authors
Billie Thompson - Initial work - PurpleBooth
See also the list of contributors who participated in this project.

License
This project is licensed under the MIT License - see the LICENSE.md file for details

Acknowledgments
Hat tip to anyone whose code was used
Inspiration
etc