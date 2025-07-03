class AdminInterface {
    constructor() {
        this.currentEditingImage = null;
        this.init();
    }

    init() {
        this.checkAuth();
        this.bindEvents();
    }

    async checkAuth() {
        try {
            const response = await fetch(\"/api/check-auth\");
            const data = await response.json();
            
            if (data.authenticated) {
                this.showAdminInterface();
                this.loadData();
            } else {
                this.showLoginScreen();
            }
        } catch (error) {
            console.error(\"Erro ao verificar autenticação:\", error);
            this.showLoginScreen();
        }
    }

    showLoginScreen() {
        document.getElementById(\"login-screen\").style.display = \"flex\";
        document.getElementById(\"admin-interface\").style.display = \"none\";
    }

    showAdminInterface() {
        document.getElementById(\"login-screen\").style.display = \"none\";
        document.getElementById(\"admin-interface\").style.display = \"grid\";
    }

    bindEvents() {
        // Login
        document.getElementById(\"login-form\").addEventListener(\"submit\", (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Logout
        document.getElementById(\"logout-btn\").addEventListener(\"click\", () => {
            this.handleLogout();
        });

        // Navegação
        document.querySelectorAll(\".nav-item\").forEach(item => {
            item.addEventListener(\"click\", (e) => {
                e.preventDefault();
                this.switchSection(item.dataset.section);
            });
        });

        // Upload de arquivos
        const uploadBox = document.getElementById(\"upload-box\");
        const fileInput = document.getElementById(\"file-input\");

        uploadBox.addEventListener(\"click\", () => fileInput.click());
        uploadBox.addEventListener(\"dragover\", (e) => {
            e.preventDefault();
            uploadBox.classList.add(\"dragover\");
        });
        uploadBox.addEventListener(\"dragleave\", () => {
            uploadBox.classList.remove(\"dragover\");
        });
        uploadBox.addEventListener(\"drop\", (e) => {
            e.preventDefault();
            uploadBox.classList.remove(\"dragover\");
            this.handleFileUpload(e.dataTransfer.files);
        });

        fileInput.addEventListener(\"change\", (e) => {
            this.handleFileUpload(e.target.files);
        });

        // Formulário de sistema
        document.getElementById(\"system-form\").addEventListener(\"submit\", (e) => {
            e.preventDefault();
            this.handleAddSystem();
        });

        // Modal
        document.querySelectorAll(\".modal-close\").forEach(btn => {
            btn.addEventListener(\"click\", () => {
                this.closeModal();
            });
        });

        document.getElementById(\"save-image-btn\").addEventListener(\"click\", () => {
            this.saveImageEdit();
        });

        // TV Preview
        document.getElementById(\"refresh-preview\").addEventListener(\"click\", () => {
            this.refreshTVPreview();
        });

        document.getElementById(\"fullscreen-preview\").addEventListener(\"click\", () => {
            this.openFullscreenPreview();
        });
    }

    async handleLogin() {
        const password = document.getElementById(\"password\").value;
        const errorDiv = document.getElementById(\"login-error\");

        try {
            const response = await fetch(\"/api/login\", {
                method: \"POST\",
                headers: {
                    \"Content-Type\": \"application/json\",
                },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (data.success) {
                this.showAdminInterface();
                this.loadData();
                errorDiv.style.display = \"none\";
            } else {
                errorDiv.textContent = data.message;
                errorDiv.style.display = \"block\";
            }
        } catch (error) {
            errorDiv.textContent = \"Erro ao fazer login. Tente novamente.\";
            errorDiv.style.display = \"block\";
        }
    }

    async handleLogout() {
        try {
            await fetch(\"/api/logout\", { method: \"POST\" });
            this.showLoginScreen();
        } catch (error) {
            console.error(\"Erro ao fazer logout:\", error);
        }
    }

    switchSection(section) {
        // Atualizar navegação
        document.querySelectorAll(\".nav-item\").forEach(item => {
            item.classList.remove(\"active\");
        });
        document.querySelector(`[data-section=\"${section}\"]`).classList.add(\"active\");

        // Mostrar seção
        document.querySelectorAll(\".content-section\").forEach(section => {
            section.classList.remove(\"active\");
        });
        document.getElementById(`${section}-section`).classList.add(\"active\");

        // Load TV preview status if TV preview section is selected
        if (section === \"tv-preview\") {
            this.loadTVPreviewStatus();
        }
    }

    async loadData() {
        await Promise.all([
            this.loadImages(),
            this.loadSystems()
        ]);
    }

    async loadImages() {
        try {
            const response = await fetch(\"/api/images\");
            const images = await response.json();
            this.renderImages(images);
        } catch (error) {
            console.error(\"Erro ao carregar imagens:\", error);
        }
    }

    renderImages(images) {
        const container = document.getElementById(\"images-container\");
        
        if (images.length === 0) {
            container.innerHTML = \"<p class=\"empty-state\">Nenhuma imagem cadastrada. Faça upload de imagens para começar.</p>\";
            return;
        }

        container.innerHTML = images.map(image => `
            <div class=\"image-card\" data-id=\"${image.id}\">
                <img src=\"/api/uploads/${image.filename}\" alt=\"${image.original_name}\" class=\"image-preview\">
                <div class=\"image-info\">
                    <div class=\"image-name\">${image.original_name}</div>
                    <div class=\"image-details\">
                        <span>Ordem: ${image.order_index}</span>
                        <span>${image.duration}s</span>
                    </div>
                    <div class=\"image-actions\">
                        <button class=\"btn-small btn-edit\" onclick=\"adminInterface.editImage(${image.id}, ${image.duration})\">
                            <i class=\"fas fa-edit\"></i> Editar
                        </button>
                        <button class=\"btn-small btn-delete\" onclick=\"adminInterface.deleteImage(${image.id})\">
                            <i class=\"fas fa-trash\"></i> Excluir
                        </button>
                    </div>
                </div>
            </div>
        `).join(\"\");
    }

    async handleFileUpload(files) {
        const validFiles = Array.from(files).filter(file => {
            const validTypes = [\"image/jpeg\", \"image/jpg\", \"image/png\"];
            return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024; // 10MB
        });

        if (validFiles.length === 0) {
            alert(\"Por favor, selecione apenas arquivos JPG ou PNG com até 10MB.\");
            return;
        }

        this.showLoading();

        for (const file of validFiles) {
            try {
                const formData = new FormData();
                formData.append(\"file\", file);

                const response = await fetch(\"/api/images/upload\", {
                    method: \"POST\",
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(\"Erro no upload\");
                }
            } catch (error) {
                console.error(\"Erro no upload:\", error);
                alert(`Erro ao fazer upload de ${file.name}`);
            }
        }

        this.hideLoading();
        this.loadImages();
    }

    editImage(id, duration) {
        this.currentEditingImage = id;
        document.getElementById(\"edit-duration\").value = duration;
        document.getElementById(\"image-modal\").style.display = \"flex\";
    }

    async saveImageEdit() {
        if (!this.currentEditingImage) return;

        const duration = document.getElementById(\"edit-duration\").value;

        try {
            const response = await fetch(`/api/images/${this.currentEditingImage}`, {
                method: \"PUT\",
                headers: {
                    \"Content-Type\": \"application/json\",
                },
                body: JSON.stringify({ duration: parseInt(duration) })
            });

            if (response.ok) {
                this.closeModal();
                this.loadImages();
            } else {
                alert(\"Erro ao salvar alterações\");
            }
        } catch (error) {
            console.error(\"Erro ao salvar imagem:\", error);
            alert(\"Erro ao salvar alterações\");
        }
    }

    async deleteImage(id) {
        if (!confirm(\"Tem certeza que deseja excluir esta imagem?\")) return;

        try {
            const response = await fetch(`/api/images/${id}`, {
                method: \"DELETE\"
            });

            if (response.ok) {
                this.loadImages();
            } else {
                alert(\"Erro ao excluir imagem\");
            }
        } catch (error) {
            console.error(\"Erro ao excluir imagem:\", error);
            alert(\"Erro ao excluir imagem\");
        }
    }

    async loadSystems() {
        try {
            const response = await fetch(\"/api/system-links\");
            const systems = await response.json();
            this.renderSystems(systems);
        } catch (error) {
            console.error(\"Erro ao carregar sistemas:\", error);
        }
    }

    renderSystems(systems) {
        const container = document.getElementById(\"systems-container\");
        
        if (systems.length === 0) {
            container.innerHTML = \"<p class=\"empty-state\">Nenhum sistema cadastrado.</p>\";
            return;
        }

        container.innerHTML = systems.map(system => `
            <div class=\"system-item\" data-id=\"${system.id}\">
                <div class=\"system-info\">
                    <h4>${system.name}</h4>
                    <p>${system.url}</p>
                    <div class=\"system-meta\">
                        Duração: ${system.duration}s | Ordem: ${system.order_index}
                    </div>
                </div>
                <div class=\"system-actions\">
                    <button class=\"btn-small btn-edit\" onclick=\"adminInterface.editSystem(${system.id})\">
                        <i class=\"fas fa-edit\"></i>
                    </button>
                    <button class=\"btn-small btn-delete\" onclick=\"adminInterface.deleteSystem(${system.id})\">
                        <i class=\"fas fa-trash\"></i>
                    </button>
                </div>
            </div>
        `).join(\"\");
    }

    async handleAddSystem() {
        const name = document.getElementById(\"system-name\").value;
        const url = document.getElementById(\"system-url\").value;
        const duration = document.getElementById(\"system-duration\").value;

        try {
            const response = await fetch(\"/api/system-links\", {
                method: \"POST\",
                headers: {
                    \"Content-Type\": \"application/json\",
                },
                body: JSON.stringify({
                    name,
                    url,
                    duration: parseInt(duration)
                })
            });

            if (response.ok) {
                document.getElementById(\"system-form\").reset();
                document.getElementById(\"system-duration\").value = 30;
                this.loadSystems();
            } else {
                alert(\"Erro ao adicionar sistema\");
            }
        } catch (error) {
            console.error(\"Erro ao adicionar sistema:\", error);
            alert(\"Erro ao adicionar sistema\");
        }
    }

    async deleteSystem(id) {
        if (!confirm(\"Tem certeza que deseja excluir este sistema?\")) return;

        try {
            const response = await fetch(`/api/system-links/${id}`, {
                method: \"DELETE\"
            });

            if (response.ok) {
                this.loadSystems();
            } else {
                alert(\"Erro ao excluir sistema\");
            }
        } catch (error) {
            console.error(\"Erro ao excluir sistema:\", error);
            alert(\"Erro ao excluir sistema\");
        }
    }

    closeModal() {
        document.getElementById(\"image-modal\").style.display = \"none\";
        this.currentEditingImage = null;
    }

    showLoading() {
        document.getElementById(\"loading-overlay\").style.display = \"flex\";
    }

    hideLoading() {
        document.getElementById(\"loading-overlay\").style.display = \"none\";
    }

    refreshTVPreview() {
        const iframe = document.getElementById(\"tv-preview-iframe\");
        iframe.src = iframe.src;
    }

    openFullscreenPreview() {
        window.open(\"/display.html\", \"_blank\", \"fullscreen=yes,scrollbars=no,menubar=no,toolbar=no\");
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll(\".content-section\").forEach(section => {
            section.classList.remove(\"active\");
        });

        // Remove active class from all nav items
        document.querySelectorAll(\".nav-item\").forEach(item => {
            item.classList.remove(\"active\");
        });

        // Show selected section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add(\"active\");
        }

        // Add active class to clicked nav item
        const activeNavItem = document.querySelector(`[data-section=\"${sectionName}\"]`);
        if (activeNavItem) {
            activeNavItem.classList.add(\"active\");
        }

        // Load TV preview status if TV preview section is selected
        if (sectionName === \"tv-preview\") {
            this.loadTVPreviewStatus();
        }
    }

    async loadTVPreviewStatus() {
        try {
            const response = await fetch(\"/api/display/status\");
            const data = await response.json();
            
            if (data.success) {
                document.getElementById(\"current-content\").textContent = data.current_content || \"--\";
                document.getElementById(\"next-content\").textContent = data.next_content || \"--\";
                document.getElementById(\"time-remaining\").textContent = data.time_remaining || \"--\";
                document.getElementById(\"display-status\").textContent = data.status || \"Online\";
            }
        } catch (error) {
            console.error(\"Erro ao carregar status da TV:\", error);
        }
    }
}

// Inicializar quando a página carregar
let adminInterface;
document.addEventListener(\"DOMContentLoaded\", () => {
    adminInterface = new AdminInterface();
});

// Adicionar estilos para estados vazios
const additionalStyles = `
    .empty-state {
        text-align: center;
        color: #666;
        font-style: italic;
        padding: 2rem;
        background: #f8f9fa;
        border-radius: 8px;
        border: 1px dashed #dee2e6;
    }
`;

const styleSheet = document.createElement(\"style\");
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);


