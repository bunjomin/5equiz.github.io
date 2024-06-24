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
  let correct = 0;
  let total = 0;

  function complete() {
    answersContainer.innerHTML = "";
    situationLabel.innerHTML = "";
    questionSituation.innerHTML = "";
    questionBody.innerHTML = "";
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
        title: "Deities in D&D",
        body: "Which deity is primarily associated with the domain of knowledge in the Forgotten Realms?",
        answers: [
          {
            body: "Moradin",
            correct: false,
            citation:
              "Appendix B: Gods of the Multiverse, D&D Basic Rules 2018, p. 172",
          },
          {
            body: "Corellon Larethian",
            correct: false,
            citation:
              "Appendix B: Gods of the Multiverse, D&D Basic Rules 2018, p. 172",
          },
          {
            body: "Oghma",
            correct: true,
            citation:
              "Appendix B: Gods of the Multiverse, D&D Basic Rules 2018, p. 172",
          },
          {
            body: "Tymora",
            correct: false,
            citation:
              "Appendix B: Gods of the Multiverse, D&D Basic Rules 2018, p. 172",
          },
        ],
      },
    },
    {
      question: {
        title: "Roleplaying in a Social Interaction",
        body: "You are playing as a bard in a bustling city. The party needs information from a suspicious merchant who seems unwilling to cooperate. What should your character do to best handle the situation?",
        situation:
          "The party has encountered a merchant who might have critical information about a stolen artifact they are seeking. The merchant is visibly nervous and initially refuses to talk.",
        answers: [
          {
            body: "Intimidate the merchant into revealing the information.",
            correct: false,
            citation:
              "Chapter 7: Using Ability Scores, D&D Basic Rules 2018, p. 64",
          },
          {
            body: "Offer the merchant a bribe to encourage cooperation.",
            correct: false,
            citation: "Chapter 8: Adventuring, D&D Basic Rules 2018, p. 70",
          },
          {
            body: "Use your bardic charm and persuasion skills to gain the merchant's trust.",
            correct: true,
            citation:
              "Chapter 4: Personality and Background, D&D Basic Rules 2018, p. 35",
          },
          {
            body: "Cast a spell to detect the merchant's thoughts and gather the information directly.",
            correct: false,
            citation: "Chapter 10: Spellcasting, D&D Basic Rules 2018, p. 83",
          },
        ],
        post: "As a bard, leveraging your charisma and persuasion skills often yields better results in social interactions compared to force or deceit.",
      },
    },
    {
      question: {
        title: "Handling a Trap in a Dungeon",
        body: "While exploring a dark dungeon, your party encounters a trapped door. What is the best course of action for the party to safely deal with the trap?",
        situation:
          "The party is deep within an ancient dungeon and finds a door that is likely trapped. The rogue in the party suspects there might be a hidden mechanism.",
        answers: [
          {
            body: "Have the rogue attempt to disarm the trap using their thieves' tools.",
            correct: true,
            citation:
              "Chapter 7: Using Ability Scores, D&D Basic Rules 2018, p. 63",
          },
          {
            body: "Break down the door with brute force to bypass the trap.",
            correct: false,
            citation: "Chapter 8: Adventuring, D&D Basic Rules 2018, p. 66",
          },
          {
            body: "Cast a spell to teleport the party past the door.",
            correct: false,
            citation: "Chapter 10: Spellcasting, D&D Basic Rules 2018, p. 82",
          },
          {
            body: "Trigger the trap from a distance to see what happens.",
            correct: false,
            citation: "Chapter 8: Adventuring, D&D Basic Rules 2018, p. 69",
          },
        ],
        post: "Utilizing the rogue's expertise in disarming traps is often the safest approach, as it minimizes risk to the party and allows for a careful examination of potential dangers.",
      },
    },
    {
      question: {
        title: "Paladin's Divine Sense",
        body: "Which of the following is detected by a Paladin's Divine Sense ability?",
        answers: [
          {
            body: "Celestials",
            correct: true,
            citation: "Chapter 3: Classes, D&D Basic Rules 2018, p. 44",
          },
          {
            body: "Constructs",
            correct: false,
            citation: "Chapter 3: Classes, D&D Basic Rules 2018, p. 44",
          },
          {
            body: "Elementals",
            correct: false,
            citation: "Chapter 3: Classes, D&D Basic Rules 2018, p. 44",
          },
          {
            body: "Fey",
            correct: false,
            citation: "Chapter 3: Classes, D&D Basic Rules 2018, p. 44",
          },
        ],
        post: "A Paladin's Divine Sense ability allows them to detect the presence of celestials, fiends, and undead within a certain radius, making it a powerful tool for identifying hidden threats.",
      },
    },
    {
      question: {
        title: "Determining Initiative",
        body: "What ability score modifier is added to a character's initiative roll?",
        answers: [
          {
            body: "Strength",
            correct: false,
            citation: "Chapter 9: Combat, D&D Basic Rules 2018, p. 73",
          },
          {
            body: "Dexterity",
            correct: true,
            citation: "Chapter 9: Combat, D&D Basic Rules 2018, p. 73",
          },
          {
            body: "Wisdom",
            correct: false,
            citation: "Chapter 9: Combat, D&D Basic Rules 2018, p. 73",
          },
          {
            body: "Charisma",
            correct: false,
            citation: "Chapter 9: Combat, D&D Basic Rules 2018, p. 73",
          },
        ],
        post: "The initiative roll determines the order of turns in combat. Adding the Dexterity modifier reflects a character's quickness and reflexes in reacting to danger.",
      },
    },
    {
      question: {
        title: "Actions in Combat",
        body: "Which of the following is considered an action a character can take on their turn during combat?",
        answers: [
          {
            body: "Cast a spell",
            correct: true,
            citation: "Chapter 9: Combat, D&D Basic Rules 2018, p. 74",
          },
          {
            body: "Regain hit points",
            correct: false,
            citation: "Chapter 9: Combat, D&D Basic Rules 2018, p. 74",
          },
          {
            body: "Equip a shield",
            correct: false,
            citation: "Chapter 9: Combat, D&D Basic Rules 2018, p. 74",
          },
          {
            body: "Use a reaction",
            correct: false,
            citation: "Chapter 9: Combat, D&D Basic Rules 2018, p. 74",
          },
        ],
        post: "Casting a spell is one of the standard actions a character can take on their turn in combat. Other actions include making an attack, dashing, disengaging, dodging, helping, hiding, readying an action, searching, and using an object.",
      },
    },
    {
      question: {
        title: "Order of Resolution of Effects",
        body: "True or False: If a character is subjected to both a 'Hold Person' spell and an 'Invisibility' spell in the same round, the 'Hold Person' effect takes precedence and the character is paralyzed but still visible.",
        situation:
          "A wizard casts 'Hold Person' on a rogue, and in the same round, another wizard casts 'Invisibility' on the same rogue. The DM needs to determine the rogue's state at the end of these actions.",
        answers: [
          {
            body: "True",
            correct: true,
            citation: "Chapter 10: Spellcasting, D&D Basic Rules 2018, p. 81",
          },
          {
            body: "False",
            correct: false,
            citation: "Chapter 10: Spellcasting, D&D Basic Rules 2018, p. 81",
          },
        ],
        post: "The 'Hold Person' spell paralyzes the target, and while paralyzed, the character cannot take any actions, including maintaining concentration on spells such as 'Invisibility'. Therefore, the rogue remains paralyzed and visible.",
      },
    },
    {
      question: {
        title: "Movement in Combat",
        body: "Which of the following statements about movement in combat is correct?",
        answers: [
          {
            body: "A character can move through a space occupied by an enemy as long as they do not end their movement there.",
            correct: false,
            citation: "Chapter 9: Combat, D&D Basic Rules 2018, p. 73",
          },
          {
            body: "A character can move through a space occupied by a friendly creature.",
            correct: true,
            citation: "Chapter 9: Combat, D&D Basic Rules 2018, p. 73",
          },
          {
            body: "A character can move diagonally through corners of walls without penalty.",
            correct: false,
            citation: "Chapter 9: Combat, D&D Basic Rules 2018, p. 73",
          },
          {
            body: "A character must spend an action to move through difficult terrain.",
            correct: false,
            citation: "Chapter 9: Combat, D&D Basic Rules 2018, p. 73",
          },
        ],
        post: "In combat, a character can move through a space occupied by a friendly creature but cannot end their movement in that space. This allows for more tactical flexibility during encounters.",
      },
    },
    {
      question: {
        title: "Using Bonus Actions in Combat",
        body: "Which of the following actions can be performed as a bonus action by a character in combat?",
        answers: [
          {
            body: "Casting 'Healing Word'",
            correct: true,
            citation: "Chapter 9: Combat, D&D Basic Rules 2018, p. 75",
          },
          {
            body: "Drawing a weapon",
            correct: false,
            citation: "Chapter 9: Combat, D&D Basic Rules 2018, p. 75",
          },
          {
            body: "Drinking a potion",
            correct: false,
            citation: "Chapter 9: Combat, D&D Basic Rules 2018, p. 75",
          },
          {
            body: "Using the 'Disengage' action",
            correct: false,
            citation: "Chapter 9: Combat, D&D Basic Rules 2018, p. 75",
          },
        ],
        post: "Some spells, such as 'Healing Word', specifically state that they can be cast as a bonus action. This allows characters to perform another action on their turn, maximizing their effectiveness in combat.",
      },
    },
    {
      question: {
        title: "Understanding Dungeon Traps",
        body: "When a character is trying to detect a trap in a dungeon, which of the following skills is primarily used?",
        situation:
          "The party is exploring an ancient tomb rumored to be filled with dangerous traps. The rogue is leading the way, carefully checking for traps as they progress through the dark corridors.",
        answers: [
          {
            body: "Investigation",
            correct: true,
            citation: "DnD_BasicRules_2018.pdf, p. 69",
          },
          {
            body: "Perception",
            correct: false,
            citation: "DnD_BasicRules_2018.pdf, p. 69",
          },
          {
            body: "Survival",
            correct: false,
            citation: "DnD_BasicRules_2018.pdf, p. 69",
          },
          {
            body: "Stealth",
            correct: false,
            citation: "DnD_BasicRules_2018.pdf, p. 69",
          },
        ],
        post: "While both Investigation and Perception can be used to detect traps, Investigation is primarily used to find and understand the workings of traps, whereas Perception is more about noticing the presence of a trap.",
      },
    },
    {
      question: {
        title: "Barbarian's Rage Ability",
        body: "What benefit does a Barbarian gain from using their Rage ability?",
        answers: [
          {
            body: "Advantage on Strength checks and saving throws, bonus to melee damage with Strength weapons, and resistance to bludgeoning, piercing, and slashing damage.",
            correct: true,
            citation: "DnD_BasicRules_2018.pdf, p. 48",
          },
          {
            body: "Advantage on all attack rolls, increased movement speed, and immunity to fear.",
            correct: false,
            citation: "DnD_BasicRules_2018.pdf, p. 48",
          },
          {
            body: "Bonus to AC, extra attack per turn, and resistance to fire damage.",
            correct: false,
            citation: "DnD_BasicRules_2018.pdf, p. 48",
          },
          {
            body: "Advantage on Dexterity checks and saving throws, bonus to ranged attack damage, and resistance to poison damage.",
            correct: false,
            citation: "DnD_BasicRules_2018.pdf, p. 48",
          },
        ],
        post: "When a Barbarian enters a Rage, they gain significant benefits that enhance their combat effectiveness, making them more durable and dangerous in battle.",
      },
    },
    {
      question: {
        title: "Rations and Traveling in D&D",
        body: "How much food does a character need per day to avoid exhaustion?",
        answers: [
          {
            body: "One pound of food",
            correct: true,
            citation: "DnD_BasicRules_2018.pdf, p. 68",
          },
          {
            body: "Two pounds of food",
            correct: false,
            citation: "DnD_BasicRules_2018.pdf, p. 68",
          },
          {
            body: "Half a pound of food",
            correct: false,
            citation: "DnD_BasicRules_2018.pdf, p. 68",
          },
          {
            body: "Three pounds of food",
            correct: false,
            citation: "DnD_BasicRules_2018.pdf, p. 68",
          },
        ],
        post: "A character can survive on half rations (half a pound of food per day) but will count it as half a day without food, potentially leading to exhaustion over time.",
      },
    },
    {
      question: {
        title: "Common Status Effect: Poisoned",
        body: "What disadvantage does a creature suffer when it is poisoned?",
        answers: [
          {
            body: "Disadvantage on attack rolls and ability checks",
            correct: true,
            citation: "DnD_BasicRules_2018.pdf, p. 171",
          },
          {
            body: "Disadvantage on saving throws and attack rolls",
            correct: false,
            citation: "DnD_BasicRules_2018.pdf, p. 171",
          },
          {
            body: "Disadvantage on saving throws and ability checks",
            correct: false,
            citation: "DnD_BasicRules_2018.pdf, p. 171",
          },
          {
            body: "Disadvantage on ability checks and movement",
            correct: false,
            citation: "DnD_BasicRules_2018.pdf, p. 171",
          },
        ],
        post: "The poisoned condition can severely hamper a creature's effectiveness in combat and other activities by imposing disadvantage on attack rolls and ability checks.",
      },
    },
    {
      question: {
        title: "Definition of the Stealth Skill",
        body: "What is the primary use of the Stealth skill in D&D?",
        answers: [
          {
            body: "To conceal yourself from enemies, slink past guards, slip away without being noticed, or sneak up on someone without being seen or heard.",
            correct: true,
            citation: "DnD_BasicRules_2018.pdf, p. 62",
          },
          {
            body: "To perform acrobatic stunts, including dives, rolls, somersaults, and flips.",
            correct: false,
            citation: "DnD_BasicRules_2018.pdf, p. 62",
          },
          {
            body: "To calm down a domesticated animal, keep a mount from getting spooked, or intuit an animal's intentions.",
            correct: false,
            citation: "DnD_BasicRules_2018.pdf, p. 62",
          },
          {
            body: "To understand how to disable traps or determine the mechanisms behind them.",
            correct: false,
            citation: "DnD_BasicRules_2018.pdf, p. 62",
          },
        ],
        post: "The Stealth skill is crucial for rogues and other characters who need to avoid detection and move quietly in dangerous situations.",
      },
    },
    {
      question: {
        title: "Understanding Advantage",
        body: "What happens when you have advantage on an attack roll in D&D?",
        answers: [
          {
            body: "You roll a second d20 and use the higher roll.",
            correct: true,
            citation: "DnD_BasicRules_2018.pdf, p. 4",
          },
          {
            body: "You roll a second d20 and use the lower roll.",
            correct: false,
            citation: "DnD_BasicRules_2018.pdf, p. 4",
          },
          {
            body: "You automatically hit your target.",
            correct: false,
            citation: "DnD_BasicRules_2018.pdf, p. 4",
          },
          {
            body: "You add 5 to your attack roll.",
            correct: false,
            citation: "DnD_BasicRules_2018.pdf, p. 4",
          },
        ],
        post: "Advantage allows you to roll two d20s and take the higher result, increasing your chances of success on the roll.",
      },
    },
    {
      question: {
        title: "Critical Hits in D&D",
        body: "What happens when you score a critical hit on an attack roll?",
        answers: [
          {
            body: "You roll all of the attack's damage dice twice and add them together.",
            correct: true,
            citation: "DnD_BasicRules_2018.pdf, p. 76",
          },
          {
            body: "You automatically deal maximum damage for the attack.",
            correct: false,
            citation: "DnD_BasicRules_2018.pdf, p. 76",
          },
          {
            body: "You roll a second d20 to confirm the critical hit.",
            correct: false,
            citation: "DnD_BasicRules_2018.pdf, p. 76",
          },
          {
            body: "You add an extra damage die to the attack's damage.",
            correct: false,
            citation: "DnD_BasicRules_2018.pdf, p. 76",
          },
        ],
        post: "Critical hits allow for significant damage potential by doubling the damage dice rolled for the attack, making them a powerful aspect of combat.",
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
