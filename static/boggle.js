let score = 0;
let countdown = 60;
let words = new Set();

/* HANDLE BOARD CLICK */
// Add letter to input on click
$('span').on('click', e => {
  let letter = $(e.target).text();
  $('#word').val($('#word').val() + letter);
});

/** GAME TIMER
 * at 0, stop timer and don't allow any more game clicks
 */
$('#timer').text(countdown);
let interval = setInterval(function () {
  countdown = countdown - 1;
  $('#timer').text(countdown);
  if (countdown === 10) {
    $('#timer').css('color', 'orange');
  }
  if (countdown === 0) {
    clearInterval(interval);
    $('#timer').text("time's up!");
    endGame();
    // disable board clicks, text input, check button
    $('span').off();
    $('#word').attr('disabled', 'disabled');
    $('#check').prop('disabled', true);
  }
}, 1000);

/* ADD WORD TO LIST OF WORDS */
showWord = word => {
  $('.words').append($('<li>', { text: word }));
};

/** GAME SCORE COUNTER
 * score for a word is equal to its length
 * show score in html
 */
$('#score').text('0'); // set default score
showScore = () => {
  $('#score').text(score);
};

/* STATUS MESSAGE */
showMessage = (msg, cls) => {
  $('.msg').text(msg).removeClass().addClass(`msg ${cls}`);
};

/** HANDLE SUBMISSION OF WORDS
 * if unique and valid, score & show
 */
$('#add-word').on('submit', handleSubmit);
async function handleSubmit(e) {
  e.preventDefault();
  const $word = $('#word');

  let word = $word.val().toUpperCase();
  if (!word) return;

  if (words.has(word)) {
    showMessage(`Already found ${word}!`);
    $word.val('');
    return;
  }

  // Validation check
  const resp = await axios.get('/check', {
    params: { word: word.toLowerCase() }
  });
  if (resp.data.result === 'not-word') {
    showMessage(`${word} is not a valid English word`, 'err');
  } else if (resp.data.result === 'not-on-board') {
    showMessage(`${word} is not a valid word on this board`, 'err');
  } else {
    showWord(word);
    score += word.length;
    showScore();
    words.add(word);
    showMessage(`Added: ${word}`, 'ok');
  }

  $word.val('').focus();
}

/* end of game: score and update message. */
async function endGame() {
  const resp = await axios.post('/post-score', { score: score });
  if (resp.data.bestScore) {
    showMessage(`New record: ${score}`, 'ok');
  } else {
    showMessage(`Final score: ${score}`, 'ok');
  }
}
