//FirewallPolicyData.js
import React from "react";
import { AiOutlineNumber, AiFillCheckCircle, AiOutlineStop } from 'react-icons/ai';
import { FiUsers } from 'react-icons/fi';
import { FaNetworkWired } from 'react-icons/fa';
import { MdDisabledByDefault } from 'react-icons/md';
import { FcGlobe } from 'react-icons/fc';

export const rowData = [
  {
    id : 0,
    order : '1',
    name : 'Rule 1',
    act : 'Deny',
    protoc : ["SSH", "Telnet Server", "Telnet"],
    FL : ['External', 'Internal'],
    to : ['Internal'],
    cond : 'All Users',
    desc : '',
    pol : 'Array',
    disabled: false,
    ordicon: AiOutlineNumber,
    actionicon: (props) => (
      <AiOutlineStop {...props} style={{ ...props.style, color: 'red' }} />
    ),
    protocicon: FaNetworkWired,
    fromicon: FcGlobe,
    toicon: FaNetworkWired,
    condicon: FiUsers,
    disabledicon: MdDisabledByDefault,
  },
  {
    id : 1,
    order : '2',
    name : 'Rule 2',
    act : 'Allow',
    protoc : ['All Outbound Traffic'],
    FL : ['External'],
    to : ['Internal'],
    cond : 'All Users',
    desc : '',
    pol : 'Array',
    disabled: false,
    ordicon: AiOutlineNumber,
    actionicon: (props) => (
      <AiFillCheckCircle
        {...props}
        style={{
          ...props.style,
          color: 'white',
          backgroundColor: 'green',
          borderRadius: '50%',
        }}
      />
    ),
    protocicon: FaNetworkWired,
    fromicon: FcGlobe,
    toicon: FaNetworkWired,
    condicon: FiUsers,
    disabledicon: MdDisabledByDefault,
  },
  {
    id : 2,
    order : '3',
    name : 'Rule 3',
    act : 'Allow',
    protoc : ['All Outbound Traffic'],
    FL : ['External'],
    to : ['Internal'],
    cond : 'All Users',
    desc : '',
    pol : 'Array',
    disabled: false,
    ordicon: AiOutlineNumber,
    actionicon: (props) => (
      <AiFillCheckCircle
        {...props}
        style={{
          ...props.style,
          color: 'white',
          backgroundColor: 'green',
          borderRadius: '50%',
        }}
      />
    ),
    protocicon: FaNetworkWired,
    fromicon: FcGlobe,
    toicon: FaNetworkWired,
    condicon: FiUsers,
    disabledicon: MdDisabledByDefault,
  },
  {
    id : 3,
    order : 'Last',
    name : 'Default Rule',
    act : 'Deny',
    protoc : ['All Traffic'],
    FL : ['All Networks (and Local Host)'],
    to : ['All Networks (and Local Host)'],
    cond : 'All Users',
    desc : '',
    pol : 'Array',
    disabled: false,
    ordicon: AiOutlineNumber,
    actionicon: (props) => (
      <AiOutlineStop {...props} style={{ ...props.style, color: 'red' }} />
    ),
    protocicon: FaNetworkWired,
    fromicon: FaNetworkWired,
    toicon: FaNetworkWired,
    condicon: FiUsers,
    disabledicon: MdDisabledByDefault,
  },
];