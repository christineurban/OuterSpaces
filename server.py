from flask import (Flask, render_template, redirect, request, 
                   flash, session)

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


# @app.route('/data/art')
# def hello_world():
#     url = request.args.get('url')
#     response = requests.get(url)
#     if response.status_code == 200:
#         data = response.json()
#     return data



if __name__ == "__main__":
    
    app.debug = True # for DebugToolbarExtension
    app.jinja_env.auto_reload = app.debug  # make sure templates, etc. are not cached in debug mode

    connect_to_db(app)

    # Use the DebugToolbar
    DebugToolbarExtension(app)



    app.run(port=5000, host='0.0.0.0')