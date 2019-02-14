const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  var initialValue = 0
  var sum = blogs.reduce(
    (acc, blog) => acc + blog.likes
    , initialValue)
  return sum
}

const favoriteBlog = (blogs) => {
  if (blogs === null || blogs.length === 0) {
    return null
  }
  let max = 0
  let fav = 0
  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].likes > max) {
      max = blogs[i].likes
      fav = i
    }
  }
  const favBlog = { title: blogs[fav].title, author: blogs[fav].author, likes: max }
  return favBlog
}

const mostBlogs = (blogs) => {
  if (blogs === null || blogs.length === 0) {
    return null
  }
  let max = 0
  let counts = new Map()
  let most = 0
  for (let i = 0; i < blogs.length; i++) {
    let count = 1
    if (counts.has(blogs[i].author)) {
      count += counts.get(blogs[i].author)
    }
    counts.set(blogs[i].author, count)
    if (count > max) {
      max = count
      most = i
    }
  }
  let topBlogger = { author: blogs[most].author, blogs: max }
  return topBlogger
}

const mostLikes = (blogs) => {
  if (blogs === null || blogs.length === 0) {
    return null
  }
  let max = 0
  let counts = new Map()
  let most = 0
  for (let i = 0; i < blogs.length; i++) {
    let count = blogs[i].likes
    if (counts.has(blogs[i].author)) {
      count += counts.get(blogs[i].author)
    }
    counts.set(blogs[i].author, count)
    if (count >= max) {
      max = count
      most = i
    }
  }
  let likedBlogger = { author: blogs[most].author, likes: max }
  return likedBlogger
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}