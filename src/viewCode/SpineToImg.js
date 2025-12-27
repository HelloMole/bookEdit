import {SpineRuntime} from './spine-runtime.js'
//这是一个用于渲染spine文件的脚本
//此脚本的作用是生成spine动画的预览图，这样可以加快编辑器的性能而不必每次都渲染spine动画
export class SpineToImg{
    // 资源信息
    assets = {
        dir: null,   //指定资源目录前缀
        json: null,  //骨骼数据
        skel: null,  //骨骼数据(二进制)
        atlas: null, //图集  //spine runtime 3.6+ 内部会自动加载纹理
        png: null,   //纹理
    }
    // 选项
    viewScale= 1.0
    skin= ''
    animation= ''
    timeScale= 1
    loop= true
    autoSetAni = false   //自动设置动画
    premultipliedAlpha= false
    drawBones = false
    drawBoundingBoxes = false
    drawMeshTriangles = false
    drawPaths = false
    // 当前运行时版本
    version = 'unknown'
    // 画布颜色
    canvasColor = '#be4c4c'
    clearColor = [0.3, 0.3, 0.3]
    // 环境
    assetManager = null
    // 骨骼数据
    skeletonData = null
    animationState = null
    // 拖动
    dragOffset = [0, 0]
    //渲染分辨率
    renderWidth = 130
    //画布
    canvas = null
    gl = null
    spine = null
    _eventDit = null
    mode = 'webgl'
    canRender = false
    constructor(mode) {
        if(mode != null){
            this.mode = mode
        }
    }

    events(){
        if (!this.skeletonData || !this.skeletonData.animations) {
            return {};
        }
        if(this._eventDit != null){
            return this._eventDit
        }
        let eventDit = {}
        for(var i = 0; i < this.skeletonData.animations.length; i++){
            let ani = this.skeletonData.animations[i]
            // let event = {}
            if(ani.timelines != null){
                // console.log('ani.timelines', ani.timelines)
                for(let j = 0; j < ani.timelines.length; j++){
                    let oneTimeLine = ani.timelines[j]
                    let aniName = ani.name
                    if(oneTimeLine.events != null){
                        for(let k = 0; k < oneTimeLine.events.length; k++){
                            let event = {
                                time: oneTimeLine.events[k].time,
                                name: oneTimeLine.events[k].data.name
                            }
                            if( eventDit[aniName] == null){
                                eventDit[aniName] = []
                            }
                            eventDit[aniName].push(event)
                        }
                    }
                }
            }
        }
        this._eventDit = eventDit
        return eventDit
    }

    /**
     * 皮肤列表
     */
    skins() {
        if (!this.skeletonData || !this.skeletonData.skins) {
            return [];
        }
        //如果皮肤不止一个，就去掉其中的default动画
        let skins = this.skeletonData.skins.map(v => v.name);
        if(skins.length > 1){
            let defaultSkinIndex = skins.indexOf('default')
            skins.splice(defaultSkinIndex, 1)
        }
        return skins
    }

    /**
     * 动画列表
     */
    animations() {
        if (!this.skeletonData || !this.skeletonData.animations) {
            return [];
        }
        return this.skeletonData.animations.map(v => v.name);
    }

    /**
     * 调试
     */
    debug() {
        return (
            this.drawBones ||
            this.drawBoundingBoxes ||
            this.drawMeshTriangles ||
            this.drawPaths
        );
    }

    /**
     * 动画时长
     */
    duration() {
        if (!this.animationState) {
            return 0;
        }
        return this.animationState.getCurrent(0).animation.duration;
    }

    /**
     * 资源信息
     */
    assetsInfo() {
        if (!this.assetManager) {
            return 'no assetManager';
        };
        let skeletonPath = '',
            texturePath = '',
            atlasPath = '';
        for (const path in this.assetManager.assets) {
            var extName = path.split('.')
            extName = '.' + extName[extName.length - 1]
            switch (extName) {
                case '.json':
                case '.skel': {
                    skeletonPath = path;
                    break;
                }
                case '.png': {
                    texturePath = path;
                    break;
                }
                case '.atlas': {
                    atlasPath = path;
                    break;
                }
            }
        }
        return `💀 [Skeleton]\n· ${skeletonPath}\n\n🖼 [Texture]\n· ${texturePath}\n\n🗺 [Atlas]\n· ${atlasPath}`;
    }

