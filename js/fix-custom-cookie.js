document.addEventListener('DOMContentLoaded', function() {
    console.log('Инициализация fix-custom-cookie.js');
    
    const addCustomButton = document.getElementById('add-to-cart-custom');
    if (addCustomButton) {
        console.log('Найдена кнопка добавления кастомного печенья');
        
        addCustomButton.addEventListener('click', function() {
            console.log('Нажата кнопка добавления кастомного печенья');
            
            const baseElement = document.querySelector('input[name="base"]:checked');
            const sizeElement = document.querySelector('input[name="size"]:checked');
            
            if (!baseElement || !sizeElement) {
                alert('Выберите основу и размер печенья');
                return;
            }
            
            // Формируем имя печенья
            const baseName = baseElement.parentElement.querySelector('.option-name').textContent;
            const sizeName = sizeElement.parentElement.querySelector('.option-name').textContent;
            const cookieName = `${baseName} ${sizeName.toLowerCase()} печенье`;
            
            // Добавляем в корзину
            const cartItems = document.querySelector('.cart__items');
            if (!cartItems) {
                console.error('Не найден контейнер корзины');
                return;
            }
            
            // Проверка на дубликат
            const existingItems = cartItems.querySelectorAll('.cart__item');
            for (let i = 0; i < existingItems.length; i++) {
                const itemName = existingItems[i].querySelector('.cart__item-name').textContent;
                if (itemName === cookieName) {
                    alert(`${cookieName} уже в корзине`);
                    return;
                }
            }
            
            // Создаем элемент в корзине
            const cartItem = document.createElement('div');
            cartItem.className = 'cart__item';
            cartItem.innerHTML = `
                <span class="cart__item-name">${cookieName}</span>
                <span class="cart__item-quantity">1x</span>
                <span class="cart__item-price">250₽</span>
                <span class="cart__item-remove">&times;</span>
            `;
            
            // Добавляем обработчик для удаления
            cartItem.querySelector('.cart__item-remove').addEventListener('click', function() {
                cartItem.remove();
                updateCartTotal();
            });
            
            // Добавляем в DOM
            cartItems.appendChild(cartItem);
            
            // Обновляем корзину и показываем её
            updateCartTotal();
            document.querySelector('.cart__panel').classList.add('active');
            
            // Визуальная обратная связь
            this.textContent = 'Добавлено!';
            setTimeout(() => {
                this.textContent = 'Добавить в корзину';
            }, 2000);
        });
    }
    
    // Функционал кнопки сброса
    const resetButton = document.getElementById('reset-customizer');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            // Сбрасываем выбор основы на классическую
            const baseInputs = document.querySelectorAll('input[name="base"]');
            baseInputs.forEach(input => {
                input.checked = input.value === 'classic';
            });
            
            // Сбрасываем выбор размера на средний
            const sizeInputs = document.querySelectorAll('input[name="size"]');
            sizeInputs.forEach(input => {
                input.checked = input.value === 'medium';
            });
            
            // Снимаем все топпинги
            const toppingInputs = document.querySelectorAll('input[name="topping"]');
            toppingInputs.forEach(input => {
                input.checked = false;
            });
            
            // Сбрасываем описание
            const description = document.getElementById('cookie-description');
            if (description) {
                description.textContent = 'Выбери ингредиенты справа';
            }
            
            // Сбрасываем визуальное представление
            const toppings = document.querySelectorAll('.cookie-topping');
            toppings.forEach(topping => {
                topping.style.display = 'none';
            });
            
            // Сбрасываем текст кнопки
            const addButton = document.getElementById('add-to-cart-custom');
            if (addButton) {
                addButton.textContent = 'Добавить в корзину';
            }
        });
    }
});
