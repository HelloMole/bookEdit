//
import '../cocosBuild/src/settings'
import '../cocosBuild/cocos2d-js-min'
import {CodeNodeLg} from './CodeNodeLg'
import  './scripts/registerCocosCom'

export var hasInit = false
export var hasLoadScene = false
export var intervalId = -1
export var selectedNode = null
export var treeData = []
// export var rootHost = ''
export var rootHost = 'https://cdn.goowee.cn/bookEdit'
export var isPreviewMode = true
export var isInApp = false           //是否在App中
export var isInImport = false       //是否在导入中
export var isSinglePreview = false       //单独的预览环境
export var designViewWidth = 2560
export var designViewHeight = 1500

export function changeRunInmportState(state){
    isInImport = state
}

export function changeIsSinglePreview(state){
    isSinglePreview = state
}


if(isInApp == true){
    hasLoadScene = true
}

export var ObjectTypeEnum = {
    'empty': '空物体',
    'sprite': '图片',
    'graph': '绘制',
    'spine': 'spine',
    'text': '文本'
}


export var objectTypes = [
    ObjectTypeEnum.empty,
    ObjectTypeEnum.sprite,
    ObjectTypeEnum.graph,
    ObjectTypeEnum.spine,
    ObjectTypeEnum.text
]

export var robotNodeEnum = {
    value: 'input/value',
    valueString:'input/valueString',
    boolean: 'input/boolean',
    gameStart: 'input/gameStart',
    customButton: 'input/button/customButton',
    controll: 'input/button/controll',
    touchStart: 'input/screen/touchStart',
    touchMove: 'input/screen/touchMove',
    touchEnd: 'input/screen/touchEnd',
    leftOrRightAct: 'input/leftOrRightAct',
    customData: 'input/getData/customData',
    systemData: 'input/getData/systemData',
    screenSize: 'input/screenSize',

    showTextTip: 'output/tips/showTextTip',
    showConfirm: 'output/tips/showConfirm',
    showHandTip: 'output/tips/showHandTip',
    blockTouch: 'output/blockTouch',
    consoleInfo: 'output/tips/consoleInfo',
    restartGame: 'output/game/restartGame',
    changeGame: 'output/game/changeGame',
    endGame: 'output/game/endGame',
    sound: 'output/sound',
    vibrate: 'output/vibrate',
    stopTime: 'output/time/stopTime',
    timeScale: 'output/time/timeScale',
    createObject: 'objects/createObject',
    animate: 'objects/animates/animate',
    tween: 'objects/animates/tween',
    bezierCurve: 'objects/animates/bezierCurve',
    camera: 'objects/camera',
    MotionText: 'output/customComponent/MotionText',
    CaiDanComponent: 'output/customComponent/CaiDanComponent',
    CaiDanComponent2: 'output/customComponent/CaiDanComponent2',
    ChatComponent: 'output/customComponent/ChatComponent',
    VoiceCheck: 'output/customComponent/VoiceCheck',
    AngleCompoment: 'output/customComponent/AngleCompoment',
    ScaleObj: 'output/customComponent/ScaleObj',
    ProgressCompoment: 'output/customComponent/ProgressCompoment',
    'cc.Mask': 'output/customComponent/ccMask',
    
    angleConvertVector: 'middle/angleCalculate/angleConvertVector',
    angleDifference: 'middle/angleCalculate/angleDifference',
    vectorToAngel: 'middle/angleCalculate/vectorToAngel',
    add: 'middle/calculate/add',
    chu: 'middle/calculate/chu',
    del: 'middle/calculate/del',
    length: 'middle/calculate/length',
    x: 'middle/calculate/x',
    checkTag: 'middle/change/checkTag',
    dataObject: 'middle/change/dataObject',
    getArrayValue: 'middle/change/getArrayValue',
    getKeyValue: 'middle/change/getKeyValue',
    randomNum: 'middle/change/randomNum',
    timeDown: 'middle/change/timeDown',
    timeDownCycle: 'middle/change/timeDownCycle',
    upCount: 'middle/change/upCount',
    bigger: 'middle/compare/bigger',
    equire: 'middle/compare/equire',
    inRange: 'middle/compare/inRange',
    litter: 'middle/compare/litter',
    abs: 'middle/covert/abs',
    revertNegative: 'middle/covert/revertNegative',
    squareRoot: 'middle/covert/squareRoot',
    toint: 'middle/covert/toint',
    input: 'middle/graph/input',
    output: 'middle/graph/output',
    subgraph: 'middle/graph/subgraph',
    allRight: 'middle/logic/allRight',
    allToggle: 'middle/logic/allToggle',
    notRight: 'middle/logic/notRight',
    orRight: 'middle/logic/orRight',
    orToggle: 'middle/logic/orToggle',
    acceptData: 'middle/tool/acceptData',
    lighting: 'middle/tool/lighting',
    lightingOut: 'middle/tool/lightingOut',
    outputLine: 'middle/tool/outputLine',
    sendData: 'middle/tool/sendData',
    textCode: 'middle/tool/textCode',

    contact: 'objects/objectSensor/contact',
    position: 'objects/objectSensor/position',
    speed: 'objects/objectSensor/publicListen',
    
    connection: 'objects/group/connection',
}


