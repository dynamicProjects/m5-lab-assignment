import React, { useState } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const products = [
    { id: 1, name: 'Unisex Cologne', price: '$20', image: '/products/cologne.jpg', quantity: 0 },
    { id: 2, name: 'Apple iWatch', price: '$199', image: '/products/iwatch.jpg', quantity: 0 },
    { id: 3, name: 'Unique Mug', price: '$15', image: '/products/mug.jpg', quantity: 0 },
    { id: 4, name: 'Mens Wallet', price: '$25', image: '/products/wallet.jpg', quantity: 0 }
  ];

  const handleAddToCart = (product) => {
    const existingProduct = cartItems.find((item) => item.id === product.id);
    if (existingProduct) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id ? { ...existingProduct, quantity: existingProduct.quantity + 1 } : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Shop to React</h1>
        <div className="cart">
          <span><FontAwesomeIcon icon={faShoppingCart} /> Cart: {cartItems.reduce((acc, item) => acc + item.quantity, 0)} items</span>
        </div>
      </header>
      <main>
        <div className="product-list">
          {products.map((product) => (
            <div className="product" key={product.id}>
              <img src={process.env.PUBLIC_URL + product.image} alt={product.name} />
              <h2>{product.name}</h2>
              <p>{product.price}</p>
              <div>
                <input type="number" min="0" value={product.quantity} readOnly />
                <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-items">
          <h2>Cart</h2>
          {cartItems.length === 0 ? (
            <p>No items in the cart</p>
          ) : (
            <ul>
              {cartItems.map((item) => (
                <li key={item.id}>
                  {item.name} - {item.quantity}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
