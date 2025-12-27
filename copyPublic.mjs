import fs from 'fs'
import path from 'path';

 
function copyFolder(src, dest) {
    // 检查目标文件夹是否存在，不存在则创建
    fs.mkdirSync(dest, { recursive: true });
 
    // 读取源文件夹中的所有项
    fs.readdir(src, (err, items) => {
        if (err) {
            console.error('Error reading source directory', err);
            return;
        }
 
        // 遍历所有项
        items.forEach(item => {
            const srcPath = path.join(src, item);
            const destPath = path.join(dest, item);
            // 判断是文件还是文件夹
            fs.stat(srcPath, (err, stat) => {
                if (err) {
                    console.error('Error getting stats', err);
                    return;
                }
                if (stat.isFile()) {
                    // 是文件，拷贝文件
                    fs.copyFile(srcPath, destPath, (err) => {
                        if (err) {
                            console.error('Error copying file', err);
                        } else {
                            // console.log(`Copied: ${srcPath} to ${destPath}`);
                        }
                    });
                } else if (stat.isDirectory()) {
                    // 是文件夹，递归拷贝文件夹
                    copyFolder(srcPath, destPath);
                }
            });
        });
    });
}

function copyFolderSync(src, dest){
    // 检查目标文件夹是否存在，不存在则创建
    fs.mkdirSync(dest, { recursive: true });
    var items = fs.readdirSync(src)
    // 遍历所有项
    items.forEach(item => {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        var stat = fs.statSync(srcPath)
        if (stat.isFile()) {
            // 是文件，拷贝文件
            fs.copyFileSync(srcPath, destPath)
        } else if (stat.isDirectory()) {
            // 是文件夹，递归拷贝文件夹
            copyFolderSync(srcPath, destPath);
        }
    })
}
 
// 使用示例：从 'sourceFolder' 拷贝到 'destinationFolder'
const sourceFolder = './public';

var destinationFolder = ''
var destinationFolderTool = ''
// const destinationFolder = '/Users/yaowei/Documents/work/炒股工具打包/MookSystem.app/Contents/Resources/app/';
// const destinationFolder = '/Users/guyi/Desktop/腰围腰围炒股工具/electron-v33-arm/Electron.app/Contents/Resources/app';


// const destinationFolderTool = '/Users/yaowei/Documents/work/炒股工具打包/tool/';
// const destinationFolderTool = '/Users/guyi/Desktop/腰围腰围炒股工具/electron-v33-arm/tool/';

var arr = [
    '/Users/yaowei/Documents/work/炒股工具打包/MookSystem.app/Contents/Resources/app/', 
    '/Users/guyi/Desktop/腰围腰围炒股工具/electron-v33-arm/Electron.app/Contents/Resources/app'
]

var toolArr = [
    '/Users/yaowei/Documents/work/炒股工具打包/tool/',
    '/Users/guyi/Desktop/腰围腰围炒股工具/electron-v33-arm/tool/'
]

arr.forEach((url)=>{
    if(fs.existsSync(url)){
        destinationFolder = url   
    }
})

toolArr.forEach((url)=>{
    if(fs.existsSync(url)){
        destinationFolderTool = url   
    }
})

//对两个文件特殊处理
//Rules.mjs
//YWRequest.mjs
var rulesFile = './src/views/lianghua/Rules.js'
var YWRequestFile = './src/GupiaoModle/YWRequest.js'

var fileArr = [rulesFile, YWRequestFile]
for(var i = 0; i < fileArr.length; i++){
    var file = fileArr[i]
    var exName = path.extname(file)
    var fileName = path.basename(file, exName)
    var jsTxT = fs.readFileSync(file, 'utf-8')
    //屏蔽不在tool中生效的代码

    // console.log('当前处理文件',fileName, jsTxT)


    jsTxT = jsTxT.replace('/* [这里是在Tool中使用Start]', '')
    jsTxT = jsTxT.replaceAll('[这里是在Tool中使用End] */', '')
    

    //
    var startIndex = jsTxT.indexOf('[这里是在Vue中使用Start]')
    var endIndex = jsTxT.indexOf('[这里是在Vue中使用End]')

    while(startIndex != -1){
        var str1 = jsTxT.substring(0, startIndex)
        var str2 = jsTxT.substring(endIndex + 15)

        // fs.writeFileSync('./str1.txt', str1)
        // fs.writeFileSync('./str2.txt', str2)

        // console.log('str1:', str1, 'str2:', str2)

        jsTxT = str1 + str2

        startIndex = jsTxT.indexOf('[这里是在Vue中使用Start]')
        endIndex = jsTxT.indexOf('[这里是在Vue中使用End]')
        // startIndex = -1
    }

    // new String(333).substring(startIndex, endIndex)

    //激活在tool中生效的代码
    console.log('写入到对应文件', sourceFolder + '/' + fileName + '.mjs')
    fs.writeFileSync(sourceFolder + '/' + fileName + '.mjs', jsTxT)
}


var versionFile = sourceFolder + '/version.json'
var versionJson = JSON.parse(fs.readFileSync(versionFile))
versionJson.version += 1
fs.writeFileSync(versionFile, JSON.stringify(versionJson))


// const destinationFolder = '/Users/yaowei/Documents/work/炒股工具打包/packIngTool/app/';
copyFolderSync(sourceFolder, destinationFolder);
copyFolderSync(sourceFolder, destinationFolderTool);


console.log('拷贝成功' , new Date().toTimeString())