import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton
} from "@mui/material";
import {Close as CloseIcon} from '@mui/icons-material';

const Modal= ({ children, title, open, onCloseModal }) => {

  return (
    <Dialog open={open} onClose={onCloseModal}>
      <DialogTitle>
        <div style={{ display: "flex" }}>
          <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <IconButton onClick={onCloseModal}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

export default Modal;