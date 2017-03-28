from unittest import TestCase
from server import app
from model import db, connect_to_db
from seed import example_data

class OuterSpacesTestsDatabase(TestCase):
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

#TODO BELOW ####################################################################

    def test_games(self):
        """Test departments page."""

        result = self.client.get("/games")

        self.assertIn("Power Grid", result.data)



