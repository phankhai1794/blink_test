import axios from 'axios';

export async function uploadFile(data) {
  const response = await axios.post(`${process.env.REACT_APP_API}/file/upload`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `${localStorage.getItem('AUTH_TOKEN')}`
    }
  });
  return response.data;
}

export async function getFile(id) {
  const response = await axios.get(`${process.env.REACT_APP_API}/file/getFile/${id}`, {
    responseType: 'blob'
  });
  return response.data;
}
