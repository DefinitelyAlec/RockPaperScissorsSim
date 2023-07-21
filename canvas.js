// Game movement logic
let alreadyPlaying = false;
// var imageObjects = [];
var rocks = [];
var papers = [];
var scissors = [];
var moveRockInterval;

// global canvas and context variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


class ImageObject{
    constructor(image, type){
        this.image = image
        this.type = type
        this.x = 0
        this.y = 0
    }

    draw(ctx, x, y, width, height){
        ctx.drawImage(this.image, x, y, width, height)
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
    // const canvasImage = new ImageObject(activeImage, activeImage.alt)
    // console.log(canvasImage)

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

        const newImageObject = new ImageObject(activeImage, activeImage.alt);
        newImageObject.x = parseFloat(x);
        newImageObject.y = parseFloat(y);
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

        
        // ctx.drawImage(activeImage, x, y, activeImage.width, activeImage.height);
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
        movingImage.x = movingX + speed * normDx;
        movingImage.y = movingY + speed * normDy;
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
    }
}