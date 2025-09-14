export function openMessageSuccess(message) {
	const fade = document.querySelector(".fade");
	const message_success = document.querySelector(".message-success");
	const loading = document.querySelector(".loading");

	const btnContinue = document.querySelector(".message-success button");

	void loading.offsetWidth;

	message_success.classList.add("show-message-success");
	fade.classList.add("show-fade");
	loading.classList.add("show-loading");

	setTimeout(() => {
		message_success.classList.remove("show-message-success");
		fade.classList.remove("show-fade");
		loading.classList.remove("show-loading");
	}, 6000);

	btnContinue.addEventListener('click', () => {
		window.location.href = "../../register.html";
	});
}