import axios from 'axios'; 

export const DiskpeekerApi = {
  list: () =>
    axios.get('/diskinfo/'),
  listFull: () =>
    axios.get('/diskinfo/full/'),
  retrieve: (id) =>
    axios.get('/diskinfo/${id}'),
  init: () =>
    axios.post('/diskinfo/init/'),
  updateMultiple: (params) =>
    axios.put('/diskinfo/', params)
}