document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Кнопка 'Попробовать сейчас' - прокрутка к разделу заказа
    const tryNowBtn = document.getElementById('try-now-btn');
    const orderSectionElement = document.getElementById('order');
    
    if (tryNowBtn && orderSectionElement) {
        tryNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            orderSectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // Initialize Swiper for gallery
    const swiper = new Swiper('.gallery-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        coverflowEffect: {
            rotate: 30,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
        },
        pagination: {
            el: '.gallery-pagination',
            clickable: true,
            dynamicBullets: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '"></span>';
            }
        },
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
        },
        on: {
            init: function() {
                console.log('Gallery slider initialized');
            },
            slideChange: function() {
                // Animate the current slide caption
                const activeSlide = this.slides[this.activeIndex];
                if (activeSlide) {
                    const caption = activeSlide.querySelector('.gallery__caption');
                    if (caption) {
                        caption.style.animation = 'none';
                        setTimeout(() => {
                            caption.style.animation = 'fadeInUp 0.5s forwards';
                        }, 10);
                    }
                }
            }
        }
    });

    // Parallax effect for hero section
    const heroImage = document.querySelector('.hero__image');
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        if (heroImage) {
            heroImage.style.transform = `scale(1.1) translateY(${scrollPosition * 0.2}px)`;
        }
    });

    // Falling crumbs animation in hero section
    createCrumbs();

    // Cookie crunch sound on hero title click
    const heroTitle = document.querySelector('.hero__title');
    if (heroTitle) {
        heroTitle.addEventListener('click', playCrunchSound);
    }

    // Quantity controls in order form
    const quantityBtns = document.querySelectorAll('.quantity-btn');
    quantityBtns.forEach(btn => {
        btn.addEventListener('click', handleQuantityChange);
    });

    // Add event listener to 'Cookie of the Month' add to cart button
    const cookieMonthButton = document.querySelector('.cookie-month__button');
    if (cookieMonthButton) {
        cookieMonthButton.addEventListener('click', function() {
            const flavorName = this.getAttribute('data-name');
            const price = parseInt(this.getAttribute('data-price'));
            addToCartSpecial(flavorName, price);
        });
    }

    // Phone number mask
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhoneNumber);
    }

    // Form submission
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', handleFormSubmit);
    }

    // Cart functionality
    const cartButton = document.querySelector('.cart__button');
    const cartPanel = document.querySelector('.cart__panel');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const paymentModal = document.getElementById('paymentModal');
    const paymentModalClose = paymentModal?.querySelector('.modal__close');
    
    if (cartButton && cartPanel) {
        cartButton.addEventListener('click', toggleCart);
        
        document.addEventListener('click', function(event) {
            if (!cartPanel.contains(event.target) && !cartButton.contains(event.target) && cartPanel.classList.contains('active')) {
                cartPanel.classList.remove('active');
            }
        });
    }
    
    // Удаляем старые обработчики, чтобы избежать дублирования
    document.querySelectorAll('.flavor-card__button').forEach(button => {
        button.removeEventListener('click', addToCart);
        // Добавляем новый обработчик
        button.addEventListener('click', addToCart, { once: false });
    });
    
    document.querySelectorAll('.cookie-month__button').forEach(button => {
        // Удаляем все обработчики с кнопки
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Добавляем новый обработчик
        newButton.addEventListener('click', function() {
            const flavorName = this.getAttribute('data-name');
            const price = parseInt(this.getAttribute('data-price'));
            addToCartSpecial(flavorName, price);
        }, { once: false });
    });
    
    // Добавляем обработчик для кнопки оформления заказа
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', openPaymentModal);
    }
    
    // Закрытие модального окна оплаты
    if (paymentModalClose) {
        paymentModalClose.addEventListener('click', function() {
            paymentModal.classList.remove('active');
        });
        
        // Закрытие по клику вне содержимого
        paymentModal.addEventListener('click', function(event) {
            if (event.target === paymentModal) {
                paymentModal.classList.remove('active');
            }
        });
    }

    // Gallery modal
    const galleryImages = document.querySelectorAll('.swiper-slide img');
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.querySelector('.modal__image');
    const modalClose = document.querySelector('.modal__close');
    
    if (galleryImages && imageModal && modalImage) {
        galleryImages.forEach(img => {
            img.addEventListener('click', function() {
                modalImage.src = this.src;
                imageModal.classList.add('active');
            });
        });
        
        if (modalClose) {
            modalClose.addEventListener('click', function() {
                imageModal.classList.remove('active');
            });
        }
        
        imageModal.addEventListener('click', function(event) {
            if (event.target === imageModal) {
                imageModal.classList.remove('active');
            }
        });
    }

    // Catch the crumb game
    const gameButton = document.querySelector('.promo__game-button');
    const gameArea = document.querySelector('.promo__game-area');
    
    if (gameButton && gameArea) {
        gameButton.addEventListener('click', startCrumbGame);
    }

    // Scroll to top button
    const scrollTopButton = document.querySelector('.scroll-top');
    
    if (scrollTopButton) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                scrollTopButton.classList.add('visible');
            } else {
                scrollTopButton.classList.remove('visible');
            }
        });
        
        scrollTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq__item');
    
    if (faqItems) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq__question');
            
            if (question) {
                question.addEventListener('click', function() {
                    const isActive = item.classList.contains('active');
                    
                    faqItems.forEach(otherItem => {
                        otherItem.classList.remove('active');
                    });
                    
                    if (!isActive) {
                        setTimeout(() => {
                            item.classList.add('active');
                        }, 10);
                    }
                });
            }
        });
    }

    // Cookie of the Month countdown
    function updateCountdown() {
        // Set the date we're counting down to (end of the month)
        const now = new Date();
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        // Get today's date and time
        const distance = endOfMonth - now;
        
        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        
        // Display the result
        document.getElementById('countdown-days').textContent = days;
        document.getElementById('countdown-hours').textContent = hours;
        document.getElementById('countdown-minutes').textContent = minutes;
    }
    
    // Update the countdown every minute
    if (document.getElementById('monthlyCountdown')) {
        updateCountdown();
        setInterval(updateCountdown, 60000);
    }
    
    // Убираем старый код, чтобы избежать дублирования функционала

    // Cookie Customizer Functionality
    const initCustomizer = () => {
        // Get DOM elements
        const toppingCheckboxes = document.querySelectorAll('input[name="topping"]');
        const baseRadios = document.querySelectorAll('input[name="base"]');
        const sizeRadios = document.querySelectorAll('input[name="size"]');
        const cookieDescription = document.getElementById('cookie-description');
        const addToCartButton = document.getElementById('add-to-cart-custom');
        const resetButton = document.getElementById('reset-customizer');
        
        // Topping images
        const timestamp = new Date().getTime(); // Добавляем временную метку для предотвращения кэширования
        const toppingImages = {
            chocolate: `img/topping-chocolate.svg?v=${timestamp}`,
            nuts: `img/topping-nuts.svg?v=${timestamp}`,
            sprinkles: `img/topping-sprinkles.svg?v=${timestamp}`,
            caramel: `img/topping-caramel.svg?v=${timestamp}`,
            berries: `img/topping-berries.svg?v=${timestamp}`,
            'white-chocolate': `img/topping-white-chocolate.svg?v=${timestamp}`,
            mint: `img/topping-mint.svg?v=${timestamp}`,
            coconut: `img/topping-coconut.svg?v=${timestamp}`,
            cinnamon: `img/topping-cinnamon.svg?v=${timestamp}`,
            honey: `img/topping-honey.svg?v=${timestamp}`
        };
        
        // Base colors
        const baseColors = {
            classic: '#D2B48C',
            oatmeal: '#C3A678',
            coconut: '#E8DDCB',
            chocolate: '#8B4513',
            almond: '#EADDCA'
        };
        
        // Size scales
        const sizeScales = {
            small: 0.8,
            medium: 1,
            large: 1.2
        };
        
        // Prices - синхронизированы с ценами в корзине
        const prices = {
            base: {
                classic: 80,
                oatmeal: 90,
                coconut: 100,
                chocolate: 110,
                almond: 120
            },
            topping: {
                chocolate: 15,
                nuts: 15,
                sprinkles: 15,
                caramel: 15,
                berries: 15,
                'white-chocolate': 15,
                mint: 15,
                coconut: 15,
                cinnamon: 15,
                honey: 15
            },
            size: {
                small: 0.8,
                medium: 1,
                large: 1.3
            }
        };
        
        // Set initial state
        let currentState = {
            base: 'classic',
            toppings: [],
            size: 'medium'
        };
        
        // Update cookie preview
        const updatePreview = () => {
            // Update base color
            const cookieBase = document.querySelector('.cookie-base');
            // Используем разные SVG-файлы для каждого типа основы
            const timestamp = new Date().getTime(); // Добавляем временную метку для предотвращения кэширования
            const baseSvgPaths = {
                classic: `img/cookie-base-classic.svg?v=${timestamp}`,
                oatmeal: `img/cookie-base-oatmeal.svg?v=${timestamp}`,
                coconut: `img/cookie-base-coconut.svg?v=${timestamp}`,
                chocolate: `img/cookie-base-chocolate.svg?v=${timestamp}`,
                almond: `img/cookie-base-almond.svg?v=${timestamp}`
            };
            
            // Устанавливаем новое изображение основы
            cookieBase.setAttribute('src', baseSvgPaths[currentState.base] || baseSvgPaths.classic);
            
            // Update size
            const scale = sizeScales[currentState.size];
            cookieBase.style.transform = `scale(${scale})`;
            
            // Update toppings
            document.querySelectorAll('.cookie-topping').forEach(topping => {
                topping.style.display = 'none';
            });
            
            currentState.toppings.forEach(topping => {
                // Проверяем наличие элемента начинки
                const toppingElement = document.querySelector(`.topping-${topping}`);
                if (toppingElement) {
                    // Проверяем, есть ли изображение для этой начинки
                    if (toppingImages[topping]) {
                        // Обновляем src атрибут с временной меткой для предотвращения кэширования
                        toppingElement.setAttribute('src', toppingImages[topping]);
                    }
                    // Отображаем начинку
                    toppingElement.style.display = 'block';
                    toppingElement.style.transform = `scale(${scale})`;
                    console.log(`Отображаем начинку: ${topping}`);
                } else {
                    console.error(`Не найден элемент для начинки: ${topping}`);
                }
            });
            
            // Update description
            updateDescription();
        };
        
        // Update cookie description
        const updateDescription = () => {
            const baseNames = {
                classic: 'Классическая',
                oatmeal: 'Овсяная',
                coconut: 'Кокосовая',
                chocolate: 'Шоколадная',
                almond: 'Миндальная'
            };
            
            const baseName = baseNames[currentState.base];
            
            const sizeName = currentState.size === 'small' ? 'маленькое' : 
                           currentState.size === 'medium' ? 'среднее' : 'большое';
            
            let toppingsText = '';
            if (currentState.toppings.length > 0) {
                const toppingNames = {
                    chocolate: 'шоколадом',
                    nuts: 'орехами',
                    sprinkles: 'посыпкой',
                    caramel: 'карамелью',
                    berries: 'ягодами',
                    'white-chocolate': 'белым шоколадом',
                    mint: 'мятой',
                    coconut: 'кокосовой стружкой',
                    cinnamon: 'корицей',
                    honey: 'мёдом'
                };
                
                const toppingNamesList = currentState.toppings.map(t => toppingNames[t]);
                toppingsText = ` с ${toppingNamesList.join(' и ')}`;
            }
            
            cookieDescription.textContent = `${baseName} ${sizeName} печенье${toppingsText}`;
            
            // Update price
            const basePrice = prices.base[currentState.base];
            const toppingsPrice = currentState.toppings.reduce((sum, topping) => sum + prices.topping[topping], 0);
            const sizeMultiplier = prices.size[currentState.size];
            const totalPrice = Math.round((basePrice + toppingsPrice) * sizeMultiplier);
            
            addToCartButton.textContent = `Добавить в корзину - ${totalPrice} ₽`;
        };
        
        // Event listeners for toppings
        toppingCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const topping = this.value;
                if (this.checked) {
                    currentState.toppings.push(topping);
                } else {
                    currentState.toppings = currentState.toppings.filter(t => t !== topping);
                }
                updatePreview();
            });
        });
        
        // Event listeners for base
        baseRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                currentState.base = this.value;
                updatePreview();
            });
        });
        
        // Event listeners for size
        sizeRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                currentState.size = this.value;
                updatePreview();
            });
        });
        

        const dummyButton = document.createElement('button');
        dummyButton.addEventListener('click', function() {
            const baseNames = {
                classic: 'Классическая',
                oatmeal: 'Овсяная',
                coconut: 'Кокосовая',
                chocolate: 'Шоколадная',
                almond: 'Миндальная'
            };
            
            const baseName = baseNames[currentState.base];
            
            const sizeName = currentState.size === 'small' ? 'маленькое' : 
                           currentState.size === 'medium' ? 'среднее' : 'большое';
            
            let toppingsText = '';
            if (currentState.toppings.length > 0) {
                const toppingNames = {
                    chocolate: 'шоколадом',
                    nuts: 'орехами',
                    sprinkles: 'посыпкой',
                    caramel: 'карамелью',
                    berries: 'ягодами',
                    'white-chocolate': 'белым шоколадом',
                    mint: 'мятой',
                    coconut: 'кокосовой стружкой',
                    cinnamon: 'корицей',
                    honey: 'мёдом'
                };
                
                const toppingNamesList = currentState.toppings.map(t => toppingNames[t] || t);
                toppingsText = ` с ${toppingNamesList.join(' и ')}`;
            }
            
            const cookieName = `${baseName} ${sizeName} печенье${toppingsText}`;
            
            // Рассчитываем цену
            const basePrice = prices.base[currentState.base];
            const toppingsPrice = currentState.toppings.reduce((sum, topping) => sum + (prices.topping[topping] || 0), 0);
            const sizeMultiplier = prices.size[currentState.size];
            const totalPrice = Math.round((basePrice + toppingsPrice) * sizeMultiplier);
            
            // Добавляем в корзину
            addToCartSpecial(cookieName, totalPrice);
            
            // Визуальная обратная связь
            this.textContent = 'Добавлено!';
            setTimeout(() => {
                updateDescription();
            }, 2000);
        });
        
        // Reset button
        resetButton.addEventListener('click', function() {
            // Reset state
            currentState = {
                base: 'classic',
                toppings: [],
                size: 'medium'
            };
            
            // Reset form
            document.querySelector('input[name="base"][value="classic"]').checked = true;
            document.querySelector('input[name="size"][value="medium"]').checked = true;
            toppingCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            
            // Update preview
            updatePreview();
        });
        
        // Initialize preview
        updatePreview();
    };
    
    if (document.querySelector('.cookie-customizer')) {
        initCustomizer();
    }

    // Примечание: функциональность кнопки героя уже реализована выше через id='try-now-btn'
});

