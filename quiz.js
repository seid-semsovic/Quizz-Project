const questionText = document.getElementById("question");
const spans = document.getElementsByTagName("span");
const buttons = document.querySelectorAll(`[id^="btn"]`);
const questionIndex = document.getElementById("question-index");
const buttonRestart = document.getElementById("button-restart");
const countdownTimer = document.getElementById("count-down");
const highScoreText = document.getElementById("high-score");

const modal = document.querySelectorAll(".btn");

// this is the localstorage key that i will use to access my high score
const localStorageHighScoreKey = "my-quiz";

let highScore = 0;

let currentQuestionIndex = 0;
const maxNumberOfQuestions = questions.length;

// this is the maximum number of seconds for a given question
const maxSecondsToAnswer = 30;
let currentTimer = 30;

let quizTimer = null;

// This function starts the timer, the timer will restart the game if it reaches 0
function startTimer() {
  quizTimer = setInterval(() => {
    countdownTimer.textContent = currentTimer;
    if (currentTimer <= 0) {
      restartGame();
    } else {
      currentTimer -= 1;
    }
  }, 1000);
}

// This function resets the timer interval and returns the seconds to the max number
function resetTimer() {
  clearInterval(quizTimer);
  currentTimer = maxSecondsToAnswer;
}

//This function always shuflles the questions!
function shuffle(arr, numOFShuffles) {
  for (let i = 0; i < numOFShuffles; i++) {
    const randomNum = Math.floor(Math.random() * questions.length);
    const anotherRandomNum = Math.floor(Math.random() * questions.length);
    let c = arr[randomNum];
    arr[randomNum] = questions[anotherRandomNum];

    arr[anotherRandomNum] = c;
  }
}

function restartGame() {
  shuffle(questions, 125);
  currentQuestionIndex = 0;
  resetButtonEvents();
  resetTimer();
  displayQuestion();
}

// Resets the event listeners for correct and incorrect buttons
function resetButtonEvents() {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].removeEventListener("click", handleCorrectAnswer);
    buttons[i].removeEventListener("click", handleIncorrectAnswer);
  }
}

// this function does the updates and triggers when the selected answer is incorrect
function handleIncorrectAnswer() {
  restartGame();
}

// this function does the updates and triggers when the selected answer is correct
function handleCorrectAnswer() {
  resetButtonEvents();

  currentQuestionIndex++;

  updateHighScore();

  resetTimer();

  displayQuestion(questions[currentQuestionIndex]);
}

// this function updates high score
function updateHighScore() {
  if (currentQuestionIndex > highScore) {
    highScore = currentQuestionIndex;
    localStorage.setItem(localStorageHighScoreKey, currentQuestionIndex);
    highScoreText.textContent = `HIGH SCORE: ${highScore}`;
  }
}

// This is core functionality
// it updates the UI, gets the current question from the array,
// and adds the event listeners
function displayQuestion() {
  const question = questions[currentQuestionIndex];

  startTimer();

  questionIndex.textContent = `${
    currentQuestionIndex + 1
  }/${maxNumberOfQuestions}`;

  if ((currentQuestionIndex + 1) % 5 === 0) {
    questionText.classList.add("question-blue-color");
  } else {
    questionText.classList.remove("question-blue-color");
  }

  questionText.textContent = question.question;

  for (let i = 0; i < spans.length; i++) {
    spans[i].textContent = question.answers[i];

    if (i === question.correctIndex) {
      buttons[i].addEventListener("click", handleCorrectAnswer);
    } else {
      buttons[i].addEventListener("click", handleIncorrectAnswer);
    }
  }
}

// When the window loads, update the high score and start the game
window.addEventListener("load", () => {
  highScore = localStorage.getItem(localStorageHighScoreKey);

  if (!highScore) {
    highScore = 0;
  }

  highScoreText.textContent = `HIGH SCORE: ${highScore}`;

  shuffle(questions, 125);
  displayQuestion();
});

// add the restart event to the button restart
buttonRestart.addEventListener("click", handleIncorrectAnswer);
