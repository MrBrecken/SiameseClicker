// --- Game State ---
let gameState = {
    points: 0n, // Using BigInt for infinite numbers
    clickValue: 1n,
    rebirths: 0n,
    currentUpgradeLevel: 1
};

// --- Formatters ---
function formatBigInt(n) {
    if (n < 1000000n) return n.toString();
    const e = n.toString().length - 1;
    const m = n.toString().substring(0, 3) / 100;
    return `${m}e${e}`;
}

// --- DOM Elements ---
const pointsDisplay = document.getElementById('points');
const clickValueDisplay = document.getElementById('click-value');
const rebirthsDisplay = document.getElementById('rebirths');
const clickerImage = document.getElementById('clicker-image');
const upgradesDiv = document.getElementById('upgrades');
const rebirthBtn = document.getElementById('rebirth-btn');


// --- Rebirth Settings ---
const rebirthCostBase = 1000n;
const rebirthCostMultiplier = 10n;
const clickValuePerRebirth = 5n; // How much click value you get per rebirth level

// --- UI Functions ---
function updateUI() {
    pointsDisplay.innerText = formatBigInt(gameState.points);
    clickValueDisplay.innerText = formatBigInt(gameState.clickValue);
    rebirthsDisplay.innerText = gameState.rebirths.toString();
    rebirthBtn.innerText = `Rebirth (Cost: ${formatBigInt(rebirthCost())} Points)`;
    updateUpgradeButtons();
}

function updateUpgradeButtons() {
    // Check points and enable/disable upgrade and rebirth buttons
    const nextUpgradeCost = calculateUpgradeCost();
    rebirthBtn.disabled = gameState.points < rebirthCost();
}


// --- Game Logic Functions ---

function calculateClickValue() {
    return gameState.clickValue + (gameState.rebirths * clickValuePerRebirth);
}

// Procedural 'Infinite' Upgrade System
function generateNextUpgrade() {
    gameState.currentUpgradeLevel++;
    addUpgradeButton();
    updateUI();
}

function calculateUpgradeCost() {
    // Cost increases exponentially with each upgrade
    // 10^currentUpgradeLevel
    let base = 10n;
    for(let i=1; i < gameState.currentUpgradeLevel; i++){
        base *= 10n;
    }
    return base;
}

function applyUpgradeEffect() {
    // Effect doubles clickValue
    gameState.clickValue *= 2n;
    console.log("Upgrade bought! New click value:", gameState.clickValue);
}

function addUpgradeButton() {
    const cost = calculateUpgradeCost();
    const upgradeBtn = document.createElement('button');
    upgradeBtn.className = 'upgrade-button';
    upgradeBtn.innerText = `Upgrade Click (Lv ${gameState.currentUpgradeLevel}) - Cost: ${formatBigInt(cost)}`;

    upgradeBtn.addEventListener('click', () => {
        if (gameState.points >= cost) {
            gameState.points -= cost;
            applyUpgradeEffect();
            upgradesDiv.removeChild(upgradeBtn); // Only buy one upgrade at a time in this simple example
            generateNextUpgrade(); // Generate the next, more expensive upgrade
        } else {
            alert('Not enough points!');
        }
    });

    upgradesDiv.insertBefore(upgradeBtn, rebirthBtn);
}


// Rebirth Logic
function rebirthCost() {
    let cost = rebirthCostBase;
    for(let i=0; i< gameState.rebirths; i++) {
        cost *= rebirthCostMultiplier;
    }
    return cost;
}

function performRebirth() {
    const cost = rebirthCost();
    if (gameState.points >= cost) {
        // Confirm from user (optional but good UI)
        if(confirm(`Are you sure you want to rebirth? Cost: ${formatBigInt(cost)} Points. Your points and upgrades will reset!`)){
            gameState.points = 0n;
            gameState.clickValue = 1n; // Optional: Reset click value
            gameState.rebirths++;
            // Reset upgrades in simple procedural generation
            gameState.currentUpgradeLevel = 1;
            // Clear current upgrade buttons and add the first one
            const currentUpgradeButtons = upgradesDiv.querySelectorAll('.upgrade-button');
            currentUpgradeButtons.forEach(btn => btn.remove());
            addUpgradeButton();
            updateUI();
            console.log("Rebirthed! New level:", gameState.rebirths);
        }

    } else {
        alert("You need more points to rebirth!");
    }
}


// --- Event Listeners ---

clickerImage.addEventListener('click', () => {
    const value = calculateClickValue();
    gameState.points += value;
    console.log("Clicked! Current points:", gameState.points);

    // Simple visual animation on click
    clickerImage.style.transform = "scale(1.1)";
    setTimeout(() => {
        clickerImage.style.transform = "scale(1.0)";
    }, 100);

    updateUI();
});

rebirthBtn.addEventListener('click', performRebirth);


// --- Initialize ---
updateUI();
addUpgradeButton(); // Start with the first upgrade button visible
