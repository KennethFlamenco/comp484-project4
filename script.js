let correctCount = 0;
let incorrectCount = 0;
let currentQuestionIndex = 0;
let timer = 0;
let timerInterval = null;
let gameIsActive = true;
let rectangles = [];
let map;

// list of locations
const locations = [
    {
        name: "Bayramian Hall",
        question: "Where is Bayramian Hall?",
        bounds: {
            north: 34.2408,
            south: 34.2399,
            east: -118.5302,
            west: -118.5314
        }
    },
    {
        name: "Extended University Commons",
        question: "Where is the Extended University Commons?",
        bounds: {
            north: 34.2409,
            south: 34.2405,
            east: -118.5323,
            west: -118.5336
        }
    },
    {
        name: "Arts and Design Center", // <----- MY LOCATION
        question: "Where is the Arts and Design Center?",
        bounds: {
            north: 34.2441,
            south: 34.2431,
            east: -118.5295,
            west: -118.5304
        }
    },
    {
        name: "Jacaranda Hall",
        question: "Where is Jacaranda Hall?",
        bounds: {
            north: 34.2422,
            south: 34.2409,
            east: -118.5275,
            west: -118.5297
        }
    },
    {
        name: "CSUN Library",
        question: "Where is the CSUN Library?",
        bounds: {
            north: 34.2406,
            south: 34.2395,
            east: -118.5285,
            west: -118.5300
        }
    },

];

async function initMap() {
    // Import required libraries
    const { Map } = await google.maps.importLibrary("maps");



    // Create the map
    map = new Map(document.getElementById("map"), {
        zoom: 17,
        center: { lat: 34.24209845128490, lng: -118.52998192189657 }, //34.23920845128471 -118.52966190089657
        mapTypeId: "roadmap",
        draggable: false,
        zoomControl: false,
        disableDoubleClickZoom: true,
        keyboardShortcuts: false,
        disableDefaultUI: true,
        gestureHandling: "none",
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ]

    });

    map.addListener("dblclick", mapDoubleClick);

    // zoom updates
    map.addListener("zoom_changed", () => {
        console.log("Zoom:", map.getZoom());
    });

    // center updates
    map.addListener("center_changed", () => {
        const c = map.getCenter();
        console.log("Center:", c.lat(), c.lng());
    });


    console.log("Initial zoom:", map.getZoom());
    console.log(
        "Initial center:",
        map.getCenter().lat(),
        map.getCenter().lng()
    );
}


function drawRectangle(bounds, isCorrect) {
    const rectangle = new google.maps.Rectangle({
        strokeColor: isCorrect ? '#00ff0dff' : '#ff1100ff',
        strokeWeight: 3,
        fillColor: isCorrect ? '#00ff08ff' : '#ff1100ff',
        fillOpacity: 0.3,
        map: map,
        bounds: {
            north: bounds.north,
            south: bounds.south,
            east: bounds.east,
            west: bounds.west
        }
    });

    rectangles.push(rectangle);
}

function mapDoubleClick(event) {
    if (!gameIsActive) return;

    const clickLat = event.latLng.lat();
    const clickLng = event.latLng.lng();
    const currentLocation = locations[currentQuestionIndex];

    const isCorrect = isWithinBounds(clickLat, clickLng, currentLocation.bounds);

    drawRectangle(currentLocation.bounds, isCorrect);
    updateQuestionResult(currentQuestionIndex, isCorrect);

    if (isCorrect) {
        correctCount++;
    } else {
        incorrectCount++;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < locations.length) {
        showQuestion(currentQuestionIndex);
    } else {
        gameIsActive = false;
        showGameOver();
    }
    showFeedback(isCorrect, currentLocation.name);
}

//check if the double click is in the rectangle
function isWithinBounds(lat, lng, bounds) {
    return lat <= bounds.north &&
        lat >= bounds.south &&
        lng <= bounds.east &&
        lng >= bounds.west;
}

function updateQuestionResult(index, isCorrect) {

    console.log(`Question ${index + 1} result: ${isCorrect ? "Correct" : "Incorrect"}`);
}

//question block in panel
function showQuestion(index) {
    const questionData = locations[index];
    const questions = document.getElementById("questions");
    const block = document.createElement("div");
    block.className = "question-block";
    block.innerHTML = `
        <h1>Question ${index + 1}</h1>
        <p>${questionData.question}</p>
    `;

    const feedbackBubble = document.createElement("div");
    feedbackBubble.id = `feedback-${index}`;
    feedbackBubble.className = "feedback-bubble hidden"

    questions.appendChild(block);
    questions.appendChild(feedbackBubble);
}

// feedback bubble under question
function showFeedback(isCorrect, name) {
    const feedback = document.getElementById(`feedback-${currentQuestionIndex - 1}`);
    feedback.classList.remove("hidden");
    if (feedback) {
        feedback.textContent = isCorrect
            ? `Your answer is correct!`
            : `Nope! Incorrect!`;
    }
}

function showGameOver() {
    clearInterval(timerInterval);
    const popUp = document.getElementById("gameOverPopUp");
    const resultText = document.getElementById("resultText");
    resultText.textContent = `You got ${correctCount} out of ${locations.length} correct in ${timer} seconds.`;
    popUp.classList.remove("hidden");
}

function restartGame() {
    // Reset values
    currentQuestionIndex = 0;
    correctCount = 0;
    incorrectCount = 0;
    gameIsActive = true;
    clearInterval(timerInterval);
    timer = 0;
    document.getElementById("timerDisplay").textContent = `Time: ${timer}s`;

    timerInterval = setInterval(() => {
        timer++;
        document.getElementById("timerDisplay").textContent = `Time: ${timer}s`;
    }, 1000);

    // Clear rectangles
    rectangles.forEach(r => r.setMap(null));
    rectangles = [];

    // Resets questions
    document.getElementById("questions").innerHTML = "";

    //hides pop up
    document.getElementById("gameOverPopUp").classList.add("hidden");

    // Show first question again
    showQuestion(currentQuestionIndex);

}

window.addEventListener("DOMContentLoaded", () => {
    const restartButton = document.getElementById("restartButton");
    if (restartButton) {
        restartButton.addEventListener("click", restartGame);
    }
});

window.addEventListener("load", () => {
    initMap().then(() => {
        restartGame();
    }).catch(console.error);
});



