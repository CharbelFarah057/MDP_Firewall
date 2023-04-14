import React, { useState } from 'react';
import { AiOutlineQuestionCircle, AiOutlineMenu } from 'react-icons/ai';
import { FaGlobe, FaRedhat, FaNetworkWired } from 'react-icons/fa';
import { IoStatsChartSharp } from 'react-icons/io5';
import { MdPolicy } from 'react-icons/md';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './LeftNavbar.module.css';

const menuItems = [
  {
    id: 1,
    title: 'Firewall Policy',
    icon: <MdPolicy />,
    description: 'Manage firewall policies for your network.',
    path: '/tmg/firewall-policy/all-firewall-policy',
    validpath : ['/tmg/firewall-policy/all-firewall-policy']
  },
  {
    id: 2,
    title: 'Web Access Policy',
    icon: <FaGlobe />,
    description: 'Control web access with policies for different user groups.',
    path: '/tmg/web-access-policy',
    validpath : ['/tmg/web-access-policy']
  },
  {
    id: 3,
    title: 'Networking',
    icon: <FaNetworkWired />,
    description: 'Configure networking settings and monitor network traffic.',
    path: '/tmg/networking/networks',
    validpath : ['/tmg/networking/networks','/tmg/networking/network-sets','/tmg/networking/network-rules','/tmg/networking/network-adapters','/tmg/networking/routing']
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
    path: '/tmg/logging',
    validpath : ['/tmg/logging']
  },
];

const LeftNavbar = () => {
  const [isContentVisible, setIsContentVisible] = useState(true);
  const location = useLocation();
  const history = useHistory();

  const handleBurgerMenuClick = () => {
    setIsContentVisible(!isContentVisible);
  };

  const handleMenuItemClick = (path) => {
    history.push(path);
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
          <div
            className={`${styles['menu-item']} ${!isContentVisible ? styles.collapsed : ''} ${item.validpath.includes(location.pathname) ? styles.selected : ''}`}
            onClick={() => handleMenuItemClick(item.path)}
          >
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