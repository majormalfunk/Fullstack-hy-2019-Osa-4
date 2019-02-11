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
  let max = 0
  let fav = 0
  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].likes > max) {
      max = blogs[i].likes
      fav = i
    }
  }
  const blog = blogs[fav]
  delete blog._id
  delete blog.url
  delete blog.__v
  return blog
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}