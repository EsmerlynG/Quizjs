let Questions = [];
let currQuestion = 0;
let score = 0;

// Elements
const ques = document.getElementById("ques");
const opt = document.getElementById("opt");
const scoreDisplay = document.getElementById("score");

// Fetch Questions
async function fetchQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=10');
        if (!response.ok) {
            throw new Error("Something went wrong!! Unable to fetch the data");
        }
        const data = await response.json();
        Questions = data.results;
        loadQues();
    } catch (error) {
        console.error(error);
        ques.innerHTML = `<h5 style='color: red'>${error}</h5>`;
    }
}

// Load Questions
function loadQues() {
    if (Questions.length === 0) {
        ques.innerHTML = `<h5>Please Wait!! Loading Questions...</h5>`;
        return;
    }

    const currentQuestion = decodeHtml(Questions[currQuestion].question);
    ques.textContent = currentQuestion;

    opt.innerHTML = "";
    const correctAnswer = decodeHtml(Questions[currQuestion].correct_answer);
    const incorrectAnswers = Questions[currQuestion].incorrect_answers.map(decodeHtml);
    const options = [correctAnswer, ...incorrectAnswers].sort(() => Math.random() - 0.5);

    options.forEach((option) => {
        const choicesdiv = document.createElement("div");
        const choice = document.createElement("input");
        const choiceLabel = document.createElement("label");

        choice.type = "radio";
        choice.name = "answer";
        choice.value = option;

        choiceLabel.textContent = option;
        choicesdiv.appendChild(choice);
        choicesdiv.appendChild(choiceLabel);
        opt.appendChild(choicesdiv);
    });
}

// Decode HTML Entities
function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

// Check Answer
function checkAns() {
    const selectedAns = document.querySelector('input[name="answer"]:checked');
    if (!selectedAns) {
        alert("Please select an answer!");
        return;
    }

    if (selectedAns.value === Questions[currQuestion].correct_answer) {
        score++;
    }
    nextQuestion();
}

// Load Next Question
function nextQuestion() {
    if (currQuestion < Questions.length - 1) {
        currQuestion++;
        loadQues();
    } else {
        endQuiz();
    }
}

// End Quiz
function endQuiz() {
    ques.remove();
    opt.remove();
    document.getElementById("btn").style.display = "none";

    scoreDisplay.innerHTML = `
        <h2>You scored ${score} out of ${Questions.length}</h2>
        <h3>Correct Answers:</h3>
    `;
    Questions.forEach((el, index) => {
        scoreDisplay.innerHTML += `<p>${index + 1}. ${decodeHtml(el.correct_answer)}</p>`;
    });

    // Show Restart Button
    const restartBtn = document.getElementById("restart");
    restartBtn.style.display = "inline-block";
}

// Restart Quiz
function restartQuiz() {
    currQuestion = 0;
    score = 0;
    Questions = []; // Clear the current set of questions
    scoreDisplay.innerHTML = ""; // Clear score display
    opt.innerHTML = ""; // Clear options
    ques.textContent = "Loading new quiz..."; // Add a loading message
    document.getElementById("btn").style.display = "inline-block"; // Show submit button
    document.getElementById("restart").style.display = "none"; // Hide restart button

    fetchQuestions(); // Fetch a new set of questions
}


// Start Quiz
fetchQuestions();
