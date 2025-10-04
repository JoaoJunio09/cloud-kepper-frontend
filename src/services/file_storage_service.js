const BASE_URL = "http://localhost:8080";

const API_BASE_URL_DOWNLOAD_OR_PREVIEW = `${BASE_URL}/api/file/v1/:type/:fileId`;
const API_BASE_URL_MOVE_FILE_A_OTHER_FOLDER = `${BASE_URL}/api/file/v1/:userId/:fileId/:folderName/:folderId`;

async function downloadOrPreview(type, fileId) {
	const urlInitial = API_BASE_URL_DOWNLOAD_OR_PREVIEW.replace(":type", type);
	const url = urlInitial.replace(":fileId", fileId);
	const response = await fetch(url, {
		method: 'GET'
	});

	if (!response.ok) {
		throw new Error("Erro ao realizar preview ou download do arquivo");
	}

	const blob = await response.blob();
	const fileURL = URL.createObjectURL(blob);
	return { fileURL, blob };
}

async function moveFile(userId, fileId, folderId, folderName) {
	const urlUserId = API_BASE_URL_MOVE_FILE_A_OTHER_FOLDER.replace(":userId", userId);
	const urlFileId = urlUserId.replace(":fileId", fileId);
	const urlFolderName = urlFileId.replace(":folderName", folderName);
	const url = urlFolderName.replace(":folderId", folderId);
	const response = await fetch(url, {
		method: 'GET'
	});

	if (!response.ok) {
		throw new Error("Erro ao mover arquivo para outra pasta");
	}

	const data = await response.json();
	return data;
}

export const FileStorageService = {
	downloadOrPreview,
	moveFile,
}