from flask import Flask, request, render_template, session, jsonify
from boggle import Boggle

app = Flask(__name__)
app.config['SECRET_KEY'] = 'shhhh'

boggle_game = Boggle()

@app.route("/")
def index():
    """ Show game board """

    board = boggle_game.make_board()
    session['board'] = board
    highscore = session.get("highscore", 0)
    times_played = session.get("times_played", 0)
    
    return render_template("index.html", board=board, highscore=highscore, times_played=times_played)


@app.route("/check")
def check_word():
    """ Checks if word is in words.txt """

    word = request.args['word']
    board = session["board"]
    response = boggle_game.check_valid_word(board, word)

    return jsonify({'result': response})


@app.route("/post-score", methods=["POST"])
def post_score():
    """Receive score, update times_played, update high score if appropriate."""

    score = request.json["score"]
    highscore = session.get("highscore", 0)
    times_played = session.get("times_played", 0)

    session['times_played'] = times_played + 1
    session['highscore'] = max(score, highscore)

    return jsonify(bestScore=score > highscore)
