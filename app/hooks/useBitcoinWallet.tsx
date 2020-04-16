import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

export const BitcoinWalletContext = createContext({});

// TODO: can add props here for e.g. wallet uris
// ({ params, children })
export const BitcoinWalletProvider: React.FunctionComponent = ({
  children
}) => {
  const [taker, setBitcoinWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // TODO: create useBitcoinWallet hook

  useEffect(() => {
    async function initializeBitcoinWallet() {
      setLoading(true);

      // TODO: initialize wallet
      const wallet = {};
      setBitcoinWallet(wallet);

      setLoading(false);
      setLoaded(true);
    }
    initializeBitcoinWallet();
  }, []);

  // Public API
  const value = { taker, loading, loaded };

  return (
    <BitcoinWalletContext.Provider value={value}>
      {children}
    </BitcoinWalletContext.Provider>
  );
};

BitcoinWalletProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useBitcoinWallet = () => useContext(BitcoinWalletContext);
