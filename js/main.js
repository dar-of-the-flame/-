// main.js - ИСПРАВЛЕННАЯ ВЕРСИЯ

class MainMenu {
    constructor() {
        console.log('MainMenu constructor called');
        this.init();
    }
    
    async init() {
        console.log('Initializing MainMenu...');
        this.initEventListeners();
        await this.checkContinue();
        await this.loadEndings();
    }
    
    initEventListeners() {
        console.log('Setting up event listeners...');
        
        const newGameBtn = document.getElementById('btn-new-game');
        if (newGameBtn) {
            newGameBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Начать игру clicked');
                this.startNewGame();
            });
        }
        
        const continueBtn = document.getElementById('btn-continue');
        if (continueBtn) {
            continueBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Продолжить clicked');
                this.continueGame();
            });
        }
        
        const galleryBtn = document.getElementById('btn-gallery');
        if (galleryBtn) {
            galleryBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Галерея clicked');
                this.showGallery();
            });
        }
        
        const settingsBtn = document.getElementById('btn-settings');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Настройки clicked');
                this.showSettings();
            });
        }
        
        const aboutBtn = document.getElementById('btn-about');
        if (aboutBtn) {
            aboutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Об игре clicked');
                this.showAbout();
            });
        }
        
        const closeSettings = document.getElementById('close-settings');
        const closeGallery = document.getElementById('close-gallery');
        const overlay = document.getElementById('modal-overlay');
        
        if (closeSettings) {
            closeSettings.addEventListener('click', () => this.closeModals());
        }
        if (closeGallery) {
            closeGallery.addEventListener('click', () => this.closeModals());
        }
        if (overlay) {
            overlay.addEventListener('click', () => this.closeModals());
        }
        
        console.log('Event listeners set up successfully');
    }
    
    async checkContinue() {
        try {
            const saved = localStorage.getItem('observer_save_last_autosave');
            const continueBtn = document.getElementById('btn-continue');
            const badge = document.getElementById('continue-badge');
            
            if (saved && continueBtn && badge) {
                continueBtn.classList.remove('disabled');
                const saveData = JSON.parse(saved);
                const date = new Date(saveData.timestamp).toLocaleDateString('ru-RU');
                badge.textContent = `Сохранено: ${date}`;
            } else if (continueBtn) {
                continueBtn.classList.add('disabled');
                const badge = document.getElementById('continue-badge');
                if (badge) badge.textContent = 'Нет сохранений';
            }
        } catch (error) {
            console.error('Error checking save:', error);
        }
    }
    
    async loadEndings() {
        try {
            // Загружаем концовки из localStorage
            const endings = JSON.parse(localStorage.getItem('observer_endings') || '[]');
            
            // Загружаем достижения для подсчета общего прогресса
            const achievements = JSON.parse(localStorage.getItem('observer_achievements') || '[]');
            
            const galleryBadge = document.getElementById('gallery-badge');
            
            if (galleryBadge) {
                // 6 концовок + 1 достижение (НАЧАЛО ПУТИ)
                const totalUnlocked = endings.length;
                galleryBadge.textContent = `${totalUnlocked}/7`;
            }
            
            this.updateGallery(endings);
        } catch (error) {
            console.error('Error loading endings:', error);
        }
    }
    
    updateGallery(endings) {
        const endingsGrid = document.getElementById('endings-grid');
        if (!endingsGrid) return;
        
        const allEndings = [
            { 
                id: 'careerist', 
                title: 'КАРЬЕРИСТ', 
                icon: '👔',
                description: 'Стать идеальным винтиком системы. Принять повышение и полностью раствориться в механизме Собора.',
                shortDesc: 'Стать частью репрессивной машины'
            },
            { 
                id: 'unknown_guard', 
                title: 'БЕЗЫМЯННЫЙ СТРАЖ', 
                icon: '👁️',
                description: 'Раствориться в бесконечности наблюдений. Перевестись в другой сектор и забыть обо всём.',
                shortDesc: 'Раствориться в наблюдениях'
            },
            { 
                id: 'exposed', 
                title: 'РАЗОБЛАЧЁННЫЙ', 
                icon: '🚫',
                description: 'Быть пойманным за нарушение протокола. Ваше сознание стирают за попытку помочь.',
                shortDesc: 'Быть пойманным системой'
            },
            { 
                id: 'rehabilitation', 
                title: 'ПЕРЕВОСПИТАНИЕ', 
                icon: '🔄',
                description: 'Подвергнуться принудительной коррекции личности. Вы становитесь послушным инструментом.',
                shortDesc: 'Пройти принудительную коррекцию'
            },
            { 
                id: 'arbiter_victim', 
                title: 'ЖЕРТВА АРБИТРА', 
                icon: '⚖️',
                description: 'Быть уничтоженным высшей инстанцией. Арбитр стирает ваше сознание без суда.',
                shortDesc: 'Быть уничтоженным Арбитром'
            },
            { 
                id: 'isolation', 
                title: 'ИЗОЛЯЦИЯ', 
                icon: '🔒',
                description: 'Добровольно запечатать себя навеки. Выбираете безопасность одиночества.',
                shortDesc: 'Добровольно запечатать себя'
            },
            { 
                id: 'traitor', 
                title: 'ПРЕДАТЕЛЬ', 
                icon: '🎭',
                description: 'Выдать тайну Собору. Предать доверие ради карьеры или безопасности.',
                shortDesc: 'Предать доверие ради системы'
            }
        ];
        
        endingsGrid.innerHTML = '';
        
        allEndings.forEach(ending => {
            const isUnlocked = endings.includes(ending.title);
            
            const card = document.createElement('div');
            card.className = `ending-card ${isUnlocked ? 'unlocked' : 'locked'}`;
            
            if (isUnlocked) {
                card.innerHTML = `
                    <div class="ending-icon">${ending.icon}</div>
                    <div class="ending-title">${ending.title}</div>
                    <div class="ending-description">${ending.shortDesc}</div>
                    <div class="ending-date">Разблокировано</div>
                `;
                
                card.addEventListener('click', () => {
                    this.showEndingDetails(ending);
                });
            } else {
                card.innerHTML = `
                    <div class="ending-icon">❓</div>
                    <div class="ending-title">???????</div>
                    <div class="ending-description">Концовка ещё не открыта</div>
                    <div class="ending-date">Заблокировано</div>
                `;
            }
            
            endingsGrid.appendChild(card);
        });
        
        // Добавляем достижение "НАЧАЛО ПУТИ" если оно разблокировано
        const achievements = JSON.parse(localStorage.getItem('observer_achievements') || '[]');
        const part1Completed = achievements.some(a => a.id === 'part1_completed');
        
        if (part1Completed) {
            const achievementCard = document.createElement('div');
            achievementCard.className = 'ending-card unlocked achievement-card';
            achievementCard.innerHTML = `
                <div class="ending-icon">🚀</div>
                <div class="ending-title">НАЧАЛО ПУТИ</div>
                <div class="ending-description">Завершить первую часть игры</div>
                <div class="ending-date">Достижение</div>
            `;
            endingsGrid.appendChild(achievementCard);
        }
    }
    
    startNewGame() {
        console.log('Starting new game...');
        // Очищаем текущее сохранение
        localStorage.removeItem('observer_save_last_autosave');
        localStorage.removeItem('observer_save');
        // Перенаправляем на игровую страницу
        window.location.href = 'game.html';
    }
    
    continueGame() {
        const saved = localStorage.getItem('observer_save_last_autosave');
        if (saved) {
            console.log('Continuing game...');
            window.location.href = 'game.html';
        } else {
            alert('Нет сохраненной игры. Начните новую игру.');
        }
    }
    
    showGallery() {
        console.log('Showing gallery...');
        const modal = document.getElementById('gallery-modal');
        const overlay = document.getElementById('modal-overlay');
        
        if (modal) modal.classList.add('active');
        if (overlay) overlay.classList.add('active');
    }
    
    showSettings() {
        console.log('Showing settings...');
        const modal = document.getElementById('settings-modal');
        const overlay = document.getElementById('modal-overlay');
        
        if (!modal || !overlay) return;
        
        const settings = this.loadSettings();
        
        const textSpeed = document.getElementById('text-speed');
        const autoScroll = document.getElementById('auto-scroll');
        const musicVolume = document.getElementById('music-volume');
        const sfxVolume = document.getElementById('sfx-volume');
        
        if (textSpeed) textSpeed.value = settings.textSpeed.toString();
        if (autoScroll) autoScroll.checked = settings.autoScroll;
        if (musicVolume) musicVolume.value = settings.musicVolume.toString();
        if (sfxVolume) sfxVolume.value = settings.sfxVolume.toString();
        
        modal.classList.add('active');
        overlay.classList.add('active');
        
        if (textSpeed) {
            textSpeed.addEventListener('change', (e) => {
                this.saveSettings({ textSpeed: parseInt(e.target.value) });
            });
        }
        
        if (autoScroll) {
            autoScroll.addEventListener('change', (e) => {
                this.saveSettings({ autoScroll: e.target.checked });
            });
        }
        
        if (musicVolume) {
            musicVolume.addEventListener('change', (e) => {
                this.saveSettings({ musicVolume: parseInt(e.target.value) });
            });
        }
        
        if (sfxVolume) {
            sfxVolume.addEventListener('change', (e) => {
                this.saveSettings({ sfxVolume: parseInt(e.target.value) });
            });
        }
    }
    
    showAbout() {
        console.log('Showing about...');
        alert(`Проект «НАБЛЮДАТЕЛЬ»
        
Часть первая: Шёпот в белизне

Текстовая новелла с выбором пути.
Ваши решения определяют судьбу Сони и вашу собственную.

© 2024 Все права защищены.

Игра создана в жанре интерактивной литературы.`);
    }
    
    showEndingDetails(ending) {
        alert(`${ending.icon} ${ending.title}\n\n${ending.description}`);
    }
    
    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        
        const overlay = document.getElementById('modal-overlay');
        if (overlay) overlay.classList.remove('active');
    }
    
    loadSettings() {
        const defaultSettings = {
            textSpeed: 5,
            autoScroll: true,
            musicVolume: 50,
            sfxVolume: 70
        };
        
        try {
            const saved = localStorage.getItem('observer_settings');
            return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
        } catch {
            return defaultSettings;
        }
    }
    
    saveSettings(settings) {
        const current = this.loadSettings();
        const newSettings = { ...current, ...settings };
        localStorage.setItem('observer_settings', JSON.stringify(newSettings));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    try {
        new MainMenu();
        console.log('MainMenu initialized successfully');
    } catch (error) {
        console.error('Error initializing MainMenu:', error);
    }
});