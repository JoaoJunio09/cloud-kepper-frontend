import { FolderStructure } from "../../services/folder_structure_service.js";

const userId = Number.parseInt(localStorage.getItem('userId'));

document.addEventListener('DOMContentLoaded', () => {
	fillInUserFiles();	
});

async function fillInUserFiles() {
	try {
		const structure = await readJsonFromFolderStructureByUserId(userId);
		const folder_structure_html = document.querySelector(".folder-structure");
		console.log(structure.root.children);
		
		folder_structure_html.innerHTML = updatesUserFiles(structure.root.children);

		attachEventsToFolderButtons();
	}
	catch (error) {
		console.log(error);
	}
}

function updatesUserFiles(list) {

	let html = "";

	list.forEach(child => {
		if (child.type === "folder") {
			html += createElementHTMLFolder(child);
		}
		else if (child.type === "file") {
			html += createElementHTMLFile(child);
		}
	});
	
	return html;
}

function createElementHTMLFile(child) {

	let imgFileType = "";

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
			imgFileType = "<img src='src/assets/icons/arquivo (1).png' alt='file-type'>";
	}

	return `
		<div class="file">
			${imgFileType}
			<p>${child.name}</p>
		</div>
	`;
}

function createElementHTMLFolder(child) {

	let childrenHtml = "";

	if (child.children && child.children.length > 0) {
		childrenHtml = `
			<div class="child">
				${updatesUserFiles(child.children)}
			</div>
		`;
	}

	return `
		<div class="folder">
			<img src="src/assets/images/folder_19026003.png" alt="">
			<p>${child.name}</p>
			<div>
				<img src="src/assets/icons/down-arrow.png" alt="" class="btnOpenChildrenForFolder">
			</div>
		</div>
		${childrenHtml}
	`;
}

async function readJsonFromFolderStructureByUserId(id) {
	const jsonObject = await FolderStructure.getFolderStructure(id);
	return jsonObject.structure;
}

function attachEventsToFolderButtons() {
    const btnsOpenChild = document.querySelectorAll(".btnOpenChildrenForFolder");

    btnsOpenChild.forEach(btn => {
        btn.addEventListener('click', (e) => {
					const folder = btn.closest(".folder");
					const childHtml = folder.nextElementSibling;

					if (childHtml) {
						childHtml.classList.toggle("show-child");
						btn.style.transform = childHtml.classList.contains("show-child")
							? "rotate(180deg)"
							: "rotate(0deg)";
					}
				})
    });
}