export var typeColorEnum = {
    'input': 'green',
    'middle': 'cyan',
    'output': 'pink',
    'objects': 'orange',
}


export async function realBoot(){
    return new Promise((resolve, reject) => {
        var settings = window._CCSettings;
        // if(settings == null){
        //     return
        // }
        // window._CCSettings = undefined;
        var onProgress = null;

        
        var RESOURCES = cc.AssetManager.BuiltinBundleName.RESOURCES;
        var INTERNAL = cc.AssetManager.BuiltinBundleName.INTERNAL;
        var MAIN = cc.AssetManager.BuiltinBundleName.MAIN;
        function setLoadingDisplay () {
            // Loading splash scene
            var splash = document.getElementById('splash');
            if(splash == null){
                return
            }
            var progressBar = splash.querySelector('.progress-bar span');
            onProgress = function (finish, total) {
                var percent = 100 * finish / total;
                if (progressBar) {
                    progressBar.style.width = percent.toFixed(2) + '%';
                }
            };
            splash.style.display = 'block';
            progressBar.style.width = '0%';

            cc.director.once(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function () {
                splash.style.display = 'none';
            });
        }

        var onStart = function () {

            cc.view.enableRetina(true);
            // cc.view.resizeWithBrowserSize(true);

            if (cc.sys.isBrowser) {
                setLoadingDisplay();
            }

            // Limit downloading max concurrent task to 2,
            // more tasks simultaneously may cause performance draw back on some android system / browsers.
            // You can adjust the number based on your own test result, you have to set it before any loading process to take effect.
            if (cc.sys.isBrowser && cc.sys.os === cc.sys.OS_ANDROID) {
                cc.assetManager.downloader.maxConcurrency = 2;
                cc.assetManager.downloader.maxRequestsPerFrame = 2;
            }

            var launchScene = settings.launchScene;
            var bundle = cc.assetManager.bundles.find(function (b) {
                return b.getSceneInfo(launchScene);
            });
            
            bundle.loadScene(launchScene, null, onProgress,
                function (err, scene) {
                    if (!err) {
                        cc.director.runSceneImmediate(scene);
                        if (cc.sys.isBrowser) {
                            // show canvas
                            // var canvas = document.getElementById('GameCanvas');
                            // canvas.style.visibility = '';
                            // var div = document.getElementById('GameDiv');
                            // if (div) {
                            //     div.style.backgroundImage = '';
                            // }
                            console.log('Success to load scene: ' + launchScene);
                        }
                        // console.log('hasRead', )
                        //设置canvas design分辨率
                        // var canvas = cc.director.getScene().getChildByName('Canvas').getComponent(cc.Canvas)
                        // console.log('canvas', canvas)
                        cc.Canvas.instance.designResolution = cc.size(designViewWidth, designViewHeight)
                        hasLoadScene = true
                        var manager = cc.director.getCollisionManager();
                        manager.enabled = true
                        clearScene()
                        resolve(true)
                    }else{
                        reject(err)
                    }
                }
            );
        };

        var canvas = document.getElementById('GameCanvas');
        if(canvas == null){
            console.warn('没有找到GameCanvas')
            reject('没有找到渲染画布GameCanvas')
            return
        }

        var option = {
            id: 'GameCanvas',
            debugMode: settings.debug ? cc.debug.DebugMode.INFO : cc.debug.DebugMode.ERROR,
            showFPS: settings.debug,
            frameRate: 60,
            groupList: settings.groupList,
            collisionMatrix: settings.collisionMatrix,
        };

        cc.assetManager.init({ 
            bundleVers: settings.bundleVers,
            remoteBundles: settings.remoteBundles,
            server: settings.server
        });
        
        var bundleRoot = [INTERNAL];
        settings.hasResourcesBundle && bundleRoot.push(RESOURCES);

        var count = 0;
        function cb (err) {
            if (err) return console.error(err.message, err.stack);
            count++;
            if (count === bundleRoot.length + 1) {
                cc.assetManager.loadBundle(MAIN, function (err) {
                    if (!err){
                        cc.game.run(option, onStart);
                    }else{
                        reject(err)
                    }
                });
            }
        }

        console.log('需要加载的settings.jsList', settings.jsList)
        cc.assetManager.loadScript(settings.jsList.map(function (x) { return 'src/' + x;}), cb);
        console.log('需要加载的bundleRoot', bundleRoot)

        for (var i = 0; i < bundleRoot.length; i++) {
            cc.assetManager.loadBundle(bundleRoot[i], cb);
        }  
    })
}

