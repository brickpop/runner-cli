const gulp = require('gulp')

gulp.task("styles", () => {
  console.log("This is the 'styles' task")
})

gulp.task("media", () => {
  console.log("This is the 'media' task")
})

gulp.task("build", ["styles", "media"], () => {
  console.log("This is the build task. It depends on 'styles' and 'media'")
})
