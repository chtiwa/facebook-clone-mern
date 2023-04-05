import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { axiosInstance } from '../axios'

export const getConversations = createAsyncThunk('conversations/getConversations', async (userId, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get(`/conversations/${userId}`)
    return data
  } catch (error) {
    return rejectWithValue({ message: error?.response?.data?.message || 'There was an error' })
  }
})

export const createConversation = createAsyncThunk('conversations/createConversation', async (params, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post('/conversations', { senderId: params.senderId, receiverId: params.receiverId })
    return data
  } catch (error) {
    return rejectWithValue({ message: error?.response?.data?.message || 'There was an error' })
  }
})

const initialState = {
  conversations: [],
  loading: false,
  error: false
}

const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {

  },
  extraReducers: {
    [getConversations.pending]: (state, action) => {
      state.loading = true
    },
    [getConversations.fulfilled]: (state, action) => {
      state.loading = false
      state.conversations = action.payload
    },
    [getConversations.rejected]: (state, action) => {
      state.loading = false
    },
    [createConversation.pending]: (state, action) => {
      state.loading = true
    },
    [createConversation.fulfilled]: (state, action) => {
      state.conversations = [...state.conversations, action.payload]
      state.loading = false
    },
    [createConversation.rejected]: (state, action) => {
      state.loading = false
    },

  }
})

// const { } = conversationsSlice.actions

export default conversationsSlice.reducer