let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;

async function loadQuestions() {
  try {
    const response = await fetch('trivia_questions.json');
    questions = await response.json();
    startQuiz();
  } catch (error) {
    console.error('Error loading questions:', error);
  }
}

function startQuiz() {
  document.getElementById('config').classList.add('hidden'); // Hide config
  document.getElementById('score').textContent = `Score: ${score}`;
  showQuestion();
}

function showQuestion() {
  if (currentQuestionIndex >= questions.length) {
    endQuiz();
    return;
  }

  const questionData = questions[currentQuestionIndex];
  const questionElement = document.getElementById('question');
  const choicesElement = document.getElementById('choices');

  questionElement.textContent = questionData.question;
  choicesElement.innerHTML = '';

  questionData.choices.forEach((choice) => {
    const button = document.createElement('button');
    button.textContent = choice;
    button.classList.add('choice-btn');
    button.addEventListener('click', () => checkAnswer(choice));
    choicesElement.appendChild(button);
  });

  startTimer();
}

function checkAnswer(selectedChoice) {
  const correctAnswer = questions[currentQuestionIndex].correct_answer;
  if (selectedChoice === correctAnswer) {
    score++;
    document.getElementById('score').textContent = `Score: ${score}`;
    showPopup('Correct!', true);
  } else {
    showPopup(`Wrong! The correct answer was: ${correctAnswer}`, false);
  }
}

function showPopup(message, isCorrect) {
  const popup = document.getElementById('popup');
  const popupMessage = document.getElementById('popup-message');
  const popupCloseBtn = document.getElementById('popup-close-btn');

  popupMessage.textContent = message;
  popup.classList.remove('hidden');

  popupCloseBtn.onclick = () => {
    popup.classList.add('hidden');
    currentQuestionIndex++;
    showQuestion(); // Move to the next question
  };
}

function startTimer() {
  let timeLeft = 15;
  const timerElement = document.getElementById('timer');
  const timerBar = document.getElementById('timer-bar');
  timerElement.textContent = `Time Left: ${timeLeft}s`;

  clearInterval(timerInterval);
  timerBar.style.width = '100%'; // Reset progress bar

  timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `Time Left: ${timeLeft}s`;
    timerBar.style.width = `${(timeLeft / 15) * 100}%`; // Update progress bar width

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showPopup('Time is up! Moving to the next question.', false);
    }
  }, 1000);
}

function endQuiz() {
  clearInterval(timerInterval);
  document.getElementById('config').classList.remove('hidden'); // Show config again
  const questionElement = document.getElementById('question');
  const choicesElement = document.getElementById('choices');
  const timerElement = document.getElementById('timer');

  questionElement.textContent = 'Quiz Over!';
  choicesElement.innerHTML = '';
  timerElement.textContent = '';
  document.getElementById('score').textContent = `Final Score: ${score}`;
}

document.getElementById('startBtn').addEventListener('click', loadQuestions);
