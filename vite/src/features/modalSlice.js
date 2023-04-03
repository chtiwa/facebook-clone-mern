import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isOpen: false,
  message: false,
  success: false
}

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true
      state.message = action.payload.message
      state.success = action.payload.success
    },
    closeModal: (state, action) => {
      state.isOpen = false
      state.message = ""
      state.success = false
    }
  }
})

export const { openModal, closeModal } = modalSlice.actions

export default modalSlice.reducer