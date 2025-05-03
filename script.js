document.querySelectorAll('.chess-board td').forEach(cell => {
    cell.addEventListener('click', () => {
        alert('You clicked on a cell!');
    });
});