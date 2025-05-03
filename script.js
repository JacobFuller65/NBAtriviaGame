const questions = [
    {
      question: "Who won the NBA MVP in 2021?",
      choices: ["Giannis", "Jokić", "Durant", "Curry"],
      answer: 1,
      difficulty: "medium",
      era: "modern"
    },
    {
      question: "Which team has the most NBA championships?",
      choices: ["Lakers", "Bulls", "Warriors", "Celtics"],
      answer: 3,
      difficulty: "easy",
      era: "90s"
    },
    {
      question: "Who averaged a triple-double in 2017?",
      choices: ["Westbrook", "LeBron", "Curry", "Harden"],
      answer: 0,
      difficulty: "hard",
      era: "modern"
    }
  ];
  
  let filteredQuestions = [];
  let currentQuestion = 0;
  let score = 0;
  let timer;
  let timeLeft = 15;
  
  // Start game after selecting difficulty/era
  document.getElementById("startBtn").addEventListener("click", () => {
    const selectedDifficulty = document.getElementById("difficultySelect").value;
    const selectedEra = document.getElementById("eraSelect").value;
  
    filteredQuestions = questions.filter(q =>
      (selectedDifficulty === "all" || q.difficulty === selectedDifficulty) &&
      (selectedEra === "all" || q.era === selectedEra)
    );
  
    if (filteredQuestions.length === 0) {
      alert("No questions match that combination.");
      return;
    }
  
    currentQuestion = 0;
    score = 0;
  
    document.getElementById("config").style.display = "none";
    document.getElementById("nextBtn").style.display = "inline-block";
    showQuestion();
  });
  
  document.getElementById("nextBtn").addEventListener("click", () => {
    currentQuestion++;
    if (currentQuestion < filteredQuestions.length) {
      showQuestion();
    } else {
      endGame();
    }
  });
  
  function showQuestion() {
    clearInterval(timer);
    timeLeft = 15;
  
    const q = filteredQuestions[currentQuestion];
    document.getElementById("question").textContent = q.question;
  
    const choicesDiv = document.getElementById("choices");
    choicesDiv.innerHTML = "";
    q.choices.forEach((choice, index) => {
      const btn = document.createElement("button");
      btn.textContent = choice;
      btn.onclick = () => checkAnswer(index);
      choicesDiv.appendChild(btn);
    });
  
    document.getElementById("score").textContent = `Score: ${score}`;
    document.getElementById("nextBtn").disabled = true;
    startTimer();
  }
  
  function startTimer() {
    document.getElementById("timer").textContent = `Time Left: ${timeLeft}s`;
    timer = setInterval(() => {
      timeLeft--;
      document.getElementById("timer").textContent = `Time Left: ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(timer);
        disableChoices();
        alert("Time's up!");
        document.getElementById("nextBtn").disabled = false;
      }
    }, 1000);
  }
  
  function checkAnswer(selected) {
    clearInterval(timer);
    const correct = filteredQuestions[currentQuestion].answer;
    if (selected === correct) {
      score++;
      alert("Correct!");
    } else {
      alert("Wrong!");
    }
    disableChoices();
    document.getElementById("nextBtn").disabled = false;
  }
  
  function disableChoices() {
    const buttons = document.querySelectorAll("#choices button");
    buttons.forEach(btn => btn.disabled = true);
  }
  
  function endGame() {
    clearInterval(timer);
    document.getElementById("question").textContent = "🏁 Game Over!";
    document.getElementById("choices").innerHTML = "";
    document.getElementById("nextBtn").style.display = "none";
    document.getElementById("score").textContent = `Final Score: ${score} / ${filteredQuestions.length}`;
    document.getElementById("timer").textContent = "";
  }
  