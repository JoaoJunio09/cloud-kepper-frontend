export function openMessageError(message) {

	const html = document.documentElement;
	const width = window.innerWidth;

	const message_error = document.querySelector(".message-error");
	const btnCloseMessageError = document.querySelector("#btn-close-message-error");

	const p = document.querySelector("#message-error-text");
	p.innerHTML = message;
	
	if (width <= 500) {
		message_error.classList.add("show-bottom");
	}
	else {
		message_error.classList.add("show-top");

		console.log("show top");
	}

	btnCloseMessageError.addEventListener('click', () => {
		message_error.classList.remove("show-top");
		message_error.classList.remove("show-bottom");
	});
}

export function closeMessageError() {
	const message_error = document.querySelector(".message-error");
	message_error.classList.remove("show-top");
	message_error.classList.remove("show-bottom");
}