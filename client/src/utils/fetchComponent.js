import axios from 'axios';
import { API_URL } from '../constants';

const API_URL_COMPONENT = `${API_URL}/v1/component`;
export const getListComponent = async (accessToken, page = '', limit = '', search = '') => {
  let url = new URL(API_URL_COMPONENT);

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
  return response.data;
};