// Create falling crumbs animation
function createCrumbs() {
    const crumbsContainer = document.querySelector('.hero__crumbs');
    if (!crumbsContainer) return;
    
    const numberOfCrumbs = 10;
    
    for (let i = 0; i < numberOfCrumbs; i++) {
        setTimeout(() => {
            const crumb = document.createElement('div');
            crumb.classList.add('crumb');
            
            // Random position, size, and rotation
            const size = Math.random() * 10 + 5; // 5-15px
            const posX = Math.random() * 100; // 0-100%
            const delay = Math.random() * 2; // 0-2s
            const duration = Math.random() * 3 + 2; // 2-5s
            
            crumb.style.cssText = `
                position: absolute;
                top: -20px;
                left: ${posX}%;
                width: ${size}px;
                height: ${size}px;
                background-color: #D4A017;
                border-radius: 50%;
                opacity: 0.8;
                animation: crumbFall ${duration}s linear ${delay}s forwards;
            `;
            
            crumbsContainer.appendChild(crumb);
            
            // Remove crumb after animation
            setTimeout(() => {
                crumb.remove();
            }, (duration + delay) * 1000);
        }, i * 200); // Stagger the creation of crumbs
    }
}

// Play crunch sound
function playCrunchSound() {
    const crunchSound = new Audio('sounds/crunch.mp3');
    crunchSound.volume = 0.2;
    crunchSound.play().catch(error => {
        console.log('Audio playback error:', error);
    });
}

