import React, { useState, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import { withRouter } from 'react-router-dom';

import { storeCourse, updateCourse, findCourse } from '../../../services/courses';
import { globalNotifications } from '../../../services';
import { getSchools } from '../../../services/schools';
import { getCategories } from '../../../services/categories';
import { getUsers } from '../../../services/users';
import ImgProtected from '../../../components/ImgProtected';
import Select from 'react-select';

import './styles.css';

function CoursesForm({ history, type, id }) {
  const [ course, setCourse ] = useState({});
  const [ name, setName ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ cover, setCover ] = useState(null);
  const [ schoolId, setSchoolId ] = useState('');
  const [ categories, setCategories ] = useState([]);
  const [ teachers, setTeachers ] = useState([]);
  const [ status, setStatus ] = useState('');
  const [ removeCover, setRemoveCover ] = useState(false);
  const [ tempCover, setTempCover ] = useState(null);

  const [ schoolsList, setSchoolsList ] = useState([]);
  const [ categoriesList, setCategoriesList ] = useState([]);
  const [ teachersList, setTeachersList ] = useState([]);

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
    async function loadCategories() {
      const response = await getCategories();
      if (response.error) {
        const err = response.error.message || 'Ocorreu um error ao carregar as categorias';
        globalNotifications.sendErrorMessage(err);
      } else {
        const categories = response.map(category => ({ value: category.id, label: category.name }))
        setCategoriesList(categories);
      }
    }
    async function loadTeachers() {
      const response = await getUsers();
      if (response.error) {
        const err = response.error.message || 'Ocorreu um error ao carregar os professores';
        globalNotifications.sendErrorMessage(err);
      } else {
        const teachers = response.map(teacher => ({ value: teacher.id, label: teacher.name }))
        setTeachersList(teachers);
      }
    }

    loadSchools();
    loadCategories();
    loadTeachers();
  }, []);

  useEffect(() => {
    async function loadCourse() {
      if (type === 'update') {
        const response = await findCourse(id);

        if (response.error) {
          const err = response.error.message || 'Ocorreu um erro ao buscar os dados do Curso';
          globalNotifications.sendErrorMessage(err);
        } else {
          setCourse(response);
          setName(response.name)
          setDescription(response.description)
          setSchoolId(response.school_id)
          setCategories(response.categories.map(i => { return { value: i.id, label: i.name } }))
          setTeachers(response.teachers.map(i => { return { value: i.id, label: i.name } }))
          setStatus(response.status)
        }
      }
    }

    loadCourse();
  }, [id, type]);

  useEffect(() => {
    async function updateRemoveCover() {
      if (!removeCover) return;

      const response = await updateCourse(id, { remove_cover: true });

      if (response.error) {
        const err = response.error.message || 'Ocorreu um erro ao remover a imagem';
        globalNotifications.sendErrorMessage(err);
      } else {
        globalNotifications.sendSuccessMessage('Imagem removida com sucesso');
      }
    }

    updateRemoveCover();
  }, [removeCover]);

  async function handleSubmit(e) {
    if (e) {
      e.preventDefault();
    }
    globalNotifications.clearMessages();

    const data = new FormData();

    if (type === 'update') {
      if (name !== course.name)
        data.append('name', name);
      if (description !== course.description)
        data.append('description', description);
      if (schoolId !== course.school_id)
        data.append('school_id', schoolId);
      if (categories !== course.categories)
        data.append('categories[]', [formatMultiSelectValue(categories)]);
      if (teachers !== course.teachers)
        data.append('teachers[]', [formatMultiSelectValue(teachers)]);
      if (status !== course.status)
        data.append('status', status);
      if (removeCover)
        data.append('remove_cover', true);
    } else {
      data.append('name', name);
      data.append('description', description);
      data.append('school_id', schoolId);
      data.append('categories[]', formatMultiSelectValue(categories));
      data.append('teachers[]', formatMultiSelectValue(teachers));
      data.append('status', status);
    }

    if (cover) {
      data.append('cover', cover);
    }

    const response = (type === 'update') ?
                      await updateCourse(id, data) :
                      await storeCourse(data);

    if (response.error) {
      const err = response.error.message || 'Ocorreu um erro ao gravar os dados';
      globalNotifications.sendErrorMessage(err);
    } else {
      if (type !== 'update') {
        history.push(`/cursos/${response.id}`);
      }

      setCourse(response);
      setTempCover(null);

      globalNotifications.sendSuccessMessage('Dados gravados com sucesso');
    }
  }

  function handleFileDrop(acceptedFiles) {
    if (acceptedFiles.length) {
      var reader = new FileReader();
      reader.onload = (e) => {
        setTempCover(e.target.result);
      };
      reader.readAsDataURL(acceptedFiles[0]);

      setCover(acceptedFiles[0]);
    }
  }

  async function handleRemoveCover() {
    setCourse({ ...course, cover: null });
    setTempCover(null);
    setRemoveCover(true);
  }

  function formatMultiSelectValue(selected) {
    return selected.reduce((accumulator, current) => {
      accumulator.push(current.value);
      return accumulator;
    }, []);
  }

  return (
    <form onSubmit={handleSubmit} className="model-form content-box">
      <div className="form-field">
        <label htmlFor="name">Nome:</label>
        <div className="field">
          <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} />
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="description">Descrição:</label>
        <div className="field">
          <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
      </div>
      <div className="form-field">
        <label>Imagem de Capa:</label>
        {(course.cover || tempCover) &&
          <div className="current-cover field">
            {(!tempCover && course.cover) &&
              <ImgProtected file={course.cover} />
            }
            {(tempCover && !course.cover) &&
              <img src={tempCover} alt="" />
            }
            <br />
            <div className="button" onClick={handleRemoveCover}>Remover imagem</div>
          </div>
        }

        {(type !== 'update' || (!course.cover && !tempCover)) &&
          <div className="cover-field upload-field field">
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
      <div className="form-field">
        <label htmlFor="schoolId">Loja:</label>
        <div className="field">
          <select id="schoolId" value={schoolId} onChange={e => setSchoolId(e.target.value)}>
            {schoolsList.map(school => (
              <option key={school.id} value={school.id}>{school.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="categories">Categorias:</label>
        <div className="field">
          <Select
            name="categories"
            value={categories}
            onChange={value => setCategories(value)}
            options={categoriesList}
            isMulti={true}
            isSearchable={true}
            />
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="teachers">Professores:</label>
        <div className="field">
          <Select
            name="teachers"
            value={teachers}
            onChange={value => setTeachers(value)}
            options={teachersList}
            isMulti={true}
            isSearchable={true}
            />
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="status">Status:</label>
        <div className="field">
          <select id="status" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </select>
        </div>
      </div>
      <div className="form-field">
        <button type="submit">Gravar</button>
      </div>
    </form>
  );
}

export default withRouter(CoursesForm);