function initConsoleUtil() {
    if (cc.tree) return;
    cc.tree = function (key) {
        let index = key || 0;
        let treeNode = function (node) {
            let nameStyle =
                `color: ${node.parent === null || node.activeInHierarchy ? 'green' : 'grey'}; font-size: 14px;font-weight:bold`;
            let propStyle =
                `color: black; background: lightgrey;margin-left: 5px;border-radius:3px;padding: 0 3px;font-size: 10px;font-weight:bold`;
            let indexStyle =
                `color: orange; background: black;margin-left: 5px;border-radius:3px;padding:0 3px;fonrt-size: 10px;font-weight:bold;`
            let nameValue = `%c${node.name}`;
            let propValue =
                `%c${node.x.toFixed(0) + ',' + node.y.toFixed(0) + ',' + node.width.toFixed(0) + ',' + node.height.toFixed(0) + ',' + node.scale.toFixed(1)}`
            let indexValue = `%c${index++}`;
            if (node.childrenCount > 0) {
                console.groupCollapsed(nameValue + propValue + indexValue, nameStyle,
                    propStyle, indexStyle);
                for (let i = 0; i < node.childrenCount; i++) {
                    treeNode(node.children[i]);
                }
                console.groupEnd();
            } else {
                console.log(nameValue + propValue + indexValue, nameStyle, propStyle,
                    indexStyle);
            }
        }
        if (key) {
            let node = cc.cat(key);
            index = node['tempIndex'];
            treeNode(node);
        } else {
            let scene = cc.director.getScene();
            treeNode(scene);
        }
        return '属性依次为x,y,width,height,scale.使用cc.cat(id)查看详细属性.';
    }
    cc.cat = function (key) {
        let index = 0;
        let target;
        let sortId = function (node) {
            if (target) return;
            if (cc.js.isNumber(key)) {
                if (key === index++) {
                    target = node;
                    return;
                }
            } else {
                if (key.toLowerCase() === node.name.toLowerCase()) {
                    target = node;
                    return;
                } else {
                    index++;
                }
            }
            if (node.childrenCount > 0) {
                for (let i = 0; i < node.childrenCount; i++) {
                    sortId(node.children[i]);
                }
            }
        }
        let scene = cc.director.getScene();
        sortId(scene);
        target['tempIndex'] = cc.js.isNumber(key) ? key : index;
        return target;
    }
    cc.list = function (key) {
        let targets = [];
        let step = function (node) {
            if (node.name.toLowerCase().indexOf(key.toLowerCase()) > -1) {
                targets.push(node);
            }
            if (node.childrenCount > 0) {
                for (let i = 0; i < node.childrenCount; i++) {
                    step(node.children[i]);
                }
            }
        }
        let scene = cc.director.getScene();
        step(scene);
        if (targets.length === 1) {
            return targets[0];
        } else {
            return targets;
        }
    }
    cc.where = function (key) {
        let target = key.name ? key : cc.cat(key);
        if (!target) {
            return null;
        }
        let rect = target.getBoundingBoxToWorld();
        let bgNode = new cc.Node();
        let graphics = bgNode.addComponent(cc.Graphics);
        let scene = cc.director.getScene();
        scene.addChild(bgNode);
        bgNode.position = rect.center;
        bgNode.group = target.group;
        bgNode.zIndex = cc.macro.MAX_ZINDEX;
        let isZeroSize = rect.width === 0 || rect.height === 0;
        if (isZeroSize) {
            graphics.circle(0, 0, 100);
            graphics.fillColor = cc.Color.GREEN;
            graphics.fill();
        } else {
            bgNode.width = rect.width;
            bgNode.height = rect.height;
            graphics.rect(-bgNode.width / 2, -bgNode.height / 2, bgNode.width, bgNode.height);
            graphics.fillColor = new cc.Color().fromHEX('#E91E6390');
            graphics.fill();
        }
        setTimeout(() => {
            if (cc.isValid(bgNode)) {
                bgNode.destroy();
            }
        }, 2000);
        return target;
    }
    cc.cache = function () {
        let rawCacheData = cc.assetManager.assets._map;
        let cacheData = [];
        let totalTextureSize = 0;
        for (let k in rawCacheData) {
            let item = rawCacheData[k];
            if (item.type !== 'js' && item.type !== 'json') {
                let itemName = '_';
                let preview = '';
                let content = item.__classname__;
                let formatSize = -1;
                if (item.type === 'png' || item.type === 'jpg') {
                    let texture = rawCacheData[k.replace('.' + item.type, '.json')];
                    if (texture && texture._owner && texture._owner._name) {
                        itemName = texture._owner._name;
                        preview = texture.content.url;
                    }
                } else {
                    if (item.name) {
                        itemName = item.name;
                    } else if (item._owner) {
                        itemName = (item._owner && item._owner.name) || '_';
                    }
                    if (content === 'cc.Texture2D') {
                        preview = item.nativeUrl;
                        let textureSize = item.width * item.height * ((item._native === '.jpg' ? 3 : 4) / 1024 / 1024);
                        totalTextureSize += textureSize;
                        // sizeStr = textureSize.toFixed(3) + 'M';
                        formatSize = Math.round(textureSize * 1000) / 1000;
                    } else if (content === 'cc.SpriteFrame') {
                        preview = item._texture.nativeUrl;
                    }
                }
                cacheData.push({
                    queueId: item.queueId,
                    type: content,
                    name: itemName,
                    preview: preview,
                    id: item._uuid,
                    size: formatSize
                });
            }
        }
        let cacheTitle = `缓存 [文件总数:${cacheData.length}][纹理缓存:${totalTextureSize.toFixed(2) + 'M'}]`;
        return [cacheData, cacheTitle];
    }
    cc.loopAllNode = function(handle, node){
        var loop = function(node){
            // console.log('grayNode', node.name)
            if(cc.isValid(node)){
                handle(node)
                for(var i = 0; i < node.children.length; i++){
                    loop(node.children[i])
                }
            }
        }

        if(node == null){
            node = cc.director.getScene() 
            if(cc.isValid(node) == true){
                for(var i = 0; i < node.children.length; i++){
                    loop(node.children[i])
                }
            }
        }else{
            loop(node)
        }
    }
}

