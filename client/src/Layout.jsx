import React from 'react'
import Navbar from './components/navbar/Navbar'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import StoryCarousel from './components/stories/StoryCarousel'
import Modal from './components/create/Modal'
import PostModal from './components/posts/post/PostModal'

const Layout = () => {
  const { isCarouselOpen, stories } = useSelector(state => state.stories)
  const { isCreateOpen, isPostModalOpen } = useSelector(state => state.posts)
  return (
    <>
      {isCarouselOpen && <StoryCarousel stories={stories} />}
      {isCreateOpen && <Modal />}
      {isPostModalOpen && <PostModal />}
      <Navbar />
      <Outlet />
      {/* {!isCarouselOpen && !isCreateOpen && !isPostModalOpen &&
        <>
          <Navbar />
          <Outlet />
          </>
        } */}
    </>
  )
}

export default Layout