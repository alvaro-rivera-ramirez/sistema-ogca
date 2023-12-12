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

  console.log(url.toString());
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

export const sendSurvey = async (codeSurvey, accessToken, data, files = null) => {
  try {
    const formData = new FormData();
    if (files) {
      for (const file of files) {
        formData.append('attached', file);
      }
    }

    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    await axios.post(`${API_URL}/v1/survey/${codeSurvey}/info`, data, config, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    await axios.post(`${API_URL}/v1/survey/${codeSurvey}/file`, formData, config);

    return {
      message: 'Ficha enviada con exito',
    };
  } catch (error) {
    throw new Error(error);
  }
  // for (let i = 0; i < data.task.length; i++) {
  //   const currentTask = data.task[i];

  //   for (const key in currentTask) {
  //     if (currentTask.hasOwnProperty(key)) {
  //       if (Array.isArray(currentTask[key])) {
  //         currentTask[key].forEach((item, index) => {
  //           for (const itemKey in item) {
  //             if (item.hasOwnProperty(itemKey)) {
  //               const fieldName = `task[${i}][${key}][${index}][${itemKey}]`;
  //               formData.append(fieldName, item[itemKey]);
  //             }
  //           }
  //         });
  //       } else {
  //         const fieldName = `task[${i}][${key}]`;
  //         formData.append(fieldName, currentTask[key]);
  //       }
  //     }
  //   }
  // }

  // for (let i = 0; i < data.items.length; i++) {
  //   const currentItem = data.items[i];

  //   for (const key in currentItem) {
  //     if (currentItem.hasOwnProperty(key)) {
  //       if (Array.isArray(currentItem[key])) {
  //         currentItem[key].forEach((item, index) => {
  //           for (const itemKey in item) {
  //             if (item.hasOwnProperty(itemKey)) {
  //               const fieldName = `items[${i}][${key}][${index}][${itemKey}]`;
  //               formData.append(fieldName, item[itemKey]);
  //             }
  //           }
  //         });
  //       } else {
  //         const fieldName = `items[${i}][${key}]`;
  //         formData.append(fieldName, currentItem[key]);
  //       }
  //     }
  //   }
  // }

  // const urlencoded=new URLSearchParams(formData).toString()
};

export const getSummarySurvey = async (accessToken,module=null) => {
  let url = new URL(`${API_URL_SURVEY}/summary`);

  if (module) {
    url.searchParams.set('module', module);
  }
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  return (await axios.get(url.toString(), config)).data;
};

export const changeStatusSurvey = async (codeSurvey, accessToken, status) => {
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  return await axios.patch(`${API_URL}/v1/survey/${codeSurvey}/status`, {status}, config, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