// Handle quantity change
function handleQuantityChange() {
    const input = this.parentElement.querySelector('.quantity-input');
    const currentValue = parseInt(input.value);
    
    if (this.classList.contains('plus')) {
        if (currentValue < parseInt(input.max)) {
            input.value = currentValue + 1;
        }
    } else if (this.classList.contains('minus')) {
        if (currentValue > parseInt(input.min)) {
            input.value = currentValue - 1;
        }
    }
}

// Format phone number
function formatPhoneNumber() {
    const phoneInput = document.getElementById('phone');
    let phoneNumber = phoneInput.value.replace(/\D/g, '');
    
    if (phoneNumber.length > 0) {
        if (phoneNumber.length <= 1) {
            phoneNumber = `+7 (${phoneNumber}`;
        } else if (phoneNumber.length <= 4) {
            phoneNumber = `+7 (${phoneNumber.substring(1, 4)}`;
        } else if (phoneNumber.length <= 7) {
            phoneNumber = `+7 (${phoneNumber.substring(1, 4)}) ${phoneNumber.substring(4, 7)}`;
        } else if (phoneNumber.length <= 9) {
            phoneNumber = `+7 (${phoneNumber.substring(1, 4)}) ${phoneNumber.substring(4, 7)}-${phoneNumber.substring(7, 9)}`;
        } else {
            phoneNumber = `+7 (${phoneNumber.substring(1, 4)}) ${phoneNumber.substring(4, 7)}-${phoneNumber.substring(7, 9)}-${phoneNumber.substring(9, 11)}`;
        }
    }
    
    phoneInput.value = phoneNumber;
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    // Validate form
    const selectedFlavors = form.querySelectorAll('input[name="flavor"]:checked');
    if (selectedFlavors.length === 0) {
        alert('Пожалуйста, выберите хотя бы один вкус печенья');
        return;
    }
    
    // Show loading spinner
    submitButton.innerHTML = '<span class="spinner"></span>';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        submitButton.innerHTML = 'Заказ принят!';
        form.reset();
        
        // Reset button after some time
        setTimeout(() => {
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }, 3000);
    }, 2000);
}

