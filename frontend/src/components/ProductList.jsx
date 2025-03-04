import React from 'react';
import { Trash2, Lock, Unlock, Heart, HeartOff } from 'lucide-react';

const ProductList = ({
  products,
  dummyData,
  deleteProduct,
  toggleLock,
  toggleFavorite,
}) => {
  return (
    <div className='product-scroll-container'>
      <ul className='product-list'>
        {products.map((p, index) => {
          const foundDeal = dummyData.find((d) => {
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
                    - Found at {foundDeal.store} for {foundDeal.price} kr
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
  );
};

export default ProductList;
