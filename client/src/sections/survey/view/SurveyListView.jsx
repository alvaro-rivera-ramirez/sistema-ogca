import { useEffect, useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { Send as SendIcon } from '@mui/icons-material';
import TableNoData from '../table-no-data';

import TableEmptyRows from '../table-empty-rows';
import { useSurvey } from 'src/context/ListSurveyContext';
import { useAuth } from 'src/context/AuthProvider';
import { getListSurvey } from 'src/utils/fetchSurvey';
import TableHeader from 'src/components/tables/TableHeader';
import SurveyTableToolbar from '../survey-table-toolbar';
import SurveyTableRow from '../SurveyTableRow';
import { ModalComponent, ModalScrollComponent } from '../../../components/modal';
import ShareSurvey from '../ShareSurvey';
import { getListIndicator } from 'src/utils/fetchIndicator';
import { getListModel } from 'src/utils/fetchModelEval';
import { Autocomplete, Box, TextField } from '@mui/material';
import { getListCondition } from 'src/utils/fetchConditions';
import { getListComponent } from 'src/utils/fetchComponent';
import { getListMeansVerification } from 'src/utils/fetchMeansVerification';
import { getListInstitute } from 'src/utils/fetchInstitute';
import { ROLE } from 'src/constants';

const columns = [
  { id: 'codeSurvey2', label: 'Código', minWidth: 100 },
  {
    id: 'content',
    label: 'Medio de verificación',
    minWidth: 120,
    align: 'left',
  },
  {
    id: 'name_institute',
    label: 'Órgano Responsable',
    minWidth: 120,
    align: 'left',
  },
  {
    id: 'send_survey',
    label: 'Enviado',
    minWidth: 80,
    align: 'left',
  },
  {
    id: 'status_survey',
    label: 'Estado',
    minWidth: 80,
    align: 'left',
  },
  {
    id: 'options',
    label: '',
    minWidth: 120,
    align: 'left',
  },
];

export default function SurveyListView() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rowsSurvey, setRowsSurvey] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [codeRow, setCodeRow] = useState(null);
  const [typeForm, setTypeForm] = useState(null);
  const { institute, module, search } = useSurvey();
  const { accessToken,user } = useAuth();

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(1);
  };

  const handleOpenModal = async (typeForm, code = null) => {
    setCodeRow(code);
    setTypeForm(typeForm);
    if (typeForm == 'AGREGAR' || typeForm == 'COMPARTIR') {
      setOpenModal(true);
      return;
    }
    if (typeForm == 'EDITAR') {
      // const { content } = await getOneIndicator(accessToken, code);
      // setRecord({ content });
      setOpenModal(true);
    }

    if (typeForm == 'ELIMINAR') {
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setTypeForm(null);
  };

  const fetchDataSurveys = async () => {
    const { surveys, totalRecords } = await getListSurvey(
      accessToken,
      page,
      rowsPerPage,
      search,
      institute,
      module
    );
    setRowsSurvey(surveys);
    setTotalRecords(totalRecords);
  };

  useEffect(() => {
    fetchDataSurveys();
  }, [page, rowsPerPage, institute, search, module]);

  return (
    <Container>
      {(user.role==ROLE.ADMINISTRADOR && window.location.pathname=="/lista-fichas") && (

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Fichas</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => handleOpenModal('AGREGAR')}
        >
          Nueva Ficha
        </Button>
      </Stack>
      )}

      <Card>
        <SurveyTableToolbar />
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHeader columns={columns} />
              <TableBody>
                {rowsSurvey.map(
                  ({
                    codeSurvey,
                    codeSurvey2,
                    means_verification,
                    institute,
                    component,
                    indicator,
                    condition,
                    allowedEdit,
                    statusSurvey,
                  }) => (
                    <SurveyTableRow
                      key={codeSurvey}
                      uuidSurvey={codeSurvey}
                      code={codeSurvey2}
                      meansVerification={means_verification.content}
                      institute={institute.name_institute}
                      component={component.content}
                      indicator={indicator.content}
                      condition={condition.content}
                      isSend={!allowedEdit}
                      status={statusSurvey}
                      handleOpenModal={handleOpenModal}
                    />
                  )
                )}
                {rowsSurvey.length < 1 && <TableNoData />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page - 1}
          component="div"
          count={totalRecords}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        {openModal == 1 && typeForm == 'COMPARTIR' && (
          <ModalComponent title="Compartir Ficha" open={openModal} onCloseModal={handleCloseModal}>
            <ShareSurvey code={codeRow} />
          </ModalComponent>
        )}
        {openModal == 1 && typeForm == 'EDITAR' && (
          <ModalComponent title="Editar Ficha" open={openModal} onCloseModal={handleCloseModal}>
            {/* <ShareSurvey code={codeRow} /> */}
          </ModalComponent>
        )}
        {openModal == 1 && typeForm == 'AGREGAR' && (
          <ModalScrollComponent
            title="Agregar Ficha"
            open={openModal}
            onCloseModal={handleCloseModal}
          >
            <ModalCreateSurvey accessToken={accessToken} />
            {/* <ShareSurvey code={codeRow} /> */}
          </ModalScrollComponent>
        )}
      </Card>
    </Container>
  );
}

