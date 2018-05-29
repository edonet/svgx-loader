/**
 *****************************************
 * Created by lifx
 * Created on 2018-05-29 09:13:37
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const
    loaderUtils = require('loader-utils'),
    resolve = require('./resolve');


/**
 *****************************************
 * 加载图标
 *****************************************
 */
module.exports = function (content) {
    let callback = this.async(),
        options = {
            context: this.context, ...loaderUtils.getOptions(this)
        };


    // 合并配置
    try {
        options = { ...options, ...JSON.parse(content) };
    } catch (err) {
        // do nothings;
    }

    // 获取资源
    resolve(this, options).then(
        res => callback(null, res), callback
    );
};

