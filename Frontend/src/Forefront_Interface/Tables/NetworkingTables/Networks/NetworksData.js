//NetworksData.js
import { FcGlobe } from 'react-icons/fc';
import { FaNetworkWired } from 'react-icons/fa';
import { VscSymbolEnum, VscSymbolConstant } from 'react-icons/vsc';

export const rowData = [
  {
    id : 0,
    name: 'External',
    description: 'Built-in network object representing the Internet.',
    addressRanges: ['IP addresses external tot he Forefront TMG networks.'],
    icon: FcGlobe,
    adicon: VscSymbolConstant,
  },
  {
    id : 1,
    name: 'Internal',
    description: 'Built-in network object representing the Forefront TMG computer.',
    addressRanges: ['10.0.5.0-10.0.5.255', '172.16.0.0'],
    icon: FaNetworkWired,
    adicon: VscSymbolEnum,
  },
  {
    id : 2,
    name: 'Local Host',
    description: 'Built-in dynamic network representing client computers connecting to Forefront TMG via VPN that are currently quarantined.',
    addressRanges: ['No iP addresses are associated with this network.'],
    icon: FaNetworkWired,
    adicon: VscSymbolConstant,
  },
];