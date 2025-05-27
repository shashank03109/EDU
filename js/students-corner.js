/**
 * JavaScript for the Students Corner page features
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const materialsSection = document.getElementById('materials');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const pdfViewButtons = document.querySelectorAll('.view-pdf');
    const pdfModal = document.getElementById('pdfModal');
    const pdfViewer = document.getElementById('pdfViewer');
    const pdfTitle = document.getElementById('pdfTitle');
    const closeModal = document.querySelector('.close-modal');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const currentPageEl = document.getElementById('currentPage');
    const totalPagesEl = document.getElementById('totalPages');
    const zoomLevelSelect = document.getElementById('zoomLevel');
    const screenshotOverlay = document.getElementById('screenshotOverlay');
    const closeOverlayBtn = document.getElementById('closeOverlay');
    const protectionOverlay = document.getElementById('protectionOverlay');
    
    // PDF.js variables
    let pdfDoc = null;
    let currentPage = 1;
    let zoomLevel = 1;
    let rendering = false;
    let pageRendering = false;
    let pageNumPending = null;
    
    // Tab functionality
    function initTabs() {
        tabButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons and panes
                tabButtons.forEach(tab => tab.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Add active class to clicked button and corresponding pane
                this.classList.add('active');
                document.getElementById(this.getAttribute('data-tab')).classList.add('active');
            });
        });
    }
    
    // Show materials section by default
    materialsSection.classList.remove('hidden');
    
    // PDF Viewer functionality
    function initPDFViewer() {
        pdfViewButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const pdfUrl = this.getAttribute('data-pdf');
                const title = this.closest('.material-details').querySelector('h4').textContent;
                
                openPDF(pdfUrl, title);
            });
        });
        
        // Close modal
        if (closeModal) {
            closeModal.addEventListener('click', closePDFModal);
        }
        
        // Close when clicking outside the modal content
        window.addEventListener('click', function(event) {
            if (event.target === pdfModal) {
                closePDFModal();
            }
        });
        
        // Navigation buttons
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', function() {
                if (currentPage > 1) {
                    currentPage--;
                    queueRenderPage(currentPage);
                }
            });
        }
        
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', function() {
                if (currentPage < pdfDoc.numPages) {
                    currentPage++;
                    queueRenderPage(currentPage);
                }
            });
        }
        
        // Zoom level
        if (zoomLevelSelect) {
            zoomLevelSelect.addEventListener('change', function() {
                zoomLevel = parseFloat(this.value);
                queueRenderPage(currentPage);
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (pdfModal.style.display === 'block') {
                if (e.key === 'ArrowLeft' && currentPage > 1) {
                    currentPage--;
                    queueRenderPage(currentPage);
                } else if (e.key === 'ArrowRight' && pdfDoc && currentPage < pdfDoc.numPages) {
                    currentPage++;
                    queueRenderPage(currentPage);
                } else if (e.key === 'Escape') {
                    closePDFModal();
                }
            }
        });
    }
    
    // Open PDF
    function openPDF(url, title) {
        // Show PDF modal
        pdfModal.style.display = 'block';
        pdfTitle.textContent = title;
        
        // Show protection overlay
        protectionOverlay.classList.remove('hidden');
        
        // Load a sample PDF (in a real app, use the actual URL)
        // For demo purposes, we'll use a public sample PDF
        const samplePdfUrl = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';
        
        // Load PDF
        pdfjsLib.getDocument(samplePdfUrl).promise.then(pdf => {
            pdfDoc = pdf;
            totalPagesEl.textContent = pdf.numPages;
            
            // Initial render
            currentPage = 1;
            renderPage(currentPage);
            
            // Disable right-click on PDF viewer
            pdfViewer.addEventListener('contextmenu', e => {
                e.preventDefault();
                return false;
            });
        }).catch(error => {
            console.error('Error loading PDF:', error);
            pdfViewer.innerHTML = `<div class="pdf-error"><p>Error loading PDF. Please try again later.</p></div>`;
        });
    }
    
    // Render PDF page
    function renderPage(pageNum) {
        pageRendering = true;
        
        // Remove any existing canvases
        while (pdfViewer.firstChild) {
            pdfViewer.removeChild(pdfViewer.firstChild);
        }
        
        // Create a new canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        pdfViewer.appendChild(canvas);
        
        // Get page
        pdfDoc.getPage(pageNum).then(page => {
            // Set scale based on zoom level
            const viewport = page.getViewport({ scale: zoomLevel });
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            // Render PDF page
            const renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };
            
            const renderTask = page.render(renderContext);
            
            // Wait for rendering to finish
            renderTask.promise.then(() => {
                pageRendering = false;
                currentPageEl.textContent = pageNum;
                
                if (pageNumPending !== null) {
                    // New page rendering is pending
                    renderPage(pageNumPending);
                    pageNumPending = null;
                }
            });
        });
    }
    
    // Queue rendering to avoid multiple simultaneous renders
    function queueRenderPage(num) {
        if (pageRendering) {
            pageNumPending = num;
        } else {
            renderPage(num);
        }
    }
    
    // Close PDF modal
    function closePDFModal() {
        pdfModal.style.display = 'none';
        protectionOverlay.classList.add('hidden');
        pdfDoc = null;
    }
    
    // Anti-screenshot protections
    function initScreenshotProtection() {
        // Detect print attempts
        window.addEventListener('beforeprint', function(e) {
            if (pdfModal.style.display === 'block') {
                e.preventDefault();
                alert('Printing is disabled for this content.');
                return false;
            }
        });
        
        // Close screenshot overlay
        if (closeOverlayBtn) {
            closeOverlayBtn.addEventListener('click', function() {
                screenshotOverlay.classList.add('hidden');
            });
        }
        
        // Detect screen capture API (modern browsers)
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
            const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
            
            navigator.mediaDevices.getDisplayMedia = function(constraints) {
                if (pdfModal.style.display === 'block') {
                    screenshotOverlay.classList.remove('hidden');
                    return Promise.reject(new Error('Screen capture is disabled'));
                }
                return originalGetDisplayMedia.call(navigator.mediaDevices, constraints);
            };
        }
        
        // Detect keyboard shortcuts for screenshots
        document.addEventListener('keydown', function(e) {
            // Common screenshot combinations
            const isPrintScreen = e.key === 'PrintScreen';
            const isCtrlShiftI = e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i');
            const isCtrlShiftC = e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c');
            
            if (pdfModal.style.display === 'block' && (isPrintScreen || isCtrlShiftI || isCtrlShiftC)) {
                e.preventDefault();
                screenshotOverlay.classList.remove('hidden');
                return false;
            }
        });
    }
    
    // Initialize functions
    initTabs();
    initPDFViewer();
    initScreenshotProtection();
});