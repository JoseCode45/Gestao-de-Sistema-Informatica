import React, { createContext, useState, useEffect } from 'react';
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (produto) => {
    setCart(prev => {
      const exists = prev.find(p => p.ProdutoID === produto.ProdutoID);
      if (exists) {
        return prev.map(p =>
          p.ProdutoID === produto.ProdutoID
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      } else {
        return [...prev, { ProdutoID: produto.ProdutoID, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (ProdutoID, quantity) => {
    setCart(prev =>
      prev
        .map(p => (p.ProdutoID === ProdutoID ? { ...p, quantity } : p))
        .filter(p => p.quantity > 0)
    );
  };

  const removeFromCart = (ProdutoID) => {
    setCart(prev => prev.filter(p => p.ProdutoID !== ProdutoID));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, clearCart, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
