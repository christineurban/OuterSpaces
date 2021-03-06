from flask import (Flask, render_template, redirect, request, 
                   flash, session, jsonify, g)

from jinja2 import StrictUndefined

from flask_debugtoolbar import DebugToolbarExtension

from model import (User, Truck, FavTruck, Popos, FavPopos, Art, FavArt, 
                   db, connect_to_db)

from server_utilities import (app, get_truck_data_cached, get_popos_data_cached,
    get_art_data_cached, get_hood_data_cached, display_trucks, display_popos, 
    display_art, display_by_hood_cached)

from passlib.hash import pbkdf2_sha256

import os           # Access OS environment variables
import string

# app = Flask(__name__)
app.secret_key = os.environ["FLASK_SECRET_KEY"]
google_maps_key = os.environ["GOOGLE_MAPS_API_KEY"]

# raise an error if variable is undefined
app.jinja_env.undefined = StrictUndefined

# Jasmine
JS_TESTING_MODE = False

@app.before_request
def add_tests():
    g.jasmine_tests = JS_TESTING_MODE


################################################################################
# Pages

@app.route("/")
def splash():
    """Splash page."""

    return render_template("index.html")


@app.route("/map", methods=["GET", "POST"])
def view_map():
    """Google Map of food trucks, POPOS, and public art"""

    id = "view_map"
                           
    return render_template("map.html",
                           key=google_maps_key,
                           id=id,
                           lat=None,
                           lng=None,
                           identifier=None)


@app.route("/one", methods=["POST"])
def map_one():
    """Google Map of specific favorite"""

    id = "map_one"

    lat = request.form.get("lat")
    lng = request.form.get("lng")
    identifier = request.form.get("identifier").lower()
                    
    return render_template("map.html",
                           key=google_maps_key,
                           id=id,
                           lat=lat,
                           lng=lng,
                           identifier=identifier)


@app.route("/plan", methods=["POST"])
def plan_trip():
    """Plan trip based on current location."""

    id = "plan_trip"
    identifier = request.form.get("plan_my_trip")

    return render_template("map.html",
                           key=google_maps_key,
                           id=id,
                           lat=None,
                           lng=None,
                           identifier=identifier)


@app.route("/account")
def login_or_sign_up():
    """Log in or sign up for an account."""

    return render_template("account.html")


@app.route("/profile")
def view_profile():
    """View profile and favorites."""

    if "user_id" in session:
        fav_trucks = FavTruck.query.filter_by(user_id = session["user_id"]).all()
        fav_popos = FavPopos.query.filter_by(user_id = session["user_id"]).all()
        fav_art = FavArt.query.filter_by(user_id = session["user_id"]).all()

        if not fav_trucks:
            fav_trucks = []

        if not fav_popos:
            fav_popos = []

        if not fav_art:
            fav_art = []

        return render_template("profile.html",
                               fav_trucks=fav_trucks,
                               fav_popos=fav_popos,
                               fav_art=fav_art)
    else:
        flash("Please log in or sign up to view your profile.")
        return redirect("/account")


@app.route("/trucks")
def view_trucks():
    """View all food trucks."""

    total_trucks, truck_dict = display_trucks()

    return render_template("food-trucks.html",
                           total_trucks=total_trucks,
                           truck_dict=truck_dict)


@app.route("/popos")
def view_popos():
    """View all POPOS."""

    total_popos, popos_dict = display_popos()

    return render_template("popos.html",
                           total_popos=total_popos,
                           popos_dict=popos_dict)


@app.route("/art")
def view_art():
    """View all art."""

    total_art, art_dict = display_art()

    return render_template("art.html",
                           total_art=total_art,
                           art_dict=art_dict)


@app.route("/hoods")
def view_hoods():
    """View all locations by neighborhood."""

    total_hoods, hood_dict = display_by_hood_cached()

    return render_template("neighborhoods.html",
                           total_hoods=total_hoods,
                           hood_dict=hood_dict)


