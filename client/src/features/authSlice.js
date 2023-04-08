import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosPublic } from '../utils/axiosPublic'
import { axiosPrivate } from '../utils/axiosPrivate'
import { openModal } from './modalSlice'

export const login = createAsyncThunk('auth/login', async (form, { dispatch, rejectWithValue }) => {
  dispatch(setLoading())
  try {
    const { data } = await axiosPublic.post('/auth/login', form)
    return data
  } catch (error) {
    dispatch(openModal({ message: error.response?.data?.message || "There was an error", success: false }))
    return rejectWithValue({ message: error?.response?.data?.message || 'There was an error' })

  }
})

export const signup = createAsyncThunk('auth/signup', async (form, { dispatch, rejectWithValue }) => {
  dispatch(setLoading())
  try {
    const { data } = await axiosPublic.post('/auth/signup', form)
    return data
  } catch (error) {
    dispatch(openModal({ message: error.response?.data?.message || "There was an error", success: false }))
    return rejectWithValue({ message: error?.response?.data?.message || 'There was an error' })

  }
})

export const checkLogin = createAsyncThunk('auth/checkLogin', async (_, { dispatch, rejectWithValue }) => {
  // dispatch(setLoading())
  try {
    const { data } = await axiosPrivate.get('/auth/checkLogin')
    return data
  } catch (error) {
    // dispatch(openModal({ message: error.response?.data?.message || "There was an error", success: false }))
    return rejectWithValue({ message: error?.response?.data?.message || 'There was an error' })
  }
})

export const logout = createAsyncThunk('auth/logout', async (_, { dispatch, rejectWithValue }) => {
  dispatch(setLoading())
  try {
    const { data } = await axiosPrivate.get('/auth/logout')
    return data
  } catch (error) {
    dispatch(openModal({ message: error.response?.data?.message || "There was an error", success: false }))
    return rejectWithValue({ message: error?.response?.data?.message || 'There was an error' })
  }
})

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (form, { dispatch, rejectWithValue }) => {
  dispatch(setLoading())
  try {
    const { data } = await axiosPrivate.post('/auth/forgotPassword', form)
    dispatch(openModal({ message: data.message, success: true }))
    return data
  } catch (error) {
    dispatch(openModal({ message: error?.response?.data?.message || "There was an error", success: false }))
    return rejectWithValue({ message: error?.response?.data?.message || 'There was an error' })
  }
})

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ resetToken, form, navigate }, { dispatch, rejectWithValue }) => {
  dispatch(setLoading())
  try {
    const { data } = await axiosPrivate.patch(`/auth/resetPassword/${resetToken}`, form.password)
    // data is the action.payload
    dispatch(openModal({ message: data.message, success: true }))
    navigate('/auth')
    return data
  } catch (error) {
    dispatch(openModal({ message: error.response?.data?.message || "There was an error", success: false }))
    return rejectWithValue({ message: error?.response?.data?.message || 'There was an error' })
  }
})

const initialState = {
  username: null,
  profilePicture: null,
  userId: null,
  isLoggedIn: false,
  checkLoginLoading: true,
  emailLoading: false,
  emailError: false,
  loading: false,
  error: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true
    },
    setError: (state, action) => {
      state.error = action.payload
      // the error message will show on the modal
    }
  },
  extraReducers: {
    [login.fulfilled]: (state, action) => {
      state.loading = false
      state.isLoggedIn = true
      state.username = action.payload.username
      state.profilePicture = action.payload.profilePicture
      state.userId = action.payload.userId
      // console.log(action.payload)
    },
    [login.rejected]: (state, action) => {
      state.loading = false
    },
    [signup.fulfilled]: (state, action) => {
      state.loading = false
      state.isLoggedIn = true
      state.username = action.payload.username
      state.profilePicture = action.payload.profilePicture
      state.userId = action.payload.userId
    },
    [signup.rejected]: (state, action) => {
      state.loading = false
    },
    [checkLogin.pending]: (state, action) => {
      state.checkLoginLoading = true
    },
    [checkLogin.fulfilled]: (state, action) => {
      state.checkLoginLoading = false
      state.isLoggedIn = action.payload.success
      state.username = action.payload.username
      state.profilePicture = action.payload.profilePicture
      state.userId = action.payload.userId
    },
    [checkLogin.rejected]: (state, action) => {
      state.checkLoginLoading = false
      state.isLoggedIn = false
    },
    [logout.fulfilled]: (state, action) => {
      state.loading = false
      state.isLoggedIn = false
      state.username = null
      state.profilePicture = null
      state.userId = null
    },
    [forgotPassword.pending]: (state) => {
      state.emailLoading = true
    },
    [forgotPassword.fulfilled]: (state, action) => {
      state.emailLoading = false
    },
    [forgotPassword.rejected]: (state, action) => {
      // trial 
      state.emailError = true
    },
    [resetPassword.fulfilled]: (state, action) => {
      state.loading = false
    },
    [resetPassword.rejected]: (state, action) => {
      state.loading = false
    }
  }
})

export const { setLoading, setError } = authSlice.actions

export default authSlice.reducer