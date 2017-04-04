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

        session["user_id"] = user.user_id
        session["email"] = user.email
        session["first_name"] = user.first_name
        session["last_name"] = user.last_name

        flash("Thank you for registering!")
        return render_template("profile.html")



@app.route("/profile")
def view_profile():
    """View profile and favorites."""

    return render_template("profile.html")




################################################################################
# Add to favorites


@app.route("/favorite-truck", methods=["POST"])
def add_truck_to_favorites():
    """Add a food truck to favorites."""

    try:
        user_id = session["user_id"]

        name = request.form.get("name")
        address = request.form.get("address")
        hours = request.form.get("hours")
        cuisine = request.form.get("cuisine")
        lat = request.form.get("lat")
        lng = request.form.get("lng")

        truck_in_db = Truck.query.filter(Truck.name == name, 
                                         Truck.address == address).first()

        if truck_in_db:
            # get truck id
            truck_id = truck_in_db.truck_id

            # check if user has already favorited truck
            if FavTruck.query.filter(FavTruck.user_id == user_id,
                                     FavTruck.truck_id == truck_id).first():
                return "This spot is already in your favorites."    

        else:
            # if truck not in DB, add truck
            new_truck = Truck(name=name,
                              address=address,
                              hours=hours,
                              cuisine=cuisine,
                              lat=lat,
                              lng=lng)

            db.session.add(new_truck)
            db.session.commit()
            # update truck id with just added truck
            truck_id = new_truck.truck_id


        fav_truck = FavTruck(user_id=user_id,
                             truck_id=truck_id)

        db.session.add(fav_truck)
        db.session.commit()
        return "Added to favorites!"

    except:
        return "Oops! You must be logged in to save a favorite."


@app.route("/favorite-popos", methods=["POST"])
def add_popos_to_favorites():
    """Add a POPOS to favorites."""

    try:
        user_id = session["user_id"]

        name = request.form.get("name")
        address = request.form.get("address")
        hours = request.form.get("hours")
        popos_type = request.form.get("popos_type")
        location = request.form.get("location")
        description = request.form.get("description")
        year = request.form.get("year")
        lat = request.form.get("lat")
        lng = request.form.get("lng")

        popos_in_db = Popos.query.filter(Popos.name == name, 
                                         Popos.address == address).first()

        if popos_in_db:
            # get popos id
            popos_id = popos_in_db.popos_id

            # check if user has already favorited popos
            if FavPopos.query.filter(FavPopos.user_id == user_id,
                                     FavPopos.popos_id == popos_id).first():
                return "This space is already in your favorites."    

        else:
            # if popos not in DB, add popos
            new_popos = Popos(name=name,
                              address=address,
                              hours=hours,
                              popos_type=popos_type,
                              location=location,
                              description=description,
                              year=year,
                              lat=lat,
                              lng=lng)

            db.session.add(new_popos)
            db.session.commit()
            # update popos id with just added popos
            popos_id = new_popos.popos_id


        fav_popos = FavPopos(user_id=user_id,
                             popos_id=popos_id)

        db.session.add(fav_popos)
        db.session.commit()
        return "Added to favorites!"

    except:
        return "Oops! You must be logged in to save a favorite."


@app.route("/favorite-art", methods=["POST"])
def add_art_to_favorites():
    """Add a public art location to favorites."""

    try:
        user_id = session["user_id"]

        title = request.form.get("title")
        address = request.form.get("address")
        location = request.form.get("location")
        art_type = request.form.get("art_type")
        medium = request.form.get("medium")
        artist_link = request.form.get("artist_link")
        lat = request.form.get("lat")
        lng = request.form.get("lng")

        art_in_db = Art.query.filter(Art.title == title, 
                                     Art.address == address).first()

        if art_in_db:
            # get art id
            art_id = art_in_db.art_id

            # check if user has already favorited art
            if FavArt.query.filter(FavArt.user_id == user_id,
                                   FavArt.art_id == art_id).first():
                return "This spot is already in your favorites."    

        else:
            # if art not in DB, add art
            new_art = Art(title=title,
                          address=address,
                          location=location,
                          art_type=art_type,
                          medium=medium,
                          artist_link=artist_link,
                          lat=lat,
                          lng=lng)

            db.session.add(new_art)
            db.session.commit()
            # update art id with just added art
            art_id = new_art.art_id


        fav_art = FavArt(user_id=user_id,
                         art_id=art_id)

        db.session.add(fav_art)
        db.session.commit()
        return "Added to favorites!"

    except:
        return "Oops! You must be logged in to save a favorite."


################################################################################
# Get data from API


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