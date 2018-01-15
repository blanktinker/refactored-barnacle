//================================(Requirements)================================
var gulp        = require('gulp');
var browserSync = require('browser-sync');
var concat      = require('gulp-concat');
var cp          = require('child_process');
var cssnano     = require('gulp-cssnano');
var del         = require('del');
var imagemin    = require('gulp-imagemin');
var prefix      = require('gulp-autoprefixer');
var pug         = require('gulp-pug');
var rename      = require('gulp-rename');
var sass        = require('gulp-sass');
var uglify      = require('gulp-uglify');


//==============================(Useful Variables)==============================
var jekyll = process.platform === "win32" ? "bundle.bat" : "bundle";
var jekyllArgs = {
  dev: ['exec', 'jekyll', 'build', '--config=_app/jekyll/_config.yml'],
  prod: ['exec', 'jekyll', 'build', '--config=_app/jekyll/_config.yml,_app/jekyll/_config-prod.yml']};
var paths = {
  imageDirectory:             './_app/images/**/*',
  imageDestination:           './_dist/images',
  imageWatch:                 './_app/images/**/*',
  javascriptDirectory:        './_app/js/*.js',
  javascriptDestination:      './_dist/js',
  javascriptWatch:           ['./_app/js/*.js'],
  pugfilesDirectory:          './_app/pugfiles/*',
  pugfilesDestination:        './_app/jekyll/_includes',
  pugfilesWatch:              './_app/pugfiles/*',
  sassDirectory:              './_app/css/main.sass',
  sassDestination:            './_dist/css',
  sassWatch:                 ['./_app/css/**/*.scss',
                              './_app/css/**/*.sass'],
  preDistDirectory:           './_app/temp/**/*',
  siteDirectory:              './_dist/',
  htmlWatch:                 ['./_app/jekyll/*.html',
                              './_app/jekyll/*.md',
                              './_app/jekyll/_data/*',
                              './_app/jekyll/_drafts/*',
                              './_app/jekyll/_includes/*',
                              './_app/jekyll/_layouts/*',
                              './_app/jekyll/_posts/*']
};
var _temp = "";


//=====================(Build & Launch in Development Mode)=====================
/* Build the Jekyll files in '_app/temp' using development values */
gulp.task('jekyll-build', function (done) {
  return cp.spawn(jekyll, jekyllArgs.dev, {stdio: 'inherit'})
  .on('close', done);
});

/* Move the Jekyll files to '_dist' */
gulp.task('jekyll-move', ['jekyll-build'], function (done) {
  return gulp.src(paths.preDistDirectory)
  .pipe(gulp.dest(paths.siteDirectory));
});

/* Rebuild Jekyll and reload page */
gulp.task('jekyll-rebuild', ['jekyll-move'], function () {
  browserSync.reload();
});

/* Wait for site and assets to build, then launch the Server */
gulp.task('browser-sync', ['sass', 'scripts', 'jekyll-move'], function() {
  browserSync({
    server: { baseDir: paths.siteDirectory },
    notify: false
  });
});

/* Compile and autoprefix files from _app/css into _dist/css */
gulp.task('sass', function () {
  return gulp.src(paths.sassDirectory)
  .pipe(sass({ onError: browserSync.notify }))
  .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
  .pipe(gulp.dest(paths.sassDestination))
  .pipe(browserSync.reload({stream:true}));
});

/* Concatenate files from _app/js into _dist/js/scripts.js */
gulp.task('scripts', function () {
  return gulp.src([paths.javascriptDirectory])
  .pipe(concat('scripts.js'))
  .pipe(gulp.dest(paths.javascriptDestination))
  .pipe(browserSync.reload({stream:true}));
});

/* Losslessly minify image files from _app/images into _dist/images */
gulp.task('images', function () {
  return gulp.src([paths.imageDirectory])
  .pipe(imagemin())
  .pipe(gulp.dest(paths.imageDestination))
  .pipe(browserSync.reload({stream:true}));
});

