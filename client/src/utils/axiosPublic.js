import axios from 'axios'
// make two axios instances where one is called for basic api calls e.g : login / register
// another for e.g : chekLogin and other sensetive api calls
const axiosPublic = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_APP_SERVER_URL
})

export { axiosPublic }