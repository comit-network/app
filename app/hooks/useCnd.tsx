import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Cnd } from 'comit-sdk';

export const CndContext = createContext({});

export const CndProvider: React.FunctionComponent = ({ url, children }) => {
  const [cnd, setCnd] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function initializeCnd() {
      setLoading(true);

      const c = new Cnd(url);
      setCnd(c);

      setLoading(false);
      setLoaded(true);
    }
    initializeCnd();
  }, []);

  // Public API
  const value = { cnd, loading, loaded };

  return <CndContext.Provider value={value}>{children}</CndContext.Provider>;
};

CndProvider.propTypes = {
  children: PropTypes.node.isRequired,
  url: PropTypes.string.isRequired
};

export const useCnd = () => useContext(CndContext);
