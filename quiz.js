document.addEventListener("DOMContentLoaded", function () {
  let questionData;

  const questionTitle = document.getElementById("question-title");
  const questionBody = document.getElementById("question-body");
  const questionSituation = document.getElementById("question-situation");
  const answersContainer = document.getElementById("answers-container");
  const postAnswer = document.getElementById("post-answer");
  const submitButton = document.getElementById("submit");
  const nextButton = document.getElementById("next");
  const questionLabel = document.getElementById("question-label");
  const situationLabel = document.getElementById("situation-label");
  const citationText = document.getElementById("citation");
  let correct = 0;
  let total = 0;

  function complete() {
    answersContainer.innerHTML = "";
    situationLabel.innerHTML = "";
    questionSituation.innerHTML = "";
    questionBody.innerHTML = "";
    citationText.innerHTML = "";
    questionTitle.textContent = "Quiz Complete!";
    questionLabel.textContent = `Score: ${correct} / ${total} (${(
      (correct / total) *
      100
    ).toFixed(2)}%)`;
    nextButton.setAttribute("disabled", true);
    submitButton.setAttribute("disabled", true);
    nextButton.style.display = "none";
    submitButton.style.display = "none";
  }

  function loadQuestion(data) {
    questionData = data;
    answersContainer.innerHTML = "";
    questionTitle.textContent = data.question.title;
    questionBody.textContent = data.question.body;
    questionSituation.textContent = data.question.situation;
    situationLabel.style.display = !data.question?.situation?.length
      ? "none"
      : "block";
    nextButton.setAttribute("disabled", true);
    submitButton.setAttribute("disabled", true);
    nextButton.style.display = "none";
    submitButton.style.display = "block";
    citationText.innerHTML = "";

    shuffle(data.question.answers);

    data.question.answers.forEach((answer, index) => {
      const answerCard = document.createElement("div");
      answerCard.className =
        "answer-card p-4 bg-gray-100 rounded-lg cursor-pointer";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "answer";
      input.id = `answer-${index}`;
      input.value = index;
      input.className = "hidden";

      const label = document.createElement("label");
      label.setAttribute("for", `answer-${index}`);
      label.className = "card-content block";

      const answerText = document.createElement("p");
      answerText.textContent = answer.body;
      answerText.className = "text-lg";

      label.appendChild(answerText);
      answerCard.addEventListener("click", (e) => {
        e.preventDefault();
        if (!input.checked) {
          document.querySelectorAll(".answer-card").forEach((el) => {
            el.classList.remove("checked");
            el.querySelector("input").removeAttribute("checked");
          });
        }
        input.checked = !input.checked;
        input.setAttribute("checked", input.checked);
        if (input.checked && !answerCard.classList.contains("checked")) {
          answerCard.classList.add("checked");
          submitButton.removeAttribute("disabled");
        } else if (
          !input.checked &&
          !!answerCard.classList.contains("checked")
        ) {
          answerCard.classList.remove("checked");
          submitButton.setAttribute("disabled", true);
        }
      });
      answerCard.appendChild(input);
      answerCard.appendChild(label);

      answersContainer.appendChild(answerCard);
    });
  }

  document.getElementById("quiz-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const selectedAnswer = document.querySelector(
      'input[name="answer"]:checked'
    );
    if (selectedAnswer) {
      const answerIndex = parseInt(selectedAnswer.value, 10);
      const isCorrect = questionData.question.answers[answerIndex].correct;
      if (questionData.question.answers[answerIndex].citation) {
        citationText.innerHTML = `Citation: <em class="font-medium">${questionData.question.answers[answerIndex].citation}</em>`;
      }
      if (isCorrect) {
        postAnswer.textContent = `Correct!${
          questionData.question.post ? ` ${questionData.question.post}` : ""
        }`;
        postAnswer.className = "mt-4 text-green-600";
        correct += 1;
        submitButton.style.display = "none";
        nextButton.style.display = "block";
        nextButton.removeAttribute("disabled");
      } else {
        postAnswer.textContent = `Incorrect answer.${
          questionData.question.post ? ` ${questionData.question.post}` : ""
        }`;
        postAnswer.className = "mt-4 text-red-600";
        submitButton.style.display = "none";
        nextButton.style.display = "block";
        nextButton.removeAttribute("disabled");
      }
    }
  });

  nextButton.addEventListener("click", (e) => {
    e.preventDefault();
    postAnswer.textContent = "";
    if (!questions.length) {
      return complete();
    }
    loadQuestion(pickRandomQuestion());
  });

  const questions = [
    {
      question: {
        title: "Channel Divinity Options for Paladins",
        body: "Paladins gain the ability to use Channel Divinity at 2nd level.",
        answers: [
          {
            body: "True",
            correct: false,
            citation: "Player's Handbook, p. 67",
          },
          {
            body: "False",
            correct: true,
            citation: "Player's Handbook, p. 67",
          },
        ],
        post: "Paladins gain the ability to use Channel Divinity at 3rd level, as part of their Sacred Oath feature.",
      },
    },
    {
      question: {
        title: "Skill Proficiency and Ability Checks",
        body: "Proficiency in the Stealth skill allows a character to add their proficiency bonus to Dexterity checks made to sneak or hide.",
        answers: [
          {
            body: "True",
            correct: true,
            citation: "Player's Handbook, p. 175",
          },
          {
            body: "False",
            correct: false,
            citation: "Player's Handbook, p. 175",
          },
        ],
        post: "When a character is proficient in a skill, they can add their proficiency bonus to ability checks involving that skill, enhancing their chances of success.",
      },
    },
    {
      question: {
        title: "Combat Actions: Dodge",
        body: "Which of the following effects occurs when you take the Dodge action?",
        answers: [
          {
            body: "You can move twice your speed for the rest of the turn.",
            correct: false,
            citation: "Player's Handbook, p. 150",
          },
          {
            body: "Your movement doesn't provoke opportunity attacks for the rest of the turn.",
            correct: false,
            citation: "Player's Handbook, p. 150",
          },
          {
            body: "Any attack roll made against you has disadvantage if you can see the attacker.",
            correct: true,
            citation: "Player's Handbook, p. 150",
          },
          {
            body: "You gain advantage on all attack rolls until the start of your next turn.",
            correct: false,
            citation: "Player's Handbook, p. 150",
          },
        ],
        post: "Taking the Dodge action makes you focus entirely on avoiding attacks, causing any attack roll made against you to have disadvantage if you can see the attacker. Additionally, you make Dexterity saving throws with advantage until the start of your next turn.",
      },
    },
    {
      question: {
        title: "Bonus Actions: Two-Weapon Fighting",
        body: "What is required to make an attack with your off-hand weapon as a bonus action?",
        answers: [
          {
            body: "Using a versatile weapon in one hand",
            correct: false,
            citation: "Player's Handbook, p. 152",
          },
          {
            body: "Taking the Attack action with a light melee weapon in one hand",
            correct: true,
            citation: "Player's Handbook, p. 152",
          },
          {
            body: "Taking the Dodge action",
            correct: false,
            citation: "Player's Handbook, p. 152",
          },
          {
            body: "Taking the Dash action",
            correct: false,
            citation: "Player's Handbook, p. 152",
          },
        ],
        post: "When you take the Attack action and attack with a light melee weapon in one hand, you can use a bonus action to attack with a different light melee weapon in the other hand.",
      },
    },
    {
      question: {
        title: "Saving Throw Proficiency",
        body: "Each class in Dungeons & Dragons 5th Edition grants proficiency in at least two saving throws.",
        answers: [
          {
            body: "True",
            correct: true,
            citation: "Player's Handbook, p. 140",
          },
          {
            body: "False",
            correct: false,
            citation: "Player's Handbook, p. 140",
          },
        ],
        post: "Classes in D&D 5e grant proficiency in two different saving throws, which allows characters to add their proficiency bonus to those saves.",
      },
    },
    {
      question: {
        title: "Movement in Difficult Terrain",
        body: "How much movement does it cost to move 1 foot in difficult terrain?",
        answers: [
          {
            body: "1 foot",
            correct: false,
            citation: "Player's Handbook, p. 148",
          },
          {
            body: "2 feet",
            correct: true,
            citation: "Player's Handbook, p. 148",
          },
          {
            body: "3 feet",
            correct: false,
            citation: "Player's Handbook, p. 148",
          },
          {
            body: "Half your speed",
            correct: false,
            citation: "Player's Handbook, p. 148",
          },
        ],
        post: "Moving through difficult terrain costs 1 extra foot of movement for each foot moved, meaning it takes 2 feet of movement to move 1 foot in difficult terrain.",
      },
    },
    {
      question: {
        title: "Proficiency in Tool Use",
        body: "Which of the following statements is true about tool proficiency?",
        answers: [
          {
            body: "Tool proficiency allows you to add your proficiency bonus to any ability check you make using that tool.",
            correct: true,
            citation: "Player's Handbook, p. 120",
          },
          {
            body: "Tool proficiency grants you the ability to craft items without the need for raw materials.",
            correct: false,
            citation: "Player's Handbook, p. 120",
          },
          {
            body: "Tool proficiency allows you to use the tool to cast certain spells.",
            correct: false,
            citation: "Player's Handbook, p. 120",
          },
          {
            body: "Tool proficiency grants you a one-time bonus to your ability score when you first gain it.",
            correct: false,
            citation: "Player's Handbook, p. 120",
          },
        ],
        post: "Proficiency with a tool allows you to add your proficiency bonus to any ability check you make using that tool, reflecting your expertise and experience with it.",
      },
    },
    {
      question: {
        title: "Initiative Ties",
        body: "What happens if two players have the same initiative roll in combat?",
        answers: [
          {
            body: "They reroll until there is no tie.",
            correct: false,
            citation: "Player's Handbook, p. 147",
          },
          {
            body: "They act simultaneously on the same initiative count.",
            correct: false,
            citation: "Player's Handbook, p. 147",
          },
          {
            body: "The players decide the order between their tied characters.",
            correct: true,
            citation: "Player's Handbook, p. 147",
          },
          {
            body: "The DM decides the order for all tied initiative rolls.",
            correct: false,
            citation: "Player's Handbook, p. 147",
          },
        ],
        post: "In the event of a tie on initiative, the players decide the order among their tied characters, while the DM decides the order among tied NPCs and monsters.",
      },
    },
    {
      question: {
        title: "Critical Hits and Damage Rolls",
        body: "When you score a critical hit, how do you calculate the damage?",
        answers: [
          {
            body: "Roll the attack's damage dice once and double the total.",
            correct: false,
            citation: "Player's Handbook, p. 152",
          },
          {
            body: "Roll all of the attack's damage dice twice and add them together.",
            correct: true,
            citation: "Player's Handbook, p. 152",
          },
          {
            body: "Roll the attack's damage dice twice and add them together, then double the result.",
            correct: false,
            citation: "Player's Handbook, p. 152",
          },
          {
            body: "Roll the attack's damage dice twice and add them together, without adding any modifiers.",
            correct: false,
            citation: "Player's Handbook, p. 152",
          },
        ],
        post: "A critical hit allows you to roll all of the attack's damage dice twice and add them together, plus any relevant modifiers, to determine the total damage dealt.",
      },
    },
    {
      question: {
        title: "Paralyzed Condition Effects",
        body: "What happens to a creature that is paralyzed?",
        answers: [
          {
            body: "The creature's speed is reduced to half.",
            correct: false,
            citation: "Player's Handbook, p. 237",
          },
          {
            body: "The creature automatically fails Strength and Dexterity saving throws.",
            correct: true,
            citation: "Player's Handbook, p. 237",
          },
          {
            body: "Attack rolls against the creature have disadvantage.",
            correct: false,
            citation: "Player's Handbook, p. 237",
          },
          {
            body: "The creature can take bonus actions but no regular actions.",
            correct: false,
            citation: "Player's Handbook, p. 237",
          },
        ],
        post: "A paralyzed creature is incapacitated, can't move or speak, and automatically fails Strength and Dexterity saving throws. Additionally, attack rolls against the creature have advantage, and any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.",
      },
    },
    {
      question: {
        title: "Instant Death and Massive Damage",
        body: "Under what circumstance does a character die instantly in D&D 5e?",
        answers: [
          {
            body: "When they fail three death saving throws.",
            correct: false,
            citation: "Player's Handbook, p. 153",
          },
          {
            body: "When damage reduces them to 0 hit points and the remaining damage equals or exceeds their hit point maximum.",
            correct: true,
            citation: "Player's Handbook, p. 153",
          },
          {
            body: "When they take any damage while at 0 hit points.",
            correct: false,
            citation: "Player's Handbook, p. 153",
          },
          {
            body: "When they fail a death saving throw and roll a 1.",
            correct: false,
            citation: "Player's Handbook, p. 153",
          },
        ],
        post: "A character dies instantly if they take damage that reduces them to 0 hit points and the remaining damage equals or exceeds their hit point maximum.",
      },
    },
    {
      question: {
        title: "Multiple Status Effects",
        body: "How are multiple instances of the same condition resolved in D&D 5e?",
        answers: [
          {
            body: "Each instance of the condition has its own duration, but the effects do not stack.",
            correct: true,
            citation: "Player's Handbook, p. 237",
          },
          {
            body: "Only the most potent instance of the condition applies.",
            correct: false,
            citation: "Player's Handbook, p. 237",
          },
          {
            body: "All instances of the condition stack, making the effect worse.",
            correct: false,
            citation: "Player's Handbook, p. 237",
          },
          {
            body: "The condition is applied only once, ignoring any subsequent instances.",
            correct: false,
            citation: "Player's Handbook, p. 237",
          },
        ],
        post: "When a creature is affected by multiple instances of the same condition, each instance has its own duration, but the effects do not become more severe.",
      },
    },
    {
      question: {
        title: "Escaping a Grapple",
        body: "What action must a grappled creature take to attempt to escape the grapple?",
        answers: [
          {
            body: "Use their reaction",
            correct: false,
            citation: "Player's Handbook, p. 152",
          },
          {
            body: "Use their bonus action",
            correct: false,
            citation: "Player's Handbook, p. 152",
          },
          {
            body: "Use their action",
            correct: true,
            citation: "Player's Handbook, p. 152",
          },
          {
            body: "Use half their movement",
            correct: false,
            citation: "Player's Handbook, p. 152",
          },
        ],
        post: "To escape a grapple, a grappled creature must use its action to make a successful Strength (Athletics) or Dexterity (Acrobatics) check contested by the grappler's Strength (Athletics) check.",
      },
    },
    {
      question: {
        title: "Calculating Damage in a Hypothetical Scenario",
        body: "A fighter with a Strength score of 18 and proficiency in long swords hits an enemy with a long sword. The fighter also has the Dueling fighting style, which grants a +2 bonus to damage rolls when wielding a melee weapon in one hand and no other weapons. What is the total damage dealt if the fighter rolls a 6 on the damage die?",
        situation:
          "The fighter is engaged in combat and makes a successful attack roll with their long sword.",
        answers: [
          {
            body: "8 damage",
            correct: false,
            citation: "Player's Handbook, p. 152",
          },
          {
            body: "10 damage",
            correct: true,
            citation: "Player's Handbook, p. 152",
          },
          {
            body: "12 damage",
            correct: false,
            citation: "Player's Handbook, p. 152",
          },
          {
            body: "14 damage",
            correct: false,
            citation: "Player's Handbook, p. 152",
          },
        ],
        post: "The total damage is calculated by adding the damage die roll (6) to the fighter's Strength modifier (+4 for a Strength score of 18) and the Dueling fighting style bonus (+2), resulting in a total of 10 damage.",
      },
    },
    {
      question: {
        title: "Deities and Their Domains",
        body: "Which of the following deities is associated with the Knowledge domain?",
        answers: [
          {
            body: "Aphrodite",
            correct: false,
            citation: "Player's Handbook, p. 244",
          },
          {
            body: "Apollo",
            correct: true,
            citation: "Player's Handbook, p. 244",
          },
          {
            body: "Ares",
            correct: false,
            citation: "Player's Handbook, p. 244",
          },
          {
            body: "Hera",
            correct: false,
            citation: "Player's Handbook, p. 244",
          },
        ],
        post: "Apollo is associated with the Knowledge domain, as well as the Life and Light domains.",
      },
    },
    {
      question: {
        title: "Ability Scores and Modifiers",
        body: "An elf rogue has a Dexterity score of 18. During an attack, they have advantage and roll a 17 and a 5 on the d20. What is their total attack roll?",
        situation:
          "The rogue is attempting to attack an enemy with their shortbow, and they have advantage on the roll.",
        answers: [
          {
            body: "21",
            correct: true,
            citation: "Player's Handbook, p. 135",
          },
          {
            body: "20",
            correct: false,
            citation: "Player's Handbook, p. 135",
          },
          {
            body: "19",
            correct: false,
            citation: "Player's Handbook, p. 135",
          },
          {
            body: "18",
            correct: false,
            citation: "Player's Handbook, p. 135",
          },
        ],
        post: "The rogue's Dexterity modifier is +4 (for a score of 18), and since they have advantage, they use the higher roll of 17. Adding the Dexterity modifier results in a total attack roll of 21.",
      },
    },
    {
      question: {
        title: "Paladin Auras",
        body: "What benefit does a paladin's Aura of Protection provide?",
        answers: [
          {
            body: "It grants resistance to all damage types to friendly creatures within 10 feet.",
            correct: false,
            citation: "Player's Handbook, p. 67",
          },
          {
            body: "It grants a bonus to saving throws to friendly creatures within 10 feet equal to the paladin's Charisma modifier.",
            correct: true,
            citation: "Player's Handbook, p. 67",
          },
          {
            body: "It makes friendly creatures within 10 feet immune to being frightened.",
            correct: false,
            citation: "Player's Handbook, p. 67",
          },
          {
            body: "It allows friendly creatures within 10 feet to add the paladin's proficiency bonus to their attack rolls.",
            correct: false,
            citation: "Player's Handbook, p. 67",
          },
        ],
        post: "Aura of Protection provides a bonus to saving throws for friendly creatures within 10 feet of the paladin, equal to the paladin's Charisma modifier.",
      },
    },
    {
      question: {
        title: "Definition of the Insight Skill",
        body: "What does proficiency in the Insight skill represent?",
        answers: [
          {
            body: "Proficiency in Insight represents a character's ability to notice hidden objects.",
            correct: false,
            citation: "Player's Handbook, p. 139",
          },
          {
            body: "Proficiency in Insight represents a character's ability to understand languages.",
            correct: false,
            citation: "Player's Handbook, p. 139",
          },
          {
            body: "Proficiency in Insight represents a character's ability to determine the true intentions of a creature, such as when searching out a lie or predicting someone's next move.",
            correct: true,
            citation: "Player's Handbook, p. 139",
          },
          {
            body: "Proficiency in Insight represents a character's ability to perform acrobatic stunts.",
            correct: false,
            citation: "Player's Handbook, p. 139",
          },
        ],
        post: "The Insight skill reflects a character's sharp perception of others' emotions and intentions, which can be critical in social interactions and determining the truthfulness of statements.",
      },
    },
    {
      question: {
        title: "Definition of Perception",
        body: "What does the Perception skill represent in Dungeons & Dragons 5th Edition?",
        answers: [
          {
            body: "A character's ability to recall lore about spells, magic items, and the planes of existence.",
            correct: false,
            citation: "Player's Handbook, p. 139",
          },
          {
            body: "A character's ability to notice, hear, or otherwise detect the presence of something.",
            correct: true,
            citation: "Player's Handbook, p. 139",
          },
          {
            body: "A character's ability to influence others through social interaction.",
            correct: false,
            citation: "Player's Handbook, p. 139",
          },
          {
            body: "A character's ability to perform feats of agility and balance.",
            correct: false,
            citation: "Player's Handbook, p. 139",
          },
        ],
        post: "The Perception skill is crucial for detecting hidden enemies, finding traps, and noticing other important details in the environment.",
      },
    },
    {
      question: {
        title: "Hypothetical Combat Scenario",
        body: "A wizard casts Fireball at a group of goblins. The goblins have a Dexterity saving throw modifier of +2. If the wizard's spell save DC is 15, what roll do the goblins need to make to avoid taking full damage from the Fireball?",
        situation:
          "The wizard has positioned the Fireball to catch four goblins in its area of effect.",
        answers: [
          {
            body: "13 or higher",
            correct: true,
            citation: "Player's Handbook, p. 241",
          },
          {
            body: "15 or higher",
            correct: false,
            citation: "Player's Handbook, p. 241",
          },
          {
            body: "17 or higher",
            correct: false,
            citation: "Player's Handbook, p. 241",
          },
          {
            body: "14 or higher",
            correct: false,
            citation: "Player's Handbook, p. 241",
          },
        ],
        post: "To avoid taking full damage from the Fireball, the goblins need to roll a 13 or higher on their Dexterity saving throw, because they get +2, equaling 15. They need to match or exceed the wizard's spell save DC of 15.",
      },
    },
    {
      question: {
        title: "Hypothetical Combat Scenario",
        situation:
          "A rogue uses their Cunning Action to attack twice in a single turn.",
        body: "Is this a legal action?",
        answers: [
          {
            body: "True",
            correct: false,
            citation: "Player's Handbook, p. 76",
          },
          {
            body: "False",
            correct: true,
            citation: "Player's Handbook, p. 76",
          },
        ],
        post: "A rogue's Cunning Action allows them to take a bonus action to Dash, Disengage, or Hide, but it does not allow them to attack twice in a single turn.",
      },
    },
    {
      question: {
        title: "Understanding Resistances",
        body: "A creature with resistance to fire damage takes how much damage from a fireball spell that deals 24 points of fire damage?",
        answers: [
          {
            body: "24 points",
            correct: false,
            citation: "Player's Handbook, p. 153",
          },
          {
            body: "12 points",
            correct: true,
            citation: "Player's Handbook, p. 153",
          },
          {
            body: "6 points",
            correct: false,
            citation: "Player's Handbook, p. 153",
          },
          {
            body: "No damage",
            correct: false,
            citation: "Player's Handbook, p. 153",
          },
        ],
        post: "When a creature has resistance to a damage type, it takes half damage from attacks of that type. In this case, the creature takes 12 points of fire damage from the fireball spell.",
      },
    },
    {
      question: {
        title: "Definition of Force Damage",
        body: "What is the correct definition of force damage in Dungeons & Dragons 5th Edition?",
        answers: [
          {
            body: "Damage caused by fire and extreme heat.",
            correct: false,
            citation: "Player's Handbook, p. 153",
          },
          {
            body: "Damage caused by the sheer power of a spell or other magical effect.",
            correct: true,
            citation: "Player's Handbook, p. 153",
          },
          {
            body: "Damage caused by extreme cold or ice.",
            correct: false,
            citation: "Player's Handbook, p. 153",
          },
          {
            body: "Damage caused by poison or venom.",
            correct: false,
            citation: "Player's Handbook, p. 153",
          },
        ],
        post: "Force damage is unique as it represents pure magical energy focused into a damaging form. It is commonly dealt by spells like magic missile and spiritual weapon.",
      },
    },
    {
      question: {
        title: "Death Saving Throws Mechanics",
        body: "What happens when a character rolls a natural 1 on a death saving throw?",
        answers: [
          {
            body: "The character suffers one failure.",
            correct: false,
            citation: "Player's Handbook, p. 153",
          },
          {
            body: "The character suffers two failures.",
            correct: true,
            citation: "Player's Handbook, p. 153",
          },
          {
            body: "The character instantly dies.",
            correct: false,
            citation: "Player's Handbook, p. 153",
          },
          {
            body: "The character becomes stable.",
            correct: false,
            citation: "Player's Handbook, p. 153",
          },
        ],
        post: "Rolling a natural 1 on a death saving throw is particularly dangerous as it counts as two failures, hastening the risk of death for the character.",
      },
    },
    {
      question: {
        title: "Combat Action: Disengage",
        body: "What is the primary benefit of taking the Disengage action in combat?",
        answers: [
          {
            body: "Your movement does not provoke opportunity attacks for the rest of the turn.",
            correct: true,
            citation: "Player's Handbook, p. 150",
          },
          {
            body: "You gain advantage on all attack rolls for the rest of the turn.",
            correct: false,
            citation: "Player's Handbook, p. 150",
          },
          {
            body: "You can move an additional distance equal to your speed.",
            correct: false,
            citation: "Player's Handbook, p. 150",
          },
          {
            body: "You can take another action immediately after the Disengage action.",
            correct: false,
            citation: "Player's Handbook, p. 150",
          },
        ],
        post: "Using the Disengage action is a great way to avoid opportunity attacks when you need to move away from an enemy without provoking a potential hit.",
      },
    },
  ];
  total = questions.length;

  // Thanks https://stackoverflow.com/a/2450976
  function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
  }

  function pickRandomQuestion() {
    shuffle(questions);
    return questions.pop();
  }

  loadQuestion(pickRandomQuestion());
});
