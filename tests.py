import unittest
import os
from server import app
from model import db, connect_to_db
from seed import example_data, example_data_favs

google_maps_key = os.environ["GOOGLE_MAPS_API_KEY"]


class OuterSpacesTests(unittest.TestCase):
    """Flask tests on routes."""

    def setUp(self):
        self.client = app.test_client()
        app.config["TESTING"] = True
        app.config["SECRET_KEY"] = "key"


    def test_homepage(self):
        """Test homepage."""

        result = self.client.get("/")
        self.assertEqual(result.status_code, 200)
        self.assertIn("Find an OuterSpace", result.data)


    def test_map(self):
        """Test map page."""

        result = self.client.get("/map")
        self.assertEqual(result.status_code, 200)
        self.assertIn("Map | OuterSpaces", result.data)


    def test_trucks(self):
        """Test food trucks page."""

        result = self.client.get("/trucks")
        self.assertEqual(result.status_code, 200)
        self.assertIn("Food Trucks | OuterSpaces", result.data)


    def test_popos(self):
        """Test POPOS page."""

        result = self.client.get("/popos")
        self.assertEqual(result.status_code, 200)
        self.assertIn("POPOS | OuterSpaces", result.data)


    def test_art(self):
        """Test art page."""

        result = self.client.get("/art")
        self.assertEqual(result.status_code, 200)
        self.assertIn("Public Art | OuterSpaces", result.data)


    def test_neighborhoods(self):
        """Test neighborhoods page."""

        result = self.client.get("/hoods")
        self.assertEqual(result.status_code, 200)
        self.assertIn("Neighborhoods | OuterSpaces", result.data)


    def test_account(self):
        """Test account page."""

        result = self.client.get("/account")
        self.assertEqual(result.status_code, 200)
        self.assertIn("Log In or Sign Up | OuterSpaces", result.data)


    def test_profile(self):
        """Test profile page: not logged in."""

        result = self.client.get("/profile",
                                 follow_redirects=True)
        self.assertEqual(result.status_code, 200)
        self.assertIn("Please log in or sign up to view your profile.", result.data)


    def test_one(self):
        """Test one route."""

        result = self.client.post("/one",
                                  data={"lat": "37.7425503735592",
                                        "lng": "-122.492677082215",
                                        "identifier": "Swell Cream & Coffee"},
                                  follow_redirects=True)
        self.assertEqual(result.status_code, 200)
        self.assertIn('id="map_one"', result.data)


    def test_plan(self):
        """Test plan route."""

        result = self.client.get("/plan")
        self.assertEqual(result.status_code, 200)
        self.assertIn('id="plan_trip"', result.data)


    def test_data_trucks(self):
        """Test truck data route."""

        result = self.client.get("/data/trucks.json")
        self.assertEqual(result.status_code, 200)
        self.assertIn(":@computed_region_bh8s_q3mv", result.data)


    def test_data_popos(self):
        """Test POPOS data route."""

        result = self.client.get("/data/popos.json")
        self.assertEqual(result.status_code, 200)
        self.assertIn(":@computed_region_ajp5_b2md", result.data)


    def test_data_art(self):
        """Test art data route."""

        result = self.client.get("/data/art.json")
        self.assertEqual(result.status_code, 200)
        self.assertIn(":@computed_region_ajp5_b2md", result.data)


    def test_data_hoods(self):
        """Test hoods data route."""

        result = self.client.get("/data/hoods.json")
        self.assertEqual(result.status_code, 200)
        self.assertIn("-122.49345526799993", result.data)


    def test_data_gkey(self):
        """Test gkey data route."""

        result = self.client.get("/data/gkey")
        self.assertEqual(result.status_code, 200)
        self.assertIn(google_maps_key, result.data)


    def test_favorite_truck(self):
        """Test favorite truck route."""

        result = self.client.post("/favorite-truck")
        self.assertEqual(result.status_code, 200)
        self.assertIn("Oops! You must be logged in to save a favorite.", result.data)


    def test_favorite_popos(self):
        """Test favorite POPOS route."""

        result = self.client.post("/favorite-popos")
        self.assertEqual(result.status_code, 200)
        self.assertIn("Oops! You must be logged in to save a favorite.", result.data)


    def test_favorite_art(self):
        """Test favorite art route."""

        result = self.client.post("/favorite-art")
        self.assertEqual(result.status_code, 200)
        self.assertIn("Oops! You must be logged in to save a favorite.", result.data)




