const { app, ipcMain, BrowserWindow, Menu, MenuItem, globalShortcut, utilityProcess, shell, dialog } = require('electron')
global.Editor = require('./editor.js');
var http = require('http');  
var fs = require('fs')
// var request = require('request');
const Path = require('path');
// const extract = require('extract-zip')
const os = require('os')
const { exec } = require('child_process');
const Profile = require('./profile.js');
// var electron = require('electron')
var moment = require('moment')

// const url = require('url');

var apiLocalData = require('./apiLocalData');  
// const { count } = require('console');

function parent_path_count(path_str, count){
  var path_temp = path_str
  for(var i = 0; i < count; i++) {
      path_temp = Path.resolve(path_temp, '..')
  }
  return path_temp
}

//子进程运行保存
const ChildRunDit = {}

  //获取exe的path
function getAssestPath(){
    if(os.type == 'Darwin'){
      //文件夹目录外面
      return parent_path_count(Editor.getExePath(), 3)
    }else if(os.type == 'Windows_NT'){
      return parent_path_count(Editor.getExePath(), 1)
    }
    return Editor.getExePath()
}

//获取数据保存目录
function getDataFolder(){
    var DataFolder = getAssestPath() + '/localData'
    var globalSettingPath = getAssestPath() + '/globalSetting.json'
    if(fs.existsSync(globalSettingPath)){
      // 如果存在设置文件，用设置文件中保存的本地数据目录
      DataFolder = JSON.parse(fs.readFileSync(globalSettingPath)).LocalDataFolder
    }
    return DataFolder
}



apiLocalData.DataFolder = getAssestPath() + '/localData'
apiLocalData.init()
console.log('DataFolder', apiLocalData.DataFolder)


//根据路径创建dir
function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
      return true;
  } else {
      if (mkdirsSync(Path.dirname(dirname))) {
          fs.mkdirSync(dirname);
          return true;
      }
  }
}

function getTimeUntil(futureTime) {
    const now = new Date();
    const future = new Date(futureTime);
    const diff = future.getTime() - now.getTime();
 
    if (diff <= 0) {
        return "00:00";
    }
 
    var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((diff % (1000 * 60)) / 1000);

    
    if(minutes < 10){
      minutes = '0' + '' + minutes
    }
    if(seconds < 10){
      seconds = '0' + '' + seconds
    }

    if(hours == 0){
      return `${minutes}:${seconds}`
    }

    if(hours < 10){
      hours = '0' + '' + hours
    }

    return `${hours}:${minutes}:${seconds}`;
}
 


function getUrlParams(url){
  var arr = url.split('?')
  var functionNameArr = arr[0].split('/')
  var funcName = functionNameArr[functionNameArr.length - 1]
  var params = {}
  var query = arr[1]
  if (query) {
    var queryArr = query.split('&');
    for (var i = 0; i < queryArr.length; i++) {
      var pair = queryArr[i].split('=');
      params[pair[0]] = decodeURIComponent(pair[1]);
    }
  }
  return {funcName , params}
}

//初始化数据库
async function initSqlite(){
   var workPath = getAssestPath() + '/tool/'
   const YWRequest = await import(workPath + 'YWRequest.mjs')
   const Rules = await import(workPath + 'Rules.mjs')

   YWRequest.DataFolder = getDataFolder()
}

