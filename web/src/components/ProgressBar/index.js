import React, { useState, useEffect } from 'react';

import './styles.css';

function ProgressBar({ className, progress }) {
  const classNameAttr = `${(className !== undefined ? className + ' ' : '')}progress-bar`;

  const [ currentProgress, setCurrentProgress ] = useState(0);

  useEffect(() => {
    setCurrentProgress(progress || 0);
  }, [progress]);

  return (
    <div className={classNameAttr}>
      <div className="progress" style={{ width: currentProgress + '%' }}>{currentProgress}%</div>
    </div>
  );
}

export default ProgressBar;
