import axios from "axios";
import { API_URL } from "../constants";

const API_URL_USER=`${API_URL}/v1/user`
export const getListUser = async (accessToken,page=1,limit=10,search="") => {
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const response = await axios.get(`${API_URL_USER}?page=${page}&limit=${limit}&search=${search}`, config);
    return response.data;
  };

  export const getListUserWithOutAccess = async (accessToken,page=1,limit=10,search="",codeSurvey) => {
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const response = await axios.get(`${API_URL_USER}/without-access/survey/${codeSurvey}?page=${page}&limit=${limit}&search=${search}`, config);
    return response.data;
  };

