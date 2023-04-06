import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosPrivate } from '../utils/axiosPrivate'
import { openModal } from './modalSlice'

export const getPosts = createAsyncThunk('posts/getPosts', async (_, { dispatch, rejectWithValue }) => {
  dispatch(setLoading())
  try {
    // const { data } = await axiosPrivate.get(`posts/?page=${page}`)
    const { data } = await axiosPrivate.get(`posts`)
    // dispatch(setPage(page + 1))
    return data
  } catch (error) {
    return rejectWithValue({ message: error?.response?.data?.message || "There was an error" })
  }
})

export const createPost = createAsyncThunk('posts/createPost', async (form, { dispatch, rejectWithValue }) => {
  dispatch(setLoading())
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
    const { data } = await axiosPrivate.post(`posts`, form, config)
    dispatch(openModal({ message: 'Post was created successfully', success: true }))
    return data
  } catch (error) {
    dispatch(openModal({ message: error?.response?.data?.message || "There was an error", success: false }))
    return rejectWithValue({ message: error?.response?.data?.message || "There was an error" })
  }
})

export const deletePost = createAsyncThunk('posts/deletePost', async (id, { dispatch, rejectWithValue }) => {
  // dispatch(setLoading())
  try {
    const { data } = await axiosPrivate.delete(`posts/${id}`)
    dispatch(openModal({ message: 'Post was deleted successfully', success: true }))
    return data
  } catch (error) {
    dispatch(openModal({ message: error?.response?.data?.message || "There was an error", success: false }))
    return rejectWithValue({ message: error?.response?.data?.message || "There was an error" })
  }
})

export const getUserPosts = createAsyncThunk('posts/getUserPosts', async (params, { dispatch, rejectWithValue }) => {
  dispatch(setLoading())
  try {
    // const { data } = await axiosPrivate.post(`posts/userPosts/${userId}`)
    const { data } = await axiosPrivate.get(`posts/userPosts/${params.creator}?page=${params.page}`)
    return data
  } catch (error) {
    return rejectWithValue({ message: error?.response?.data?.message || "There was an error" })
  }
})
export const likePost = createAsyncThunk('posts/likePost', async (postId, { dispatch, rejectWithValue }) => {
  // dispatch(setLoading())
  try {
    const { data } = await axiosPrivate.patch(`posts/likePost/${postId}`)
    // data :{hasLikedPost,likedPost}
    return data
  } catch (error) {
    return rejectWithValue({ message: error?.response?.data?.message || "There was an error" })
  }
})
export const unlikePost = createAsyncThunk('posts/unlikePost', async (postId, { dispatch, rejectWithValue }) => {
  // dispatch(setLoading())
  try {
    const { data } = await axiosPrivate.patch(`posts/unlikePost/${postId}`)
    return data
  } catch (error) {
    return rejectWithValue({ message: error?.response?.data?.message || "There was an error" })
  }
})
export const commentPost = createAsyncThunk('posts/commentPost', async (params, { dispatch, rejectWithValue }) => {
  // dispatch(setLoading())
  try {
    console.log(params)
    const { postId, comment } = params
    const { data } = await axiosPrivate.patch(`posts/commentPost/${postId}`, { comment: comment })
    return data
  } catch (error) {
    return rejectWithValue({ message: error?.response?.data?.message || "There was an error" })
  }
})

const initialState = {
  isCreateOpen: false,
  isPostModalOpen: false,
  // postModal files
  files: [],
  posts: [],
  // page: 1,
  // userPage: 1,
  // pages: 1,
  // lastPostY: 10000,
  comments: [],
  likes: [],
  loading: true,
  postsLoading: true,
  error: false
}

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // different loading states
    setLoading: (state) => {
      state.loading = true
    },
    openCreate: (state) => {
      state.isCreateOpen = true
    },
    closeCreate: (state) => {
      state.isCreateOpen = false
    },
    openPostModal: (state, action) => {
      state.files = action.payload
      state.isPostModalOpen = true
    },
    closePostModal: (state) => {
      state.isPostModalOpen = false
    },
    // setPage: (state, action) => {
    //   state.page = action.payload
    // },
    // setUserPage: (state, action) => {
    //   state.userPage = action.payload
    // },
    // setLastPostY: (state, action) => {
    //   state.lastPostY = action.payload
    // }
  },
  extraReducers: {
    [getPosts.pending]: (state) => {
      state.postsLoading = true
    },
    [getPosts.fulfilled]: (state, action) => {
      state.postsLoading = false
      // state.posts = [...state.posts, ...action.payload.posts]
      state.posts = action.payload.posts
      state.pages = action.payload.pages
    },
    [getPosts.rejected]: (state) => {
      state.postsLoading = false
    },
    [createPost.fulfilled]: (state, action) => {
      state.loading = false
      state.posts = [...state.posts, action.payload]
    },
    [createPost.rejected]: (state) => {
      state.loading = false
    },
    [deletePost.pending]: (state, action) => {
      state.loading = false
    },
    [deletePost.fulfilled]: (state, action) => {
      state.posts = state.posts.filter(post => post._id !== action.payload)
    },
    [deletePost.rejected]: (state, action) => {
      state.loading = false
    },
    [getUserPosts.pending]: (state) => {
      state.postsLoading = true
    },
    [getUserPosts.fulfilled]: (state, action) => {
      state.postsLoading = false
      // state.posts = [...state.posts, ...action.payload.posts]
      state.posts = action.payload.posts
      state.pages = action.payload.pages
    },
    [getUserPosts.rejected]: (state, action) => {
      state.postsLoading = false
    },
    [likePost.fulfilled]: (state, action) => {
      state.loading = false
      state.posts = state.posts.map((post) => action.payload.likedPost._id === post._id ? action.payload.likedPost : post)
    },
    [likePost.rejected]: (state, action) => {
      state.loading = false
    },
    [unlikePost.fulfilled]: (state, action) => {
      state.loading = false
      state.posts = state.posts.map((post) => action.payload.unlikedPost._id === post._id ? action.payload.unlikedPost : post)
    },
    [unlikePost.rejected]: (state, action) => {
      state.loading = false
    },
    [commentPost.fulfilled]: (state, action) => {
      state.loading = false
      state.posts = state.posts.map((post) => action.payload.post._id === post._id ? action.payload.post : post)
    },
    [commentPost.rejected]: (state, action) => {
      state.loading = false
    }
  }
})

export const { setLoading, closeCreate, openCreate, openPostModal, closePostModal } = postsSlice.actions
export default postsSlice.reducer