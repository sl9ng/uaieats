import React from 'react';
import './Cart.css';

const Cart = ({ cart, onUpdateQuantity, onRemoveItem, onFinalizeOrder, onCloseCart }) => {
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.dish.price * item.quantity), 0).toFixed(2);
  };

  return (
    <div className="cart-overlay">
      <div className="cart-sidebar">
        <button onClick={onCloseCart} className="close-btn">X</button>
        <h3>Seu Carrinho</h3>

        <div className="cart-items-list">
          {cart.length === 0 ? (
            <p>Seu carrinho está vazio.</p>
          ) : (
            cart.map(item => (
              <div key={item.dish.id} className="cart-item">
                <p>{item.quantity}x {item.dish.name}</p>
                <p>R$ {(item.dish.price * item.quantity).toFixed(2)}</p>
                <div className="cart-item-actions">
                  <button onClick={() => onUpdateQuantity(item.dish.id, 1)}>+</button>
                  <button onClick={() => onUpdateQuantity(item.dish.id, -1)}>-</button>
                  <button onClick={() => onRemoveItem(item.dish.id)}>Remover</button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-total">
            <h4>Total: R$ {calculateTotal()}</h4>
            <button onClick={onFinalizeOrder} className="checkout-btn">
              Finalizar Pedido
            </button>
          </div>
        )}

        <div className="cart-actions">
          <button onClick={onCloseCart} className="close-btn"></button>
        </div>
      </div>
    </div>
  );
};

export default Cart;