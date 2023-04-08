import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosPrivate } from '../utils/axiosPrivate'
import { openModal } from './modalSlice'

export const getStories = createAsyncThunk('story/getStrories', async (_, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await axiosPrivate.get('/stories')
    return data
  } catch (error) {
    return rejectWithValue({ message: error?.response?.data?.message || "There was an error" })
  }
})

export const createStory = createAsyncThunk('story/createStory', async (story, { dispatch, rejectWithValue }) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
    const { data } = await axiosPrivate.post('/stories', story, config)
    dispatch(openModal({ message: 'Story was created successfully.', success: true }))
    return data
  } catch (error) {
    dispatch(openModal({ message: error?.response?.data?.message || "There was an error!", success: false }))
    return rejectWithValue({ message: error?.response?.data?.message || "There was an error" })
  }
})


const initialState = {
  loading: true,
  createStoryloading: false,
  stories: [],
  isCarouselOpen: false
}

const storiesSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // setLoading: (state) => {
    //   state.loading = true
    // },
    openCarousel: (state) => {
      state.isCarouselOpen = true
    },
    closeCarousel: (state) => {
      state.isCarouselOpen = false
    }
  },
  extraReducers: {
    [getStories.fulfilled]: (state, action) => {
      state.loading = false
      state.stories = action.payload
    },
    [getStories.rejected]: (state, action) => {
      state.loading = false
    },
    [createStory.pending]: (state, action) => {
      state.createStoryloading = true
    },
    [createStory.fulfilled]: (state, action) => {
      state.createStoryloading = false
      state.stories = [...state.stories, action.payload]
    },
    [createStory.rejected]: (state, action) => {
      state.createStoryloading = false
    }

  }
})

export const { setLoading, openCarousel, closeCarousel } = storiesSlice.actions

export default storiesSlice.reducer