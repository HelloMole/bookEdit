import fs from 'fs';
import path from 'path';

var count = 0

function getFolderSize(folderPath) {
    return new Promise((resolve, reject) => {
        let totalSize = 0;
        fs.readdir(folderPath, (err, files) => {
            if (err) return reject(err);
            
            let pending = files.length;
            if (!pending) return resolve(totalSize);
            files.forEach(file => {
                const filePath = path.join(folderPath, file);
                fs.stat(filePath, (err, stats) => {
                    if (err) return reject(err);
                    if (stats.isDirectory()) {
                        getFolderSize(filePath).then(size => {
                            totalSize += size;
                            if (!--pending) resolve(totalSize);
                        }).catch(reject);
                    } else {
                        count += 1
                        totalSize += stats.size;
                        if (!--pending) resolve(totalSize);
                    }
                });
            });
        });
    });
}
 

const args = process.argv.slice(2); // 去掉前两个默认的元素：node和脚本路径
console.log('开始执行的参数', args[0])
// 使用示例：
getFolderSize(args[0]).then(size => {
    console.log(`Total size: ${size} bytes`);
    process.parentPort.postMessage({size:  size, count: count})
}).catch(err => {
    process.parentPort.postMessage({err:  err})
    console.error('Error:', err);
});


