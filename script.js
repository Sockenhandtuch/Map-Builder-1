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