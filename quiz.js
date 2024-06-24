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
    answersContainer.innerHTML = '';
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
        loadQuestion();
      } else {
        postAnswer.textContent = 'Incorrect answer. Please try again.';
        postAnswer.className = 'mt-4 text-red-600';
      }
    }
  });

  const questions = [
    {
      "question": {
        "title": "Deities in D&D",
        "body": "Which deity is primarily associated with the domain of knowledge in the Forgotten Realms?",
        "answers": [
          {
            "body": "Moradin",
            "correct": false,
            "citation": "Appendix B: Gods of the Multiverse, D&D Basic Rules 2018, p. 172"
          },
          {
            "body": "Corellon Larethian",
            "correct": false,
            "citation": "Appendix B: Gods of the Multiverse, D&D Basic Rules 2018, p. 172"
          },
          {
            "body": "Oghma",
            "correct": true,
            "citation": "Appendix B: Gods of the Multiverse, D&D Basic Rules 2018, p. 172"
          },
          {
            "body": "Tymora",
            "correct": false,
            "citation": "Appendix B: Gods of the Multiverse, D&D Basic Rules 2018, p. 172"
          },
        ],
      },
    },
    {
      "question": {
        "title": "Roleplaying in a Social Interaction",
        "body": "You are playing as a bard in a bustling city. The party needs information from a suspicious merchant who seems unwilling to cooperate. What should your character do to best handle the situation?",
        "situation": "The party has encountered a merchant who might have critical information about a stolen artifact they are seeking. The merchant is visibly nervous and initially refuses to talk.",
        "answers": [
          {
            "body": "Intimidate the merchant into revealing the information.",
            "correct": false,
            "citation": "Chapter 7: Using Ability Scores, D&D Basic Rules 2018, p. 64"
          },
          {
            "body": "Offer the merchant a bribe to encourage cooperation.",
            "correct": false,
            "citation": "Chapter 8: Adventuring, D&D Basic Rules 2018, p. 70"
          },
          {
            "body": "Use your bardic charm and persuasion skills to gain the merchant's trust.",
            "correct": true,
            "citation": "Chapter 4: Personality and Background, D&D Basic Rules 2018, p. 35"
          },
          {
            "body": "Cast a spell to detect the merchant's thoughts and gather the information directly.",
            "correct": false,
            "citation": "Chapter 10: Spellcasting, D&D Basic Rules 2018, p. 83"
          }
        ],
        "post": "As a bard, leveraging your charisma and persuasion skills often yields better results in social interactions compared to force or deceit."
      },
    },
    {
      "question": {
        "title": "Handling a Trap in a Dungeon",
        "body": "While exploring a dark dungeon, your party encounters a trapped door. What is the best course of action for the party to safely deal with the trap?",
        "situation": "The party is deep within an ancient dungeon and finds a door that is likely trapped. The rogue in the party suspects there might be a hidden mechanism.",
        "answers": [
          {
            "body": "Have the rogue attempt to disarm the trap using their thieves' tools.",
            "correct": true,
            "citation": "Chapter 7: Using Ability Scores, D&D Basic Rules 2018, p. 63"
          },
          {
            "body": "Break down the door with brute force to bypass the trap.",
            "correct": false,
            "citation": "Chapter 8: Adventuring, D&D Basic Rules 2018, p. 66"
          },
          {
            "body": "Cast a spell to teleport the party past the door.",
            "correct": false,
            "citation": "Chapter 10: Spellcasting, D&D Basic Rules 2018, p. 82"
          },
          {
            "body": "Trigger the trap from a distance to see what happens.",
            "correct": false,
            "citation": "Chapter 8: Adventuring, D&D Basic Rules 2018, p. 69"
          }
        ],
        "post": "Utilizing the rogue's expertise in disarming traps is often the safest approach, as it minimizes risk to the party and allows for a careful examination of potential dangers."
      }
    },    
  ];

  function pickRandomQuestion() {
    return questions[Math.floor(Math.random() * questions.length)];
  }

  loadQuestion(pickRandomQuestion());
});