export async function waitCocosInit() {
    return new Promise((resolve, reject) => {
        var count = 0
        var check = ()=>{
            count += 1
            if(hasLoadScene == true){
                resolve(true)
            }else{
                if(count > 100){
                    reject('等待cocos加载场景超时')
                }else{
                    setTimeout(check, 100);
                }
            }
        }
        check()
    })
}

export async function init(){
    if(hasInit == true){
        console.log('CocosMgr已经初始化了')
        return true
    }
    hasInit = true
    if (typeof VConsole !== 'undefined') {
        window.vConsole = new VConsole();
    }
    // var debug = window._CCSettings.debug;
    // var physics = 'physics.js'
    console.log('window._CCSettings.debug', window._CCSettings)
    console.log('window.vConsole', window.vConsole)

    
    if( window.cc != null){
        console.log('cocos加载成功ENGINE_VERSION', window.cc.ENGINE_VERSION)
        await realBoot()
        initConsoleUtil()
    }else{
        console.warn('cocos引擎没有被加载')
        return false
    }
    hasInit = true
}

export function addNodeToScene(){
    if(hasLoadScene == false){
        return
    }
    var canvas = cc.director.getScene().getChildByName('Canvas');
    var node = new cc.Node()
    node.addComponent(cc.Label).string = '这是新增节点'
    node.parent = canvas
}

