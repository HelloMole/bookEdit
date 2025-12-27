import os from 'os'
import child  from 'child_process'

let sysType = os.type();

var ossBaseUrl = 'oss://ywserver/dapanData/'

var localfolder = '/Users/guyi/Desktop/腰围腰围炒股工具/electron-v33-arm/localData/dapanData/2021-12-31.json'
// var localfolder = './ossUpload'

var ossBaseUpLoadText =  './ossutilmac64 cp -r -f '
if(sysType == 'Windows_NT'){
    ossBaseUpLoadText =  process.cwd() + '/ossutil64.exe cp -r -f ' 
}


export function startUpload(arg, cb){
    if(arg.path != null){
        process.chdir(arg.path)
    }

    var upLoadText = ossBaseUpLoadText + arg.filePath + ' ' + ossBaseUrl + ' --config-file ' + './ossConfigYwServer'

    child.exec(upLoadText,{cwd: process.cwd()}, function(err, sto) {
        if(err != null){
            if(cb != null){
                cb(err)
            }
            console.log('err', err)
        }else{
            console.log('上传文件成功：', sto)
        }
    })
}
