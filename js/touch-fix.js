// touch-fix.js - Исправление проблем с касанием на мобильных

document.addEventListener('DOMContentLoaded', function() {
    console.log('Touch fix initialized');
    
    // Предотвращаем zoom при двойном касании
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Предотвращаем контекстное меню при долгом касании
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
    
    // Исправляем :active состояние на iOS
    document.addEventListener('touchstart', function() {}, {passive: true});
    
    // Улучшаем реакцию на касания
    if ('ontouchstart' in window) {
        // Добавляем класс для стилей касания
        document.body.classList.add('touch-device');
        
        // Исправляем задержку на iOS
        document.addEventListener('touchstart', function(e) {
            if (e.target.tagName === 'BUTTON' || 
                e.target.tagName === 'A' || 
                e.target.closest('button') || 
                e.target.closest('a')) {
                e.target.classList.add('touched');
                setTimeout(() => {
                    if (e.target) e.target.classList.remove('touched');
                }, 300);
            }
        });
    }
    
    // Фиксируем высоту на мобильных устройствах
    function setVH() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', function() {
        setTimeout(setVH, 100);
    });
    
    // Добавляем улучшенный свайп
    let touchStartY = 0;
    let touchStartX = 0;
    let isSwiping = false;
    
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length === 1) {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
            isSwiping = true;
        }
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
        if (!isSwiping || e.touches.length !== 1) return;
        
        const currentY = e.touches[0].clientY;
        const diffY = touchStartY - currentY;
        
        // Свайп вверх более 30px для показа выборов
        if (diffY > 30) {
            // Проверяем, есть ли активный индикатор продолжения
            const continueIndicator = document.getElementById('continue-indicator');
            if (continueIndicator && continueIndicator.classList.contains('visible')) {
                // Эмулируем клик на индикатор
                continueIndicator.click();
                
                // Визуальная обратная связь
                const swipeFeedback = document.createElement('div');
                swipeFeedback.className = 'swipe-feedback';
                swipeFeedback.innerHTML = '↑';
                document.body.appendChild(swipeFeedback);
                
                setTimeout(() => {
                    if (swipeFeedback.parentNode === document.body) {
                        document.body.removeChild(swipeFeedback);
                    }
                }, 1000);
                
                isSwiping = false;
            }
        }
    }, { passive: true });
    
    document.addEventListener('touchend', function() {
        isSwiping = false;
    }, { passive: true });
    
    // Предотвращаем скролл страницы при взаимодействии с игрой
    document.addEventListener('touchmove', function(e) {
        // Если это интерактивный элемент, разрешаем скролл только внутри него
        if (e.target.closest('.text-container') || 
            e.target.closest('.choices-container') ||
            e.target.closest('.inventory-items')) {
            return;
        }
        
        // Иначе предотвращаем скролл страницы
        e.preventDefault();
    }, { passive: false });
    
    // Добавляем обработчик для кнопок выбора на мобильных
    document.addEventListener('click', function(e) {
        // Увеличиваем область клика для мобильных
        if ('ontouchstart' in window) {
            const button = e.target.closest('.choice-btn, .control-btn, .menu-btn');
            if (button) {
                button.classList.add('active-touch');
                setTimeout(() => {
                    button.classList.remove('active-touch');
                }, 200);
            }
        }
    });
    
    // Исправляем высоту на iOS Safari при загрузке
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        setTimeout(() => {
            document.documentElement.style.height = window.innerHeight + 'px';
            document.body.style.height = window.innerHeight + 'px';
        }, 100);
    }
});