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

        with self.client as c:
            with c.session_transaction() as session:
                session["user_id"] = 1


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


    def test_account(self):
        """Test account page."""

        result = self.client.get("/account")
        self.assertEqual(result.status_code, 200)
        self.assertIn("Log In or Sign Up | OuterSpaces", result.data)


    def test_profile(self):
        """Test profile page."""

        result = self.client.post("/profile")
        self.assertEqual(result.status_code, 200)
        self.assertIn("Profile | OuterSpaces", result.data)





class OuterSpacesTestsDatabase(unittest.TestCase):
    """Flask tests that use the database."""

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



if __name__ == "__main__":
    unittest.main()
