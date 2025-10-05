const BASE_URL = "http://localhost:8080";

const API_BASE_URL_GETFOLDERSTRUCTURE = `${BASE_URL}/api/folderStructure/v1/:userId`;
const API_BASE_URL_CREATEFOLDER = `${BASE_URL}/api/folderStructure/v1/:userId/:newFolderName/:folderId?folderName=:name`;

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

async function createFolder(folderAdded) {
	const urlUserId = API_BASE_URL_CREATEFOLDER.replace(":userId", folderAdded.userId);
	const urlNewFolderName = urlUserId.replace(":newFolderName", folderAdded.newFolderName);
	const urlFolderId = urlNewFolderName.replace(":folderId", folderAdded.folderId);
	const url = urlFolderId.replace(":name", folderAdded.folderName);
	const response = await fetch(url, {
		method: 'GET',
	});

	if (!response.ok) {
		throw new Error("Erro ao criar nova pasta");
	}

	const data = await response.json();
	return data;
}

export const FolderStructure = {
	getFolderStructure,
	createFolder,
}