################################################################################
# Account-related

@app.route("/log_in", methods=["POST"])
def log_in():
    """Log in to your account."""

    email = request.form.get("emailLogIn")
    password = request.form.get("pwLogIn")

    if User.query.filter_by(email = email).first():
        user = User.query.filter_by(email = email).first()
        if pbkdf2_sha256.verify(password, user.password):
            session["user_id"] = user.user_id
            session["email"] = user.email
            session["first_name"] = user.first_name
            session["last_name"] = user.last_name
            flash("Welcome back {}!".format(user.first_name))
            return redirect("/profile")

    flash("Sorry, that combination does not match our records. \
          Please check your spelling and try again.")
    return redirect("/account")


@app.route("/sign_up", methods=["POST"])
def sign_up():
    """Sign up for an account."""

    first_name = request.form.get("fNameSignUp")
    last_name = request.form.get("lNameSignUp")
    email = request.form.get("emailSignUp")
    password = request.form.get("pwSignUp")

    pw_hash = pbkdf2_sha256.hash(password)

    if User.query.filter_by(email = email).first():
        flash("This email address is already registered.")
        return redirect("/account")

    else:    
        user = User(first_name=first_name,
                    last_name=last_name,
                    email=email,
                    password=pw_hash)

        db.session.add(user)
        db.session.commit()

        session["user_id"] = user.user_id
        session["email"] = user.email
        session["first_name"] = user.first_name
        session["last_name"] = user.last_name

        flash("Thank you for registering, {}, and welcome to OuterSpaces! \
            You can now add favorites to your profile from any page or the map.\
            Have fun, you Space cadet, you!".format(
            user.first_name))
        return redirect("/profile")


@app.route("/sign_out")
def sign_out():
    """Sign out of account."""

    if "user_id" in session:
        del session["user_id"]
        del session["email"] 
        del session["first_name"] 
        del session["last_name"]

        flash("You have successfully signed out. See you next time!")
        return redirect("/")


@app.route("/change_password", methods=["POST"])
def change_password():
    """Change user password."""

    user_id = session["user_id"]
    old_password = request.form.get("old_password")
    new_password = request.form.get("new_password")
    user = User.query.get(user_id)

    if pbkdf2_sha256.verify(old_password, user.password):
        pw_hash = pbkdf2_sha256.hash(new_password)
        user.password = pw_hash
        db.session.commit()

        flash("You have successfully changed your password.")
        return redirect("/profile")

    else:
        flash("Sorry, that password does not match our records. \
              Please check your spelling and try again.")
        return redirect("/profile")


@app.route("/change_email", methods=["POST"])
def change_email():
    """Change user email address."""

    user_id = session["user_id"]
    new_email = request.form.get("new_email")
    user = User.query.get(user_id)

    user.email = new_email
    session["email"] = new_email
    db.session.commit()

    flash("You have successfully changed your email address.")
    return redirect("/profile")


@app.route("/delete_account", methods=["POST"])
def delete_account():
    """Delete user account."""

    user_id = session["user_id"]
    fav_trucks = FavTruck.query.filter(FavTruck.user_id == user_id).all()
    fav_popos = FavPopos.query.filter(FavPopos.user_id == user_id).all()
    fav_art = FavArt.query.filter(FavArt.user_id == user_id).all()
    all_favs = fav_trucks + fav_popos + fav_art

    for fav in all_favs:
        db.session.delete(fav)

    user = User.query.get(user_id)
    db.session.delete(user)

    del session["user_id"]
    del session["email"] 
    del session["first_name"] 
    del session["last_name"]

    db.session.commit()

    flash("We are sorry to see you go ='[")
    return redirect("/")


################################################################################
# Add/delete favorites

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
                return "Lucky for you, {} ({}) is already in your favorites!".format(
                       name, address)    

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
        return "Added {} ({}) to favorites!".format(name, address)

    except:
        return "Oops! You must be logged in to save a favorite. \
                <a href='/account'>Log in or sign up &raquo;</a>"


