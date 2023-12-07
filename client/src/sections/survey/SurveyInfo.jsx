import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Delete as DeleteIcon } from '@mui/icons-material';
// import { fToNow } from 'src/utils/format-time';
import {CheckCircleOutline as CheckCircleIcon} from '@mui/icons-material'; 
import {Warning as WarningIcon} from '@mui/icons-material'; 
import {Cancel as CancelIcon} from '@mui/icons-material';
import {ArrowDropDown as ArrowDropDownIcon} from '@mui/icons-material'
import Popover from '@mui/material/Popover';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { IconButton, ListItemSecondaryAction, Menu, MenuItem } from '@mui/material';
import { useSurvey } from 'src/context/SurveyProvider';
import { useState } from 'react';
import { useAuth } from 'src/context/AuthProvider';

// ----------------------------------------------------------------------

export default function SurveyInfo({ title, list }) {
  return (
    <Card>
      <CardHeader title={title} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {list.map((news, index) => (
            <NewsItem key={`newID${index}`} news={news} />
          ))}
        </Stack>
      </Scrollbar>

      {/* <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          size="small"
          color="inherit"
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
        >
          View all
        </Button>
      </Box> */}
    </Card>
  );
}

SurveyInfo.propTypes = {
  title: PropTypes.string,
  list: PropTypes.array.isRequired,
};

// ----------------------------------------------------------------------

function NewsItem({ news }) {
  const { name, content } = news;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      {/* <Box
        component="img"
        alt={title}
        src={image}
        sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }}
      /> */}

      <Box sx={{ minWidth: 240, flexGrow: 1 }}>
        <Link color="inherit" variant="subtitle2" underline="hover" noWrap>
          {name}
        </Link>

        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {content}
        </Typography>
      </Box>

      {/* <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
        {fToNow(postedAt)}
      </Typography> */}
    </Stack>
  );
}

NewsItem.propTypes = {
  news: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
  }),
};

export function TaskList({ title, list,indexGroupTask,typeGroupTask }) {
  const [valueTask, setValueTask] = useState("");
  const {addTask,allowedEdit}=useSurvey();
  const onNewTask=(idGroup)=>{
    if(valueTask.trim()<1) return;
    console.log(idGroup,valueTask)
    addTask(idGroup,valueTask);
    setValueTask("");
  }
  return (
    <Card>
      <CardHeader title={title} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {list.map((news, index) => (
            <NewsTask key={`newTask${index}`} news={news} indexGroupTask={indexGroupTask} indexTask={index} typeGroupTask={typeGroupTask} />
          ))}
        </Stack>
      </Scrollbar>

      <Divider sx={{ borderStyle: 'dashed' }} />
      {(typeGroupTask==1 && allowedEdit==1) &&(
      <Box sx={{ p: 2, textAlign: 'right' }} display="flex" alignItems="center">
        <TextField id="outlined-basic" placeholder="Escriba aquí" value={valueTask} onChange={({target})=>{
          setValueTask(target.value)
        }}/>
        <Button
          size="small"
          color="inherit"
          endIcon={<Iconify icon="zondicons:add-outline" />}
          onClick={()=>{
            onNewTask(indexGroupTask)
          }}
        >
          Agregar
        </Button>
      </Box>

      )}
    </Card>
  );
}

function NewsTask({ news,indexGroupTask,indexTask,typeGroupTask }) {
  const { nameTask:content,statusTask } = news;
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState(statusTask); // Establecer por 
  const {deleteTask,updateStatusTask,allowedEdit}=useSurvey();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    updateStatusTask(indexGroupTask,indexTask,option)
    handleClose();
  };


  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box sx={{ minWidth: 240, flexGrow: 1 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {content}
        </Typography>
      </Box>

      {(typeGroupTask==1 && allowedEdit==1)&&(
      <IconButton onClick={()=>{
          deleteTask(indexGroupTask,indexTask)
        }}>
        <DeleteIcon />
      </IconButton>
      )}

      <Button
        variant="contained"
        onClick={handleClick}
        endIcon={<ArrowDropDownIcon />}
      >
            {getIcon(selectedOption)}
      </Button>
      
      {allowedEdit==1&&(
      <Popover anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={()=> 
        handleOptionClick(1)
        }>
          <ListItemIcon>{getIcon(1)}</ListItemIcon>
          <Typography variant="inherit">Cumple </Typography>
        </MenuItem>
        <MenuItem onClick={() => handleOptionClick(-1)}>
          <ListItemIcon>{getIcon(-1)}</ListItemIcon>
          <Typography variant="inherit">No Cumple</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleOptionClick(0)} sx={{ color: 'error.main' }}>
          <ListItemIcon>{getIcon(0)}</ListItemIcon>
          <Typography variant="inherit">En Proceso</Typography>
        </MenuItem>
      </Popover>
      )}
    </Stack>
  );
}

const getIcon = (option) => {
  switch (option) {
    case 1:
      return <CheckCircleIcon />;
    case -1:
      return <CancelIcon />;
    case 0:
      return <WarningIcon />;
    default:
      return null;
  }
};