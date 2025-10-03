import { FileStorageService } from "../../services/file_storage_service.js";
import { FolderStructure } from "../../services/folder_structure_service.js";
import { closeMessageError, openMessageError } from "../../utils/message_error.js";
import { openMessageSuccess } from "../../utils/message_success.js";

const btnToGoBack = document.querySelector("#btnToGoBack");
const btnOpenNewFolder = document.querySelector("#btn-new-folder");
const btnCloseNewFolder = document.querySelector(".btn-close-new-folder");
const btnCreateNewFolder = document.querySelector("#btn-create-new-folder");
const btnCloseSelectMove = document.querySelector("#btn-close-select-folder-for-move-file");
const btnMoveFile = document.querySelector("#btn-move-file");
const btnMoveFileRootFolderDefault = document.querySelector("#btn-move-file-for-root-folder");

const containerSelect = document.querySelector(".container-select-folder-for-move-file");
const containerNewFolder = document.querySelector(".container-new-folder");
const fade = document.querySelector(".fade");

const userId = Number.parseInt(localStorage.getItem('userId'));

let countStage = 0;
let stages;

let fileId;
let folderName;

let globalVariables = {
	currentFolderName: null,
	currentFolderNameDefault: null,
	currentFolderId: null,
	currentFolderIdDefault: null,
};

async function fillInUserFiles() {
	try {
		const structure = await readJsonFromFolderStructureByUserId(userId);
		const folder_structure_html = document.querySelector(".folder-structure");
		const folder_structure_html_select_folder_for_move_file = document.querySelector(".folder-structure-select-folder-for-move-file");
		const table = document.querySelector(".table");
		
		const { htmlSidebar, htmlFileBrowser } = updatesUserFiles(structure.root.children);

		folder_structure_html.innerHTML = htmlSidebar;
		folder_structure_html_select_folder_for_move_file.innerHTML = htmlSidebar;
		table.innerHTML = htmlFileBrowser;

		if (countStage === 0) {
			globalVariables.currentFolderNameDefault = structure.root.name;
			globalVariables.currentFolderIdDefault = structure.root.id;
		}

		attachEventsToFolderButtons();

		globalVariables.fillInTheAttributesOnce++;
		return table.innerHTML;
	}
	catch (error) {
		console.log(error);
	}
}

function updatesUserFiles(list) {

	let htmlSidebar = "";
	let htmlFileBrowser = "";

	list.forEach(child => {
		if (child.type === "folder") {
			const { childrenHtmlFileSidebar, childrenHtmlFileBrowser } = createElementHTMLFolder(child);
			htmlSidebar += childrenHtmlFileSidebar;
			htmlFileBrowser += childrenHtmlFileBrowser;
		}
		else if (child.type === "file") {
			const { elementHtmlFileSidebar, elementHtmlFileBrowser } = createElementHTMLFile(child);
			htmlSidebar += elementHtmlFileSidebar;
			htmlFileBrowser += elementHtmlFileBrowser;
		}
	});
	
	return { htmlSidebar, htmlFileBrowser };
}

function createElementHTMLFile(child) {

	let imgFileType = "";
	let fileId = child.fileId;

	switch (child.fileType) {
		case "image/png": 
			imgFileType = "<img src='src/assets/icons/png.png' alt='file-type'>";
			break;
		case "image/jpg":
			imgFileType = "<img src='src/assets/icons/pjg.png' alt='file-type'>";
			break;
		case "image/jpeg":
			imgFileType = "<img src='src/assets/icons/pjg.png' alt='file-type'>";
			break;
		case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
			imgFileType = "<img src='src/assets/icons/doc.png' alt='file-type'>";
			break;
		case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
			imgFileType = "<img src='src/assets/icons/doc.png' alt='file-type'>";
			break;
		case "application/pdf":
			imgFileType = "<img src='src/assets/icons/pdf.png' alt='file-type'>";
			break;
		default:
			imgFileType = "<img src='src/assets/icons/arquivo (1).png' alt='file-type' class='file-default'>";
	}

	const elementHtmlFileSidebar = `
		<div class="file" fileId=${fileId}>
			${imgFileType}
			<p>${child.name}</p>
		</div>
	`;

	const elementHtmlFileBrowser = `
		<tr class="tr-file-or-folder">
			<td>
				<div class="td-file" fileId="${fileId}">
					${imgFileType}
					${child.name}
				</div>
			</td>
			<td>9:45 AM</td>
			<td class="td-options">
				<img src="src/assets/icons/elipse.png" alt="others" id="btn-options">
				<div class="container-options">
					<button data-i18n="download" id="btn-download-for-options">
						<img src="src/assets/icons/download.png" alt="" id="img-options">
						Download
					</button>
					<button data-i18n="move" id="btn-move-for-options">
						<img src="src/assets/icons/expand-arrows.png" alt="" id="img-options">
						Move
					</button>
					<button data-i18n="delete" id="btn-delete-for-options">
						<img src="src/assets/icons/delete.png" alt="" id="img-options">
						Delete
					</button>
				</div>
			</td>
		</tr>
	`;

	return { elementHtmlFileSidebar, elementHtmlFileBrowser };
}

