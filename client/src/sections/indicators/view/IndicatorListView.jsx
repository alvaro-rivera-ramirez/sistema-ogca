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
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Send as SendIcon } from '@mui/icons-material';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import TableNoData from '../table-no-data';
import { useAuth } from 'src/context/AuthProvider';
import TableHeader from 'src/components/tables/TableHeader';
import IndicatorTableToolbar from '../IndicatorTableToolbar';
import { ModalComponent } from '../../../components/modal';
import {
  createIndicator,
  getListIndicator,
  getOneIndicator,
  updateIndicator,
} from 'src/utils/fetchIndicator';
import IndicatorTableRow from '../IndicatorTableRow';
import { createIndicatorValidate } from 'src/sections/validators';
import { Box, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import { error } from 'src/theme/palette';

const columns = [
  {
    id: 'content',
    label: 'Indicador',
    minWidth: 120,
    align: 'left',
  },
  {
    id: 'options',
    label: '',
    minWidth: 120,
    align: 'left',
  },
];

export default function IndicatorListView() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rowsIndicator, setRowsIndicator] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [typeForm, setTypeForm] = useState(null);
  const [codeRow, setCodeRow] = useState(null);
  const [search, setSearch] = useState('');
  const [cargando, setCargando] = useState(true);
  const [record, setRecord] = useState({})
  const { accessToken } = useAuth();

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(1);
  };

  const handleChangeSearch = ({ target }) => {
    setSearch(target.value);
  };
  const handleOpenModal = async(typeForm, code = null) => {
    setCodeRow(code);
    setTypeForm(typeForm);
    if (typeForm == 'AGREGAR') {
      setOpenModal(true);
      return;
    }
    if (typeForm == 'EDITAR') {
      const { content } = await getOneIndicator(accessToken,code);
      setRecord({content});  
      setOpenModal(true);
    }
    if (typeForm == 'ELIMINAR') {
    }

    
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const fetchIndicator = async () => {
    const { indicator, totalRecords } = await getListIndicator(
      accessToken,
      page,
      rowsPerPage,
      search
    );
    setRowsIndicator(indicator);
    setTotalRecords(totalRecords);
    setCargando(false);
  };

  useEffect(() => {
    fetchIndicator();
  }, [page, search, rowsPerPage, cargando]);

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Indicadores</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => handleOpenModal('AGREGAR')}
        >
          Nuevo Indicador
        </Button>
      </Stack>

      {cargando == false && (
        <Card>
          <IndicatorTableToolbar search={search} onChangeSearch={handleChangeSearch} />
          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <TableHeader columns={columns} />
                <TableBody>
                  {rowsIndicator.map(({ id, content }) => (
                    <IndicatorTableRow
                      key={`rowIndicator${id}`}
                      id={id}
                      content={content}
                      handleOpenModal={handleOpenModal}
                    />
                  ))}
                  {rowsIndicator.length < 1 && <TableNoData />}
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
          {openModal == true && typeForm == 'AGREGAR' && (
            <ModalComponent
              title="Agregar indicador"
              open={openModal}
              onCloseModal={handleCloseModal}
            >
              <ModalCreateIndicator
                accessToken={accessToken}
                fetchIndicator={fetchIndicator}
                onCloseModal={handleCloseModal}
              />
            </ModalComponent>
          )}
          {openModal == true && typeForm == 'EDITAR' && (
            <ModalComponent
              title="Editar indicador"
              open={openModal}
              onCloseModal={handleCloseModal}
            >
              <ModalUpdateIndicator accessToken={accessToken} record={record} fetchIndicator={fetchIndicator} indicatorId={codeRow} onCloseModal={handleCloseModal}/>
            </ModalComponent>
          )}
        </Card>
      )}
    </Container>
  );
}

function ModalCreateIndicator({ accessToken, fetchIndicator, onCloseModal }) {
  const initialValues = {
    content: '',
  };
  const handleSubmit = async (values, props) => {
    try {
      onCloseModal();
      createIndicator(accessToken, values)
        .then((res) =>
          Swal.fire({
            title: 'Registro creado',
            icon: 'success',
            showConfirmButton: false,
            timer: 600,
          }).then(async () => await fetchIndicator())
        )
        .catch((error) => {
          console.log(error);
          if (error.response) {
            Swal.fire({
              title: 'Error!',
              text: `${error.response.data.error}`,
              icon: 'error',
              showConfirmButton: false,
              timer: 800,
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: `Error en el servidor`,
              icon: 'error',
              showConfirmButton: false,
              timer: 800,
            });
          }
        })
        .finally(() => {
          props.resetForm();
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={createIndicatorValidate}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => {
        return (
          <Form>
            <Field
              as={TextField}
              label="Indicador"
              name="content"
              type="text"
              multiline
              maxRows={4}
              fullWidth
              variant="outlined"
              margin="dense"
              helperText={<ErrorMessage name="content" />}
              error={errors.content && touched.content}
            ></Field>
            <Stack
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              spacing={2}
              sx={{ paddingTop: '8px' }}
            >
              <Button
                variant="contained"
                type="submit"
                endIcon={<SendIcon />}
                style={{ backgroundColor: '#1565C0', color: 'white' }}
              >
                Guardar
              </Button>
            </Stack>
          </Form>
        );
      }}
    </Formik>
  );
}

function ModalUpdateIndicator({ accessToken, indicatorId, fetchIndicator, onCloseModal,record }) {
  const initialValues = {...record}

  // async function fetchOneIndicator() {
  //   try {
  //     const { content } = await getOneIndicator(accessToken, indicatorId);
  //     initialValues.content = content;
  //     setLoading(false)
  //   } catch (error) {
  //     console.error(error);
  //     onCloseModal();
  //   }
  // }
  // useEffect(() => {
  //   fetchOneIndicator();
  // }, []);

  const handleSubmit = async (values, props) => {
    try {
      onCloseModal();
      updateIndicator(accessToken, indicatorId, values)
        .then((res) =>
          Swal.fire({
            title: 'Registro actualizado',
            icon: 'success',
            showConfirmButton: false,
            timer: 600,
          }).then(async () => await fetchIndicator())
        )
        .catch((error) => {
          console.log(error);
          if (error.response) {
            Swal.fire({
              title: 'Error!',
              text: `${error.response.data.error}` || 'Error en la solicitud',
              icon: 'error',
              showConfirmButton: false,
              timer: 800,
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: `Error en el servidor`,
              icon: 'error',
              showConfirmButton: false,
              timer: 800,
            });
          }
        })
        .finally(() => {
          props.resetForm();
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
      <Formik
        initialValues={initialValues}
        validationSchema={createIndicatorValidate}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => {
          return (
            <Form>
              <Field
                as={TextField}
                label="Indicador"
                name="content"
                type="text"
                multiline
                maxRows={4}
                fullWidth
                variant="outlined"
                margin="dense"
                helperText={<ErrorMessage name="content" />}
                error={errors.content && touched.content}
              ></Field>
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={2}
                sx={{ paddingTop: '8px' }}
              >
                <Button
                  variant="contained"
                  type="submit"
                  endIcon={<SendIcon />}
                  style={{ backgroundColor: '#1565C0', color: 'white' }}
                >
                  Guardar
                </Button>
              </Stack>
            </Form>
          );
        }}
      </Formik>
  );
}
