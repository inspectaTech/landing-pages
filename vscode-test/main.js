const { dropView } = require("../public/alight/xfiles/js/lib/data/drop_view");

let hamburgerButton = document.querySelector('.hamburger_button');
let mobilNav = document.querySelector('.mobile');

function openMobiles() {
    mobileNav.classList.add('open');
}

function closeMobiles() {
    mobileNav.classList.remove('open');
}

hamburgerButton.addEventListener('click',openMobiles);
mobileNav.addEventListener('click', closeMobiles);