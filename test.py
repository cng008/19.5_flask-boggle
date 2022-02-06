from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle

class FlaskTests(TestCase):

    def setUp(self):
        """Stuff to do before every test."""

        self.client = app.test_client()
        # Make Flask errors be real errors, not HTML pages with error info
        app.config['TESTING'] = True


    def test_homepage(self):
        """Make sure information is in the session and HTML is displayed"""

        with self.client:
            res = self.client.get('/')
            self.assertIn(b'<h1>Boggle</h1>', res.data)
            self.assertIn(b'<p>best score:', res.data)
            self.assertIn('board', session)
            self.assertEqual(res.status_code, 200)
            self.assertIsNone(session.get('highscore'))
            self.assertIsNone(session.get('times_played'))


    def test_is_word(self):
        """Test if word is valid by modifying the board in the session"""

        with self.client as client:
            with client.session_transaction() as session:
                session['board'] = [["D", "O", "G", "G", "S"],
                                    ["D", "O", "G", "G", "S"],
                                    ["D", "O", "G", "G", "S"],
                                    ["D", "O", "G", "G", "S"],
                                    ["D", "O", "G", "G", "S"]]
        res = client.get('/check?word=dog')
        self.assertEqual(res.json['result'], 'ok')


    def test_not_word(self):
        """Test if word is in the dictionary"""

        self.client.get('/')
        res = self.client.get('check?word=cat')
        self.assertEqual(res.json['result'], 'not-on-board')


    def non_english_word(self):
        """Test if word is on the board"""

        self.client.get('/')
        res = self.client.get(
            '/check-word?word=asdfjksfjlkafsdhg')
        self.assertEqual(res.json['result'], 'not-word')
