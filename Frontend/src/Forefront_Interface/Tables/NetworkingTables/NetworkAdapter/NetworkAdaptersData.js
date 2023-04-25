//NetworkAdaptersData.js
import {TbNetwork} from 'react-icons/tb';
import { MdDisabledByDefault } from 'react-icons/md';

export const rowData = [
  {
    id : 0,
    name : 'Exam Room A',
    type : 'Static',
    ip : '172.16.0.1',
    subnet : '255.255.255.0',
    status : 'Connected',
    disabled: false,
    icon: TbNetwork,
    disabledicon: MdDisabledByDefault,
  },
  {
    id : 1,
    name : 'Exam Room B',
    type : 'Static',
    ip : '10.0.5.1',
    subnet : '255.255.255.0',
    status : 'Connected',
    disabled: false,
    icon: TbNetwork,
    disabledicon: MdDisabledByDefault,
  },
  {
    id : 2,
    name : 'WAN',
    type : 'Static',
    ip : '192.168.0.1',
    subnet : '255.255.255.0',
    status : 'Connected',
    disabled: false,
    icon: TbNetwork,
    disabledicon: MdDisabledByDefault,
  },
];