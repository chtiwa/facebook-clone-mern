import React, { useEffect } from 'react'
import './home.css'
// import LeftNav from '../../components/let-nav/LeftNav'
import RightNav from '../../components/right-nav/RightNav'
import Stories from '../../components/stories/Stories'
import Create from '../../components/create/Create'
import Posts from '../../components/posts/Posts'
import { useDispatch } from 'react-redux'
import { getPosts } from '../../features/postsSlice'

const Home = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getPosts())
  }, [dispatch])

  return (
    <div className="home">
      <div className="home__main-navigation">
        <Stories />
        <Create />
        <Posts />
      </div>
      <RightNav />
    </div>
  )
}

export default Home