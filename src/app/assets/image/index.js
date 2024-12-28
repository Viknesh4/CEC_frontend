// Create an intersection observer to trigger the zoom-in effect when the card is in view
const zoomCard = document.getElementById("zoomCard");

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            zoomCard.classList.add("zoom-in");
        } else {
            zoomCard.classList.remove("zoom-in");
        }
    });
}, {
    threshold: 1  // Trigger animation when 50% of the card is in view
});

observer.observe(zoomCard);
