import DiskpeekerPage from './pages/DiskpeekerPage'
import axios from 'axios';
import './scss/pico.react.css'

const apiClient = axios.create();

export const DiskApi = {
  list: () =>
    apiClient.get('/diskinfo/'),
  listFull: () =>
    apiClient.get('/diskinfo/full/'),
  retrieve: (id) =>
    apiClient.get(`/diskinfo/${id}`),
  init: () =>
    apiClient.post('/diskinfo/init'),
  update: (id, params) =>
    apiClient.patch(`/diskinfo/`, params)
}

function App() {
  return (
      <DiskpeekerPage/>
  );
}

export default App;