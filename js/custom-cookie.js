document.addEventListener('DOMContentLoaded', function() {
    const addToCartButton = document.getElementById('add-to-cart-custom');
    const resetButton = document.getElementById('reset-customizer');
    
    if (addToCartButton) {
        addToCartButton.onclick = function() {
            const baseElement = document.querySelector('input[name="base"]:checked');
            const sizeElement = document.querySelector('input[name="size"]:checked');
            
            if (!baseElement || !sizeElement) {
                alert('Выберите основу и размер печенья');
                return;
            }
            
            const baseName = baseElement.parentElement.querySelector('.option-name').textContent;
            const sizeName = sizeElement.parentElement.querySelector('.option-name').textContent;
            
            // Получаем выбранные начинки
            const selectedToppings = document.querySelectorAll('input[name="topping"]:checked');
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
            
            // Создаем текст с начинками
            let toppingsText = '';
            if (selectedToppings.length > 0) {
                const toppingsList = Array.from(selectedToppings).map(t => toppingNames[t.value]);
                toppingsText = ` с ${toppingsList.join(' и ')}`;
            }
            
            // Формируем полное имя печенья
            const cookieName = `${baseName} ${sizeName.toLowerCase()} печенье${toppingsText}`;
            
            const price = calculateCookiePrice(baseElement.value, sizeElement.value);
            
            const cartItems = document.querySelector('.cart__items');
            if (!cartItems) {
                return;
            }
            
            const existingItems = cartItems.querySelectorAll('.cart__item');
            for (let i = 0; i < existingItems.length; i++) {
                const itemName = existingItems[i].querySelector('.cart__item-name').textContent;
                if (itemName === cookieName) {
                    alert(`${cookieName} уже в корзине`);
                    return;
                }
            }
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart__item';
            cartItem.innerHTML = `
                <span class="cart__item-name">${cookieName}</span>
                <span class="cart__item-quantity">1x</span>
                <span class="cart__item-price">${price}₽</span>
                <span class="cart__item-remove">&times;</span>
            `;
            
            cartItem.querySelector('.cart__item-remove').addEventListener('click', function() {
                cartItem.remove();
                updateCartTotal();
            });
            
            cartItems.appendChild(cartItem);
            
            updateCartTotal();
            document.querySelector('.cart__panel').classList.add('active');
            
            this.textContent = 'Добавлено!';
            setTimeout(() => {
                this.textContent = 'Добавить в корзину';
            }, 2000);
        };
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            const baseInputs = document.querySelectorAll('input[name="base"]');
            baseInputs.forEach(input => {
                input.checked = input.value === 'classic';
            });
            
            const sizeInputs = document.querySelectorAll('input[name="size"]');
            sizeInputs.forEach(input => {
                input.checked = input.value === 'medium';
            });
            
            const toppingInputs = document.querySelectorAll('input[name="topping"]');
            toppingInputs.forEach(input => {
                input.checked = false;
            });
            
            const description = document.getElementById('cookie-description');
            if (description) {
                description.textContent = 'Выбери ингредиенты справа';
            }
            
            const toppings = document.querySelectorAll('.cookie-topping');
            toppings.forEach(topping => {
                topping.style.display = 'none';
            });
            
            const addButton = document.getElementById('add-to-cart-custom');
            if (addButton) {
                addButton.textContent = 'Добавить в корзину';
            }
        });
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
    
    // Функция расчета цены печенья на основе выбранных ингредиентов
    function calculateCookiePrice(baseType, sizeType) {
        // Базовая цена для разных основ печенья
        const basePrices = {
            'classic': 80,  // Классическая основа
            'oatmeal': 90,  // Овсяная основа
            'coconut': 100, // Кокосовая основа
            'chocolate': 110, // Шоколадная основа
            'almond': 120   // Миндальная основа
        };
        
        // Коэффициенты размера
        const sizeCoefficients = {
            'small': 0.8,  // Маленький размер
            'medium': 1.0, // Средний размер (стандартный)
            'large': 1.3   // Большой размер
        };
        
        // Получаем базовую цену в зависимости от типа основы
        let price = basePrices[baseType] || 80; // По умолчанию 80, если тип не найден
        
        // Применяем коэффициент размера
        price *= sizeCoefficients[sizeType] || 1.0; // По умолчанию 1.0, если размер не найден
        
        // Добавляем стоимость за каждый выбранный топпинг
        const selectedToppings = document.querySelectorAll('input[name="topping"]:checked');
        price += selectedToppings.length * 15; // Каждый топпинг добавляет 15 рублей
        
        // Округляем до целого числа
        return Math.round(price);
    }
});
