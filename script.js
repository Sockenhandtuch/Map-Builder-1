// Select draggable elements and the drag container
const draggables = document.querySelectorAll('.draggable');
const canvas = document.getElementById('infiniteCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size to fill the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables for panning
let offsetX = 0;
let offsetY = 0;
let isPanning = false;
let startX, startY;

// Variables for zooming
let scale = 1;
const zoomSpeed = 0.1;

// Draw a grid on the canvas
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gridSize = 50;
    const scaledGridSize = gridSize * scale;

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    ctx.beginPath();
    for (let x = -offsetX; x < canvas.width / scale; x += gridSize) {
        ctx.moveTo(x, -offsetY);
        ctx.lineTo(x, canvas.height / scale - offsetY);
    }
    for (let y = -offsetY; y < canvas.height / scale; y += gridSize) {
        ctx.moveTo(-offsetX, y);
        ctx.lineTo(canvas.width / scale - offsetX, y);
    }
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    ctx.restore();
}

// Handle panning
canvas.addEventListener('mousedown', (e) => {
    isPanning = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
    canvas.style.cursor = 'grabbing';
});

canvas.addEventListener('mousemove', (e) => {
    if (isPanning) {
        offsetX = e.clientX - startX;
        offsetY = e.clientY - startY;
        drawGrid();
    }
});

canvas.addEventListener('mouseup', () => {
    isPanning = false;
    canvas.style.cursor = 'grab';
});

canvas.addEventListener('mouseleave', () => {
    isPanning = false;
    canvas.style.cursor = 'grab';
});

// Handle zooming
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const mouseX = (e.clientX - offsetX) / scale;
    const mouseY = (e.clientY - offsetY) / scale;

    if (e.deltaY < 0) {
        scale += zoomSpeed;
    } else {
        scale = Math.max(0.1, scale - zoomSpeed);
    }

    offsetX = e.clientX - mouseX * scale;
    offsetY = e.clientY - mouseY * scale;

    drawGrid();
});

// Redraw the canvas grid on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawGrid(); // Redraw the grid after resizing
});

// Initial draw
drawGrid();

// Make the canvas a drop zone for images
canvas.addEventListener('dragover', (e) => {
    e.preventDefault(); // Allow dropping
});

canvas.addEventListener('drop', (e) => {
    e.preventDefault();

    // Get the dropped image
    const imgId = e.dataTransfer.getData('text/plain');
    const img = document.getElementById(imgId);

    if (img) {
        // Get the drop position relative to the canvas
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left - offsetX) / scale;
        const y = (e.clientY - rect.top - offsetY) / scale;

        // Draw the image on the canvas
        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);
        ctx.drawImage(img, x, y, 100, 100); // Draw the image at the drop position
        ctx.restore();
    }
});

// Enable dragging for tokens
draggables.forEach(draggable => {
    draggable.setAttribute('draggable', true);

    draggable.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', draggable.id); // Pass the image ID
    });
});