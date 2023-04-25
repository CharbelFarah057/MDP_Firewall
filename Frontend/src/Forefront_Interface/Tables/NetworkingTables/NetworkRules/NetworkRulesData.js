//NetworkRulesData.js
import { FaNetworkWired } from 'react-icons/fa';
import { FcGlobe } from 'react-icons/fc';
import {HiOutlineDesktopComputer} from 'react-icons/hi';
import { MdDisabledByDefault } from 'react-icons/md';

export const rowData = [
  {
    id : 0,
    order : '1',
    name : 'Local Host Access',
    relation : 'Route',
    srcnetworks : ['Local Host'],
    dstnetworks : ['All Networks (and Local Host)'],
    nataddress : '',
    desc : '',
    disabled: false,
    icon: HiOutlineDesktopComputer,
    srcicon: FaNetworkWired,
    dsticon: FaNetworkWired,
    disabledicon: MdDisabledByDefault,
  },
  {
    id : 1,
    order : '2',
    name : 'VPN Clients to Internal Network',
    relation : 'Route',
    srcnetworks : ['Internal'],
    dstnetworks : ['Internal'],
    nataddress : '',
    desc : '',
    disabled: false,
    icon: HiOutlineDesktopComputer,
    srcicon: FaNetworkWired,
    dsticon: FaNetworkWired,
    disabledicon: MdDisabledByDefault,
  },
  {
    id : 2,
    order : '3',
    name : 'Internet Access',
    relation : 'NAT',
    srcnetworks : ['Internal'],
    dstnetworks : ['External', 'Internal'],
    nataddress : 'Default IP address',
    desc : '',
    disabled: false,
    icon: HiOutlineDesktopComputer,
    srcicon: FaNetworkWired,
    dsticon: FcGlobe,
    disabledicon: MdDisabledByDefault,
  },
];