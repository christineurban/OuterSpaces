import model

def example_data():
    """Create some sample data."""

    swell = model.Truck(truck_id=931094,
                        name="Swell Cream & Coffee",
                        address="2450 TARAVAL ST",
                        cuisine="Ice cream: coffee: pastries",
                        lat="37.7425503735592",
                        lon="-122.492677082215")
    

    mission = model.Popos(name="555 Mission St",
                          address="555 Mission St",
                          location="Western side of Building, street level.",
                          popos_type="Plaza",
                          hours="Open at all times",
                          landscaping="Trees",
                          art="Yes",
                          food="Y",
                          seating="Y",
                          restrooms="None",
                          description="This large plaza has several art and landscaping features. It is located in front of 555 Mission Streets and runs along the west side of the building. There are several distinct sitting areas with different styles of seating.",
                          year="2008",
                          lat="-122.39891",
                          lon="37.7884")


    sansome = model.Art(address="343 Sansome",
                        title="'\"Four Seasons\"' by Joan Brown",
                        art_type="obelisk",
                        medium="tile",
                        location="roof garden",
                        artist_link="http://en.wikipedia.org/wiki/Joan_Brown",
                        lat="-122.401572",
                        lon="37.793616")


    jane = model.User(email="abc@abc.com",
                      password="abc",
                      first_name="Jane",
                      last_name="Doe")

    model.db.session.add_all([swell, mission, sansome, jane])
    model.db.session.commit()


if __name__ == "__main__":

    from server import app
    model.connect_to_db(app)
    print "Connected to DB."

    example_data()