const gulp = require('gulp');
const less = require('gulp-less');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const cssmin = require('gulp-cssmin');
const merge = require('merge-stream');
const dir = require('node-dir');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const fse = require('fs-extra');

gulp.task('less:es', () => {
  const css = gulp
    .src('./components/**/index.less')
    .pipe(less())
    .pipe(gulp.dest('es'));
  const origin = gulp.src('./components/**/*.less').pipe(gulp.dest('es'));
  return merge(css, origin);
});
gulp.task('less:lib', () => {
  const css = gulp
    .src('./components/**/index.less')
    .pipe(less())
    .pipe(gulp.dest('lib'));
  const origin = gulp.src('./components/**/*.less').pipe(gulp.dest('lib'));
  return merge(css, origin);
});
gulp.task('less:dist', () => {
  gulp
    .src('./components/index.less')
    .pipe(less())
    .pipe(cssmin())
    .pipe(rename('torenia.min.css'))
    .pipe(gulp.dest('dist'));
});

gulp.task('less', ['less:es', 'less:lib', 'less:dist']);

gulp.task('build:es', () => {
  gulp
    .src(babelSrc)
    .pipe(babel(babelConfiguartion(false)))
    .pipe(gulp.dest('./es'));
});

gulp.task('build:lib', () => {
  gulp
    .src(babelSrc)
    .pipe(babel(babelConfiguartion('commonjs')))
    .pipe(gulp.dest('./lib'));
});

gulp.task('build:dist', () => {
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
              },
            },
          ],
        },
      ],
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      moment: 'moment',
      'prop-types': 'PropTypes',
      antd: 'antd',
    },
  });
  return new Promise(resolve => {
    compile.run(function(err, stats) {
      /* eslint-disable-next-line no-console */
      console.log(stats.toString({ colors: true }));
      resolve();
    });
  });
});

gulp.task('build', ['build:es', 'build:lib', 'build:dist'], () => {
  const paths = dir.files('./components', 'dir', () => {}, {
    recursive: false,
    sync: true,
    shortName: true,
  });

  paths.forEach(d => {
    fse.ensureFile(path.resolve(__dirname, 'es', d, 'style/index.js'));
    fse.ensureFile(path.resolve(__dirname, 'lib', d, 'style/index.js'));
  });
});

gulp.task('entry:js', () => {
  const paths = dir.files('./components', 'dir', () => {}, {
    recursive: false,
    sync: true,
    shortName: true,
  });
  const content = paths
    .map(name => {
      const exportName = `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
      return `export { default as ${exportName} } from './${name}';\n`;
    })
    .join('');
  fs.writeFileSync('./components/index.js', content, {
    encoding: 'utf8',
  });
});

gulp.task('entry:less', () => {
  const files = glob.sync('./*/style/index.less', { cwd: './components' });
  fs.writeFileSync(
    './components/index.less',
    files.map(f => `@import '${f}';`).join('\n'),
    {
      encoding: 'utf8',
    },
  );
});

gulp.task('entry', ['entry:js', 'entry:less']);

const babelSrc = ['./components/**/*.js'];
function babelConfiguartion(modules) {
  const option = { modules };
  return {
    presets: [['@babel/preset-env', option], '@babel/preset-react'],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-export-default-from',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator',
    ],
  };
}
