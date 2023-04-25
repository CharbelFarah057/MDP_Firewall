//NetworkSetData.js
import { FaNetworkWired } from 'react-icons/fa';

export const rowData = [
  {
    id : 0,
    name: 'All Networks (and Local Host)',
    description: 'This predefined network set includes all networks. Predefined network sets cannot be modified.',
    type: 'Exclude',
    networks: ['External'],
    icon: FaNetworkWired,
    neticon: FaNetworkWired
  },
  {
    id : 1,
    name: 'All Networks (and Local Host)',
    description: 'This predefined network set includes all networks. Predefined network sets cannot be modified.',
    type: 'Exclude',
    networks: [],
    neticon: FaNetworkWired,
    icon: () => null,
  },
  {
    id : 2,
    name: 'Forefront Protection Manager Monitored Networks',
    description: 'This Predefined Network set of networks monitored by Forefront Protection Manager',
    type: 'Include',
    networks: ['Internal', 'External'],
    neticon: FaNetworkWired,
    icon: FaNetworkWired,
  },
];