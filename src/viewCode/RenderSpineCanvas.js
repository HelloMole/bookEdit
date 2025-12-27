import axios from 'axios'
import {SpineRuntime} from './spine-runtime.js'

export class RenderSpineCanvas{
     assets = {
        dir: null,   //指定资源目录前缀
        json: null,  //骨骼数据
        skel: null,  //骨骼数据(二进制)
        atlas: null, //图集  //spine runtime 3.6+ 内部会自动加载纹理
        png: null,   //纹理
    }
    skin= ''
    animation= ''
    // 环境
    assetManager = null
    // 骨骼数据
    skeleton = null
    skeletonData = null
    animationState = null
    bounds = null
    skeletonRenderer = null
    version = ''    //使用的spine版本
    spine = null    //引用的spine引擎
    canvas = null
    autoSetAni = false
    loop = true
    canRender = false
    dragOffset = [0, 0]
    // 上一帧时间
    lastFrameTime = Date.now() / 1000;
    autoRender = false
    constructor() {
       
    }


     /**
     * 皮肤列表
     */
    skins() {
        if (!this.skeletonData || !this.skeletonData.skins) {
            return [];
        }
        return this.skeletonData.skins.map(v => v.name);
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
     * 动画时长
     */
    duration() {
        if (!this.animationState) {
            return 0;
        }
        return this.animationState.getCurrent(0).animation.duration;
    }


    reset() {
        // 资源信息
        this.assets = null;
        this.skin = '';
        this.animation = '';
        this.assetManager = null
        this.skeletonData = null;
        this.animationState = null;
        this.spine = null;
        this.lastFrameTime = Date.now() / 1000;
        this.bounds = null
        this.skeletonRenderer = null
        this.canRender = false
    }

    /**
     * 获取资源对应的 Spine 运行时版本
     * @param {string} path 文件路径
     * @returns {string}
     */
    async getAssetSpineVersion(path) {
        // const fullPath = Path.join((this.assets.dir || ''), path);
        // if (!Fs.existsSync(fullPath)) {
        //     return null;
        // }
        // const extname = Path.extname(path);
        //从网络加载文件
        // var extname = '.skel'   //暂时先返回3.8
        var extname = path.split('.')
        extname = '.' + extname[extname.length - 1]
        if (extname === '.json') {
            // const data = JSON.parse(Fs.readFileSync(fullPath, 'utf-8'));
            try {
                var response = await axios.get(path)
                if(response.status == 200){
                    const data = response.data
                    if (data.skeleton) {
                        // console.log('通过json获取到了spineVersion', data.skeleton.spine)
                        return data.skeleton.spine;
                    }
                }   
            } catch (error) {
                
            }
        } else if (extname === '.skel') {
            return '3.7';
        }
        return null;
    }

    /**
     * 获取 Spine 运行时
     */
     async getRuntime() {
        console.log('[methods]', 'getRuntime');
        // 资源对应的 Spine 运行时版本
        let version = await this.getAssetSpineVersion(this.assets.dir + '/' + (this.assets.json || this.assets.skel));
        if (!version) {
            // return false;
            console.warn('Unable to identify Spine version of asset!');
            // 默认使用 3.7 的 Runtime
            version = "3.7";
        }
        console.log('Skeleton spine version', version);
        // 处理版本号（保留前两个分量）
        version = version.split('.').slice(0, 2).map(v => parseInt(v)).join('.');
        // 获取目标版本的 Spine 运行时对象
        let spine = await SpineRuntime.get(version, 'canvas');
        console.log('获取到了spine', spine)
        if (!spine) {
            let content = `noSpineRuntime | version: ${version}`;
            // EditorRendererKit.print('warn', content);
            console.warn(content)
            return false;
        }
        // window.spine = spine;
        this.spine = spine
        // spine.Bone.yDown = true;
        // console.log('引用了spine')
        this.version = spine.version;
        console.log('Spine runtime version', spine.version);
        return true;
    }

     initRuntime() {
        console.log('[methods]', 'initRuntime');
        // 获取画布
        // if(this.canvas == null){
        //     console.warn('没有canvas')
        //     return false
        // }
        // var spine = this.spine
        
        return true
    }

    render(ctx, rect){
        // Calculate the delta time between this and the last frame in seconds.
		var now = Date.now() / 1000;
		var delta = now - this.lastFrameTime;
		this.lastFrameTime = now;

		// Resize the canvas drawing buffer if the canvas CSS width and height changed
		// and clear the canvas.
        var skeleton = this.skeleton
        let bounds = this.bounds
        // 骨骼位置以及缩放

        let canvasWidth = 100
        let canvasHeight = 100
        let offsetX = 0
        let offsetY = 0

        if(this.canvas != null){
            canvasWidth = this.canvas.width
            canvasHeight = this.canvas.height
        }

        if(rect != null){
            // console.log('rect', rect)

            canvasWidth = rect.width
            canvasHeight = rect.height
            offsetX = rect.x
            offsetY = rect.y
        }


        // 计算缩放比例
        const ratioX = canvasWidth / bounds.size.x
        const ratioY = canvasHeight / bounds.size.y

        

        let scale = Math.min(ratioX, ratioY) * 0.95 //稍微比画布小一点点
        
        // console.log('缩放比例', scale)

        // 计算中心点
        const centerX = (bounds.offset.x + (bounds.size.x / 2)) * scale
        const centerY = (bounds.offset.y + (bounds.size.y / 2)) * scale * -1
       
        // console.log('centerX', 'centerY', centerX, centerY)
        
		// Center the skeleton and resize it so it fits inside the canvas.
		// skeleton.x = canvas.width / 2;
		// skeleton.y = canvas.height / 2

		skeleton.scaleX = scale;
		skeleton.scaleY = -scale;

         // 最终宽高
        // const width = canvasWidth * scale, height = canvasHeight * scale;
            
        // // 更新矩阵
        const x = offsetX + canvasWidth * 0.5 - centerX
        const y = offsetY + canvasHeight * 0.5 - centerY

        // console.log('渲染了', scale, canvas.width, canvas.height)
        // console.log('最终显示位置', centerX, centerY, scale)
        skeleton.x = x
        skeleton.y = y

        // skeleton.scaleX = 1
        // skeleton.scaleY = 1

        // ctx.beginPath()
        // ctx.rect(0, 0, canvas.width, canvas.height)
        // ctx.fillStyle  = '#333333'
        // ctx.fill()


		// Update and apply the animation state, update the skeleton's
		// world transforms and render the skeleton.
		this.animationState.update(delta);
		this.animationState.apply(skeleton);
		skeleton.updateWorldTransform();

        if(this.skeletonRenderer == null){
            if(ctx == null){
                if(this.canvas != null){
                    ctx = this.canvas.getContext('2d')
                }
            }
            if(ctx == null){
                console.warn('没有canvas context')
                return
            }
            this.skeletonRenderer = new this.spine.canvas.SkeletonRenderer(ctx);
            this.skeletonRenderer.triangleRendering = true;
        }

		this.skeletonRenderer.draw(skeleton);
		// this.skeletonRenderer.draw(skeleton);
		// this.skeletonRenderer.draw(skeleton);

        //在蓝图界面中不需要单独调用绘制刷新，由蓝图界面统一刷新
        if(this.autoRender == true){
    		requestAnimationFrame(this.render.bind(this));
        }
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

    

    async loadAll () {
		let promise = new Promise((resolve, reject) => {
			let check = () => {
				if (this.assetManager.isLoadingComplete()) {
                    if(this.assetManager.hasErrors()){
                        reject(this.assetManager.errors);
                    }else {
                        resolve(this);
                    }
					return;
				}
				requestAnimationFrame(check);
			}
			requestAnimationFrame(check);
		});
		return promise;
	}

    async loadAssets(){
        // Load the assets.
        var spine = this.spine
		var assetManager = new spine.canvas.AssetManager();
        this.assetManager = assetManager

        var assets = this.assets
        assetManager.pathPrefix = assets.dir
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

        //等待加载完成
		await this.loadAll();

        // Create the texture atlas and skeleton data.
        // 资源加载完成后，开始加载骨骼
        let atlas = assetManager.get(assets.atlas);
		
        // 图集数据
        if (spine.version === '3.5') {
            atlas = new spine.TextureAtlas(atlas);
        }

        let atlasLoader = new spine.AtlasAttachmentLoader(atlas);

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
        // console.log('this.skeleton', this.skeleton)
        this.skeleton.setToSetupPose();
        this.skeleton.updateWorldTransform();
         const offset = new spine.Vector2(),
            size = new spine.Vector2();
		this.skeleton.getBounds(offset, size, []);
        this.bounds = {offset, size}
        console.log('获取到了bounds', this.bounds)

        // Setup an animation state with a default mix of 0.2 seconds.
		var animationStateData = new spine.AnimationStateData(this.skeleton.data);
		// animationStateData.defaultMix = 0.2;
		this.animationState = new spine.AnimationState(animationStateData);

         // 设置皮肤
        var skins = this.skins()
        console.log('当前的皮肤列表', skins)
        if (skins[0] != null) {
            // this.skeletonData.defaultSkin.name
            this.setSkin(skins[0]);
        }
        // 播放动画
        if(this.autoSetAni == true){
            var animations = this.animations()
            console.log('当前的动画列表', animations)
            if (animations[0] != null) {
                this.playAnimation(animations[0]);
            }
        }
        this.canRender = true
        if(this.autoRender == true){
            requestAnimationFrame(this.render.bind(this));
        }
        return true
    }

    //设置资源配置，并开始加载
    async setAssets(assets){
        // 重置
        if (this.assets) {
            this.reset();
        }
        console.log('设置了assets', assets)
        // 未选中资源
        if (!assets) return;
        // 储存
        this.assets = assets;
        // 获取运行时
        let result = await this.getRuntime();
        console.log('获取了运行时', result)
        // 处理路径
        this.processAssetPaths();
        if (!result) return;
        // 初始化运行时
        var success = this.initRuntime();
        console.log('初始化了运行时', success)
        if (!success) return;
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
        console.log('[methods]', 'processAssetPaths', this.assets);
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
        this.skeleton.setSkinByName(name);
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

}
