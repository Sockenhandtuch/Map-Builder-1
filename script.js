const draggables = document.querySelectorAll('.draggable');
const dragContainer = document.querySelector('.drag-container');

draggables.forEach(draggable => {
    draggable.addEventListener('mousedown', (e) => {
        let shiftX = e.clientX - draggable.getBoundingClientRect().left;
        let shiftY = e.clientY - draggable.getBoundingClientRect().top;

        const moveAt = (pageX, pageY) => {
            draggable.style.left = pageX - shiftX + 'px';
            draggable.style.top = pageY - shiftY + 'px';
        };

        const onMouseMove = (event) => {
            moveAt(event.pageX, event.pageY);
        };

        document.addEventListener('mousemove', onMouseMove);

        draggable.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', onMouseMove);
            draggable.onmouseup = null;

            // Check if the draggable is within the drag container
            const containerRect = dragContainer.getBoundingClientRect();
            const draggableRect = draggable.getBoundingClientRect();

            if (
                draggableRect.left < containerRect.left ||
                draggableRect.right > containerRect.right ||
                draggableRect.top < containerRect.top ||
                draggableRect.bottom > containerRect.bottom
            ) {
                // Reset position if dropped outside the container
                draggable.style.left = '0px';
                draggable.style.top = '0px';
            }
        });
    });

    draggable.ondragstart = () => false; // Disable default drag behavior
});

// Infinity Canvas Implementation
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

// Initial draw
drawGrid();