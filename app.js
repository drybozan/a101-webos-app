class A101BrowserApp {
    constructor() {
        this.webview = null;
        this.cursor = null;
        this.currentX = 0;
        this.currentY = 0;
        this.isLoaded = false;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupElements();
            this.setupEventListeners();
            this.setupRemoteControl();
        });
    }

    setupElements() {
        this.webview = document.getElementById('webview');
        this.cursor = document.getElementById('cursor');
        this.loading = document.getElementById('loading');
        
        // TV ekranı için başlangıç konumu
        this.currentX = window.innerWidth / 2;
        this.currentY = window.innerHeight / 2;
        this.updateCursor();
    }

    setupEventListeners() {
        // WebView yükleme olayları
        this.webview.addEventListener('load', () => {
            this.hideLoading();
            this.isLoaded = true;
            console.log('A101 website loaded successfully');
        });

        // Hata durumunda
        this.webview.addEventListener('error', () => {
            this.loading.textContent = 'Bağlantı hatası! Lütfen internet bağlantınızı kontrol edin.';
        });
    }

    setupRemoteControl() {
        document.addEventListener('keydown', (e) => {
            if (this.isLoaded) {
                this.handleRemoteKey(e);
            }
        });

        // WebOS hazır olduğunda
        if (window.webOSSystem) {
            document.addEventListener('webOSReady', () => {
                console.log('WebOS TV Ready - A101 App Started');
            });
        }
    }

    handleRemoteKey(event) {
        const step = 30; // TV için daha büyük adımlar
        
        switch(event.keyCode) {
            case 37: // Sol ok tuşu
                this.currentX = Math.max(15, this.currentX - step);
                this.updateCursor();
                this.highlightCursor();
                event.preventDefault();
                break;
                
            case 39: // Sağ ok tuşu
                this.currentX = Math.min(window.innerWidth - 15, this.currentX + step);
                this.updateCursor();
                this.highlightCursor();
                event.preventDefault();
                break;
                
            case 38: // Yukarı ok tuşu
                this.currentY = Math.max(15, this.currentY - step);
                this.updateCursor();
                this.highlightCursor();
                event.preventDefault();
                break;
                
            case 40: // Aşağı ok tuşu
                this.currentY = Math.min(window.innerHeight - 15, this.currentY + step);
                this.updateCursor();
                this.highlightCursor();
                event.preventDefault();
                break;
                
            case 13: // Enter/OK tuşu - Tıklama
                this.clickAtCursor();
                event.preventDefault();
                break;
                
            case 8: // Geri tuşu
            case 461: // WebOS geri tuşu
                try {
                    this.webview.contentWindow.history.back();
                } catch (e) {
                    console.log('Cannot go back');
                }
                event.preventDefault();
                break;
                
            case 417: // WebOS Home tuşu
                // Ana sayfaya dön
                this.webview.src = 'https://www.a101.com.tr';
                event.preventDefault();
                break;
        }
    }

    updateCursor() {
        this.cursor.style.left = this.currentX + 'px';
        this.cursor.style.top = this.currentY + 'px';
    }

    highlightCursor() {
        // İmleç hareket ettiğinde vurgula
        this.cursor.classList.add('active');
        setTimeout(() => {
            this.cursor.classList.remove('active');
        }, 200);
    }

    clickAtCursor() {
        try {
            // İframe içinde tıklama simülasyonu
            const iframe = this.webview;
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            
            // Koordinatları iframe'e göre ayarla
            const rect = iframe.getBoundingClientRect();
            const x = this.currentX - rect.left;
            const y = this.currentY - rect.top;
            
            // Tıklanacak elementi bul
            const element = iframeDoc.elementFromPoint(x, y);
            
            if (element) {
                // Tıklama efekti
                this.showClickEffect();
                
                // Çeşitli element türleri için farklı yaklaşımlar
                if (element.tagName === 'A' || element.onclick || element.classList.contains('clickable')) {
                    element.click();
                } else {
                    // Mouse event'i simüle et
                    const event = new MouseEvent('click', {
                        view: iframe.contentWindow,
                        bubbles: true,
                        cancelable: true,
                        clientX: x,
                        clientY: y
                    });
                    element.dispatchEvent(event);
                }
                
                console.log('Clicked on:', element.tagName, element.className);
            }
        } catch (error) {
            // Cross-origin kısıtlaması durumunda
            console.log('Cross-origin restriction, using postMessage');
            this.webview.contentWindow.postMessage({
                action: 'simulateClick',
                x: this.currentX,
                y: this.currentY
            }, 'https://www.a101.com.tr');
            this.showClickEffect();
        }
    }

    showClickEffect() {
        // Tıklama görsel efekti
        this.cursor.style.transform = 'scale(1.5)';
        this.cursor.style.background = '#59d8c3ff';
        
        setTimeout(() => {
            this.cursor.style.transform = 'scale(1)';
            this.cursor.style.background = '#807b78ff';
        }, 150);
    }

    hideLoading() {
        setTimeout(() => {
            this.loading.style.display = 'none';
        }, 1000); // 1 saniye sonra loading'i gizle
    }
}

// Uygulamayı başlat
new A101BrowserApp();

// WebOS sistem olayları
if (window.webOSSystem) {
    window.addEventListener('load', () => {
        if (window.webOSSystem.platformBack) {
            window.webOSSystem.platformBack.addEventListener('platformBack', () => {
                console.log('Platform back pressed');
            });
        }
    });
}