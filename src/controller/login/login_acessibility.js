const container = document.querySelector(".container-alter-theme");
const slider = document.querySelector(".slider");
const slider_theme_light = document.querySelector(".slider-theme-1");
const slider_theme_dark = document.querySelector(".slider-theme-2");

const buttonTranslator = document.querySelector("#btn-translator");
const boxTranslator = document.querySelector(".box-translator");
const buttonsSelectLanguage = document.querySelectorAll(".select-language");

let count = 1;
let theme = "";

container.addEventListener('click', () => {
	count++;
	updateSliderTheme();

	document.documentElement.className = theme;
	localStorage.setItem("theme", theme);
});

buttonTranslator.addEventListener('click', () => {
	boxTranslator.classList.toggle("show-box-translator");
});

buttonsSelectLanguage.forEach(btn => {
	btn.addEventListener('click', () => {
		boxTranslator.classList.toggle("show-box-translator");
	});
});

function updateSliderTheme() {
	if (count % 2 == 0) {
		slider.style.transform = "translateX(-35px)";
		theme = "theme-light";
	}
	else {
		slider.style.transform = "translateX(0px)";
		theme = "theme-dark";
	}
}