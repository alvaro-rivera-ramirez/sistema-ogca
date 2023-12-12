import { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Button, Container, Grid, IconButton, Stack, Typography } from '@mui/material';
import Scrollbar from 'src/components/scrollbar';
import { useSurvey } from 'src/context/SurveyProvider';

// ----------------------------------------------------------------------

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function FilesSurvey({ title, subheader }) {
  const inputRef = useRef(null);
  const { files, addFile } = useSurvey();
  function containerClickHandler() {
    inputRef.current.click();
  }

  function dragOverHandler(e) {
    e.preventDefault();
  }

  function dropHandler(e) {
    e.preventDefault();
    saveFile(e.dataTransfer.files);
  }

  function saveFile(filesTransfer) {
    const filesValid = Array.from(filesTransfer).filter((file) => processFile(file));

    addFile(filesValid);
  }

  function processFile(file) {
    const fileExt = file.name.split('.').pop();
    const validExtensions = ['jpg', 'jpeg', 'png', 'docx', 'xls', 'xlsx', 'pdf'];

    if (validExtensions.includes(fileExt)) {
      // addFile(file);
      console.log(`${file.name} es valido`);
      return true;
    } else {
      console.log(`${file.name} no es valido`);
      return false;
    }
    return;
  }

  return (
    <Card>
      <CardHeader title={title} subheader={subheader} sx={{ marginBottom: 5 }} />
      <Container
        maxWidth="xl"
        sx={{
          marginBottom: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            margin: '0 auto',
            p: 2,
            border: '2px dashed grey',
            borderRadius: 8,
            width: '80%',
            height: 400,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
          onDragOver={dragOverHandler}
          onDrop={dropHandler}
        >
          <Typography variant="h5" sx={{ color: 'text.secondary', marginBottom: 2 }} noWrap>
            Arrastra y suelta archivos
          </Typography>

          <input
            type="file"
            multiple
            onChange={(e) => {
              saveFile(e.target.files);
            }}
            hidden
            // style={{ display: 'none' }}
            ref={inputRef}
          />
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={containerClickHandler}
          >
            <Typography variant="body2" sx={{ color: 'white' }} noWrap>
              Selecciona tus archivos
            </Typography>
          </Button>
        </div>

        {files.length > 0 && (
          // <Grid container spacing={4} sx={{marginTop:5}}>
          //   {files.map((file, index) => (
          //      <NewFile key={`newFile${index}`} file={file} />
          //  ))}
          // </Grid>
          <Scrollbar>
          <Stack
            spacing={3}
            sx={{ p: 3, pr: 0 }}
          >
            {files.map((file, index) => (
              <NewFile key={`newFile${index}`} file={file} />
            ))}
          </Stack>

          </Scrollbar>
        )}
      </Container>
    </Card>
  );
}

function NewFile({ file }) {
  const { type, name, size } = file;
  const { deleteFile } = useSurvey();
  return (
    // <Grid item xs={12} sm={6} md={4}>
    //   <Box sx={{ minWidth: 240, flexGrow: 1 }}>
    //     <Typography variant="body1" sx={{ color: 'text.secondary' }}>
    //       {type}
    //     </Typography>
    //     <Typography variant="body2" sx={{ color: 'text.secondary' }}>
    //       {name}
    //     </Typography>
    //     <Typography variant="body2" sx={{ color: 'text.secondary' }}>
    //       {size}
    //     </Typography>
    //   </Box>
    //   <IconButton
    //     onClick={() => {
    //       deleteFile(file);
    //     }}
    //   >
    //     <DeleteIcon />
    //   </IconButton>
    // </Grid>

    <Stack direction="row" alignItems="center" spacing={2}>
      <Box sx={{ minWidth: 240, flexGrow: 1 }}>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {type}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {size}
        </Typography>
      </Box>
      <IconButton
        onClick={() => {
          deleteFile(file);
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Stack>
  );
}
