const { src, dest, parallel, watch, series } = require("gulp"),
  concat = require("gulp-concat"),
  sass = require("gulp-sass")(require("node-sass")),
  pug = require("gulp-pug"),
  autoprefixer = require("autoprefixer"),
  postcss = require("gulp-postcss");

browserSync = require("browser-sync").create();

const FilesPath = {
  sassFiles: "src/sass/*.scss",
  htmlFiles: "src/pug/pages/*.pug",
};

const { sassFiles, htmlFiles } = FilesPath;

function sassTask() {
  return src(sassFiles)
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(concat("styles.css"))
    .pipe(dest("dist/css"))
    .pipe(browserSync.stream());
}

function htmlTask() {
  return src(htmlFiles)
    .pipe(pug({ pretty: true }))
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
}

function assetsTask() {
  return src("assets/**/*").pipe(dest("dist/assets"));
}

function serve() {
  browserSync.init({ server: { baseDir: "./dist" } });
  watch("src/sass/**/*.scss", sassTask);
  watch("src/pug/**/*.pug", htmlTask);
}

exports.sass = sassTask;
exports.html = htmlTask;
exports.assets = assetsTask;
exports.default = series(parallel(htmlTask, sassTask, assetsTask));
exports.serve = series(serve, parallel(htmlTask, sassTask, assetsTask));