export function updateCanvasSize(width, height){
    if(hasLoadScene == false){
        return
    }
    // var canvas = cc.director.getScene().getChildByName('Canvas');
    // console.log(canvas.getComponent(cc.Canvas), cc.winSize)
    if(width == null || height == null){
        //直接查询canvas元素获取
        let canvas = document.getElementById('GameCanvas')
        width = canvas.clientWidth
        height = canvas.clientHeight
        console.log('自动获取了canvas尺寸并更新', width, height)
    }
    cc.view.setCanvasSize(width, height);
    // var manager = cc.director.getCollisionManager();
    // if(manager._debugDrawer != null){
    //     manager._debugDrawer.lineWidth = 2 * (1 / cc.view.getScaleX())
    // }

    // console.log('dpi', cc.view.getScaleX(), cc.view.getScaleY())
}

export function showOrHideFPS(){
    var show = !cc.debug.isDisplayStats();
    cc.debug.setDisplayStats(show);
    return show
}

export function showOrHideColiderBox(){
    var manager = cc.director.getCollisionManager();
    if(manager == null){
        console.warn('getCollisionManager == null')
        return
    }
    // manager.enabled = true;
    // this.lastDebugDrawState = manager.enabledDebugDraw 
    manager.enabledDebugDraw = !manager.enabledDebugDraw;
    // console.log('_debugDrawer', manager._debugDrawer)
    if(manager._debugDrawer != null){
        manager._debugDrawer.lineWidth = 3 * (1 / cc.view.getScaleX())
    }
    // if(manager.enabledDebugDraw == false){
    //     manager._debugDrawer.node.destroy()
    // }
    // manager.enabledDrawBoundingBox = manager.enabledDebugDraw;
    return manager.enabledDebugDraw
}

//清空当前场景，只留下Canvas节点和Canvas下的摄像机
export function clearScene(){
    if(hasLoadScene == false){
        return
    }
    const scene = cc.director.getScene();
    for(var i = 0; i < scene.children.length; i++){
        var node = scene.children[i]
        if(node.name != 'Canvas'){
            node.destroy()
        }else{
            for(var j = 0; j < node.children.length; j++){
                var node2 = node.children[j]
                if(node2.name != 'Main Camera'){
                    node2.destroy()
                }
            }
        }
    }
}

export function getNodeById(id) {
    let target;
    const search = function (node) {
        if (node._id === id) {
            target = node;
            return;
        }
        if (node.childrenCount) {
            for (let i = 0; i < node.childrenCount; i++) {
                if (!target) {
                    search(node.children[i]);
                }
            }
        }
    }
    const scene = cc.director.getScene();
    search(scene);
    return target;
}

export function getChildren(node){
    return node.children.map(child => {
        let children = (child.children && child.children.length > 0) ? getChildren(child) : [];
        return { id: child._id, name: child.name, active: child.activeInHierarchy, children };
    });
}

export function getHasChildrenNodeId(){
    if(hasLoadScene == false){
        return []
    }
    var nodeIds = []
    cc.loopAllNode((node)=>{
        if(node.children.length > 0){
            nodeIds.push(node._id)
        }
    }, cc.director.getScene())
    return nodeIds
}

export function refreshTree(){
    treeData = getChildren(cc.director.getScene());
}

export function changePreviewMode(){
    isPreviewMode = !isPreviewMode
}

// export function startUpdateTree() {
//     stopUpdateTree()
//     intervalId = setInterval(() => {
//         refreshTree();
//     }, 200);
// }

// export function stopUpdateTree() {
//     clearInterval(intervalId);
// }

export function drawNodeRect(node) {
    if(node != null){
        selectedNode = node
        cc.where(node);
    }else{
        cc.where(selectedNode);
    }
}

export function openCacheDialog() {
    // cc.where(selectedNode);
    var cacheInfo = cc.cache();
    console.log('cacheInfo', cacheInfo)
}


export function outputComponentHandler(componentName) {
    var component = this.selectedNode.getComponent(componentName);
    console.log(component);
}



//所有资源都不用Cocos打包翻到目录下了，应该采用加载网络资源的方案，不使用加载AssestBundle的方案，或者看看是否可以脱离引擎构建AssestBundle

//加载一个资源
export function loadResHandle(name, type, cb, customBundle){
    
}

//获取文件类型，一种文件类型可能有多个后缀，比如图片音频
export function getFileType(fileEx){
    if(fileEx == 'png' || fileEx == 'jpg' || fileEx == 'jpeg'){
        return '图片'
    }else if(fileEx == 'mp3' || fileEx == 'wav'){
        return '音频'
    }else if(fileEx == 'json'){
        return 'json'
    }else if(fileEx == 'atlas'){
        return '图集'
    }else if(fileEx == 'spine'){
        return 'spine'
    }
    return '空物体'
}

