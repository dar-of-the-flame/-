// browser-bar-fix.js - Исправление для нижней панели браузера на мобильных
document.addEventListener('DOMContentLoaded', function() {
    console.log('Browser bar fix initialized');
    
    // Определяем iOS и Android
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isMobile = isIOS || isAndroid;
    
    if (!isMobile) return;
    
    // 1. Функция для установки правильной высоты
    function setAppHeight() {
        const vh = window.innerHeight * 0.01;
        
        // Устанавливаем CSS переменную для высоты
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Для iOS Safari
        if (isIOS) {
            // Используем innerHeight для точной высоты видимой области
            const docHeight = window.innerHeight;
            document.documentElement.style.height = docHeight + 'px';
            document.body.style.height = docHeight + 'px';
            
            // Обновляем высоту игрового контейнера
            const gameContainer = document.querySelector('.game-container');
            if (gameContainer) {
                gameContainer.style.height = docHeight + 'px';
            }
        }
        
        console.log('App height set to:', window.innerHeight, 'px');
    }
    
    // 2. Функция для фиксации высоты после изменения URL бара
    function lockHeight() {
        // Небольшая задержка для стабилизации
        setTimeout(() => {
            setAppHeight();
            
            // Для iOS - дополнительная фиксация через 100мс
            if (isIOS) {
                setTimeout(setAppHeight, 100);
                setTimeout(setAppHeight, 300);
            }
        }, 50);
    }
    
    // 3. Устанавливаем начальную высоту
    setAppHeight();
    
    // 4. Обработчики событий
    window.addEventListener('resize', function() {
        if (isIOS) {
            // На iOS resize срабатывает при появлении/скрытии панели
            setTimeout(lockHeight, 100);
        } else {
            setAppHeight();
        }
    });
    
    window.addEventListener('orientationchange', function() {
        setTimeout(lockHeight, 100);
    });
    
    // 5. Обработчик для scroll, чтобы панель не скрывалась
    let lastScrollTop = 0;
    let isScrolling = false;
    
    window.addEventListener('scroll', function() {
        if (!isMobile) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Если скролл вниз, пытаемся предотвратить скрытие панели
        if (scrollTop > lastScrollTop && scrollTop > 10) {
            // Пытаемся удержать позицию
            window.scrollTo(0, lastScrollTop);
        }
        
        lastScrollTop = scrollTop;
    }, { passive: true });
    
    // 6. Предотвращаем поведение по умолчанию для касаний
    document.addEventListener('touchstart', function(e) {
        // Если это начало касания, фиксируем высоту
        lockHeight();
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        // Фиксируем высоту после касания
        setTimeout(lockHeight, 200);
    }, { passive: true });
    
    // 7. Для модальных окон и галереи - дополнительный фикс
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.classList.contains('active')) {
                    // При открытии модального окна фиксируем высоту
                    setTimeout(lockHeight, 100);
                }
            }
        });
    });
    
    // Наблюдаем за модальными окнами
    const modals = document.querySelectorAll('.modal, .game-menu, .save-modal, .inventory-panel');
    modals.forEach(modal => {
        observer.observe(modal, { attributes: true });
    });
    
    // 8. Функция для принудительной стабилизации
    function stabilizeLayout() {
        // Прокручиваем немного и возвращаемся
        if (window.pageYOffset > 0) {
            window.scrollTo(0, 1);
            setTimeout(() => window.scrollTo(0, 0), 50);
        } else {
            window.scrollTo(0, 1);
            setTimeout(() => window.scrollTo(0, 0), 50);
        }
        
        // Фиксируем высоту
        setTimeout(lockHeight, 100);
    }
    
    // 9. Инициализация через задержку
    setTimeout(() => {
        setAppHeight();
        stabilizeLayout();
    }, 500);
    
    // 10. Дополнительная стабилизация при взаимодействии с интерфейсом
    document.addEventListener('click', function(e) {
        if (isMobile) {
            setTimeout(stabilizeLayout, 100);
        }
    });
    
    // 11. Индикатор для отладки
    const debugDiv = document.createElement('div');
    debugDiv.style.cssText = `
        position: fixed;
        top: 0;
        right: 0;
        background: rgba(0,0,0,0.7);
        color: white;
        padding: 5px;
        font-size: 10px;
        z-index: 9999;
        display: none;
    `;
    debugDiv.id = 'browser-bar-debug';
    debugDiv.innerHTML = `h: ${window.innerHeight}px`;
    document.body.appendChild(debugDiv);
    
    // Показываем отладку в dev режиме
    if (window.location.href.includes('debug')) {
        debugDiv.style.display = 'block';
        setInterval(() => {
            debugDiv.innerHTML = `
                h: ${window.innerHeight}px<br>
                w: ${window.innerWidth}px<br>
                iOS: ${isIOS}<br>
                Android: ${isAndroid}
            `;
        }, 1000);
    }
    
    console.log('Browser bar fix applied for:', isIOS ? 'iOS' : isAndroid ? 'Android' : 'desktop');
});