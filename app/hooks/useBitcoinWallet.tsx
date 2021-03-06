import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { InMemoryBitcoinWallet } from 'comit-sdk';

export const BitcoinWalletContext = createContext({});

// TODO: can add props here for e.g. wallet uris
// ({ params, children })
export const BitcoinWalletProvider: React.FunctionComponent = ({
  children
}) => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function initializeBitcoinWallet() {
      setLoading(true);

      const w = await InMemoryBitcoinWallet.newInstance(
        'regtest',
        process.env.BITCOIN_P2P_URI,
        process.env.BITCOIN_HD_KEY_1
      );
      await new Promise(resolve => setTimeout(resolve, 1000)); // bitcoin wallet workaround

      setWallet(w);

      setLoading(false);
      setLoaded(true);
    }
    initializeBitcoinWallet();
  }, []);

  // Public API
  const value = { wallet, loading, loaded };

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
