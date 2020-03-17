import React, { useState, useEffect } from 'react';
import { withRouter, useParams } from 'react-router-dom';
import Dropzone from 'react-dropzone';

import ImgProtected from '../../../../components/ImgProtected';
import { globalNotifications, auth } from '../../../../services';
import { clearErrors, setupErrorMessages } from '../../../../helpers/handleFormFieldsError';
import { storeUser, findUser, updateUser } from '../../../../services/users';
import { getSchools } from '../../../../services/schools';

import './styles.css';

function UsersSave({ history }) {
  const { id } = useParams();
  const levels = [
    { value: 'admin', label: 'Administrador' },
    { value: 'manager', label: 'Gerente' },
    { value: 'student', label: 'Estudante' },
  ];
  const type = id ? 'update' : 'store';

  const [ user, setUser ] = useState({});
  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ level, setLevel ] = useState('');
  const [ schoolId, setSchoolId ] = useState('');
  const [ isTeacher, setIsTeacher ] = useState(false);
  const [ photo, setPhoto ] = useState(null);

  const [ schoolsList, setSchoolsList ] = useState([]);
  const [ removePhoto, setRemovePhoto ] = useState(false);
  const [ tempPhoto, setTempPhoto ] = useState(null);

  useEffect(() => {
    async function loadSchools() {
      const response = await getSchools();
      if (response.error) {
        const err = response.error.message || 'Ocorreu um error ao carregar as lojas';
        globalNotifications.sendErrorMessage(err);
      } else {
        setSchoolsList(response);
      }
    }

    loadSchools();
  }, []);

  useEffect(() => {
    async function loadUser() {
      const response = await findUser(id);

      if (response.error) {
        globalNotifications.sendErrorMessage('Não foi possível carregar os dados do usuário');
        console.error(response.error);
      } else {
        setUser(response);
        setName(response.name);
        setEmail(response.email);
        setLevel(response.level || '');
        setSchoolId(response.school_id || '');
        setIsTeacher(response.is_teacher ? true : false);
      }
    }

    if (id) {
      loadUser();
    }
  }, [id]);

  useEffect(() => {
    if (!removePhoto) return;

    if (!user.photo) {
      setRemovePhoto(false);
      return;
    }

    handleSubmit();
  }, [removePhoto]);

  async function handleSubmit(e) {
    if (e)
      e.preventDefault();

    // clear error messages
    clearErrors();

    const data = new FormData();

    // if (type !== 'update' || name !== user.name)
      data.append('name', name);
    // if (type !== 'update' || email !== user.email)
      data.append('email', email);
    // if (type !== 'update' || level !== user.level)
      data.append('level', level || null);
    // if (type !== 'update' || schoolId !== user.schoolId)
      data.append('school_id', schoolId);
    // if (type !== 'update' || isTeacher !== user.is_teacher)
      data.append('is_teacher', isTeacher === true ? 1 : 0);

    // send password if is Store or if filled on Update
    if (type !== 'update' || password !== '')
      data.append('password', password);

    // set photo file
    if (photo)
      data.append('photo', photo);

    // is to remove current photo?
    if (removePhoto)
      data.append('remove_photo', true);

    // Send data
    const response = type === 'update' ?
                      await updateUser(id, data) :
                      await storeUser(data);

    if (response.error) {
      const err = response.error.message || 'Ocorreu um erro ao gravar os dados';
      globalNotifications.sendErrorMessage(err);

      setupErrorMessages(response.errors);
    } else {
      // if updated user is the current logged in application
      // refresh infos of this user
      if (auth.currentUserValue.id === user.id) {
        auth.refreshUserData();
      }

      if (e) {
        history.push('/admin/alunos');
      }
      if (removePhoto) {
        setRemovePhoto(false);
        globalNotifications.sendSuccessMessage('Foto removida');
      }
      setUser(response)
    }
  }

  function handleFileDrop(acceptedFiles) {
    if (acceptedFiles.length) {
      var reader = new FileReader();
      reader.onload = (e) => {
        setTempPhoto(e.target.result);
      };
      reader.readAsDataURL(acceptedFiles[0]);

      setPhoto(acceptedFiles[0]);
    }
  }

  async function handleRemovePhoto() {
    setTempPhoto(null);
    setRemovePhoto(true);
  }

  return (
    <div className="UsersSave">
      <h1 className="page-title">{type === 'update' ? 'Editar' : 'Novo'} Usuário</h1>

      <form onSubmit={handleSubmit} className="model-form content-box">
        <div className="user-photo-wraper">
          <div className="form-field">
            <label>Foto do Perfil:</label>
            {(user.photo || tempPhoto) &&
              <div className="photo-field">
                <div className="current-photo field">
                  {(!tempPhoto && user.photo) &&
                    <ImgProtected file={user.photo} />
                  }
                  {(!removePhoto && tempPhoto && !user.photo) &&
                    <img src={tempPhoto} alt="" />
                  }
                </div>
                <div className="button" onClick={handleRemovePhoto}>Remover imagem</div>
              </div>
            }
            {((type !== 'update' && !tempPhoto) || (!user.photo && !tempPhoto)) &&
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
        </div>

        <div className="user-field">
          <div className="form-field">
            <label htmlFor="name">Nome:</label>
            <div className="field">
              <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="email">E-mail:</label>
            <div className="field">
              <input id="email" type="text" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="password">Senha:</label>
            <div className="field">
              <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="level">Nível:</label>
            <div className="field">
              <select id="level" type="text" value={level} onChange={e => setLevel(e.target.value)}>
                <option value="">Selecione um nível</option>
                {levels.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
              </select>
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="school_id">Loja:</label>
            <div className="field">
              <select id="school_id" value={schoolId} onChange={e => setSchoolId(e.target.value)}>
                <option value="">Selecione uma loja</option>
                {schoolsList.map(school => (
                  <option key={school.id} value={school.id}>{school.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="is_teacher-field form-field">
            <label htmlFor="is_teacher">Professor?</label>
            <div className="field">
              <input id="is_teacher" type="checkbox" checked={isTeacher} onChange={e => setIsTeacher(e.target.checked)} />
            </div>
          </div>
          <div className="form-field">
            <button type="submit">Gravar</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default withRouter(UsersSave);
