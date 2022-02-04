class BoggleGame {
  constructor(countdown = 60) {
    this.countdown = countdown;
    this.showTimer();
    this.score = 0;
    this.words = new Set();

    this.timer = setInterval(this.tick.bind(this), 1000);

    $('#add-word').on('submit', this.handleSubmit.bind(this));
    $('#refresh').on('click', this.newGame.bind(this));
    $('span').on('click', this.boardClick.bind(this));
  }

  /* HANDLE NEW GAME BUTTON CLICK */
  newGame() {
    location.reload();
  }

  /* HANDLE BOARD CLICK */
  // Add letter to input on click
  boardClick(e) {
    let letter = $(e.target).text();
    $('#word').val($('#word').val() + letter);
  }

  /** GAME TIMER
   * at 0, stop timer and don't allow any more game clicks
   */
  showTimer() {
    $('#timer').text(this.countdown);
  }

  async tick() {
    this.countdown -= 1;
    this.showTimer();

    if (this.countdown === 10) {
      $('#timer').css('color', 'orange');
    }

    if (this.countdown === 0) {
      clearInterval(this.timer);
      $('#timer').text("time's up!");
      // disable board clicks, text input, check button
      $('span').off();
      $('#word').attr('disabled', 'disabled');
      $('#check').prop('disabled', true);
      await this.endGame();
    }
  }

  /* ADD WORD TO LIST OF WORDS */
  showWord(word) {
    $('.words').append($('<li>', { text: word }));
  }

  /** GAME SCORE COUNTER
   * score for a word is equal to its length
   * show score in html
   */
  showScore() {
    $('#score').text(this.score);
  }

  /* STATUS MESSAGE */
  showMessage = (msg, cls) => {
    $('.msg').text(msg).removeClass().addClass(`msg ${cls}`);
  };

  /** HANDLE SUBMISSION OF WORDS
   * if unique and valid, score & show
   */
  async handleSubmit(e) {
    e.preventDefault();
    const $word = $('#word');

    let word = $word.val().toUpperCase();
    if (!word) return;

    if (this.words.has(word)) {
      this.showMessage(`Already found ${word}`, 'err');
      $word.val('');
      return;
    }

    // Validation check
    const resp = await axios.get('/check', {
      params: { word: word.toLowerCase() }
    });
    if (resp.data.result === 'not-word') {
      this.showMessage(`${word} is not a valid English word`, 'err');
    } else if (resp.data.result === 'not-on-board') {
      this.showMessage(`${word} is not a valid word on this board`, 'err');
    } else {
      this.showWord(word);
      this.score += word.length;
      this.showScore();
      this.words.add(word);
      this.showMessage(`Added: ${word}`, 'ok');
    }

    $word.val('').focus();
  }

  /* end of game: score and update message. */
  async endGame() {
    const resp = await axios.post('/post-score', { score: this.score });
    if (resp.data.bestScore) {
      this.showMessage(`New record: ${this.score}`, 'ok');
    } else {
      this.showMessage(`Final score: ${this.score}`, 'ok');
    }
  }
}
