import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../UserContext';
import './FirstTimeUserPage.css';

const FirstTimeUserPage = () => {
    const [userContext] = useContext(UserContext)
    const history = useHistory();
    const [username, setUsername] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [ipRangeFrom, setIpRangeFrom] = useState(['', '', '', '']);
    const [subnetMask, setSubnetMask] = useState('');
    const [defaultGateWay, setDefaultGateWay] = useState(['', '', '', '']);
    const [ipRanges, setIpRanges] = useState([]);
    
    const [externalIpRangeFrom, setExternalIpRangeFrom] = useState(['', '', '', '']);
    const [externalSubnetMask, setExternalSubnetMask] = useState('');
    const [externalDefaultGateWay, setExternalDefaultGateWay] = useState(['', '', '', '']);
    const [dnsServer, setDnsServer] = useState(['', '', '', '']);
    const [externalIpRanges, setExternalIpRanges] = useState([]);

    function generateUniqueId() {
      return Math.random().toString(36).substr(2, 9);
    }  
   
    const handleAddIpRange = () => {
        setIpRanges([
          ...ipRanges,
          {
            networkDestination: ipRangeFrom.join('.'),
            netmask: subnetMask,
            gateway: defaultGateWay.join('.'),
          },
        ]);
        setIpRangeFrom(['', '', '', '']);
        setSubnetMask('');
        setDefaultGateWay(['', '', '', '']);
      };

    const updateIp = (index, value) => {
        const updatedIpRangeFrom = [...ipRangeFrom];
        updatedIpRangeFrom[index] = value;
        setIpRangeFrom(updatedIpRangeFrom);
    };

    const updateMask = (index, value) => {
        const updatedMask = [...subnetMask];
        updatedMask[index] = value;
        setSubnetMask(updatedMask);
    };

    const updateGateway = (index, value) => {
        const updatedGateway = [...defaultGateWay];
        updatedGateway[index] = value;
        setDefaultGateWay(updatedGateway);
    };

    const handleAddExternalIpRange = () => {
        setExternalIpRanges([
        ...externalIpRanges,
        {
          networkDestination: externalIpRangeFrom.join('.'),
          netmask: externalSubnetMask,
          gateway: externalDefaultGateWay.join('.'),
          dnsServer: dnsServer.join('.'),
        },
      ]);
      setExternalIpRangeFrom(['', '', '', '']);
      setExternalSubnetMask('');
      setExternalDefaultGateWay(['', '', '', '']);
      setDnsServer(['', '', '', '']);
    };
  
    const updateExternalIp = (index, value) => {
      const updatedIpRangeFrom = [...externalIpRangeFrom];
      updatedIpRangeFrom[index] = value;
      setExternalIpRangeFrom(updatedIpRangeFrom);
    };
  
    const updateExternalMask = (index, value) => {
      const updatedMask = [...externalSubnetMask];
      updatedMask[index] = value;
      setExternalSubnetMask(updatedMask);
    };
  
    const updateExternalGateway = (index, value) => {
      const updatedGateway = [...externalDefaultGateWay];
      updatedGateway[index] = value;
      setExternalDefaultGateWay(updatedGateway);
    };
  
    const updateDnsServer = (index, value) => {
      const updatedDnsServer = [...dnsServer];
      updatedDnsServer[index] = value;
      setDnsServer(updatedDnsServer);
    };

    const handleNext = () => {
      // Save data here
      console.log('Saving data...'); // Replace with your saving logic
    
      // Send POST request
      fetch('http://localhost:3001/api/users/setup', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization : `Bearer ${userContext.token}`,
        },
        body: JSON.stringify({
          username: username,
          currentPassword: currentPassword,
          newPassword: password,
          internal_ipRanges: ipRanges,
          external_ipRanges: externalIpRanges,
        }),
      })
      .then((response) => {
        if (response.ok) {
          history.push('/tmg')
        } else {
          return response.json().then((errorData) => {
            console.log(errorData.message)
          });
        }
      })
    };

  return (
    <div className="first-time-user-page">
      <h2>Set up wizard for the Firewall Management on Linux</h2>
      <p>
        As first time users it is important to change your password, and set up
        the interfaces so the Firewall App functions as it is supposed to be.
      </p>
      <div className="form-group">
        <label htmlFor="username">Change password and username</label>
        <label htmlFor="new-username" className="input-label">
          New username
        </label>
        <input
          type="text"
          id="new-username"
          className="input-field"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="current-password" className="input-label">
          Current password
        </label>
        <input
          type="password"
          id="current-password"
          className="input-field"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <label htmlFor="new-password" className="input-label">
          New password
        </label>
        <input
          type="password"
          id="new-password"
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <p>Add your internal network ip address</p>
        <div className="form-group ip-range">
        <label htmlFor="ip-range-from" className="input-label">
            IP Address:
        </label>
        {ipRangeFrom.map((ip, index) => (
            <>
                <input
                key={generateUniqueId}
                type="number"
                className="input-field ip"
                value={ip}
                onChange={(e) => updateIp(index, e.target.value)}
                />
                {index !== ipRangeFrom.length - 1 && <span className="dot">.</span>}
            </>
        ))}
        </div>
        <div className="form-group  ip-range">
        <label htmlFor="subnet-id" className="input-label">
            Subnet Mask:
        </label>
        <input
            type="number"
            className="input-field ip"
            value={subnetMask}
            onChange={(e) => updateMask(0, e.target.value)}
        />
        </div>
        <div className="form-group ip-range">
        <label htmlFor="subnet-id" className="input-label">
            Default Gateway:
        </label>
        {defaultGateWay.map((ip, index) => (
            <>
                <input
                key={generateUniqueId}
                type="number"
                className="input-field ip"
                value={ip}
                onChange={(e) => updateGateway(index, e.target.value)}
                />
                {index !== defaultGateWay.length - 1 && <span className="dot">.</span>}
            </>
        ))}
        </div>
        <button onClick={handleAddIpRange}>Add</button>
        <div className="ip-ranges-display">
        <table>
            <thead>
            <tr>
                <th>Network Destination</th>
                <th>Netmask</th>
                <th>Gateway</th>
            </tr>
            </thead>
            <tbody>
            {ipRanges.map((ipRange, index) => (
                <tr key={index} className="ip-range-item">
                <td>{ipRange.networkDestination}</td>
                <td>{ipRange.netmask}</td>
                <td>{ipRange.gateway}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
        <p>Add your external network ip address</p>
        <div className="form-group ip-range">
        <label htmlFor="ip-range-from" className="input-label">
            IP Address:
        </label>
        {externalIpRangeFrom.map((ip, index) => (
            <>
                <input
                key={index}
                type="number"
                className="input-field ip"
                value={ip}
                onChange={(e) => updateExternalIp(index, e.target.value)}
                />
                {index !== externalIpRangeFrom.length - 1 && <span className="dot">.</span>}
            </>
        ))}
        </div>
        <div className="form-group ip-range">
        <label htmlFor="ip-range-from" className="input-label">
            Subnet Mask:
        </label>
        <input
            type="number"
            className="input-field ip"
            value={externalSubnetMask}
            onChange={(e) => updateExternalMask(0, e.target.value)}
        />

        </div>
        <div className="form-group ip-range">
        <label htmlFor="ip-range-from" className="input-label">
            Default Gateway:
        </label>
        {externalDefaultGateWay.map((ip, index) => (
            <>
                <input
                key={index}
                type="number"
                className="input-field ip"
                value={ip}
                onChange={(e) => updateExternalGateway(index, e.target.value)}
                />
                {index !== externalDefaultGateWay.length - 1 && <span className="dot">.</span>}
            </>
        ))}
        </div>
        <div className="form-group ip-range">
        <label htmlFor="ip-range-from" className="input-label">
            DNS Server:
        </label>
        {dnsServer.map((ip, index) => (
            <>
                <input
                key={index}
                type="number"
                className="input-field ip"
                value={ip}
                onChange={(e) => updateDnsServer(index, e.target.value)}
                />
                {index !== dnsServer.length - 1 && <span className="dot">.</span>}
            </>
        ))}
        </div>
        <button onClick={handleAddExternalIpRange}>Add</button>
        <div className="ip-ranges-display">
        <table>
            <thead>
            <tr>
                <th>Network Destination</th>
                <th>Netmask</th>
                <th>Gateway</th>
                <th>DNS Server</th>
            </tr>
            </thead>
            <tbody>
            {externalIpRanges.map((externalIpRanges, index) => (
                <tr key={index} className="ip-range-item">
                <td>{externalIpRanges.networkDestination}</td>
                <td>{externalIpRanges.netmask}</td>
                <td>{externalIpRanges.gateway}</td>
                <td>{externalIpRanges.dnsServer}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
        <button className="next-button" onClick={handleNext}>Next</button>
    </div>
  );
};

export default FirstTimeUserPage;
