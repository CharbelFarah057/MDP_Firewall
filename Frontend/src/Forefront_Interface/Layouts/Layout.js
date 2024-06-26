//Layout.js
import React from 'react';
import LeftNavbar from '../LeftNavBar/LeftNavbar';
import styles from './LayoutStyling.module.css';

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <div>
        <LeftNavbar />
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Layout;