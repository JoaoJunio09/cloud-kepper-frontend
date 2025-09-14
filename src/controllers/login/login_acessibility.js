import { closeMessageError } from "../../utils/message_error.js";

const container = document.querySelector(".container-alter-theme");
const slider = document.querySelector(".slider");

const buttonTranslator = document.querySelector("#btn-translator");
const boxTranslator = document.querySelector(".box-translator");
const buttonsSelectLanguage = document.querySelectorAll(".select-language");

let count = 1;
let theme = "";

document.addEventListener('DOMContentLoaded', () => {
	localStorage.setItem('theme', 'theme-dark');
	if (localStorage.getItem('theme') == "theme-dark") {
		slider.style.transform = "translateX(0px)";
	}
	else {
		slider.style.transform = "translateX(-30px)";
		count = 2;
	}
});

container.addEventListener('click', () => {
	count++;
	updateSliderTheme();
	setTheme();
});

buttonTranslator.addEventListener('click', () => {
	boxTranslator.classList.toggle("show-box-translator");
});

buttonsSelectLanguage.forEach(btn => {
	btn.addEventListener('click', () => {
		boxTranslator.classList.toggle("show-box-translator");
		translate(btn.getAttribute("language"));
	});
});

function translate(language) {
	let h1 = document.querySelector(".cloudkeeper-login h1");
	let email = document.querySelector("#email-label");
	let password = document.querySelector("#password-label");
	let login = document.querySelector("#btn-login");
	let h1MessageError = document.querySelector(".message-error h1");

	switch (language) {
		case "br":
			h1.textContent = "Entrar";
			email.textContent = "Email";
			password.textContent = "Senha";
			login.textContent = "Entrar";
			h1MessageError.textContent = "Desculpe!";
			localStorage.setItem("translate", "br");
			break;
		case "usa":
			h1.textContent = "Login";
			email.textContent = "E-mail";
			password.textContent = "Password";
			login.textContent = "Login";
			h1MessageError.textContent = "Sorry!";
			localStorage.setItem("translate", "usa");
			break;
		default:
			window.alert("Error translating this page");
	}

	closeMessageError();
}

function updateSliderTheme() {
	if (count % 2 == 0) {
		slider.style.transform = "translateX(-30px)";
		theme = "theme-light";
	}
	else {
		slider.style.transform = "translateX(0px)";
		theme = "theme-dark";
	}
}

function setTheme() {
	document.documentElement.className = theme;
	localStorage.setItem("theme", theme);
}