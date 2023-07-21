// Game movement logic
var alreadyPlaying = false;
var rocks = [];
var papers = [];
var scissors = [];
var moveInterval;
var animationSpeed;
var paperImg;
var scissorsImg;
var rockImg;
document.addEventListener('DOMContentLoaded', function(){
    animationSpeed = parseInt(document.getElementById('speedSlider').value);
    paperImg = document.getElementById("paper");
    scissorsImg = document.getElementById("scissors");
    rockImg = document.getElementById("rock");
})



// global canvas and context variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


// Represents an image drawn on the canvas
class ImageObject{
    constructor(image, type){
        this.image = image;
        this.type = type;
        this.x = 0;
        this.y = 0;
        this.width = image.width;
        this.height = image.height;
    }

    draw(ctx, x, y, width, height){
        ctx.drawImage(this.image, x, y, width, height);
    }

    collidesWith(otherImageObject) {
        return (
            this.x < otherImageObject.x + otherImageObject.width &&
            this.x + this.width > otherImageObject.x &&
            this.y < otherImageObject.y + otherImageObject.height &&
            this.y + this.height > otherImageObject.y
        );
    }
}


// JavaScript function to toggle the active state of the image placeholders
function toggleActive(element) {
    const imagePlaceholders = document.querySelectorAll('.image-placeholder');

    // Deactivate all image placeholders
    imagePlaceholders.forEach((placeholder) => {
        placeholder.classList.remove('active');
    });

    // Activate the clicked image placeholder
    element.classList.add('active');
}


// JavaScript function to place the active image on the canvas
function placeImageOnCanvas(event) {
    const activeImage = document.querySelector('.image-placeholder.active img');

    if (activeImage) {
        const canvasRect = canvas.getBoundingClientRect();
        const canvasX = canvasRect.left;
        const canvasY = canvasRect.top;

        // Get the dimensions of the active image
        const imageWidth = activeImage.width;
        const imageHeight = activeImage.height;

        // Calculate the position to place the image on the canvas from its center
        const x = event.clientX - canvasX - imageWidth / 2;
        const y = event.clientY - canvasY - imageHeight / 2;

        // Create the image object and store its location.
        const newImageObject = new ImageObject(activeImage, activeImage.alt);
        newImageObject.x = x;
        newImageObject.y = y;

        // Store each of the image objects in seperate lists to stay organized in the movement function.
        switch(newImageObject.type){
            case "rock":
                rocks.push(newImageObject);
                break;
            case "paper":                
                papers.push(newImageObject);
                break;
            case "scissors":                
                scissors.push(newImageObject);
                break;
        }        
        newImageObject.draw(ctx, x, y, newImageObject.image.width, newImageObject.image.height);
    }
}
// Add event listener to the canvas
canvas.addEventListener('click', placeImageOnCanvas);


// Clear all the placed images
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rocks = [];
    papers = [];
    scissors = [];
}


// JavaScript function to handle the movement of "moving" images towards the closest "target" image
function moveTowardsTarget(movingImages, targetImages) {
    movingImages.forEach((movingImage) => {
        const movingX = parseFloat(movingImage.x);
        const movingY = parseFloat(movingImage.y);
        // console.log("x: "+ movingX + ", y: " + movingY)

        let nearestDistance = Infinity;
        let nearestTargetX, nearestTargetY;

        targetImages.forEach((targetImage) => {
            const targetX = parseFloat(targetImage.x);
            const targetY = parseFloat(targetImage.y);

            // Calculate the distance between the "moving" and "target" images
            const dx = targetX - movingX;
            const dy = targetY - movingY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            // console.log("distance: " + distance)

            // Check if this "target" image is closer than the current nearest one
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestTargetX = targetX;
                nearestTargetY = targetY;
            }

            // Collision check - change based on rules of rock paper scissors
            if (movingImage.collidesWith(targetImage)) {                
                // console.log(movingImage.type + " collided with " + targetImage.type)
                // Change the target properties to that of the chasing one if they collide
                switch(targetImage.type){
                    case "rock":
                        rockIndex = rocks.indexOf(targetImage);
                        rocks.splice(rockIndex, 1);
                        papers.push(targetImage);
                        break;
                    case "paper":
                        paperIndex = papers.indexOf(targetImage);
                        papers.splice(paperIndex, 1);
                        scissors.push(targetImage);
                        break;
                    case "scissors":
                        scissorsIndex = scissors.indexOf(targetImage);
                        scissors.splice(scissorsIndex, 1);
                        rocks.push(targetImage);
                        break;
                }
                targetImage.type = movingImage.type;
                targetImage.image = movingImage.image;
            }
        });

        // Calculate the direction vector (dx, dy) from "moving" to the nearest "target"
        const dx = nearestTargetX - movingX;
        const dy = nearestTargetY - movingY;

        // Normalize the direction vector
        const distance = Math.sqrt(dx * dx + dy * dy);
        const normDx = dx / distance;
        const normDy = dy / distance;

        // Update the position of the "moving" image towards the nearest "target" image
        const speed = 1; // Adjust the speed as needed
        // Only update the position if there is a valid target to move to, 
        // keeps images from disappearing when there are no targets
        if (targetImages.length > 0){
            movingImage.x = movingX + speed * normDx;
            movingImage.y = movingY + speed * normDy;
        }
    });
}


