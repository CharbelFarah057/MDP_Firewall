import React from 'react';
import LeftNavbar from './LeftNavBar/LeftNavbar';
import styles from './NetworkingLayout.module.css';

const NetworkingLayout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <div>
        <LeftNavbar />
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default NetworkingLayout;