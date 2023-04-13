import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Link, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import styles from './TabsComponent.module.css';

const TABS = [
  { label: 'Networks', path: '/tmg/networking/networks' },
  { label: 'Network Sets', path: '/tmg/networking/network-sets' },
  { label: 'Network Rules', path: '/tmg/networking/network-rules' },
  { label: 'Network Adapters', path: '/tmg/networking/network-adapters' },
  { label: 'Routing', path: '/tmg/networking/routing' },
];

const TabsComponent = ({ activeTab, setActiveTab }) => {
  const theme = useTheme();
  const location = useLocation();

  React.useEffect(() => {
    const matchingTab = TABS.find(tab => location.pathname.startsWith(tab.path));
    if (matchingTab) {
      setActiveTab(matchingTab.path);
    }
  }, [location.pathname, setActiveTab]);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box className={styles.container}>
      <Typography className={styles.title} variant="h4" component="div">
        Networking
      </Typography>
      <Tabs
        className={styles.tabs}
        value={activeTab}
        onChange={handleChange}
        textColor="inherit"
        indicatorColor="primary"
        aria-label="TMG tabs"
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          '& .MuiTab-root': {
            color: theme.palette.mode === 'dark' ? '#fff' : '#000',
            textTransform: 'none',
          },
          '& .Mui-selected': {
            color: theme.palette.primary.main,
          },
        }}
      >
        {TABS.map(tab => (
          <Tab
            key={tab.path}
            label={tab.label}
            component={Link}
            to={tab.path}
            value={tab.path}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default TabsComponent;
