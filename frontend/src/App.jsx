import React, { useState, useEffect } from 'react';
import { fetchDeals } from './services/api';
import { Snackbar, Alert, Modal, Box, Typography } from '@mui/material';
import {
  Trash2,
  History,
  Lock,
  Unlock,
  Heart,
  HeartOff,
  ChevronRight,
  Plus,
} from 'lucide-react';
import './index.css';
import './styles.css';

export default function App() {
  const [products, setProducts] = useState([]);
  const [radius, setRadius] = useState(10);
  const [location, setLocation] = useState(null);
  const [deals, setDeals] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isFavoritesPopupOpen, setIsFavoritesPopupOpen] = useState(false);

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
    const newProduct = {
      name: product,
      store: '',
      price: null,
      locked: false,
      isFavorite: false,
      addedOn: new Date().toLocaleString(),
    };

    setProducts([...products, newProduct]);
    setHistory([newProduct, ...history]); // Add new product to the top of the history list
    setSnackbar({ open: true, message: `${product} added to your list!` });
    setInputValue('');
  };

  const deleteProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
    setSnackbar({
      open: true,
      message: `${products[index].name} deleted from your list!`,
    });
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
    setSnackbar({
      open: true,
      message: `${products[index].name} ${
        updatedProducts[index].locked ? 'locked' : 'unlocked'
      }!`,
    });
  };

  const addFromHistory = (product) => {
    setProducts([...products, { ...product, locked: false }]);
    setSnackbar({ open: true, message: `${product.name} added to your list!` });
  };

  const clearHistory = () => {
    setHistory([]);
    setSnackbar({ open: true, message: 'History cleared!' });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '' });
  };

  const toggleFavorite = (index) => {
    const updatedProducts = [...products];
    const product = updatedProducts[index];
    product.isFavorite = !product.isFavorite;

    if (product.isFavorite) {
      setFavorites([...favorites, product]);
    } else {
      const updatedFavorites = favorites.filter(
        (fav) => fav.name !== product.name
      );
      setFavorites(updatedFavorites);
    }

    setProducts(updatedProducts);
    setSnackbar({
      open: true,
      message: `${product.name} ${
        product.isFavorite ? 'added to' : 'removed from'
      } favorites!`,
    });

    if (favorites.length === 1 && !product.isFavorite) {
      setIsFavoritesPopupOpen(false);
    }
  };

  const openFavoritesPopup = () => {
    setIsFavoritesPopupOpen(true);
  };

  const closeFavoritesPopup = () => {
    setIsFavoritesPopupOpen(false);
    setSnackbar({ open: true, message: 'Favorites popup closed!' });
  };

  const deleteFromFavorites = (index) => {
    const updatedFavorites = favorites.filter((_, i) => i !== index);
    setFavorites(updatedFavorites);

    const itemToDelete = favorites[index];
    const updatedProducts = products.map((product) =>
      product.name === itemToDelete.name
        ? { ...product, isFavorite: false }
        : product
    );
    setProducts(updatedProducts);

    setSnackbar({
      open: true,
      message: `${itemToDelete.name} removed from favorites!`,
    });

    if (updatedFavorites.length === 0) {
      setIsFavoritesPopupOpen(false);
    }
  };

  const handleDoubleClickFavoritesIcon = () => {
    const updatedProducts = products.map((product) => ({
      ...product,
      isFavorite: true,
    }));
    setProducts(updatedProducts);
    setFavorites(updatedProducts);
    setSnackbar({ open: true, message: 'All items added to favorites!' });
  };

  // Function to add a favorite item back to the product list
  const addFavoriteToProductList = (item) => {
    setProducts([...products, { ...item, locked: false }]);
    setSnackbar({ open: true, message: `${item.name} added to your list!` });
  };

  return (
    <div className='app-container'>
      <div className='app-content'>
        <h1 className='heading'>🛒 Every Day Deals</h1>

        {/* Input Fields */}
        <div className='input-group'>
          <label>Search Radius (km):</label>
          <input
            type='number'
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className='input-field'
          />
        </div>

        <div className='input-group'>
          <label>Add a Product:</label>
          <input
            type='text'
            placeholder='Type and press Enter...'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addProduct(e.target.value)}
            className='input-field'
          />
        </div>

        {/* Product List */}
        {products.length > 0 && (
          <div className='product-scroll-container'>
            <ul className='product-list'>
              {products.map((p, index) => {
                const foundDeal = deals.find((d) => {
                  const productName = p.name.toLowerCase().trim();
                  const dealName = d.name.toLowerCase().trim();
                  return dealName === productName;
                });
                return (
                  <li key={index} className='product-item'>
                    <div>
                      <span className='product-name'>{p.name}</span>
                      {foundDeal ? (
                        <span className='product-price'>
                          - Found at {foundDeal.store} for{' '}
                          {foundDeal.price || 'N/A'} kr
                        </span>
                      ) : (
                        <span className='product-not-found'>- Not found</span>
                      )}
                    </div>
                    <div className='product-actions'>
                      <button
                        onClick={() => toggleLock(index)}
                        className='lock-button'
                      >
                        {p.locked ? <Lock size={20} /> : <Unlock size={20} />}
                      </button>
                      <button
                        onClick={() => deleteProduct(index)}
                        className='delete-button'
                      >
                        <Trash2 size={20} />
                      </button>
                      <button
                        onClick={() => toggleFavorite(index)}
                        className='favorite-button'
                      >
                        {p.isFavorite ? (
                          <Heart size={20} fill='red' />
                        ) : (
                          <HeartOff size={20} />
                        )}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
            {products.length > 5 && <div className='scroll-indicator'></div>}
          </div>
        )}

        {/* Favorites Icon */}
        {favorites.length > 0 && (
          <div
            onClick={openFavoritesPopup}
            onDoubleClick={handleDoubleClickFavoritesIcon}
            className='favorites-icon-button'
          >
            <Heart size={24} />
            <span className='favorites-count'>{favorites.length}</span>
          </div>
        )}

        {/* Favorites Popup */}
        <Modal
          open={isFavoritesPopupOpen}
          onClose={closeFavoritesPopup}
          aria-labelledby='favorites-popup-title'
          aria-describedby='favorites-popup-description'
        >
          <Box className='favorites-popup'>
            <Typography id='favorites-popup-title' variant='h6' component='h2'>
              Favorites ({favorites.length})
            </Typography>
            <ul className='favorites-list'>
              {favorites.map((item, index) => {
                const foundDeal = deals.find((d) => {
                  const productName = item.name.toLowerCase().trim();
                  const dealName = d.name.toLowerCase().trim();
                  return dealName === productName;
                });
                return (
                  <li key={index} className='favorites-item'>
                    <div>
                      <span className='product-name'>{item.name}</span>
                      {foundDeal ? (
                        <span className='product-price'>
                          - Found at {foundDeal.store} for{' '}
                          {foundDeal.price || 'N/A'} kr
                        </span>
                      ) : (
                        <span className='product-not-found'>- Not found</span>
                      )}
                    </div>
                    <div className='favorites-item-actions'>
                      <button
                        onClick={() => addFavoriteToProductList(item)}
                        className='add-to-list-button'
                      >
                        <Plus size={20} />
                      </button>
                      <button
                        onClick={() => deleteFromFavorites(index)}
                        className='delete-button'
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
            <button
              onClick={closeFavoritesPopup}
              className='close-favorites-popup-button'
            >
              Close
            </button>
          </Box>
        </Modal>

        {/* Clear Button */}
        <button onClick={clearProducts} className='clear-button'>
          Clear Unlocked Items
        </button>

        {/* History Section */}
        {history.length > 0 && (
          <div className='history-section'>
            <div className='history-header'>
              <h2 className='history-heading'>
                <History size={20} /> History
              </h2>
              <button onClick={clearHistory} className='clear-history-button'>
                Clear History
              </button>
            </div>
            <div className='history-scroll-container'>
              <ul className='history-list'>
                {history.map((item, index) => (
                  <li key={index} className='history-item'>
                    <div>
                      <span className='history-item-name'>{item.name}</span>
                    </div>
                    <button
                      onClick={() => addFromHistory(item)}
                      className='add-from-history-button'
                    >
                      <ChevronRight size={20} />
                    </button>
                  </li>
                ))}
              </ul>
              {history.length > 3 && <div className='scroll-indicator'></div>}
            </div>
          </div>
        )}

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
