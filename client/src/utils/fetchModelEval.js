import axios from 'axios';
import { API_URL } from '../constants';

const API_URL_MODEL = `${API_URL}/v1/evaluation-module`;
export const getListModel = async ( accessToken, page = '', limit = '', search = '') => {
  let url = new URL(API_URL_MODEL);

  if (page) {
    url.searchParams.set('page', page);
  }

  if (limit) {
    url.searchParams.set('limit', limit);
  }

  if (search.trim() !== '') {
    url.searchParams.set('search', search);
  }

  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };
  const response = await axios.get(url.toString(), config);
  const dataModule=response.data.map((row) => {
    return {
      id: row.id_evaluation_module,
      code: row.code_evaluation_module,
      name: row.name_evaluation_module,
    };
  });
  return dataModule;
};
