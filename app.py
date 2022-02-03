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

@app.route("/check", methods=["POST"])
def check_word():
    """ Save response and redirect to next question """

    # get text from form
    guess = request.form['guess']

    # add response to session
    response = session['board']
    response.append(guess)
    session['board'] = response

    if (len(response) == len(survey.questions)):
        # They've answered all the questions! Thank them.
        return redirect("/thanks")

    else:
        return redirect(f"/questions/{len(response)}")
