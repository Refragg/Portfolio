$(document).ready(function(){
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    tooltipTriggerList.forEach(x => {
        x.classList.add("tooltip-text-hint")
        x.setAttribute("data-bs-placement", "bottom")
    })
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl, { delay: { "show": 250, "hide": 250 } }))
});