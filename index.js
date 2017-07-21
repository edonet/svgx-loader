/**
 *****************************************
 * Created by lifx
 * Created on 2017-07-21
 *****************************************
 */
'use strict';


/**
 ************************************
 * 加载依赖
 ************************************
 */
const
    qs = require('querystring'),
    SVGO = require('svgo'),
    utils = require('loader-utils'),
    cache = {};


/**
 ************************************
 * 抛出接口
 ************************************
 */
module.exports = function (source) {

    // 查看是否已经缓存
    if (this.resource in cache) {
        return cache[this.resource];
    }

    // 启用缓存
    this.cacheable && this.cacheable();


    // 获取配置信息
    let callback = this.async(),
        options = utils.getOptions(this) || {},
        query = this.resourceQuery,
        svgo = new SVGO(options.optimize),
        code = source.toString();


    // 替换变量
    if (query) {
        query = utils.parseQuery(query);
        code = code.replace(/\$\{([\w\s-]+)\}/g, (str, key) => {
            return key in query ? query[key] : '';
        });
    }

    // 优化【SVG】代码
    svgo.optimize(code, ({ data }) => {

        // 输出为样式
        if (query && query.output === 'sass') {

            // 设置输出编码格式
            switch (options.encode) {

                // 返回【utf-8】格式
                case 'utf-8':
                    data = data.replace(/"/g, '\'');
                    data = data.replace(/%/g, '%25');
                    data = data.replace(/#/g, '%23');
                    data = data.replace(/{/g, '%7B');
                    data = data.replace(/}/g, '%7D');
                    data = data.replace(/</g, '%3C');
                    data = data.replace(/>/g, '%3E');
                    data = `module.exports="\\\"data:image/svg+xml;${data}\\\""`;
                    break;

                // 默认返回【base64】格式
                default:
                    data = Buffer.from(data).toString('base64');
                    data = `module.exports="data:image/svg+xml;base64,${data}"`;
                    break;
            }

        } else {

            // 输出为字符串
            data = `module.exports=${ JSON.stringify(data) }`;
        }

        // 缓存数据
        cache[this.resource] = data;

        // 返回结果
        callback(null, data);
    });
};
