document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    const paymentModal = document.getElementById('paymentModal');
    const paymentClose = document.querySelector('.payment-modal__close');
    const paymentForm = document.getElementById('paymentForm');
    const cardRadio = document.getElementById('card');
    const cashRadio = document.getElementById('cash');
    const cardDetails = document.getElementById('cardDetails');
    const paymentItems = document.getElementById('paymentItems');
    const paymentTotalPrice = document.getElementById('paymentTotalPrice');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            fillPaymentItems();
            paymentModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (paymentClose) {
        paymentClose.addEventListener('click', function() {
            paymentModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    if (cardRadio && cashRadio && cardDetails) {
        cardRadio.addEventListener('change', function() {
            if (this.checked) {
                cardDetails.style.display = 'block';
            }
        });
        
        cashRadio.addEventListener('change', function() {
            if (this.checked) {
                cardDetails.style.display = 'none';
            }
        });
    }
    
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            alert('Заказ успешно оформлен! Спасибо за покупку.');
            paymentModal.classList.remove('active');
            document.body.style.overflow = '';
            
            const cartItems = document.querySelector('.cart__items');
            if (cartItems) {
                cartItems.innerHTML = '';
                updateCartTotal();
            }
        });
    }
    
    function fillPaymentItems() {
        const cartItems = document.querySelector('.cart__items');
        const totalPriceElement = document.querySelector('.cart__total-price');
        
        if (cartItems && paymentItems && totalPriceElement && paymentTotalPrice) {
            paymentItems.innerHTML = '';
            
            const items = cartItems.querySelectorAll('.cart__item');
            
            items.forEach(item => {
                const name = item.querySelector('.cart__item-name').textContent;
                const quantity = item.querySelector('.cart__item-quantity').textContent;
                const price = item.querySelector('.cart__item-price').textContent;
                
                const paymentItem = document.createElement('div');
                paymentItem.className = 'payment-modal__item';
                paymentItem.innerHTML = `
                    <span class="payment-modal__item-name">${name}</span>
                    <span class="payment-modal__item-quantity">${quantity}</span>
                    <span class="payment-modal__item-price">${price}</span>
                `;
                
                paymentItems.appendChild(paymentItem);
            });
            
            paymentTotalPrice.textContent = totalPriceElement.textContent;
        }
    }
    
    function updateCardNumberFormat() {
        const cardNumber = document.getElementById('cardNumber');
        if (cardNumber) {
            cardNumber.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 16) value = value.slice(0, 16);
                
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
    }
    
    function updateCardExpiryFormat() {
        const cardExpiry = document.getElementById('cardExpiry');
        if (cardExpiry) {
            cardExpiry.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 4) value = value.slice(0, 4);
                
                if (value.length > 2) {
                    e.target.value = value.slice(0, 2) + '/' + value.slice(2);
                } else {
                    e.target.value = value;
                }
            });
        }
    }
    
    function updateCardCvvFormat() {
        const cardCvv = document.getElementById('cardCvv');
        if (cardCvv) {
            cardCvv.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 3) value = value.slice(0, 3);
                e.target.value = value;
            });
        }
    }
    
    function updatePhoneFormat() {
        const phone = document.getElementById('phone');
        if (phone) {
            phone.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 11) value = value.slice(0, 11);
                
                if (value.length === 0) {
                    e.target.value = '';
                } else if (value.length <= 1) {
                    e.target.value = '+' + value;
                } else if (value.length <= 4) {
                    e.target.value = '+' + value.slice(0, 1) + ' (' + value.slice(1);
                } else if (value.length <= 7) {
                    e.target.value = '+' + value.slice(0, 1) + ' (' + value.slice(1, 4) + ') ' + value.slice(4);
                } else if (value.length <= 9) {
                    e.target.value = '+' + value.slice(0, 1) + ' (' + value.slice(1, 4) + ') ' + value.slice(4, 7) + '-' + value.slice(7);
                } else {
                    e.target.value = '+' + value.slice(0, 1) + ' (' + value.slice(1, 4) + ') ' + value.slice(4, 7) + '-' + value.slice(7, 9) + '-' + value.slice(9);
                }
            });
        }
    }
    
    updateCardNumberFormat();
    updateCardExpiryFormat();
    updateCardCvvFormat();
    updatePhoneFormat();
});
