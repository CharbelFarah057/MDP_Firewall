import React, { useState } from 'react';
import { AiOutlineQuestionCircle, AiOutlineMenu } from 'react-icons/ai';
import {FaGlobe, FaRedhat, FaNetworkWired} from 'react-icons/fa';
import {IoStatsChartSharp} from 'react-icons/io5';
import {MdPolicy} from 'react-icons/md';
import styles from './LeftNavbar.module.css';

const menuItems = [
  {
    id: 1,
    title: 'Firewall Policy',
    icon: <MdPolicy />,
    description: 'Manage firewall policies for your network.',
  },
  {
    id: 2,
    title: 'Web Access Policy',
    icon: <FaGlobe />,
    description: 'Control web access with policies for different user groups.',
  },
  {
    id: 3,
    title: 'Networking',
    icon: <FaNetworkWired />,
    description: 'Configure networking settings and monitor network traffic.',
  },
  {
    id: 4,
    title: 'Logging',
    icon: <IoStatsChartSharp />,
    description: [
      'View logs and generate reports',
      <br key="line-break" />,
      'for system events.',
    ],
  },
];


const LeftNavbar = () => {
  const [isContentVisible, setIsContentVisible] = useState(true);

  const handleBurgerMenuClick = () => {
    setIsContentVisible(!isContentVisible);
  };

  return (
    <div className={`${styles.container} ${!isContentVisible ? styles.collapsed : ''}`}>
      <div className={styles['header-container']}>
        <div className={`${styles.logo} ${!isContentVisible ? styles.collapsed : ''}`}>
          <FaRedhat className={styles['logo-icon']} style={{ color: 'red' }} />
          Linux Forefront Threat Management Gateway
        </div>
        <div
          className={`${styles['burger-menu']} ${!isContentVisible ? styles.collapsed : ''}`}
          onClick={handleBurgerMenuClick}
        >
          <AiOutlineMenu />
        </div>
      </div>
      {menuItems.map((item) => (
        <div key={item.id}>
          <div className={`${styles['menu-item']} ${!isContentVisible ? styles.collapsed : ''}`}>
            <div className={styles.icon}>{item.icon}</div>
            <div className={styles.title}>{item.title}</div>
            <div className={styles['question-icon']}>
              <AiOutlineQuestionCircle />
              <span className={styles.tooltip}>{item.description}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default LeftNavbar;