    /**
     * 偏移
     */
    offset() {
        return `(${this.dragOffset[0]}, ${-this.dragOffset[1]})`;
    }

    /**
         * 重置
         */
    reset() {
        // 资源信息
        this.assets = null;
        // 选项
        this.viewScale = 1;
        this.skin = '';
        this.animation = '';
        this.timeScale = 1;
        this.loop = true;
        this.premultipliedAlpha = false;
        this.drawBones = false;
        this.drawBoundingBoxes = false;
        this.drawMeshTriangles = false;
        this.drawPaths = false;
        // 当前运行时版本
        this.version = 'unknown';
        // 恢复默认画布颜色
        this.canvasColor = '#7a5050';
        // 骨骼数据
        this.skeleton = null;
        this.bounds = null;
        this.skeletonData = null;
        this.animationState = null;
        // 清空画布
        this.gl && this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        // 环境
        this.shader = null;
        this.batcher = null;
        this.mvp = null;
        this.skeletonRenderer = null;
        this.assetManager = null;
        // 调试
        this.debugRenderer = null;
        this.debugShader = null;
        this.shapeRenderer = null;
        // 上一帧时间
        this.lastFrameTime = null;
        // 拖动
        // isDragging = false;
        // clickOffset = [0, 0];
        this.dragOffset = [0, 0];
        this.image = null
        this.canRender = false
        this.oriImg = null
        this._eventDit = null
    }



     /**
     * 获取 Spine 运行时
     */
     async getRuntime() {
        // console.log('[methods]', 'getRuntime');
        // 资源对应的 Spine 运行时版本
        let version = this.getAssetSpineVersion(this.assets.json || this.assets.skel);
        if (!version) {
            // return false;
            console.warn('Unable to identify Spine version of asset!');
            // 默认使用 3.8 的 Runtime
            version = "3.8";
        }
        console.log('Skeleton spine version', version);
        // 处理版本号（保留前两个分量）
        version = version.split('.').slice(0, 2).map(v => parseInt(v)).join('.');
        // 获取目标版本的 Spine 运行时对象
        let spine = await SpineRuntime.get(version, this.mode);
        // console.log('获取到了spine', spine)
        if (!spine) {
            let content = `noSpineRuntime | version: ${version}`;
            // EditorRendererKit.print('warn', content);
            console.warn(content)
            return false;
        }
        // window.spine = spine;
        this.spine = spine
        // console.log('引用了spine')
        this.version = spine.version;
        // console.log('Spine runtime version', spine.version);
        return true;
    }


    /**
     * 获取资源对应的 Spine 运行时版本
     * @param {string} path 文件路径
     * @returns {string}
     */
    getAssetSpineVersion(path) {
        // const fullPath = Path.join((this.assets.dir || ''), path);
        // if (!Fs.existsSync(fullPath)) {
        //     return null;
        // }
        // const extname = Path.extname(path);
        //从网络加载文件
        var extname = '.skel'   //暂时先返回3.8
        if (extname === '.json') {
            // const data = JSON.parse(Fs.readFileSync(fullPath, 'utf-8'));
            const data = {}
            if (data.skeleton) {
                return data.skeleton.spine;
            }
        } else if (extname === '.skel') {
            return '3.7';
        }
        return null;
    }


