// Seletores de elementos
const landingContainer = document.querySelector(".landing-container");
const welcomeContainer = document.querySelector(".welcome-container");
const configContainer = document.querySelector(".config-container");
const quizContainer = document.querySelector(".quiz-container");
const answerOptions = document.querySelector(".answer-options");
const nextQuestionBtn = document.querySelector(".next-question-btn");
const questionStatus = document.querySelector(".question-status");
const timerDisplay = document.querySelector(".time-duration");
const resultContainer = document.querySelector(".result-container");
const resultMessage = document.querySelector(".result-message");

// Botões de navegação
const playButton = document.querySelector(".play-button");
const backButton = document.querySelector(".back-button");
const continueButton = document.querySelector(".continue-button");
const startQuizButton = document.querySelector(".start-quiz-button");
const quitButton = document.querySelector(".quit-button");
const tryAgainBtn = document.querySelector(".try-again-btn");

// Variáveis globais
const QUIZ_TIME_LIMIT = 15;
let currentTime = QUIZ_TIME_LIMIT;
let timer = null;
let quizCategory = "Português";
let numberOfQuestions = 8;
let currentQuestion = null;
let correctAnswers = 0;
const questionIndexHistory = [];

// Funções de navegação
const showLandingPage = () => {
    landingContainer.style.display = "block";
    welcomeContainer.style.display = "none";
    configContainer.style.display = "none";
    quizContainer.style.display = "none";
    resultContainer.style.display = "none";
};

const showWelcomePage = () => {
    landingContainer.style.display = "none";
    welcomeContainer.style.display = "block";
    configContainer.style.display = "none";
    quizContainer.style.display = "none";
    resultContainer.style.display = "none";
};

const showConfigPage = () => {
    landingContainer.style.display = "none";
    welcomeContainer.style.display = "none";
    configContainer.style.display = "block";
    quizContainer.style.display = "none";
    resultContainer.style.display = "none";
};

const showQuizPage = () => {
    landingContainer.style.display = "none";
    welcomeContainer.style.display = "none";
    configContainer.style.display = "none";
    quizContainer.style.display = "block";
    resultContainer.style.display = "none";
};

// Mostra os resultados do quiz
const showQuizResults = () => {
    quizContainer.style.display = "none";
    resultContainer.style.display = "block";

    // Atualiza mensagem final com base nos acertos reais
    resultMessage.innerHTML = `Você acertou <b>${correctAnswers}</b> das <b>${numberOfQuestions}</b> questões e ganhou <b>${correctAnswers}</b> estrela${correctAnswers !== 1 ? 's' : ''}!`;
};

// Reseta o temporizador
const resetTimer = () => {
    clearInterval(timer);
    currentTime = QUIZ_TIME_LIMIT;
    timerDisplay.textContent = `${currentTime}s`;
};

// Inicia o temporizador
const startTimer = () => {
    resetTimer();
    timer = setInterval(() => {
        currentTime--;
        timerDisplay.textContent = `${currentTime}s`;
        if (currentTime <= 0) {
            clearInterval(timer);
            revealCorrectAnswer(); // Se o tempo acabar, mostra a resposta certa
        }
    }, 1000);
};

const getRandomQuestion = () => {
    const categoryData = questions.find(cat => cat.category.toLowerCase() === quizCategory.toLowerCase());
    const categoryQuestions = categoryData ? categoryData.questions : [];

    if (questionIndexHistory.length >= Math.min(categoryQuestions.length, numberOfQuestions)) {
        return null;
    }

    const availableQuestions = categoryQuestions.filter((_, index) => !questionIndexHistory.includes(index));
    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    questionIndexHistory.push(categoryQuestions.indexOf(randomQuestion));
    return randomQuestion;
};

const revealCorrectAnswer = () => {
    const options = answerOptions.querySelectorAll(".answer-option");
    options.forEach((option, index) => {
        option.style.pointerEvents = "none";
        if (index === currentQuestion.correctAnswer) {
            option.classList.add("correct");
            option.insertAdjacentHTML("beforeend", `<span class="material-symbols-rounded">check_circle</span>`);
        }
    });
    nextQuestionBtn.style.visibility = "visible";
};

const handleAnswer = (option, answerIndex) => {
    clearInterval(timer);
    const isCorrect = answerIndex === currentQuestion.correctAnswer;

    if (isCorrect) {
        option.classList.add("correct");
        correctAnswers++;
    } else {
        option.classList.add("incorrect");
        revealCorrectAnswer(); // Mostra a correta se errou
    }

    option.insertAdjacentHTML("beforeend", `<span class="material-symbols-rounded">${isCorrect ? 'check_circle' : 'cancel'}</span>`);
    answerOptions.querySelectorAll(".answer-option").forEach(btn => btn.style.pointerEvents = "none");

    nextQuestionBtn.style.visibility = "visible";
};

const renderQuestion = () => {
    currentQuestion = getRandomQuestion();

    if (!currentQuestion) {
        showQuizResults();
        return;
    }

    resetTimer();
    startTimer();

    // Atualiza UI
    answerOptions.innerHTML = "";
    nextQuestionBtn.style.visibility = "hidden";
    document.querySelector(".question-text").textContent = currentQuestion.question;
    questionStatus.innerHTML = `<b>${questionIndexHistory.length}</b> de <b>${numberOfQuestions}</b> Questões`;

    currentQuestion.options.forEach((optionText, index) => {
        const li = document.createElement("li");
        li.classList.add("answer-option");
        li.textContent = optionText;
        li.addEventListener("click", () => handleAnswer(li, index));
        answerOptions.appendChild(li);
    });
};

const resetQuiz = () => {
    // Reseta variáveis
    correctAnswers = 0;
    questionIndexHistory.length = 0;
    currentQuestion = null;
    resetTimer();
};

// Eventos de navegação
playButton.addEventListener("click", () => {
    showWelcomePage();
});

backButton.addEventListener("click", () => {
    showLandingPage();
});

continueButton.addEventListener("click", () => {
    //showConfigPage();
    showQuizPage();
    renderQuestion();
});

startQuizButton.addEventListener("click", () => {
    // showQuizPage();
    // renderQuestion();
});

quitButton.addEventListener("click", () => {
    resetQuiz();
    showLandingPage();
});

nextQuestionBtn.addEventListener("click", renderQuestion);

tryAgainBtn.addEventListener("click", () => {
    resetQuiz();
    showLandingPage();
});

// Inicialização - começar na página inicial
showLandingPage();
