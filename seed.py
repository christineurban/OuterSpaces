from model import (User, Truck, Popos, Art, FavTruck, FavPopos, FavArt,
                   db, connect_to_db)


def example_data():
    """Create some sample data."""

    jane = User(email="abc@abc.com",
                password="abc",
                first_name="Jane",
                last_name="Doe")

    swell = Truck(name="Swell Cream & Coffee",
                  address="2450 TARAVAL ST",
                  cuisine="Ice cream: coffee: pastries",
                  lat="37.7425503735592",
                  lng="-122.492677082215")
    

    mission = Popos(name="555 Mission St",
                    address="555 Mission St",
                    location="Western side of Building, street level.",
                    popos_type="Plaza",
                    hours="Open at all times",
                    description="This large plaza has several art and \
                    landscaping features. It is located in front of 555 \
                    Mission Streets and runs along the west side of the \
                    building. There are several distinct sitting areas with \
                    different styles of seating.",
                    year=2008,
                    lat="-122.39891",
                    lng="37.7884")


    sansome = Art(address="343 Sansome",
                  title="'\"Four Seasons\"' by Joan Brown",
                  art_type="obelisk",
                  medium="tile",
                  location="roof garden",
                  artist_link="http://en.wikipedia.org/wiki/Joan_Brown",
                  lat="-122.401572",
                  lng="37.793616")


    db.session.add_all([swell, mission, sansome, jane])
    db.session.commit()


def example_data_favs():
    """Create more sample data."""

    fav_truck = FavTruck(user_id=1,
                         truck_id=1)


    fav_popos = FavPopos(user_id=1,
                         popos_id=1)


    fav_art = FavArt(user_id=1,
                     art_id=1)


    db.session.add_all([fav_truck, fav_popos, fav_art])
    db.session.commit()



if __name__ == "__main__":

    from server import app
    connect_to_db(app)
    print "Connected to DB."

    # example_data()


# Unicode warning can be ignored
# https://github.com/privacyidea/privacyidea/issues/200
