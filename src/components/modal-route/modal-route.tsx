import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal } from '../modal';

interface ModalRouteProps {
  children: React.ReactNode;
  title: string;
}

export const ModalRoute: React.FC<ModalRouteProps> = ({ children, title }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => {
    const background = location.state?.background;
    if (background) {
      navigate(background.pathname, { replace: true });
    } else {
      navigate(-1);
    }
  };

  return (
    <Modal title={title} onClose={handleClose}>
      {children}
    </Modal>
  );
};
