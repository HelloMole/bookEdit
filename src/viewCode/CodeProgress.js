import StaticValue from './StaticValue'
import CodeRobot from './CodeRobot'
import GlobalData from "../../../script/logic/GlobalData";
import { EventConst } from "../../../script/logic/EventConst";
import { EventCenter } from "../../../script/UIFrame/EventCenter";
import CocosHelper from '../../../script/UIFrame/CocosHelper';
import UIManager from '../../../script/UIFrame/UIManager';
import MessageTips from '../../../script/panel/tips/MessageTips';
import GlobalConfig from '../../../script/logic/GlobalConfig';

//状态 'needInit'->'instantlyInit'->'needStart'->'runenabled'
//状态有可能直接变成release，这个时候停止加载initAsync
//当状态切换为instantlyInit，将不再进行scheduleOnce等待，直接加载所有文件

cc.Class({
    extends: cc.Component,

    onLoad(){
        this.initSelf()
    },

    //设置从哪个bundle加载资源，以及保存的json名称
    setBundle(bundle, fileKey){
        this.bundle = bundle
        this.fileKey = fileKey
    },

    initSelf(){
        if(this.hasInitSelf == true){
            return
        }
        this.hasInitSelf = true
        this.inRun = false
        this.state = 'needInit'
        this.jsonName = null
        this.workspace = this.node.getChildByName('workspace')
        if(this.fileKey == null){
            this.fileKey = ''
        }


        this.runPPTData = []

        // cc.codeProgress = this
        if(cc.codeJsonDevConfig == null){
            cc.codeJsonDevConfig = {curIsShowGreenLine: true, curIsdebugMode: false, lineWidth: 5}
        }
        var getLoadId = ()=>{
            this.codeRobotConfig.loadId += 1
            return new Date().getTime() + '_' + this.codeRobotConfig.loadId
        }
        this.codeRobotConfig = {
            loadId: 0,
            timeScale: 1, 
            pause: 0, 
            audioArray: {}, 
            loadCbDit: {},
            states: {},
            broadCast: {},
            onListen: {},
            //加载resHandle
            loadResHandle: (name, type, cb, customBundle)=>{
                if(cc.isValid(this.node) == false){
                    return
                }
                var bundle = this.bundle != null ?  this.bundle : cc.assetManager.getBundle(GlobalData.cStoryId)
                // console.log('this.bundle', this.bundle)
                if(customBundle != null){
                    bundle = customBundle
                }
                if(bundle == null){
                    // console.warn('codejson bundle 还未加载')
                    // return
                    bundle = cc.assetManager.getBundle('resources')
                }
                var loadId = getLoadId()
                if(this.codeRobotConfig == null){
                    console.warn('codeRobotConfig == null11', name)
                    return
                }
                this.codeRobotConfig.loadCbDit[loadId] = cb;
                // console.log("loadResHandle开始加载", loadId, name)
                var folder = ''
                if(type == cc.AudioClip){
                    folder = 'sound/'
                }else if(type == sp.SkeletonData){
                    folder = 'spine/'
                }else if(type == cc.SpriteFrame){
                    folder = 'image/'
                }else if(type == cc.JsonAsset){
                    folder = 'json/'
                }

                var callBackData = (data)=>{
                    if(cc.isValid(this.node) == false){
                        if(data != null){
                            cc.assetManager.releaseAsset(data)
                        }
                        return
                    }
                    if(this.codeRobotConfig == null){
                        console.warn('codeRobotConfig == null22', name)
                        if(data != null){
                            cc.assetManager.releaseAsset(data)
                        }
                        return
                    }
                    var callbackFunc = this.codeRobotConfig.loadCbDit[loadId]
                    if(callbackFunc == null){
                        console.warn('callbackFunc == null', loadId, name)
                        if(data != null){
                            cc.assetManager.releaseAsset(data)
                        }
                        return
                    }

                    delete this.codeRobotConfig.loadCbDit[loadId]   //先删除再回调
                    if(data != null){
                        data.addRef()   //添加引用计数
                        callbackFunc(data)
                    }else{
                        callbackFunc(null)
                    }
                }

                var localLoad = ()=>{
                    bundle.load(folder + name, type, (err, data)=> {
                        if(data != null){
                            // console.log('回调加载数据', loadId, data)
                            callBackData(data)
                        }else{
                            if(type == cc.AudioClip){
                                folder = 'sound/'
                            }else if(type == sp.SkeletonData){
                                folder = 'spine/common/'
                            }else if(type == cc.SpriteFrame){
                                folder = 'image/'
                            }else if(type == cc.JsonAsset){
                                folder = 'json/'
                            }
                            CocosHelper.loadRes('story/' + folder + name, type, (data2)=>{
                                if(data2 != null){
                                    // data2.addRef()   //添加引用计数
                                    // callbackFunc(data2)
                                    // delete this.codeRobotConfig.loadCbDit[loadId]
                                    callBackData(data2)
                                }else{
                                    //如果通用资源加载失败就从bookRes中加载资源
                                    // this.showTips('加载资源' + folder + name + '失败')
                                    cc.assetManager.loadBundle('bookRes', (err, bundle2) => {
                                        if(cc.isValid(this.node) == false){
                                            return
                                        }
                                        if(this.codeRobotConfig == null){
                                            console.warn('codeRobotConfig == null35', name)
                                            return
                                        }
                                        var callbackFunc2 = this.codeRobotConfig.loadCbDit[loadId]
                                        if(callbackFunc2 == null){return}
                                        if (err) {
                                            callbackFunc2(null)
                                            delete this.codeRobotConfig.loadCbDit[loadId]
                                            cc.error(err, '加载bookRes失败');
                                            return;
                                        }
                                        if(type == cc.AudioClip){
                                            folder = 'sound/'
                                        }else if(type == sp.SkeletonData){
                                            folder = 'spine/'
                                        }else if(type == cc.SpriteFrame){
                                            folder = 'image/'
                                        }else if(type == cc.JsonAsset){
                                            folder = 'json/'
                                        }
                                        bundle2.load(folder + name, type, (err, data3)=> {
                                            // console.log('资源从bookRes加载成功', err, data3, folder + name,  callbackFunc3)
                                            if(data3 != null){
                                                callBackData(data3)
                                            }else{
                                                callBackData(null)
                                            }
                                        })
                                    })
                                }
                            })
                        }
                    })
                }

                if(type == cc.AudioClip){
                    //UsingAiAudioSound需要先通过网络加载资源
                    if(GlobalData.getIsUseingAisound != null && GlobalData.getIsUseingAisound(GlobalData.cStoryId, name)){
                        //优先使用Ai配音
                        // https://api2.goowee.cn/v1/aisoundGen/lili/880009/Title.txt.mp3
                        var audioUrl = GlobalConfig.getHttpUrl() + 'aisoundGen/' + GlobalData.getAiUserId() + '/' + GlobalData.cStoryId +  '/' + name + '.txt.mp3'
                        cc.assetManager.loadRemote( audioUrl, cc.AudioClip , (err, res)=>{
                            if(err != null){
                                //加载失败，还是调用加载默认声音
                                localLoad()
                            }else{
                                //加载成功，返回声音
                                callBackData(res)
                            }
                        })
                        return
                    }
                }
                localLoad()
                
            }, //robot只提供资源名称（路径）需要自定义加载资源的逻辑，有的是在assestbundle中加载的有的是在resourse中加载的
            loadViewCodeRes: (name, type, cb)=>{
                cc.assetManager.loadBundle('viewCode', (err, bundle) => {
                    if (err) {
                        cc.error(err, '加载viewCode失败');
                        return;
                    }
                    if(cc.isValid(this.node) == false){
                        return
                    }
                    this.codeRobotConfig.loadResHandle(name, type, cb, bundle)
                })
            },
            loadResHandleAsync: (name, type, customBundle)=>{
                return new Promise((resolve, reject) => {
                    this.codeRobotConfig.loadResHandle(name, type, (res)=>{
                        if(res != null){
                            resolve(res)
                        }else{
                            reject('加载失败')
                        }
                    }, customBundle)
                })
            }
        }
        this.singleCard = {}
    },

    export(json, toDonwload){
        if(json.length == 0){
            console.warn('当前页面为空json')
            return
        }
        // var gameView = this.node.parent.getChildByName('UIStory').getComponent('StoryView').curScene.name
        // var key = GlobalData.cStoryId + '_' + gameView

        var dataOld = cc.sys.localStorage.getItem(this.fileKey);
        // console.log('保存的key', this.fileKey)
        cc.sys.localStorage.setItem(this.fileKey + '_old', dataOld);
        cc.sys.localStorage.setItem(this.fileKey, JSON.stringify(json));
        if(toDonwload == true){
            if(window.jsb != null){
                // console.log('getWritablePath', )
                if(jsb.fileUtils.getWritablePath().indexOf('/') == 0){
                    jsb.fileUtils.writeStringToFile(JSON.stringify(json), '/Users/guyi/Downloads/' + this.fileKey + '.json')
                }else{
                    jsb.fileUtils.writeStringToFile(JSON.stringify(json), 'C:/Users/guyi/Downloads/' + this.fileKey + '.json')
                }
                //切换电脑开发这个地方路径要改掉
                //  jsb.fileUtils.writeStringToFile(JSON.stringify(json), 'C:/Users/guyi/Downloads/' + this.fileKey + '.json')
            }else{
                //
                function download(filename, content) {
                    // var filename = "a. txt"
                    // var content = "hello world"
                    var pom = document.createElement('a');
                    pom.setAttribute('href','data:text/plain;charset=utf-8,' + encodeURIComponent(content))
                    pom.setAttribute ('download', filename);
                    if (document.createEvent)
                    {
                        var event = document.createEvent('MouseEvents');
                        event.initEvent('click', true, true);
                        pom.dispatchEvent(event);
                    }else {
                        dom.click();
                    }
                }
                download(this.fileKey + '.json', JSON.stringify(json))
            }
        }
    },

    clearLocalSave(){
        cc.sys.localStorage.removeItem(this.fileKey);
    },

    //编辑时使用
    import(cb){
        // var gameView = this.node.parent.getChildByName('UIStory').getComponent('StoryView').curScene.name
        var data = cc.sys.localStorage.getItem(this.fileKey);
        if(data == null){
            this.codeRobotConfig.loadResHandle(this.fileKey, cc.JsonAsset, (res)=>{
                //console.log('加载的json', res.json)
                // console.log('从资源里加载', key)
                if(res != null){
                    cb(JSON.parse(JSON.stringify(res.json)))
                }else{
                    cb([])
                }
            })
        }else{
            cb(JSON.parse(data))
        }
    },

    runTimeJsonToRobots(gameView, cb, customKey, isAsync){
        var key = GlobalData.cStoryId + '_' + gameView.name
        if(customKey != null){
            key = customKey
        }
        if(this.fileKey != "" && this.fileKey != null){
            key = this.fileKey
        }
        this.jsonName = key
        var data = cc.sys.localStorage.getItem(key);

        var loadResRun = ()=>{
            this.codeRobotConfig.loadResHandle(key, cc.JsonAsset, (res)=>{
                //console.log('加载的json', res.json)
                if(res == null){
                    cb()
                }else{
                    this.jsonToRobots(JSON.parse(JSON.stringify(res.json)), gameView, cb, isAsync)
                }
            })
        }

        if(data != null){
            try {
                data = JSON.parse(data)
                // console.log('加载了缓存的json', data )
            } catch (error) {
                //json姐血失败还是用项目中的
                loadResRun()
                return
            }
            this.jsonToRobots(data, gameView, cb, isAsync)
        }else{
            loadResRun()
        }
    },


    jsonToRobots(json, gameView, cb, isAsync){
        //直接还原成可执行的robots？还是还原成界面？
        // var json = this.import()
        //先根据id初始化robots
        var robots = {}
        var robotArr = []
    
        for(var i = 0; i < json.length; i++){
            var robotObj = json[i]
            var config = StaticValue.clone(StaticValue.zhilinConfig[robotObj.config.key])
            if(config.key.indexOf('cc.') == 0){
                robots[robotObj.id] = new CodeRobot['BaseScriptRobot'](config)
            }else{
                robots[robotObj.id] = new CodeRobot[config.key + 'Robot'](config)
            }
        }

        for(var i = 0; i < json.length; i++){
            var robotObj = json[i]
            var linkDatas = {}
            var robot = robots[robotObj.id]
            
            if(robotObj.config.curValueArr != null){
                robot.config.curValueArr = robotObj.config.curValueArr
            }

         
            if(robot.config.otherConfig != null){
                for(var key in robotObj.config.otherConfig){
                    if(robot.config.otherConfig[key] != null){//有可能这个配置在迭代过程中被删掉了，所以这里加一个判断
                        robot.config.otherConfig[key].default = robotObj.config.otherConfig[key]
                        if(robot.config.otherConfig[key].type == 'robot'){
                            if(robots[robotObj.config.otherConfig[key]] != null){
                                robot.config.otherConfig[key].default = robots[robotObj.config.otherConfig[key]].id
                            }
                            if(robot.config.curValueArr != null){
                                for(var z = 0; z < robot.config.curValueArr.length; z++){
                                    if(robots[robot.config.curValueArr[z][key]] != null){
                                        robot.config.curValueArr[z][key] = robots[robot.config.curValueArr[z][key]].id
                                    }
                                 }
                            }
                        }
                    }
                }
            }

            if(robotObj.inblockRobots != null){
                // console.log('直接执行时会有robotObj.inblockRobots', robotObj.inblockRobots)
                robot.inblockRobots = []
                for(var z = 0; z < robotObj.inblockRobots.length; z++){
                    robot.inblockRobots.push(robots[robotObj.inblockRobots[z]])
                }
            }
            
            for(var key in robotObj.linkDatas){
                var oneSoltGroup = robotObj.linkDatas[key]
                if(oneSoltGroup instanceof Array == true){
                    linkDatas[key] = []
                    for(var j = 0; j < oneSoltGroup.length; j++){
                        var line = oneSoltGroup[j]
                        linkDatas[key].push({solt: line.solt, robot: robots[line.robot], otherSolt: line.otherSolt})
                    }
                }else{
                    linkDatas[key] = {}
                    for(var key2 in oneSoltGroup){
                        linkDatas[key][key2] = []
                        for(var j = 0; j < oneSoltGroup[key2].length; j++){
                            var line = oneSoltGroup[key2][j]
                            linkDatas[key][key2].push({solt: line.solt, robot: robots[line.robot], otherSolt: line.otherSolt})
                        }
                    }
                }
            }
            robot.linkDatas = linkDatas
            robotArr.push(robot)
        }

        // console.log('还原出来的robots',robotArr)
        
        if(gameView == null){
            gameView = this.node.parent.getChildByName('UIStory').getComponent('StoryView').curScene
        }
        if(gameView.getChildByName('space') == null){
            var node = new cc.Node()
            node.name = 'space'
            node.parent = gameView
            node.width = 1920
            node.height = 1080

            var node2 = new cc.Node
            node2.name = 'whiteNode'
            node2.parent = node
        }

        if(isAsync == true){
            this.initAsync(robotArr, gameView, cb)
        }else{
            this.init(robotArr, gameView, cb)
        }
    },

    //
    getRobotById(id){
        if(this.robots == null){
            return null
        }
        var hasFind = null
        // console.log('id', id, this.robots)
        for(var i = 0; i < this.robots.length; i++){
            if(this.robots[i].id == id){
                hasFind = this.robots[i]
                break
            }
        }
        return hasFind
    },

    //重置初始化完成的回调
    resetInitEndCb(cb){
        this.initEndCb = cb
    },

    //初始化且安静状态初始化 
    initAsync(robots, gameView, cb){
        this.inRun = true
        this.robots = robots

        this.codeRobotConfig.timeScale = 1
        this.codeRobotConfig.pause = 0
        this.codeRobotConfig.audioArray = {}
        this.codeRobotConfig.states = {}
        this.codeRobotConfig.broadCast = {}
        this.codeRobotConfig.onListen = {}
        this.codeRobotConfig.loadCbDit = {}
        // this.codeRobotConfig.loadId = 0

        this.singleCard = {}
        if(gameView != null){
            this.singleCard['space'] = gameView.getChildByName('space')
            this.gameView = gameView
            gameView.active = true
        }else{
            this.gameView = null
        }

        var curInitCount = 0

        var checkStart = ()=>{
            if(curInitCount == this.robots.length){
                // console.log("预加载结束可以start", this.initEndCb)
                this.state = 'needStart'
                this.scheduleOnce(()=>{
                    if(this.initEndCb != null){
                        this.initEndCb()
                        this.initEndCb = null
                    }
                    if(cb != null){
                        cb()
                    }
                }, 0)
            }
        }

        //在其他RobotsInit之前
        for(var i = 0; i < this.robots.length; i++){
            this.robots[i].codeProgress = this
            if(this.robots[i].config.key == 'gameStart'){
                if(this.robots[i].config.otherConfig.modal.default == 2){
                    this.robots[i].robotInit()
                    curInitCount += 1
                }
            }
        }

        var forInitRobot = (start)=>{
            // console.log('forInitRobot', start)
            for(var i = start; i < this.robots.length; i++){
                if(this.robots[i].config.key == 'gameStart' && this.robots[i].config.otherConfig.modal.default == 2){
                    //已经提前初始化过了，跳过
                    continue
                }
                var initOk = this.robots[i].robotInit(()=>{
                    //有的robot会有加载资源的延迟，要等所有初始化完成再开始流程
                    // console.log("robot 延迟加载完成")
                    curInitCount += 1
                    checkStart()
                })
                if(initOk == true){
                    curInitCount += 1
                    checkStart()
                }
            }
        }

        var curIndex = 0
        var initRobot = ()=>{
            if(this.state == 'release'){
                return
            }
            if(this.robots[curIndex].config.key == 'gameStart' && this.robots[curIndex].config.otherConfig.modal.default == 2){
                //已经提前初始化过了，跳过
            }else{
                var initOk = this.robots[curIndex].robotInit(()=>{
                    //有的robot会有加载资源的延迟，要等所有初始化完成再开始流程
                    console.log("robot 延迟加载完成", curIndex)
                    curInitCount += 1
                    checkStart()
                })
                if(initOk == true){
                    curInitCount += 1
                    checkStart()
                }
            }
            curIndex += 1
            if(this.robots[curIndex] != null){
                if(this.state == 'instantlyInit'){
                    // initRobot()
                    //改成直接同步加载
                    forInitRobot(curIndex)
                }else{
                    this.scheduleOnce(()=>{
                        initRobot()
                    },0.1)
                }
            }else{
                console.log('initAsync 结束', this.jsonName)
            }
        }
        
        console.log('initAsync 开始', this.jsonName)
        initRobot()
    },



    //initAsync之后将不在自动调用robotStart，而是等待手动调用Start
    startRobots(){

        this.robotsStart = this.robots.concat([])
        this.scheduleOnce(()=>{
            // console.log('等待一秒调用startRobots')
            for(var i = 0; i < this.robotsStart.length; i++){
                //在其他RobotStart之前
                if(this.robotsStart[i].config.key == 'gameStart'){
                    this.robotsStart[i].robotStartBefore()
                }
            }
            for(var i = 0; i < this.robotsStart.length; i++){
                if(this.robotsStart[i].robotStart != null){
                    this.robotsStart[i].robotStart()
                }
            }
            this.state = 'runenabled'
         },0)

        // this.robotsStart = this.robots.concat([])
        // for(var i = 0; i < this.robots.length; i++){
        //     //在其他RobotStart之前
        //     if(this.robots[i].config.key == 'gameStart'){
        //         this.robots[i].robotStartBefore()
        //     }
        // }
        // for(var i = 0; i < this.robots.length; i++){
        //     // if(this.robots[i].config.key == 'createObject' && this.robots[i].codeNode){
        //     //     console.log('333 start时是否有',this.robots[i].codeNode.spineCom)
        //     // }
        //     if(this.robots[i].robotStart != null){
        //         this.robots[i].robotStart()
        //     }
        // }
        // this.state = 'runenabled'
    },


    init(robots, gameView, cb){
        this.inRun = true
        this.robots = robots

        this.codeRobotConfig.timeScale = 1
        this.codeRobotConfig.pause = 0
        this.codeRobotConfig.audioArray = {}
        this.codeRobotConfig.states = {}
        this.codeRobotConfig.broadCast = {}
        this.codeRobotConfig.onListen = {}
        this.codeRobotConfig.loadCbDit = {}
        // this.codeRobotConfig.loadId = 0

        this.singleCard = {}
        if(gameView != null){
            this.singleCard['space'] = gameView.getChildByName('space')
            this.gameView = gameView
            gameView.active = true
        }else{
            this.gameView = null
        }

        var curInitCount = 0

        var checkStart = ()=>{
            if(curInitCount == this.robots.length){
                // console.log("流程start")
                this.state = 'needStart'
                this.robotsStart = robots.concat([])
                this.scheduleOnce(()=>{
                    for(var i = 0; i < this.robots.length; i++){
                        //在其他RobotStart之前
                        if(this.robots[i].config.key == 'gameStart'){
                            this.robots[i].robotStartBefore()
                        }
                    }
                    for(var i = 0; i < this.robots.length; i++){
                        // if(this.robots[i].config.key == 'createObject' && this.robots[i].codeNode){
                        //     console.log('333 start时是否有',this.robots[i].codeNode.spineCom)
                        // }
                        if(this.robots[i].robotStart != null){
                            this.robots[i].robotStart()
                        }
                    }
                    this.state = 'runenabled'
                    // console.log("流程start cb", this.state)
                    if(cb != null){
                        console.log("流程start cb")
                        cb()
                    }
                 },0)
            }
        }

        //在其他RobotsInit之前
        for(var i = 0; i < this.robots.length; i++){
            this.robots[i].codeProgress = this
            if(this.robots[i].config.key == 'gameStart'){
                if(this.robots[i].config.otherConfig.modal.default == 2){
                    this.robots[i].robotInit()
                    curInitCount += 1
                }
            }
        }

        for(var i = 0; i < this.robots.length; i++){
            // if(this.robots[i].config.key == 'createObject' &&  this.robots[i].codeNode){
            //     console.log('222 init时是否有',this.robots[i].codeNode.spineCom)
            // }
            if(this.robots[i].config.key == 'gameStart' && this.robots[i].config.otherConfig.modal.default == 2){
                //已经提前初始化过了，跳过
                continue
            }
            var initOk = this.robots[i].robotInit(()=>{
                //有的robot会有加载资源的延迟，要等所有初始化完成再开始流程
                // console.log("robot 延迟加载完成")
                curInitCount += 1
                checkStart()
            })
            if(initOk == true){
                curInitCount += 1
                checkStart()
            }
        }
    },

    playSound(name, target){
        if(this.robots == null){
            return
        }
        // console.log('播放音频事件', name, target)
        var config = StaticValue.clone(StaticValue.zhilinConfig['sound'])
        var robot = new CodeRobot['soundRobot'](config)
        robot.codeProgress = this
        robot.config.otherConfig.customeName.default = name
        robot.robotInit()
        robot.inputHandle({data: 1})
        this.robots.push(robot)
    },

    playSounds(arr, cb, yinggui){
        var firstRobot
        var robotArr = []
        for(var i = 0; i < arr.length; i++){
            var config = StaticValue.clone(StaticValue.zhilinConfig['sound'])
            var robot = new CodeRobot['soundRobot'](config)
            robot.codeProgress = this
            robot.config.otherConfig.customeName.default = arr[i]
            if(yinggui != null){
                robot.config.otherConfig.yinggui.default = yinggui
            }
            robot.robotInit()
            if(i == 0){
                firstRobot = robot
            }
            robotArr.push(robot)
            this.robots.push(robot)
        }
        for(var i = 0; i < robotArr.length; i++){
            var robot = robotArr[i]
            var nextRobot = robotArr[i + 1]
            if(nextRobot == null){
                nextRobot = {inputHandle: cb}
            }
            if(nextRobot != null){
                robot.linkDatas = {outputSolt: {'number1': [{robot: nextRobot}]}}
            }
        }
        if(firstRobot != null){
            firstRobot.inputHandle({data: 1})
        }
    },

    //显示提示
    showTips(inputData){
        var codePanel = this.node.getComponent('CodePanel')
        if(codePanel != null){
            codePanel.showTips(inputData)
        }else{
            UIManager.getInstance().openForm(MessageTips.prefabPath, inputData);
        }
    },

    //显示确认框
    showConfirm(inputData, cb){
        var codePanel = this.node.getComponent('CodePanel')
        if(codePanel != null){
            // codePanel.showTips(inputData)
            // cb(1)//直接返回1
        }else{
            
        }
        // console.log('调用showConfirm', inputData)

        var confirmBoxPath = 'app/forms/popup/ConfirmBox'
        UIManager.getInstance().openForm(confirmBoxPath, [()=>{
            UIManager.getInstance().closeForm(confirmBoxPath);
            //点击了ok
            cb(1)
        }, ()=>{
            UIManager.getInstance().closeForm(confirmBoxPath);
            //点击了取消
            cb(0)
        }, inputData]);
    },

    pause(){
        this.codeRobotConfig.pause = 1
        if(this.robots == null){return}
        for(var i = 0; i < this.robots.length; i++){
            if(this.robots[i].robotPause != null){
                this.robots[i].robotPause() 
            }
        }
    },

    resume(){
        // if(this.codeRobotConfig.pause == 1){
            this.codeRobotConfig.pause = 0
            if(this.robots == null){return}
            for(var i = 0; i < this.robots.length; i++){
                if(this.robots[i].robotResume != null){
                    this.robots[i].robotResume()
                }
            }
        // }
    },

    changeTimeScale(timeScale){
        if(timeScale < 0){timeScale = 0}
        this.codeRobotConfig.timeScale = timeScale
        if(this.robots == null){return}
        for(var i = 0; i < this.robots.length; i++){
            if(this.robots[i].changeTimeScale != null){
                this.robots[i].changeTimeScale()
            }
        } 
    },

    update (dt) {
        if(this.robots == null){
            return
        }
        if(this.codeRobotConfig.pause == 1){
            return
        }
        for(var i = 0; i < this.robots.length; i++){
            if(this.robots[i].robotUpdate != null){
                this.robots[i].robotUpdate(dt * this.codeRobotConfig.timeScale)
            }
        }
    },

    //发送广播数据,进入
    sendData(eventName, data){
        if(this.codeRobotConfig.broadCast[eventName] != null){
            for(var key in this.codeRobotConfig.broadCast[eventName]){
                this.codeRobotConfig.broadCast[eventName][key](data)
            }
        }
    },

    //接收从robot传出来的数据
    sendDataOut(eventName, data){
        // console.log('sendDataOut', this.codeRobotConfig.onListen, data)
        if(this.codeRobotConfig.onListen[eventName] != null){
            this.codeRobotConfig.onListen[eventName](data)
        }
    },

    //发送广播数据out()


    //游戏结束
    end(){
        EventCenter.emit(EventConst.PAGE_END)
    },

    release(withPreview = false, dontDestroy = false){
        this.state = 'release'
        this.unscheduleAllCallbacks()
        // console.log('codeProgress release了', this.jsonName, dontDestroy)
        this.codeRobotConfig.loadCbDit = {}
        this.codeRobotConfig.loadId = 0

        if(this.robots != null){
            for(var i = 0; i < this.robots.length; i++){
                this.robots[i].robotRelease(withPreview, dontDestroy)
                if(this.robots[i].instance == null){
                    this.robots[i].codeProgress = null
                }
            }
        }
        this.singleCard = {} 
        this.robots = null
        this.inRun = false
        
        if(this.gameView != null && dontDestroy == false){
            this.gameView.active = false
        }
        // console.log('codeProgress release成功了', this.jsonName, dontDestroy)
    },


    releaseDontDestroy(){
        this.state = 'release'
        this.unscheduleAllCallbacks()
        this.codeRobotConfig.loadCbDit = {}
        this.codeRobotConfig.loadId = 0

        if(this.robots != null){
            for(var i = 0; i < this.robots.length; i++){
                this.robots[i].robotRelease(false, true)
            }
        }
        this.singleCard = {} 
        this.robots = null
        this.inRun = false
        
        // if(this.gameView != null){
        //     this.gameView.active = false
        // }
    },


    //重新开始
    restart(cb){
        // var robots = this.robots
        if(this.robotsStart != null){
            // for(var i = 0; i < this.robotsStart.length; i++){
            //     if(this.robotsStart[i].config.key == 'createObject'){
            //         console.log(this.robotsStart[i].codeNode.spineCom)
            //     }
            // }
            // console.log('robotStart',this.robotsStart)
            // this.release()
            this.init(this.robotsStart, this.gameView, cb)
        }else{
            console.warn('当前codeprogress从未执行过，状态：' + this.state)
        }
    },

    //切换游戏
    changeGame(gamePath, orPageIndex){
        //gamePath 的路径应该是怎么样的呢？
        //bundle, jsonName
        if(UIManager.getInstance().currentScene.indexOf("app/forms/screen/UIStory") != -1){
            // console.log('使用绘本内的切换页面',UIManager.getInstance().currentScene, UIManager.getInstance()._showingForms, gamePath, orPageIndex)
            //使用绘本内的切换页面
            UIManager.getInstance()._showingForms[UIManager.getInstance().currentScene].realJumpScene(orPageIndex)
        }else{
            //直接切换到对应游戏
            this.release(false, false)
            this.runTimeJsonToRobots(this.gameView, ()=>{
                this.inChangeGame = false
            }, gamePath)
        }
    },

    // space/whiteNode

    onGetSingleCard(key){
        if(this.singleCard[key] != null){
            return this.singleCard[key]
        }

        for(var i = 0; i < this.workspace.children.length; i++){
            var node = this.workspace.children[i]
            if(node.key == key){
                if(key == 'space'){
                    node = node.getChildByName('space')
                }
                this.singleCard[key] = node
                break
            }
        }
        return this.singleCard[key]
    },

    vibrate(long){
        console.log('震动长短', long)
    },

    getConfigData(fileName){
        if(GlobalConfig[fileName] != null){
            return GlobalConfig[fileName]
        }
        return []
    },

    //添加背包物品
    addBagGood(id, count){
        if(count == 0){
            return cloudDb.getGoodCount(id)
        }else{
            return cloudDb.addGood(id, count)
        }
    },

    //使用背包物品
    useBagGood(id, count){
        return cloudDb.useGood(id, count) ? 1 : 0
    },                  
    
    // destroy(){
    //     console.log('codeprogress node destroy')
    //     super.destroy()
    // },

    onDestroy(){
        this.state = 'release'
        this.release(false, true)
    }

})