// Game movement logic
let alreadyPlaying = false;
var rocks = [];
var papers = [];
var scissors = [];
var moveRockInterval;
const paperImg = document.getElementById("paper");
const scissorsImg = document.getElementById("scissors");
const rockImg = document.getElementById("rock");


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
                        console.log("rocks before: "+rocks.entries)
                        console.log("papers before: "+papers.entries)
                        rockIndex = rocks.indexOf(targetImage);
                        rocks.splice(rockIndex, 1);
                        papers.push(targetImage);
                        console.log("rocks after: "+rocks.entries)
                        console.log("papers after: "+papers.entries)
                        // targetImage.transmute("paper");
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


// JavaScript function to start or stop the play movement
function play() {
    // Start the movement animation
    if (!alreadyPlaying){
        moveRockInterval = setInterval(function() {
            moveTowardsTarget(rocks, scissors);
            moveTowardsTarget(scissors, papers);
            moveTowardsTarget(papers, rocks);
            drawImageObjects();
        }, 25);
        if (rocks.length === 0 && papers.length === 0){
            clearInterval(moveRockInterval);
            alreadyPlaying = false;
            window.alert("Scissors Wins!")
        } else if (rocks.length === 0 && scissors.length === 0){
            clearInterval(moveRockInterval);
            alreadyPlaying = false;
            window.alert("Paper Wins!")
        } else if (papers.length === 0 && scissors.length === 0){
            clearInterval(moveRockInterval);
            alreadyPlaying = false;
            window.alert("Rock Wins!")
        }
    }
}