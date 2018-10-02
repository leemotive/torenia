const gulp = require('gulp');
const less = require('gulp-less');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const cssmin = require('gulp-cssmin');
const dir = require('node-dir');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const es = require('event-stream');

gulp.task('less:es', () => {
  const css = gulp.src('./components/**/index.less')
    .pipe(less())
    .pipe(gulp.dest('es'));
  const origin = gulp.src('./components/**/*.less')
    .pipe(gulp.dest('es'));

  return es.concat(css, origin);
});
gulp.task('less:lib', () => {
  const css = gulp.src('./components/**/index.less')
    .pipe(less())
    .pipe(gulp.dest('lib'));

  const origin = gulp.src('./components/**/*.less')
    .pipe(gulp.dest('lib'));

  return es.concat(css, origin);
});
gulp.task('less:dist', () => {
  gulp.src('./components/index.less')
    .pipe(less())
    .pipe(cssmin())
    .pipe(rename('torenia.min.css'))
    .pipe(gulp.dest('dist'));
});

gulp.task('less', ['less:es', 'less:lib', 'less:dist']);

gulp.task('build:es', ['less:es'], () => {
  gulp.src(babelSrc)
    .pipe(babel(babelConfiguartion(false)))
    .pipe(gulp.dest('./es'));
});

gulp.task('build:lib', ['less:lib'], () => {
  gulp.src(babelSrc)
    .pipe(babel(babelConfiguartion('commonjs')))
    .pipe(gulp.dest('./lib'));
});

gulp.task('build:dist', ['less:dist'], () => {
  const compile = webpack({
    mode: 'production',
    entry: './components/index.js',
    output: {
      filename: 'torenia.min.js',
      library: 'torenia',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                ...babelConfiguartion(),
              }
            }
          ]
        }
      ]
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      moment: 'moment',
      'prop-types': 'PropTypes',
      antd: 'antd',
    }
  });
  return new Promise(resolve => {
    compile.run(function(err, stats) {
      console.log(stats.toString({colors: true}));
      resolve();
    });
  });

});

gulp.task('build', ['build:es', 'build:lib', 'build:dist']);


gulp.task('entry:js', () => {
  const paths = dir.files('./components', 'dir', () => { }, {
    recursive: false, sync: true, shortName: true,
  });
  const content = paths.map(name => {
    const exportName = `${name.charAt(0).toUpperCase()}${name.slice(1)}`
    return `export { default as ${exportName} } from './${name}';`
  }).join('\n');
  fs.writeFileSync('./components/index.js', content, {
    encoding: 'utf8'
  });
});

gulp.task('entry:less', () => {
  const files = glob.sync('./*/style/index.less', { cwd: './components' });
  fs.writeFileSync('./components/index.less', files.map(f => `@import '${f}';`).join('\n'), {
    encoding: 'utf8'
  });
});

gulp.task('entry', ['entry:js', 'entry:less']);

const babelSrc = ['./components/**/*.js'];
function babelConfiguartion(modules) {
  const option = { modules };
  return {
    presets: [
      ['@babel/preset-env', option],
      '@babel/preset-react'
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-export-default-from',
    ]
  }
}
