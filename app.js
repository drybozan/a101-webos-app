class A101TVBrowser {
    constructor() {
        this.focusableElements = [];
        this.currentFocusIndex = 0;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupRemoteControl();
            this.loadWebsite();
        });
    }

    loadWebsite() {
        // Siteyi iframe yerine direkt açıyoruz
        const webviewContainer = document.getElementById('webview-container');
        const iframe = document.createElement('iframe');
        iframe.src = 'https://www.a101.com.tr';
        iframe.id = 'webview';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        webviewContainer.appendChild(iframe);

        iframe.addEventListener('load', () => {
            console.log('A101 loaded');
            this.setupFocusableElements(iframe.contentWindow.document);
        });
    }

    setupFocusableElements(doc) {
        // Gezilebilecek elementleri al
        this.focusableElements = Array.from(doc.querySelectorAll('a, button, input'));
        if (this.focusableElements.length > 0) {
            this.currentFocusIndex = 0;
            this.updateFocus();
        }
    }

    setupRemoteControl() {
        document.addEventListener('keydown', (e) => {
            const step = 1;
            switch(e.keyCode) {
                case 37: // Sol
                    this.moveFocus(-step);
                    e.preventDefault();
                    break;
                case 39: // Sağ
                    this.moveFocus(step);
                    e.preventDefault();
                    break;
                case 13: // Enter
                    this.activateFocus();
                    e.preventDefault();
                    break;
                case 461: // Geri tuşu
                case 8:
                    window.history.back();
                    e.preventDefault();
                    break;
                case 417: // Home tuşu
                    window.location.href = 'https://www.a101.com.tr';
                    e.preventDefault();
                    break;
            }
        });
    }

    moveFocus(step) {
        if (this.focusableElements.length === 0) return;

        this.currentFocusIndex += step;
        if (this.currentFocusIndex < 0) this.currentFocusIndex = 0;
        if (this.currentFocusIndex >= this.focusableElements.length) {
            this.currentFocusIndex = this.focusableElements.length - 1;
        }

        this.updateFocus();
    }

    updateFocus() {
        this.focusableElements.forEach(el => el.classList.remove('tv-focus'));
        const el = this.focusableElements[this.currentFocusIndex];
        if (el) {
            el.classList.add('tv-focus');
            el.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    }

    activateFocus() {
        const el = this.focusableElements[this.currentFocusIndex];
        if (el) el.click();
    }
}

// Başlat
new A101TVBrowser();
