/**
 *****************************************
 * Created by lifx
 * Created on 2018-05-29 10:26:50
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 创建元素
 *****************************************
 */
const
    target = document.createElement('div'),
    cache = {};


/**
 *****************************************
 * 插入元素
 *****************************************
 */
document.addEventListener('DOMContentLoaded', () => {
    target.style.display = 'none';
    document.body.appendChild(target);
});


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = function (id, code) {
    let el;

    // 使用缓存
    if (cache[id]) {
        return cache[id].innerHTML = code;
    }

    // 生成元素
    el = document.createElement('div');
    el.setAttribute('data-id', id);
    el.innerHTML = code;

    // 添加元素
    target.appendChild(el);

    // 判断是否需要热更新
    if (module.hot) {
        cache[id] = el;
    }
};