/* Preprocess pug files from _app/pugfiles to _app/jekyll/_includes so that
 * Jekyll has code snippets available for its build process */
gulp.task('pugfiles', function () {
  return gulp.src(paths.pugfilesDirectory)
  .pipe(pug())
  .pipe(gulp.dest(paths.pugfilesDestination))
  .pipe(browserSync.reload({stream:true}));
});

/* Watch .html & .md files for changes and run jekyll and reload BrowserSync
 * Watch images and recompile the site upon the changes
 * Watch .js files for changes and recompile
 * Watch .sass & .scss files for changes & recompile
 * Watch .pug files for changes and recompile */
gulp.task('watch', function () {
  gulp.watch(paths.htmlWatch, ['jekyll-rebuild']);
  gulp.watch(paths.imageWatch, ['images']);
  gulp.watch(paths.javascriptWatch, ['scripts']);
  gulp.watch(paths.sassWatch, ['sass']);
  gulp.watch(paths.pugfilesWatch, ['pugfiles']);
});

/* Running `gulp` will compile the sass and js files, will run jekyll, and will
 * launch BrowserSync and watch the files for any changes. */
gulp.task('default', ['browser-sync', 'watch']);


//=======================(Build Deployment-Ready Version)=======================
/* Build the Jekyll site skeleton in '_app/temp' using production values */
gulp.task('jekyll-build:prod', function (done) {
  return cp.spawn(jekyll, jekyllArgs.prod, {stdio: 'inherit'})
  .on('close', done);
});

/* Move the Jekyll files to '_dist' */
gulp.task('jekyll-move:prod', ['jekyll-build:prod'], function (done) {
  return gulp.src(paths.preDistDirectory)
  .pipe(gulp.dest(paths.siteDirectory));
});

/* Compile, autoprefix, and minify files from _app/css into _dist/css */
gulp.task('sass:prod', function () {
  return gulp.src(paths.sassDirectory)
  .pipe(sass({ onError: browserSync.notify }))
  .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
  .pipe(gulp.dest(paths.sassDestination))
  .pipe(rename('main.min.css'))
  .pipe(cssnano())
  .pipe(gulp.dest(paths.sassDestination));
});

/* Concatenate and minify files from _app/js into both _dist/js/scripts.js and
 * _dist/js/scripts.min.js respectively */
gulp.task('scripts:prod', function () {
  return gulp.src([paths.javascriptDirectory])
  .pipe(concat('scripts.js'))
  .pipe(gulp.dest(paths.javascriptDestination))
  .pipe(rename('scripts.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest(paths.javascriptDestination));
});

/* Losslessly minify image files from _app/images into _dist/images */
gulp.task('images:prod', function () {
  return gulp.src([paths.imageDirectory])
  .pipe(imagemin())
  .pipe(gulp.dest(paths.imageDestination));
});

/* Preprocess pug files from _app/pugfiles to _app/jekyll/_includes so that
 * Jekyll has code snippets available for its build process */
gulp.task('pugfiles:prod', function () {
  return gulp.src(paths.pugfilesDirectory)
  .pipe(pug())
  .pipe(gulp.dest(paths.pugfilesDestination));
});

/* Running `gulp build` will compile deployment-ready site content */
gulp.task('build', ['pugfiles:prod', 'images:prod', 'scripts:prod', 'sass:prod', 'jekyll-move:prod']);


//=============================(Maintenance Tasks)=============================
/* Will delete the '_dist' directory and its contents */
gulp.task('clean:site', function () {
  return del([paths.siteDirectory]);
});

/* Will delete the contents from the '_app/temp' directory */
gulp.task('clean:temp', function () {
  return del([paths.preDistDirectory]);
});

/* Running `gulp clean` will clear all non-development files */
gulp.task('clean', ['clean:site', 'clean:temp']);
