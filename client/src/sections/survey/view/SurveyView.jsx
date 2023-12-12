import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useAuth } from 'src/context/AuthProvider';
import { useSurvey } from 'src/context/SurveyProvider';
import { changeStatusSurvey, getInfoSurvey, sendSurvey } from 'src/utils/fetchSurvey';
import SurveyInfo, { ItemList, TaskList } from '../SurveyInfo';
import { Button, Grid, Stack, Typography } from '@mui/material';
import Iconify from 'src/components/iconify';
import Swal from 'sweetalert2';
import FilesSurvey from '../FilesSurvey';
import { ROLE } from 'src/constants';

export default function LabTabs() {
  const [value, setValue] = React.useState('0');
  const [cargando, setCargando] = useState(true);
  const {
    createSurveyInfo,
    createItems,
    createTaskGroup,
    surveyInfo,
    items,
    taskGroups,
    allowedEdit,
    setAllowedEdit,
    files,
  } = useSurvey();
  const { accessToken, user } = useAuth();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchInfoSurvey = async () => {
    try {
      const urlSearch = new URLSearchParams(window.location.search);
      let codeSurvey = '';
      if (urlSearch && urlSearch.has('code')) {
        codeSurvey = urlSearch.get('code');
      }
      const {
        module,
        code,
        allowedEdit,
        condition,
        component,
        indicator,
        checkitem,
        responsibleInstitute,
        taskGroup,
        items,
      } = await getInfoSurvey(codeSurvey, accessToken);

      createSurveyInfo({
        module,
        condition,
        component,
        indicator,
        checkitem,
        allowedEdit,
        responsibleInstitute,
      });
      if (taskGroup.length > 0) {
        createTaskGroup(taskGroup);
      }
      if (items.length > 0) {
        createItems(items);
      }
      setCargando(false);
    } catch (error) {
      console.error(error);
    }
  };

  async function onSubmitSurvey() {
    try {
      const urlSearch = new URLSearchParams(window.location.search);
      let code = '';

      if (urlSearch && urlSearch.has('code')) {
        code = urlSearch.get('code');
      }

      const data = {
        items: [...items],
        task: [...taskGroups],
      };
      Swal.fire({
        title: '¿Estas seguro de enviar la ficha?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, enviar!',
      }).then(async (result) => {
        try {
          if (result.isConfirmed) {
            await sendSurvey(code, accessToken, data, files);
            setAllowedEdit(0);
            Swal.fire('Enviado!', 'La ficha se ha enviado correctamente.', 'success');
          }
        } catch (error) {
          console.error(error);
          Swal.fire('Error!', 'Error al enviar la ficha.', 'error');
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function updateStatusSurvey(status){
    try {
      const urlSearch = new URLSearchParams(window.location.search);
      let code = '';

      if (urlSearch && urlSearch.has('code')) {
        code = urlSearch.get('code');
      }


      Swal.fire({
        title: `¿Estas seguro de ${status==1?'confirmar':'observar'} la ficha?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, enviar!',
      }).then(async (result) => {
        try {
          if (result.isConfirmed) {
            await changeStatusSurvey(code, accessToken, status);
            Swal.fire('Confirmado!', 'El estado de la ficha se ha actualizado', 'success');
          }
        } catch (error) {
          console.error(error);
          Swal.fire('Error!', 'Error al modificar el estado de la ficha.', 'error');
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchInfoSurvey();
  }, []);

  return (
    <Container maxWidth="lg">
      <Card>
        {!cargando && (
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList 
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
                aria-label="scrollable force tabs example"
                onChange={handleChange}>
                  <Tab label="Información General" wrapped value="0" />

                  {taskGroups.length > 0 &&
                    taskGroups.map((oneTaskGroup) => (
                      <Tab
                        key={`tabTask${oneTaskGroup.idGroupTask}`}
                        label={`${oneTaskGroup.nameGroupTask}`}
                        value={`TabTask${oneTaskGroup.idGroupTask}`}
                      />
                    ))}
                  {items.length > 0 &&
                    items.map((oneItem) => (
                      <Tab
                        key={`tabItem${oneItem.idItem}`}
                        label={`${oneItem.nameItem}`}
                        value={`TabItem${oneItem.idItem}`}
                      />
                    ))}
                  <Tab key={`tabFiles`} label={`Archivos adjuntos`} value={`tabFiles`} />
                </TabList>
              </Box>
              <TabPanel value="0">
                {!cargando && (
                  <SurveyInfo
                    title="Información General"
                    list={[
                      surveyInfo.condition,
                      surveyInfo.component,
                      surveyInfo.indicator,
                      surveyInfo.checkitem,
                      surveyInfo.responsibleInstitute,
                    ]}
                  />
                )}
              </TabPanel>
              {taskGroups.length > 0 &&
                taskGroups.map((oneTaskGroup, index) => (
                  <TabPanel
                    key={`tabPanelTask${oneTaskGroup.idGroupTask}`}
                    value={`TabTask${oneTaskGroup.idGroupTask}`}
                  >
                    <TaskList
                      title={`${oneTaskGroup.nameGroupTask}`}
                      list={oneTaskGroup.taskList}
                      typeGroupTask={oneTaskGroup.typeGroupTask}
                      indexGroupTask={index}
                    />
                  </TabPanel>
                ))}
              {items.length > 0 &&
                items.map((oneItem, index) => (
                  <TabPanel
                    key={`tabPanelItem${oneItem.idItem}`}
                    value={`TabItem${oneItem.idItem}`}
                  >
                    <ItemList
                      title={`${oneItem.nameItem}`}
                      list={oneItem.itemList}
                      typeItem={oneItem.typeItem}
                      indexItem={index}
                    />
                  </TabPanel>
                ))}
              <TabPanel value="tabFiles">
                <FilesSurvey
                  title={'Archivos adjuntos'}
                  subheader={'Adjunte sus documentos que respalden la información brindada'}
                />
              </TabPanel>
            </TabContext>
          </Box>
        )}

        {allowedEdit == 1 && (
          <Stack direction="row" alignItems="center" justifyContent="center" mb={5}>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="mdi:send" />}
              onClick={() => onSubmitSurvey()}
            >
              Enviar Ficha
            </Button>
          </Stack>
        )}
        {user.role == ROLE.ADMINISTRADOR && allowedEdit == 0 && (
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} direction="row"
          justifyContent="center"
          alignItems="center"
          marginBottom={4}
          >
            <Grid item xs={2} sm={5} md={4}>
              <Button
                variant="contained"
                color="success"
                startIcon={<Iconify icon="mdi:success-circle"  />}
                onClick={() => updateStatusSurvey(1)}
              >
                Confirmado
              </Button>
            </Grid>
            <Grid item xs={2} sm={5} md={4}>
              <Button
                variant="contained"
                color="warning"
                startIcon={<Iconify icon="mdi:warning"  />}
                onClick={() => updateStatusSurvey(2)}
              >
                Observado
              </Button>
            </Grid>

          </Grid>
        )}
      </Card>
    </Container>
  );
}
