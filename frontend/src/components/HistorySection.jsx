import React from 'react';
import { History, ChevronRight } from 'lucide-react';

const HistorySection = ({ history, clearHistory, addFromHistory }) => {
  return (
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
  );
};

export default HistorySection;
