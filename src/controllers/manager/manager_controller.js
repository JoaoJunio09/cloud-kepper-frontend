import { FolderStructure } from "../../services/folder_structure_service.js";

const userId = Number.parseInt(localStorage.getItem('userId'));

document.addEventListener('DOMContentLoaded', () => {
	fillInUserFiles();
});

async function fillInUserFiles() {
	try {
		const structure = await readJsonFromFolderStructureByUserId(userId);

		
	}
	catch (error) {

	}
}

async function readJsonFromFolderStructureByUserId(id) {
	const jsonObject = await FolderStructure.getFolderStructure(id);
	return jsonObject.structure;
}