@app.route("/favorite-popos", methods=["POST"])
def add_popos_to_favorites():
    """Add a POPOS to favorites."""

    try:
        user_id = session["user_id"]

        name = request.form.get("name")
        address = request.form.get("address")
        hours = request.form.get("hours")
        location = request.form.get("location")
        popos_type = request.form.get("popos_type")
        year = request.form.get("year")
        description = request.form.get("description")
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
                return "Lucky for you, {} is already in your favorites!".format(
                       name)   

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
        return "Added {} to favorites!".format(name)

    except:
        return "Oops! You must be logged in to save a favorite. \
               <a href='/account'>Log in or sign up &raquo;</a>"


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
                return "Lucky for you, {} is already in your favorites!".format(
                       title)   

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
        return "Added {} to favorites!".format(title)

    except:
        return "Oops! You must be logged in to save a favorite. \
               <a href='/account'>Log in or sign up &raquo;</a>"


@app.route("/delete-fav-truck", methods=["POST"])
def delete_fav_truck():
    """Delete favorite truck from profile page."""

    user_id = session["user_id"]
    fav_truck_id = request.form.get("fav_truck_id")
    name = request.form.get("name")
    address = request.form.get("address")

    fav = FavTruck.query.filter(FavTruck.user_id == user_id,
                                FavTruck.fav_truck_id == fav_truck_id).first()

    db.session.delete(fav)
    db.session.commit()

    flash("You have successfully deleted {} ({}) from your favorites.".format(
          name, address))
    return redirect("/profile")


@app.route("/delete-fav-popos", methods=["POST"])
def delete_fav_popos():
    """Delete favorite POPOS from profile page."""

    user_id = session["user_id"]
    fav_popos_id = request.form.get("fav_popos_id")
    name = request.form.get("name")

    fav = FavPopos.query.filter(FavPopos.user_id == user_id,
                                FavPopos.fav_popos_id == fav_popos_id).first()

    db.session.delete(fav)
    db.session.commit()

    flash("You have successfully deleted {} from your favorites.".format(name))
    return redirect("/profile")


@app.route("/delete-fav-art", methods=["POST"])
def delete_fav_art():
    """Delete favorite art from profile page."""

    user_id = session["user_id"]
    fav_art_id = request.form.get("fav_art_id")
    name = request.form.get("name")

    fav = FavArt.query.filter(FavArt.user_id == user_id,
                                FavArt.fav_art_id == fav_art_id).first()

    db.session.delete(fav)
    db.session.commit()

    flash("You have successfully deleted {} from your favorites.".format(name))
    return redirect("/profile")


################################################################################
# Get data from API

@app.route("/data/trucks.json")
def get_trucks():
    """Get food truck data from API as JSON."""

    trucks = get_truck_data_cached()
        
    return jsonify(trucks)


@app.route("/data/popos.json")
def get_popos():
    """Get POPOS data from API as JSON."""

    popos = get_popos_data_cached()
        
    return jsonify(popos)


@app.route("/data/art.json")
def get_art():
    """Get public art data from API as JSON."""

    art = get_art_data_cached()
        
    return jsonify(art)


@app.route("/data/hoods.json")
def get_hoods():
    """Get public art data from API as JSON."""

    hoods = get_hood_data_cached()
        
    return jsonify(hoods)


@app.route("/data/gkey")
def get_gkey():
    """Pass gkey to front-end."""

    return google_maps_key


################################################################################

if __name__ == "__main__":
    
    # app.debug = True # for DebugToolbarExtension
    app.jinja_env.auto_reload = app.debug  # make sure templates, etc. are not cached in debug mode

    connect_to_db(app)

    # Use the DebugToolbar
    # DebugToolbarExtension(app)

    # Jasmine
    import sys
    if sys.argv[-1] == "jstest":
        JS_TESTING_MODE = True

    app.run(port=5000, host='0.0.0.0', threaded=True)