// Toggle cart panel
function toggleCart() {
    const cartPanel = document.querySelector('.cart__panel');
    cartPanel.classList.toggle('active');
}

// Add to cart functionality
function addToCart() {
    const flavorCard = this.closest('.flavor-card');
    const flavorName = flavorCard.querySelector('.flavor-card__title').textContent;
    const priceData = parseInt(this.getAttribute('data-price')) || 150;
    
    addToCartSpecial(flavorName, priceData, flavorCard);
}

// Add special item to cart (like Cookie of the Month)
function addToCartSpecial(flavorName, price, parentElement = null) {
    
    // Add to cart panel
    const cartItems = document.querySelector('.cart__items');
    const cartCounter = document.querySelector('.cart__counter');
    const cartTotalPrice = document.querySelector('.cart__total-price');
    
    // Check if item already exists in cart
    const existingItem = Array.from(cartItems.querySelectorAll('.cart__item')).find(item => {
        return item.querySelector('.cart__item-name').textContent === flavorName;
    });
    
    if (existingItem) {
        // Если товар уже есть, не увеличиваем количество,
        // а показываем уведомление, что товар уже в корзине
        alert(`${flavorName} уже в корзине`);
    } else {
        // Create new item if it doesn't exist
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart__item');
        cartItem.innerHTML = `
            <span class="cart__item-name">${flavorName}</span>
            <span class="cart__item-quantity">1x</span>
            <span class="cart__item-price">${price}₽</span>
            <span class="cart__item-remove">&times;</span>
        `;
        cartItems.appendChild(cartItem);
        
        // Add remove functionality
        const removeButton = cartItem.querySelector('.cart__item-remove');
        removeButton.addEventListener('click', function() {
            cartItem.remove();
            updateCartTotal();
        });
    }
    
    // Show cart panel
    document.querySelector('.cart__panel').classList.add('active');
    
    // Update total
    updateCartTotal();
    
    // Animation feedback - только если есть родительский элемент
    if (parentElement) {
        const addedFeedback = document.createElement('div');
        addedFeedback.classList.add('added-feedback');
        addedFeedback.textContent = 'Добавлено!';
        addedFeedback.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(60, 47, 47, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-weight: bold;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        parentElement.appendChild(addedFeedback);
        
        // Show and hide feedback
        setTimeout(() => {
            addedFeedback.style.opacity = '1';
            
            setTimeout(() => {
                addedFeedback.style.opacity = '0';
                
                setTimeout(() => {
                    addedFeedback.remove();
                }, 300);
            }, 1000);
        }, 0);
    } else {
        // Если родительского элемента нет (например, для печенья месяца)
        // Показываем уведомление в верхней части страницы
        const notification = document.createElement('div');
        notification.classList.add('cart-notification');
        notification.textContent = `${flavorName} добавлено в корзину!`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #4CAF50;
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            font-weight: bold;
            z-index: 10000;
            opacity: 0;
            transform: translateY(-20px);
            transition: opacity 0.3s ease, transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Показываем и скрываем уведомление
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
            
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 2000);
        }, 0);
    }
}

