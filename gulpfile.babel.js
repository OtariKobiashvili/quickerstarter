import gulp from "gulp";
import sass from "gulp-sass";
import cssnano from "gulp-cssnano";
import autoprefix from "gulp-autoprefixer";
import imagemin from "gulp-imagemin";
import babel from "gulp-babel";
import uglify from "gulp-uglify";
import rename from "gulp-rename";
import connect from "gulp-connect";

const paths = {
  html: './*.html',
  scss: './app/public/sass/**/*.scss',
  js: './app/scripts/*.js',
  images: 'app/public/images/*'
}

function handleError (error) {
  console.log(error.toString());
  this.emit('end');
}

gulp.task('html_livereload', () => {
  return gulp.src(paths.html)
    .pipe(gulp.dest('./'))
    .pipe(connect.reload());
});

// Repurpose SCSS to CSS, add prefixes, minify CSS, reload server on change
gulp.task('sass_to_css', () => {
  return gulp.src(paths.scss)
    .pipe(sass()).on('error', sass.logError)
    .pipe(autoprefix('last 2 versions'))
    .pipe(cssnano())
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
});

gulp.task('bundle_js', () => {
  return gulp.src(paths.js)
    .pipe(babel())
    .on('error', handleError)
    .pipe(rename('bundle.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
})

gulp.task('optimize-images', () => {
  gulp.src(paths.images)
    .pipe(imagemin())
    .pipe(gulp.dest('dist/assets/images'));
})

// Connect gulp server with LiveReload
gulp.task('connect', () => {
  connect.server({
    root: '.',
    livereload: true
  });
});

gulp.task('watch', ()=> {
  gulp.watch(paths.js, ['bundle_js']);
  gulp.watch('./app/public/sass/**/*', ['sass_to_css']);
  gulp.watch('./index.html', ['html_livereload']);
});

gulp.task('default',['optimize-images','connect','watch']);