    /**
     * 初始化 Spine 运行时
     */
    initRuntime() {
        // console.log('[methods]', 'initRuntime');
        // 获取画布
        if(this.canvas == null){
            // console.warn('没有canvas')
            // return
            //直接创建canvas
            this.canvas = document.getElementById('spinetoimg')
            if(this.canvas == null){
                this.canvas = document.createElement('canvas')
                this.canvas.id = 'spinetoimg'
                this.canvas.style.position = 'fixed'
                this.canvas.style.top = 0
                this.canvas.style.left = 0
                this.canvas.style.opacity = 0
                this.canvas.style.zIndex = -1999
                this.canvas.width = 130;
                this.canvas.height = 130;
                document.body.append(this.canvas)
                // console.log('创建了canvass', this.canvas)
            }
        }
        let canvas = this.canvas
        // WebGL
        if (!this.gl) {
            const config = { alpha: false };
            this.gl = canvas.getContext("webgl", config);
            if (!this.gl) {
                console.warn('没有webgl')
                return;
            }
            const color = this.clearColor;
            this.gl.clearColor(color[0], color[1], color[2], 1);
        }

        if(this.spine == null){
            console.warn('没有spine')
        }
        var spine = this.spine
        // Shader
        this.shader = spine.webgl.Shader.newTwoColoredTextured(this.gl);
        // 处理器
        this.batcher = new spine.webgl.PolygonBatcher(this.gl);
        // MVP 变换矩阵
        this.mvp = new spine.webgl.Matrix4();
        this.mvp.ortho2d(0, 0, canvas.width - 1, canvas.height - 1);
        // 骨骼渲染器
        this.skeletonRenderer = new spine.webgl.SkeletonRenderer(this.gl);

        // 用于调试的 debugRenderer、debugShader 和 shapeRenderer
        this.debugRenderer = new spine.webgl.SkeletonDebugRenderer(this.gl);
        this.debugShader = spine.webgl.Shader.newColored(this.gl);
        this.shapeRenderer = new spine.webgl.ShapeRenderer(this.gl);

        // 资源管理器
        this.assetManager = new spine.webgl.AssetManager(this.gl);
    }

    /**
     * 加载资源
     */
    loadAssets() {
        // console.log('[methods]', 'loadAssets', this.assets);
        const assetManager = this.assetManager;
        if (!assetManager) {
            return;
        }
        const assets = this.assets;
        // 指定资源目录前缀
        if (assets.dir) {
            assetManager.pathPrefix = assets.dir;
        }
        // 骨骼数据
        if (assets.json) {
            // JSON
            assetManager.loadText(assets.json);
        } else if (assets.skel) {
            // skel（二进制）
            assetManager.loadBinary(assets.skel);
        } else {
            console.warn('noSkeletonData')
            return;
        }
        // 图集和纹理
        if (assetManager.loadTextureAtlas) {
            // spine runtime 3.6+
            // loadTextureAtlas 内部会自动加载纹理
            assetManager.loadTextureAtlas(assets.atlas);
        } else {
            // spine runtime 3.5
            assetManager.loadText(assets.atlas);
            assetManager.loadTexture(assets.png);
        }
        // 是否开启纹理预乘
        // if (Path.basename(assets.png).includes('pma') ||
        //     Path.basename(assets.atlas).includes('pma')) {
        //     this.premultipliedAlpha = true;
        // }
        // 等待加载
        requestAnimationFrame(this.loading.bind(this));
    }

    //是否加载结束
    isLoadingComplete(){
        if(this.assetManager == null){
            return false
        }
        return this.assetManager.isLoadingComplete() 
    }

    //是否加载错误
    isLoadIngError(){
        if(this.assetManager == null){
            return false
        }
        return this.assetManager.hasErrors()
    }

    /**
     * 等待加载
     */
    loading() {
        if (this.assetManager == null) {
            return;
        }
        // 文件是否已加载完成
        if (this.assetManager.isLoadingComplete()) {
            // 加载骨骼数据
            const result = this.loadSkeleton();
            if (!result) {
                this.reset();
                return;
            }
            // 设置皮肤
            var skins = this.skins()
            // console.log('当前的皮肤列表', skins, this.skeletonData.skins)
            if (skins[0] != null) {
                // this.skeletonData.defaultSkin.name
                this.setSkin(skins[0]);
            }
            // 播放动画
            if(this.autoSetAni == true){
                var animations = this.animations()
                // console.log('当前的动画列表', animations)
                if (animations[0] != null) {
                    this.playAnimation(animations[0]);
                }
            }
            // setTimeout(() => {
            //     this.playAnimation('std1');
            // }, 4000);
            // 记录当前帧时间
            this.lastFrameTime = Date.now() / 1000;
            // console.log('加载动画成功')
            // 下一帧开始渲染
            // requestAnimationFrame(this.render.bind(this));
            this.render()
            this.genPreviewImg()
            // setTimeout(() => {
                
            // }, 1000);
        } else {
            // console.log('继续等待加载')
            // 继续等待加载
            requestAnimationFrame(this.loading.bind(this));
        }
    }

