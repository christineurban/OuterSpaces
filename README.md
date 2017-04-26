# OuterSpaces
OuterSpaces helps users find outside places to eat, sit, and see public art in San Francisco. An OuterSpace is a food truck, a privately-owned public open space, also known as POPOS, or public art, as part of the 1% Art Program. Users can view all locations on a map within San Francisco neighborhood boundaries, or have a trip created for them according to their current geolocation. A user can also get detailed information on each location, get walking or driving directions, find other nearby locations, search by name or keyword, and see locations near an address. In addition, users can sign up for an account and save/delete favorite OuterSpaces on their profile, as well as update their personal information.
![OuterSpaces Homepage](/static/images/OuterSpaces_screenshot_splash.png)


## Table of Contents

* [Tech Stack](#tech-stack)
* [Features](#features)
* [Setup/Installation](#installation)
* [To-Do](#future)
* [Author](#author)
* [License](#license)

## <a name="tech-stack"></a>Tech Stack

__Front End:__ JavaScript (AJAX, JSON), jQuery, Jinja2, Bootstrap, CSS, HTML
__Back End:__ Python, Flask, PostgreSQL, SQLAlchemy, Shapely, Flask-Cache
__APIs:__ Google Maps JavaScript, Geolocation, and Geocoding APIs; Socrata Open Data API

## <a name="#features"></a>Features

See all OuterSpaces on the map at once, or search for by name, cuisine, type, keyword, address or location in San Francisco. User account registration not required.
![OuterSpaces Map](/static/images/OuterSpaces_screenshot_map.png)
 
Register for an account to add and remove favorite OuterSpaces.
![OuterSpaces Profile](/static/images/OuterSpaces_screenshot_profile.png)
 
Look at OuterSpaces by category.
![OuterSpaces POPOS](/static/images/OuterSpaces_screenshot_popos.png)


## <a name="#installation"></a>Setup/Installation

To have this app running on your local computer, please follow the below steps:

Clone repository:
```
$ git clone https://github.com/christineurban/outerspaces.git
```
Create a virtual environment:
```
$ virtualenv env
```
Activate the virtual environment:
```
$ source env/bin/activate
```
Install dependencies:
```
$ pip install -r requirements.txt
```
Get your own keys for [SF OpenData](https://data.sfgov.org/developers) and [Google Maps](https://developers.google.com/maps/), and create your own secret key for Flask. Save them to a file `secrets.py`. Your file should look something like this:
```
export FLASK_SECRET_KEY="abc"
export SF_DATA_APP_TOKEN="abc"
export GOOGLE_MAPS_API_KEY="abc"
```
Create database "outerspaces":
```
python -i model.py
```
While in interactive mode, create tables:
```
db.create_all()
```
Now, quit interactive mode. Start up the flask server:
```
python server.py
```
Go to localhost:5000 with an active internet connection to use the web app

## <a name="future"></a>TODO
* Add ability to text name and address
* Add rating system for OuterSpaces
* Directions from entered address
* OAuth with Facebook / connect with FB friends

## <a name="author"></a>Author
OuterSpaces is a web app created by San Francisco Bay Area native and software engineer Christine Urban. Christine's heart is in the front end because she loves building upon the web's beauty and utility. Therefore, OuterSpace's heavy use of Google Maps and Javascript came naturally to Christine. This repository is the result of several weeks' work and uses current San Francisco data for a better user experience. Visit [christineurban.net](http://christineurban.net/) to see Christine's full professional portfolio.

## <a name="license"></a>License

MIT License

Copyright (c) 2017 Christine Urban

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.