function ModalCreateSurvey({ accessToken }) {
  const [optionsModule, setOptionsModule] = useState([]);
  const [optionsCondition, setOptionsCondition] = useState([]);
  const [optionsComponent, setOptionsComponent] = useState([]);
  const [optionsIndicator, setOptionsIndicator] = useState([]);
  const [optionsInstitute, setOptionsInstitute] = useState([]);
  const [optionsMeansVf, setOptionsMeansVf] = useState([]);
  const [valueModule, setValueModule] = useState('');
  const [valueCondition, setValueCondition] = useState('');
  const [valueComponent, setValueComponent] = useState('');
  const [valueIndicator, setValueIndicator] = useState('');
  const [valueInstitute, setValueInstitute] = useState('');
  const [inputIndicator, setInputIndicator] = useState('');
  const [valueMeansVf, setValueMeansVf] = useState('');
  const [inputModule, setInputModule] = useState('');
  const [inputCondition, setInputCondition] = useState('');
  const [inputComponent, setInputComponent] = useState('');
  const [inputMeansVf, setInputMeansVf] = useState('');
  const [inputInstitute, setInputInstitute] = useState('');
  async function fetchDataIndicator(search = '') {
    try {
      const { indicator } = await getListIndicator(accessToken, 1, 10, search);
      setOptionsIndicator([...indicator]);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchDataModule(search = '') {
    const dataModuleEval = await getListModel(accessToken, 1, 10, search);
    setOptionsModule([...dataModuleEval]);
  }

  async function fetchDataCondition(search = '') {
    try {
      const { condition } = await getListCondition(accessToken, 1, 10, search);
      setOptionsCondition([...condition]);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchDataComponent(search = '') {
    const { component } = await getListComponent(accessToken, 1, 10, search);
    setOptionsComponent([...component]);
  }
  async function fetchDataMeansVF(search = '') {
    const { rowsData } = await getListMeansVerification(accessToken, 1, 10, search);
    console.log(rowsData);
    setOptionsMeansVf([...rowsData]);
  }
  async function fetchDataInstitute(search = '') {
    const institutes = await getListInstitute(accessToken, 1, 10, search);
    console.log(institutes)
    setOptionsInstitute([...institutes]);
  }

  useEffect(() => {
    fetchDataCondition(valueCondition);
  }, [inputCondition]);

  useEffect(() => {
    fetchDataComponent(valueComponent);
  }, [inputComponent]);

  useEffect(() => {
    fetchDataIndicator(valueIndicator);
  }, [inputIndicator]);
  useEffect(() => {
    fetchDataModule(valueModule);
  }, [inputModule]);
  useEffect(() => {
    fetchDataMeansVF(valueMeansVf);
  }, [inputMeansVf]);
  useEffect(() => {
    fetchDataInstitute(valueInstitute);
  }, [inputInstitute]);

  return (
    <Stack spacing={2}>
      <Autocomplete
        style={{ width: '100%' }}
        multiple={false}
        onChange={(event, newValue) => {
          setValueModule(newValue.id);
        }}
        inputValue={inputModule}
        onInputChange={(event, newInputValue) => {
          setInputModule(newInputValue);
        }}
        id="optionModule"
        noOptionsText={'No se ha encontrado modelos'}
        options={optionsModule.length > 0 ? optionsModule : []}
        sx={{ width: 300 }}
        getOptionLabel={({ name }) => `${name}`}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => (
          <TextField {...params} name="model" label="Modelo de evaluación" />
        )}
        renderOption={(props, result) => (
          <Box component="li" {...props} key={`model${result.id}`} value={result.id}>
            {result.name}
          </Box>
        )}
      />
      <Autocomplete
        style={{ width: '100%' }}
        multiple={false}
        onChange={(event, newValue) => {
          setValueCondition(newValue.id);
        }}
        inputValue={inputCondition}
        onInputChange={(event, newInputValue) => {
          setInputCondition(newInputValue);
        }}
        id="optionCondition"
        noOptionsText={'No se ha encontrado registros'}
        options={optionsCondition.length > 0 ? optionsCondition : []}
        sx={{ width: 300 }}
        getOptionLabel={({ content }) => `${content}`}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => <TextField {...params} name="condicion" label="Condición" />}
        renderOption={(props, result) => (
          <Box component="li" {...props} key={`condition${result.id}`} value={result.id}>
            {result.content}
          </Box>
        )}
      />
      <Autocomplete
        style={{ width: '100%' }}
        multiple={false}
        includeInputInList
        onChange={(event, newValue) => {
          setValueComponent(newValue.id);
        }}
        inputValue={inputComponent}
        onInputChange={(event, newInputValue) => {
          setInputComponent(newInputValue);
        }}
        id="optionComponent"
        noOptionsText={'No se ha encontrado registros'}
        options={optionsComponent.length > 0 ? optionsComponent : []}
        sx={{ width: 300 }}
        getOptionLabel={({ content }) => `${content}`}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => <TextField {...params} name="componente" label="Componente" />}
        renderOption={(props, result) => (
          <Box component="li" {...props} key={`component${result.id}`} value={result.id}>
            {result.content}
          </Box>
        )}
      />
      <Autocomplete
        style={{ width: '100%' }}
        multiple={false}
        includeInputInList
        onChange={(event, newValue) => {
          setValueIndicator(newValue.id);
        }}
        inputValue={inputIndicator}
        onInputChange={(event, newInputValue) => {
          setInputIndicator(newInputValue);
        }}
        id="optionIndicator"
        noOptionsText={'No se ha encontrado indicadores'}
        options={optionsIndicator.length > 0 ? optionsIndicator : []}
        sx={{ width: 300 }}
        getOptionLabel={({ content }) => `${content}`}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => <TextField {...params} name="indicador" label="Indicador" />}
        renderOption={(props, result) => (
          <Box component="li" {...props} key={`indicator${result.id}`} value={result.id}>
            {result.content}
          </Box>
        )}
      />
      <Autocomplete
        style={{ width: '100%' }}
        multiple={false}
        includeInputInList
        onChange={(event, newValue) => {
          setValueMeansVf(newValue.id);
        }}
        inputValue={inputMeansVf}
        onInputChange={(event, newInputValue) => {
          setInputMeansVf(newInputValue);
        }}
        id="optionMv"
        noOptionsText={'No se ha encontrado registros'}
        options={optionsMeansVf.length > 0 ? optionsMeansVf : []}
        sx={{ width: 300 }}
        getOptionLabel={({ content }) => `${content}`}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => (
          <TextField {...params} name="meansvf" label="Medio de verificación" />
        )}
        renderOption={(props, result) => (
          <Box component="li" {...props} key={`meansVf${result.id}`} value={result.id}>
            {result.content}
          </Box>
        )}
      />
      <Autocomplete
        style={{ width: '100%' }}
        multiple={false}
        includeInputInList
        onChange={(event, newValue) => {
          setValueInstitute(newValue.id);
        }}
        inputValue={inputInstitute}
        onInputChange={(event, newInputValue) => {
          setInputInstitute(newInputValue);
        }}
        id="optionIndicator"
        noOptionsText={'No se ha encontrado registros'}
        options={optionsInstitute.length > 0 ? optionsInstitute : []}
        sx={{ width: 300 }}
        getOptionLabel={({ name }) => `${name}`}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => (
          <TextField {...params} name="institute" label="Órgano responsable" />
        )}
        renderOption={(props, result) => (
          <Box component="li" {...props} key={`institute${result.id}`} value={result.id}>
            {result.name}
          </Box>
        )}
      />
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        sx={{ paddingTop: '8px' }}
      >
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={() => {}}
          style={{ backgroundColor: '#1565C0', color: 'white' }}
        >
          Guardar
        </Button>
      </Stack>
    </Stack>
  );
}
