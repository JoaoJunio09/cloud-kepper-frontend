import i18n from "../services/language_service.js";
import { closeMessageError } from "./message_error.js";

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
	selectLanguage.addEventListener('click', function() {
		translatePage(selectLanguage.id);
		closeMessageError();
	});
});

function translatePage(language) {
	lang = language;
	localStorage.setItem('lang', lang);
	
	const textsForPage = document.querySelectorAll("[data-i18n]");
	textsForPage.forEach(el => {
		el.innerHTML = translate(el.getAttribute("data-i18n"));

		if (el.id === "btn-upload") {
			el.innerHTML = `
				<img src="src/assets/icons/cloud-computing.png" alt="" class="img-options-header">
				${translate(el.getAttribute('data-i18n'))}
			`;
		}

		if (el.id === "btn-new-folder") {
			el.innerHTML = `
				<img src="src/assets/icons/folder.png" alt="" class="img-options-header">
				${translate(el.getAttribute('data-i18n'))}
			`;
		}

		if (el.id === "btn-delete") {
			el.innerHTML = `
				<img src="src/assets/icons/delete.png" alt="" class="img-options-header">
				${translate(el.getAttribute('data-i18n'))}
			`;
		}

		if (el.id === "btn-delete-for-options") {
			el.innerHTML = `
				<img src="src/assets/icons/delete.png" alt="" id="img-options">
				${translate(el.getAttribute('data-i18n'))}
			`;
		}

		if (el.id === "btn-move-for-options") {
			el.innerHTML = `
				<img src="src/assets/icons/expand-arrows.png" alt="" id="img-options">
				${translate(el.getAttribute('data-i18n'))}
			`;
		}

		if (el.id === "btn-download-for-options") {
			el.innerHTML = `
				<img src="src/assets/icons/download.png" alt="" id="img-options">
				${translate(el.getAttribute('data-i18n'))}
			`;
		}
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