const fs = require('fs');
const path = require('path');

const packageJSON = require('./package.json');
const { dependencies, devDependencies } = packageJSON;
let dependALL = Object.assign(dependencies, devDependencies);
// 所有依赖文件名
dependALL = Object.keys(dependALL);

let used = new Set([
  'babel-core',
  'babel-plugin-transform-runtime',
  'babel-preset-es2015',
  'babel-preset-react',
  'babel-preset-stage-0',
  'babel-preset-stage-1',
  'babel-plugin-import',
  'babel-loader',
  'better-npm-run',
  'bundle-loader',
  'css-loader',
  'cssnano',
  'cross-env',
  'eslint',
  'eslint-config-airbnb',
  'eslint-loader',
  'eslint-plugin-babel',
  'eslint-plugin-jsx-a11y',
  'eslint-plugin-import',
  'eslint-plugin-promise',
  'eslint-plugin-react',
  'json-loader',
  'url-loader',
  'imports-loader',
  'less',
  'less-loader',
  'node-sass',
  'normalize.css',
  'postcss-loader',
  'rimraf',
  'sass-loader',
  'style-loader',
  'nodemon',
  'webpack-dev-server',
]);

// 需要遍历的文件夹
const filePath = path.resolve('./');
// 不需要遍历的文件夹
const excludePath = [
  path.resolve('./build/'),
  path.resolve('./node_modules/'),
  path.resolve('./.git/'),
  path.resolve('./package.json'),
  path.resolve('./package-lock.json'),
  path.resolve('./yarn.lock'),
];

/**
 * 判断是否需要遍历
 * @param  {String}   filePath
 * @return {Boolean}  需要排除
 */
function excludeJudge(filePath) {
  let isExclude = false;
  excludePath.map((item) => {
    if (item === filePath) {
      isExclude = true;
    }
    return item;
  });

  return isExclude;
}

/** 
 * 文件遍历方法 
 * @param filePath 需要遍历的文件路径 
 */  
function fileDisplay(filePath, dItem) {
  // 是否为不需要扫描的文件夹
  if (excludeJudge(filePath)) {
    return false;
  }

  // 根据文件路径读取文件，返回文件列表  
  const files = fs.readdirSync(filePath);
  // 遍历读取到的文件列表  
  files.forEach((filename) => {
    // 获取当前文件的绝对路径  
    const filedir = path.join(filePath, filename);
    // 根据文件路径获取文件信息，返回一个fs.Stats对象  
    const stats = fs.statSync(filedir);
    const isFile = stats.isFile();// 是文件  
    const isDir = stats.isDirectory();// 是文件夹  
    if (isFile) {
      // console.log(filedir);

      // 是否为不需要扫描的文件夹
      if (excludeJudge(filedir)) {
        return false;
      }

      const file = fs.readFileSync(filedir, 'utf8');
      const result = file.match(new RegExp(`['"]` + dItem + `['"]`, 'ig'));
      // const result = file.match(/@xinguang\/common-tool/ig);
      if (result) {
        used.add(dItem);
        // console.log(`${dItem} found in ${filedir}`);
        // console.log(dItem);
      }
    } else if (isDir) {
      fileDisplay(filedir, dItem);// 递归，如果是文件夹，就继续遍历该文件夹下面的文件  
    }
  });
}

// 调用文件遍历方法  
dependALL.map(dItem => {
  fileDisplay(filePath, dItem)
});
const neverUsed = dependALL.filter(item => ![...used].includes(item));

console.log('未在项目中使用的 dependencies 或者 devDependencies:');
console.log('========================');
console.log( neverUsed.length ? neverUsed : '没有未使用的依赖' );
console.log('========================');
console.log('以上结果仅供参考，请手动验证！');

