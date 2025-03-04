import React, { useState, useEffect } from 'react';
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
  Loader2,
} from 'lucide-react';
import './index.css';
import './styles.css';

import ProductList from './components/ProductList';
import FavoritesPopup from './components/FavoritesPopup';
import HistorySection from './components/HistorySection';
import InputFields from './components/InputFields';
import SnackbarAlert from './components/SnackbarAlert';

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
  const [loadingDeals, setLoadingDeals] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => console.warn(err)
    );
  }, []);

  useEffect(() => {
    if (location) {
      setLoadingDeals(true);
      fetch('/api/deals')
        .then((res) => res.json())
        .then((data) => {
          setLoadingDeals(false);
          setDeals(data);
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

  const addFavoriteToProductList = (item) => {
    setProducts([...products, { ...item, locked: false }]);
    setSnackbar({ open: true, message: `${item.name} added to your list!` });
  };

  return (
    <div className="app-container relative">
      {loadingDeals ? (
        <div className="loading-spinner-container">
          <Loader2 size={48} />
        </div>
      ) : null}

      <div className="app-content">
        <h1 className="heading">🛒 Every Day Deals</h1>

        <InputFields
          radius={radius}
          setRadius={setRadius}
          inputValue={inputValue}
          setInputValue={setInputValue}
          addProduct={addProduct}
        />

        <ProductList
          products={products}
          dummyData={deals}
          deleteProduct={deleteProduct}
          toggleLock={toggleLock}
          toggleFavorite={toggleFavorite}
        />

        {favorites.length > 0 && (
          <div
            onClick={openFavoritesPopup}
            onDoubleClick={handleDoubleClickFavoritesIcon}
            className="favorites-icon-button"
          >
            <Heart size={24} />
            <span className="favorites-count">{favorites.length}</span>
          </div>
        )}

        <FavoritesPopup
          isFavoritesPopupOpen={isFavoritesPopupOpen}
          closeFavoritesPopup={closeFavoritesPopup}
          favorites={favorites}
          dummyData={deals}
          addFavoriteToProductList={addFavoriteToProductList}
          deleteFromFavorites={deleteFromFavorites}
        />

        <button onClick={clearProducts} className="clear-button">
          Clear Unlocked Items
        </button>

        <HistorySection
          history={history}
          clearHistory={clearHistory}
          addFromHistory={addFromHistory}
        />

        <SnackbarAlert
          snackbar={snackbar}
          handleCloseSnackbar={handleCloseSnackbar}
        />
      </div>
    </div>
  );
}
