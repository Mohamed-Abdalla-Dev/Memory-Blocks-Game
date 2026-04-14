// Array Imgages
let imageSets = [
  { name: "flower", image: "./images/imag-1.jpg" },
  { name: "man", image: "./images/imag-2.jpg" },
  { name: "cat", image: "./images/imag-3.jpg" },
  { name: "ramdan", image: "./images/imag-4.jpg" },
  { name: "rabbit", image: "./images/imag-5.jpg" },
  { name: "target", image: "./images/imag-6.jpg" },
  { name: "apple", image: "./images/imag-7.jpg" },
  { name: "flowers", image: "./images/imag-8.jpg" },
  { name: "yellow", image: "./images/imag-9.jpg" },
  { name: "loon", image: "./images/imag-10.jpg" },
];

// Variables General
let wrongTries = 0;
let openBlocks = [];
let blocksContainer;
let nameSpan;
let triesSpan;

// Welcome Function
function Hello() {
  let savedName = localStorage.getItem("name");

  if (!savedName) {
    savedName = prompt("Please Enter Your Name:");

    localStorage.setItem("name", savedName);
  } else {
    alert(`Welcome Back ${savedName}`);
  }

  nameSpan = document.querySelector(".name span");
  nameSpan.textContent = savedName;
}

// Random Mixing Function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Cards Creat Function
function createGameBlocks() {
  blocksContainer = document.querySelector(".memory-game-blocks");
  triesSpan = document.querySelector(".tries span");

  // Creating Couples
  let allBlocks = [];
  imageSets.forEach((set) => {
    allBlocks.push({ name: set.name, image: set.image }); // The First Husband
    allBlocks.push({ name: set.name, image: set.image }); // The Second Husband
  });

  // Mixing Cards
  allBlocks = shuffleArray(allBlocks);

  // Creat Html
  let blocksHTML = "";
  allBlocks.forEach((block) => {
    blocksHTML += `
            <div class="game-block" data-life="${block.name}">
                <div class="face front"></div>
                <div class="face back">
                    <img src="${block.image}" alt="${block.name}" />
                </div>
            </div>
        `;
  });

  // Add Cards From The Page
  blocksContainer.innerHTML = blocksHTML;
}

// Match Verification Function
function checkMatch(block1, block2) {
  if (block1.dataset.life === block2.dataset.life) {
    // Status Matchups
    block1.classList.add("matched");
    block2.classList.add("matched");
    openBlocks = [];
    document.getElementById("good").play();

    // Check The Win-Win
    let matchedBlocks = document.querySelectorAll(".matched");
    let totalBlocks = document.querySelectorAll(".game-block").length;

    if (matchedBlocks.length === totalBlocks) {
      setTimeout(() => alert("You Won!🎉"), 300);
      document.getElementById("won").play();
      initGame();
    }

    return true;
  } else {
    return false;
  }
}

// Re-heart Function (Case Of Mismatch)
function flipBack(block1, block2) {
  wrongTries++;
  triesSpan.textContent = wrongTries;
  document.getElementById("bad").play();

  setTimeout(() => {
    block1.classList.remove("flipped");
    block2.classList.remove("flipped");
    openBlocks = [];

    // Allow Clicking Again
    document.querySelectorAll(".game-block").forEach((block) => {
      block.classList.remove("no-click");
    });
  }, 1000);
}

// Game Setting Functon (Connect Events)
function setupGame() {
  let blocks = document.querySelectorAll(".game-block");

  blocks.forEach((block) => {
    block.addEventListener("click", function () {
      // Prevent Clicking In Certin Cases
      if (
        this.classList.contains("flipped") ||
        this.classList.contains("matched") ||
        this.classList.contains("no-click")
      ) {
        return;
      }

      // Heart Cards
      this.classList.add("flipped");
      openBlocks.push(this);

      // If Tow Pairs Are Completed
      if (openBlocks.length === 2) {
        // Prevent Clicking On Any Other Card
        document.querySelectorAll(".game-block").forEach((block) => {
          block.classList.add("no-click");
        });

        let block1 = openBlocks[0];
        let block2 = openBlocks[1];

        // Checking The Match
        let isMatch = checkMatch(block1, block2);

        if (!isMatch) {
          flipBack(block1, block2);
        } else {
          // If They Match, We Allow Clicking Again
          document.querySelectorAll(".game-block").forEach((block) => {
            if (!block.classList.contains("matched")) {
              block.classList.remove("no-click");
            }
          });
        }
      }
    });
  });
}

// Start Game Function
function initGame() {
  createGameBlocks(); // Creat Cards
  setupGame(); // Action Events
  Hello(); // Welcome
  wrongTries = 0; // Zero attempts
  triesSpan.textContent = "0"; // Counter Event
}

// Running Game When Loading The Page
window.onload = initGame;