function createElementHTMLFolder(child) {

	let childrenHtmlFileSidebar = "";
	let childrenHtmlFileBrowser = "";

	if (child.children && child.children.length > 0) {
		const { htmlSidebar } = updatesUserFiles(child.children);
		childrenHtmlFileSidebar = `
			<div class="child">
				${htmlSidebar}
			</div>
		`;
	}

	childrenHtmlFileSidebar = `
		<div class="folder" folderName="${child.name}">
			<img src="src/assets/images/folder_19026003.png" alt="">
			<p>${child.name}</p>
			<div>
				<img src="src/assets/icons/down-arrow.png" alt="" class="btnOpenChildrenForFolder">
			</div>
		</div>
		${childrenHtmlFileSidebar}
	`;

	childrenHtmlFileBrowser = `
		<tr>
			<td class="btnOpenChildrenForFolderBrowser" data-children='${JSON.stringify(child.children || [])}'>
				<div class="td-folder" folderId="${child.id}">
					<img src="src/assets/images/folder_19026003.png" alt="" class="folder-style-browser">
					<span>${child.name}</span>
				</div>
			</td>
			<td>9:45 AM</td>
			<td class="td-options">
				<img src="src/assets/icons/elipse.png" alt="others" id="btn-options">
				<div class="container-options">
					<button data-i18n="delete" id="btn-delete-for-options">
						<img src="src/assets/icons/delete.png" alt="" id="img-options">
						Delete
					</button>
					<button data-i18n="move" id="btn-move-for-options">
						<img src="src/assets/icons/expand-arrows.png" alt="" id="img-options">
						Move
					</button>
				</div>
			</td>
		</tr>
	`;

	return { childrenHtmlFileSidebar, childrenHtmlFileBrowser };
}

async function readJsonFromFolderStructureByUserId(id) {
	const jsonObject = await FolderStructure.getFolderStructure(id);
	return jsonObject.structure;
}

function attachEventsToFolderButtons() {
    const btnsOpenChild = document.querySelectorAll(".btnOpenChildrenForFolder");
    const btnsOpenChildForBrowser = document.querySelectorAll(".btnOpenChildrenForFolderBrowser");
		const btnsOptions = document.querySelectorAll("#btn-options");
		const trFileOrFolder = document.querySelectorAll(".tr-file-or-folder");

    btnsOpenChild.forEach(btn => {
			let openChild = false;

      btn.addEventListener('click', (e) => {
				const folder = btn.closest(".folder");
				const childHtml = folder.nextElementSibling;
					
				if (childHtml) {
					if (!openChild) {
						openChild = true;
						childHtml.classList.add("show-child");
						btn.style.transform = "rotate(180deg)";
					}
					else {
						openChild = false;
						childHtml.classList.remove("show-child");
						btn.style.transform = "rotate(0deg)";	
					}
				}
			});
    });

		btnsOpenChildForBrowser.forEach(btn => {
      btn.addEventListener('click', (e) => {
				document.querySelector("#btnToGoBack").innerHTML = "Voltar";

				const table = document.querySelector(".table");

				const childrenData = btn.getAttribute('data-children');
				const children = childrenData ? JSON.parse(childrenData) : [];
		
				const { htmlFileBrowser } = updatesUserFiles(children);

				table.innerHTML = htmlFileBrowser;

				countStage++;
				stages.push({ stage: countStage, content: htmlFileBrowser });

				globalVariables.currentFolderName = btn.querySelector("span").innerHTML;
				globalVariables.currentFolderId = btn.querySelector(".td-folder").getAttribute('folderId');

				if (countStage === 0) {
					console.log("to na root")
				}
				attachEventsToFolderButtons();
			});
    });

		btnsOptions.forEach(btn => {
			btn.addEventListener('click', (e) => {			
				const td = e.target.closest(".td-options");
				const containerOptions = td.querySelector(".container-options");

				containerOptions.classList.toggle("show-container-options");
			});
		})

		trFileOrFolder.forEach(tr => {
			const btnMove = tr.querySelector("#btn-move-for-options");

			btnMove.addEventListener('click', () => selectFolderForMove(tr));
		})

		btnToGoBack.addEventListener('click', toGoBack);
}

function toGoBack() {
	countStage--;
	const table = document.querySelector(".table");

	let verifyNumberStages = 0;

	stages.forEach(stage => {
		if (stage.stage === countStage) {
			verifyNumberStages++;
		}
	});
	
	if (verifyNumberStages > 0) {
		const filterStage = stages.filter(item => item.stage === countStage);
		table.innerHTML = filterStage[filterStage.length - 1].content;
	}
	else {
		table.innerHTML = stages[countStage].content;
	}

	attachEventsToFolderButtons();
}

