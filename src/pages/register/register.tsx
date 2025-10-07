import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterUI } from '@ui-pages';
import { useSelector, useDispatch } from '../../services/store';
import { getAuthError, getIsAuthenticated } from '../../services/selectors';
import { registerUser, clearError } from '../../services/slices/auth-slice';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const error = useSelector(getAuthError);
  const isAuthenticated = useSelector(getIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(registerUser({ name: userName, email, password }));
  };

  return (
    <RegisterUI
      errorText={error || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
