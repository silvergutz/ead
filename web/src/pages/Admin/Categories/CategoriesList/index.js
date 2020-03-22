import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, deleteCategory } from '../../../../services/categories';
import { globalNotifications } from '../../../../services';

function CategoriesList() {
  const [ categories, setCategories ] = useState([]);

  useEffect(() => {
    async function loadCategories() {
      globalNotifications.clearMessages();

      const response = await getCategories();

      if (response.error) {
        globalNotifications.sendErrorMessage(`Ocorreu um erro ao processar a requisição. Detalhes: ${response.error}`);
      } else {
        setCategories(response);
      }
    }

    loadCategories();
  }, []);

  async function handleDelete(id) {
    const response = await deleteCategory(id);

    if (response.error) {
      const err = response.error.message || 'Ocorreu um erro ao excluir o registro';
      globalNotifications.sendErrorMessage(err);
    } else {
      globalNotifications.sendSuccessMessage('Registro excluido');
      setCategories(categories.filter(category => category.id !== id));
    }
  }

  return (
    <div className="CategoriesList">
      <h1 className="page-title">Categorias</h1>

      <Link to="/admin/categorias/novo" className="new-category button-add button">Nova Categoria</Link>

      <table className="datatable">
        <thead>
          <tr>
            <th className="id">ID</th>
            <th className="name">NOME</th>
            <th className="actions">AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category.id}>
              <td className="id">{category.id}</td>
              <td className="name">{category.name}</td>
              <td className="actions">
                <Link className="mi" to={`/admin/categorias/${category.id}`}>edit</Link>
                <button className="button-del link mi" onClick={e => handleDelete(category.id)}>delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CategoriesList;
