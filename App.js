document.addEventListener('DOMContentLoaded', () => {
	localStorage.setItem('theme', 'theme-dark');
	const savedTheme = localStorage.getItem('theme');

	if (savedTheme) {
		document.documentElement.className = savedTheme;
	}
	else {
		document.documentElement.className = "theme-dark";
		localStorage.setItem("theme", "theme-dark");
	}
})