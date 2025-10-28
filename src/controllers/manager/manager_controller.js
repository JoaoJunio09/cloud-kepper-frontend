import { FileStorageService } from "../../services/file_storage_service.js";
import { FolderStructure } from "../../services/folder_structure_service.js";
import { closeMessageError, openMessageError } from "../../utils/message_error.js";

const btnUpload = document.querySelector("#btn-upload");
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

let globalVariables = {
	countStage: 0,
	stages: null,
	fileId: null,
	folderName: null,
	folderId: null,
	currentFolderName: null,
	currentFolderNameDefault: null,
	currentFolderId: null,
	currentFolderIdDefault: null,
	currentChildrenForCurrentFolder: null,
	childrenForCurrentFolder: null,
	currentStage: null,
	folderOrFileMove: null,
	folderIdMove: null,
	navigationForName: [],
	stringNavigationForName: "",
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

		if (globalVariables.countStage === 0) {
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
	let htmlFileBrowser = `
		<thead align="left">
			<tr>
				<th>Name</th>
				<th>Last Modified</th>
				<th></th>
			</tr>
		</thead>
	`;

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
		case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
			imgFileType = "<img src='src/assets/icons/doc.png' alt='file-type'>";
			break;
		case "application/pdf":
			imgFileType = "<img src='src/assets/icons/pdf.png' alt='file-type'>";
			break;
		case "video/mp4":
			imgFileType = "<img src='src/assets/icons/mp4.png' alt='file-type'>";
			break;
		case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
			imgFileType = "<img src='src/assets/icons/xls-file.png' alt='file-type'>";
			break;
		case "application/x-zip-compressed":
			imgFileType = "<img src='src/assets/icons/zip.png' alt='file-type'>";
			break;
		default:
			imgFileType = "<img src='src/assets/icons/file.png' alt='file-type' class='file-default'>";
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
			<td class="td-datetime">${child.datetime}</td>
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
		<div class="folder" folderName="${child.name}" folderId="${child.id}">
			<img src="src/assets/icons/folder (1).png" alt="" class="folder-style-browser">
			<p>${child.name}</p>
			<div>
				<img src="src/assets/icons/down-arrow.png" alt="" class="btnOpenChildrenForFolder arrow">
			</div>
		</div>
		${childrenHtmlFileSidebar}
	`;

	childrenHtmlFileBrowser = `
		<tr class="tr-file-or-folder">
			<td class="btnOpenChildrenForFolderBrowser" data-children='${JSON.stringify(child.children || [])}'>
				<div class="td-folder" folderId="${child.id}">
					<img src="src/assets/icons/folder (1).png" alt="" class="folder-style-browser">
					<span>${child.name}</span>
				</div>
			</td>
			<td class="td-datetime">${child.datetime}</td>
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
      btn.addEventListener('click', async (e) => {
				document.querySelector("#btnToGoBack").innerHTML = "Voltar";

				const table = document.querySelector(".table");

				const folderId = btn.querySelector(".td-folder").getAttribute('folderId');
				const structure = await readJsonFromFolderStructureByUserId(userId);
				const folder = findFolderByIdAndName(structure.root.children, folderId, btn.querySelector("span").innerHTML);
				const children = folder?.children || [];
		
				const { htmlFileBrowser } = updatesUserFiles(children);

				table.innerHTML = htmlFileBrowser;

				globalVariables.countStage++;

				globalVariables.stages.push({ 
					stage: globalVariables.countStage, 
					content: htmlFileBrowser, 
					childrenData: children, 
					folderId: btn.querySelector(".td-folder").getAttribute('folderId'),
					folderName: btn.querySelector("span").innerHTML
				});

				globalVariables.currentFolderName = btn.querySelector("span").innerHTML;
				globalVariables.currentFolderId = btn.querySelector(".td-folder").getAttribute('folderId');

				console.log(globalVariables.stages);

				globalVariables.navigationForName.push(btn.querySelector("span").innerHTML);
				formatsNavigationString();

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

function formatsNavigationString() {
	const htmlNavigationForName = document.querySelector(".navigation-for-name");
	let string = "";
	const stringHome = "home/";

	globalVariables.navigationForName.forEach(text => {
		string += text + "/";
	});
	globalVariables.stringNavigationForName = stringHome + string;

	htmlNavigationForName.innerHTML = globalVariables.stringNavigationForName; 

	formatColorInStringNavigation();
}

function formatColorInStringNavigation() {
	const htmlNavigationForName = document.querySelector(".navigation-for-name");
	const lastName = globalVariables.navigationForName[globalVariables.navigationForName.length - 1];

	let text = htmlNavigationForName.innerHTML.replaceAll("/", " ");
	console.log(text);
}

async function toGoBack() {

	globalVariables.countStage--;
	const table = document.querySelector(".table");

	let verifyNumberStages = 0;

	globalVariables.stages.forEach(stage => {
		if (stage.stage === globalVariables.countStage) {
			verifyNumberStages++;
		}
	});

	if (verifyNumberStages > 0) {
		const filterStage = globalVariables.stages.filter(item => item.stage === globalVariables.countStage);
		table.innerHTML = filterStage[filterStage.length - 1].content;
		globalVariables.navigationForName.pop();
		formatsNavigationString();
	}
	else {
		table.innerHTML = globalVariables.stages[0].content;
	}

	attachEventsToFolderButtons();
}

async function move(moveRootFolder) {

	let folderNameDefault = "root";
	let folderIdDefault = globalVariables.currentFolderIdDefault;

	try {
		validationFileIdAndFolderName(globalVariables.folderName || folderNameDefault);

		if (!moveRootFolder) {
			folderNameDefault = globalVariables.folderName;
			folderIdDefault = globalVariables.folderId;
		}

		if (globalVariables.folderOrFileMove === "file") {
			await FileStorageService.moveFile(userId, globalVariables.fileId, folderIdDefault, folderNameDefault);
		}
		else if (globalVariables.folderOrFileMove === "folder") {
			await FolderStructure.moveFolder(userId, globalVariables.folderIdMove, folderIdDefault);
		}
		
		closeMessageError();
		closeSelectMove();

		globalVariables.stages = [{	
		stage: 0, 
			content: await fillInUserFiles().then(globalVariables.countStage = 0)
		}];
	}
	catch (error) {
		openMessageError(error.message);
	}
}

function validationFileIdAndFolderName(folderName) {
	let message_error = (localStorage.getItem('lang') === "pt") 
		? "Nome da pasta são nulos"
		: "Folder Name is null";

	if (folderName === null || folderName === undefined) {
		throw new Error(message_error);
	}
}

function selectFolderForMove(tr) {

	globalVariables.folderOrFileMove = (tr.querySelector(".td-folder")) ? 'folder' : 'file';

	openSelectMove();

	const folder_structure_select = document.querySelector(".folder-structure-select-folder-for-move-file");
	const folders = folder_structure_select.querySelectorAll('.folder');

	folders.forEach(folder => {
		folder.addEventListener('click', () => {
			closeAllBackgroundColor();
			globalVariables.folderName = folder.getAttribute('folderName');
			globalVariables.folderId = folder.getAttribute('folderId');
			folder.classList.add("select-folder");
		});
	});

	if (globalVariables.folderOrFileMove === "file") {
		globalVariables.fileId = tr.querySelector(".td-file").getAttribute('fileId');
	}
	else {
		globalVariables.folderIdMove = tr.querySelector(".td-folder").getAttribute('folderId');
	}
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

	if (folderName === null && folderId === null || globalVariables.countStage === 0) {
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

		globalVariables.stages = [{	
			stage: 0, 
			content: await fillInUserFiles().then(globalVariables.countStage = 0) 
		}];
		closeNewFolder();
	}
	catch (error) {
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

async function upload(e) {

	const fileInput = document.getElementById("fileInput");

	fileInput.onchange = async (event) => {
		const file = event.target.files[0];

		if (!file) {
			openMessageError("Erro ao abrir arquivo");
			return;
		}

		const folderId = globalVariables.currentFolderId || globalVariables.currentFolderIdDefault;
		const folderName = globalVariables.currentFolderName || globalVariables.currentFolderNameDefault;

		const formData = new FormData();
		formData.append('file', file);

		await FileStorageService.upload(formData, userId, folderId, folderName);

		 if (globalVariables.countStage === 0) {
      await fillInUserFiles();
    } 
		else {
      const currentStage = globalVariables.stages.find(
        (s) => s.folderId === folderId && s.folderName === folderName
      );

      if (currentStage) {
        await updateFilesInFolder(currentStage);
      } 
			else {
        const stage = globalVariables.stages[globalVariables.stages.length - 1];
        await updateFilesInFolder(stage);
      }
    }

		fileInput.value = "";
	};

	fileInput.click();
}

async function updateFilesInFolder(currentStage) {
  try {
    const structure = await readJsonFromFolderStructureByUserId(userId);

    const folderUpdated = findFolderByIdAndName(
      structure.root.children, 
      currentStage.folderId,
      currentStage.folderName
    );

    if (!folderUpdated) {
      console.warn("Pasta não encontrada na estrutura atualizada.");
      return;
    }

    const { htmlFileBrowser } = updatesUserFiles(folderUpdated.children || []);
    const { htmlSidebar } = updatesUserFiles(structure.root.children);

    currentStage.content = htmlFileBrowser;
    currentStage.childrenData = JSON.stringify(folderUpdated.children || []);
    globalVariables.currentStage = folderUpdated;

    const index = globalVariables.stages.findIndex(s => s.stage === currentStage.stage);
    if (index !== -1) {
      globalVariables.stages[index] = {
        ...globalVariables.stages[index],
        content: htmlFileBrowser,
        childrenData: JSON.stringify(folderUpdated.children || []),
      };
    }

    const table = document.querySelector(".table");
    table.innerHTML = htmlFileBrowser;

    const folder_structure_html = document.querySelector(".folder-structure");
    const folder_structure_html_select_folder_for_move_file = document.querySelector(".folder-structure-select-folder-for-move-file");

    folder_structure_html.innerHTML = htmlSidebar;
    folder_structure_html_select_folder_for_move_file.innerHTML = htmlSidebar;

    globalVariables.currentFolderId = folderUpdated.id;
    globalVariables.currentFolderName = folderUpdated.name;

    const btnFolder = document.querySelector(`.td-folder[folderId="${currentStage.folderId}"]`)
      ?.closest(".btnOpenChildrenForFolderBrowser");

    if (btnFolder) {
      btnFolder.setAttribute('data-children', JSON.stringify(folderUpdated.children || []));
    }

    attachEventsToFolderButtons();
  } catch (error) {
    console.log(error);
  }
}


function findFolderByIdAndName(list, folderId, folderName) {
	for (const child of list) {
		if (child.type === "folder") {
			if (child.id === folderId && child.name === folderName) {
				return child;
			}

			if (Array.isArray(child.children)) {
				const found = findFolderByIdAndName(child.children, folderId, folderName);
				if (found) return found;
			}
		}
	}
	return null;
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
btnMoveFile.addEventListener('click', () => move(false));
btnMoveFileRootFolderDefault.addEventListener('click', () => move(true));
btnUpload.addEventListener('click', (e) => upload(e));

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
	globalVariables.stages = [{	stage: 0, content: await fillInUserFiles() }];
});