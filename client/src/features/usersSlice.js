import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosPrivate } from '../utils/axiosPrivate'


export const getFreinds = createAsyncThunk('users/getFreinds', async (_, { dispatch, rejectWithValue }) => {
  dispatch(setLoading())
  try {
    const { data } = await axiosPrivate.get('/users')
    return data
  } catch (error) {
    return rejectWithValue({ message: error?.response?.data?.message || "There was an error" })
  }
})

export const getUser = createAsyncThunk('users/getUser', async (params, { dispatch, rejectWithValue }) => {
  dispatch(setLoading())
  try {
    const { data } = await axiosPrivate.get(`/users/getUser?username=${params.username}`)
    return data[0]
  } catch (error) {
    return rejectWithValue({ message: error?.response?.data?.message || "There was an error" })
  }
})

// for the navbar
export const searchUsers = createAsyncThunk('users/searchUsers', async (search, { dispatch, rejectWithValue }) => {
  // dispatch(setLoading())
  try {
    const { data } = await axiosPrivate.get(`/users/searchUsers?search=${search}`)
    return data
  } catch (error) {
    return rejectWithValue({ message: error?.response?.data?.message || "There was an error" })
  }
})

export const changeCoverPicture = createAsyncThunk('users/changeCoverPicture', async (form, { dispatch, rejectWithValue }) => {
  dispatch(setLoading())
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
    const { data } = await axiosPrivate.post(`/users/changeCoverPicture`, form, config)
    return data
  } catch (error) {
    return rejectWithValue({ message: error?.response?.data?.message || "There was an error" })
  }
})

export const changeProfilePicture = createAsyncThunk('users/changeProfilePicture', async (form, { dispatch, rejectWithValue }) => {
  dispatch(setLoading())
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
    const { data } = await axiosPrivate.post(`/users/changeProfilePicture`, form, config)
    return data
  } catch (error) {
    return rejectWithValue({ message: error?.response?.data?.message || "There was an error" })
  }
})

export const getFreindRequestsSent = createAsyncThunk('users/getFreindRequestsSent', async (params, { dispatch, rejectWithValue }) => {
  // dispatch(setLoading())
  try {
    const { data } = await axiosPrivate.get(`/users/getFreindRequestsSent`)
    return data
  } catch (error) {
    return rejectWithValue({ message: error?.response?.data?.message || "There was an error" })
  }
})

export const getFreindRequestsReceived = createAsyncThunk('users/getFreindRequestsReceived', async (params, { dispatch, rejectWithValue }) => {
  // dispatch(setLoading())
  try {
    const { data } = await axiosPrivate.get(`/users/getFreindRequestsReceived`)
    return data
  } catch (error) {
    return rejectWithValue({ message: error?.response?.data?.message || "There was an error" })
  }
})

export const sendFreindRequest = createAsyncThunk('users/sendFreindRequest', async (params, { dispatch, rejectWithValue }) => {
  // dispatch(setLoading())
  try {
    const { data } = await axiosPrivate.patch(`/users/sendFreindRequest/${params.userId}`)
    return data
  } catch (error) {
    return rejectWithValue({ message: error?.response?.data?.message || "There was an error" })
  }
})

export const acceptFreindRequest = createAsyncThunk('users/acceptFreindRequest', async (_id, { dispatch, rejectWithValue }) => {
  // dispatch(setLoading())
  try {
    const { data } = await axiosPrivate.patch(`/users/acceptFreindRequest/${_id}`)
    return data
  } catch (error) {
    return rejectWithValue({ message: error?.response?.data?.message || "There was an error" })
  }
})

export const removeFreind = createAsyncThunk('users/removeFreind', async (params, { dispatch, rejectWithValue }) => {
  // dispatch(setLoading())
  try {
    const { data } = await axiosPrivate.patch(`/users/removeFreind/${params.userId}`)
    return data
  } catch (error) {
    return rejectWithValue({ message: error?.response?.data?.message || "There was an error" })
  }
})

