document.addEventListener('DOMContentLoaded', function() {
    // Перехватываем все клики по ссылкам с якорями
    document.addEventListener('click', function(e) {
        // Проверяем, является ли элемент ссылкой с якорем
        if (e.target.tagName === 'A' && e.target.getAttribute('href') && e.target.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            
            const targetId = e.target.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const elementPosition = targetElement.offsetTop; // отнимаем 50px
                
                window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});