import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

export const CndContext = createContext({});

// TODO: can add props here for e.g. Ethereum wallet uris, cnd uris
// ({ params, children })
export const CndProvider: React.FunctionComponent = ({ children }) => {
  const [taker, setCnd] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // TODO: create useCnd hook

  useEffect(() => {
    async function initializeCnd() {
      setLoading(true);

      // TODO: initialize cnd
      // setCnd(cnd);

      setLoading(false);
      setLoaded(true);
    }
    initializeCnd();
  }, []);

  // Public API
  const value = { taker, loading, loaded };

  return <CndContext.Provider value={value}>{children}</CndContext.Provider>;
};

CndProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useCnd = () => useContext(CndContext);
