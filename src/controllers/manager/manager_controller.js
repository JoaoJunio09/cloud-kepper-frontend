import { FolderStructure } from "../../services/folder_structure_service.js";

const userId = Number.parseInt(localStorage.getItem('userId'));

document.addEventListener('DOMContentLoaded', () => {
	fillInUserFiles();
});

async function fillInUserFiles() {
	generateStructuredJsonObject(userId);
}

async function generateStructuredJsonObject(id) {
	const path = await readJsonFromFolderStructureByUserId(id);
	
	fetch(path)
		.then(response => response.json())
		.then(data => {
			console.log(data);
		})
		.catch(err => console.log(err));

}

async function readJsonFromFolderStructureByUserId(id) {
	const paths = await FolderStructure.findAll();
	let folder_structure_path;

	paths.forEach(jsonStructurePath => {
		if (jsonStructurePath.user.id === id) {
			folder_structure_path = jsonStructurePath.folderStructurePath;
		}
	});

	console.log(folder_structure_path);
	return folder_structure_path;
}