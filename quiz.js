document.addEventListener('DOMContentLoaded', function () {
    const questionData = {
        "question": {
            "title": "What is the maximum level a character can achieve in D&D 5E?",
            "body": "Please choose the correct answer from the options below.",
            "situation": "Imagine your character has been adventuring for a long time and has gained a lot of experience.",
            "answers": [
                {"body": "20", "correct": true, "citation": "Player's Handbook, Chapter 1"},
                {"body": "30", "correct": false, "citation": "Player's Handbook, Chapter 1"},
                {"body": "40", "correct": false, "citation": "Player's Handbook, Chapter 1"}
            ],
            "post": "The maximum level a character can achieve is 20, as stated in the Player's Handbook."
        }
    };

    const questionTitle = document.getElementById('question-title');
    const questionBody = document.getElementById('question-body');
    const questionSituation = document.getElementById('question-situation');
    const answersContainer = document.getElementById('answers-container');
    const postAnswer = document.getElementById('post-answer');
    const submitButton = document.getElementById('submit');

    function loadQuestion(data) {
        questionTitle.textContent = data.question.title;
        questionBody.textContent = data.question.body;
        questionSituation.textContent = data.question.situation;

        data.question.answers.forEach((answer, index) => {
            const answerCard = document.createElement('div');
            answerCard.className = 'answer-card p-4 bg-gray-100 rounded-lg cursor-pointer';

            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'answer';
            input.id = `answer-${index}`;
            input.value = index;
            input.className = 'hidden';

            const label = document.createElement('label');
            label.setAttribute('for', `answer-${index}`);
            label.className = 'card-content block';

            const answerText = document.createElement('p');
            answerText.textContent = answer.body;
            answerText.className = 'text-lg';

            label.appendChild(answerText);
            answerCard.addEventListener('click', (e) => {
              e.preventDefault();
              if (!input.checked) {
                document.querySelectorAll('.answer-card').forEach(el => {
                  el.classList.remove('checked');
                  el.querySelector('input').removeAttribute('checked');
                });
              }
              input.checked = !input.checked;
              input.setAttribute('checked', input.checked);
              if (input.checked && !answerCard.classList.contains('checked')) {
                answerCard.classList.add('checked');
                submitButton.removeAttribute('disabled');
              } else if (!input.checked && !!answerCard.classList.contains('checked')) {
                answerCard.classList.remove('checked');
                submitButton.setAttribute('disabled', true);
              }
            });
            answerCard.appendChild(input);
            answerCard.appendChild(label);

            answersContainer.appendChild(answerCard);
        });
    }

    document.getElementById('quiz-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        if (selectedAnswer) {
            const answerIndex = parseInt(selectedAnswer.value, 10);
            const correct = questionData.question.answers[answerIndex].correct;
            if (correct) {
                postAnswer.textContent = questionData.question.post;
                postAnswer.className = 'mt-4 text-green-600';
            } else {
                postAnswer.textContent = 'Incorrect answer. Please try again.';
                postAnswer.className = 'mt-4 text-red-600';
            }
        }
    });

    loadQuestion(questionData);
});
