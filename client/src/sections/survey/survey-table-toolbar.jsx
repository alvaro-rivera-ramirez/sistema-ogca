import PropTypes from 'prop-types';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Iconify from 'src/components/iconify';
import { useState, useEffect } from 'react';
import { useAuth } from 'src/context/AuthProvider';
import { useSurvey } from 'src/context/ListSurveyContext';
import { getListInstitute } from '../../utils/fetchInstitute';
import { getListModel } from '../../utils/fetchModelEval';
import { Box } from '@mui/material';
// ----------------------------------------------------------------------

export default function SurveyTableToolbar() {
  const [itemInstitute, setItemInstitute] = useState([]);
  const [itemModule, setItemModule] = useState([]);
  const { accessToken } = useAuth();
  const { search, itemsChange } = useSurvey();
  const handleChange = ({ target }) => {
    const id = target.id;
    return itemsChange[id](target.value) || itemsChange['default'];
  };

  useEffect(() => {
    async function fetchDataInstitute() {
      const dataInstitute = await getListInstitute(accessToken);
      setItemInstitute([...dataInstitute]);
    }

    async function fetchDataModule() {
      const dataModuleEval = await getListModel(accessToken);
      setItemModule([...dataModuleEval]);
    }

    fetchDataInstitute();
    fetchDataModule();
  }, []);
  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
      }}
    >
      <OutlinedInput
        id="input-search"
        key={"input-search"}
        value={search}
        onChange={handleChange}
        placeholder="Search survey..."
        startAdornment={
          <InputAdornment position="start">
            <Iconify
              icon="eva:search-fill"
              sx={{ color: 'text.disabled', width: 20, height: 20 }}
            />
          </InputAdornment>
        }
      />

      <Autocomplete
        multiple={false}
        key={'filterInstitute'}
        onChange={({ target }) => {
          console.log(target.value)
          handleChange({ target: { id: 'itemInstitute', value: target.value } });
        }}
        noOptionsText={'No se ha encontrado dependencias'}
        id="itemInstitute"
        options={itemInstitute}
        includeInputInList
        sx={{ width: 300 }}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        getOptionLabel={({ name }) => `${name}`}
        renderInput={(params) => <TextField {...params} name="dependencia" label="Dependencia" />}
        renderOption={(props, result) => (
          <Box component="li" {...props} key={`institute${result.id}`} value={result.id}>
            {result.name}
          </Box>
        )}
      />
      <Autocomplete
        multiple={false}
        id="itemModule"
        key={'filterModule'}
        options={itemModule}
        onChange={({ target }) => {
          handleChange({ target: { id: 'itemModule', value: target.value } });
        }}
        noOptionsText={'No se ha encontrado modelos'}
        includeInputInList
        sx={{ width: 300 }}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        getOptionLabel={({ name }) => `${name}`}
        renderInput={(params) => <TextField {...params} label="Modelo de evaluación" />}
        renderOption={(props, result) => (
          <Box component="li" {...props} key={`module${result.id}`} value={result.id}>
            {result.name}
          </Box>
        )}
      />
    </Toolbar>
  );
}
