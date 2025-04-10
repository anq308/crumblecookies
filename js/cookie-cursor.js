// Эффект рассыпающихся печенек за курсором
const cookieCursor = {
    // Настройки
    settings: {
        maxCookies: 7,         // Максимальное количество печенек на экране
        cookieSize: 24,         // Размер печенек в пикселях
        fallSpeed: 3,           // Скорость падения
        cookieLifetime: 2000,   // Время жизни печеньки в миллисекундах
        spawnDelay: 100,         // Задержка между созданием печенек в миллисекундах
        container: null          // Контейнер для печенек (будет создан при инициализации)
    },

    // Массив для хранения активных печенек
    cookies: [],

    // Время последнего создания печеньки
    lastSpawnTime: 0,

    // Массив с типами печенек (пути к SVG-файлам)
    cookieTypes: [
        'img/mini-cookie-1.svg',
        'img/mini-cookie-2.svg',
        'img/mini-cookie-3.svg',
        'img/mini-cookie-4.svg'
    ],
    
    // Массив с большими печеньками (не используются для эффекта курсора)
    bigCookieTypes: [
        'img/cookie-base-classic.svg',
        'img/cookie-base-chocolate.svg',
        'img/cookie-base-coconut.svg',
        'img/cookie-base-oatmeal.svg',
        'img/cookie-base-almond.svg'
    ],

    // Инициализация эффекта
    init: function() {
        // Создаем контейнер для печенек
        const container = document.createElement('div');
        container.className = 'cookie-cursor-container';
        document.body.appendChild(container);
        this.settings.container = container;
        
        // Предзагружаем все изображения печенек
        this.preloadImages();
        
        // Отслеживаем движение мыши
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        
        // Запускаем анимацию
        this.animate();
        
        console.log('Cookie cursor effect initialized');
    },
    
    // Предзагрузка изображений для избежания проблем с отображением
    preloadImages: function() {
        // Создаем скрытый контейнер для предзагрузки
        const preloadContainer = document.createElement('div');
        preloadContainer.style.position = 'absolute';
        preloadContainer.style.width = '0';
        preloadContainer.style.height = '0';
        preloadContainer.style.overflow = 'hidden';
        preloadContainer.style.visibility = 'hidden';
        document.body.appendChild(preloadContainer);
        
        // Предзагружаем все типы печенек
        this.cookieTypes.forEach(type => {
            const img = document.createElement('img');
            img.src = type;
            preloadContainer.appendChild(img);
        });
    },

    // Обработчик движения мыши
    handleMouseMove: function(event) {
        const currentTime = Date.now();
        
        // Проверяем, прошло ли достаточно времени с момента последнего создания печеньки
        if (currentTime - this.lastSpawnTime > this.settings.spawnDelay) {
            // Создаем несколько печенек сразу для эффекта "рассыпания"
            const numCookies = Math.floor(1 + Math.random() * 2); // 1-3 печеньки за раз
            for (let i = 0; i < numCookies; i++) {
                // Добавляем небольшое смещение для каждой печеньки
                const offsetX = (Math.random() - 0.5) * 10;
                const offsetY = (Math.random() - 0.5) * 10;
                this.createCookie(event.clientX + offsetX, event.clientY + offsetY);
            }
            this.lastSpawnTime = currentTime;
        }
    },

    // Создание новой печеньки
    createCookie: function(x, y) {
        // Если достигнут лимит печенек, удаляем самую старую
        if (this.cookies.length >= this.settings.maxCookies) {
            const oldestCookie = this.cookies.shift();
            if (oldestCookie.element && oldestCookie.element.parentNode) {
                oldestCookie.element.parentNode.removeChild(oldestCookie.element);
            }
        }

        // Создаем элемент печеньки
        const cookieElement = document.createElement('img');
        cookieElement.className = 'cookie-cursor-item';
        
        // Выбираем случайный тип печеньки
        const randomType = this.cookieTypes[Math.floor(Math.random() * this.cookieTypes.length)];
        cookieElement.src = randomType;
        
        // Предзагрузка изображения для устранения проблем с отображением
        cookieElement.onload = () => {
            cookieElement.style.visibility = 'visible';
        };
        cookieElement.style.visibility = 'hidden';
        
        // Устанавливаем стили
        cookieElement.style.left = (x - this.settings.cookieSize / 2) + 'px';
        cookieElement.style.top = (y - this.settings.cookieSize / 2) + 'px';
        cookieElement.style.width = this.settings.cookieSize + 'px';
        cookieElement.style.height = this.settings.cookieSize + 'px';
        cookieElement.style.opacity = '0.8';
        cookieElement.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
        cookieElement.style.transition = 'opacity ' + (this.settings.cookieLifetime / 2) + 'ms ease-out';
        // Добавляем случайный размер для разнообразия
        const randomSize = 0.5 + Math.random() * 0.6; // от 50% до 110% от базового размера
        cookieElement.style.transform = `rotate(${Math.random() * 360}deg) scale(${randomSize})`;
        // Добавляем тень для объемности
        cookieElement.style.filter = 'drop-shadow(1px 2px 2px rgba(0, 0, 0, 0.2))';
        // Добавляем случайную задержку анимации
        cookieElement.style.animationDelay = (Math.random() * 0.5) + 's';
        // Добавляем случайное вращение во время падения
        cookieElement.style.transition = `opacity ${this.settings.cookieLifetime / 2}ms ease-out, transform ${this.settings.cookieLifetime}ms ease-out`;
        
        // Добавляем печеньку на страницу
        this.settings.container.appendChild(cookieElement);
        
        // Создаем объект печеньки с данными для анимации
        const cookie = {
            element: cookieElement,
            x: x - this.settings.cookieSize / 2,
            y: y - this.settings.cookieSize / 2,
            speedX: (Math.random() - 0.5) * 2, // Случайное горизонтальное движение
            speedY: 1 + Math.random() * this.settings.fallSpeed, // Скорость падения
            rotation: Math.random() * 360, // Начальный угол поворота
            rotationSpeed: (Math.random() - 0.5) * 10, // Скорость вращения
            createdAt: Date.now() // Время создания
        };
        
        // Добавляем печеньку в массив
        this.cookies.push(cookie);
        
        // Устанавливаем таймер для удаления печеньки
        setTimeout(() => {
            if (cookieElement.parentNode) {
                cookieElement.style.opacity = '0';
                setTimeout(() => {
                    if (cookieElement.parentNode) {
                        cookieElement.parentNode.removeChild(cookieElement);
                    }
                    // Удаляем печеньку из массива
                    const index = this.cookies.indexOf(cookie);
                    if (index !== -1) {
                        this.cookies.splice(index, 1);
                    }
                }, this.settings.cookieLifetime / 2);
            }
        }, this.settings.cookieLifetime / 2);
    },

    // Анимация движения печенек
    animate: function() {
        // Обновляем положение каждой печеньки
        for (let i = 0; i < this.cookies.length; i++) {
            const cookie = this.cookies[i];
            
            // Обновляем координаты
            cookie.x += cookie.speedX;
            cookie.y += cookie.speedY;
            cookie.rotation += cookie.rotationSpeed;
            
            // Обновляем стили
            cookie.element.style.left = cookie.x + 'px';
            cookie.element.style.top = cookie.y + 'px';
            cookie.element.style.transform = 'rotate(' + cookie.rotation + 'deg)';
            
            // Постепенно уменьшаем прозрачность в зависимости от времени жизни
            const age = Date.now() - cookie.createdAt;
            if (age > this.settings.cookieLifetime / 2) {
                const opacity = 1 - (age - this.settings.cookieLifetime / 2) / (this.settings.cookieLifetime / 2);
                cookie.element.style.opacity = Math.max(0, opacity);
            }
        }
        
        // Продолжаем анимацию
        requestAnimationFrame(this.animate.bind(this));
    }
};

// Инициализируем эффект при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    cookieCursor.init();
});
