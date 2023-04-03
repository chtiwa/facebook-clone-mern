import { configureStore } from "@reduxjs/toolkit"
import logger from 'redux-logger'
import authReducer from './features/authSlice'
import modalReducer from './features/modalSlice'
import postsReducer from './features/postsSlice'
import usersReducer from './features/usersSlice'
import storiesReducer from './features/storiesSlice'
import conversationsReducer from './features/conversationsSlice'
import messagesReducer from './features/messagesSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
    posts: postsReducer,
    users: usersReducer,
    stories: storiesReducer,
    conversations: conversationsReducer,
    messages: messagesReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
})