import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getUser, getAuthError } from '../../services/selectors';
import {
  updateUser,
  logoutUser,
  clearError
} from '../../services/slices/auth-slice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const error = useSelector(getAuthError);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(clearError());
    const updateData: { name: string; email: string; password?: string } = {
      name: formValue.name,
      email: formValue.email
    };
    if (formValue.password) {
      updateData.password = formValue.password;
    }
    dispatch(updateUser(updateData));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={error || ''}
    />
  );
};
