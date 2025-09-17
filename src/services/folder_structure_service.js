const BASE_URL = "http://localhost:8080";

const API_BASE_URL_FINDALL = `${BASE_URL}/api/folderStructure/v1`;

async function findAll() {
	const response = await fetch(API_BASE_URL_FINDALL, {
		method: 'GET'
	});

	if (!response.ok) {
		throw new Error("Erro ao ler estruturas de pastas");
	}

	const data = await response.json();
	return data;
}

export const FolderStructure = {
	findAll,
}