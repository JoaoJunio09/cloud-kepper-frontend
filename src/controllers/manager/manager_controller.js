import { FileStorageService } from "../../services/file_storage_service.js";
import { FolderStructure } from "../../services/folder_structure_service.js";

const btnToGoBack = document.querySelector("#btnToGoBack");

const userId = Number.parseInt(localStorage.getItem('userId'));

let countStage = 0;
let stages;

async function fillInUserFiles() {
	try {
		const structure = await readJsonFromFolderStructureByUserId(userId);
		const folder_structure_html = document.querySelector(".folder-structure");
		const table = document.querySelector(".table");
		
		const { htmlSidebar, htmlFileBrowser } = updatesUserFiles(structure.root.children);

		folder_structure_html.innerHTML = htmlSidebar;
		table.innerHTML = htmlFileBrowser;

		attachEventsToFolderButtons();

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
		<tr>
			<td>
				<div class="td-file" fileId="${fileId}">
					${imgFileType}
					${child.name}
				</div>
			</td>
			<td>9:45 AM</td>
			<td>
				<img src="src/assets/icons/elipse.png" alt="others">
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
		<div class="folder">
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
				<div class="td-folder">
					<img src="src/assets/images/folder_19026003.png" alt="" class="folder-style-browser">
					${child.name}
				</div>
			</td>
			<td>9:45 AM</td>
			<td>
				<img src="src/assets/icons/elipse.png" alt="others">
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

					table.innerHTML = "";
					table.innerHTML = htmlFileBrowser;

					countStage++;
					stages.push({ stage: countStage, content: htmlFileBrowser });

					attachEventsToFolderButtons();
				});
    });

		btnToGoBack.addEventListener('click', toGoBack);
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

function toGoBack() {
	countStage--;
	const table = document.querySelector(".table");

	table.innerHTML = stages[countStage].content;

	attachEventsToFolderButtons();
}

document.addEventListener('DOMContentLoaded', async () => {
	stages = [];
	
	fillInUserFiles();

	stages = [{ stage: 0, content: await fillInUserFiles() }];
});

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