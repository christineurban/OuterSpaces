import unittest
from server import app
from model import db, connect_to_db
from seed import example_data


class OuterSpacesTests(unittest.TestCase):
    """Flask tests on routes."""

    def setUp(self):
        self.client = app.test_client()
        app.config['TESTING'] = True


    def test_homepage(self):
        result = self.client.get("/")
        self.assertEqual(result.status_code, 200)
        self.assertIn("Find an OuterSpace", result.data)


    def test_account(self):
        result = self.client.get("/account")
        self.assertEqual(result.status_code, 200)
        self.assertIn('<div id="hideSignUpForm">', result.data)


    def test_map(self):
        """Test profile page."""

        result = self.client.get("/map")
        self.assertEqual(result.status_code, 200)
        self.assertIn('<label for="truckMap">Food Trucks </label>', result.data)


    # TODO when database is set up

    # def test_profile(self):
    #     result = self.client.post("/profile")
    #     self.assertEqual(result.status_code, 200)
    #     self.assertIn("<h1>Profile</h1>", result.data)


class OuterSpacesTestsDatabase(unittest.TestCase):
    """Flask tests that use the database."""

    def setUp(self):
        """Stuff to do before every test."""

        # Get the Flask test client
        self.client = app.test_client()

        # Show Flask errors that happen during tests
        app.config['TESTING'] = True

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
