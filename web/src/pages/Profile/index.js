import React, { useEffect, useState } from 'react';
import { findUser, updateUser } from '../../services/users';
import { auth } from '../../services';

import './styles.css';

function Profile() {
  const [ user, setUser ] = useState({});
  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ errorMessage, setErrorMessage ] = useState('');
  const [ isUpdating, setIsUpdating ] = useState({ name: false, email: false, password: false });
  const currentUser = auth.currentUserValue;
  const fields = ['name','email','password'];

  useEffect(() => {
    async function loadProfile() {
      const response = await findUser(currentUser.id);

      if (response.error) {
        console.error(response.error);
        setErrorMessage(response.error.message);
      } else {
        setErrorMessage('');
        setUser(response);
      }
    }

    loadProfile();
  }, []);

  async function handleEdit(field) {
    if (fields.indexOf(field) > -1) {
      const currentIsUpdating = {...isUpdating};
      currentIsUpdating[field] = true;
      setIsUpdating(currentIsUpdating);
      eval(`set${field.charAt(0).toUpperCase() + field.slice(1)}(user.${field})`);
    }
  }

  async function handleUpdate(field) {
    let data = {};
    if (fields.indexOf(field) > -1) {
      data[field] = eval(field);
      if (data[field] !== eval(`user.${field}`)) {
        console.log(data);
        const response = await updateUser(currentUser.id, data);

        if (response.error) {
          setErrorMessage(response.error.message);
        } else {
          setUser(response);
        }
      }
    }

    const currentIsUpdating = {...isUpdating};
    currentIsUpdating[field] = false;
    setIsUpdating(currentIsUpdating);
  }

  return (
    <div className="Profile">
      <h1 className="page-title">Meus Dados</h1>

      {errorMessage &&
        <div className="error">
          Ocorreu um erro ao carregar os seus dados.<br />
          Detalhes: <div className="error-message">{errorMessage}</div>
        </div>
      }

      <div className="profile-content">
        <div className="profile-photo">
          <figure>
            <img src={user.photo} alt="" />
          </figure>
          <button className="edit-photo link">editar foto</button>
        </div>
        <div className="profile-details">
          <div className="profile-name">
            {!isUpdating.name &&
              <>
                <div className="value">{user.name}</div>
                <button className="edit-name link" onClick={e => handleEdit('name')}>(editar)</button>
              </>
            }
            {isUpdating.name &&
              <>
                <input type="text" name="name" value={name} onChange={e => setName(e.target.value)} />
                <button className="confirm-edit-name link" onClick={e => handleUpdate('name')}>(gravar)</button>
              </>
            }
          </div>
          <div className="profile-email">
            {!isUpdating.email &&
              <>
                <div className="value">{user.email}</div>
                <button className="edit-email link" onClick={e => handleEdit('email')}>(editar)</button>
              </>
            }
            {isUpdating.email &&
              <>
                <input type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} />
                <button className="confirm-edit-email link" onClick={e => handleUpdate('email')}>(gravar)</button>
              </>
            }
          </div>
          <div className="profile-password">
            {!isUpdating.password &&
              <>
                <div className="value">**********</div>
                <button className="edit-password link" onClick={e => handleEdit('password')}>(alterar a senha)</button>
              </>
            }
            {isUpdating.password &&
              <>
                <input type="password" name="password" onChange={e => setPassword(e.target.value)} />
                <button className="confirm-edit-email link" onClick={e => handleUpdate('password')}>(gravar)</button>
              </>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
