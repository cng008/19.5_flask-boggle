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
    
    return render_template("index.html", board=board)


@app.route("/check")
def check_word():
    """ Checks if word is in words.txt """

    word = request.args['word']
    board = session["board"]
    response = boggle_game.check_valid_word(board, word)

    return jsonify({'result': response})
