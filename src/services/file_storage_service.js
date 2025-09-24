const BASE_URL = "http://localhost:8080";

const API_BASE_URL_DOWNLOAD_OR_PREVIEW = `${BASE_URL}/api/file/v1/:type/:fileId`;

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

export const FileStorageService = {
	downloadOrPreview,
}