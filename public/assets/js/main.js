// Main application script
document.addEventListener('DOMContentLoaded', () => {
    console.log('Application loaded');
    
    // Mobile menu toggle functionality
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Initialize any tooltips
    const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
    tooltipTriggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', showTooltip);
        trigger.addEventListener('mouseleave', hideTooltip);
    });

    // Global event listeners
    document.addEventListener('click', handleGlobalClicks);
});

function showTooltip(e) {
    // Tooltip display logic
    const tooltipText = e.target.getAttribute('data-tooltip');
    const tooltip = document.createElement('div');
    tooltip.className = 'absolute z-10 p-2 text-sm text-white bg-gray-800 rounded shadow-lg';
    tooltip.textContent = tooltipText;
    tooltip.style.top = `${e.target.offsetTop - 30}px`;
    tooltip.style.left = `${e.target.offsetLeft}px`;
    tooltip.id = 'current-tooltip';
    document.body.appendChild(tooltip);
}

function hideTooltip() {
    // Tooltip hide logic
    const tooltip = document.getElementById('current-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

function handleGlobalClicks(e) {
    // Handle global click events
    if (e.target.closest('[data-modal]')) {
        const modalId = e.target.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.toggle('hidden');
        }
    }
}

// Export for module usage if needed
export { showTooltip, hideTooltip };