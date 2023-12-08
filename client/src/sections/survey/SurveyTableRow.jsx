import { useState } from 'react';
import PropTypes from 'prop-types';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Info as InfoIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { Link, Navigate } from "react-router-dom";
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

export default function SurveyTableRow({
  uuidSurvey,
  code,
  meansVerification,
  condition,
  component,
  indicator,
  institute,
  isSend,
  status,
  onOpenModal
}) {
  const [open, setOpen] = useState(null);
  const router = useRouter();
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleShareSurvey=(code)=>{
    onOpenModal(code)
    handleCloseMenu();
  }

  const handleViewSurvey=(code)=>{
    handleCloseMenu();
    router.push(`/ficha?code=${code}`);
    // return <Navigate to={`/survey?code=${code}`}/>
  }
  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell>{code}</TableCell>
        <TableCell>{meansVerification}</TableCell>
        <TableCell>{institute}</TableCell>

        <TableCell align="center">{isSend ? 'Si' : 'No'}</TableCell>

        <TableCell>
          <Label color={(status ==0)?'warning':(status==1)?'success':'error'}>{(status ==0)?'Pendiente':(status==1)?'Confirmado':'Observado'}</Label>
        </TableCell>

        <TableCell align="right">
          <HtmlTooltip
            title={
              <>
                <Typography color="inherit">Información</Typography>
                <b>{'Condicion:'}</b>
                {condition}
                <br></br>
                <b>{'Componente:'}</b>
                {component}
                <br></br>
                <b>{'Indicador:'}</b>
                {indicator}
              </>
            }
          >
            <IconButton>
              <InfoIcon />
            </IconButton>
          </HtmlTooltip>
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
        {/* <TableCell align="right">
        </TableCell> */}
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={()=> handleShareSurvey(uuidSurvey)}>
          <Iconify icon="material-symbols:share-outline" sx={{ mr: 2 }} />
          Share
        </MenuItem>
        <MenuItem onClick={()=>handleViewSurvey(uuidSurvey)}>
          <Iconify icon="carbon:view-filled" sx={{ mr: 2 }} />
          Ver
        </MenuItem>
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Editar
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Eliminar
        </MenuItem>
      </Popover>
    </>
  );
}

SurveyTableRow.propTypes = {
  isSend: PropTypes.any,
  meansVerification: PropTypes.any,
  condition: PropTypes.any,
  component: PropTypes.any,
  indicator: PropTypes.any,
  code: PropTypes.any,
  institute: PropTypes.any,
  status: PropTypes.number,
};
