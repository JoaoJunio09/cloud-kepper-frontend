const BASE_URL = "http://localhost:8080";

const API_BASE_URL_FINDALL = `${BASE_URL}/api/person/v1`;
const API_BASE_URL_CREATE = `${BASE_URL}/api/person/v1`;

async function findAll() {
	const response = await fetch(API_BASE_URL_FINDALL, {
		method: 'GET'
	});

	if (!response.ok) {
		throw new Error("Erro ao ler usuários do banco de dados");
	}

	const data = await response.json();
	return data;
}

async function create(person) {
	const response = await fetch(API_BASE_URL_CREATE, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'body': JSON.stringify(person)
		},
		body: JSON.stringify(person)
	});

	console.log(response);

	if (!response.ok) {
		throw new Error("Erro ao cadastrar usuário");
	}

	const data = await response.json();
	return data;
}

export const PersonService = {
	findAll,
	create
};