import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import styles from './ImagePreviewComponent.module.css';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ImagePreviewComponent({img, handleDelete}) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  return (
    <div className={styles.root}>
      <img src={img.thumbnailUrl} className={styles.previewImg} onClick={() => handleOpen()} alt={img.title} />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <img src={img.url} className={styles.imageModal} alt={img.title} />
        </Box>
      </Modal>
      <FontAwesomeIcon icon={faTrash} className={styles.icon} onClick={() => handleDelete(img.id)} />
      <div style={{display: 'flex', flexDirection: 'column', textAlign: 'left'}}>
        <h4>{img.title}</h4>
        <p style={{fontSize: '12px'}}>Album ID: {img.albumId}</p>
      </div>
    </div>
  );
}
