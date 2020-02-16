import React from 'react';

import './styles.css';

function ProgressBar({ className, progress }) {
  return (
    <div className={(className && className + ' ') + 'progress-bar'}>
      <div className="progress" style={{ width: progress + '%' }}>{progress}%</div>
    </div>
  );
}

export default ProgressBar;
