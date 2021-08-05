import axiosTask from 'axios';

const instance = axiosTask.create({
  baseURL: 'https://to-do-list-3eb47-default-rtdb.europe-west1.firebasedatabase.app/'
});

export default instance;