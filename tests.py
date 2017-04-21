import unittest
from server import app
from model import db, connect_to_db
from seed import example_data


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
        """Test art page."""

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
        self.assertIn("Log In or Sign Up | OuterSpaces", result.data)


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
        self.assertIn("Find an OuterSpace", result.data)


    def test_change_password(self):
        """Test change password route."""

        result = self.client.post("/change_password",
                                  data={"new_password": "abcdefg"},
                                  follow_redirects=True)
        self.assertEqual(result.status_code, 200)
        self.assertIn("Profile | OuterSpaces", result.data)


    def test_delete_account(self):
        """Test delete account route."""

        result = self.client.post("/delete_account",
                                  follow_redirects=True)
        self.assertEqual(result.status_code, 200)
        self.assertIn("Find an OuterSpace", result.data)


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
        self.assertIn("Profile | OuterSpaces", result.data)


    def test_log_in(self):
        """Test log in route."""

        result = self.client.post("/log_in",
                                  data={"emailLogIn": "abc@abc.com",
                                        "pwLogIn": "abc"},
                                  follow_redirects=True)
        self.assertEqual(result.status_code, 200)
        self.assertIn("Profile | OuterSpaces", result.data)



if __name__ == "__main__":
    unittest.main()
