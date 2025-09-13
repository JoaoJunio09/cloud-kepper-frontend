const inputs = document.querySelectorAll(".form input");
const btnLogin = document.querySelector("#btn-login");

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