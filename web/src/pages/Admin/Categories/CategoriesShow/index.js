import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { findCategory, updateCategory } from '../../../../services/categories';
import { globalNotifications } from '../../../../services';

function CategoriesShow() {
  const { id } = useParams();

  const [ category, setCategory ] = useState({});
  const [ name, setName ] = useState('');
  const [ isUpdating, setIsUpdating ] = useState(false);

  useEffect(() => {
    async function loadCategory() {
      const response = await findCategory(id);

      globalNotifications.clearMessages();

      if (response.error) {
        globalNotifications.sendErrorMessage(response.error);
      } else {
        setCategory(response);
      }
    }

    loadCategory();
  }, [id]);

  async function handleEditName() {
    setName(category.name);
    setIsUpdating(true);
  }

  async function handleUpdateName() {
    if (name !== category.name) {
      const response = await updateCategory(category.id, { name });
      if (response.error) {
        globalNotifications.sendErrorMessage(response.error);
      } else {
        globalNotifications.sendSuccessMessage('Gravado com sucesso');
        setCategory(response);
      }
    }

    setIsUpdating(false);
  }

  return (
    <div className="CategoriesShow">
      <h1 className="page-title">Detalhes da Categoria</h1>

      <Link className="back button" to="/admin/categorias">
        <i className="mi mi-16">navigate_before</i> voltar
      </Link>

      <div className="category-content model-content content-box">
        {category.name &&
          <div className="category-name model-field">
            {!isUpdating &&
              <>
                <div className="value">{category.name}</div>
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

export default CategoriesShow;
