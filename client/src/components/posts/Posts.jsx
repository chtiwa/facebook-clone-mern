import React from 'react'
import './posts.css'
import Post from './post/Post'
import { useSelector } from 'react-redux'
import Loader from '../loader/Loader'

const Posts = () => {
  const { postsLoading, posts } = useSelector(state => state.posts)

  if (!postsLoading && posts.length === 0) {
    return <h2 style={{ margin: '1rem 0' }} >No posts has been made yet...</h2>
  }

  return (
    <div className="posts" >
      {posts.length > 0 && posts.map((post, index) => {
        return (
          <Post {...post} key={index} index={index} length={posts.length} />
        )
      })}
      {postsLoading && (
        <Loader />
      )}
    </div>
  )
}

export default Posts