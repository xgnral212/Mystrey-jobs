document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation Logic ---
    const pageSections = document.querySelectorAll('.page-section');
    const navButtons = document.querySelectorAll('.nav-btn');
    const showJobDetailsButtons = document.querySelectorAll('.show-job-details');

    function showSection(targetId) {
        pageSections.forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(targetId).classList.add('active');

        // If navigating to inventory, update it
        if (targetId === 'inventory') {
            updateInventoryDisplay();
        }
    }

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            showSection(button.dataset.target);
        });
    });

    showJobDetailsButtons.forEach(button => {
        button.addEventListener('click', () => {
            showSection(button.dataset.target);
        });
    });

    // --- Global Job Management (using localStorage for client-side demo) ---
    let currentJob = localStorage.getItem('currentJob');
    // Initialize inventory from localStorage or as an empty object
    let inventory = JSON.parse(localStorage.getItem('inventory')) || {};

    function setCurrentJob(jobName) {
        currentJob = jobName;
        localStorage.setItem('currentJob', jobName);
        updateJobUI();
    }

    function clearCurrentJob() {
        currentJob = null;
        localStorage.removeItem('currentJob');
        updateJobUI();
        alert('You have left your job.');
        showSection('home'); // Go back to home page after leaving job
    }

    function addResourceToInventory(resource, amount) {
        if (inventory[resource]) {
            inventory[resource] += amount;
        } else {
            inventory[resource] = amount;
        }
        localStorage.setItem('inventory', JSON.stringify(inventory));
        // No immediate UI update needed here, as it's updated when INV section is visited.
    }

    function updateJobUI() {
        const takeMinerJobBtn = document.getElementById('takeMinerJobBtn');
        const leaveMinerJobBtn = document.getElementById('leaveMinerJobBtn');
        const miningArea = document.getElementById('miningArea');

        const takeRecyclerJobBtn = document.getElementById('takeRecyclerJobBtn');
        const leaveRecyclerJobBtn = document.getElementById('leaveRecyclerJobBtn');
        const recyclingArea = document.getElementById('recyclingArea');
        const recyclerJobStatus = document.getElementById('recyclerJobStatus');

        // Miner UI Update
        if (currentJob === 'Miner') {
            if (takeMinerJobBtn) takeMinerJobBtn.style.display = 'none';
            if (leaveMinerJobBtn) leaveMinerJobBtn.style.display = 'inline-block';
            if (miningArea) miningArea.style.display = 'block';
        } else {
            if (takeMinerJobBtn) takeMinerJobBtn.style.display = 'inline-block';
            if (leaveMinerJobBtn) leaveMinerJobBtn.style.display = 'none';
            if (miningArea) miningArea.style.display = 'none';
        }

        // Recycler UI Update
        if (currentJob === 'Recycler') {
            if (takeRecyclerJobBtn) takeRecyclerJobBtn.style.display = 'none';
            if (leaveRecyclerJobBtn) leaveRecyclerJobBtn.style.display = 'inline-block';
            if (recyclingArea) recyclingArea.style.display = 'block';
            recyclerJobStatus.textContent = ''; // Clear status if it's the current job
        } else {
            if (takeRecyclerJobBtn) takeRecyclerJobBtn.style.display = 'inline-block';
            if (leaveRecyclerJobBtn) leaveRecyclerJobBtn.style.display = 'none';
            if (recyclingArea) recyclingArea.style.display = 'none';
            if (currentJob) { // If there's another job active
                 recyclerJobStatus.textContent = `You are currently assigned to: ${currentJob}. Please leave that job before taking another.`;
            } else {
                recyclerJobStatus.textContent = ''; // No job selected
            }
        }

        // Disable "Take Job" buttons if another job is active
        if (takeMinerJobBtn) takeMinerJobBtn.disabled = (currentJob && currentJob !== 'Miner');
        if (takeRecyclerJobBtn) takeRecyclerJobBtn.disabled = (currentJob && currentJob !== 'Recycler');
    }


    // --- Miner Job Logic ---
    const minerResources = ['Steel', 'Aluminum', 'Iron', 'Scrap', 'Coal', 'Resin'];

    const takeMinerJobBtn = document.getElementById('takeMinerJobBtn');
    if (takeMinerJobBtn) {
        takeMinerJobBtn.addEventListener('click', () => {
            if (!currentJob || currentJob === 'Miner') {
                setCurrentJob('Miner');
                alert('You have taken the job: The Miner!');
                document.getElementById('minerResourceResult').textContent = ''; // Clear previous results
            }
        });
    }

    const leaveMinerJobBtn = document.getElementById('leaveMinerJobBtn');
    if (leaveMinerJobBtn) {
        leaveMinerJobBtn.addEventListener('click', () => {
            if (currentJob === 'Miner') {
                clearCurrentJob();
            }
        });
    }

    const breakRockBtn = document.getElementById('breakRockBtn');
    const rockImage = document.getElementById('rockImage');
    const minerResourceResult = document.getElementById('minerResourceResult');

    if (breakRockBtn) {
        breakRockBtn.addEventListener('click', () => {
            rockImage.style.display = 'none';
            breakRockBtn.disabled = true;

            const randomResource = minerResources[Math.floor(Math.random() * minerResources.length)];
            const randomAmount = Math.floor(Math.random() * 5) + 1;

            addResourceToInventory(randomResource, randomAmount); // Add to inventory
            minerResourceResult.textContent = `You obtained ${randomAmount} ${randomResource}!`;

            setTimeout(() => {
                rockImage.src = 'https://via.placeholder.com/150/555555/FFFFFF?text=Rock';
                rockImage.style.display = 'block';
                breakRockBtn.disabled = false;
                minerResourceResult.textContent = '';
            }, 2000);
        });
    }

    // --- Recycler Job Logic ---
    const recyclerResources = ['Plastic', 'Paper'];
    let timer;
    let currentPuzzleType = '';

    const takeRecyclerJobBtn = document.getElementById('takeRecyclerJobBtn');
    if (takeRecyclerJobBtn) {
        takeRecyclerJobBtn.addEventListener('click', () => {
            if (!currentJob || currentJob === 'Recycler') {
                setCurrentJob('Recycler');
                alert('You have taken the job: The Recycler!');
                document.getElementById('recyclerResourceResult').textContent = ''; // Clear previous results
            }
        });
    }

    const leaveRecyclerJobBtn = document.getElementById('leaveRecyclerJobBtn');
    if (leaveRecyclerJobBtn) {
        leaveRecyclerJobBtn.addEventListener('click', () => {
            if (currentJob === 'Recycler') {
                clearCurrentJob();
                // Clear any active puzzle if leaving job
                puzzleContainer.innerHTML = '';
                if (timer) clearInterval(timer);
                const startRecyclingBtn = document.getElementById('startRecyclingBtn');
                if (startRecyclingBtn) startRecyclingBtn.style.display = 'block';
            }
        });
    }

    const startRecyclingBtn = document.getElementById('startRecyclingBtn');
    const puzzleContainer = document.getElementById('puzzleContainer');
    const recyclerResourceResult = document.getElementById('recyclerResourceResult');

    if (startRecyclingBtn) {
        startRecyclingBtn.addEventListener('click', () => {
            startRecyclingBtn.style.display = 'none';
            recyclerResourceResult.textContent = '';

            const puzzleTypes = ['colorMatch', 'typing'];
            currentPuzzleType = puzzleTypes[Math.floor(Math.random() * puzzleTypes.length)];

            if (currentPuzzleType === 'colorMatch') {
                generateColorMatchPuzzle();
            } else if (currentPuzzleType === 'typing') {
                generateTypingPuzzle();
            }
        });
    }

    const generateColorMatchPuzzle = () => {
        puzzleContainer.innerHTML = `
            <h3>Color Matching Puzzle</h3>
            <p>Match the colors on the top row to the colors on the bottom row by dragging the bottom boxes.</p>
            <div class="color-match-puzzle-container">
                <div class="color-row" id="topColors"></div>
                <div class="color-row" id="bottomColors"></div>
            </div>
            <button id="checkColorMatchBtn" class="btn">Check Match</button>
            <p id="colorMatchFeedback"></p>
        `;

        const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange'];
        let shuffledTopColors = [...colors].sort(() => Math.random() - 0.5);
        let topRow = shuffledTopColors.slice(0, 4);
        let bottomRowData = [...topRow].sort(() => Math.random() - 0.5); // Data for initial bottom row

        const topColorsDiv = document.getElementById('topColors');
        const bottomColorsDiv = document.getElementById('bottomColors');

        topColorsDiv.innerHTML = topRow.map(color => `<div class="color-box" style="background-color: ${color.toLowerCase()};" data-color="${color}">${color}</div>`).join('');
        bottomColorsDiv.innerHTML = bottomRowData.map(color => `<div class="color-box draggable" style="background-color: ${color.toLowerCase()};" data-color="${color}" draggable="true">${color}</div>`).join('');

        let draggedItem = null;

        document.querySelectorAll('.draggable').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                draggedItem = e.target;
                e.dataTransfer.effectAllowed = 'move';
            });

            item.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            item.addEventListener('drop', (e) => {
                e.preventDefault();
                if (e.target.classList.contains('draggable') && draggedItem !== e.target) {
                    const tempBg = draggedItem.style.backgroundColor;
                    const tempColor = draggedItem.dataset.color;
                    const tempText = draggedItem.textContent;

                    draggedItem.style.backgroundColor = e.target.style.backgroundColor;
                    draggedItem.dataset.color = e.target.dataset.color;
                    draggedItem.textContent = e.target.textContent;

                    e.target.style.backgroundColor = tempBg;
                    e.target.dataset.color = tempColor;
                    e.target.textContent = tempText;
                }
            });
        });

        document.getElementById('checkColorMatchBtn').addEventListener('click', () => {
            const userOrder = Array.from(bottomColorsDiv.children).map(box => box.dataset.color);
            const isCorrect = topRow.every((color, index) => color === userOrder[index]);

            if (isCorrect) {
                document.getElementById('colorMatchFeedback').textContent = 'Perfect match! Puzzle Solved!';
                rewardPlayer();
            } else {
                document.getElementById('colorMatchFeedback').textContent = 'Not quite right. Keep trying!';
            }
        });
    };

    const generateTypingPuzzle = () => {
        const phrases = [
            "The quick brown fox jumps over the lazy dog.",
            "Never underestimate the power of a good book.",
            "Programming is thinking, not typing.",
            "Recycling is vital for our planet's future.",
            "Innovation distinguishes between a leader and a follower."
        ];
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        const timeLimit = 10;

        puzzleContainer.innerHTML = `
            <h3>Typing Challenge</h3>
            <p>Type the following phrase within <span id="timer">${timeLimit}</span> seconds:</p>
            <div id="typingChallenge">${randomPhrase}</div>
            <input type="text" id="typingInput" placeholder="Start typing here...">
            <p id="typingFeedback"></p>
        `;

        const typingInput = document.getElementById('typingInput');
        const timerDisplay = document.getElementById('timer');
        const typingFeedback = document.getElementById('typingFeedback');
        let timeLeft = timeLimit;

        typingInput.value = '';

        clearInterval(timer);
        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                typingInput.disabled = true;
                typingFeedback.textContent = 'Time\'s up! You failed to type in time.';
                setTimeout(() => {
                    puzzleContainer.innerHTML = '';
                    startRecyclingBtn.style.display = 'block';
                }, 2000);
            }
        }, 1000);

        typingInput.addEventListener('input', () => {
            if (typingInput.value === randomPhrase) {
                clearInterval(timer);
                typingInput.disabled = true;
                typingFeedback.textContent = 'Excellent! You typed it correctly!';
                rewardPlayer();
            } else if (randomPhrase.startsWith(typingInput.value)) {
                typingInput.style.backgroundColor = '#2ecc7133';
            } else {
                typingInput.style.backgroundColor = '#e74c3c33';
            }
        });
    };

    const rewardPlayer = () => {
        clearInterval(timer);
        const randomResource = recyclerResources[Math.floor(Math.random() * recyclerResources.length)];
        const randomAmount = Math.floor(Math.random() * 5) + 1;
        addResourceToInventory(randomResource, randomAmount); // Add to inventory
        recyclerResourceResult.textContent = `You recycled and obtained ${randomAmount} ${randomResource}!`;
        puzzleContainer.innerHTML = '';
        startRecyclingBtn.style.display = 'block';
    };

    // --- Inventory Logic ---
    const inventoryDisplay = document.getElementById('inventoryDisplay');
    const emptyInventoryMessage = document.getElementById('emptyInventoryMessage');

    function updateInventoryDisplay() {
        inventoryDisplay.innerHTML = ''; // Clear current display
        let isEmpty = true;

        for (const resource in inventory) {
            if (inventory[resource] > 0) {
                isEmpty = false;
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('inventory-item');
                itemDiv.innerHTML = `
                    <h4>${resource}</h4>
                    <p>Amount: ${inventory[resource]}</p>
                `;
                inventoryDisplay.appendChild(itemDiv);
            }
        }

        if (isEmpty) {
            inventoryDisplay.appendChild(emptyInventoryMessage); // Show empty message
            emptyInventoryMessage.style.display = 'block';
        } else {
            emptyInventoryMessage.style.display = 'none';
        }
    }


    // Initial setup when page loads
    updateJobUI(); // Ensure correct job UI state
    // If a job was already taken (from a previous session or refresh), show relevant area
    if (currentJob === 'Miner') {
        showSection('miner-job');
    } else if (currentJob === 'Recycler') {
        showSection('recycler-job');
    } else {
        showSection('home'); // Default to home if no job active
    }
});
