let allQuestions = []; // Store all questions from the JSON file
let questions = []; // Store filtered questions for the current game
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let isPaused = false;
// Function to load questions from the JSON file
async function loadQuestions() {
  try {
    const response = await fetch('Data/AllQuestions.json'); // Path to your JSON file
    allQuestions = await response.json(); // Load all questions
    filterQuestions(); // Filter questions based on difficulty and era
    shuffleQuestions(); // Shuffle the filtered questions
    startQuiz();
  } catch (error) {
    console.error('Error loading questions:', error);
  }
}
// Function to filter questions based on selected difficulty and era
function filterQuestions() {
  const difficulty = document.getElementById('difficultySelect').value.toLowerCase(); // Get selected difficulty
  const era = document.getElementById('eraSelect').value.toLowerCase(); // Get selected era
  console.log("Selected Difficulty:", difficulty);
  console.log("Selected Era:", era);

  // Filter questions based on difficulty and era
  questions = allQuestions.filter((question) => {
    const matchesDifficulty = difficulty === 'all' || question.difficulty.toLowerCase() === difficulty;
    const matchesEra = era === 'all' || question.era.toLowerCase() === era || (era === 'all time' && question.era.toLowerCase() === 'all');
    return matchesDifficulty && matchesEra;
  });

  // Debug: Log the filtered questions
  console.log("Filtered Questions:", questions);

  // Check if any questions match the criteria
  if (questions.length === 0) {
    alert("No questions match the selected criteria. Please adjust your settings.");
    document.getElementById('config').classList.remove('hidden'); // Show config again
    document.getElementById('controls').classList.add('hidden'); // Hide controls
  }
}

// Function to shuffle the questions array
function shuffleQuestions() {
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
}

function startQuiz() {
  if (questions.length === 0) {
    alert("No questions available for the selected criteria. Please try again.");
    return;
  }

  document.getElementById('config').classList.add('hidden'); // Hide config
  document.getElementById('controls').classList.remove('hidden'); // Show controls
  score = 0;
  currentQuestionIndex = 0;
  document.getElementById('score').textContent = `Score: ${score}`;
  showQuestion();
}

function pauseQuiz() {
  if (isPaused) {
    isPaused = false;
    document.getElementById('pauseBtn').textContent = 'Pause';
    startTimer(); // Resume the timer
  } else {
    isPaused = true;
    document.getElementById('pauseBtn').textContent = 'Resume';
    clearInterval(timerInterval); // Stop the timer
  }
}
//restart the quiz and reset everything
function startOverQuiz() {
  clearInterval(timerInterval);
  isPaused = false;
  document.getElementById('pauseBtn').textContent = 'Pause';
  document.getElementById('config').classList.remove('hidden'); // Show config
  document.getElementById('controls').classList.add('hidden'); // Hide controls
  document.getElementById('question').textContent = '';
  document.getElementById('choices').innerHTML = '';
  document.getElementById('timer').textContent = 'Time Left: 15s';
  document.getElementById('timer-bar').style.width = '100%';
  document.getElementById('score').textContent = '';
}
// Function to show the current question and choices
function showQuestion() {
  if (currentQuestionIndex >= questions.length) {
    endQuiz();
    return;
  }
  // Show the current question and choices
  const questionData = questions[currentQuestionIndex];
  const questionElement = document.getElementById('question');
  const choicesElement = document.getElementById('choices');
  questionElement.textContent = questionData.question;
  choicesElement.innerHTML = '';
  //create buttons for each choice
  questionData.choices.forEach((choice) => {
    const button = document.createElement('button');
    button.textContent = choice;
    button.classList.add('choice-btn');
    button.addEventListener('click', () => checkAnswer(choice));
    choicesElement.appendChild(button);
  });
  // Show the timer and start it
  startTimer();
}
// Function to check the selected answer and show if it's correct or wrong
function checkAnswer(selectedChoice) {
  const correctAnswer = questions[currentQuestionIndex]?.answer; // Ensure "answer" matches the JSON key

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

  // Get the additional info for the current question
  const additionalInfo = questions[currentQuestionIndex]?.["additional info"] || "No additional information available.";

  // Update the popup message to include the additional info
  popupMessage.innerHTML = `
    <p>${message}</p>
    <p><strong>Did you know?</strong> ${additionalInfo}</p>
  `;
  popup.classList.remove('hidden');
  popupCloseBtn.onclick = () => {
    popup.classList.add('hidden');
    currentQuestionIndex++;
    // Move to the next question
    showQuestion(); 
  };
}
// Function to start the timer
function startTimer() {
  let timeLeft = 15;
  const timerElement = document.getElementById('timer');
  const timerBar = document.getElementById('timer-bar');
  timerElement.textContent = `Time Left: ${timeLeft}s`;
  //start / restart the timer
  clearInterval(timerInterval);
  timerBar.style.width = '100%'; 

  // Function to update the timer every second
  timerInterval = setInterval(() => {
    if (isPaused) return; // Skip timer updates if paused
    timeLeft--;
    timerElement.textContent = `Time Left: ${timeLeft}s`;
    timerBar.style.width = `${(timeLeft / 15) * 100}%`; // Update progress bar width

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showPopup('Time is up! Moving to the next question.', false);
    }
  }, 1000);
}
// Function to end the quiz and show the summary
function endQuiz() {
  clearInterval(timerInterval);

  // Hide the game elements
  document.getElementById('config').classList.remove('hidden'); // Show config again
  document.getElementById('controls').classList.add('hidden'); // Hide controls
  document.getElementById('question').classList.add('hidden');
  document.getElementById('choices').classList.add('hidden');
  document.getElementById('timer').classList.add('hidden');
  document.getElementById('timer-container').classList.add('hidden');

  // Show the summary page
  document.getElementById('summary').classList.remove('hidden');

  // Display the final score as "X out of Y"
  const totalQuestions = questions.length;
  document.getElementById('final-score').textContent = `Your Final Score: ${score} out of ${totalQuestions}`;

  // Update the leaderboard
  updateLeaderboard(score, totalQuestions);
}

function updateLeaderboard(score, totalQuestions) {
  // Get the leaderboard from localStorage or initialize it
  const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

  // Add the current score to the leaderboard
  const playerName = prompt('Enter your name for the leaderboard:') || 'Anonymous';
  leaderboard.push({ name: playerName, score, totalQuestions });

  // Sort the leaderboard by score in descending order
  leaderboard.sort((a, b) => b.score - a.score);

  // Save the updated leaderboard to localStorage
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

  // Display the leaderboard
  const leaderboardElement = document.getElementById('leaderboard');
  leaderboardElement.innerHTML = '';
  leaderboard.forEach((entry, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${index + 1}. ${entry.name} - ${entry.score} out of ${entry.totalQuestions}`;
    leaderboardElement.appendChild(listItem);
  });
}
// Event listeners for buttons
document.getElementById('startBtn').addEventListener('click', loadQuestions);
document.getElementById('pauseBtn').addEventListener('click', pauseQuiz);
document.getElementById('startOverBtn').addEventListener('click', startOverQuiz);
document.getElementById('playAgainBtn').addEventListener('click', () => {
  // Reset the game and start over
  document.getElementById('summary').classList.add('hidden'); // Hide summary
  document.getElementById('config').classList.remove('hidden'); // Show config
  document.getElementById('question').classList.remove('hidden');
  document.getElementById('choices').classList.remove('hidden');
  document.getElementById('timer').classList.remove('hidden');
  document.getElementById('timer-container').classList.remove('hidden');
  startOverQuiz();
});
