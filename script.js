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
    const canvas = document.getElementById('gameCanvas');
    const activeImage = document.querySelector('.image-placeholder.active img');

    if (activeImage) {
        const canvasRect = canvas.getBoundingClientRect();
        const x = event.clientX - canvasRect.left;
        const y = event.clientY - canvasRect.top;

        const maxImageSize = 50;
        let width = activeImage.width;
        let height = activeImage.height;

        // Scale down the image if it exceeds the maximum size
        if (width > maxImageSize || height > maxImageSize) {
            const aspectRatio = width / height;
            if (aspectRatio > 1) {
                width = maxImageSize;
                height = maxImageSize / aspectRatio;
            } else {
                height = maxImageSize;
                width = maxImageSize * aspectRatio;
            }
        }


        // Draw the active image on the canvas at the clicked position
        const ctx = canvas.getContext('2d');
        ctx.drawImage(activeImage, x, y);
    }
}

// Clear all the placed images
function clearCanvas() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Add event listener to the canvas
const canvas = document.getElementById('gameCanvas');
canvas.addEventListener('click', placeImageOnCanvas);