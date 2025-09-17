import { UserService } from "../../services/user_service.js";
import { closeMessageError, openMessageError } from "../../utils/message_error.js";
import { openMessageSuccess } from "../../utils/message_success.js";

const btnRegister = document.querySelector("#btnRegister");

class User {
	name;
	surname;
	email;
	password;

	constructor(name, surname, email, password) {
		this.name = name;
		this.surname = surname,
		this.email = email,
		this.password = password
	}

	setName(name) { this.name = name; }
	getName() { return this.name; }

	setSurname(surname) { this.surname = surname; }
	getSurname() { return this.surname; }
	
	setEmail(email) { this.email = email; }
	getEmail() { return this.email; }

	setPassword(password) { this.password = password }
	getPassword() { return this.password; }
}

async function register() {
	const name     = document.querySelector("#name").value;
	const surname  = document.querySelector("#surname").value;
	const email    = document.querySelector("#email").value;
	const password = document.querySelector("#password").value;

	try {
		const user = new User(name, surname, email, password);

		dataValidationForRegister(user);
		closeMessageError();

		const saveUser = {
			id: null,
			firstName: user.name,
			lastName: user.surname,
			email: user.email,
			password: user.password,
			enabled: true
		};

		const userSaved = await UserService.create(saveUser);

		if (userSaved == null || userSaved == undefined) {
			const interval_server_error_message = (localStorage.getItem('lang') === "pt") 
				? "Não foi possível registrar usuario"
				: "Unable to register user";
			openMessageError(interval_server_error_message);
		}

		openMessageSuccess("Cadastrado com sucesso", "../../../login.html");
		redirectsToLogin();
	}
	catch (error) {
		console.log(error);
		openMessageError(error.message);
	}
}

function dataValidationForRegister(user) {
	let message_error_name = (localStorage.getItem('lang') === "pt")
		? "Preencha o nome" 
		: "Fill in the name";
	let message_error_surname = (localStorage.getItem('lang') === "pt")
		? "Preencha o sobrenome" 
		: "Fill in the surname";
	let message_error_email = (localStorage.getItem('lang') === "pt")
		? "Preencha o e-mail" 
		: "Fill in the e-mail";
	let message_error_password = (localStorage.getItem('lang') === "pt")
		? "Preencha a senha" 
		: "Fill in the password";

	if (user.name === "" || user.name === null) {
		throw new Error(message_error_name);
	}
	if (user.surname === "" || user.surname === null) {
		throw new Error(message_error_surname);
	}
	if (user.email === "" || user.email === null) {
		throw new Error(message_error_email);
	}
	if (user.password === "" || user.password === null) {
		throw new Error(message_error_password);
	}

	var __regex_password = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
	var password_valid = __regex_password.test(user.password);

	if (!password_valid) {
		let message_error_password = (localStorage.getItem('lang') === "pt")
			? "Senha muita fraca" 
			: "Very weak password";
			throw new Error(message_error_password);
	}

}

function redirectsToLogin() {
	setTimeout(() => {
		window.location.href = "login.html";
	}, 6000);
}

btnRegister.addEventListener('click', register);