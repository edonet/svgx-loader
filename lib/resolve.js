/**
 *****************************************
 * Created by lifx
 * Created on 2018-05-29 09:27:28
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const
    fs = require('fs'),
    path = require('path'),
    { promisify } = require('util'),
    SVGO = require('svgo'),
    template = require('./template');


/**
 *****************************************
 * 解析文件
 *****************************************
 */
module.exports = async function (loader, options) {
    let folder = path.resolve(options.context, options.dir || './'),
        files = await promisify(fs.readdir)(folder),
        svgo = new SVGO(options.optimize),
        locals = {},
        defs = [];

    // 处理文件
    await Promise.all(files.map(async file => {
        if (file.endsWith('.svg')) {
            let id = path.basename(file, '.svg'),
                filepath = path.resolve(folder, file),
                code = await promisify(fs.readFile)(filepath, { encoding: 'utf8' });

            // 添加前缀
            if (options.prefix) {
                id = options.prefix + '-' + id;
            }

            // 优化代码
            code = await svgo.optimize(code, { path: filepath });

            // 替换根元素
            code = code.data.replace(/<svg[^>]*?>/, `<g id="${ id }">`).replace('</svg>', '</g>');

            // 生成集合
            locals[id] = createSVGElement(id, options);
            defs.push(code);
        }
    }));

    // 添加依赖
    loader.addContextDependency(folder);

    // 返回结果
    return template({
        id: Buffer.from(folder).toString('base64').slice(0, 12), defs, locals
    });
};


/**
 *****************************************
 * 创建图标
 *****************************************
 */
function createSVGElement(id, { viewBox, className }) {
    let code = ['<svg xmlns="http://www.w3.org/2000/svg"'];

    // 设置视口
    viewBox && code.push(` viewBox="${ viewBox }"`);

    // 设置样式
    code.push(` class="${ className ? [className, id].join(' ') : id }"`);

    // 添加内容
    code.push(`><use xlink:href="#${ id }"></use></svg>`);

    // 拼接代码
    return code.join('');
}
