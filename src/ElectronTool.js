
//一个集合Electron中所有ipc调用方法的类
export function choosePath(){
    try {
        if(window.require != null){
          var {ipcRenderer} = window.require('electron')
          var result = ipcRenderer.sendSync('selectFolder', ['openDirectory'])
          if(result != null){
            return result[0]
          }
          return null
        }   
        return null
    } catch (error) {
        console.log(error)
        return null
    }
}

//写入字符串到本地
export function writeFileSync(filePath, string){
  try {
      if(window.require != null){
        var fs = window.require('fs') 
        fs.writeFileSync(filePath, string)
      }
  } catch (error) {
      console.log(error)
      return null
  }
}

//读文件的循环
export function readFileSync(filePath){
  try {
      if(window.require != null){
        var fs = window.require('fs') 
        if(fs.existsSync(filePath)){
          return fs.readFileSync(filePath)
        }else{
          return null
        }
      }else{
        return null
      }
  } catch (error) {
      console.log(error)
      return null
  }
}

export function updateDapanDataToDB(filePath){
    var arg = {
      id: new Date().getTime() + Math.round(Math.random() * 1000),
      exportFolder:  window.globalSetting.LocalDataFolder,
      worker: 'WorkerImportdataToDb.js',
      datafolder: filePath,
      dataType: 'dapanData',
      needCheckRepeat: true
    }
    // console.log('arg', arg)
    // return
    if(window.require != null){
      var {ipcRenderer} = window.require('electron')
      var result = ipcRenderer.sendSync('importData', arg)
      console.log('调用importData成功' + arg.id, result)
    }
        
}


//修改系统时间
export async function changeSysTime(momentDate){
  return new Promise((resolve, reject) => {
    if(window.require != null){
      let child_process = window.require('child_process')
      let macosTimeFormat = momentDate.format('MMDDHHmmYYYY.ss')
      let password = 'lywclx'
      child_process.exec(`echo ${password} | sudo -S date ` + macosTimeFormat, function(err, sto) {
          if(err != null){
              console.log('修改时间失败了', err)
              resolve(false)
          }else{
              // console.log('修改时间成功了', sto)
              resolve(true)
          }
      })
    }else{
      resolve(false)
    }
  })
}

//重置系统时间
export async function resetSysTime(){
  return new Promise((resolve, reject) => {
    if(window.require != null){
      let child_process = window.require('child_process')
      let password = 'lywclx'
      //需要先安装ntp
      //brew install ntp
      child_process.exec(`echo ${password} | sudo -S ntpdate -u time.apple.com`, function(err, sto) {
          if(err != null){
              console.log('重置时间失败了', err)
              resolve(false)
          }else{
              console.log('修改时间成功了', sto)
              resolve(true)
          }
      })
    }else{
      resolve(false)
    }
  })
}