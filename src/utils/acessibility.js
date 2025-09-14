const acessibility = document.querySelector(".acessibility");
const btnOpenAcessibility = document.querySelector(".img-acessibility");
const animation_theme_select = document.querySelector(".theme-select-animation");
const btnChageTheme = document.querySelector(".slider-theme");

let count = 0;
let theme = "";

btnOpenAcessibility.addEventListener('click', () => {
	acessibility.classList.toggle("show");
});

document.addEventListener('DOMContentLoaded', () => {
	localStorage.setItem("theme", "theme-dark");
	document.documentElement.className = "theme-dark";
});

function changeTheme() {
	animation_theme_select.classList.toggle("show-theme-select-animation");

	count++;
	if (count % 2 == 0) {
		theme = "theme-dark";
	}
	else {
		theme = "theme-light";
	}

	setTheme();
}

function setTheme() {
	document.documentElement.className = theme;
	localStorage.setItem("theme", theme);
}

btnChageTheme.addEventListener('click', changeTheme);