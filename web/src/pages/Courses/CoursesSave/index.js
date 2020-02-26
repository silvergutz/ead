import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Dropzone from 'react-dropzone';

import { storeCourse } from '../../../services/courses';
import { withRouter } from 'react-router-dom';
import { globalNotifications } from '../../../services';
import { getSchools } from '../../../services/schools';
import { getCategories } from '../../../services/categories';
import { getUsers } from '../../../services/users';

function CoursesSave({ history }) {
  const [ name, setName ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ cover, setCover ] = useState(null);
  const [ schoolId, setSchoolId ] = useState('');
  const [ categories, setCategories ] = useState([]);
  const [ teachers, setTeachers ] = useState([]);
  const [ status, setStatus ] = useState('');

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

  async function handleSubmit(e) {
    e.preventDefault();
    globalNotifications.clearMessages();

    const data = new FormData();

    data.append('name', name);
    data.append('description', description);
    data.append('school_id', schoolId);
    data.append('categories[]', formatMultiSelectValue(categories));
    data.append('teachers[]', formatMultiSelectValue(teachers));
    data.append('status', status);

    if (cover) {
      data.append('cover', cover);
    }

    const response = await storeCourse(data);

    if (response.error) {
      const err = response.error.message || 'Ocorreu um erro ao gravar os dados';
      globalNotifications.sendErrorMessage(err);
    } else {
      history.push(`/cursos/${response.id}`);
    }
  }

  function handleFileDrop(acceptedFiles, rejectedFiles) {
    console.log(acceptedFiles, rejectedFiles);
    if (acceptedFiles.length) {
      setCover(acceptedFiles[0]);
    }
  }

  function formatMultiSelectValue(selected) {
    return selected.reduce((accumulator, current) => {
      accumulator.push(current.value);
      return accumulator;
    }, []);
  }

  return (
    <div className="CoursesSave">
      <h1 className="page-title">Novo Curso</h1>

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
    </div>
  )
}

export default withRouter(CoursesSave);