const initialState = {
  loading: true,
  freinds: [],
  freindsId: [],
  // for received we need the users and tehir ids
  freindRequestsReceived: [],
  freindRequestsReceivedIds: [],
  // for sent we need the ids only
  freindRequestsSent: [],
  freindRequestsSentIds: [],
  // freindsIds: [],
  // pendingfreinds: [],
  users: [],
  name: '',
  coverPicture: '',

}

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true
    }
  },
  extraReducers: {
    [getFreinds.fulfilled]: (state, action) => {
      state.loading = false
      state.freinds = action.payload
      state.freindsIds = action.payload.map(f => f._id)
    },
    [getFreinds.rejected]: (state, action) => {
      state.loading = false
    },
    [getUser.fulfilled]: (state, action) => {
      state.loading = false
      state.coverPicture = action.payload.coverPicture
      state.profilePicture = action.payload.profilePicture
      state.name = action.payload.username
    },
    [getUser.rejected]: (state, action) => {
      state.loading = false
    },
    [searchUsers.fulfilled]: (state, action) => {
      state.loading = false
      state.users = action.payload
    },
    [searchUsers.rejected]: (state, action) => {
      state.loading = false
    },
    [changeCoverPicture.fulfilled]: (state, action) => {
      state.coverPicture = action.payload
      state.loading = false
    },
    [changeCoverPicture.rejected]: (state, action) => {
      state.loading = false
    },
    [changeProfilePicture.fulfilled]: (state, action) => {
      state.profilePicture = action.payload
      state.loading = false
    },
    [changeProfilePicture.rejected]: (state, action) => {
      state.loading = false
    },
    [getFreindRequestsSent.fulfilled]: (state, action) => {
      // the payload is the ids of the people the the user sent a freind request to
      state.freindRequestsSentIds = action.payload
    },
    [getFreindRequestsSent.rejected]: (state, action) => {
      state.loading = false
    },
    [getFreindRequestsReceived.pending]: (state, action) => {
      state.freindRequestsReceivedLoading = true
    },
    [getFreindRequestsReceived.fulfilled]: (state, action) => {
      // the payload is the list of people that sent the freind request 
      state.freindRequestsReceived = action.payload
      state.freindRequestsReceivedIds = action.payload.map(f => f._id)
      state.freindRequestsReceivedLoading = false
    },
    [getFreindRequestsReceived.rejected]: (state, action) => {
      state.freindRequestsReceivedLoading = false
      state.loading = false
    },
    [sendFreindRequest.fulfilled]: (state, action) => {
      // the payload is the pendingfreindsIds
      state.loading = false
      state.freindRequestsSentIds = action.payload
    },
    [sendFreindRequest.rejected]: (state, action) => {
      state.loading = false
    },
    [acceptFreindRequest.fulfilled]: (state, action) => {
      state.loading = false
      // the payload is the freinds wich is a bunch of ids
      state.freindRequestsReceivedIds = state.freindRequestsReceivedIds.filter(userId => userId !== action.payload.acceptedUserId)
      state.freindRequestsReceived = state.freindRequestsReceived.filter(f => f._id !== action.payload.acceptedUserId)
      state.freindsIds = action.payload.freinds
    },
    [acceptFreindRequest.rejected]: (state, action) => {
      state.loading = false
    },
    [removeFreind.fulfilled]: (state, action) => {
      state.loading = false
      state.freinds = state.freinds.filter(f => f._id !== action.payload.removedUserId)
      state.freindsIds = state.freindsIds.filter(userId => userId !== action.payload.removedUserId)
      state.freindRequestsSentIds = state.freindRequestsSentIds.filter(userId => userId !== action.payload.removedUserId)
    },
    [removeFreind.rejected]: (state, action) => {
      state.loading = false
    },
  }
})

export const { setLoading } = usersSlice.actions

export default usersSlice.reducer