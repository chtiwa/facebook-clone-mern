import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { axiosInstance } from '../axios'

export const getMessages = createAsyncThunk('messages/getMessages', async (params, { rejectWithValue }) => {
  try {
    // console.log(params)
    const { data } = await axiosInstance.get(`/messages/${params.conversationId}`)
    return data
  } catch (error) {
    return rejectWithValue({ message: error?.response?.data?.message || 'There was an error' })
  }
})

export const createMessage = createAsyncThunk('messages/createMessage', async (params, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post(`/messages`, { conversationId: params.conversationId, sender: params.sender, text: params.text })
    return data
  } catch (error) {
    return rejectWithValue({ message: error?.response?.data?.message || 'There was an error' })
  }
})

const initialState = {
  messages: [],
  loading: false,
  error: false
}

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = [...state.messages, action.payload]
    }
  },
  extraReducers: {
    [getMessages.pending]: (state, action) => {
      state.loading = true
    },
    [getMessages.fulfilled]: (state, action) => {
      state.loading = true
      state.messages = action.payload
    },
    [getMessages.rejected]: (state, action) => {
      state.loading = true
    },
    [createMessage.pending]: (state, action) => {
      state.loading = true
    },
    [createMessage.fulfilled]: (state, action) => {
      state.messages = [...state.messages, action.payload]
      state.loading = false
    },
    [createMessage.rejected]: (state, action) => {
      state.loading = false
    }
  }
})

export const { setMessages } = messagesSlice.actions

export default messagesSlice.reducer