    /**
     * 加载骨骼数据
     */
    loadSkeleton() {
        // console.log('[methods]', 'loadSkeleton');
        const assetManager = this.assetManager,
            assets = this.assets;

        // 图集数据
        let atlas = assetManager.get(assets.atlas);
        let spine = this.spine
        if(spine == null){
            console.log('spine == null')
            return
        }
        if (spine.version === '3.5') {
            atlas = new spine.TextureAtlas(atlas);
        }
        // 创建 AtlasAttachmentLoader 对象用于处理部位、网格、包围盒和路径
        const atlasLoader = new spine.AtlasAttachmentLoader(atlas);

        try {
            // 骨骼数据
            if (assets.json) {
                // 创建 skeletonJson 对象用于解析 json 文件
                const skeletonJson = new spine.SkeletonJson(atlasLoader);
                this.skeletonData = skeletonJson.readSkeletonData(assetManager.get(assets.json));
            } else if (assets.skel) {
                // 创建 SkeletonBinary 对象用于解析 skel 文件
                const skeletonBinary = new spine.SkeletonBinary(atlasLoader);
                this.skeletonData = skeletonBinary.readSkeletonData(assetManager.get(assets.skel));
            }
        } catch (error) {
            console.error(error);
            return false;
        }

        // 创建骨骼对象
        this.skeleton = new spine.Skeleton(this.skeletonData);

        // 计算边界
        this.bounds = this.calculateBounds();

        // 创建 AnimationState 对象用于动画控制
        const animationStateData = new spine.AnimationStateData(this.skeleton.data);
        this.animationState = new spine.AnimationState(animationStateData);

        // Done
        return true;
    }


    /**
     * 设置皮肤
     * @param {string} name 
     */
    setSkin(name) {
        if (!this.skeleton) {
            return;
        }
        this.skin = name;
        // 设置皮肤
        try {
            this.skeleton.setSkinByName(name);
        } catch (error) {
            
        }
        // 重置姿势
        this.skeleton.setSlotsToSetupPose();
    }



    /**
     * 播放动画
     * @param {string} name 
     */
    playAnimation(name) {
        if (!this.skeleton) {
            return;
        }
        this.animation = name;
        // 重置姿势
        this.skeleton.setToSetupPose();
        // 播放动画
        this.animationState.setAnimation(0, name, this.loop);
    }


    /**
     * 设置时间缩放
     * @param {number} value 
     */
    setTimeScale(value) {
        if (!this.skeleton) {
            return;
        }
        this.animationState.timeScale = value;
    }



    /**
     * 计算边界
     * @returns {{ offset: { x: number, y: number }, size: { x: number, y: number } }}
     */
    calculateBounds() {
        this.skeleton.setToSetupPose();
        this.skeleton.updateWorldTransform();
        const offset = new spine.Vector2(),
            size = new spine.Vector2();
        this.skeleton.getBounds(offset, size, []);
        if(size.x > 0 == false){
            // console.log(this)
            size.x = this.skeletonData.width
            size.y = this.skeletonData.height
            offset.x =  this.skeletonData.width * -0.5
            offset.y =  this.skeletonData.height * -0.5
        }
        return { offset, size };
    }