function createWindow () {   
  // Menu.setApplicationMenu(null)
  let profilePath = getAssestPath() + '/main-window.json'
  let profile = new Profile(profilePath);

  // if (profile.data) {
  //     width = profile.data.width || width;
  //     height = profile.data.height || height;
  //     x = profile.data.x || x;
  //     y = profile.data.y || y;
  // }
  // 创建浏览器窗口
  var option = {
    width: profile.data.width ? profile.data.width : 1280,
    height: profile.data.height ?  profile.data.height : 720,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: false,
      // preload: Path.join(__dirname, 'preload.js')
    }
  }
  if(profile.data.fullscreen == true){
    option.fullscreen = true
  }
  const win = new BrowserWindow(option)

  win.on('resize', function () {
      profile.saveWithObjectData({
          width: win.getContentSize()[0],
          height: win.getContentSize()[1],
      });
  });

  // 监听全屏进入事件
  win.on('enter-full-screen', () => {
    // console.log('进入了全屏模式');
    profile.saveItem('fullscreen', true)
  });

  // 监听全屏退出事件
  win.on('leave-full-screen', () => {
      // console.log('退出了全屏模式');
      profile.saveItem('fullscreen', false)
  });

  // 并且为你的应用加载index.html
  // win.loadFile('index.html')
  // const startUrl = url.format({
  //   pathname: Path.join(__dirname, 'index.html'), // 使用 path.join 来构建正确的路径
  //   protocol: 'file:',
  //   slashes: true
  // });

  // win.loadURL('http://localhost:5173/#/RulePredict') //
    win.loadURL('http://localhost:5173/#/BookEdit') //

  // win.loadURL('https://static.musictree.net/test/public/res/import/0a/app/index.html');
  // win.loadURL('https://www.baidu.com');

  // const contextMenuTemplate = [
  //   {
  //     label: '拷贝',
  //     click: () => {
  //       console.log('菜单项拷贝被点击');
  //     }
  //   },
  //   {
  //     label: '菜单项2',
  //     type: 'separator' // 分隔符
  //   },
  //   {
  //     label: '粘贴',
  //     click: () => {
  //       console.log('菜单项粘贴被点击');
  //     }
  //   }
  // ];
 
  // win.webContents.on('context-menu', (event, params) => {
  //   const menu = Menu.buildFromTemplate(contextMenuTemplate);
  //   menu.popup({ window: win });
  // });

  // 打开开发者工具
  // win.webContents.openDevTools()
  // win.webContents.openDevTools()
  // document.onkeydown = function(e) {
  //   let key = window.event.keyCode;
  //   console.log('key', key)
  //   if(key == 73){
  //     win.webContents.openDevTools()
  //   }
  // }

  // const menu = new Menu()
  // menu.append(new MenuItem({
  //   label: 'Print',
  //   accelerator: 'CmdOrCtrl+I',
  //   click: () => { 
  //     win.webContents.openDevTools()
  //    }
  // }))
  // Menu.setApplicationMenu(menu)
  // Menu.setApplicationMenu(null)

  // window.WritablePath = Editor._getUserDateDir()

  // console.log('window.WritablePath', window.WritablePath)

  // win.addEventListener('keyup', function(e){
  //   console.log(e)
  // }, true)

  // globalShortcut.register('CommandOrControl+I', () => {
  //   console.log('CommandOrControl+X is pressed')
  //   win.webContents.openDevTools()
  // })

  // globalShortcut.register('CommandOrControl+R', () => {
  //   win.webContents.reload()
  // })

  // globalShortcut.register('CommandOrControl+=', () => {
  //   console.log('CommandOrControl++ is pressed')
  //   win.webContents.setZoomLevel(win.webContents.getZoomLevel() + 1); // 放大
  // })
  // globalShortcut.register('CommandOrControl+-', () => {
  //   console.log('CommandOrControl+- is pressed')
  //   win.webContents.setZoomLevel(win.webContents.getZoomLevel() - 1); // 缩小
  // })


  // Editor.log('Editor._getUserDateDir()')

  ipcMain.on('getWritablePath', (event, arg) => {
    // event.returnValue = Editor.getExePath()
    var tool = Editor.getExePath() + '/tool/newindex'
    // return 
    var newindex = require(tool)
    var url = Editor.getExePath() + '/tool/'
    newindex.startPack(url, (res)=>{
      event.sender.send('mainConsole', res)
    })
    event.returnValue = newindex.test(url)
  })

  

  ipcMain.on('getElectronVersion', (event, arg) => {
    if(process != null){
      event.returnValue = process.versions
    }else{
       event.returnValue = '咩有process'
    }
  })
  
  ipcMain.on('gettoolPath', (event, arg) => {
    event.returnValue = Editor.getExePath() + '/tool'
  })

  ipcMain.on('getAssestPath', (event, arg) => {
    event.returnValue = getAssestPath()
  })

 

  //回测规则，在后台运行
  ipcMain.on('loopCheckRule', async (event, arg) => {
    try {
      // const YWRequest = await import('./YWRequest.mjs')
      // const Rules = await import('./Rules.mjs')

      // YWRequest.DataFolder = getAssestPath() + '/localData'
      // YWRequest.stock_zh_a_hist = 'dwqfewf23f'
      var DataFolder = getAssestPath() + '/localData'
      var globalSettingPath = getAssestPath() + '/globalSetting.json'
      if(fs.existsSync(globalSettingPath)){
        // 如果存在设置文件，用设置文件中保存的本地数据目录
        DataFolder = JSON.parse(fs.readFileSync(globalSettingPath)).LocalDataFolder
      }
      var workPath = getAssestPath() + '/tool/'
      // var initResult = YWRequest.init(DataFolder)
      // 'DataFolder:' + YWRequest.stock_zh_a_hist
      // event.returnValue = arg //+ Rules.calculXiapuPresent(100, 20) //+ JSON.stringify(YWRequest.getTradeDateArr(2024))
      var userDataFolder = getAssestPath() + '/localData/userData'
      if(fs.existsSync(userDataFolder) == false){
        fs.mkdirSync(userDataFolder)
      }
      arg.DataFolder = DataFolder

      var ruleFile = userDataFolder + '/' + arg.tabActiveKey + '_' + arg.policyName + '.json'
      fs.writeFileSync(ruleFile, JSON.stringify(arg))
      var time = new Date().getTime()

      //计算预估时间
      var speed = 0

      var thread = arg.huiceConfig.thread
      if(thread == null){
        thread = 1
      }
      if(thread > 1){
          //使用多线程回测，这里记录线程数量
          //把要回测的日期平均分配到每个线程，当所有线程执行完后，合并结果并返回

          //平均每个线程回测的天数
          // var oneThreadDays = Math.ceil(arg.huiceConfig.years.length * 365 / thread)
          //多线程回测传入的是时间区间，而不是年份了
          var resultDit = {}
          var hasResultCount = 0
          var progressDit = {}

          var years = arg.huiceConfig.years
          years.sort((a, b)=>{
            return a - b
          })

          //如果传入的是时间范围
          // var days = moment(arg.huiceConfig.start_date).diff(moment(arg.huiceConfig.end_date), 'days')
          // var oneThreadDays = Math.ceil(days / thread)

          //传入的还是年份
          // var oneThreadDays = Math.ceil((years.length * 365) / thread)


          var startChild = function(start_date, end_date){
            
            var child = utilityProcess.fork(workPath + 'Worker.js', [DataFolder, ruleFile, start_date, end_date],{cwd: workPath, stdio:'pipe'})
            if(child.stdout != null){
              child.stdout.on('data', (data) => {
                event.sender.send('mainConsole', `Received chunk ${data}`)
              })
            }
            if(child.stderr != null){
              child.stderr.on('data', (data) => {
                event.sender.send('mainConsole', `Received stderr ${data}`)
              })
            }
            child.on('spawn', () => {
              event.sender.send('mainConsole', 'child.pid'+ child.pid)
              // console.log(child.pid)
            })
            child.on('message', (data) => {
              if(data.progress != null){
                progressDit[start_date] = data.progress
                var allProgress = 0
                for(var key in progressDit){
                  allProgress += progressDit[key]
                }
                speed = (allProgress / thread) / (new Date().getTime() - time)
                var needTime = (1 - allProgress / thread) / speed
                // console.log('progressDit', progressDit)
                event.sender.send('huiceResult', {tabActiveKey: arg.tabActiveKey, policyName: arg.policyName, progress: allProgress / thread, oneDayData: data.data, memory: data.memory ,  completeTime: getTimeUntil(Date.now() + needTime)})
              }
              if(data.resultDit != null){
                resultDit = { ...resultDit, ...data.resultDit }
                hasResultCount += 1
                if(hasResultCount == thread){
                  //所有线程都执行完毕了
                  var dates = Object.keys(resultDit)
                  dates.sort((a, b)=>{
                    return moment(a).diff(moment(b), 'days')
                  })
                  var resultDitSort = {}
                  for(var j = 0; j < dates.length; j++){
                    resultDitSort[dates[j]] = resultDit[dates[j]]
                  }
                  //同时删除引用
                  delete ChildRunDit[arg.tabActiveKey + "-" + arg.policyName]
                  event.sender.send('huiceResult', {tabActiveKey: arg.tabActiveKey, policyName: arg.policyName, data: resultDitSort, dates: dates, costTime: '多线程耗时' + ((new Date().getTime() - time) / 1000).toFixed(2) + 's' })
                }
                child.kill()
                child = null
              }
            })
            //引用一下，便于从外部终止进程
            if(ChildRunDit[arg.tabActiveKey + "-" + arg.policyName] == null){
              ChildRunDit[arg.tabActiveKey + "-" + arg.policyName] = [child]
            }else{
              ChildRunDit[arg.tabActiveKey + "-" + arg.policyName].push(child)
            }
          }

          //这是第一种方案
          // for(var i = 0; i < thread; i++){
          //   var startAdd = i == 0 ? 0 : 1   //如果不加一天，下一次循环的开始日期和上一次的最后一天重复
          //   var start_date = moment(arg.huiceConfig.start_date).add(i * oneThreadDays + startAdd, 'days')
          //   var end_date =   moment(arg.huiceConfig.start_date).add((i + 1) * oneThreadDays, 'days')

          //   //防止天数溢出区间范围
          //   if(moment(end).diff(moment(arg.huiceConfig.end_date), 'days') > 0){
          //     end_date = arg.huiceConfig.end_date
          //   }
          //   // console.log('start_date', start_date, 'end_date', end_date)
          //   startChild(start_date, end_date)
          // }
        
          // for(var i = 0; i < thread; i++){
          // }




          //这是第二种方案
          var curYearIndex = 0
          var start_date = years[curYearIndex] + '-01-01'
          var end_date = years[curYearIndex] + '-12-31'
          var oneThreadDays = Math.ceil((years.length * 365) / thread)
          var curEndDate = null
          var lastEndDate = years[years.length - 1] + '-12-31'
          var curTreadIndex = 0
          var dataArr = []
          while(curEndDate != lastEndDate){
              var startAdd = curTreadIndex == 0 ? 0 : 1
              var start = moment(start_date).add(curTreadIndex * oneThreadDays + startAdd, 'days').format('YYYY-MM-DD')
              var end =   moment(start_date).add((curTreadIndex + 1) * oneThreadDays, 'days').format('YYYY-MM-DD')
              if(moment(end).diff(moment(end_date), 'days') >= 0){
                curEndDate = end_date
                end = end_date
                //年份可以切换了
                curYearIndex += 1
                curTreadIndex = 0
                start_date = years[curYearIndex] + '-01-01'
                end_date = years[curYearIndex] + '-12-31'
                // if(curEndDate == lastEndDate){
                //   break
                // }
              }else{
                curTreadIndex += 1
              }
              dataArr.push({start_date: start, end_date: end})
              // console.log('start - end', start, end)
          }
          thread = dataArr.length //有多少日期要执行就有多少个线程
          for(var i = 0; i < dataArr.length; i++){
            startChild(dataArr[i].start_date,  dataArr[i].end_date)
          }
      }else{
          // var oneYearResultDit = Rules.huiceOneYear(arg.rulesDit, arg.huiceConfig.years)
          // var result = Rules.runFullRules(arg.rulesDit)
          // event.returnValue = oneYearResultDit
          // event.sender.send('huiceResult', {tabActiveKey: arg.tabActiveKey, oneYearResultDit: oneYearResultDit})

          var child = utilityProcess.fork(workPath + 'Worker.js', [DataFolder, ruleFile],{cwd: workPath, stdio:'pipe'})
          
          if(child.stdout != null){
            child.stdout.on('data', (data) => {
              event.sender.send('mainConsole', `Received chunk ${data}`)
            })
          }
          if(child.stderr != null){
            child.stderr.on('data', (data) => {
              event.sender.send('mainConsole', `Received stderr ${data}`)
            })
          }
          

          child.on('spawn', () => {
            event.sender.send('mainConsole', 'child.pid'+ child.pid)
            console.log(child.pid) //
          })

          // child.on('exit', (e) => {
          //   event.sender.send('mainConsole', 'child.exit'+ e)
          //   console.log(child.pid) // undefined
          // })

          child.on('message', (data) => {
            if(data.progress != null){
              speed = data.progress / (new Date().getTime() - time)
              var needTime = (1 - data.progress) / speed
              event.sender.send('huiceResult', {tabActiveKey: arg.tabActiveKey, policyName: arg.policyName, progress: data.progress, oneDayData: data.data, memory: data.memory, completeTime: getTimeUntil(Date.now() + needTime)})
            }
            if(data.resultDit != null){
              event.sender.send('huiceResult', {tabActiveKey: arg.tabActiveKey, policyName: arg.policyName, data: data.resultDit , costTime: '单线程耗时' + ((new Date().getTime() - time) / 1000).toFixed(2) + 's'})
              //结束进程
              delete ChildRunDit[arg.tabActiveKey + "-" + arg.policyName]
              child.kill()
              child = null
            }
          })
          //引用一下，便于从外部终止进程
          ChildRunDit[arg.tabActiveKey + "-" + arg.policyName] = [child]
      }

      // child.stdout.on('data', (data) => {
      //   event.sender.send('mainConsole', `Received chunk ${data}`)
      //   console.log(`Received chunk ${data}`)
      // })

      // child.postMessage({ message: 'hello' })


      event.returnValue = 'thread数量' + arg.huiceConfig.thread
      // event.returnValue = YWRequest.getTradeDateArr(2024)
    } catch (error) {
      event.returnValue = error
    }
    // event.sender.send('mainConsole', YWRequest.min5Option)
  })

  //停止回测规则
  ipcMain.on('stopCheckRule', (event, arg) => {
    let key = arg.key
    if(ChildRunDit[key] == null){
      event.returnValue = {'当前运行的策略': Object.keys(ChildRunDit), key: key}
    }else{
      for(var i = 0; i < ChildRunDit[key].length; i++){
          ChildRunDit[key][i].kill()
      }
      delete ChildRunDit[key]
      event.returnValue = 'ok'
    }
  })
  
  ipcMain.on('getFolderSizeByWorker', async (event, arg) => {
    try {
      var workPath = getAssestPath() + '/tool/'
      var child = utilityProcess.fork(workPath + 'WorkerGetDirSize.js', [arg.path], {cwd: workPath, stdio:'pipe'})
      if(child.stdout != null){
        child.stdout.on('data', (data) => {
          event.sender.send('mainConsole', `Received chunk ${data}`)
        })
      }
      if(child.stderr != null){
        child.stderr.on('data', (data) => {
          event.sender.send('mainConsole', `Received stderr ${data}`)
        })
      }
      child.on('message', (data) => {
        if(data.size != null){
          event.sender.send('getFolderSizeResult', {path: arg.path, size: data.size, count: data.count})
          child.kill()
          child = null
        }else if(data.err != null){
          event.sender.send('getFolderSizeResult', {path: arg.path, size: 'NaN', err: data.err})
          child.kill()
          child = null
        }
      })
      event.returnValue = arg
    } catch (error) {
      event.sender.send('getFolderSizeResult', {path: arg.path, size: 'NaN', count: 0})
      event.returnValue = arg
    }
  })

  //导入数据的方法
  ipcMain.on('importData', async (event, arg) => {
    try {
      var id = arg.id //任务的唯一标识，可以是字符串，返回事件时携带
      var workPath = getAssestPath() + '/tool/'
      // var jsName = arg.workerName //'WorkerGetQueryUrl.js'
      var child = utilityProcess.fork(workPath + arg.worker, [JSON.stringify(arg)], {cwd: workPath, stdio:'pipe'})
      if(child.stdout != null){
        child.stdout.on('data', (data) => {
          event.sender.send('mainConsole', `Received chunk ${data}`)
        })
      }
      if(child.stderr != null){
        child.stderr.on('data', (data) => {
          event.sender.send('mainConsole', `Received stderr ${data}`)
          //这里还是不能直接返回报错，因为可能不是影响进程的报错
          // event.sender.send('importResult', {id: id, error: 'Received stderr ' + data })
          // child.kill()
          // child = null
        })
      }
      child.on('message', (data) => {
        if(data.progress != null){
          event.sender.send('importResult', {id: id, progress: data.progress })
        }else if(data.error != null){
          event.sender.send('importResult', {id: id, error: data.error })
          child.kill()
          child = null
        }else if(data.result != null){
          event.sender.send('importResult', {id: id, data: data.result})
          child.kill()
          child = null
        }
      })
      event.returnValue = arg
    } catch (error) {
       event.returnValue = error
    }
  })

  ipcMain.on('getQueryUrlByWorker', async (event, arg) => {
    try {
      var DataFolder = getDataFolder() //getAssestPath() + '/localData'
      var workPath = getAssestPath() + '/tool/'
      var child = utilityProcess.fork(workPath + 'WorkerGetQueryUrl.js', [DataFolder, JSON.stringify(arg)], {cwd: workPath, stdio:'pipe'})
      if(child.stdout != null){
        child.stdout.on('data', (data) => {
          event.sender.send('mainConsole', `Received chunk ${data}`)
        })
      }
      if(child.stderr != null){
        child.stderr.on('data', (data) => {
          event.sender.send('mainConsole', `Received stderr ${data}`)
        })
      }
      child.on('message', (data) => {
        if(data.result != null){
          event.sender.send('getQueryResult', {arg: arg, data: data.result})
          child.kill()
          child = null
        }
      })
      event.returnValue = arg
    } catch (error) {
      
    }
  })

  ipcMain.on('getQueryUrl', async (event, arg) => {
    // Editor.getExePath() + '/tool'
    // var lastQueryUrl = arg.lastQueryUrl
    // var exparams = arg.params
    // var {funcName, params} = getUrlParams(lastQueryUrl)
    // var data = []
    // if(exparams != null){
    //   for(var key in exparams){
    //     params[key] = exparams[key]
    //   }
    // }
    // var debugData = {params: params}
    // if(funcName == 'stock_zh_a_hist'){
    //   data = apiLocalData.getKLine(params)
    // }
    // event.returnValue = {data: data, status: 200, 'DataFolder':apiLocalData.DataFolder, debugData: debugData}
    var DataFolder = getDataFolder() //getAssestPath() + '/localData'
    var workPath = getAssestPath() + '/tool/'
    // var getQueryUrl = require()
    try {
        var { run } = await import(workPath + 'GetQueryUrl.js')
        // var {run, run2} = await import(workPath + 'GetQueryUrl.js')
        var result = await run(DataFolder, arg)
        // var result = await run2()
        event.returnValue = result//result//workPath + 'GetQueryUrl.js'
    } catch (error) {
        event.sender.send('mainConsole', `GetQueryUrl get Arr error` + error)
    }
    
  })


  ipcMain.on('getSettingFile', (event, arg) => {
    // event.returnValue = Editor.getExePath()
    var tool = Editor.getExePath() + '/tool/newindex'
    var newindex = require(tool)
    var url = Editor.getExePath() + '/tool/'
    
    try {
        getUrl((arg == true ?  releaseFolder : testFolder) + 'AssetsBundle.json', null, (res)=>{
          var json = JSON.parse(res)
          getUrl((arg == true ?  releaseFolder : testFolder) + 'hotupdate/version.manifest', null, (res2)=>{
            if(res2 != null){
              json.version = JSON.parse(res2).version
              event.sender.send('mainConsole', JSON.stringify(json))
              event.sender.send('getFromNet', json)
              fs.writeFileSync(url + 'AssetsBundle.json', res)
            }
          })
        })
    } catch (error) {
        event.sender.send('mainConsole', error)
    } 
    event.returnValue = 'ok'
  })

  //仅仅打开文件夹
  ipcMain.on('openFolder', (event, arg) => {
    shell.openPath(arg).then(() => {
        console.log('Folder opened successfully');
    }).catch(err => {
        console.error('Failed to open folder:', err);
    });
    event.returnValue = '成功调用打包工具'
  })

  ipcMain.on('selectFolder', (event, arg) =>{
    var result = dialog.showOpenDialogSync({properties: arg})
    event.returnValue = result
  })


  ipcMain.on('packBook', (event, arg) => {
    // var tool = Editor.getExePath() + '/tool/newindex'
    // var newindex = require(tool)
    // var url = Editor.getExePath() + '/tool/'
    // newindex.startPack(url, arg, (res)=>{
    //   event.sender.send('mainConsole', res)
    // })
    event.returnValue = '成功调用打包工具'
  })

  //打包配置表
  ipcMain.on('packConfig', async (event, arg) => {
    var tool = Editor.getExePath() + '/tool/yinyueTreeConvert.js'
    event.sender.send('mainConsole', tool)
    event.sender.send('mainConsole', JSON.stringify(arg))
    event.returnValue = '成功调用打包工具'
    try {
        var {startPack} = await import(tool)
        //注意都是放在可执行文件的那一个文件夹下
        arg.path = Editor.getExePath() + '/tool/'
        startPack(arg, (res)=>{
            event.sender.send('mainConsole', res)
        })
    } catch (error) {
        event.sender.send('mainConsole', 'catch error' + error)
    }
   
   
  })

  ipcMain.on('upLoadDapanData', async (event, arg) => {
    var tool =  getAssestPath() + '/tool/ossUploadData.js'
    // event.sender.send('mainConsole', tool)
    // event.sender.send('mainConsole', JSON.stringify(arg))
    event.returnValue = '成功调用上传工具'
    
    // Succeed

    try {
        var {startUpload} = await import(tool)
        //注意都是放在可执行文件的那一个文件夹下
        //arg.path = Editor.getExePath() + '/tool/'
        arg.path = getAssestPath() + '/tool/'
        startUpload(arg, (err)=>{
            event.sender.send('mainConsole', err)
        })
    } catch (error) {
        event.sender.send('mainConsole', 'catch error' + error)
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  // if (process.platform !== 'darwin') {
    app.quit()
  // }
  // Electron.app.exit()
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. 也可以拆分成几个文件，然后用 require 导入。