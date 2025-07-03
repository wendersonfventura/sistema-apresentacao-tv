class DisplaySystem {
    constructor() {
        this.images = [];
        this.systems = [];
        this.currentIndex = 0;
        this.currentType = 'image'; // 'image' ou 'system'
        this.isRunning = false;
        this.currentTimer = null;
        this.progressInterval = null;
        this.reconnectTimer = null;
        this.reconnectCountdown = 10;
        
        // Elementos DOM
        this.imageSlide = document.getElementById('image-slide');
        this.systemSlide = document.getElementById('system-slide');
        this.currentImage = document.getElementById('current-image');
        this.currentSystem = document.getElementById('current-system');
        this.currentSystemName = document.getElementById('current-system-name');
        this.loadingScreen = document.getElementById('loading-screen');
        this.errorScreen = document.getElementById('error-screen');
        this.progressFill = document.getElementById('progress-fill');
        this.currentSlideSpan = document.getElementById('current-slide');
        this.totalSlidesSpan = document.getElementById('total-slides');
        this.reconnectCountdownSpan = document.getElementById('reconnect-countdown');
        
        this.init();
    }

    async init() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        
        try {
            await this.loadContent();
            this.hideLoading();
            this.startPresentation();
        } catch (error) {
            console.error('Erro ao inicializar:', error);
            this.showError();
        }

        // Listeners para controle via teclado (para testes)
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowRight':
                case ' ':
                    this.nextSlide();
                    break;
                case 'ArrowLeft':
                    this.previousSlide();
                    break;
                case 'r':
                case 'R':
                    this.restart();
                    break;
                case 'f':
                case 'F':
                    this.toggleFullscreen();
                    break;
            }
        });

        // Detectar quando a página fica visível novamente
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.isRunning) {
                this.refreshCurrentContent();
            }
        });
    }

    async loadContent() {
        try {
            // Carregar imagens
            const imagesResponse = await fetch('/api/images/display');
            if (imagesResponse.ok) {
                this.images = await imagesResponse.json();
            }

            // Carregar sistemas
            const systemsResponse = await fetch('/api/system-links/display');
            if (systemsResponse.ok) {
                this.systems = await systemsResponse.json();
            }

            // Verificar se há conteúdo
            if (this.images.length === 0 && this.systems.length === 0) {
                throw new Error('Nenhum conteúdo encontrado');
            }

            this.updateSlideCounter();
            
        } catch (error) {
            console.error('Erro ao carregar conteúdo:', error);
            throw error;
        }
    }

    startPresentation() {
        if (this.images.length === 0 && this.systems.length === 0) {
            this.showError();
            return;
        }

        this.isRunning = true;
        this.currentIndex = 0;
        this.currentType = this.images.length > 0 ? 'image' : 'system';
        
        this.showCurrentSlide();
    }

    showCurrentSlide() {
        this.clearTimers();
        
        if (this.currentType === 'image' && this.images.length > 0) {
            this.showImage();
        } else if (this.currentType === 'system' && this.systems.length > 0) {
            this.showSystem();
        } else {
            this.nextSlide();
        }
    }

    showImage() {
        const image = this.images[this.currentIndex];
        if (!image) return;

        // Atualizar imagem
        this.currentImage.src = `/api/uploads/${image.filename}`;
        this.currentImage.alt = image.original_name;
        
        // Mostrar slide de imagem
        this.hideAllSlides();
        this.imageSlide.classList.add('active');
        
        // Atualizar contador
        this.updateSlideCounter();
        
        // Configurar timer para próximo slide
        const duration = (image.duration || 10) * 1000;
        this.startProgressBar(duration);
        
        this.currentTimer = setTimeout(() => {
            this.nextSlide();
        }, duration);
    }

    showSystem() {
        const system = this.systems[this.currentIndex];
        if (!system) return;

        // Atualizar sistema
        this.currentSystemName.textContent = system.name;
        
        // Mostrar loading no iframe
        this.systemSlide.classList.add('loading');
        
        // Configurar iframe
        this.currentSystem.src = system.url;
        
        // Mostrar slide de sistema
        this.hideAllSlides();
        this.systemSlide.classList.add('active');
        
        // Remover loading após um tempo
        setTimeout(() => {
            this.systemSlide.classList.remove('loading');
        }, 3000);
        
        // Configurar timer para próximo slide
        const duration = (system.duration || 30) * 1000;
        this.startProgressBar(duration);
        
        this.currentTimer = setTimeout(() => {
            this.nextSlide();
        }, duration);
    }

    nextSlide() {
        if (this.currentType === 'image') {
            this.currentIndex++;
            
            // Se chegou ao fim das imagens, vai para sistemas
            if (this.currentIndex >= this.images.length) {
                this.currentIndex = 0;
                this.currentType = 'system';
                
                // Se não há sistemas, volta para imagens
                if (this.systems.length === 0) {
                    this.currentType = 'image';
                }
            }
        } else {
            this.currentIndex++;
            
            // Se chegou ao fim dos sistemas, volta para imagens
            if (this.currentIndex >= this.systems.length) {
                this.currentIndex = 0;
                this.currentType = 'image';
                
                // Se não há imagens, fica nos sistemas
                if (this.images.length === 0) {
                    this.currentType = 'system';
                }
            }
        }
        
        this.showCurrentSlide();
    }

    previousSlide() {
        if (this.currentType === 'image') {
            this.currentIndex--;
            
            if (this.currentIndex < 0) {
                this.currentType = 'system';
                this.currentIndex = Math.max(0, this.systems.length - 1);
                
                if (this.systems.length === 0) {
                    this.currentType = 'image';
                    this.currentIndex = Math.max(0, this.images.length - 1);
                }
            }
        } else {
            this.currentIndex--;
            
            if (this.currentIndex < 0) {
                this.currentType = 'image';
                this.currentIndex = Math.max(0, this.images.length - 1);
                
                if (this.images.length === 0) {
                    this.currentType = 'system';
                    this.currentIndex = Math.max(0, this.systems.length - 1);
                }
            }
        }
        
        this.showCurrentSlide();
    }

    hideAllSlides() {
        this.imageSlide.classList.remove('active');
        this.systemSlide.classList.remove('active');
    }

    startProgressBar(duration) {
        this.progressFill.style.width = '0%';
        
        const startTime = Date.now();
        this.progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / duration) * 100, 100);
            this.progressFill.style.width = progress + '%';
            
            if (progress >= 100) {
                clearInterval(this.progressInterval);
            }
        }, 100);
    }

    clearTimers() {
        if (this.currentTimer) {
            clearTimeout(this.currentTimer);
            this.currentTimer = null;
        }
        
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
        
        this.progressFill.style.width = '0%';
    }

    updateSlideCounter() {
        const totalContent = this.images.length + this.systems.length;
        let currentPosition = 1;
        
        if (this.currentType === 'image') {
            currentPosition = this.currentIndex + 1;
        } else {
            currentPosition = this.images.length + this.currentIndex + 1;
        }
        
        this.currentSlideSpan.textContent = currentPosition;
        this.totalSlidesSpan.textContent = totalContent;
    }

    updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        const dateString = now.toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        const timeElement = document.getElementById('current-time');
        const dateElement = document.getElementById('current-date');
        
        if (timeElement) timeElement.textContent = timeString;
        if (dateElement) dateElement.textContent = dateString;
    }

    hideLoading() {
        this.loadingScreen.style.display = 'none';
    }

    showError() {
        this.hideLoading();
        this.errorScreen.style.display = 'flex';
        this.startReconnectTimer();
    }

    hideError() {
        this.errorScreen.style.display = 'none';
        if (this.reconnectTimer) {
            clearInterval(this.reconnectTimer);
            this.reconnectTimer = null;
        }
    }

    startReconnectTimer() {
        this.reconnectCountdown = 10;
        this.reconnectCountdownSpan.textContent = this.reconnectCountdown;
        
        this.reconnectTimer = setInterval(() => {
            this.reconnectCountdown--;
            this.reconnectCountdownSpan.textContent = this.reconnectCountdown;
            
            if (this.reconnectCountdown <= 0) {
                clearInterval(this.reconnectTimer);
                this.restart();
            }
        }, 1000);
    }

    async restart() {
        this.hideError();
        this.loadingScreen.style.display = 'flex';
        this.clearTimers();
        this.isRunning = false;
        
        try {
            await this.loadContent();
            this.hideLoading();
            this.startPresentation();
        } catch (error) {
            console.error('Erro ao reiniciar:', error);
            this.showError();
        }
    }

    refreshCurrentContent() {
        if (this.currentType === 'system') {
            // Recarregar iframe do sistema atual
            const system = this.systems[this.currentIndex];
            if (system) {
                this.currentSystem.src = system.url;
            }
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Erro ao entrar em tela cheia:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // Método para atualizar conteúdo em tempo real
    async refreshContent() {
        try {
            await this.loadContent();
        } catch (error) {
            console.error('Erro ao atualizar conteúdo:', error);
        }
    }
}

// Inicializar o sistema quando a página carregar
let displaySystem;
document.addEventListener('DOMContentLoaded', () => {
    displaySystem = new DisplaySystem();
    
    // Atualizar conteúdo a cada 5 minutos
    setInterval(() => {
        if (displaySystem) {
            displaySystem.refreshContent();
        }
    }, 5 * 60 * 1000);
});

// Entrar em tela cheia automaticamente (funciona apenas com interação do usuário)
document.addEventListener('click', () => {
    if (displaySystem && !document.fullscreenElement) {
        displaySystem.toggleFullscreen();
    }
}, { once: true });