// JavaScript function to draw the imageObjects on the canvas
function drawImageObjects() {

    // Clear the canvas before redrawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each imageObject on the canvas
    rocks.forEach((rock) => {
        ctx.drawImage(rock.image, rock.x, rock.y, rock.image.width, rock.image.height);
    });
    papers.forEach((paper) => {
        ctx.drawImage(paper.image, paper.x, paper.y, paper.image.width, paper.image.height);
    });
    scissors.forEach((scissor) => {
        ctx.drawImage(scissor.image, scissor.x, scissor.y, scissor.image.width, scissor.image.height);
    });
}

// Function to stop the game update
function stopGameUpdate() {
    clearInterval(moveInterval);
    alreadyPlaying = false;
}

function displayWinMessage(text) {
    const canvasRect = canvas.getBoundingClientRect();
    const canvasX = canvasRect.left;
    const canvasY = canvasRect.top;

    const message = text;
    ctx.font = "30px Arial";
    ctx.fillStyle = "black"; // Customize the color as needed
    ctx.strokeStyle = "white"; // Set the outline color to white
    ctx.lineWidth = 2; // Set the outline width
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const textX = canvas.width / 2;
    const textY = canvas.height / 2;

    // Draw the white outline
    ctx.strokeText(message, textX, textY);

    // Draw the black text on top of the outline
    ctx.fillText(message, textX, textY);
}

function moveImages() {
    moveTowardsTarget(rocks, scissors);
    moveTowardsTarget(scissors, papers);
    moveTowardsTarget(papers, rocks);
    drawImageObjects();

    // Check if scissors have won
    if (papers.length === 0 && rocks.length === 0 && scissors.length === 0){
        stopGameUpdate();
        displayWinMessage("Add some images from the right and press play!")
    } else if (papers.length === 0 && rocks.length === 0) {
        stopGameUpdate(); // Stop the animation
        displayWinMessage("Scissors Wins!")
    } else if (papers.length === 0 && scissors.length === 0) {
        stopGameUpdate(); // Stop the animation
        displayWinMessage("Rock Wins!")
    } else if (scissors.length === 0 && rocks.length === 0) {
        stopGameUpdate(); // Stop the animation
        displayWinMessage("Paper Wins!")
    }
}

// JavaScript function to start or stop the play movement
function play() {
    // Start the movement animation
    if (!alreadyPlaying) {
        moveInterval = setInterval(moveImages, 10 - animationSpeed);
        alreadyPlaying = true;
    }
}

// Add event listener to the slider for input changes
const speedSlider = document.getElementById('speedSlider');

// Function to handle slider input changes
speedSlider.oninput = function() {
    // Get the slider element and its label
    const sliderValueLabel = document.getElementById('sliderValueLabel');

    // Update the label text with the current slider value
    sliderValueLabel.textContent = speedSlider.value;
    animationSpeed = parseInt(speedSlider.value);
    if (alreadyPlaying){
        clearInterval(moveInterval);
        moveInterval = setInterval(moveImages, 10 - animationSpeed);
    }
}

// Dynamically adjust the canvas size based on the user's screen width and height
canvas.width = window.innerWidth * 0.6;
canvas.height = window.innerHeight * 0.8;