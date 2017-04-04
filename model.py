"""Models and database functions for OuterSpaces project."""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

##############################################################################
# Model definitions


class User(db.Model):
    """User of OuterSpaces app."""

    __tablename__ = "users"

    user_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    email = db.Column(db.String(64), unique=True, nullable=False)
    password = db.Column(db.String(64), nullable=False)
    first_name = db.Column(db.Unicode(25), nullable=False)
    last_name = db.Column(db.Unicode(25), nullable=False)

    def __repr__(self):
        """Provide helpful representation when printed."""

        return "<User user_id={} email={} first_name={} last_name={}>".format(
                self.user_id, self.email, self.first_name, self.last_name)



class Truck(db.Model):
    """Food Trucks."""

    __tablename__ = "trucks"

    truck_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Unicode(100), nullable=False)
    address = db.Column(db.String(100), nullable=True)
    hours = db.Column(db.String(50), nullable=True)
    cuisine = db.Column(db.Unicode(500), nullable=True)
    lat = db.Column(db.String(20), nullable=False)
    lng = db.Column(db.String(20), nullable=False)

    def __repr__(self):
        """Provide helpful representation when printed."""

        return "<Truck truck_id={} name={} address={}>".format(
               self.truck_id, self.name, self.address)



class Popos(db.Model):
    """Privately owned public open spaces (POPOS)."""

    __tablename__ = "popos"

    popos_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.Unicode(100), nullable=False)
    address = db.Column(db.String(100), nullable=False)
    hours = db.Column(db.String(100), nullable=True)
    popos_type = db.Column(db.String(50), nullable=True)
    location = db.Column(db.String(100), nullable=True)
    description = db.Column(db.Unicode(500), nullable=True)
    year = db.Column(db.Integer, nullable=True)
    lat = db.Column(db.String(50), nullable=False)
    lng = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        """Provide helpful representation when printed."""

        return "<Popos popos_id={} name={}>".format(self.popos_id, self.name)



class Art(db.Model):
    """Public Art."""

    __tablename__ = "art"

    art_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    title = db.Column(db.Unicode(100), nullable=True)
    address = db.Column(db.Unicode(100), nullable=False)
    location = db.Column(db.Unicode(100), nullable=True)
    art_type = db.Column(db.String(50), nullable=True)
    medium = db.Column(db.String(50), nullable=True)
    artist_link = db.Column(db.String(200), nullable=True)
    lat = db.Column(db.String(50), nullable=False)
    lng = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        """Provide helpful representation when printed."""

        return "<Art art_id={} title={}>".format(self.art_id, self.title)



class FavTruck(db.Model):
    """Food Trucks favorited by a user."""

    __tablename__ = "fav_trucks"

    fav_truck_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))
    truck_id = db.Column(db.Integer, db.ForeignKey("trucks.truck_id"))
    
    user = db.relationship("User",backref=db.backref("fav_trucks"))
    truck = db.relationship("Truck",backref=db.backref("fav_trucks"))

    def __repr__(self):
        """Provide helpful representation when printed."""

        return "<FavTruck fav_truck_id={} user_id={} truck_id={}>".format(
               self.fav_truck_id, self.user_id, self.truck_id)



class FavPopos(db.Model):
    """POPOS favorited by a user."""

    __tablename__ = "fav_popos"

    fav_popos_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))
    popos_id = db.Column(db.Integer, db.ForeignKey("popos.popos_id"))
    
    user = db.relationship("User",backref=db.backref("fav_popos"))
    popos = db.relationship("Popos",backref=db.backref("fav_popos"))

    def __repr__(self):
        """Provide helpful representation when printed."""

        return "<FavPopos fav_popos_id={} user_id={} popos_id={}>".format(
               self.fav_popos_id, self.user_id, self.popos_id)



class FavArt(db.Model):
    """Public Art favorited by a user."""

    __tablename__ = "fav_art"

    fav_art_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))
    art_id = db.Column(db.Integer, db.ForeignKey("art.art_id"))
    
    user = db.relationship("User",backref=db.backref("fav_art"))
    art = db.relationship("Art",backref=db.backref("fav_art"))

    def __repr__(self):
        """Provide helpful representation when printed."""

        return "<FavArt fav_art_id={} user_id={} art_id={}>".format(
               self.fav_art_id, self.user_id, self.art_id)



##############################################################################
# Helper functions

def connect_to_db(app):
    """Connect the database to our Flask app."""

    # Configure to use our PostgreSQL database
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///outerspaces'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.app = app
    db.init_app(app)


if __name__ == "__main__":

    from server import app
    connect_to_db(app)
    print "Connected to DB."