from flask import (Flask, render_template, redirect, request, 
                   flash, session, jsonify)

from jinja2 import StrictUndefined

from flask_debugtoolbar import DebugToolbarExtension

from model import (User, Truck, FavTruck, Popos, FavPopos, 
                   Art, FavArt, db, connect_to_db)

import os           # Access OS environment variables
import requests     # HTTP requests to Socrata API endpoints



app = Flask(__name__)

app.secret_key = os.environ["FLASK_SECRET_KEY"]

# raise an error if variable is undefined
app.jinja_env.undefined = StrictUndefined



@app.route("/")
def splash():
    """Splash page."""

    return render_template("index.html")


@app.route("/map")
def view_map():
    """Google Map of food trucks, POPOS, and public art"""

    # get Google Maps key
    key = os.environ["GOOGLE_MAPS_API_KEY"]
                           
    return render_template("map.html",
                           key=key)


@app.route("/account")
def login_or_sign_up():
    """Log in or sign up for an account."""

    return render_template("account.html")


@app.route("/profile")
def view_profile():
    """View profile and favorites."""

    return render_template("profile.html")


# get SF DATA app token 
sf_data = os.environ["SF_DATA_APP_TOKEN"]


@app.route("/data/trucks.json")
def get_trucks():
    """Get food truck data from API as JSON."""

    url = "https://data.sfgov.org/resource/6a9r-agq8.json?$$app_token=" + sf_data
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
    else:
        status = response.status.code
        raise AssertionError("Route /data/trucks.json status code: {}".format(
                             status))
    return jsonify(data)


@app.route("/data/popos.json")
def get_popos():
    """Get POPOS data from API as JSON."""

    url = "https://data.sfgov.org/resource/3ub7-d4yy.json?$$app_token=" + sf_data
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
    else:
        status = response.status.code
        raise AssertionError("Route /data/popos.json status code: {}".format(
                             status))
    return jsonify(data)


@app.route("/data/art.json")
def get_art():
    """Get public art data from API as JSON."""

    url = "https://data.sfgov.org/resource/8fe8-yww8.json?$$app_token=" + sf_data
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
    else:
        status = response.status.code
        raise AssertionError("Route /data/art.json status code: {}".format(
                             status))
    return jsonify(data)


if __name__ == "__main__":
    
    app.debug = True # for DebugToolbarExtension
    app.jinja_env.auto_reload = app.debug  # make sure templates, etc. are not cached in debug mode

    connect_to_db(app)

    # Use the DebugToolbar
    DebugToolbarExtension(app)



    app.run(port=5000, host='0.0.0.0')