//获取文件后缀名称
export function getExName(fileName, withDot){
    var fileEx = ''
    if(fileName.indexOf('.') != -1){
        fileName = fileName.split('.')
        fileEx = fileName[fileName.length - 1]
    }
    if(withDot == true){
        return '.' + fileEx
    }
    return fileEx
}

export function getName(fileName){
    if(fileName.indexOf('/') != -1){
        fileName = fileName.split('/')
        fileName = fileName[fileName.length - 1]
    }
    return fileName
}

//获取文件不带后缀的名称
export function getBaseName(fileName){
    fileName = getName(fileName)
    return fileName.split('.')[0]
}

export function setValueByKey(codeNode, config, key){
    if(config[key] != null){
        codeNode[key] = config[key]
    }
}

//同步配置和节点
export function syncConfigToCodeNode(codeNode, config){
    setValueByKey(codeNode, config, 'modal')
    setValueByKey(codeNode, config, 'customeName')
    setValueByKey(codeNode, config, 'anchorX')
    setValueByKey(codeNode, config, 'anchorY')
    setValueByKey(codeNode, config, 'x')
    setValueByKey(codeNode, config, 'y')
    if(codeNode.useCenterMode){
        if(config.x != null && config.y != null){
            codeNode.center = [config.x, config.y]
        }
    }
    setValueByKey(codeNode, config, 'angle')
    setValueByKey(codeNode, config, 'color')
    setValueByKey(codeNode, config, 'zIndex')
    setValueByKey(codeNode, config, 'dynamiczIndex')
    setValueByKey(codeNode, config, 'group')

    setValueByKey(codeNode, config, 'overflow')
    
    setValueByKey(codeNode, config, 'height')
    setValueByKey(codeNode, config, 'width')

    setValueByKey(codeNode, config, 'opacity')
    setValueByKey(codeNode, config, 'fontSize')
    setValueByKey(codeNode, config, 'outLineColor')
    setValueByKey(codeNode, config, 'outLineWidth')
    setValueByKey(codeNode, config, 'premulAlpha')
    setValueByKey(codeNode, config, 'scaleX')
    setValueByKey(codeNode, config, 'scaleY')
    setValueByKey(codeNode, config, 'string')


    setValueByKey(codeNode, config, 'zoomRatio')
    setValueByKey(codeNode, config, 'colliderValue')

    // codeNode.modal = config.modal   //首先设置，涉及到增减组件
    // codeNode.customeName = config.customeName
    // codeNode.anchorX = config.anchorX
    // codeNode.anchorY = config.anchorY

    // codeNode.x = config.x
    // codeNode.y = config.y

    // codeNode.angle = config.angle
    // codeNode.color = config.color
    // codeNode.zIndex = config.zIndex

    // codeNode.dynamiczIndex = config.dynamiczIndex
    // codeNode.group = config.group

    // codeNode.height = config.height
    // codeNode.width = config.width

    // codeNode.opacity = config.opacity
    // codeNode.outLineColor = config.outLineColor
    // codeNode.outLineWidth = config.outLineWidth
    // codeNode.premulAlpha = config.premulAlpha
    // codeNode.scaleX = config.scaleX
    // codeNode.scaleY = config.scaleY
    // codeNode.string = config.string
}

//剔除掉和节点一直的属性配置，多个tween修改不同的值互不影响
export function xorConfig(codeNode, config){
    for(var key in config){
        if(codeNode[key] == config[key] || null == config[key]){
            delete config[key]
        }
    }
}

//剔除掉值为0的属性
export function xorConfigZeroValue(config){
    for(var key in config){
        if(0 == config[key] || null == config[key]){
            delete config[key]
        }
    }
}

export function blockTouch(isBlock){
    if(hasLoadScene == false){
        console.warn('调用createObj时场景还未加载成功')
        return
    }
    let scene = cc.director.getScene()
    var blockNode = scene.getChildByName('blockNode')
    if(blockNode == null){
        blockNode = new cc.Node()
        blockNode.name = 'blockNode'
        blockNode.parent = scene
        blockNode.width = cc.winSize.width
        blockNode.height = cc.winSize.height
        blockNode.addComponent(cc.BlockInputEvents)
        blockNode.x = cc.winSize.width * 0.5
        blockNode.y = cc.winSize.height * 0.5
    }
    blockNode.active = isBlock
}



