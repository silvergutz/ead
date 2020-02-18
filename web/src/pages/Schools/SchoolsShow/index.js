import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { findSchool, updateSchool } from '../../../services/schools';

function SchoolsShow() {
  const { id } = useParams();

  const [ school, setSchool ] = useState({});
  const [ name, setName ] = useState('');
  const [ isUpdating, setIsUpdating ] = useState(false);

  useEffect(() => {
    async function loadSchool() {
      const response = await findSchool(id);

      if (response.error) {
        console.error(response.error);
      } else {
        setSchool(response);
      }
    }

    loadSchool();
  }, [id]);

  async function handleEditName() {
    setName(school.name);
    setIsUpdating(true);
  }

  async function handleUpdateName() {
    if (name !== school.name) {
      const response = await updateSchool(school.id, { name });
      if (response.error) {
        console.error(response.error);
      } else {
        setSchool(response);
      }
    }

    setIsUpdating(false);
  }

  return (
    <div className="SchoolsShow">
      <h1 className="page-title">Detalhes da Loja</h1>

      <Link to="/schools">&lsaquo; voltar</Link>

      <div className="school-content">
        {school.name &&
          <div className="school-name">
            {!isUpdating &&
              <>
                <div className="value">{school.name}</div>
                <button className="edit-name link" onClick={handleEditName}>(editar)</button>
              </>
            }
            {isUpdating &&
              <>
                <input type="text" value={name} onChange={e => setName(e.target.value)} onKeyUp={e => e.which === 13 ? handleUpdateName() : null} />
                <button className="update-name link" onClick={handleUpdateName}>(gravar)</button>
              </>
            }
          </div>
        }
      </div>
    </div>
  )
}

export default SchoolsShow;
