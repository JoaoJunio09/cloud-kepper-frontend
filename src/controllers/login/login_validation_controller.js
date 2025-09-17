import { UserService } from "../../services/user_service.js";
import { closeMessageError, openMessageError } from "../../utils/message_error.js";
import { openMessageSuccess } from "../../utils/message_success.js";

const inputs = document.querySelectorAll(".form input");
const btnLogin = document.querySelector("#btn-login");

document.addEventListener('DOMContentLoaded', () => {
	localStorage.setItem("translate", "usa");
});

async function login() {
	let id = null;

	const email = document.querySelector("#email").value;
	const password = document.querySelector("#password").value;

	try {
		dataValidationForLogin(email, password);
		closeMessageError();

		const users = await UserService.findAll();
		users.forEach(user => {
			if (user.email === email && user.password === password) {
				id = user.id;
			}
		});

		setIdFromUserForStorage(id);
		displaySucessMessage("Login realizado");
	}
	catch (error) {
		displayErrorMessage(error.message);
	}
}

function dataValidationForLogin(email, password) {
	let message_error_email = (localStorage.getItem("translate") === "br")
		? "Preencha o e-mail" 
		: "Fill in the e-mail";
	let message_error_password = (localStorage.getItem("translate") === "br")
		? "Preencha a senha" 
		: "Fill in the password";

	if (email === "" || email == null) {
		throw new Error(message_error_email);
	}
	else if (password === "" || password == null) {
		throw new Error(message_error_password);
	}
}

function setIdFromUserForStorage(id) {
	let message_error_user = (localStorage.getItem("translate") === "br")
		? "E-mail ou senha incorretos" 
		: "Incorrect email or password";

	if (id == null) {
		throw new Error(message_error_user);
	}
	localStorage.setItem("id", id);
}

function displaySucessMessage(message) {
	openMessageSuccess(message,  "../../../manager.html");
	redirectsToManager();
}

function displayErrorMessage(message) {
	openMessageError(message);
}

function redirectsToManager() {
	setInterval(() => {
		window.location.href = "../../../manager.html";
	}, 6000);
}

inputs.forEach(input => {
	input.addEventListener('focus', () => {
		input.style = "border: 1px solid rgb(0, 83, 0)";
		
		if (input.id === "email") {
			const __labelEmail = document.querySelector("#email-label");
			__labelEmail.style = "font-size: .8rem";
		}

		if (input.id === "password") {
			const __labelPassword = document.querySelector("#password-label");
			__labelPassword.style = "font-size: .8rem";
		}
	});

	input.addEventListener('blur', () => {
		input.style = "border: none";

		const __labelEmail = document.querySelector("#email-label");
		__labelEmail.style = "font-size: 1rem;";

		const __labelPassword = document.querySelector("#password-label");
			__labelPassword.style = "font-size: 1rem";
	});
});

btnLogin.addEventListener('click', login);