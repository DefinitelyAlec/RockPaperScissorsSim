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

// Dynamically adjust the canvas size based on the user's screen width and height
canvas.width = window.innerWidth * 0.6;
canvas.height = window.innerHeight * 0.8;

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
        let x = event.clientX - canvasX - imageWidth / 2;
        let y = event.clientY - canvasY - imageHeight / 2;
        console.log("x: " + x + ", y: " + y);

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
function moveTowardsTarget(movingImages, targetImages, avoidImages) {
    movingImages.forEach((movingImage) => {
        const movingX = parseFloat(movingImage.x);
        const movingY = parseFloat(movingImage.y);
        // console.log("x: "+ movingX + ", y: " + movingY)

        let nearestDistanceTarget = Infinity;
        let nearestTargetX, nearestTargetY;

        let nearestDistanceAvoid = Infinity;
        let nearestAvoidX, nearestAvoidY;

        targetImages.forEach((targetImage) => {
            const targetX = parseFloat(targetImage.x);
            const targetY = parseFloat(targetImage.y);

            // Calculate the distance between the "moving" and "target" images
            const dxTarget = targetX - movingX;
            const dyTarget = targetY - movingY;
            const distanceTarget = Math.sqrt(dxTarget * dxTarget + dyTarget * dyTarget);
            // console.log("distance: " + distance)

            // Check if this "target" image is closer than the current nearest one
            if (distanceTarget < nearestDistanceTarget) {
                nearestDistanceTarget = distanceTarget;
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

        avoidImages.forEach((avoidImage) => {
            const avoidX = parseFloat(avoidImage.x);
            const avoidY = parseFloat(avoidImage.y);

            // Calculate the distance between the "moving" and "target" images
            const dxAvoid = avoidX - movingX;
            const dyAvoid = avoidY - movingY;
            const distanceAvoid = Math.sqrt(dxAvoid * dxAvoid + dyAvoid * dyAvoid);
            // console.log("distance: " + distance)

            // Check if this "target" image is closer than the current nearest one
            if (distanceAvoid < nearestDistanceAvoid) {
                nearestDistanceAvoid = distanceAvoid;
                nearestAvoidX = avoidX;
                nearestAvoidY = avoidY;
            }
        })

        // Calculate the direction vector (dx, dy) from "moving" to the nearest "target"
        const dxTarget = nearestTargetX - movingX;
        const dyTarget = nearestTargetY - movingY;

        // Calculate the direction vector (dx, dy) from "moving" to the nearest "avoid"
        // Invert the calculation since we want to move away from this image
        const dxAvoid = -(nearestAvoidX - movingX);
        const dyAvoid = -(nearestAvoidY - movingY);

        // Normalize the direction vector for the "target"
        const distanceTarget = Math.sqrt(dxTarget * dxTarget + dyTarget * dyTarget);
        var normDxTarget = dxTarget / distanceTarget;
        var normDyTarget = dyTarget/ distanceTarget;

        // Normalize the direction vector for the "avoid"
        const distanceAvoid = Math.sqrt(dxAvoid * dxAvoid + dyAvoid * dyAvoid);
        var normDxAvoid = dxAvoid / distanceAvoid;
        var normDyAvoid = dyAvoid/ distanceAvoid;

        const speed = 0.5; // Adjust the speed as needed

        // Update the position of the "moving" image towards the nearest "target" image
        // Only update the position if there is a valid target to move to, 
        // keeps images from disappearing when there are no targets
        if (targetImages.length > 0){
            if (avoidImages.length > 0 && avoidFlag) {
                movingImage.x = (movingX + speed * (normDxTarget + 0.5*normDxAvoid));
                movingImage.y = (movingY + speed * (normDyTarget + 0.5*normDyAvoid));
            } else {
                movingImage.x = (movingX + speed * normDxTarget);
                movingImage.y = (movingY + speed * normDyTarget);
            }
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
    moveTowardsTarget(rocks, scissors, papers);
    moveTowardsTarget(scissors, papers, rocks);
    moveTowardsTarget(papers, rocks, scissors);
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