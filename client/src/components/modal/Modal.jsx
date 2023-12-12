import { Dialog, DialogContent, DialogTitle, Typography, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const Modal = ({ children, title, open, onCloseModal }) => {
  return (
    <Dialog open={open} onClose={onCloseModal} fullWidth>
      <DialogTitle>
        <div style={{ display: 'flex' }}>
          <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <IconButton onClick={onCloseModal}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent sx={{ width: '100%' }}>{children}</DialogContent>
    </Dialog>
  );
};

export const ModalScroll = ({ children, scroll='paper', title, open, onCloseModal }) => {
  return (
    <Dialog
      open={open}
      onClose={onCloseModal}
      fullWidth
      scroll={scroll}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle id="scroll-dialog-title">
        <div style={{ display: 'flex' }}>
          <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <IconButton onClick={onCloseModal}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent sx={{ width: '100%' }} dividers={scroll === 'paper'}>
        {children}
      </DialogContent>
    </Dialog>
  );
};
export default Modal;
