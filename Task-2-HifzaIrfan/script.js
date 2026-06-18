/* 🍔 HAMBURGER MENU JAVASCRIPT___Why JavaScript instead of Popover API? --> Works on EVERY browser (even older ones)*/

document.addEventListener('DOMContentLoaded', function() {
    
    // Step 1: Find the button and the menu in the page
    const menuBtn = document.getElementById('menu-btn');
    const menuPopover = document.getElementById('menu-popover');
    
    // Safety check: if either doesn't exist, stop here (no errors!)
    if (!menuBtn || !menuPopover) return;
    
    // Step 2: When someone clicks the hamburger button...
    menuBtn.addEventListener('click', function(event) {
        // Stop the click from bubbling up (prevents immediate closing)
        event.stopPropagation();
        // Toggle = if it has 'show', remove it. If it doesn't, add it.
        menuPopover.classList.toggle('show');
    });
    
    // Step 3: Close menu when clicking ANYWHERE else on the page
    document.addEventListener('click', function(event) {
        // Check if the click was:NOT on the menu button AND NOT inside the menu popover
        if (!menuBtn.contains(event.target) && !menuPopover.contains(event.target)) {
            // If true, remove the 'show' class (close the menu)
            menuPopover.classList.remove('show');
        }
    });
    
    // Step 4: Close menu when someone clicks a navigation link
    const menuLinks = menuPopover.querySelectorAll('a');
    menuLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            menuPopover.classList.remove('show');
        });
    });
    
    // 📝 BONUS: Reservation Form Alert              */
    // This just shows a friendly message (demo only) */
    const reservationForm = document.getElementById('reservation-form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(event) {
            event.preventDefault();  // Don't actually submit (no backend yet)
            alert('✨ Thanks for reserving! We\'ll save you a cozy spot. ✨');
            reservationForm.reset();  // Clear the form
        });
    }
    
});
