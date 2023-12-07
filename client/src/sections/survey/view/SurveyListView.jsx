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

import TableNoData from '../table-no-data';

import TableEmptyRows from '../table-empty-rows';
import { useSurvey } from 'src/context/ListSurveyContext';
import { useAuth } from 'src/context/AuthProvider';
import { getListSurvey } from 'src/utils/fetchSurvey';
import TableHeader from 'src/components/tables/TableHeader';
import SurveyTableToolbar from '../survey-table-toolbar';
import SurveyTableRow from '../SurveyTableRow';
import {ModalComponent} from '../../../components/modal'
import ShareSurvey from '../ShareSurvey';

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
  const [codeSurveyToShare, setCodeSurveyToShare] = useState(null);
  const { institute, module, search } = useSurvey();
  const { accessToken } = useAuth();

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(1);
  };

  const handleOpenModalToShare = (code) => {
    setOpenModal(true);
    setCodeSurveyToShare(code);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
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
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Fichas</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          Nueva Ficha
        </Button>
      </Stack>

      <Card>
        <SurveyTableToolbar />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHeader columns={columns} />
              <TableBody>
                {rowsSurvey.map(({ codeSurvey, codeSurvey2, means_verification,component,indicator,condition, allowedEdit }) => (
                  <SurveyTableRow
                    key={codeSurvey}
                    uuidSurvey={codeSurvey}
                    code={codeSurvey2}
                    meansVerification={means_verification.content}
                    institute={means_verification.institute.name_institute}
                    component={component.content}
                    indicator={indicator.content}
                    condition={condition.content}
                    isSend={!allowedEdit}
                    status="success"
                    onOpenModal={handleOpenModalToShare}
                  />
                ))}
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
        {openModal &&(
        <ModalComponent title="Compartir Ficha" open={openModal} onCloseModal={handleCloseModal}>
          <ShareSurvey code={codeSurveyToShare} />
        </ModalComponent>
        )}
      </Card>
    </Container>
  );
}