class OuterSpacesTestsDatabase(unittest.TestCase):
    """Flask tests that use the database."""

    def setUp(self):
        """Stuff to do before every test."""

        # Get the Flask test client
        self.client = app.test_client()
        with self.client as c:
            with c.session_transaction() as session:
                session["user_id"] = 1
                session["email"] = "abc@abc.com"
                session["first_name"] = "Jane"
                session["last_name"] = "Doe"

        # Show Flask errors that happen during tests
        app.config["TESTING"] = True

        # Connect to test database
        connect_to_db(app, "postgresql:///outerspacestest")

        # Create tables and add sample data
        db.create_all()
        example_data()
        example_data_favs()


    def tearDown(self):
        """Do at end of every test."""

        db.session.close()
        db.drop_all()


    def test_profile(self):
        """Test profile page: logged in."""

        result = self.client.get("/profile")
        self.assertEqual(result.status_code, 200)
        self.assertIn("Profile | OuterSpaces", result.data)


    def test_sign_out(self):
        """Test sign out route."""

        result = self.client.get("/sign_out",
                                 follow_redirects=True)
        self.assertEqual(result.status_code, 200)
        self.assertIn("See you next time!", result.data)


    def test_change_password(self):
        """Test change password route."""

        result = self.client.post("/change_password",
                                  data={"new_password": "abcdefg"},
                                  follow_redirects=True)
        self.assertEqual(result.status_code, 200)
        self.assertIn("You have successfully changed your password.", result.data)


    def test_change_email(self):
        """Test change email route."""

        result = self.client.post("/change_email",
                                  data={"new_email": "123@123.com"},
                                  follow_redirects=True)
        self.assertEqual(result.status_code, 200)
        self.assertIn("You have successfully changed your email address.", result.data)


    def test_delete_fav_truck(self):
        """Test delete favorite truck route."""

        result = self.client.post("/delete-fav-truck",
                                  data={"fav_truck_id": 1,
                                        "name": "Swell Cream & Coffee",
                                        "address": "2450 TARAVAL ST"},
                                  follow_redirects=True)
        self.assertEqual(result.status_code, 200)
        self.assertIn("You have successfully deleted", result.data)


    def test_delete_fav_popos(self):
        """Test delete favorite POPOS route."""

        result = self.client.post("/delete-fav-popos",
                                  data={"fav_popos_id": 1,
                                        "name": "555 Mission St"},
                                  follow_redirects=True)
        self.assertEqual(result.status_code, 200)
        self.assertIn("You have successfully deleted", result.data)


    def test_delete_fav_art(self):
        """Test delete favorite art route."""

        result = self.client.post("/delete-fav-art",
                                  data={"fav_art_id": 1,
                                        "name": "'\"Four Seasons\"' by Joan Brown"},
                                  follow_redirects=True)
        self.assertEqual(result.status_code, 200)
        self.assertIn("You have successfully deleted", result.data)


    def test_delete_account(self):
        """Test delete account route."""

        result = self.client.post("/delete_account",
                                  follow_redirects=True)
        self.assertEqual(result.status_code, 200)
        self.assertIn("We are sorry to see you go ='[", result.data)


    def test_favorite_truck_already_in_favorites(self):
        """Test if favorite truck is already in favorites."""

        result = self.client.post("/favorite-truck",
                                  data={"name": "Swell Cream & Coffee",
                                        "address": "2450 TARAVAL ST",
                                        "cuisine": "Ice cream: coffee: pastries",
                                        "lat": "37.7425503735592",
                                        "lng": "-122.492677082215"},
                                  follow_redirects=True)
        self.assertEqual(result.status_code, 200)
        self.assertIn("Lucky for you", result.data)


    def test_favorite_popos_already_in_favorites(self):
        """Test if favorite POPOS is already in favorites."""

        result = self.client.post("/favorite-popos",
                                  data={"name": "555 Mission St",
                                        "address": "555 Mission St",
                                        "location": "Western side of Building, street level.",
                                        "popos_type": "Plaza",
                                        "hours": "Open at all times",
                                        "description": "This large plaza has several art and \
                                        landscaping features. It is located in front of 555 \
                                        Mission Streets and runs along the west side of the \
                                        building. There are several distinct sitting areas with \
                                        different styles of seating.",
                                        "year": "2008",
                                        "lat": "-122.39891",
                                        "lng": "37.7884"},
                                  follow_redirects=True)
        self.assertEqual(result.status_code, 200)
        self.assertIn("Lucky for you", result.data)



    def test_favorite_art_already_in_favorites(self):
        """Test if favorite art is already in favorites."""

        result = self.client.post("/favorite-art",
                                  data={"address": "343 Sansome",
                                        "title": "'\"Four Seasons\"' by Joan Brown",
                                        "art_type": "obelisk",
                                        "medium": "tile",
                                        "location": "roof garden",
                                        "artist_link": "http://en.wikipedia.org/wiki/Joan_Brown",
                                        "lat": "-122.401572",
                                        "lng": "37.793616"},
                                  follow_redirects=True)
        self.assertEqual(result.status_code, 200)
        self.assertIn("Lucky for you", result.data)


    def test_favorite_truck_in_database(self):
        """Test if favorite truck is already in database."""

        result = self.client.post("/favorite-truck",
                                  data={"name": "name",
                                        "address": "address",
                                        "cuisine": "cuisine",
                                        "lat": "lat",
                                        "lng": "lng"},
                                  follow_redirects=True)
        self.assertEqual(result.status_code, 200)
        self.assertIn("Added", result.data)


    def test_favorite_popos_in_database(self):
        """Test if favorite POPOS is already in database."""

        result = self.client.post("/favorite-popos",
                                  data={"name": "name",
                                        "address": "address",
                                        "location": "location",
                                        "popos_type": "popos_type",
                                        "hours": "hours",
                                        "description": "description",
                                        "year": 2008,
                                        "lat": "lat",
                                        "lng": "lng"},
                                  follow_redirects=True)
        self.assertEqual(result.status_code, 200)
        self.assertIn("Added", result.data)



    def test_favorite_art_in_database(self):
        """Test if favorite art is already in database."""

        result = self.client.post("/favorite-art",
                                  data={"address": "address",
                                        "title": "title",
                                        "art_type": "art_type",
                                        "medium": "medium",
                                        "location": "location",
                                        "artist_link": "artist_link",
                                        "lat": "lat",
                                        "lng": "lng"},
                                  follow_redirects=True)
        self.assertEqual(result.status_code, 200)
        self.assertIn("Added", result.data)




