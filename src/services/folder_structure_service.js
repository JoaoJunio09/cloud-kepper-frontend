const BASE_URL = "http://localhost:8080";

const API_BASE_URL_FINDALL = `${BASE_URL}/api/folderStructure/v1`;
const API_BASE_URL_GETFOLDERSTRUCTURE = `${BASE_URL}/api/folderStructure/v1/:userId`;

async function getFolderStructure(userId) {
	const url = API_BASE_URL_GETFOLDERSTRUCTURE.replace(":userId", userId);
	const response = await fetch(url, {
		method: 'GET'
	});

	if (!response.ok) {
		throw new Error("Erro ao ler estruturas de pastas");
	}

	const data = await response.json();
	return data;
}

export const FolderStructure = {
	getFolderStructure,
}