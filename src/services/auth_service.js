const BASE_URL = "http://localhost:8080";

const API_BASE_URL_SIGNIN = `${BASE_URL}/auth/signin`;

function signIn(username, password) {
	const response = fetch(API_BASE_URL_SIGNIN, {
		method: 'POST'
	});

	if (!response.ok) {
		throw new Error("Erro de autenticação");
	}


	const data = response.json();
	return insertTokenIntoMemory(data);
}

function insertTokenIntoMemory(data) {
	if (token == "" || token == null) {
		throw new Error("Token inválido");
	}
	const token = data.body.accessToken;
	localStorage.setItem('token', token);
	return true;
}

export const AuthService = {
	signIn
}