class OuterSpacesTestsDatabaseNoSession(unittest.TestCase):
    """Flask tests that use the database without session."""

    def setUp(self):
        """Stuff to do before every test."""

        # Get the Flask test client
        self.client = app.test_client()

        # Show Flask errors that happen during tests
        app.config["TESTING"] = True

        # Connect to test database
        connect_to_db(app, "postgresql:///outerspacestest")

        # Create tables and add sample data
        db.create_all()
        example_data()
        example_data_favs()


    def tearDown(self):
        """Do at end of every test."""

        db.session.close()
        db.drop_all()


    def test_sign_up(self):
        """Test sign up route."""

        result = self.client.post("/sign_up",
                                  data={"fNameSignUp": "Curious",
                                        "lNameSignUp": "George",
                                        "emailSignUp": "cg@gmail.com",
                                        "pwSignUp": "abc"},
                                  follow_redirects=True)
        self.assertEqual(result.status_code, 200)
        self.assertIn("Thank you for registering", result.data)


    def test_already_signed_up(self):
        """Test sign up route for user who already has account."""

        result = self.client.post("/sign_up",
                                  data={"fNameSignUp": "Jane",
                                        "lNameSignUp": "Doe",
                                        "emailSignUp": "abc@abc.com",
                                        "pwSignUp": "abc"},
                                  follow_redirects=True)
        self.assertEqual(result.status_code, 200)
        self.assertIn("This email address is already registered.", result.data)


    def test_log_in(self):
        """Test log in route."""

        result = self.client.post("/log_in",
                                  data={"emailLogIn": "abc@abc.com",
                                        "pwLogIn": "abc"},
                                  follow_redirects=True)
        self.assertEqual(result.status_code, 200)
        self.assertIn("Welcome back", result.data)


    def test_incorrect_password(self):
        """Test incorrect password."""

        result = self.client.post("/log_in",
                                  data={"emailLogIn": "abc@abc.com",
                                        "pwLogIn": "slksjq829uwfja"},
                                  follow_redirects=True)
        self.assertEqual(result.status_code, 200)
        self.assertIn("that combination does not match our records", result.data)


    def test_incorrect_email(self):
        """Test incorrect email."""

        result = self.client.post("/log_in",
                                  data={"emailLogIn": "123@123.com",
                                        "pwLogIn": "abc"},
                                  follow_redirects=True)
        self.assertEqual(result.status_code, 200)
        self.assertIn("that combination does not match our records", result.data)



if __name__ == "__main__":
    unittest.main()