    /**
     * 渲染骨骼
     */
    render() {
        if (!this.skeleton) {
            return;
        }
        // 计算帧时间差
        const now = Date.now() / 1000,
            delta = now - this.lastFrameTime;
        // 记录当前帧时间
        this.lastFrameTime = now;

        // 更新 mvp 来适配画布尺寸
        this.resizeView();

        // 清空画布
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // 应用动画并根据时间差值更新动画时间
        this.animationState.update(delta);
        this.animationState.apply(this.skeleton);
        // 更新骨骼 Transform
        this.skeleton.updateWorldTransform();

        // 渲染
        // 绑定 shader
        this.shader.bind();
        // 传递属性
        this.shader.setUniformi(this.spine.webgl.Shader.SAMPLER, 0);
        this.shader.setUniform4x4f(this.spine.webgl.Shader.MVP_MATRIX, this.mvp.values);
        // 渲染骨骼
        this.batcher.begin(this.shader);
        // 设置 skeletonRenderer 属性
        this.skeletonRenderer.premultipliedAlpha = this.premultipliedAlpha;
        // 渲染
        this.skeletonRenderer.draw(this.batcher, this.skeleton);
        // console.log('绚烂了动画', delta)
        this.batcher.end();
        // 解除 shader 绑定
        this.shader.unbind();

        // 调试
        if (this.debug()) {
            let debugShader = this.debugShader
            let debugRenderer = this.debugRenderer
            // 绑定 shader
            debugShader.bind();
            // 传递属性
            debugShader.setUniform4x4f(this.spine.webgl.Shader.MVP_MATRIX, this.mvp.values);
            // 设置 debugRenderer 属性
            debugRenderer.premultipliedAlpha = this.premultipliedAlpha;
            debugRenderer.drawBones = this.drawBones;
            debugRenderer.drawBoundingBoxes = this.drawBoundingBoxes;
            debugRenderer.drawRegionAttachments = this.drawBoundingBoxes;
            debugRenderer.drawMeshHull = this.drawMeshTriangles;
            debugRenderer.drawMeshTriangles = this.drawMeshTriangles;
            debugRenderer.drawPaths = this.drawPaths;
            debugRenderer.drawSkeletonXY = this.drawBones;
            // 开始渲染
            this.shapeRenderer.begin(debugShader);
            // 渲染
            debugRenderer.draw(this.shapeRenderer, this.skeleton);
            this.shapeRenderer.end();
            // 解除 shader 绑定
            debugShader.unbind();
        }

        // 持续渲染
        // requestAnimationFrame(this.render.bind(this));
    }

    //仅仅生成预览图片
    genPreviewImg(){
       // this.canvas.
    //    this.canvas.toBlob(function(blob) {
    //         // 使用blob对象，例如上传到服务器
    //         var url = URL.createObjectURL(blob);
    //         console.log('获取到了spine预览图',url)
    //         var img = new Image();
    //         img.src = url;
    //         document.body.appendChild(img); // 显示图像
    //     }, 'image/png'); // 也可以使用'image/jpeg'
        if(this.canvas == null){
            return
        }
        this.renderWidth = 130
        this.canvas.height = 130
        this.render()

        var url = this.canvas.toDataURL("image/png");
        // console.log('获取到了spine预览图',url)
        var img = new Image();
        img.src = url
        this.image = img
        this.canRender = true
        // document.body.appendChild(img); // 显示图像

        // var canvas = this.canvas
        // let gl = this.gl
        // let width = canvas.width
        // let height = canvas.height
        // var pixels = new Uint8Array(width * height * 4); // 每个像素4个字节RGBA
        // gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
        // console.log('像素点', pixels)

        // document.body.removeChild(this.canvas)
        // this.canvas = null
        // this.gl = null
    }

    getImgUrlOri(width, height){
        if(this.canRender != true){
            return
        }
        if(this.oriImg != null){
            return this.oriImg
        }
        if(width == null){
            this.renderWidth = null
        }else{
            this.renderWidth = width
        }
        if(height != null){
            this.canvas.height = height
        }
        this.render()
        var url = this.canvas.toDataURL("image/png");
        this.oriImg = url
        return url
    }

