import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../modal';

interface ModalRouteProps {
  children: React.ReactNode;
  title: string;
}

export const ModalRoute: React.FC<ModalRouteProps> = ({ children, title }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <Modal title={title} onClose={handleClose}>
      {children}
    </Modal>
  );
};