export function createObj(config, cb){
    // console.log('调用了创建物体', config)
    if(hasLoadScene == false){
        console.warn('调用createObj时场景还未加载成功')
        return
    }
    let parentNode = null
    if(config.parent != null){
        parentNode = config.parent
    }else{
        parentNode = cc.director.getScene().getChildByName('Canvas');
    }
    if(parentNode == null){
        return
    }
    if(cc.isValid(parentNode) == false){
        return
    }
    var node = new cc.Node()
    node.parent = parentNode
    var codeNode = node.addComponent(CodeNodeLg)
    codeNode.onAssstLoadCb = cb
    // node.x = 0
    // node.y = 0
    syncConfigToCodeNode(codeNode, config)

    // node.x = -1621.984
    // node.y = -655

    // anchorX: 0
    // anchorY: 0
    // angle: 0
    // colliderValue: Proxy {}
    // color: "#ffffff"
    // customeName: "title8.5c395126.png"
    // dynamiczIndex: false
    // group: false
    // height: 50
    // modal: "图片"
    // opacity: 255
    // outLineColor: "#ffffff"
    // outLineWidth: 0
    // premulAlpha: false
    // scaleX: 0
    // scaleY: 0
    // showTime: "初始化时"
    // string: ""
    // width: 50
    // x: 0
    // y: 0
    // zIndex: 1


    // var modal = config.modal
    // node.addComponent(cc.Label).string = '我是新的节点'
    return codeNode
}

//预下载一个蓝图需要用到的资源
export function preLoadGraphAssest(graph){

}

export async function showConfirm(msg, cb){
    if(isInApp == true){
        // await 
    }else{
       let result = confirm(msg)
       cb(result)
    }
}

export async function showAlert(msg){
    if(isInApp == true){
        // await 
    }else{
        // alert(msg)
        if(window.antAleart != null){
            window.antAleart(msg)
        }
    }
}

//预下载
export function preLoad(groupFile){
    var urls = []
    for(var i = 0; i < groupFile.length; i++){
        var oneGroup = groupFile[i]
        if(oneGroup.modal == ObjectTypeEnum.spine){
            //目前只有spine资源是多个文件加载
            urls.push({url: rootHost + '/' +  oneGroup.customeName + '.png',   ext: '.png'})
            urls.push({url: rootHost + '/' +  oneGroup.customeName + '.json',  ext: '.json'})
            urls.push({url: rootHost + '/' +  oneGroup.customeName + '.atlas', ext: '.atlas'})
        }else{
            //音频图片等都是单文件加载
            urls.push({url: rootHost + '/' +  oneGroup.customeName, ext: getExName(oneGroup.customeName, true)})
        }
    }
    cc.assetManager.preloadAny(urls, (finished, total, item)=>{
        console.log('预加载进度', finished, total)
    }, (err, items)=>{
        console.log('预加载结束', items)
    })
}

export function loadNetSpine(spineName, cb) {
	let image = rootHost + '/' +  spineName + '.png';
	let ske = rootHost + '/' + spineName + '.json';
	let atlas = rootHost + '/' + spineName + '.atlas';
	let arr = image.split('/');
	let textureNames = arr[arr.length - 1];
	cc.assetManager.loadAny([{ url: atlas, ext: '.atlas' }, { url: ske, ext: '.json' }], (error, assets) => {
		// let png = Utils.formatPng(url);
		cc.assetManager.loadRemote(image, (error, texture) => {
			let asset = new sp.SkeletonData();
			asset.skeletonJson = assets[1];
			asset.atlasText = assets[0];
			asset.textures = [texture];
			asset.textureNames = [textureNames];
			// skeleton.skeletonData = asset;
			cb && cb(asset);
		});
	});

}

export function vibrate(long){
    console.log('震动长短', long)
}

export function changeGraph(gamePath, orPageIndex){
    //gamePath 的路径应该是怎么样的呢？
    //bundle, jsonName
    if(isInApp){
        //在应用内的切换逻辑
        // UIManager.getInstance()._showingForms[UIManager.getInstance().currentScene].realJumpScene(orPageIndex)
    }else{
        //在编辑器中的切换逻辑
        if(window.onChangeGraph != null){
            window.onChangeGraph(gamePath, orPageIndex, true)
        }
    }
}