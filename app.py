from flask import Flask, request, render_template, session
# from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle

app = Flask(__name__)

app.config['SECRET_KEY'] = 'shhhh'
# debug = DebugToolbarExtension(app)
# app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

boggle_game = Boggle()

@app.route("/")
def index():
    """ show game board """

    board = boggle_game.make_board()
    session['board'] = board
    
    return render_template("index.html", board=board)