import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import styles from './NetworkingPageTabsComponent.module.css';

const FirewallPolicyTabsComponent = () => {
  const theme = useTheme();
  const tabPath = '/tmg/firewall-policy/all-firewall-policy';

  return (
    <Box className={styles.container}>
      <Typography className={styles.title} variant="h4" component="div">
        Networking
      </Typography>
      <Tabs
        className={styles.tabs}
        value={tabPath}
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
        <Tab
          label="All Firewall Policy"
          component={Link}
          to={tabPath}
          value={tabPath}
        />
      </Tabs>
    </Box>
  );
};

export default FirewallPolicyTabsComponent;
