import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getTaker } from '../comit';

export const TakerContext = createContext({});

// TODO: can add props here for e.g. Ethereum wallet uris, cnd uris
// ({ params, children })
export const TakerProvider: React.FunctionComponent = ({ children }) => {
  const [taker, setTaker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // TODO: create useCnd hook
  // TODO: create useBitcoinWallet hook
  // TODO: create useEthereumWallet hook

  useEffect(() => {
    async function initializeTaker() {
      setLoading(true);

      // TODO: port full getTaker code to here instead
      const t = await getTaker();
      setTaker(t);
      setLoading(false);
      setLoaded(true);
    }
    initializeTaker();
  }, []);

  // Public API
  const value = { taker, loading, loaded };

  return (
    <TakerContext.Provider value={value}>{children}</TakerContext.Provider>
  );
};

TakerProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// Basically a useActor('1', 'Taker');
export const useTaker = () => useContext(TakerContext);
