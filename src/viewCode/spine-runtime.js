
/**
 * Spine 运行时
 */
export const SpineRuntime = {

    /**
     * 缓存
     */
    cache: {
        // '3.5': null,
        // '3.6': null,
        // '3.7': null,
        // '3.8': null,
        // '4.0': null,
    },

    /**
     * 获取指定版本的 Spine 运行时
     * @param {string} version 版本
     * @param {string} mode 渲染模式canvas还是webgl
     */
    async get(version, mode) {
        const cache = SpineRuntime.cache;
        if(mode == null){
            mode = 'webgl'
        }
        var key = version + '_' + mode
        if (cache[key] == null) {
            const libPath = `../spine-runtimes/${version}/spine-${mode}.js`;
            // console.log('加载的路径', libPath)
            var {spine} = await import(libPath)
            cache[key] = spine
            // cache[version] = import libPath;
            // 注入版本号
            cache[key].version = version;
        }
        return cache[key];
    },
};

// module.exports = SpineRuntime;
