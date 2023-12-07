import { createContext, useContext, useState } from 'react';

const SurveyContext = createContext({
  institute: '',
  module: '',
  search: '',
  itemsChange: {},
});

export const SurveyListContextProvider = ({ children }) => {
  const [institute, setInstitute] = useState("");
  const [module, setModule] = useState("");
  const [search, setSearch] = useState('');

  const itemsChange = {
    'itemInstitute': (value) => {
      setInstitute(value);
    },
    'itemModule': (value) => {
      setModule(value);
    },
    'input-search': (value) => {
      setSearch(value);
    },
    'default': 0,
  };

  return (
    <SurveyContext.Provider value={{ module, institute, search, itemsChange }}>
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => useContext(SurveyContext);
