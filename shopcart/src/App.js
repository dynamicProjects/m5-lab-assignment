import React, { useState } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { faShoppingCart, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import FacebookLogin from 'react-facebook-login';

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [lightboxProduct, setLightboxProduct] = useState(null);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

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

  const handleSubtractFromCart = (product) => {
    const existingProduct = cartItems.find((item) => item.id === product.id);
    if (existingProduct && existingProduct.quantity > 1) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id ? { ...existingProduct, quantity: existingProduct.quantity - 1 } : item
        )
      );
    } else {
      setCartItems(cartItems.filter((item) => item.id !== product.id));
    }
  };

  const handleImageClick = (product) => {
    setLightboxProduct(product);
  };

  const handleCloseLightbox = () => {
    setLightboxProduct(null);
  };

  const handleViewCart = () => {
    setShowCartModal(true);
  };

  const handleCloseCart = () => {
    setShowCartModal(false);
  };

  const handleCheckout = () => {
    setShowCheckoutModal(true);
    setShowCartModal(false);
  };

  const handleCloseCheckout = () => {
    setShowCheckoutModal(false);
  };

  const responseFacebook = (response) => {
    if (response.status !== 'unknown') {
      setIsLoggedIn(true);
      setUserName(response.name);
    }
  };

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="App">
      <header className="App-header">
        <h1 onClick={() => setShowCartModal(false)} style={{ cursor: 'pointer' }}>Shop to React</h1>
        <div className="cart">
          <span onClick={handleViewCart} style={{ cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faShoppingCart} /> Cart: {totalQuantity} items
          </span>
        </div>
      </header>
      <main>
        {!isLoggedIn ? (
          <div className="login">
            <h2>Please log in</h2>
            <FacebookLogin
              appId="1519283925341578"
              autoLoad={true}
              fields="name,email,picture"
              callback={responseFacebook}
            />
          </div>
        ) : (
          <div>
            <h2>Welcome, {userName}!</h2>
            <div className="product-list">
              {products.map((product) => (
                <div className="product" key={product.id}>
                  <img src={process.env.PUBLIC_URL + product.image} alt={product.name} onClick={() => handleImageClick(product)} />
                  <h2>{product.name}</h2>
                  <p>{product.price}</p>
                  <div className="quantity-controls">
                    <button onClick={() => handleAddToCart(product)}>
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                    <input type="number" min="0" value={cartItems.find(item => item.id === product.id)?.quantity || 0} readOnly />
                    <button onClick={() => handleSubtractFromCart(product)}>
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {lightboxProduct && (
        <Modal show={true} onHide={handleCloseLightbox}>
          <Modal.Header closeButton>
            <Modal.Title>{lightboxProduct.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img src={process.env.PUBLIC_URL + lightboxProduct.image} alt={lightboxProduct.name} style={{ width: '100%' }} />
            <p>{lightboxProduct.price}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseLightbox}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <Modal show={showCartModal} onHide={handleCloseCart}>
        <Modal.Header closeButton>
          <Modal.Title>Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cartItems.filter(item => item.quantity > 0).length === 0 ? (
            <p>No items in the cart</p>
          ) : (
            <ul>
              {cartItems.filter(item => item.quantity > 0).map((item) => (
                <li key={item.id} style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={process.env.PUBLIC_URL + item.image} alt={item.name} style={{ width: '50px', marginRight: '10px' }} />
                  {item.name} - {item.quantity}
                </li>
              ))}
            </ul>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCart}>
            Close
          </Button>
          {cartItems.filter(item => item.quantity > 0).length > 0 && (
            <Button variant="primary" onClick={handleCheckout}>
              Check Out
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <Modal show={showCheckoutModal} onHide={handleCloseCheckout}>
        <Modal.Header closeButton>
          <Modal.Title>Check Out</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h2>Order Summary</h2>
          <ul>
            {cartItems.filter(item => item.quantity > 0).map((item) => (
              <li key={item.id} style={{ display: 'flex', alignItems: 'center' }}>
                <img src={process.env.PUBLIC_URL + item.image} alt={item.name} style={{ width: '50px', marginRight: '10px' }} />
                {item.name} - {item.quantity}
              </li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCheckout}>
            Close
          </Button>
          <Button variant="primary">
            Confirm Purchase
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default App;
