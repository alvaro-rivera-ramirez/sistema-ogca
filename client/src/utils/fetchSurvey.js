import axios from 'axios';
import { API_URL } from '../constants';

const API_URL_SURVEY = `${API_URL}/v1/survey`;

export const getListSurvey = async (
  accessToken,
  page = '',
  limit = '',
  search = '',
  institute = '',
  module = ''
) => {
  let url = new URL(API_URL_SURVEY);

  if (page) {
    url.searchParams.set('page', page);
  }

  if (limit) {
    url.searchParams.set('limit', limit);
  }

  if (search.trim() !== '') {
    url.searchParams.set('search', search);
  }

  if (institute) {
    url.searchParams.set('institute', institute);
  }

  if (module) {
    url.searchParams.set('module', module);
  }

  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };
  const response = await axios.get(url.toString(), config);
  return response.data;
};

export const getUsersAccessToSurvey = async (codeSurvey, accessToken) => {
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };
  const response = await axios.get(`${API_URL}/v1/survey/${codeSurvey}/users`, config);
  return response.data;
};

export const createAccessSurvey = async (codeSurvey, listUser, accessToken) => {
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };
  return await axios.post(
    `${API_URL}/v1/survey/${codeSurvey}/users`,
    { users: [...listUser] },
    config,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

export const getInfoSurvey = async (codeSurvey, accessToken) => {
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };
  const response = await axios.get(`${API_URL}/v1/survey/${codeSurvey}/info/`, config);

  return response.data;
};

export const sendSurvey=async(codeSurvey,accessToken,data)=>{
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  return await axios.post(`${API_URL}/v1/survey/${codeSurvey}/info`,data,config,{
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getSummarySurvey=async()=>{
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };
  
  return axios.get(`${API_URL}/v1/survey/summary`,config);
}