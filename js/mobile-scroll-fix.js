// Упрощенный фикс только для свайпа и касаний
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mobile scroll fix (light) initialized');
    
    // Только для мобильных
    if ('ontouchstart' in window) {
        
        // 1. Простой свайп для продолжения
        let touchStartY = 0;
        
        document.addEventListener('touchstart', function(e) {
            if (e.touches.length === 1) {
                touchStartY = e.touches[0].clientY;
            }
        }, { passive: true });
        
        document.addEventListener('touchend', function(e) {
            if (e.changedTouches.length === 1) {
                const touchEndY = e.changedTouches[0].clientY;
                const diffY = touchStartY - touchEndY;
                
                // Свайп вверх > 30px для продолжения
                if (diffY > 30) {
                    const continueIndicator = document.getElementById('continue-indicator');
                    if (continueIndicator && continueIndicator.classList.contains('visible')) {
                        continueIndicator.click();
                        
                        // Визуальная обратная связь
                        const feedback = document.createElement('div');
                        feedback.style.cssText = `
                            position: fixed;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            font-size: 2rem;
                            color: #9f7aea;
                            opacity: 0;
                            z-index: 10000;
                            animation: swipeFeedback 0.5s forwards;
                        `;
                        feedback.innerHTML = '↑';
                        document.body.appendChild(feedback);
                        
                        setTimeout(() => {
                            if (feedback.parentNode) {
                                feedback.parentNode.removeChild(feedback);
                            }
                        }, 500);
                    }
                }
            }
        }, { passive: true });
        
        // 2. Предотвращаем двойной тап для зума
        let lastTap = 0;
        document.addEventListener('touchend', function(e) {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            
            if (tapLength < 300 && tapLength > 0) {
                e.preventDefault();
            }
            
            lastTap = currentTime;
        }, { passive: false });
        
        console.log('Mobile scroll fix (light) applied');
    }
    
    // Добавляем CSS для анимации
    const style = document.createElement('style');
    style.textContent = `
        @keyframes swipeFeedback {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
            50% { opacity: 0.7; transform: translate(-50%, -60%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -70%) scale(0.5); }
        }
        
        /* Улучшаем кнопки на мобильных */
        .choice-btn, .control-btn, .menu-btn {
            touch-action: manipulation;
        }
        
        .choice-btn:active, .control-btn:active, .menu-btn:active {
            transform: scale(0.95);
            transition: transform 0.1s;
        }
    `;
    document.head.appendChild(style);
});