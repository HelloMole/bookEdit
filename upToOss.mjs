//直接将build生成的文件上传到oss，省去每次手动上传的操作
import os from 'os'
import fs from 'fs'
import child  from 'child_process'
import moment from 'moment'

let sysType = os.type();

var ossBaseUpLoadText =  './ossutilmac64 cp -r -f '
if(sysType == 'Windows_NT'){
    ossBaseUpLoadText =  './ossutil64.exe cp -r -f ' 
}

var localfolder = './dist'
var configPath = './ossConfig'
var ossBaseUrl = 'oss://xxxxxx'

var upLoadText = ossBaseUpLoadText + localfolder + ' ' + ossBaseUrl + ' --config-file ' + configPath
fs.copyFileSync(localfolder + '/index.html', localfolder + '/index' + moment().format('MMDDHH') + '.html')


 child.exec(upLoadText, function(err, sto) {
    if(err != null){
        console.log('发布网页失败了', err)
    }else{
        console.log('发布成功：', sto)
    }
})