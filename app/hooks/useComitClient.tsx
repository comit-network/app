import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ComitClient } from 'comit-sdk';

export const ComitClientContext = createContext({});

// TODO: can add props here for e.g. Ethereum wallet uris, cnd uris
// ({ params, children })
export const ComitClientProvider: React.FunctionComponent = ({ children }) => {
  const [taker, setComitClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function initializeComitClient() {
      setLoading(true);

      // TODO
      // const comitClient = new ComitClient(cnd)
      // .withBitcoinWallet(bitcoinWallet)
      // .withEthereumWallet(ethereumWallet);

      const client = {};
      setComitClient(client);

      setLoading(false);
      setLoaded(true);
    }
    initializeComitClient();
  }, []);

  // Public API
  const value = { taker, loading, loaded };

  return (
    <ComitClientContext.Provider value={value}>
      {children}
    </ComitClientContext.Provider>
  );
};

ComitClientProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useComitClient = () => useContext(ComitClientContext);
