from flask import (Flask, render_template, redirect, request, 
                   flash, session, jsonify)

from jinja2 import StrictUndefined

from flask_debugtoolbar import DebugToolbarExtension

from model import (User, Truck, FavTruck, Popos, FavPopos, 
                   Art, FavArt, db, connect_to_db)

import requests    # HTTP requests to Socrata API endpoints



app = Flask(__name__)

app.secret_key = "ABC"

app.jinja_env.undefined = StrictUndefined
# raise an error if variable is undefined



@app.route("/")
def splash():
    """Splash page."""

    return render_template("index.html")


@app.route("/map")
def view_map():
    """Google Map of food trucks, POPOS, and public art"""

    return render_template("map.html")


@app.route("/account")
def login_or_sign_up():
    """Log in or sign up for an account."""

    return render_template("account.html")


@app.route("/profile")
def view_profile():
    """View profile and favorites."""

    return render_template("profile.html")


@app.route("/data/trucks.json")
def get_trucks():
    """Get food truck data from API as JSON."""

    url = "https://data.sfgov.org/resource/6a9r-agq8.json?$$app_token=ZdU790C4h4Zuose6A2U3DGjld"
    response = requests.get(url)
    print response.status_code
    if response.status_code == 200:
        data = response.json()
    return jsonify(data)


@app.route("/data/popos.json")
def get_popos():
    """Get POPOS data from API as JSON."""

    url = "https://data.sfgov.org/resource/3ub7-d4yy.json?$$app_token=ZdU790C4h4Zuose6A2U3DGjld"
    response = requests.get(url)
    print response.status_code
    if response.status_code == 200:
        data = response.json()
    return jsonify(data)


@app.route("/data/art.json")
def get_art():
    """Get public art data from API as JSON."""

    url = "https://data.sfgov.org/resource/8fe8-yww8.json?$$app_token=ZdU790C4h4Zuose6A2U3DGjld"
    response = requests.get(url)
    print response.status_code
    if response.status_code == 200:
        data = response.json()
    return jsonify(data)


if __name__ == "__main__":
    
    app.debug = True # for DebugToolbarExtension
    app.jinja_env.auto_reload = app.debug  # make sure templates, etc. are not cached in debug mode

    connect_to_db(app)

    # Use the DebugToolbar
    DebugToolbarExtension(app)



    app.run(port=5000, host='0.0.0.0')