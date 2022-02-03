/** HANDLE GAME CLICK */
// Add letter to input on click
$('span').on('click', e => {
  // e.preventDefault();
  let letter = $(e.target).text();
  $('#guess').val($('#guess').val() + letter);
  // console.log(letter);
});

/** GAME TIMER
 * at 0, stop timer and don't allow any more game clicks
 */
let countdown = 60;
$('#timer').text(countdown);
let interval = setInterval(function () {
  countdown = countdown - 1;
  $('#timer').text(countdown);
  if (countdown == 10) {
    $('#timer').css('color', 'orange');
  }
  if (countdown == 0) {
    clearInterval(interval);
    $('#timer').text("time's up!");
    // disable board clicks, text input, check button
    $('span').off();
    $('#guess').attr('disabled', 'disabled');
    $('#check').prop('disabled', true);
  }
}, 1000);

/** GAME SCORE COUNTER
 * score for a word is equal to its length
 */
let counter = 0;
// set default score
$('#score').text('0');

// validate word
// add num of letters to score

// update current score
$('#score').text(counter);
