import React, { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import ImgProtected from '../../components/ImgProtected';

import { showProfile, updateProfile } from '../../services/profile';
import { auth } from '../../services';
import { globalNotifications } from '../../services';
import { clearErrors, setupErrorMessages } from '../../helpers/handleFormFieldsError';

import './styles.css';

function Profile() {
  const [ user, setUser ] = useState({});
  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');

  const [ tempPhoto, setTempPhoto ] = useState('');
  const [ isUpdating, setIsUpdating ] = useState({ name: false, email: false, password: false });
  const fields = ['name','email','password'];

  useEffect(() => {
    async function loadProfile() {
      const response = await showProfile();

      globalNotifications.clearMessages();

      if (response.error) {
        globalNotifications.sendErrorMessage(response.error.message);
      } else {
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
    let updated = true;

    if (fields.indexOf(field) > -1) {
      data[field] = eval(field);
      if (data[field] !== eval(`user.${field}`)) {
        clearErrors();

        const response = await updateProfile(data);

        if (response.error) {
          setupErrorMessages(response.errors);
          updated = false;
        } else {
          globalNotifications.sendSuccessMessage('Dados gravados com sucesso');
          setUser(response);
          auth.refreshUserData();
        }
      }
    }

    if (updated) {
      const currentIsUpdating = {...isUpdating};
      currentIsUpdating[field] = false;
      setIsUpdating(currentIsUpdating);
    }
  }

  async function handleFileDrop(acceptedFiles) {
    if (acceptedFiles.length) {
      var reader = new FileReader();
      reader.onload = (e) => {
        setTempPhoto(e.target.result);
      };
      reader.readAsDataURL(acceptedFiles[0]);

      clearErrors();

      const data = new FormData();
      data.append('photo', acceptedFiles[0]);
      const response = await updateProfile(data);

      if (response.error) {
        setupErrorMessages(response.errors);
      } else {
        globalNotifications.sendSuccessMessage('Foto alterada com sucesso');
        setUser(response);
        setTempPhoto(null);
        auth.refreshUserData();
      }
    }
  }

  async function handleRemovePhoto() {
    setTempPhoto(null);

    const response = await updateProfile({ remove_photo: true });

    if (response.error) {
      setupErrorMessages(response.errors);
    } else {
      globalNotifications.sendSuccessMessage('Foto removida');
      setUser(response);
      auth.refreshUserData();
    }
  }

  return (
    <div className="Profile">
      <h1 className="page-title">Meus Dados</h1>

      <div className="profile-content">
        <div className="profile-photo">
          {(user.photo || tempPhoto) &&
            <div className="photo-field">
              <figure className="current-photo field">
                {(!tempPhoto && user.photo) &&
                  <ImgProtected file={user.photo} />
                }
                {(tempPhoto && !user.photo) &&
                  <img src={tempPhoto} alt="" />
                }
              </figure>
              <div className="edit-photo link" onClick={handleRemovePhoto}>remover foto</div>
            </div>
          }
          {(!user.photo && !tempPhoto) &&
            <div className="photo-field upload-field field">
              <Dropzone onDrop={handleFileDrop}>
                {({getRootProps, getInputProps}) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <p>Arraste e solte um arquivo aqui, ou clique pare selecionar</p>
                    </div>
                  </section>
                )}
              </Dropzone>
            </div>
          }
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
                <input id="name" type="text" name="name" value={name} onChange={e => setName(e.target.value)} onKeyUp={e => e.which === 13 ? handleUpdate('name') : null} />
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
                <input id="email" type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} onKeyUp={e => e.which === 13 ? handleUpdate('email') : null} />
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
                <input id="password" type="password" name="password" onChange={e => setPassword(e.target.value)} onKeyUp={e => e.which === 13 ? handleUpdate('password') : null} />
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