// Update cart total
// Функция для открытия модального окна оплаты
function openPaymentModal() {
    const paymentModal = document.getElementById('paymentModal');
    const orderSummary = paymentModal.querySelector('.order-summary');
    const paymentTotalPrice = paymentModal.querySelector('.payment-total-price');
    const cartItems = document.querySelectorAll('.cart__item');
    const cartTotalPrice = document.querySelector('.cart__total-price');
    
    // Очищаем содержимое суммарного блока
    orderSummary.innerHTML = '';
    
    // Заполняем данными из корзины
    cartItems.forEach(item => {
        const name = item.querySelector('.cart__item-name').textContent;
        const quantity = item.querySelector('.cart__item-quantity').textContent;
        const price = item.querySelector('.cart__item-price').textContent;
        
        const orderItem = document.createElement('div');
        orderItem.classList.add('payment-order-item');
        orderItem.innerHTML = `
            <div>${name} (${quantity})</div>
            <div>${price}</div>
        `;
        
        orderSummary.appendChild(orderItem);
    });
    
    // Устанавливаем итоговую сумму
    paymentTotalPrice.textContent = cartTotalPrice.textContent;
    
    // Показываем модальное окно
    paymentModal.classList.add('active');
    
    // Обработчик оплаты
    const paymentSubmitButton = paymentModal.querySelector('.payment-submit');
    if (paymentSubmitButton) {
        paymentSubmitButton.onclick = function() {
            alert('Спасибо за заказ! Мы свяжемся с вами в ближайшее время.');
            paymentModal.classList.remove('active');
            
            // Очистка корзины после оплаты
            const cartItems = document.querySelector('.cart__items');
            cartItems.innerHTML = '';
            updateCartTotal();
        };
    }
    
    // Обработчики для полей формы
    const cardNumberInput = paymentModal.querySelector('.card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formattedValue += ' ';
                }
                formattedValue += value[i];
            }
            
            e.target.value = formattedValue;
        });
    }
    
    const cardExpiryInput = paymentModal.querySelector('.card-expiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            
            if (value.length > 0) {
                formattedValue = value.substring(0, 2);
                if (value.length > 2) {
                    formattedValue += '/' + value.substring(2, 4);
                }
            }
            
            e.target.value = formattedValue;
        });
    }
}

