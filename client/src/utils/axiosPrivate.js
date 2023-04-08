import axios from 'axios'
// make two axios instances where one is called for basic api calls e.g : login / register
// another for e.g : chekLogin and other sensetive api calls
const axiosPrivate = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_APP_SERVER_URL
})

let cancelToken;

axiosPrivate.interceptors.response.use(
  (res) => {
    return res
  },
  async (err) => {
    const originalConfig = err.config
    if (cancelToken) {
      cancelToken.cancel('Canceled due to new request');
    }
    cancelToken = axios.CancelToken.source();
    if (err.response) {
      // to prevent an infinite loop
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true

        try {
          const { data } = await axiosPrivate.get('/auth/checkLogin', { cancelToken: cancelToken.token })
          console.log(data)
          return axiosPrivate(originalConfig)
        } catch (error) {
          if (error.response && error.response.message) {
            return Promise.reject(error.response.message)
          }
        }
        if (err.response.status === 403 && err.response.message) {
          return Promise.reject(err.response.message)
        }
      }
      return Promise.reject(err)
    }
  }
)

export { axiosPrivate }