const gulp = require('gulp')

gulp.task("one", () => {
  console.log("This is task 1")
})

gulp.task("two", () => {
  console.log("This is task 2")
})

gulp.task("main", ["one", "two"], () => {
  console.log("This is the main task")
})
