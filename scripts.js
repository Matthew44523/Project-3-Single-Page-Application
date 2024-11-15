// Variables for state tracking
let studentName = "";
let selectedQuiz = "";
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let questionsAnswered = 0;
let timer;
let startTime;

// Initialize event listeners
document.getElementById("start-form").addEventListener("submit", startQuiz);
document.getElementById("next-question-btn").addEventListener("click", loadNextQuestion);
document.getElementById("retry-btn").addEventListener("click", restartQuiz);
document.getElementById("main-menu-btn").addEventListener("click", returnToMainMenu);

// Handlebars setup
const questionTemplateSource = document.getElementById("question-template").innerHTML;
const questionTemplate = Handlebars.compile(questionTemplateSource);

// Function to handle quiz selection
function selectQuiz(quiz) {
    selectedQuiz = quiz;
    document.getElementById("start-quiz-btn").disabled = false;
  }

// Start quiz
function startQuiz(event) {
  event.preventDefault();
  studentName = document.getElementById("name").value;

  if (!selectedQuiz) {
    alert("Please select a quiz to start.");
    return;
  }

  showQuizScreen();
  fetchQuizData();
  startTimer(); // Start the timer when the quiz begins
}

// Show quiz screen and hide welcome screen
function showQuizScreen() {
  document.getElementById("welcome-screen").classList.add("d-none");
  document.getElementById("quiz-screen").classList.remove("d-none");
}

// Fetch quiz data from JSONPlaceholder
async function fetchQuizData() {
    const response = await fetch(`https://my-json-server.typicode.com/Matthew44523/Project-3-Single-Page-Application/${selectedQuiz}`);
    questions = await response.json();
    currentQuestionIndex = 0;
    score = 0;
    questionsAnswered = 0;
    startTime = Date.now();
    loadNextQuestion();
  }

// Load the next question
function loadNextQuestion() {
  document.getElementById("feedback-screen").classList.add("d-none");

  if (currentQuestionIndex < questions.length) {
    const question = questions[currentQuestionIndex];
    const questionHtml = questionTemplate({
      currentQuestionNumber: currentQuestionIndex + 1,
      questionText: question.questionText,
      options: question.options,
    });
    document.getElementById("question-container").innerHTML = questionHtml;

    // Add event listeners to answer options
    if (question.options) {
      document.querySelectorAll("#options .option").forEach((element) => {
        if (element.tagName === 'IMG') { 
          // If the option is an image, listen for clicks on `src`
          element.addEventListener("click", () => {
            console.log("Image clicked:", element.src); // Debugging to check src
            submitAnswer(element.src); // Pass the image's URL as the answer
          });
        } else {
          element.addEventListener("click", () => submitAnswer(element.textContent));
        }
      });
    } else {
      document.getElementById("submit-text-answer").addEventListener("click", () => {
        const answer = document.getElementById("text-answer").value;
        submitAnswer(answer);
      });
    }
  } else {
    endQuiz();
  }
}

// Submit answer and provide feedback
function submitAnswer(answer) {
  const question = questions[currentQuestionIndex];
  const correctAnswer = question.correctAnswer;
  const explination = question.explination;
  questionsAnswered++;

  // Log both answer and correct answer for debugging
  console.log("Submitted Answer:", answer);
  console.log("Correct Answer:", correctAnswer);

  // Handle URL comparisons in image-selection questions
  let isCorrect;
  if (question.type === 'image-selection') {
    isCorrect = answer === correctAnswer; // Compare URLs directly
  } else {
    isCorrect = answer === correctAnswer; // For text answers, compare text
  }

  if (isCorrect) {
    score++;
    showFeedback("Brilliant! Good job!");
    setTimeout(() => loadNextQuestion(), 1000);
  } else {
    showFeedback(`Incorrect. The correct answer is: ${correctAnswer}. Explanation: ${explination}`, false);
  }

  updateScoreboard();
  currentQuestionIndex++;
}


// Show feedback to user
function showFeedback(message, isCorrect = true) {
  document.getElementById("feedback-message").textContent = message;
  document.getElementById("feedback-screen").classList.remove("d-none");
  if (isCorrect) {
    setTimeout(() => {
      document.getElementById("feedback-screen").classList.add("d-none");
    }, 1000);
  }
}

// Update scoreboard information
function updateScoreboard() {
  document.getElementById("questions-answered").textContent = questionsAnswered;
  document.getElementById("score").textContent = score;
  document.getElementById("elapsed-time").textContent = Math.floor((Date.now() - startTime) / 1000);
}

// End the quiz and show result
function endQuiz() {
  clearInterval(timer); // Stop the timer
  document.getElementById("quiz-screen").classList.add("d-none");
  document.getElementById("result-screen").classList.remove("d-none");
  const resultMessage = score / questions.length >= 0.8
    ? `Congratulations ${studentName}! You passed the quiz!`
    : `Sorry ${studentName}, you failed the quiz.`;
  document.getElementById("result-message").textContent = resultMessage;
}

// Restart quiz function
function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  questionsAnswered = 0;
  startTime = Date.now();
  document.getElementById("result-screen").classList.add("d-none");
  fetchQuizData();
  document.getElementById("quiz-screen").classList.remove("d-none");
}

// Return to main menu
function returnToMainMenu() {
  document.getElementById("result-screen").classList.add("d-none");
  document.getElementById("quiz-screen").classList.add("d-none");
  document.getElementById("welcome-screen").classList.remove("d-none");
  document.getElementById("start-form").reset();
  selectedQuiz = "";
}

// Timer function to keep track of elapsed time
function startTimer() {
  timer = setInterval(() => {
    document.getElementById("elapsed-time").textContent = Math.floor((Date.now() - startTime) / 1000);
  }, 1000);
}

// Register Handlebars helper
Handlebars.registerHelper('isImage', function(option) {
  return option.startsWith('http') && (option.endsWith('.jpg') || option.endsWith('.jpeg') || option.endsWith('.png') || option.endsWith('.gif'));
});

// Event listener for image click in loadNextQuestion()
if (question.options) {
document.querySelectorAll("#options .option").forEach((element) => {
  if (element.tagName === 'IMG') {
    element.addEventListener("click", () => submitAnswer(element.src));
  } else {
    element.addEventListener("click", () => submitAnswer(element.textContent));
  }
});
}

function startTimer() {
  const timerElement = document.getElementById("elapsed-time");
  startTime = Date.now();

  // Update the timer every second
  timer = setInterval(() => {
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    timerElement.textContent = elapsedSeconds;
  }, 1000);
}