async function move(moveRootFolder) {

	let folderNameDefault = "root";

	try {
		validationFileIdAndFolderName(fileId, folderName || folderNameDefault);

		if (!moveRootFolder) {
			folderNameDefault = folderName;
			console.log(folderNameDefault);
		}

		const data = await FileStorageService.moveFile(userId, fileId, folderNameDefault);

		if (data.fileId !== null) {
			closeMessageError();
			closeSelectMove();
			fillInUserFiles();
		}
	}
	catch (error) {
		openMessageError(error.message);
	}
}

function validationFileIdAndFolderName(fileId, folderName) {
	let message_error = (localStorage.getItem('lang') === "pt") 
		? "Id do arquivo ou nome da pasta são nulos"
		: "File Id or Folder Name is null";
	if (fileId === null || folderName === null || fileId === undefined || folderName === undefined) {
		throw new Error(message_error);
	}
}

function selectFolderForMove(tr) {
	openSelectMove();

	const folder_structure_select = document.querySelector(".folder-structure-select-folder-for-move-file");
	const folders = folder_structure_select.querySelectorAll('.folder');

	folders.forEach(folder => {
		folder.addEventListener('click', () => {
			closeAllBackgroundColor();
			folderName = folder.getAttribute('folderName');
			folder.classList.add("select-folder");
		});
	});

	fileId = tr.querySelector(".td-file").getAttribute('fileId');
}

function closeAllBackgroundColor() {
	const folder_structure_select = document.querySelector(".folder-structure-select-folder-for-move-file");
	const folders = folder_structure_select.querySelectorAll('.folder');

	folders.forEach(folder => {
		folder.classList.remove("select-folder");
	});
}

async function newFolder() {
	class FolderAdded {
		userId = null;
		newFolderName = null;
		folderId = null
		folderName = null;

		constructor(userId, newFolderName, folderId, folderName) {
			this.userId = userId,
			this.newFolderName = newFolderName,
			this.folderId = folderId;
			this.folderName = folderName
		}
	}

	let nameForNewFolder = document.querySelector("#name-for-new-folder").value;

	let folderName = globalVariables.currentFolderName;
	let folderId = globalVariables.currentFolderId;

	if (folderName === null && folderId === null || countStage === 0) {
		folderName = globalVariables.currentFolderNameDefault;
		folderId = globalVariables.currentFolderIdDefault;
	}

	try {
		validationNameForNewFolder(nameForNewFolder);

		const folderAdded = new FolderAdded(userId, nameForNewFolder, folderId, folderName);

		const response = await FolderStructure.createFolder(folderAdded);

		if (!response) {
			let message_error = (localStorage.getItem('lang') === "pt") 
				? "Não foi possível criar a pasta" 
				: "Could not create folder";
			openMessageError(message_error);
			return;
		}

		await fillInUserFiles();
		closeNewFolder();
	}
	catch (error) {
		console.log(error);
		openMessageError(error.message);
	}
}

async function openFile(fileId) {
	try {
		const { fileURL, blob } = await FileStorageService.downloadOrPreview("preview", fileId);

		window.open(fileURL, 'blank');
	}
	catch (error) {
		console.log(error);
	}
}

function validationNameForNewFolder(name) {
	let message_error = (localStorage.getItem('lang') === "pt") 
		? "Preencha o nome da nova pasta"
		: "Fill in the name of the new folder";
	if (name === "" || name === null || name === undefined) {
		throw new Error(message_error);
	}
}

function openNewFolder() {
	if (containerNewFolder) {
		containerNewFolder.classList.add("show-container-new-folder");
		fade.classList.add("show-fade");
	}
}

function closeNewFolder() {
	if (containerNewFolder) {
		containerNewFolder.classList.remove("show-container-new-folder");
		fade.classList.remove("show-fade");
	}
}

function openSelectMove() {
	if (containerSelect) {
		containerSelect.classList.add("show-container-select-folder-for-move-file");
	}
}

function closeSelectMove() {
	if (containerSelect) {
		containerSelect.classList.remove("show-container-select-folder-for-move-file");
	}
}

btnCreateNewFolder.addEventListener('click', newFolder);
btnOpenNewFolder.addEventListener('click', openNewFolder);
btnCloseNewFolder.addEventListener('click', closeNewFolder);
btnCloseSelectMove.addEventListener('click', closeSelectMove);
btnMoveFile.addEventListener('click',() => move(false));
btnMoveFileRootFolderDefault.addEventListener('click', () => move(true));

document.addEventListener('click', (e) => {
	const file = e.target.closest(".file");
	const tdFile = e.target.closest(".td-file");
	if (file) {
		openFile(file.getAttribute("fileId"));
	}
	if (tdFile) {
		openFile(tdFile.getAttribute("fileId"));
	}
})

document.addEventListener('DOMContentLoaded', async () => {
	fillInUserFiles();
	stages = [{ stage: 0, content: await fillInUserFiles() }];
});