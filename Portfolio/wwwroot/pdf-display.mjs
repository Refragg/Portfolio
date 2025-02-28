import * as pdfjsLib from '/pdfjs/pdf.mjs';
import {TextLayer} from "/pdfjs/pdf.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.mjs';

let url = null;
let scale = 2.0;
let canvas = null;
let textLayer = null;
let ctx = null;

let pageNumElements = null;
let pageCountElements = null;

let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;

let viewerStyleSheetEnabled = false;

export function setPdfOptions(pdfUrl, pdfScale, canvasElement, textLayerElement, previousButtons, nextButtons, pdfPageNumElements, pdfPageCountElements) {
    url = pdfUrl;
    scale = pdfScale;
    canvas = canvasElement;
    textLayer = textLayerElement;
    ctx = canvas.getContext('2d');
    pageNumElements = pdfPageNumElements;
    pageCountElements = pdfPageCountElements;

    console.log(previousButtons)
    
    for (const previousButton of previousButtons)
        previousButton.addEventListener('click', onPrevPage);

    for (const nextButton of nextButtons)
        nextButton.addEventListener('click', onNextPage);

    pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {
        pdfDoc = pdfDoc_;
        for (const pageCountElement of pageCountElements)
            pageCountElement.textContent = pdfDoc.numPages;

        // Initial/first page rendering
        renderPage(pageNum);
    });

    addEventListener("resize", (event) => {
        if (textLayer === null)
            return;

        pdfDoc.getPage(pageNum).then(function (page) {
            renderTextLayer(page);
        });
    });

    document.getElementById('toggler').addEventListener('click', function () {
        setTimeout(function () { recomputeTextLayerPosition() }, 1000);
    })
}

function recomputeTextLayerPosition() {
    if (textLayer === null)
        return;

    textLayer.style.left = (canvas.offsetLeft + 100)  + 'px';
    textLayer.style.top = canvas.offsetTop + 'px';
}

/**
 * Get page info from document, resize canvas accordingly, and render page.
 * @param num Page number.
 */
function renderPage(num) {
    pageRendering = true;
    
    // Using promise to fetch the page
    pdfDoc.getPage(num).then(function(page) {
        let viewport = page.getViewport({scale: scale});
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        let renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        let renderTask = page.render(renderContext);

        // Wait for rendering to finish
        renderTask.promise.then(function() {
            canvas.classList.add('pdf-ready');
            canvas.setAttribute('data-aos', 'fade-left');
            pageRendering = false;
            if (pageNumPending !== null) {
                // New page rendering is pending
                renderPage(pageNumPending);
                pageNumPending = null;
            }
            return page.getTextContent();
        }).then(function (textContent) {
            renderTextLayer(page);
        });
    });

    // Update page counters
    for (const pageNumElement of pageNumElements)
        pageNumElement.textContent = num;
}

function renderTextLayer(page) {
    if (textLayer === null)
        return;
    
    let viewport = page.getViewport({ scale: 1.0 })
    
    // Clear HTML for text layer
    textLayer.innerHTML = '';

    // Assign the CSS created to the text-layer element
    textLayer.style.setProperty('--scale-factor', canvas.clientWidth / viewport.width);
    textLayer.style.left = (canvas.offsetLeft + 100)  + 'px';
    textLayer.style.top = canvas.offsetTop + 'px';

    // Pass the data to the method for rendering of text over the pdf canvas.
    const textLayerRenderer = new TextLayer({
        textContentSource: page.streamTextContent(),
        viewport: viewport,
        container: textLayer,
    })
    textLayerRenderer.render();
    textLayer.style.width = canvas.clientWidth + 'px';
    textLayer.style.height = canvas.clientHeight + 'px';
    
    // Enable the pdf-viewer stylesheet (we disable it because this stylesheets disables all other input until the PDF file is loaded)
    if (!viewerStyleSheetEnabled) {
        let linkElement = document.getElementById('pdf-viewer-css')
        linkElement.disabled = false;
        viewerStyleSheetEnabled = true;
    }
}

/**
 * If another page rendering in progress, waits until the rendering is
 * finised. Otherwise, executes rendering immediately.
 */
function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

/**
 * Displays previous page.
 */
function onPrevPage() {
    if (pageNum <= 1)
        return;
    
    pageNum--;
    queueRenderPage(pageNum);
}

/**
 * Displays next page.
 */
function onNextPage() {
    if (pageNum >= pdfDoc.numPages)
        return;
    
    pageNum++;
    queueRenderPage(pageNum);
}
