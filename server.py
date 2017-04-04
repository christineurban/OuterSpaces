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



@app.route("/login", methods=["POST"])
def login():
    """Log in to your account."""

    email = request.form.get("emailLogin")
    password = request.form.get("pwLogin")

    try:
        user = User.query.filter_by(email = email).one()
        if user.password == password:
            session["user_id"] = user.user_id
            session["email"] = user.email
            session["first_name"] = user.first_name
            session["last_name"] = user.last_name
            flash("Welcome back " + user.first_name + "!")
            return render_template("profile.html")

    except:
        flash("Sorry, this does not match our records." + \
              " Please check your spelling and try again.")
        return redirect("/account")



@app.route("/signup", methods=["POST"])
def signup():
    """Sign up for an account."""

    first_name = request.form.get("fNameSignup")
    last_name = request.form.get("lNameSignup")
    email = request.form.get("emailSignup")
    password = request.form.get("pwSignup")

    if User.query.filter_by(email = email).first():
        flash("This email address is already registered.")
        return redirect("/account")

    else:    
        user = User(first_name=first_name,
                    last_name=last_name,
                    email=email,
                    password=password)

        db.session.add(user)
        db.session.commit()
        flash("Thank you for registering!")
        return render_template("profile.html")



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



@app.route("/favorite-truck", methods=["POST"])
def add_truck_to_favorites():
    """Add a food truck to favorites."""

    print request.form
    return "hi"



@app.route("/favorite-popos", methods=["POST"])
def add_popos_to_favorites():
    """Add a POPOS to favorites."""

    print request.form
    return "hi"



@app.route("/favorite-art", methods=["POST"])
def add_art_to_favorites():
    """Add a public art location to favorites."""

    print request.form
    return "hi"





if __name__ == "__main__":
    
    app.debug = True # for DebugToolbarExtension
    app.jinja_env.auto_reload = app.debug  # make sure templates, etc. are not cached in debug mode

    connect_to_db(app)

    # Use the DebugToolbar
    DebugToolbarExtension(app)



    app.run(port=5000, host='0.0.0.0')