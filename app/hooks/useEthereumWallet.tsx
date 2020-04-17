import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { EthereumWallet } from 'comit-sdk';

export const EthereumWalletContext = createContext({});

// TODO: can add props here for e.g. wallet uris
// ({ params, children })
export const EthereumWalletProvider: React.FunctionComponent = ({
  children
}) => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function initializeEthereumWallet() {
      setLoading(true);

      const w = new EthereumWallet(
        process.env.ETHEREUM_NODE_HTTP_URL,
        process.env.ETHEREUM_KEY_1
      );
      setWallet(w);

      setLoading(false);
      setLoaded(true);
    }
    initializeEthereumWallet();
  }, []);

  // Public API
  const value = { wallet, loading, loaded };

  return (
    <EthereumWalletContext.Provider value={value}>
      {children}
    </EthereumWalletContext.Provider>
  );
};

EthereumWalletProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useEthereumWallet = () => useContext(EthereumWalletContext);
