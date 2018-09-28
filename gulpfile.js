const gulp = require('gulp');
const less =  require('gulp-less');

gulp.task('less', () => {
  gulp.src('./components/*/style/index.less')
    .pipe(
      less()
    )
    .pipe(
      gulp.dest('es')
    );
});

