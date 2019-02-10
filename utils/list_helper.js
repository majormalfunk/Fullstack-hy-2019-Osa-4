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

module.exports = {
  dummy,
  totalLikes
}