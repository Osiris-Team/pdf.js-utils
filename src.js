/**
 * @param {number} pageNum - starts at 1, represents the page
 * @param {string} defaultContent - inital text content
 * @returns editor
 */
function addTextEditor(pageNum, defaultContent = "unset") {
    const pageEditorLayer = PDFViewerApplication.pdfViewer._pages[pageNum - 1].annotationEditorLayer.annotationEditorLayer
    pageEditorLayer.pasteEditor(pdfjsLib.AnnotationEditorType.FREETEXT, {}) // Open editor layer.
    // Workaround to update the mode, this creates an empty editor that gets removed later since it has no content

    let editor = pageEditorLayer.createAndAddNewEditor(
        { offsetX: 0, offsetY: 0 },
        /* isCentered = */ false
    );
    editor.setContentText = function (text) {
        console.log(editor.contentDiv)
        editor.contentDiv.innerHTML = "<div>" + defaultContent + "</div>"
    }
    editor.setContentText(defaultContent)

    pageEditorLayer.pasteEditor(0, {}) // Close editor layer
    return editor
}

function removeTextEditor(pageNum, editor) {
    const pageEditorLayer = PDFViewerApplication.pdfViewer._pages[pageNum - 1].annotationEditorLayer.annotationEditorLayer
    pageEditorLayer.pasteEditor(pdfjsLib.AnnotationEditorType.FREETEXT, {}) // Open editor layer.
    pageEditorLayer.remove(editor);
    pageEditorLayer.pasteEditor(0, {}) // Close editor layer
    return editor
}

/**
 * Seems like the only option since pageEditorLayer.#editors is a private field
 * thus make sure to keep track of the actual editor object if you really need it (gets returned by addTextEditor)
 * also sets/updates the editors page attribute.
 * @returns editors divs of all pages
 */
function getEditors() {
    let all = []
    let editorLayers = document.querySelectorAll("div.annotationEditorLayer")
    let pageNum = 1; // Assumes pages have ascending order, like any sane person would
    // and that there is one editorLayer per page (these both are usually the defaults),
    // otherwise pageNum will be wrong
    for (let layer of editorLayers) { 
        for (let editor of layer.children) {
            editor.setAttribute("page", pageNum);
            all.push(editor)
        }
        pageNum++;
    }
    return all
}

function waitForAnnotationEditorLayer() {
    return new Promise((resolve, reject) => {
        const interval = 100; // Check every 100ms
        const maxAttempts = 100; // Maximum attempts before rejecting the promise

        let attempts = 0;

        const checkLayer = () => {
            try {
                for(let page of PDFViewerApplication.pdfViewer._pages){
                    let pageEditorLayer = page.annotationEditorLayer.annotationEditorLayer;
                    if (pageEditorLayer) {
                        //resolve(pageEditorLayer);
                    } else {
                        throw new Error('Annotation editor layer is not available yet in page: '+ page);
                    }
                }
                resolve();
            } catch (error) {
                if (attempts >= maxAttempts) {
                    reject(new Error('Failed to get the annotation editor layer within the allowed attempts.'));
                } else {
                    attempts++;
                    setTimeout(checkLayer, interval);
                }
            }
        };

        checkLayer();
    });
}
