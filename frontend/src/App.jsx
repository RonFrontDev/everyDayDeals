import React, { useState, useEffect } from 'react';
import { fetchDeals } from './services/api';
import { Snackbar, Alert } from '@mui/material'; // Import Alert for better styling
import { Trash2, History, Lock, Unlock } from 'lucide-react';
import './index.css'; // Import the CSS file
import './styles.css'; // Import the CSS file

export default function App() {
  const [products, setProducts] = useState([]);
  const [radius, setRadius] = useState(10);
  const [location, setLocation] = useState(null);
  const [deals, setDeals] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [inputValue, setInputValue] = useState(''); // For controlled input
  const [history, setHistory] = useState([]); // For product history

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => console.warn(err)
    );
  }, []);

  useEffect(() => {
    if (location) {
      fetchDeals().then((data) => {
        const filteredDeals = data.filter(
          (deal) =>
            getDistance(location.lat, location.lon, deal.lat, deal.lon) <=
            radius
        );
        setDeals(filteredDeals);
      });
    }
  }, [location, radius]);

  const addProduct = (product) => {
    if (!product.trim()) return;
    const newProduct = { name: product, store: '', price: null, locked: false };
    setProducts([...products, newProduct]);
    setHistory([...history, newProduct]); // Add to history
    setSnackbar({ open: true, message: `${product} added to your list!` });
    setInputValue(''); // Clear input after adding
  };

  const deleteProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  const clearProducts = () => {
    const updatedProducts = products.filter((product) => product.locked);
    setProducts(updatedProducts);
    setSnackbar({ open: true, message: 'Unlocked items cleared!' });
  };

  const toggleLock = (index) => {
    const updatedProducts = [...products];
    updatedProducts[index].locked = !updatedProducts[index].locked;
    setProducts(updatedProducts);
  };

  const addFromHistory = (product) => {
    setProducts([...products, { ...product, locked: false }]); // Add with locked: false
    setSnackbar({ open: true, message: `${product.name} added to your list!` });
  };

  const clearHistory = () => {
    setHistory([]);
    setSnackbar({ open: true, message: 'History cleared!' });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '' });
  };

  return (
    <div className='container'>
      <h1 className='heading'>🛒 Product Sale Tracker</h1>

      {/* Radius Input */}
      <label>Search Radius (km):</label>
      <input
        type='number'
        value={radius}
        onChange={(e) => setRadius(e.target.value)}
        className='input-field'
      />

      {/* Product Input */}
      <label>Add a Product:</label>
      <input
        type='text'
        placeholder='Type and press Enter...'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && addProduct(e.target.value)}
        className='input-field'
      />

      {/* Product List */}
      <ul className='product-list'>
        {products.map((p, index) => {
          const foundDeal = deals.find((d) =>
            d.name.toLowerCase().includes(p.name.toLowerCase())
          );
          return (
            <li key={index} className='product-item'>
              <div>
                <span className='product-name'>{p.name}</span>
                {foundDeal ? (
                  <span className='product-price'>
                    - Found at {foundDeal.store} for {foundDeal.price} kr
                  </span>
                ) : (
                  <span className='product-not-found'>- Not found</span>
                )}
              </div>
              <button onClick={() => toggleLock(index)} className='lock-button'>
                {p.locked ? <Lock size={20} /> : <Unlock size={20} />}
              </button>
              <button
                onClick={() => deleteProduct(index)}
                className='delete-button'
              >
                <Trash2 size={20} />
              </button>
            </li>
          );
        })}
      </ul>

      {/* Clear All Button */}
      <button onClick={clearProducts} className='clear-button'>
        Clear Unlocked Items
      </button>

      {/* History Section */}
      <div className='history-section'>
        <div>
          <h2 className='history-heading'>
            <History size={20} /> History
          </h2>
          <button onClick={clearHistory} className='clear-history-button'>
            Clear History
          </button>
        </div>
        <ul className='history-list'>
          {history.map((item, index) => (
            <li key={index} className='history-item'>
              <span>{item.name}</span>
              <button
                onClick={() => addFromHistory(item)}
                className='add-from-history-button'
              >
                Add to List
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity='success'>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

// Distance Calculation Function
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
