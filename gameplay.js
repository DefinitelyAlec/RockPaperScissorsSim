// Game movement logic
let isPlaying = false;

// JavaScript function to handle the movement of "rock" images towards the closest "paper" image
function moveRockTowardsPaper() {
    const canvas = document.getElementById('gameCanvas');
    const rockImages = document.querySelectorAll('img[data-image-type="rock"]');
    const paperImages = document.querySelectorAll('img[data-image-type="paper"]');
    //console.log("made it to function")
    
    rockImages.forEach((rockImage) => {
        const rockX = parseFloat(rockImage.style.left);
        const rockY = parseFloat(rockImage.style.top);

        let nearestDistance = Infinity;
        let nearestPaperX, nearestPaperY;

        paperImages.forEach((paperImage) => {
            const paperX = parseFloat(paperImage.style.left);
            const paperY = parseFloat(paperImage.style.top);

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
        rockImage.style.left = rockX + speed * normDx + 'px';
        rockImage.style.top = rockY + speed * normDy + 'px';
    });

    // Call the moveRockTowardsPaper function on the next animation frame
    if (isPlaying) {
        requestAnimationFrame(moveRockTowardsPaper);
    }
}

// JavaScript function to start or stop the play movement
function togglePlay() {
    isPlaying = !isPlaying;

    if (isPlaying) {
        // Start the movement animation
        moveRockTowardsPaper();
    }
}

// Add event listener to the "Play" button
const playButton = document.getElementById('playButton');
playButton.addEventListener('click', togglePlay);