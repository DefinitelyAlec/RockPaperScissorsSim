const helpButton = document.querySelector('.help-button');
helpButton.addEventListener('click', expandHelp);
const helpButtonWrapper = document.querySelector('.help-button-wrapper');

function expandHelp(event) { 
    helpButtonWrapper.classList.toggle("expanded");
}