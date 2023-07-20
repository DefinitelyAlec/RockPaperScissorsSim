// Game movement logic
let isPlaying = false;
// var imageObjects = [];
var rocks = [];
var papers = [];
var scissors = [];

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

class ImageObject{
    constructor(image, type){
        this.image = image
        this.type = type
        this.x = 0
        this.y = 0
    }
}

// JavaScript function to place the active image on the canvas
function placeImageOnCanvas(event) {
    const canvas = document.getElementById('gameCanvas');
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
        newImageObject.x = x;
        newImageObject.y = y;
        switch(newImageObject.type){
            case "rock":
                rocks.push(newImageObject)
            case "paper":                
                papers.push(newImageObject)
            case "scissors":                
                scissors.push(newImageObject)
        }

        // Draw the active image on the canvas at the clicked position
        const ctx = canvas.getContext('2d');
        ctx.drawImage(activeImage, x, y, activeImage.width, activeImage.height);
    }
}

// Clear all the placed images
function clearCanvas() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rocks = [];
    papers = [];
    scissors = [];
}

// Add event listener to the canvas
const canvas = document.getElementById('gameCanvas');
canvas.addEventListener('click', placeImageOnCanvas);

// JavaScript function to handle the movement of "rock" images towards the closest "paper" image
function moveRockTowardsPaper() {
    const canvasArea = document.getElementById('gameCanvas');
    // const rockImages = imageObjects.querySelectorAll('img[alt="rock"]');
    // const paperImages = imageObjects.querySelectorAll('img[alt="paper"]');
    // console.log(imageObjects)
    console.log(rocks)
    console.log(papers)

    // const ctx = canvasArea.getContext("2d");
    // console.log(ctx);
    // console.log(paperImages);

    rocks.forEach((rockImage) => {
        const rockX = parseFloat(rockImage.x);
        const rockY = parseFloat(rockImage.y);
        // console.log("checking rocks")
        // console.log(rockImage);

        let nearestDistance = Infinity;
        let nearestPaperX, nearestPaperY;
        // console.log("checking paper")


        papers.forEach((paperImage) => {
            const paperX = parseFloat(paperImage.x);
            const paperY = parseFloat(paperImage.y);

            // Calculate the distance between the "rock" and "paper" images
            const dx = paperX - rockX;
            const dy = paperY - rockY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Check if this "paper" image is closer than the current nearest one
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestPaperX = paperX;
                nearestPaperY = paperY;
            }
        });

        // Calculate the direction vector (dx, dy) from "rock" to the nearest "paper"
        const dx = nearestPaperX - rockX;
        const dy = nearestPaperY - rockY;

        // Normalize the direction vector
        const distance = Math.sqrt(dx * dx + dy * dy);
        const normDx = dx / distance;
        const normDy = dy / distance;

        // Update the position of the "rock" image towards the nearest "paper" image
        const speed = 1; // Adjust the speed as needed
        rockImage.x = rockX + speed * normDx + 'px';
        rockImage.y = rockY + speed * normDy + 'px';
    });

    // Call the moveRockTowardsPaper function on the next animation frame
    if (isPlaying) {
        requestAnimationFrame(moveRockTowardsPaper);
    }
}

// JavaScript function to draw the imageObjects on the canvas
function drawImageObjects() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

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

    // Call the drawImageObjects function on the next animation frame
    if (isPlaying) {
        requestAnimationFrame(drawImageObjects);
    }
}

// JavaScript function to start or stop the play movement
function togglePlay() {
    isPlaying = !isPlaying;

    if (isPlaying) {
        // Start the movement animation
        setInterval(function(){
            // moveRockTowardsPaper();
            drawImageObjects();
        },1000)
    }
    else{
        clearInterval()
    }
}

// Add event listener to the "Play" button
const playButton = document.getElementById('playButton');
playButton.addEventListener('click', togglePlay);