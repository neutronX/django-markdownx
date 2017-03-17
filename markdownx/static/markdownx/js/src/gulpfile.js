/**
 * Created by Pouria Hadjibagheri on 17/01/2017 for version 2.0.0.
 */
// gulpfile.js

const Entry = './markdownx.ts',
      EcmaVersion = "es5",
      CompiledFile = "markdownx.js",
      CompilationTargetDir = '../',
      MinificationTargets = ['../*.js', '!../*.min.js'];

let gulp = require('gulp'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    minifier = require('gulp-uglify/minifier'),
    source = require('vinyl-source-stream'),
    uglify = require('gulp-uglify'),
    pump = require('pump'),
    minify = require('gulp-minify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    runSequence = require('run-sequence'),
    tsify = require('tsify');

let externalDependencies = [];


/**
 * Set for development purposes.
 */
gulp.task('set-dev-environment', () => {
    return process.env.NODE_ENV = 'development';
});

/**
 * Settings for production.
 */
gulp.task('set-prod-environment', () => {
    return process.env.NODE_ENV = 'production';
});


const tsconfig = {
    compilerOptions: {
        moduleResolution: "node",
        inlineSourceMap: false,
        inlineSources: false,
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        removeComments: false,
        preserveConstEnums: true,
        sourceMap: true,
        charset: "utf8",
        module: "commonjs",
        target: "es5",
        pretty: true,
        noLib: false,
        emitBOM: true,
        allowJs: true
    },
    declaration: true,
    files: [
        "*.ts",
        "*.d.ts"
    ]
};


gulp.task('bundle', () => {
    return browserify({
        entries: Entry,
        extensions: ['.ts', '.d.ts'],
        debug: false
    })
        .plugin(tsify, tsconfig)
        .external(externalDependencies)
        .transform(
            babelify.configure({
                presets: [EcmaVersion],
                sourceMaps: true
            })
        )
        .bundle()
        .on('error', (error) => { console.error(error.toString()); })
        .pipe(source(CompiledFile))
        .pipe(gulp.dest(CompilationTargetDir));
});


gulp.task('minify', () => {
    return gulp.src(MinificationTargets)
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(CompilationTargetDir));
});


/**
 * Execution of compilation tasks.
 */
gulp.task('default', () => {
    runSequence(
        ['set-prod-environment', 'bundle'],  // Run in parallel.
        'minify'  // Runs after the parallel tasks are complete.
    )
});
