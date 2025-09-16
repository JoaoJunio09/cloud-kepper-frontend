import i18n from "../services/language_service.js";

const acessibility = document.querySelector(".acessibility");
const options = document.querySelectorAll(".option");
const btnOpenAcessibility = document.querySelector(".img-acessibility");
const animation_theme_select = document.querySelector(".theme-select-animation");
const btnChageTheme = document.querySelector(".slider-theme");
const selectLanguages = document.querySelectorAll(".select-language");

let count = 0;
let theme = "";

let lang = "en";

btnOpenAcessibility.addEventListener('click', () => {
	acessibility.classList.toggle("show");
	options.forEach(option => {
		option.classList.toggle("show-option");
	});
});

document.addEventListener('DOMContentLoaded', () => {
	lang = localStorage.getItem('lang') || "en";
	translatePage(lang);

	localStorage.setItem("theme", "theme-dark");
	document.documentElement.className = "theme-dark";
});

selectLanguages.forEach(selectLanguage => {
	selectLanguage.addEventListener('click', function(){
		translatePage(selectLanguage.id);
	});
});

function translatePage(language) {
	lang = language;
	localStorage.setItem('lang', lang);
	
	const textsForPage = document.querySelectorAll("[data-i18n]");
	textsForPage.forEach(el => {
		el.innerHTML = translate(el.getAttribute("data-i18n"));
	});
}

function translate(key) {
	return i18n[lang][key] || key;
}

function changeTheme() {
	animation_theme_select.classList.toggle("show-theme-select-animation");

	count++;
	theme = (count % 2 == 0) ? "theme-dark"	: "theme-light";
	setTheme();
}

function setTheme() {
	document.documentElement.className = theme;
	localStorage.setItem("theme", theme);
}

btnChageTheme.addEventListener('click', changeTheme);