    /**
     * 更新视口尺寸
     */
    resizeView() {
        // 更新画布尺寸
        let canvas = this.canvas
        if(canvas == null){
            return
        }
        // const { clientWidth, clientHeight } = canvas;
        // if (canvas.width !== clientWidth || canvas.height !== clientHeight) {
        //     canvas.width = clientWidth;
        //     canvas.height = clientHeight;
        // }
        let bounds = this.bounds
        // console.log('bounds', bounds)
        var radio = bounds.size.x / bounds.size.y
        if(this.renderWidth != null){
            canvas.width = this.renderWidth * radio
        }else{
            canvas.width = bounds.size.x
            canvas.height = bounds.size.y
        }


        // 骨骼位置以及缩放
        const canvasWidth = canvas.width,
            canvasHeight = canvas.height;
        // 计算中心点
        const centerX = (bounds.offset.x + (bounds.size.x / 2)) || 0,
            centerY = (bounds.offset.y + (bounds.size.y / 2)) || 0;
        // 计算缩放比例
        const ratioX = bounds.size.x / canvasWidth,
            ratioY = bounds.size.y / canvasHeight;
        let scale = Math.max(ratioX, ratioY);
        if (scale < 1) scale = 1;
        // 自定义缩放
        scale /= this.viewScale;
        // 最终宽高
        const width = canvasWidth * scale,
            height = canvasHeight * scale;
        //
        // console.log('最终宽高', width, height, scale)
        // 
        
        // 更新矩阵
        const x = (centerX - (width / 2)) - (this.dragOffset[0] * scale),
            y = (centerY - (height / 2)) + (this.dragOffset[1] * scale);
        this.mvp.ortho2d(x, y, width, height);
        // 更新视口
        this.gl.viewport(0, 0, canvasWidth, canvasHeight);
    }

    //设置资源配置，并开始加载
    async setAssets(assets){
        // 重置
        if (this.assets) {
            this.reset();
        }
        // 未选中资源
        if (!assets) return;
        // 储存
        this.assets = assets;
        // 获取运行时
        let result = await this.getRuntime();
        // 处理路径
        this.processAssetPaths();
        if (!result) return;
        // 初始化运行时
        this.initRuntime();
        // 开始加载资源
        this.loadAssets();
    }
    

    /**
     * 处理资源路径
     */
    processAssetPaths() {
        // ⚠️ Spine Runtime 在 Windows 平台下的问题
        // 使用 loadTextureAtlas 加载图集时会自动加载纹理
        // 但是 loadTextureAtlas 内部调用 loadTexture 时传递的 path 是文件名而不是完整路径
        // 如果没有指定 pathPrefix 属性，loadTexture 就会无法正常加载
        // 所以干脆都改为需要指定 pathPrefix 属性
        const assets = this.assets,
            { dir, json, skel, png, atlas } = assets;
        // if (!assets.dir.endsWith(Path.sep)) {
        //     assets.dir += Path.sep;
        // }
       console.log('当前版本', this.version)
        if(this.version == '3.7'){
            this.assets.json = '/' + json
            this.assets.atlas = '/' + atlas
        }else if(this.version == '3.8'){
            this.assets.dir += '/'
        }
        // if (json) {
        //     assets.json = Path.basename(json);
        // } else if (skel) {
        //     assets.skel = Path.basename(skel);
        // }
        // assets.atlas = Path.basename(atlas);
        // assets.png = Path.basename(png);
        // console.log('[methods]', 'processAssetPaths', this.assets);
    }


    /**
     * 布局尺寸变化回调
     */
    onLayoutResize() {
        // console.log('[methods]', 'onLayoutResize');
        const layoutStyle = layout.style,
            propertiesStyle = this.$refs.properties.style;
        if (layout.clientWidth >= 800 || layout.clientHeight < 330) {
            if (layout.clientWidth >= 350) {
                // 水平布局
                layoutStyle.flexDirection = 'row';
                propertiesStyle.width = '265px';
                propertiesStyle.marginTop = '0';
                propertiesStyle.marginLeft = '5px';
                propertiesStyle.display = 'flex';
            } else {
                // 隐藏选项
                propertiesStyle.display = 'none';
            }
        } else {
            // 垂直布局
            layoutStyle.flexDirection = 'column';
            propertiesStyle.width = '100%';
            propertiesStyle.marginTop = '5px';
            propertiesStyle.marginLeft = '0';
            propertiesStyle.display = 'flex';
        }
    }
}