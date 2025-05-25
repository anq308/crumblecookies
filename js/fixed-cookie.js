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
            const cookieName = `${baseName} ${sizeName.toLowerCase()} печенье`;
            
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
                <span class="cart__item-price">250₽</span>
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
        resetButton.onclick = function() {
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
        };
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
});