function updateCartTotal() {
    const cartItems = document.querySelectorAll('.cart__item');
    const cartCounter = document.querySelector('.cart__counter');
    const cartTotalPrice = document.querySelector('.cart__total-price');
    
    let totalItems = 0;
    let totalPrice = 0;
    
    cartItems.forEach(item => {
        const quantityText = item.querySelector('.cart__item-quantity').textContent;
        const quantity = parseInt(quantityText.split('x')[0]);
        const priceText = item.querySelector('.cart__item-price').textContent;
        const price = parseInt(priceText);
        
        totalItems += quantity;
        totalPrice += quantity * price;
    });
    
    cartCounter.textContent = totalItems;
    cartTotalPrice.textContent = `${totalPrice}₽`;
    
    if (totalItems === 0) {
        document.querySelector('.cart__panel').classList.remove('active');
    }
}

// Start crumb catching game
function startCrumbGame() {
    const gameArea = document.querySelector('.promo__game-area');
    const gameButton = document.querySelector('.promo__game-button');
    
    // Reset game area
    gameArea.innerHTML = '';
    gameArea.style.display = 'block';
    gameButton.disabled = true;
    
    let caughtCrumbs = 0;
    let totalCrumbs = 5;
    let timeLeft = 10;
    
    // Create timer
    const timer = document.createElement('div');
    timer.classList.add('game-timer');
    timer.textContent = `Время: ${timeLeft}с`;
    timer.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        font-weight: bold;
    `;
    gameArea.appendChild(timer);
    
    // Create score
    const score = document.createElement('div');
    score.classList.add('game-score');
    score.textContent = `Поймано: ${caughtCrumbs}/${totalCrumbs}`;
    score.style.cssText = `
        position: absolute;
        top: 10px;
        left: 10px;
        font-weight: bold;
    `;
    gameArea.appendChild(score);
    
    // Create crumbs
    for (let i = 0; i < totalCrumbs; i++) {
        createGameCrumb(gameArea, i, () => {
            caughtCrumbs++;
            score.textContent = `Поймано: ${caughtCrumbs}/${totalCrumbs}`;
            
            if (caughtCrumbs === totalCrumbs) {
                endGame(true);
            }
        });
    }
    
    // Start timer
    const timerInterval = setInterval(() => {
        timeLeft--;
        timer.textContent = `Время: ${timeLeft}с`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame(caughtCrumbs === totalCrumbs);
        }
    }, 1000);
    
    // End game function
    function endGame(isWin) {
        clearInterval(timerInterval);
        
        // Remove all crumbs
        const crumbs = gameArea.querySelectorAll('.game-crumb');
        crumbs.forEach(crumb => crumb.remove());
        
        // Show result
        const resultMessage = document.createElement('div');
        resultMessage.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            font-weight: bold;
            font-size: 18px;
        `;
        
        if (isWin) {
            // Generate promo code
            const promoCode = generatePromoCode();
            resultMessage.innerHTML = `
                <p>Поздравляем! Вы поймали все крошки!</p>
                <p>Ваш промокод на скидку 10%:</p>
                <p style="color: #F5C107; font-size: 24px; margin: 10px 0;">${promoCode}</p>
                <p>Используйте его при оформлении заказа</p>
            `;
        } else {
            resultMessage.innerHTML = `
                <p>Время вышло!</p>
                <p>Вы поймали ${caughtCrumbs} из ${totalCrumbs} крошек</p>
                <p>Попробуйте еще раз!</p>
            `;
        }
        
        gameArea.appendChild(resultMessage);
        
        // Re-enable button after 3 seconds
        setTimeout(() => {
            gameButton.disabled = false;
        }, 3000);
    }
}

