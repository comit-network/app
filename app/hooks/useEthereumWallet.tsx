import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

export const EthereumWalletContext = createContext({});

// TODO: can add props here for e.g. wallet uris
// ({ params, children })
export const EthereumWalletProvider: React.FunctionComponent = ({
  children
}) => {
  const [taker, setEthereumWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // TODO: create useEthereumWallet hook

  useEffect(() => {
    async function initializeEthereumWallet() {
      setLoading(true);

      // TODO: initialize wallet
      const wallet = {};
      setEthereumWallet(wallet);

      setLoading(false);
      setLoaded(true);
    }
    initializeEthereumWallet();
  }, []);

  // Public API
  const value = { taker, loading, loaded };

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
