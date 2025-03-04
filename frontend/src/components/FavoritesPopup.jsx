import React from 'react';
import { Modal, Box, Typography } from '@mui/material';
import { Plus, Trash2 } from 'lucide-react';

const FavoritesPopup = ({
  isFavoritesPopupOpen,
  closeFavoritesPopup,
  favorites,
  dummyData,
  addFavoriteToProductList,
  deleteFromFavorites,
}) => {
  return (
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
            const foundDeal = dummyData.find((d) => {
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
                      - Found at {foundDeal.store} for {foundDeal.price} kr
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
  );
};

export default FavoritesPopup;