// Create game crumb
function createGameCrumb(gameArea, index, onCatch) {
    setTimeout(() => {
        const crumb = document.createElement('div');
        crumb.classList.add('game-crumb');
        
        // Random position and size
        const size = Math.random() * 15 + 15; // 15-30px
        const maxX = gameArea.clientWidth - size;
        const maxY = gameArea.clientHeight - size;
        const posX = Math.random() * maxX;
        const posY = Math.random() * maxY;
        
        crumb.style.cssText = `
            position: absolute;
            left: ${posX}px;
            top: ${posY}px;
            width: ${size}px;
            height: ${size}px;
            background-color: #D4A017;
            border-radius: 50%;
            cursor: pointer;
            transition: transform 0.1s ease;
        `;
        
        // Move crumb randomly
        let intervalId = setInterval(() => {
            const newX = Math.random() * maxX;
            const newY = Math.random() * maxY;
            crumb.style.left = `${newX}px`;
            crumb.style.top = `${newY}px`;
        }, 1500);
        
        // Catch crumb on click
        crumb.addEventListener('click', function() {
            clearInterval(intervalId);
            crumb.style.transform = 'scale(0)';
            setTimeout(() => {
                crumb.remove();
                onCatch();
            }, 300);
        });
        
        gameArea.appendChild(crumb);
    }, index * 500); // Stagger appearance
}

// Generate random promo code
function generatePromoCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'CRUMBLE';
    
    for (let i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
}
