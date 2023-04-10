import React from 'react';
import LeftNavbar from './LeftNavBar/LeftNavbar';
import styles from './TMG.module.css';

const TMG = () => {
  return (
    <div className={styles.container}>
      <div>
        <LeftNavbar />
      </div>
      {/* Add more components here */}
    </div>
  );
};

export default TMG;
