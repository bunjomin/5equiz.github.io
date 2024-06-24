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
  const progressBar = document.getElementById("progress-bar");
  const total = 10;

  let correct = 0;
  let currentQuestionIndex = 0;

  function updateProgressBar() {
    const progress = ((currentQuestionIndex / total) * 100).toFixed(2);
    progressBar.style.width = `${progress}%`;
  }

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

    updateProgressBar();
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
      currentQuestionIndex += 1;
      if (currentQuestionIndex >= total) {
        complete();
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

  let questions = [
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
            correct: false,
            citation: "Player's Handbook, p. 152",
          },
          {
            body: "12 damage",
            correct: true,
            citation: "Player's Handbook, p. 152",
          },
          {
            body: "14 damage",
            correct: false,
            citation: "Player's Handbook, p. 152",
          },
        ],
        post: "The total damage is calculated by adding the damage die roll (6) to the fighter's Strength modifier (+4 for a Strength score of 18) and the Dueling fighting style bonus (+2), resulting in a total of 12 damage.",
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
    {
      question: {
        title: "Understanding Advantage and Disadvantage",
        body: "Which of the following situations would grant advantage on an attack roll?",
        situation:
          "You are a rogue hidden behind a tree, about to make a sneak attack.",
        answers: [
          {
            body: "The target is unseen by you.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 151",
          },
          {
            body: "The target is paralyzed.",
            correct: true,
            citation: "DnD 5e Players Handbook, page 237",
          },
          {
            body: "You are prone and attacking with a ranged weapon.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 238",
          },
          {
            body: "You are attacking a target within 5 feet with a ranged weapon.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 151",
          },
        ],
        post: "In D&D 5e, advantage and disadvantage are commonly influenced by conditions or tactical positioning. Understanding these mechanics can greatly improve your effectiveness in combat.",
      },
    },
    {
      question: {
        title: "Making an Attack",
        body: "Which of the following is the correct order of steps for making an attack in Dungeons & Dragons 5th Edition?",
        situation:
          "You are a fighter facing a goblin and preparing to make an attack with your longsword.",
        answers: [
          {
            body: "Choose a target, determine modifiers, resolve the attack.",
            correct: true,
            citation: "DnD 5e Players Handbook, page 150",
          },
          {
            body: "Resolve the attack, determine modifiers, choose a target.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 150",
          },
          {
            body: "Determine modifiers, resolve the attack, choose a target.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 150",
          },
          {
            body: "Choose a target, resolve the attack, determine modifiers.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 150",
          },
        ],
        post: "When making an attack, it's important to follow the correct order of steps to ensure the attack is handled properly. This includes choosing a target, determining any modifiers, and then resolving the attack.",
      },
    },
    {
      question: {
        title: "Definition of the Animal Handling Skill",
        body: "What does the Animal Handling skill primarily involve?",
        answers: [
          {
            body: "Calming down a domesticated animal, keeping a mount from getting spooked, or intuiting an animal’s intentions.",
            correct: true,
            citation: "DnD 5e Players Handbook, page 139",
          },
          {
            body: "Detecting hidden traps or secret doors in a dungeon.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 139",
          },
          {
            body: "Deciphering ancient languages and runes.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 139",
          },
          {
            body: "Performing acrobatic stunts like flips and rolls.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 139",
          },
        ],
        post: "The Animal Handling skill is crucial for characters who frequently interact with animals, ensuring they can manage and understand animal behavior effectively.",
      },
    },
    {
      question: {
        title: "Spell Components and Casting",
        body: "Which of the following statements about spell components is true?",
        answers: [
          {
            body: "A spellcaster must always provide all components (verbal, somatic, material) to cast a spell.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 158",
          },
          {
            body: "A spellcaster can use a spellcasting focus in place of material components that don't have a cost.",
            correct: true,
            citation: "DnD 5e Players Handbook, page 158",
          },
          {
            body: "A spellcaster can cast a spell with verbal components in an area of silence.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 158",
          },
          {
            body: "A spellcaster must have both hands free to cast a spell with somatic components.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 158",
          },
        ],
        post: "Understanding the components required for casting spells is crucial for effective spellcasting. Components can include verbal, somatic, and material elements, and a spellcasting focus can often replace material components without a specified cost.",
      },
    },
    {
      question: {
        title: "Adventuring Basics",
        body: "Which of the following actions can a character perform while traveling without contributing their passive Wisdom (Perception) score to notice hidden threats?",
        answers: [
          {
            body: "Navigating to prevent the group from getting lost.",
            correct: true,
            citation: "DnD 5e Players Handbook, page 143",
          },
          {
            body: "Marching at the front of the group.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 143",
          },
          {
            body: "Maintaining a normal travel pace.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 143",
          },
          {
            body: "Watching for potential dangers.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 143",
          },
        ],
        post: "While traveling, characters can engage in activities such as navigating, drawing maps, tracking, or foraging, but these tasks will prevent them from contributing their passive Wisdom (Perception) score to notice hidden threats.",
      },
    },
    {
      question: {
        title: "Understanding Lighting in D&D 5e",
        body: "Which of the following accurately describes the effects of dim light in D&D 5th Edition?",
        answers: [
          {
            body: "Dim light creates a heavily obscured area where creatures are considered blinded.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 143",
          },
          {
            body: "Dim light creates a lightly obscured area, imposing disadvantage on Wisdom (Perception) checks that rely on sight.",
            correct: true,
            citation: "DnD 5e Players Handbook, page 143",
          },
          {
            body: "Dim light makes it impossible to see anything, as if in total darkness.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 143",
          },
          {
            body: "Dim light allows creatures to see perfectly, with no penalties.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 143",
          },
        ],
        post: "Understanding the different lighting conditions in D&D is essential for navigating and strategizing in various environments. Dim light, often referred to as shadows, creates a lightly obscured area that affects perception.",
      },
    },
    {
      question: {
        title: "Understanding Resting in D&D 5e",
        body: "Which of the following statements about a long rest is true?",
        answers: [
          {
            body: "A long rest must be at least 6 hours long.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 145",
          },
          {
            body: "A character can benefit from multiple long rests in a 24-hour period.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 145",
          },
          {
            body: "A long rest can be interrupted by up to 1 hour of walking, fighting, casting spells, or other strenuous activity.",
            correct: true,
            citation: "DnD 5e Players Handbook, page 145",
          },
          {
            body: "At the end of a long rest, a character regains all spent Hit Dice.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 145",
          },
        ],
        post: "Long rests are crucial for characters to recover hit points and regain spell slots. Ensure to follow the rules about the duration and interruptions to make the most out of a long rest.",
      },
    },
    {
      question: {
        title: "Performing an Ability Check",
        body: "You are attempting to climb a sheer cliff face during a rainstorm. Which ability check should you make, and what might the DM consider in determining the DC?",
        situation:
          "As you ascend the cliff, the rain makes the rocks slippery and more difficult to grip.",
        answers: [
          {
            body: "Strength (Athletics) check, with a higher DC due to the rain.",
            correct: true,
            citation: "DnD 5e Players Handbook, page 136",
          },
          {
            body: "Dexterity (Acrobatics) check, with a lower DC due to the rain.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 136",
          },
          {
            body: "Constitution (Endurance) check, with no change in DC due to the rain.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 136",
          },
          {
            body: "Wisdom (Perception) check, with a higher DC due to the rain.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 136",
          },
        ],
        post: "In challenging environmental conditions, DMs often adjust the Difficulty Class (DC) of ability checks to reflect the increased difficulty. Climbing a slippery cliff during a rainstorm would require a Strength (Athletics) check with a higher DC.",
      },
    },
    {
      question: {
        title: "Ranged Attacks in Close Combat",
        body: "What disadvantage does a character face when making a ranged attack while within 5 feet of a hostile creature that can see them and isn't incapacitated?",
        situation:
          "You are a ranger in melee combat with an orc, and you want to use your longbow to attack.",
        answers: [
          {
            body: "The attack is made with disadvantage.",
            correct: true,
            citation: "DnD 5e Players Handbook, page 151",
          },
          {
            body: "The attack automatically misses.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 151",
          },
          {
            body: "The attack can only be made as a melee attack.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 151",
          },
          {
            body: "The attack deals half damage.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 151",
          },
        ],
        post: "When making a ranged attack while within 5 feet of a hostile creature that can see you and isn't incapacitated, you have disadvantage on the attack roll. This rule encourages strategic positioning in combat.",
      },
    },
    {
      question: {
        title: "Understanding Cover in Combat",
        body: "Which of the following statements accurately describes three-quarters cover?",
        answers: [
          {
            body: "A target with three-quarters cover has a +5 bonus to AC and Dexterity saving throws.",
            correct: true,
            citation: "DnD 5e Players Handbook, page 152",
          },
          {
            body: "A target with three-quarters cover has a +2 bonus to AC and Dexterity saving throws.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 152",
          },
          {
            body: "A target with three-quarters cover cannot be targeted by attacks.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 152",
          },
          {
            body: "A target with three-quarters cover has a +3 bonus to AC and Dexterity saving throws.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 152",
          },
        ],
        post: "Cover is an important aspect of combat in D&D 5e, providing various bonuses to AC and Dexterity saving throws depending on the degree of cover. Three-quarters cover offers a significant defensive advantage.",
      },
    },
    {
      question: {
        title: "Warlock's Pact Magic",
        body: "What happens when a warlock uses their Pact Magic feature to cast a spell using a spell slot?",
        answers: [
          {
            body: "The spell is always cast at the highest level of spell slot available to the warlock.",
            correct: true,
            citation: "DnD 5e Players Handbook, page 85",
          },
          {
            body: "The warlock can choose the level of the spell slot used, similar to wizards.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 85",
          },
          {
            body: "The spell is cast at its lowest level, regardless of the spell slot used.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 85",
          },
          {
            body: "The warlock cannot cast spells using spell slots.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 85",
          },
        ],
        post: "Warlocks have a unique spellcasting feature called Pact Magic, which differs from other spellcasters. They cast their spells using the highest-level spell slots available to them.",
      },
    },
    {
      question: {
        title: "Druid's Wild Shape",
        body: "What happens to a druid's equipment when they use Wild Shape to transform into a beast?",
        answers: [
          {
            body: "The equipment merges into the new form and has no effect until the druid reverts back.",
            correct: true,
            citation: "DnD 5e Players Handbook, page 50",
          },
          {
            body: "The equipment falls to the ground and cannot be used until picked up again.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 50",
          },
          {
            body: "The equipment reshapes to fit the new form and functions as normal.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 50",
          },
          {
            body: "The equipment is destroyed and must be replaced.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 50",
          },
        ],
        post: "When a druid uses Wild Shape, they can choose whether their equipment falls to the ground, merges into their new form, or is worn by the new form. Equipment that merges has no effect until the druid reverts back.",
      },
    },
    {
      question: {
        title: "Thrown Weapons vs. Other Ranged Weapons",
        body: "Which of the following is a key difference between thrown weapons and other ranged weapons like bows or crossbows in D&D 5e?",
        answers: [
          {
            body: "Thrown weapons use the same ability modifier for attack and damage rolls as they do for melee attacks.",
            correct: true,
            citation: "DnD 5e Players Handbook, page 152",
          },
          {
            body: "Thrown weapons require the use of ammunition to make an attack.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 152",
          },
          {
            body: "Thrown weapons always use Dexterity for attack and damage rolls.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 152",
          },
          {
            body: "Thrown weapons have a longer range than bows or crossbows.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 152",
          },
        ],
        post: "Thrown weapons, unlike other ranged weapons, use the same ability modifier for attack and damage rolls as they do for melee attacks. This can be Strength or Dexterity, depending on the weapon's properties.",
      },
    },
    {
      question: {
        title: "Opportunity Attacks",
        body: "When can a character make an opportunity attack?",
        situation:
          "You are engaged in melee combat with an enemy and are considering your options.",
        answers: [
          {
            body: "When a hostile creature that you can see moves out of your reach.",
            correct: true,
            citation: "DnD 5e Players Handbook, page 151",
          },
          {
            body: "When you move out of a hostile creature's reach.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 151",
          },
          {
            body: "When a creature teleports out of your reach.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 151",
          },
          {
            body: "When a creature takes the Disengage action and moves out of your reach.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 151",
          },
        ],
        post: "Opportunity attacks are a crucial part of melee combat strategy, allowing you to potentially interrupt an enemy's movement and deal damage as they try to escape your reach.",
      },
    },
    {
      question: {
        title: "Roleplaying Alignment",
        body: "How might a lawful good character react to witnessing a thief stealing from a market stall?",
        situation: "You are playing a paladin in a bustling city marketplace.",
        answers: [
          {
            body: "They would try to stop the thief and return the stolen goods to the rightful owner, possibly involving the local authorities.",
            correct: true,
            citation: "DnD 5e Players Handbook, page 98",
          },
          {
            body: "They would ignore the theft, believing it is not their business.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 98",
          },
          {
            body: "They would help the thief escape, believing the merchant is wealthy enough to afford the loss.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 98",
          },
          {
            body: "They would confront the thief and demand a share of the stolen goods.",
            correct: false,
            citation: "DnD 5e Players Handbook, page 98",
          },
        ],
        post: "Roleplaying a character's alignment involves making decisions that reflect their moral and ethical beliefs. A lawful good character values law, order, and helping others, which guides their actions in various situations.",
      },
    },
    {
      question: {
        title: "Multiclassing Requirements",
        body: "Which ability scores must be 13 or higher for a character to multiclass into a paladin?",
        answers: [
          {
            body: "Strength and Charisma",
            correct: true,
            citation: "DnD 5e Players Handbook, page 127",
          },
          {
            body: "Strength and Dexterity",
            correct: false,
            citation: "DnD 5e Players Handbook, page 127",
          },
          {
            body: "Wisdom and Charisma",
            correct: false,
            citation: "DnD 5e Players Handbook, page 127",
          },
          {
            body: "Dexterity and Wisdom",
            correct: false,
            citation: "DnD 5e Players Handbook, page 127",
          },
        ],
        post: "To multiclass into certain classes, you must meet the ability score prerequisites. For a paladin, this means having a Strength and Charisma score of 13 or higher.",
      },
    },
  ];

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

  shuffle(questions);
  questions = [...questions.slice(0, total)];
  console.log(questions.map((q) => q.question.title));

  loadQuestion(pickRandomQuestion());
});
