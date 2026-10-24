import axios from 'axios';

const nodeApi = axios.create({
  baseURL: import.meta.env.VITE_NODE_API_BASE_URL || 'http://localhost:5000/api',
});

nodeApi.interceptors.request.use((req) => {
  let userTokenData;
  try {
    userTokenData = JSON.parse(sessionStorage.getItem('boroma_admin_token'));
  } catch (error) {
    userTokenData = null;
  }
  const token = userTokenData && userTokenData.token ? userTokenData.token : null;

  if (req.data instanceof FormData) {
    delete req.headers['Content-Type'];
  } else {
    req.headers['Content-Type'] = 'application/json';
  }
  if (token) {
    req.headers['Authorization'] = `Bearer ${token}`;
    req.headers['token'] = token;
    req.headers['x-access-token'] = token;
  }
  return req;
});

nodeApi.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default nodeApi;
