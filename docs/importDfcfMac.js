import fs from 'fs';
import Excel from 'exceljs';
import moment from 'moment';
import path from 'path';
import LZString from 'lz-string';


var folder = '/Users/yaowei/Downloads/股市数据1'


//循环每一个文件
async function loopFolder(filePath, handle){
    if(fs.statSync(filePath).isDirectory() == true){
        var files = fs.readdirSync(filePath)
        files = files.filter((item)=>{
            return item.indexOf('.') != 0
        })
        // console.log('files', files)
        for(var i = 0; i < files.length; i++){
            // console.log('当前循环到：', files[i])
           await loopFolder(filePath + '/' + files[i], handle)
        }
    }else{
        await handle(filePath)
    }
}

async function fileDoHandle(filePath, date) {
    //一分钟的文件按天保存在以YYYYMMDD命名的文件夹下
    // console.log('当前处理文件', filePath)

    const workbook = new Excel.Workbook();
    var rowIndex = null
    var sheetDatas = []
    await workbook.csv.read(fs.createReadStream(filePath, 'utf-16le'), {
        parserOptions: {
            delimiter: '\t',
            quote: '"',
        },
        map: (value, index)=>{
            if(index == 0){
                //是新的一行了
                if(rowIndex == null){
                    rowIndex = 0
                }else{
                    rowIndex += 1
                }
            }else{
                
            }
            if(sheetDatas[rowIndex] == null){
                sheetDatas[rowIndex] = []
            }
            sheetDatas[rowIndex].push(value)
            // console.log('value', value)
        }
    });
    console.log('表格文本列表行数', sheetDatas)
}

await loopFolder(folder, async (filePath)=>{
    var extname = path.extname(filePath)
    // console.log('当前处理额', filePath, extname)
    // var name = path.basename(filePath, extname)
    if(extname == '.csv'){
        //只处理csv文件
        await fileDoHandle(filePath, null)
        // curCount += 1 
        // if(process.parentPort != null &&  process.parentPort.postMessage != null){
        //     process.parentPort.postMessage({progress: Number((curCount / totalCount * 100).toFixed(2))})
        // }
    }
})
