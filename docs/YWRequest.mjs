import axios from "axios";
import moment from 'moment';
import LZString from 'lz-string';



//在tool文件夹下调用
import * as sqlCrateTables from './sqlCrateTables.mjs';
import fs from 'fs';
const isInTool = true  //如果在tool文件夹下，可以直接读取db，否则使用ipc中转
const ossClient = null



//不会在tool时调用
// 

//分时数据读取模式
const readDailyUsingDb = false  //日k数据读取模式
const readMinUsingDb = false    //分时数据读取模式



//本地数据频繁读取有性能问题，尝试切换成数据库的形式保存分时数据
// https://orm.drizzle.team/docs/rqb
//基于数据回测所用的数据获取脚本
//当前脚本是在nodejs环境下吗
var isInNodeEnv = false

var stock_zh_a_hist = '/api/public/stock_zh_a_hist'  //获取股票历史行情
var stock_zh_a_hist_min_em = '/api/public/stock_zh_a_hist_min_em'  //获取股票历史行情


export var allSymbolDit = {}
export var allSymbolNameArr = []    //所有股票的名字列表
export var symbolEx = {}
export var symbolGroupDit = {}  //科创板，创业板，st股，分类
export var min5Option = []
export var min1Option = []
export var yearOption = []
export var jiheJinJiaTimeOption = []
export var tradeDateDit = {}    //交易日期数据
export var zhishuOptions = []   //指数数据选项
export var hangyeOptions = []   //所属行业的选项
export var hangyeSymbols = {}   //所属行业的选项

const onOneDayDataUpdateCb = []

//均价线选项
export var SymbolMaOption = [
    { value: 'MA_5', label: '5日均价' },
    { value: 'MA_10', label: '10日均价' },
    { value: 'MA_20', label: '20日均价' },
    { value: 'MA_30', label: '30日均价' },
    { value: 'MA_60', label: '60日均价' },
    { value: 'MA_120', label: '120日均价' },
]


//指标对应的下标
export var OneMinDataKeyIndex = {
    '时间': 0,
    '开盘': 1,
    '收盘': 2,
    '最高': 3,
    '最低': 4,
    '成交量': 5,
    '成交额': 6,
    '涨幅': 7,  //可能为空
    '振幅': 8,  //可能为空
    '均价': 9, //每次获取时计算
    '换手率': 10,   //1分钟的分时数据暂时没有此选项
}

//集合竞价对应的下标
export var JiheJinjiaKeyIndex = {
    '时间': 0,
    '最低': 1,  //集合竞价期间出现的最低价？集合竞价期间基本不会变化
    '最高': 2,  //集合竞价期间出现的最高价？集合竞价期间基本不会变化
    '昨收': 3,  //昨日收盘价？集合竞价期间基本不会变化
    '现价': 4,  //集合竞价期间的价格变动，重要指标

    '开盘': 5,      //只有25分钟的时候有
    '订单量': 6,    //只有25分钟的时候有
    '成交量': 7,    //只有25分钟的时候有 //单位是手数 
    '成交额': 8,    //只有25分钟的时候有

    '买1价': 9,     //基本等于现价，表示购买欲望，重要指标
    '买2价': 10,    //不一定有
    '买1量': 11,    //单位是手数     //基本等于当前的量能，重要指标
    '买2量': 12,    //单位是手数   //不一定有

    '卖1价': 13,
    '卖2价': 14,    //不一定有
    '卖1量': 15,     //单位是手数 
    '卖2量': 16,     //单位是手数  //不一定有
}

const DataType = {
    'JiheJinjia': 'JiheJinjia',  //集合竞价数据
    'OneMinData': 'OneMinData',  //一分钟的分时数据
}

const keyIndexOption = {
    'JiheJinjia': JiheJinjiaKeyIndex,  //集合竞价数据
    'OneMinData': OneMinDataKeyIndex,  //一分钟的分时数据
}

function strArrToDit(list) {
    var dit = {}
    for (var i = 0; i < list.length; i++) {
        dit[list[i]] = 1
    }
    return dit
}

function arrToDit(list, key, valueKey, formatKeyFun) {
    if (Array.isArray(list)) {

    } else {
        //如果是对象就直接返回object
        return list
    }
    var dit = {}
    if (key == null) {
        key = 'key'
    }
    for (var i = 0; i < list.length; i++) {
        var realKey = list[i][key]
        if (formatKeyFun != null) {
            realKey = formatKeyFun(realKey)
        }
        if (valueKey == null) {
            dit[realKey] = list[i]
        } else {
            dit[realKey] = list[i][valueKey]
        }
    }
    return dit
}

//统一成交量是手数x100
function fixedVolume(arr, dataType) {
    var needFixKeys = ['成交量']    //分时数据只需修复一个key
    if (dataType == DataType.JiheJinjia) {
        needFixKeys = ['成交量', '买1量', '买2量', '卖1量', '卖2量']
    }
    var keyIndex = keyIndexOption[dataType]
    var chenjiaoliangDontHas00 = 0    //对成交量做修复
    for (var i = 0; i < arr.length; i++) {
        var row = arr[i]
        if (Array.isArray(row) == true) {
            if (chenjiaoliangDontHas00 <= 5) {
                for (var j = 0; j < needFixKeys.length; j++) {
                    var key = needFixKeys[j]
                    var volumeIndex = keyIndex[key]
                    if (row[volumeIndex] != null && row[volumeIndex] != 0) {
                        var volmueHands = (row[volumeIndex] / 100).toFixed(2)
                        var dotStr = volmueHands.split('.')[1]
                        if (dotStr != '00') {
                            chenjiaoliangDontHas00 += 1
                        }
                    }
                }
            }
        } else {
            //直接取值
            for (var j = 0; j < needFixKeys.length; j++) {
                var key = needFixKeys[j]
                if (row[key] != null && row[key] != 0) {
                    var volmueHands = (row[key] / 100).toFixed(2)
                    var dotStr = volmueHands.split('.')[1]
                    if (dotStr != '00') {
                        chenjiaoliangDontHas00 += 1
                    }
                }
            }
        }
    }
    if (chenjiaoliangDontHas00 >= 5) {
        // console.log('错误的成交量数据，自动x100', dayKey)
        arr.forEach(row => {
            for (var j = 0; j < needFixKeys.length; j++) {
                var key = needFixKeys[j]
                // console.log('修复了字段', key)
                if (Array.isArray(row) == true) {
                    var volumeIndex = keyIndex[key]
                    row[volumeIndex] *= 100
                } else {
                    //说明是对象，已经有成交量字段
                    if (row[key] != null) {
                        row[key] *= 100
                    }
                }
            }
        });
    }
}

//转换集合竞价数据到1分钟的分时数据
function convertJinjiaDataToOneMinData(row) {
    var price = row[JiheJinjiaKeyIndex['现价']] != null ? row[JiheJinjiaKeyIndex['现价']] : row[JiheJinjiaKeyIndex['买1价']]
    return {
        '时间': row[JiheJinjiaKeyIndex['时间']],
        '开盘': price,
        '收盘': price,
        '最高': price,
        '最低': price,
        '成交量': row[JiheJinjiaKeyIndex['成交量']] != 0 ? row[JiheJinjiaKeyIndex['成交量']] : row[JiheJinjiaKeyIndex['买1量']],
        '成交额': row[JiheJinjiaKeyIndex['成交额']] != 0 ? row[JiheJinjiaKeyIndex['成交额']] : (row[JiheJinjiaKeyIndex['买1量']] * row[JiheJinjiaKeyIndex['买1价']]),
    }
}

// var axios = null
// var moment = null
var DataFolder = ''


function fourRoundToDecimals(num, fixedCound) {
    var scale = Math.pow(10, fixedCound)
    return Math.round(num * scale) / scale
}


export function init(folder) {
    if (folder != null) {
        DataFolder = folder
    } else {
        if (window.require == null) {
            console.log('YWRequest需要在electron或node环境中使用')
            return
        }
        fs = window.require('fs')
        if (DataFolder == '') {
            var { ipcRenderer } = window.require('electron')
            DataFolder = ipcRenderer.sendSync('getAssestPath')
            console.log('获取到了App路径', DataFolder)
            DataFolder += '/localData'
            console.log('DataFolder', DataFolder)
            if (fs.existsSync(DataFolder)) {
                console.log('DataFolder路径存在')
            }
        }

        if (fs == null) {
            console.log('YWRequest 初始化需要传入fs')
            return
        }
    }

    var url = DataFolder + '/symbolGroup/ACodeArr.json'
    if (fs.existsSync(url)) {
        allSymbolDit = JSON.parse(fs.readFileSync(url, 'utf-8'))
        for (var key in allSymbolDit) {
            allSymbolNameArr.push({ value: allSymbolDit[key] })
            var ex = key.split('.')[1]
            symbolEx[ex] = 1
        }
        // console.log('allSymbolNameArr', allSymbolNameArr)
    } else {
        console.log('文件不存在', url)
    }

    var url = DataFolder + '/hangyeGroup/hangyeOptions.json'
    if (fs.existsSync(url)) {
        hangyeOptions = JSON.parse(fs.readFileSync(url, 'utf-8'))
    } else {
        console.log('文件不存在', url)
    }

    var url = DataFolder + '/hangyeGroup/symbolsDit.json'
    if (fs.existsSync(url)) {
        hangyeSymbols = JSON.parse(fs.readFileSync(url, 'utf-8'))
        // console.log('hangyeSymbols', hangyeSymbols)
    } else {
        console.log('文件不存在', url)
    }

    var url = DataFolder + '/SymbolMaOption.json'
    if (fs.existsSync(url)) {
        SymbolMaOption = JSON.parse(fs.readFileSync(url, 'utf-8'))
    } else {
        console.log('文件不存在', url)
    }

    var url = DataFolder + '/symbolGroup'
    if (fs.existsSync(url)) {
        var fileList = fs.readdirSync(url)
        for (var i = 0; i < fileList.length; i++) {
            if (fileList[i].indexOf('.') == 0) {
                continue
            }
            var groupKey = fileList[i].split('.')[0]
            if (symbolEx[groupKey] == null && groupKey != 'ACodeArr') {
                // console.log('fileList[i]', fileList[i])
                symbolGroupDit[groupKey] = JSON.parse(fs.readFileSync(url + '/' + fileList[i]))
            }
        }
        // console.log('symbolGroupDit', symbolGroupDit)
    } else {
        console.log('文件不存在', url)
    }

    url = DataFolder + '/min5Option.json'
    if (fs.existsSync(url)) {
        min5Option = JSON.parse(fs.readFileSync(url, 'utf-8'))
    } else {
        console.log('文件不存在', url)
    }

    url = DataFolder + '/min1Option.json'
    if (fs.existsSync(url)) {
        min1Option = JSON.parse(fs.readFileSync(url, 'utf-8'))
    } else {
        console.log('文件不存在', url)
    }

    url = DataFolder + '/jiheJinJiaTimeOption.json'
    if (fs.existsSync(url)) {
        jiheJinJiaTimeOption = JSON.parse(fs.readFileSync(url, 'utf-8'))
    } else {
        console.log('文件不存在', url)
    }



    var url2 = DataFolder + '/zhishuOptions.json'
    if (fs.existsSync(url2)) {
        zhishuOptions = JSON.parse(fs.readFileSync(url2, 'utf-8'))
    } else {
        console.log('文件不存在', url2)
    }


    // console.log('min5Option', min5Option, min1Option)
    // console.log('YWRequest.allSymbolDit', allSymbolDit)

    var url3 = DataFolder + '/trade_dates'
    if (fs.existsSync(url3)) {
        var dirResult = fs.readdirSync(url3)
        for (var i = 0; i < dirResult.length; i++) {
            if (dirResult[i].indexOf('.') == 0) {
                continue
            }
            var filePath = url3 + '/' + dirResult[i]
            var dates = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
            for (var j = 0; j < dates.length; j++) {
                tradeDateDit[dates[j]] = 1
            }
            var year = dirResult[i]
            year = year.replace('.json', '')
            yearOption.push({
                value: year,
                label: year
            })
        }
    } else {
        console.log('文件不存在', url2)
    }

    // console.log('tradeDateDit', tradeDateDit)
    // calculateMaData()

    // try {
    //     var fenshiArr = fs.readdirSync(DataFolder + '/fiveMinData/2024-01-02')
    //     var fenshiOption = fenshiArr.map((item)=>{
    //         var time = item.split('.')[0].replace('_', ":")
    //         return {value: time, label: time}
    //     })
    //     console.log('fenshiArr', fenshiOption)
    //     fs.writeFileSync(DataFolder + '/min5Option.json', JSON.stringify(fenshiOption))
    // } catch (error) {

    // }

}

function getAvePrice(arr) {
    var price = 0
    for (var i = 0; i < arr.length; i++) {
        price += arr[i]
    }
    return fourRoundToDecimals(price / arr.length, 2)
}

//为防止在回测的时候计算ma值耗时，提前计算好所有ma值，保存在本地
export function calculateMaData(needMa, cb, start_date) {
    var dateArr = Object.keys(tradeDateDit)
    if (needMa == null) {
        needMa = [5, 10, 20, 30, 60, 120]
    }
    var symbolPriceDit = {}
    needMa.forEach((ma) => {
        symbolPriceDit[ma] = {}
    })
    var startIndex = 0
    if (start_date != null) {
        startIndex = dateArr.indexOf(start_date)
        if (startIndex == -1) {
            startIndex = 0
        }
    }
    // var needMa = Object.keys(symbolPriceDit)
    for (var i = startIndex; i < dateArr.length; i++) {
        var dayKey = dateArr[i]
        var filePath = DataFolder + '/dapanData/' + dayKey + '.json'
        var data = getDataFromCache(filePath)
        if (data != null) {
            for (var j = 0; j < data.length; j++) {
                let symbol = data[j]['代码']
                if (symbol.indexOf('.') == -1) {
                    symbol = symbolFull(symbol)
                    data[j]['代码'] = symbol //同时格式化代码
                }

                if (data[j]['最新价'] != null) {
                    data[j]['收盘'] = data[j]['最新价']
                    delete data[j]['最新价']
                }

                let oneSymbolData = data[j]

                let closePrice = oneSymbolData['收盘']

                for (var z = 0; z < needMa.length; z++) {
                    var maDay = needMa[z]
                    if (symbolPriceDit[maDay][symbol] == null) {
                        symbolPriceDit[maDay][symbol] = [closePrice]
                    } else {
                        symbolPriceDit[maDay][symbol].push(closePrice)
                    }
                    if (symbolPriceDit[maDay][symbol].length == maDay) {
                        data[j]['MA_' + maDay] = getAvePrice(symbolPriceDit[maDay][symbol])
                        symbolPriceDit[maDay][symbol].splice(0, 1)
                    }
                }
            }
            fs.writeFileSync(filePath, JSON.stringify(data))
            if (cb != null) {
                cb(i / dateArr.length)
            }
            data = null
            // console.log('dapanData', data)
        } else {
            console.warn('交易日数据缺失', dayKey)
        }
    }
}


//计算均价，
//输入的参数是dayCount，多少日的均价，
//data，数据列表，
//byKey，使用哪一个价格指标
//由于计算的只是某一天的均价，而不是传入数据的每一天的均价，和之前的不一样
function calculateMA(dayCount, data, byKey) {
    if (byKey == null) {
        byKey = 1
    }
    var result = [];
    for (var i = 0, len = data.length; i < len; i++) {
        if (i < dayCount - 1) {
            result.push('-');
            continue;
        }
        var sum = 0;
        for (var j = 0; j < dayCount; j++) {
            sum += +data[i - j][byKey];
        }
        result.push(sum / dayCount);
    }
    return result;
}

function calculateListMA(dayList, byKey) {
    var symbolsDit = {}
    var symbolsDitCount = {}    //还需要考虑到传入的某一只股票可能因为停牌导致的数据缺失问题
    for (var i = 0; i < dayList.length; i++) {
        var oneDay = dayList[i]
        for (var j = 0; j < oneDay.length; j++) {
            var oneSymbol = oneDay[j]
            if (symbolsDit[oneSymbol['代码']] == null) {
                symbolsDit[oneSymbol['代码']] = oneSymbol[byKey]
                symbolsDitCount[oneSymbol['代码']] = 1
            } else {
                symbolsDit[oneSymbol['代码']] += oneSymbol[byKey]
                symbolsDitCount[oneSymbol['代码']] += 1
            }
        }
    }
    for (var key in symbolsDit) {
        symbolsDit[key] = symbolsDit[key] / symbolsDitCount[key]
    }
    symbolsDitCount = null
    return symbolsDit
}

//转换成完整的股票代码
export function symbolFull(symbol) {
    if (symbol.indexOf('.') != -1) {
        return symbol
    }
    var houzui = ['.SZ', '.SH', '.BJ']
    for (var i = 0; i < houzui.length; i++) {
        var end = houzui[i]
        if (allSymbolDit[symbol + end] != null) {
            symbol = symbol + end
            break
        }
    }
    return symbol
}

function getJinJiaData(dayKey, params) {
    var filePathDirByjinjia = DataFolder + '/jiheJinjiaV2/' + moment(dayKey).format('YYYYMMDD')
    if (tradeDateDit[dayKey] != null && fs.existsSync(filePathDirByjinjia)) {
        var filePath = filePathDirByjinjia + '/' + params.symbol
        // if (fs.existsSync(filePath + '.lzstr')) {
        //     filePath = filePath + '.lzstr'
        // } else {
        //     filePath = filePath + '.json'
        // }
        var arr = getDataFromCache(filePath)
        // console.log('getJinJiaData arr',filePath, arr)
        if (arr != null) {
            arr = arr.map((item) => {
                var row = item.split(',').map((value, index) => {
                    if (index == 0) {
                        //时间规则化为带秒数的格式
                        return '0' + value[0] + ':' + value.substr(1, 2) + ':' + value.substr(3, 2)
                    } else {
                        if (value == '') {
                            value = '0'
                        }
                        return Number(value)
                    }
                })
                return row
            })
        } else {
            //为空是正常出现的情况，不用打印控制台
            // console.warn('filePath 数据为空', filePath)
        }
        // console.log('getJinJiaData arr', arr)
        return arr
    }
}

//获取k线图的方法
export function getKLine(params) {
    if (fs == null) {
        return []
    }
    if (params == null) {
        params = {
            "symbol": "000858.SZ",
            "start_date": "20240101",
            "end_date": "20240606"
        }
    }
    var addCount = 0
    if (params.symbol != null) {
        params.symbol = symbolFull(params.symbol)
    }
    params.start_date = moment(params.start_date).format('YYYY-MM-DD')
    params.end_date = moment(params.end_date).format('YYYY-MM-DD')
    // console.log('getKLine params', params)
    var start_date = params.start_date
    var endDate = moment(params.end_date)
    var dataArr = []
    // console.log("moment(start_date).add(addCount, 'days').diff(endDate)", moment(start_date).add(addCount, 'days').diff(endDate))
    while (moment(start_date).add(addCount, 'days').diff(endDate) <= 0) {
        var dayKey = moment(start_date).add(addCount, 'days').format("YYYY-MM-DD");
        if (params.period == 'daily') {
            var filePath = DataFolder + '/dapanData/' + dayKey + '.json'
            if (tradeDateDit[dayKey] != null) {
                var data = getDataFromCache(filePath)
                if (data != null) {
                    var findeData = data.find((item) => {
                        return symbolFull(item['代码']) == params.symbol
                    })
                    if (findeData != null) {
                        findeData['日期'] = dayKey
                        if (findeData['今开'] != null) {
                            findeData['开盘'] = findeData['今开']
                            delete findeData['今开']
                        }
                        dataArr.push(findeData)
                        findeData = null
                    }
                    data = null
                }
            }
        } else if (params.period == '5') {
            //5分钟k线获取
            // var filePathDir = DataFolder + '/fiveMinData/' + dayKey
            // if(fs.existsSync(filePathDir) == null){
            //     filePathDir = DataFolder + '/fiveMinData/' + moment(dayKey).format("YYYYMMDD")
            // }
            // if (tradeDateDit[dayKey] != null && fs.existsSync(filePathDir)) {
            //     var dirResult = fs.readdirSync(filePathDir)
            //     // var symbolDit = {}
            //     // symbolDit[params.symbol] = 1
            //     // var oneMinData = getOneDayMinData(dayKey, 1, symbolDit, {avePrice: "均价", timeDit: true})

            //     for (var i = 0; i < dirResult.length; i++) {
            //         var filePath = filePathDir + '/' + dirResult[i]
            //         var time = dirResult[i].split('.')[0].replace('_', ':')
            //         var data = getDataFromCache(filePath)
            //         var findeData = data.find((item) => {
            //             return item['代码'] == params.symbol
            //         })
            //         if (findeData != null) {
            //             findeData['时间'] = dayKey + ' ' + time
            //             var upClose = findeData['开盘']
            //             if (dataArr.length > 0) {
            //                 upClose = dataArr[dataArr.length - 1]['收盘']
            //             }
            //             findeData['涨跌额'] = findeData['收盘'] - upClose
            //             findeData['涨跌幅'] = fourRoundToDecimals((findeData['涨跌额'] / upClose) * 100, 2)
            //             // if(oneMinData[params.symbol] != null){
            //             //     if(oneMinData[params.symbol][time] != null){
            //             //         findeData['均价'] = oneMinData[params.symbol][time]['均价']
            //             //     }
            //             // }
            //             dataArr.push(findeData)
            //         }
            //         data = null
            //     }
            //     dirResult = null
            // }
            

            //5分钟的k线数据应该可以由1分钟生成
            params.period = '1'
            params.jinjia = false
            // console.log("直接从1分钟数据生成5分钟数据", params)
            var oneMinDataArr = getKLine(params)
            var newArr = convertOneMinDataTo(5, oneMinDataArr)
            oneMinDataArr = null
            return newArr
        } else if (params.period == '1') {
            //同时获取集合竞价数据
            if (params.jinjia == true) {
                var jinjiaArr = getJinJiaData(dayKey, params)
                if (jinjiaArr != null) {
                    fixedVolume(jinjiaArr, DataType.JiheJinjia)
                    jinjiaArr = jinjiaArr.map(convertJinjiaDataToOneMinData)
                    //给时间加上日期
                    jinjiaArr.forEach(obj => {
                        obj['时间'] = dayKey + ' ' + obj['时间']
                    });
                    // console.log('转换之后的竞价数据', jinjiaArr)
                    dataArr = dataArr.concat(jinjiaArr)
                }
            }
            //1分钟k线获取
            var filePathDir = DataFolder + '/oneMinData/' + moment(dayKey).format('YYYYMMDD')
            if (tradeDateDit[dayKey] != null && fs.existsSync(filePathDir)) {
                var filePath = filePathDir + '/' + params.symbol
                var arr = getDataFromCache(filePath)
                // console.log('获取到1分钟的数据', arr)
                if (arr != null) {
                    arr = arr.map((item) => {
                        var row = item.split(',').map((value, index) => {
                            if (index == 0) {
                                return value
                            } else {
                                return Number(value)
                            }
                        })
                        var obj = {}
                        row[OneMinDataKeyIndex['时间']] = dayKey + ' ' + row[OneMinDataKeyIndex['时间']]
                        for (var key in OneMinDataKeyIndex) {
                            obj[key] = row[OneMinDataKeyIndex[key]]
                        }
                        return obj
                    })
                    // console.log( '第一个数据是？',arr[0])
                    if(arr[0] != null ){
                        if(arr[0]['时间'] != null){
                            if(arr[0]['时间'].split(' ').pop() == '09:30'){
                                // console.log('第一个时间是09:30')
                                arr.splice(0, 1) //删除9:30分的数据
                            }
                        }
                    }
                    // console.log('1分钟的分时数据', arr)
                    fixedVolume(arr, DataType.OneMinData)
                    // console.log('获取到1分钟的数据',dayKey, arr)
                    dataArr = dataArr.concat(arr)
                }
            }
        }
        addCount += 1
    }
    addCount = null
    start_date = null
    endDate = null
    params = null
    return dataArr
}

//封装处理所有url请求，其中包含桌面端版本的本地请求
export async function getQueryUrl(api, params) {
    var response = null
    var url = 'localFile' + api
    //暂时只从本地获取数据
    //先兼容一下旧版本的
    // console.log('window.location ', window.location.href.indexOf('codeGupiao') != -1)
    if(window.location.href.indexOf('codeGupiao') != -1){
        url = GlobalConfig.serverBase + api
    }
    console.log('getQueryUrl', url)
    //  GlobalConfig.serverBase
    if (url.indexOf('http') == 0) {
         if (params != null) {
            response = await axios.get(url, { params: params }); // 将data作为参数传递到API接口
        } else {
            response = await axios.get(url)
        }
    } else {
        //暂时只有获取日k和分时信息的
        if (api == stock_zh_a_hist || api == stock_zh_a_hist_min_em) {
            var data = getKLine(params)
            response = { status: 200, data: data }
        }
    }
    if (response.status == 200) {
        return { error: null, data: response.data }
    } else {
        return { error: '查询失败，请检查接口是否正常', data: null }
    }
}


export async function GetNextDaysDataDeal(first_date, day, symbolArr) {
    if (readDailyUsingDb) {
        return await GetNextDaysDataDB(first_date, day, symbolArr)
    } else {
        return GetNextDaysData(first_date, day, strArrToDit(symbolArr))
    }
}

//获取大盘从某一天起后N天的数据，如果传入symbols则获取指定symbol的数据，否则返回所有
export function GetNextDaysData(first_date, day, symbolsDit) {
    var dataArr = []
    var dateArr = []
    if (fs == null) {
        return { dataArr, dateArr }
    }

    var addCount = 0
    // console.log('准备读取', first_date, day)
    while (dataArr.length < day && addCount < 365) {
        var dayKey = null
        if (first_date != null) {
            dayKey = moment(first_date).add(addCount, 'days').format("YYYY-MM-DD");
        } else {
            dayKey = moment('2024-01-01').add(addCount, 'days').format("YYYY-MM-DD");
        }

        if (tradeDateDit[dayKey] != null) {
            dateArr.push(dayKey)
            var filePath = DataFolder + '/dapanData/' + dayKey + '.json'
            var data = getDataFromCache(filePath) //JSON.parse(fs.readFileSync(filePath))
            if (data != null) {
                if (symbolsDit != null) {
                    dataArr.push(data.filter((item) => {
                        return symbolsDit[symbolFull(item['代码'])] != null
                    }))
                } else {
                    dataArr.push(data)
                }
                data = null
            }
        } else {
            // console.log('非交易日', dayKey)
        }
        dayKey = null
        addCount += 1
    }
    return { dataArr, dateArr }
}

//获取更多的天数DB
export async function GetNextDaysDataDB(first_date, day, symbolArr) {
    var dataArr = []
    var dateDit = {}
    var start_date = GetNextDay(first_date, day)
    if (symbolArr == null) {
        symbolArr = Object.keys(allSymbolDit)
    }
    var arg = { api: 'sqlite', params: { symbols: symbolArr, adjust: 'qfq', period: 'daily', start_date: first_date, end_date: start_date, needLabel: true } }
    // console.log('准备查询的params', arg.params)
    var symbolDit = null
    if (isInTool == false) {
        symbolDit = ipcCallAsync(arg)
        //    console.log('请求到的结果', arr)
    } else {
        sqlCrateTables.initDb({ 'dbName': DataFolder + '/' + 'dapanData.db' })
        symbolDit = await sqlCrateTables.queryData(arg.params)
    }
    for (var symbol in symbolDit) {
        for (var i = 0; i < symbolDit[symbol].length; i++) {
            var oneRow = symbolDit[symbol][i]
            if (dateDit[oneRow['日期']] == null) {
                dateDit[oneRow['日期']] = []
            }
            dateDit[oneRow['日期']].push(oneRow)
        }
    }
    var dateArr = Object.keys(dateDit)
    dateArr.sort((a, b) => {
        return moment(b).diff(moment(a), 'days')
    })
    for (var i = 0; i < dateArr.length; i++) {
        dataArr.push(dateDit[dateArr[i]])
    }
    // console.log('symbolDit', symbolDit)
    return { dataArr, dateArr }
}


//检查是否是在交易时间
export function CheckIsInJiaoyiTime(first_date, day) {
    if (day > 0) {
        day = day - 1
    }
    var dayKey = moment(first_date).add(day, 'day')
    if (moment().format('YYYY-MM-DD') == dayKey) {
        if (moment().isAfter(moment(dayKey + ' 09:15:00')) && moment().isBefore(moment(dayKey + ' 11:30:00'))) {
            return true
        }
        if (moment().isAfter(moment(dayKey + ' 13:00:00')) && moment().isBefore(moment(dayKey + ' 15:00:00'))) {
            return true
        }
        return false
    }
    return false
}



//获某个日期往后n个交易日的日期,输入【1，+999】，其中1就是first_date
export function GetNextDay(first_date, day) {
    day -= 1     //第1天就是当天，直接返回就行了，这里要确保first_date一定是交易日
    var addCount = 1
    var toggleCount = 0
    var findDate = first_date
    while (toggleCount < day && addCount < 365) {
        var dayKey = moment(first_date).add(addCount, 'days').format("YYYY-MM-DD");
        if (tradeDateDit[dayKey] != null) {
            toggleCount += 1
            if (toggleCount == day) {
                findDate = dayKey
            }
        }
        addCount += 1
    }
    return findDate
}

//等待某一天的数据更新
async function awaitOneDayDataUpdate() {
    return new Promise((resolve, reject) => {
        //等待事件回调
        onOneDayDataUpdateCb.push(()=>{
            resolve(true)
        })
    })
}

//检查是否是有数据的日期，如果是未来日期还没有产生交易数据也会触发
//理论上如果addCount超过365天，就是没有有效日期了
export async function CheckVaildDate(first_date, day, isWaitingMode) {
    // console.log('调用了CheckVaildDate')
    day -= 1     //第1天就是当天，直接返回就行了，这里要确保first_date一定是交易日
    var addCount = 1
    var toggleCount = 0
    var findDate = first_date
    while (toggleCount < day && addCount < 365) {
        var dayKey = moment(first_date).add(addCount, 'days').format("YYYY-MM-DD");
        if (tradeDateDit[dayKey] != null) {
            toggleCount += 1
            if (toggleCount == day) {
                findDate = dayKey
            }
        }
        addCount += 1
    }
    var isFeatureDay = false
    if (addCount >= 365 || moment().diff(moment(first_date), 'days') < 0) {
        isFeatureDay = true
    } else {
        if (moment(findDate).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD') && tradeDateDit[findDate] == null) {
            //是当天，但是当天还没有加载数据（还未收盘），所以也算是未来日期
            isFeatureDay = true
        }
    }
    // console.log('tradeDateDit', tradeDateDit)
    // console.log('CheckVaildDate', { isFeatureDay: isFeatureDay, addCount: addCount, findDate: findDate, hasData: tradeDateDit[findDate] })
    if(isFeatureDay == true){
        //是未来日期，返回false
        if(isWaitingMode == true){
            await awaitOneDayDataUpdate()
            return CheckVaildDate(first_date, day)  //会一直等待，直到等到有效日期
        }else{
            return false //等待，直到日期有效
        }
    }else {
        //不是未来日期返回true
        return true
    }
}



//等待有效时间到来
export async function CheckVaildMinTime(params) {
    
}


//获某个日期往前n个交易日的日期，输入【1，+999】，其中1是first_date
export function GetUpDay(first_date, day) {
    var addCount = 1
    var toggleCount = 0
    var findDate = first_date
    while (toggleCount < day && addCount < 365) {
        var dayKey = moment(first_date).subtract(addCount, 'days').format("YYYY-MM-DD");
        if (tradeDateDit[dayKey] != null) {
            toggleCount += 1
            if (toggleCount == day) {
                findDate = dayKey
            }
        }
        addCount += 1
    }
    return findDate
}


export async function GetUpperDaysDataDeal(first_date, day, symbolArr, config) {
    if (readDailyUsingDb) {
        return await GetUpperDaysDataDB(first_date, day, symbolArr, config)
    } else {
        return GetUpperDaysData(first_date, day, strArrToDit(symbolArr), config)
    }
}

//获取大盘从某一天起往前N天的数据，如果传入symbols则获取指定symbol的数据，否则返回所有
export function GetUpperDaysData(first_date, day, symbolsDit) {
    var dataArr = []
    var dateArr = []
    if (fs == null) {
        return { dataArr, dateArr }
    }
    // var fs = window.require('fs')

    var delCount = 0
    // console.log('准备读取', first_date, day)
    while (dataArr.length < day && delCount < 365) {
        var dayKey = null
        if (first_date != null) {
            dayKey = moment(first_date).subtract(delCount, 'days').format("YYYY-MM-DD");
        } else {
            dayKey = moment('2024-01-01').subtract(delCount, 'days').format("YYYY-MM-DD");
        }

        if (tradeDateDit[dayKey] != null) {
            let filePath = DataFolder + '/dapanData/' + dayKey + '.json'
            dateArr.push(dayKey)
            var data = getDataFromCache(filePath) //JSON.parse(fs.readFileSync(filePath))
            if (data != null) {
                if (symbolsDit != null) {
                    dataArr.push(data.filter((item) => {
                        item['代码'] = symbolFull(item['代码'])
                        return symbolsDit[item['代码']] != null
                    }))
                } else {
                    dataArr.push(data)
                }
                data = null
            }
            filePath = null
        } else {
            // console.log('非交易日', dayKey)
        }
        delCount += 1
    }
    return { dataArr, dateArr }
}


export async function GetUpperDaysDataDB(first_date, day, symbolArr, config) {
    var dataArr = []
    var dateDit = {}
    var start_date = GetUpDay(first_date, day - 1)
    if (symbolArr == null) {
        symbolArr = Object.keys(allSymbolDit)
    }
    var arg = { api: 'sqlite', params: { symbols: symbolArr, adjust: 'qfq', period: 'daily', start_date: start_date, end_date: first_date, needLabel: true } }
    if (config != null) {
        if (config.select != null) {
            //传入需要选择的key，减少读取数据量
            arg.params.select = config.select
        }
    }
    // console.log('准备查询的params', arg.params)
    var symbolDit = null
    if (isInTool == false) {
        symbolDit = ipcCallAsync(arg)
        //    console.log('请求到的结果', arr)
    } else {
        sqlCrateTables.initDb({ 'dbName': DataFolder + '/' + 'dapanData.db' })
        symbolDit = await sqlCrateTables.queryData(arg.params)
    }
    for (var symbol in symbolDit) {
        for (var i = 0; i < symbolDit[symbol].length; i++) {
            var oneRow = symbolDit[symbol][i]
            if (dateDit[oneRow['日期']] == null) {
                dateDit[oneRow['日期']] = []
            }
            dateDit[oneRow['日期']].push(oneRow)
        }
    }
    var dateArr = Object.keys(dateDit)
    dateArr.sort((a, b) => {
        return moment(b).diff(moment(a), 'days')
    })
    for (var i = 0; i < dateArr.length; i++) {
        dataArr.push(dateDit[dateArr[i]])
    }
    // console.log('symbolDit', symbolDit)
    return { dataArr, dateArr }
}

//获取某一年的交易天数
export function getTradeDateArr(year) {
    if (fs == null) {
        return []
    }
    // var fs = window.require('fs')
    var filePath = DataFolder + '/trade_dates/' + year + '.json'
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath))
    } else {
        return []
    }
}

//获取指数数据
export function getZhishuData(symbol) {
    if (fs == null) {
        return []
    }
    var filePath = DataFolder + '/zhishushuju/' + symbol + '.json'
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath))
    } else {
        return []
    }
}

//获取大盘某一天的数据，如果传入symbols则获取指定symbol的数据，否则返回所有
//获取的是以传入日期为开始日期，获取第n个交易日的数据
//config可以携带额外获取配置的选项
//  .maPriceArr ['MA_5']    获取额外的均价数据
//  .maVolArr  ['MAVol_5']  获取额外的均量数据
// 如果传入的day是负数，将选取first_date往前交易日的数据，-1为往前1个交易日的数据
export async function getOneDayDataDeal(first_date, day, symbolArr, config) {
    if (readDailyUsingDb) {
        if (symbolArr.length < 500) {
            // console.log('symbolArr 数量小于500，使用db', first_date, day)
            return await getOneDayDataDB(first_date, day, symbolArr, config)
        } else {
            //还是使用文件系统
            var time = new Date().getTime()
            var result = getOneDayData(first_date, day, strArrToDit(symbolArr), config)
            console.log('symbolArr 数量大于500，直接读取文件文件', (new Date().getTime() - time) + 'ms')
            return result
        }
    } else {
        return getOneDayData(first_date, day, strArrToDit(symbolArr), config)
    }
}

export async function getOneDayData(first_date, day, symbolsDit, config) {
    var arr = []
    if (fs == null) {
        return arr
    }
    // var dayKey = moment(first_date).format('YYYY-MM-DD')
    // var filePath = DataFolder + '/dapanData/' + first_date + '.json'

    var addCount = 0    //addCount是防止陷入死循环
    var getDataDayLength = 0
    var addStep = 1
    if (day < 0) {
        addStep = -1
    }
    while (getDataDayLength < Math.abs(day) && Math.abs(addCount) < 1000) {
        var dayKey = null
        if (first_date != null) {
            dayKey = moment(first_date).add(addCount, 'days').format("YYYY-MM-DD");
        } else {
            dayKey = moment('2024-01-01').add(addCount, 'days').format("YYYY-MM-DD");
        }
        if (tradeDateDit[dayKey] != null) {
            var filePath = DataFolder + '/dapanData/' + dayKey + '.json'
            getDataDayLength += 1
            if (getDataDayLength == Math.abs(day)) {
                // console.log('获取到这一天的大盘数据', first_date, day, filePath)
                arr = getDataFromCache(filePath)//JSON.parse(fs.readFileSync(filePath))
                if (arr != null) {
                    if (symbolsDit != null) {
                        arr = arr.filter((item) => {
                            return symbolsDit[symbolFull(item['代码'])] != null
                        })
                    }
                    //给数据加上日期
                    for (var j = 0; j < arr.length; j++) {
                        arr[j]['日期'] = dayKey
                    }
                    if (config != null) {
                        //现在已经不需要计算了，已经包含了
                        // var maPriceArr = config.maPriceArr
                        // if(maPriceArr != null){
                        //     //同时获取均价
                        //     for(var i = 0; i < maPriceArr.length; i++){
                        //         var ma = maPriceArr[i]
                        //         var maDay = Number(ma.split('_')[1])
                        //         var maPriceDit = getMaPrice(dayKey, maDay, symbolsDit)
                        //         for(var j = 0; j < arr.length; j++){
                        //             arr[j][maPriceArr[i]] = maPriceDit[arr[j]['代码']]
                        //         }
                        //         maPriceDit = null
                        //         maDay = null
                        //         ma = null
                        //     }
                        //     maPriceArr = null
                        // }
                        var maVolArr = config.maVolArr
                        if (maVolArr != null) {
                            //同时获取均量
                            for (var i = 0; i < maVolArr.length; i++) {
                                var ma = maVolArr[i]
                                var maDay = Number(ma.split('_')[1])
                                var maPriceDit = await getMaVolume(dayKey, maDay, Object.keys(symbolsDit))
                                for (var j = 0; j < arr.length; j++) {
                                    arr[j][maVolArr[i]] = maPriceDit[arr[j]['代码']]
                                }
                                maPriceDit = null
                                maDay = null
                                ma = null
                            }
                            maVolArr = null
                        }
                    }
                } else {
                    arr = []
                    console.log('文件缺失', filePath)
                }
            }
        } else {
            // console.log('非交易日', dayKey)
        }
        addCount += addStep
    }
    return arr
}


//这里的call仅仅针对数据库操作接口
export async function ipcCallGetQuery(sendData) {
    return new Promise((resolve, reject) => {
        if (window.require != null) {
            var { ipcRenderer } = window.require('electron')
            var listener = (event, arg) => {
                console.log('收到了getQueryResult返回的arg', arg)
                if (arg.data.error != null) {
                    console.log('获取QueryResult出错', arg)
                    // reject(arg.data.error)
                    resolve(null)
                } else {
                    if(arg.data.data != null){
                        resolve(arg.data.data)
                    }else{
                        resolve(arg.data)
                    }
                }
                ipcRenderer.removeListener('getQueryResult', listener);
            };
            ipcRenderer.on('getQueryResult', listener)
            ipcRenderer.sendSync('getQueryUrlByWorker', sendData)
        }
    })
}

function ipcCallAsync(sendData) {
    if (window.require != null) {
        var { ipcRenderer } = window.require('electron')
        // console.log('发送的阐述', JSON.stringify(sendData))
        var result = ipcRenderer.sendSync('getQueryUrl', sendData)
        if (result.error != null) {
            console.log('result.error：', result.error)
        }
        if (result.timecost != null) {
            console.log("读取db timecost", result.timecost)
        }
        // console.log('result', result.data)
        return result.data
    }
    return null
}

//从数据库获取某一天的日期
export async function getOneDayDataDB(first_date, day, symbolArr, config) {
    var date = null
    var arr = []
    if (day > 0) {
        date = GetNextDay(first_date, day)
    } else if (day < 0) {
        date = GetUpDay(first_date, Math.abs(day))
    }
    // console.log("请求的date", date)
    var arg = { api: 'sqlite', params: { symbols: symbolArr, adjust: 'qfq', period: 'daily', start_date: date, end_date: date, needLabel: true } }
    if (config != null) {
        if (config.select != null) {
            //传入需要选择的key，减少读取数据量
            arg.params.select = config.select
        }
    }
    var symbolDit = null
    if (isInTool == false) {
        symbolDit = ipcCallAsync(arg)
        // symbolDit = await ipcCallGetQuery(arg)
        //    console.log('请求到的结果', JSON.stringify(symbolDit))
    } else {
        var time = new Date().getTime()
        sqlCrateTables.initDb({ 'dbName': DataFolder + '/' + 'dapanData.db' })
        symbolDit = await sqlCrateTables.queryData(arg.params)
        var costtime = (new Date().getTime() - time)
        if (costtime > 200) {
            console.log('查询日k数据' + symbolArr.length + '个 costtime', costtime + 'ms')
        }
    }
    for (var symbol in symbolDit) {
        //查询一天的话应该只有一天的数据
        if (symbolDit[symbol][0] != null) {
            arr.push(symbolDit[symbol][0])
        }
    }
    if (config != null) {
        //现在已经不需要计算了，已经包含了
        var maPriceArr = config.maPriceArr
        if (maPriceArr != null) {
            //同时获取均价
            for (var i = 0; i < maPriceArr.length; i++) {
                var ma = maPriceArr[i]
                var maDay = Number(ma.split('_')[1])
                var maPriceDit = await getMaPrice(date, maDay, symbolArr)
                // console.log('maPriceDit', maPriceDit)
                for (var j = 0; j < arr.length; j++) {
                    arr[j][maPriceArr[i]] = maPriceDit[arr[j]['代码']]
                }
                maPriceDit = null
                maDay = null
                ma = null
            }
            maPriceArr = null
        }
        var maVolArr = config.maVolArr
        if (maVolArr != null) {
            //同时获取均量
            for (var i = 0; i < maVolArr.length; i++) {
                var ma = maVolArr[i]
                var maDay = Number(ma.split('_')[1])
                var maPriceDit = await getMaVolume(date, maDay, symbolArr)
                for (var j = 0; j < arr.length; j++) {
                    arr[j][maVolArr[i]] = maPriceDit[arr[j]['代码']]
                }
                maPriceDit = null
                maDay = null
                ma = null
            }
            maVolArr = null
        }
    }
    // console.log('getOneDayDataDB', arr)
    return arr
}

//获取集合竞价的数据    //旧版本，现在不用了
export function getJihejinjiaData(first_date, day, symbolsDit, config) {
    var obj = {}
    if (fs == null) {
        return obj
    }
    // var dayKey = moment(first_date).format('YYYY-MM-DD')
    // var filePath = DataFolder + '/dapanData/' + first_date + '.json'

    var addCount = 0    //addCount是防止陷入死循环
    var getDataDayLength = 0
    while (getDataDayLength < day && addCount < 365) {
        var dayKey = null
        if (first_date != null) {
            dayKey = moment(first_date).add(addCount, 'days').format("YYYY-MM-DD");
        } else {
            dayKey = moment('2024-01-01').add(addCount, 'days').format("YYYY-MM-DD");
        }
        if (tradeDateDit[dayKey] != null) {
            getDataDayLength += 1
            if (getDataDayLength == day) {
                var folderPath = DataFolder + '/jihejinjia/' + dayKey
                var fileList = []
                if (fs.existsSync(folderPath)) {
                    fileList = fs.readdirSync(folderPath)
                }
                // console.log('获取到这一天的大盘数据', first_date, day, filePath)
                for (var i = 0; i < fileList.length; i++) {
                    var oneArr = getDataFromCache(folderPath + '/' + fileList[i])//JSON.parse(fs.readFileSync(filePath))

                    var time = fileList[i].split('.')[0]
                    var tiemArr = time.split("_")

                    if (oneArr != null) {
                        if (symbolsDit != null) {
                            oneArr = oneArr.filter((item) => {
                                return symbolsDit[item['代码']] != null
                            })
                        }
                        // if(oneArr.length != 0){
                        //     console.log(time + ' oneArr', oneArr)
                        // }
                        for (var j = 0; j < oneArr.length; j++) {

                            var price = oneArr[j]['买1']    //默认以买1价为准
                            if (price == null) {
                                price = oneArr[j]['卖1']
                            }
                            if (price == null) {
                                price = oneArr[j]['现价']
                            }

                            if (obj[oneArr[j]['代码']] == null) {
                                obj[oneArr[j]['代码']] = {}
                            }
                            if (tiemArr[1] == '20') {
                                obj[oneArr[j]['代码']]['firstPrice'] = price
                            } else if (tiemArr[1] == '24') {
                                obj[oneArr[j]['代码']]['lastUpPrice'] = price
                            } else if (tiemArr[1] == '25') {
                                obj[oneArr[j]['代码']]['lastPrice'] = price
                            }
                            price = null
                        }
                    } else {
                        console.log('文件缺失', fileList[i])
                    }
                    time = null
                    tiemArr = null
                    oneArr = null
                }
                fileList = null
                folderPath = null
            }
        } else {
            // console.log('非交易日', dayKey)
        }
        addCount += 1
    }
    return obj
}

// getJinJiaData
export function getJihejinjiaDataV2(first_date, day, symbolsDit, config) {
    var obj = {}
    if (fs == null) {
        return obj
    }
    // var dayKey = moment(first_date).format('YYYY-MM-DD')
    // var filePath = DataFolder + '/dapanData/' + first_date + '.json'

    var addCount = 0    //addCount是防止陷入死循环
    var getDataDayLength = 0
    while (getDataDayLength < day && addCount < 365) {
        var dayKey = null
        if (first_date != null) {
            dayKey = moment(first_date).add(addCount, 'days').format("YYYY-MM-DD");
        } else {
            dayKey = moment('2024-01-01').add(addCount, 'days').format("YYYY-MM-DD");
        }
        if (tradeDateDit[dayKey] != null) {
            getDataDayLength += 1
            if (getDataDayLength == day) {
                for (var symbol in symbolsDit) {
                    var arr = getJinJiaData(dayKey, { symbol: symbol })
                    if (arr != null) {
                        fixedVolume(arr, DataType.JiheJinjia)
                        arr = arr.map(convertJinjiaDataToOneMinData)
                        if (config != null && config.timeDit == true) {
                            //使用时间节点
                            obj[symbol] = {}
                            // var timeOptions = []
                            arr.forEach(row => {
                                var timeKey = row['时间']
                                // timeOptions.push({value: timeKey, label: timeKey})
                                obj[symbol][timeKey] = row
                            });
                            // fs.writeFileSync(DataFolder + '/jiheJinJiaTimeOption.json', JSON.stringify(timeOptions))
                        } else {
                            obj[symbol] = arr
                        }
                    }
                }
            }
        } else {
            // console.log('非交易日', dayKey)
        }
        addCount += 1
    }
    return obj
}


//缓存一下最近查询到的数据，某些情况下会多次循环调用
export var queryCache = {}
export var queryCacheKeyArr = []

function pushDataToCache(url, data) {
    if (queryCache[url] == null) {
        queryCache[url] = data
        queryCacheKeyArr.push(url)
        //超过一定数量就清除掉旧的数据
        if (queryCacheKeyArr.length > 100) {
            var delUrl = queryCacheKeyArr.splice(0, 1)[0]
            queryCache[delUrl] = null
            delete queryCache[delUrl]
        }
    }
}

function getDataFromCache(url) {
    if (queryCache[url] != null) {
        // console.log('从cache中获取了数据', url)
        return queryCache[url]
    }
    var realFileUrl = url
    var exName = url.split('.')
    exName = exName[exName.length - 1] 
    
    if(exName == 'json' || exName == 'lzstr'){
        realFileUrl = url
    }else if(fs.existsSync(url + '.json') == true){
         realFileUrl = url + '.json'
    }else if(fs.existsSync(url + '.lzstr') == true){
        realFileUrl = url + '.lzstr'
    }
    if (fs.existsSync(realFileUrl)) {
        var exname = realFileUrl.split('.')
        var str = ''
        if (exname[exname.length - 1] == 'lzstr') {
            str = LZString.decompress(fs.readFileSync(realFileUrl, 'utf16le'))
        } else {
            str = fs.readFileSync(realFileUrl)
        }
        var jsonData = JSON.parse(str)
        pushDataToCache(url, jsonData)
        exname = null
        str = null
        return jsonData
    }
    return null
}


//转换一分钟数据到
function convertOneMinDataTo(nMin, oneMinDataArr){
    var newArr = []
    var tempArr = []
    
    var oneRowIsArr = false
    if(oneMinDataArr.length == 0){
        return []
    }
    if(Array.isArray(oneMinDataArr[0]) == true){
        oneRowIsArr = true  //是数组类型的数据
    }
    // OneMinDataKeyIndex
    // '时间': 0,
    // '开盘': 1,
    // '收盘': 2,
    // '最高': 3,
    // '最低': 4,
    // '成交量': 5,
    // '成交额': 6,
    // '涨幅': 7,  //可能为空
    // '振幅': 8,  //可能为空
    // '均价': 9, //每次获取时计算
    // '换手率': 10,   //1分钟的分时数据暂时没有此选项
    
    for(var i = 0; i < oneMinDataArr.length; i++){
        tempArr.push(oneMinDataArr[i])
        if(tempArr.length == nMin || i == oneMinDataArr.length - 1){
            //已经有五分中数据了，合成
            var newMinData 
            if(oneRowIsArr){
                newMinData = [
                    tempArr[tempArr.length - 1][OneMinDataKeyIndex['时间']],
                    tempArr[0][OneMinDataKeyIndex['开盘']],
                    tempArr[tempArr.length - 1][OneMinDataKeyIndex['收盘']],
                    tempArr[0][OneMinDataKeyIndex['最高']],
                    tempArr[0][OneMinDataKeyIndex['最低']],
                    tempArr[0][OneMinDataKeyIndex['成交量']],
                    tempArr[0][OneMinDataKeyIndex['成交额']]
                ]
                for(var j = 0; j < tempArr.length; j++){
                    var oneMinData = tempArr[j]
                    newMinData[OneMinDataKeyIndex['成交量']] += oneMinData[OneMinDataKeyIndex['成交量']]
                    newMinData[OneMinDataKeyIndex['成交额']] += oneMinData[OneMinDataKeyIndex['成交额']]
                    if(oneMinData[OneMinDataKeyIndex['最高']] > newMinData[OneMinDataKeyIndex['最高']]){
                        newMinData[OneMinDataKeyIndex['最高']] = oneMinData[OneMinDataKeyIndex['最高']]
                    }
                    if(oneMinData[OneMinDataKeyIndex['最低']] < newMinData[OneMinDataKeyIndex['最低']]){
                        newMinData[OneMinDataKeyIndex['最低']] = oneMinData[OneMinDataKeyIndex['最低']]
                    }
                }
            }else{
                newMinData = {'时间': tempArr[tempArr.length - 1]['时间'], '开盘': tempArr[0]['开盘'], '最高': tempArr[0]['最高'], '最低': tempArr[0]['最低'], '收盘': tempArr[tempArr.length - 1]['收盘'], '成交量': 0, '成交额': 0}
                for(var j = 0; j < tempArr.length; j++){
                    var oneMinData = tempArr[j]
                    newMinData['成交量'] += oneMinData['成交量']
                    newMinData['成交额'] += oneMinData['成交额']
                    if(oneMinData['最高'] > newMinData['最高']){
                        newMinData['最高'] = oneMinData['最高']
                    }
                    if(oneMinData['最低'] < newMinData['最低']){
                        newMinData['最低'] = oneMinData['最低']
                    }
                }
            }   
            
            newArr.push(newMinData)
            tempArr = []
        }
    }
    return newArr
}

//获取大盘某一天的分时数据(5分钟的)
//现在的获取顺序 有旧版数据 获取旧版数据，如果旧版数据没有-》 有新版数据获取新版数据-〉如果新版数据也不存在-》获取一分钟数据-〉如果一分钟数据也咩呦就没有了
export function getOneDayMinData(first_date, day, symbolsDit, config) {
    var minDataDit = {}
    if (fs == null) {
        return minDataDit
    }

    var addCount = 0    //addCount是防止陷入死循环
    var getDataDayLength = 0

    while (getDataDayLength < day && addCount < 365) {
        var dayKey = null
        if (first_date != null) {
            dayKey = moment(first_date).add(addCount, 'days').format("YYYY-MM-DD");
        } else {
            dayKey = moment('2024-01-01').add(addCount, 'days').format("YYYY-MM-DD");
        }
        if (tradeDateDit[dayKey] != null) {
            getDataDayLength += 1
            if (getDataDayLength == day) {
                var dirResult = []
                // console.log('dirResult', dirResult)
                var junjiaDit = {}
                var getFromOneMinData = false
                var filePathDir = DataFolder + '/fiveMinData/' + dayKey
                var dataType = 'allSymbolInOne'
                if(fs.existsSync(filePathDir) == true){
                    //如果传入这个表示只获取部分时间的数据，以免读取无用的文件
                    if (config.justTimes != null) {
                        dirResult = config.justTimes.map((item) => {
                            return item.replace(':', '_')
                        })
                    } else {
                        if (fs.existsSync(filePathDir)) {
                            dirResult = fs.readdirSync(filePathDir)
                        } else {
                            console.warn('文件夹不存在', filePathDir)
                        }
                    }
                }else{
                    filePathDir = DataFolder + '/fiveMinData/' + moment(dayKey).format('YYYYMMDD')
                    if (fs.existsSync(filePathDir)) {
                        dataType = 'allTimeInOne'
                        if(symbolsDit != null){
                            dirResult = Object.keys(symbolsDit).map((item)=>{
                                return item
                            })
                        }else{
                            dirResult = fs.readdirSync(filePathDir)
                        }
                    } else {
                        // console.warn('文件夹不存在', filePathDir)
                        //从一分钟数据获取并转换成五分钟数据
                        getFromOneMinData = true
                        var minDataDit = getOneDayMin1Data(first_date, day, symbolsDit) //不需要传入config，只要默认的就行了
                        for(var symbol in minDataDit){
                           minDataDit[symbol] = convertOneMinDataTo(5, minDataDit[symbol])
                        }
                        //计算均价
                        if (config != null) {
                            if (config.avePrice != null) {
                                for(var symbol in minDataDit){
                                    arr = minDataDit[symbol]
                                    var price = 0
                                    var volume = 0
                                    for (var j = 0; j < arr.length; j++) {
                                        price += arr[j][OneMinDataKeyIndex['成交额']]
                                        volume += arr[j][OneMinDataKeyIndex['成交量']]
                                        arr[j][OneMinDataKeyIndex['均价']] = price / volume
                                    }
                                    price = null
                                    volume = null
                                }
                            }
                            if(config.timeDit == true) {
                                for(var symbol in minDataDit){
                                    arr = minDataDit[symbol]
                                    var dit = {}
                                    arr.forEach(row => {
                                        var time = row[OneMinDataKeyIndex['时间']]
                                        //给时间数据加上日期
                                        // row[0] = dayKey + ' ' + row[0]
                                        dit[time.split(' ')[1]] = row
                                        time = null
                                    });
                                    minDataDit[symbol] = dit
                                }
                            } 
                        }
                        // console.log('准备将一分钟数据转换为5分钟数据', minDataDit)
                    }
                }
                
                
                //不是从一分钟数据获取的
                if(getFromOneMinData == false){
                    for (var i = 0; i < dirResult.length; i++) {
                        if (dirResult[i].indexOf('.') == 0) {
                            //是隐藏文件，跳过
                            continue
                        }
                        var filePath = filePathDir + '/' + dirResult[i]
                        var time = ''
                        if(dataType == 'allSymbolInOne'){
                            //time是文件的时间
                            time = dirResult[i].split('.')[0].replace('_', ':')
                        }
                        var arr = getDataFromCache(filePath) //JSON.parse(fs.readFileSync(filePath))
                        if (arr != null) {
                            if(dataType == 'allSymbolInOne'){
                                if (symbolsDit != null) {
                                    arr = arr.filter((item) => {
                                        return symbolsDit[item['代码']] != null
                                    })
                                }
                                //计算均价
                                if (config != null) {
                                    if (config.avePrice != null) {
                                        for (var j = 0; j < arr.length; j++) {
                                            var symbol = arr[j]['代码']
                                            if (junjiaDit[symbol] == null) {
                                                junjiaDit[symbol] = { price: arr[j]['成交额'], count: arr[j]['成交量'] }
                                            } else {
                                                junjiaDit[symbol].price += arr[j]['成交额']
                                                junjiaDit[symbol].count += arr[j]['成交量']
                                            }
                                            arr[j][config.avePrice] = junjiaDit[symbol].price / junjiaDit[symbol].count
                                        }
                                    }
                                }

                                //给数据加上日期
                                for (var j = 0; j < arr.length; j++) {
                                    arr[j]['时间'] = dayKey + ' ' + time
                                }

                                if (config != null && config.timeDit == true) {
                                    //仅仅返回指定时间的数据，当返回的是指定时间的数据时返回的是字典
                                    for (var j = 0; j < arr.length; j++) {
                                        if (minDataDit[arr[j]['代码']] == null) {
                                            minDataDit[arr[j]['代码']] = {}
                                        }
                                        minDataDit[arr[j]['代码']][time] = arr[j]
                                    }
                                } else {
                                    for (var j = 0; j < arr.length; j++) {
                                        if (minDataDit[arr[j]['代码']] == null) {
                                            minDataDit[arr[j]['代码']] = []
                                        }
                                        minDataDit[arr[j]['代码']].push(arr[j])
                                    }
                                }
                                arr = null

                            }else{
                                var symbol = dirResult[i]
                                if(symbol.indexOf('.json') != -1){
                                    symbol = symbol.replace('.json', '')
                                }
                                arr = arr.map((item) => {
                                    return item.split(',').map((value, index) => {
                                        if (index == 0) {
                                            return value
                                        } else {
                                            return Number(value)
                                        }
                                    })
                                })

                                // console.log('第一个时间是？', arr[0][0])

                                if(arr[0] != null && arr[0][0] == '09:30'){
                                    //删除
                                    arr.splice(0, 1) //删除9:30分的数据
                                }

                                fixedVolume(arr, DataType.OneMinData)

                                //计算均价
                                if (config != null) {
                                    if (config.avePrice != null) {
                                        var price = 0
                                        var volume = 0
                                        for (var j = 0; j < arr.length; j++) {
                                            price += arr[j][OneMinDataKeyIndex['成交额']]
                                            volume += arr[j][OneMinDataKeyIndex['成交量']]
                                            arr[j][OneMinDataKeyIndex['均价']] = price / volume
                                        }
                                        price = null
                                        volume = null
                                    }
                                }

                                //给数据加上日期
                                if (config != null && config.timeDit == true) {
                                        minDataDit[symbol] = {}
                                        arr.forEach(row => {
                                            var time = row[0]
                                            //给时间数据加上日期
                                            row[0] = dayKey + ' ' + row[0]
                                            minDataDit[symbol][time] = row
                                            time = null
                                        });
                                    } else {
                                        //给时间数据加上日期
                                        for (var j = 0; j < arr.length; j++) {
                                            arr[j][0] = dayKey + ' ' + arr[j][0]
                                        }
                                        minDataDit[symbol] = arr
                                    }
                                    arr = null
                                }
                        } else {
                            console.warn('文件不存在', filePath)
                        }

                    }
                }
               
                junjiaDit = null
                dirResult = null
            }
        }
        dayKey = null
        addCount += 1
    }
    addCount = null
    getDataDayLength = null
    return minDataDit
}

//本地保存的分时数据和集合竞价数据是不包含key的，要把数据加上key

//获取大盘某一天的1分钟分时数据
export function getOneDayMin1Data(first_date, day, symbolsDit, config) {
    var minDataDit = {}
    if (fs == null) {
        return minDataDit
    }
    var addCount = 0    //addCount是防止陷入死循环
    var getDataDayLength = 0
    while (getDataDayLength < day && addCount < 365) {
        var dayKey = null
        if (first_date != null) {
            dayKey = moment(first_date).add(addCount, 'days').format("YYYY-MM-DD");
        } else {
            dayKey = moment('2024-01-01').add(addCount, 'days').format("YYYY-MM-DD");
        }
        if (tradeDateDit[dayKey] != null) {
            getDataDayLength += 1
            if (getDataDayLength == day) {
                var filePathDir = DataFolder + '/oneMinData/' + moment(dayKey).format('YYYYMMDD')
                // console.log('开始获取dir', filePathDir)
                var dirResult = Object.keys(symbolsDit)
                for (var i = 0; i < dirResult.length; i++) {
                    //  dirResult[i]
                    var symbol = dirResult[i]
                    var filePath = filePathDir + '/' + symbol
                    // if (fs.existsSync(filePath + '.lzstr')) {
                    //     filePath = filePath + '.lzstr'
                    // } else {
                    //     filePath = filePath + '.json'
                    // }
                    //获取一个symbol一天的分时数据
                    var arr = getDataFromCache(filePath)
                    if (arr != null) {
                        //其实数据都不需要带key的，只需要知道每个index对应的key就行了
                        arr = arr.map((item) => {
                            return item.split(',').map((value, index) => {
                                if (index == 0) {
                                    return value
                                } else {
                                    return Number(value)
                                }
                            })
                        })

                        if(arr[0] != null && arr[0][0] == '09:30'){
                            //删除
                            // console.log('第一个数据是',arr[0][0])
                            arr.splice(0, 1) //删除9:30分的数据
                        }
                        
                        fixedVolume(arr, DataType.OneMinData)

                        //计算均价
                        if (config != null) {
                            if (config.avePrice != null) {
                                var price = 0
                                var volume = 0
                                for (var j = 0; j < arr.length; j++) {
                                    price += arr[j][OneMinDataKeyIndex['成交额']]
                                    volume += arr[j][OneMinDataKeyIndex['成交量']]
                                    arr[j][OneMinDataKeyIndex['均价']] = price / volume
                                }
                                price = null
                                volume = null
                            }
                        }
                        // if(config.justTimes != null){
                        //现在单个文件保存的是一个代码的所有Times，不是一个时间命名的文件保存所有代码，没有必要只获取一部分时间了
                        // dirResult = config.justTimes.map((item)=>{
                        //     return item.replace(':', '_') + '.json'
                        // })
                        // }

                        if (config != null && config.timeDit == true) {
                            minDataDit[symbol] = {}
                            arr.forEach(row => {
                                var time = row[0]
                                //给时间数据加上日期
                                row[0] = dayKey + ' ' + row[0]
                                minDataDit[symbol][time] = row
                                time = null
                            });
                        } else {
                            //给时间数据加上日期
                            for (var j = 0; j < arr.length; j++) {
                                arr[j][0] = dayKey + ' ' + arr[j][0]
                            }
                            minDataDit[symbol] = arr
                        }
                        arr = null
                    } else {
                        console.warn('文件不存在', filePath)
                    }
                }
            }
        }
        dayKey = null
        addCount += 1
    }
    addCount = null
    getDataDayLength = null
    return minDataDit
}

export async function getOneDayMin1DataDb(first_date, day, symbolArr, config) {
    var date = null
    if (day > 0) {
        date = GetNextDay(first_date, day)
    } else if (day < 0) {
        date = GetUpDay(first_date, Math.abs(day))
    }

    // console.log("请求的date", date)
    var arg = { api: 'sqlite', params: { symbols: symbolArr, adjust: 'qfq', period: '1', start_date: date + ' 09:31:00', end_date: date + ' 15:00:00', needLabel: true } }

    if (config != null && config.justTimes != null) {
        //暂时只支持获取一个时间点
        arg.params.start_date = date + ' ' + config.justTimes[0] + ':00'
        arg.params.end_date = date + ' ' + config.justTimes[0] + ':00'
    }

    var symbolDit = null
    if (isInTool == false) {
        symbolDit = ipcCallAsync(arg)
    } else {
        var year = moment(date).format('YYYY')
        // console.log('arg.params', arg.params)
        var time = new Date().getTime()
        sqlCrateTables.initDb({ 'dbName': DataFolder + '/' + year + '.db' }) //symbols: symbolArr, tableType: 'minTable'
        symbolDit = await sqlCrateTables.queryData(arg.params)
        // if(symbolArr.length != 0){
        // }
        var costtime = (new Date().getTime() - time)
        if (costtime > 300) {
            console.log('查询' + symbolArr.length + '个 costtime', costtime + 'ms')
        }
    }
    for (var symbol in symbolDit) {
        fixedVolume(symbolDit[symbol], DataType.OneMinData)
    }
    if (config != null) {
        //计算均价
        if (config.avePrice != null) {
            for (var symbol in symbolDit) {
                var price = 0
                var volume = 0
                var arr = symbolDit[symbol]
                for (var j = 0; j < arr.length; j++) {
                    price += arr[j]['成交额']
                    volume += arr[j]['成交量']
                    arr[j][config.avePrice] = price / volume
                }
                price = null
                volume = null
            }
        }
        if (config.timeDit == true) {
            for (var symbol in symbolDit) {
                //查询一天的话应该只有一天的数据
                symbolDit[symbol] = arrToDit(symbolDit[symbol], '时间', null, (key) => {
                    return moment(key).format('HH:mm')
                })
            }
        }
    }

    return symbolDit
    // for(var symbol in symbolDit){
    //     //查询一天的话应该只有一天的数据
    //     arr.push(symbolDit[symbol][0])
    // }
}

//获取分时数据的汇总方法，现在1分钟的分时数据和5分钟分时数据是不同的获取方法
export async function getOneDayMinDataByType(first_date, day, symbolArr, config, type) {
    if (type == 'min1Option') {
        if (readMinUsingDb) {
            return await getOneDayMin1DataDb(first_date, day, symbolArr, config, type)
        } else {
            return getOneDayMin1Data(first_date, day, strArrToDit(symbolArr), config)
        }
    } else if (type == 'min5Option') {
        // if(usingDb){
        //     // symbolsDit
        // }else{

        // }
        return getOneDayMinData(first_date, day, strArrToDit(symbolArr), config)
    }
}

//获取均价线，其中first_date是第一天的日期，day是要获取多少天的均价，symbolsDit是要获取那些股票
export async function getMaPrice(first_date, day, symbolArr) {
    var { dataArr, dateArr } = await GetUpperDaysDataDeal(first_date, day, symbolArr, { select: ['close', 'date'] })
    //    console.log('getMaPrice dateArr', first_date,  dataArr, dateArr)
    return calculateListMA(dataArr, '收盘')
}

//获取均量线，注意均量不包含当天，而是当天的前n个交易日，故这里获取的天数+1
export async function getMaVolume(first_date, day, symbolArr) {
    var { dataArr, dateArr } = await GetUpperDaysDataDeal(first_date, day + 1, symbolArr)
    dataArr.splice(0, 1)
    // dateArr.splice(0, 1)
    // console.log('getMaPrice dateArr', dataArr, dateArr)
    return calculateListMA(dataArr, '成交量')
}


export async function getDapanDataByDate(fileName) {
    var url = 'https://ywserver.oss-cn-shanghai.aliyuncs.com/dapanData/' + fileName + '.json'
    var savePath = window.globalSetting['LocalDataFolder'] + '/dapanData/' + fileName + '.json'
    if(fs.existsSync(savePath) == true){
        //本地已经有了，不重复拉取
        return true
    }
    try {
        const response = await axios.get(url); // 将data作为参数传递到API接口
        if (response.status == 200) {
            fs.writeFileSync(savePath, JSON.stringify(response.data))

            //如果是直接从YWServer拉取的，同时更新本地的threadDate
            var year = moment(fileName).format('YYYY')
            var tradeDatesPath = window.globalSetting['LocalDataFolder'] + '/trade_dates/' + year + '.json'
            tradeDateDit[fileName] = 1
            var fileStr = readFileSync(tradeDatesPath)
            var oneYearTradeDates = []
            if(fileStr != null){
                oneYearTradeDates = JSON.parse(fileStr)
            }
            if(oneYearTradeDates.indexOf(fileName) == -1){
                oneYearTradeDates.push(fileName)
                writeFileSync(tradeDatesPath, JSON.stringify(oneYearTradeDates))
            }

            //同时计算ma
            var needMa = SymbolMaOption.map((item) => {
                return Number(item.value.split('_')[1])
            })
            var maxMa = Math.max(...needMa)
            var startDate = GetUpDay(fileName, maxMa + 1)
            // console.log('同时计算ma',needMa,startDate, maxMa)
            calculateMaData(needMa, null, startDate)//只计算近一年的
            return true
        }   
    } catch (error) {
        return false
    }
}

//获取大盘数据
export async function upDateDapanData() {
    // var needMa = SymbolMaOption.map((item)=>{
    //     return Number(item.value.split('_')[1])
    // })
    // var maxMa = Math.max(...needMa)
    // var startDate = GetUpDay(fileName, maxMa + 1)
    // console.log('同时计算ma',needMa,startDate, maxMa)
    // calculateMaData(needMa, null, startDate)//只计算近一年的
    // return {success: true, error: null}

    // var fileName = moment().format("YYYY-MM-DD") 
    // var savePath = window.globalSetting['LocalDataFolder'] + '/dapanData/' + fileName + '.json'
    // if(ossClient != null){
    //     await ossClient.put('/dapanData/' + fileName  + '.json', Buffer.from(fs.readFileSync(savePath)));
    // }

    // return

    // updateDapanDataToDB(savePath)
    // return

    if (moment().hour() < 15) {
        //注意当周一或者节假日，此处日期还是会出错，应该从交易日中获取今天的上一个交易日的日期
        //fileName = moment().diff(1, 'day').format("YYYY-MM-DD") 
        return { success: false, error: '请在下午3点后拉取数据' }
    }

    var fileName = moment().format("YYYY-MM-DD")

    if (window.globalSetting.GetDapanFromYwServer != true) {
        //同时更新上证指数？//逐量更新，不全量更新，每次拉取今年来的
        //更新指数的 同时会更新本地的threadDate
        var result = await upDateZhishuData({ symbols: ['sh000001'], start_date: moment().format("YYYY0101"), end_date: moment().format("YYYYMMDD") }, 'step')
        if (result.success == false) {
            return result
        }
        //大盘数据需要补全昨收 字段，计算涨停会用到
        //有了最新的指数，就可以判断今天是否是交易日，如果不是交易日就不用拉取数据了
        var url = window.globalSetting['DataHost'] + '/api/public/stock_zh_a_spot_em'

        if (tradeDateDit[fileName] == null) {
            //不是交易日
            return { success: false, error: '今天不是交易日' }
        }
    }

    //要判断如果是凌晨0点到早上8点更新，保存的数据是昨日的股市数据
    var savePath = window.globalSetting['LocalDataFolder'] + '/dapanData/' + fileName + '.json'

    try {
        if (window.globalSetting.GetDapanFromYwServer == true) {
            url = 'https://ywserver.oss-cn-shanghai.aliyuncs.com/dapanData/' + fileName + '.json'
        }
        const response = await axios.get(url); // 将data作为参数传递到API接口
        if (response.status == 200) {
            if (window.globalSetting.GetDapanFromYwServer != true) {
                response.data.forEach((item) => {
                    //补全代码
                    item['代码'] = symbolFull(item['代码'])
                    //统一单位
                    if (item['最新价'] != null) {
                        item['收盘'] = item['最新价']
                        delete item['最新价']
                    }
                    if (item['今开'] != null) {
                        item['开盘'] = item['今开']
                        delete item['今开']
                    }
                    //统一成交量为股数
                    if (item['成交量'] != null) {
                        item['成交量'] = item['成交量'] * 100
                    }
                })
            }

            fs.writeFileSync(savePath, JSON.stringify(response.data))
            if(window.globalSetting.GetDapanFromYwServer == true){
                //如果是直接从YWServer拉取的，同时更新本地的threadDate
                var year = moment(fileName).format('YYYY')
                var tradeDatesPath = window.globalSetting['LocalDataFolder'] + '/trade_dates/' + year + '.json'
                tradeDateDit[fileName] = 1
                var fileStr = readFileSync(tradeDatesPath)
                var oneYearTradeDates = []
                if(fileStr != null){
                    oneYearTradeDates = JSON.parse(fileStr)
                }
                if(oneYearTradeDates.indexOf(fileName) == -1){
                    oneYearTradeDates.push(fileName)
                    writeFileSync(tradeDatesPath, JSON.stringify(oneYearTradeDates))
                }
            }
            // console.log('大盘数据更新到本地', response.data)

            // 同时自动计算MA值 {value: 'MA_5', 
            var needMa = SymbolMaOption.map((item) => {
                return Number(item.value.split('_')[1])
            })
            var maxMa = Math.max(...needMa)
            var startDate = GetUpDay(fileName, maxMa + 1)
            // console.log('同时计算ma',needMa,startDate, maxMa)
            calculateMaData(needMa, null, startDate)//只计算近一年的

            if (window.globalSetting.GetDapanFromYwServer == false) {
                updateDapanDataToDB(savePath)   //插入数据到本地数据库，同时本地的文件文本也可以保留一份做为备份
                //同时root客户端上传这个日k数据到oss上，这样其他不部署数据获取服务的人也可以更新到日k数据（分时数据是否也可以同理部署？）
                // if(window.require != null){
                //     var {ipcRenderer} = window.require('electron')
                //     ipcRenderer.sendSync('upLoadDapanData', {filePath: savePath})
                // }
                if (ossClient != null) {
                    await ossClient.put('/dapanData/' + fileName + '.json', Buffer.from(fs.readFileSync(savePath)));
                }
            }
            //大盘数据更新成功后，通知等待大盘数据更新成功的回调
            while(onOneDayDataUpdateCb.length > 0){
                var oneCb = onOneDayDataUpdateCb.shift()
                if(oneCb != null){
                    oneCb()
                }
            }
            return { success: true, error: null }
        } else {
            console.log('拉取大盘数据失败')
            return { success: false, error: response.status }
        }
    } catch (error) {
        console.log('error', error)
        return { success: false, error: error }
    }
}

//获取指数数据, upDateType = step //逐步更新，不覆盖之前的数据 all全量更新，覆盖之前的数据
export async function upDateZhishuData(params, upDateType) {
    var url = window.globalSetting['DataHost'] + '/api/public/stock_zh_index_daily_em'
    var savePath = window.globalSetting['LocalDataFolder'] + '/zhishushuju/'
    var tradeDatesPath = window.globalSetting['LocalDataFolder'] + '/trade_dates/'
    if (upDateType == null) {
        upDateType = 'step'
    }
    var errorArr = []
    for (var i = 0; i < params.symbols.length; i++) {
        var symbol = params.symbols[i]
        try {
            var response = await axios.get(url, { params: { symbol: symbol, start_date: params.start_date, end_date: params.end_date } }); // 将data作为参数传递到API接口
            if (response.status == 200) {
                // console.log(response.data)
                //同时以上证指数来生成年交易日数据
                if (symbol == 'sh000001') {
                    var yearsDit = {}
                    for (var j = 0; j < response.data.length; j++) {
                        var oneDayItem = response.data[j]
                        if (oneDayItem.date != null) {
                            var year = moment(oneDayItem.date).year()
                            if (yearsDit[year] == null) {
                                yearsDit[year] = []
                            }
                            yearsDit[year].push(moment(oneDayItem.date).format('YYYY-MM-DD'))
                        }
                    }
                    for (var year in yearsDit) {
                        for (var j = 0; j < yearsDit[year].length; j++) {
                            //同时更新内存中的交易日
                            tradeDateDit[yearsDit[year][j]] = 1
                        }
                        fs.writeFileSync(tradeDatesPath + year + '.json', JSON.stringify(yearsDit[year]))
                    }
                }
                var zhishuPath = savePath + symbol + '.json'
                if (upDateType == 'step') {
                    //只更新没有的数据
                    if (fs.existsSync(zhishuPath)) {
                        var oldData = JSON.parse(fs.readFileSync(zhishuPath))

                        var newData = response.data

                        //这一定是一段连续的日期的数据
                        var firstDate = newData[0].date
                        var endDate = newData[newData.length - 1].date

                        var startIndex = oldData.findIndex((item) => {
                            return item.date == firstDate
                        })
                        if (startIndex != -1) {
                            var endIndex = oldData.findIndex((item) => {
                                return item.date == endDate
                            })
                            if (endIndex == -1) {
                                //直接从startIndex开始插入，到结束
                                oldData.splice(startIndex)
                                oldData = oldData.concat(newData)
                            } else {
                                //仅仅替换startIndex和endIndex之间的数据
                                var endArr = oldData.splice(endIndex + 1)
                                oldData.splice(startIndex)
                                oldData = oldData.concat(newData).concat(endArr)
                            }
                            fs.writeFileSync(zhishuPath, JSON.stringify(oldData))
                        } else {
                            //没有可插入的时间点，请检查数据连续性，并返回最后一个日期
                            errorArr.push(symbol + '没有可插入时间点，最后日期' + oldData[oldData.length - 1].date)
                        }
                    } else {
                        fs.writeFileSync(zhishuPath, JSON.stringify(response.data))
                    }
                } else if (upDateType == 'cover') {
                    fs.writeFileSync(zhishuPath, JSON.stringify(response.data))
                }
            } else {
                errorArr.push(symbol)
            }
        } catch (error) {
            console.log('error', error)
            errorArr.push(symbol)
        }
    }
    if (errorArr.length == 0) {
        return { success: true }
    } else {
        return { success: false, error: '拉取失败:' + errorArr.join(',') }
    }
}

//获取股票池数据
//更新创业板、科创板、新股、次新股、沪深京股票池
export async function upDateSymbolGroup() {
    var savePath = window.globalSetting['LocalDataFolder'] + '/symbolGroup'
    if (fs.existsSync(savePath) == false) {
        fs.mkdirSync(savePath)
    }
    var errorArr = []
    var SymbolGroup = [
        { value: 'SH', label: '沪A股', api: 'stock_sh_a_spot_em' },
        { value: 'SZ', label: '深A股', api: 'stock_sz_a_spot_em' },
        { value: 'BJ', label: '京A股', api: 'stock_bj_a_spot_em' },
        { value: 'cy', label: '创业板', api: 'stock_cy_a_spot_em' },
        { value: 'kc', label: '科创板', api: 'stock_kc_a_spot_em' },
        { value: 'new', label: '新股', api: 'stock_zh_a_new_em' },
        { value: 'secondNew', label: '次新股', api: 'stock_zh_a_new' },
        { value: 'st', label: 'ST股', api: 'stock_zh_a_st_em' },
        // {value: 'ts', label: 'ts股', api: ''},   //退市股直接从判断市值是否为null获取
    ]

    var tsDit = {}

    //这里沪A股，深A股，京A股，包含大盘所有股票，可以先构建ACodeArr
    var ACodeArr = {}

    var url = window.globalSetting['DataHost'] + '/api/public/'
    for (var i = 0; i < SymbolGroup.length; i++) {
        var config = SymbolGroup[i]
        try {
            var response = await axios.get(url + config.api); // 将data作为参数传递到API接口
            if (response.status == 200) {
                if (config.value == 'SH' || config.value == 'SZ' || config.value == 'BJ') {
                    fs.writeFileSync(savePath + '/' + config.value + '.json', JSON.stringify(response.data))
                    response.data.forEach(item => {
                        let symbol = item['代码'] + '.' + config.value
                        if (item['总市值'] == null) {
                            tsDit[symbol] = item['名称']
                        }
                        ACodeArr[symbol] = item['名称']
                    })
                } else {
                    var symbolDit = {}
                    response.data.forEach(item => {
                        let symbol = item['代码'] != null ? item['代码'] : item['code']
                        symbol = symbolFull(symbol)
                        if (symbol != null) {
                            symbolDit[symbol] = 1
                        }
                    })
                    fs.writeFileSync(savePath + '/' + config.value + '.json', JSON.stringify(symbolDit))
                }
            } else {
                errorArr.push(config.label)
            }
        } catch (error) {
            errorArr.push(config.label)
        }
    }
    if (errorArr.length == 0) {
        allSymbolDit = ACodeArr //同时更新全局的ACodeArr
        fs.writeFileSync(savePath + '/ACodeArr.json', JSON.stringify(ACodeArr))
        fs.writeFileSync(savePath + '/ts.json', JSON.stringify(tsDit))
        return { success: true }
    } else {
        return { success: false, error: '拉取失败:' + errorArr.join(',') }
    }
}

//更新股票的上市日期
export async function upDateSymbolStartDate() {
    var savePath = window.globalSetting['LocalDataFolder'] + '/symbolGroup'
    if (fs.existsSync(savePath) == false) {
        fs.mkdirSync(savePath)
    }
    // var ACodeArrPath = window.globalSetting['LocalDataFolder'] + '/symbolGroup/ACodeArr.json'
    // if(fs.existsSync(ACodeArrPath) == false){
    //    return  {success: false, error: '缺少A股代码集合，请先拉取股票池数据'}
    // }
    // var ACodeArr = JSON.parse(fs.readFileSync(ACodeArrPath))

    var url = window.globalSetting['DataHost'] + '/api/public/stock_xgsr_ths'
    try {
        var response = await axios.get(url); // 将data作为参数传递到API接口
        if (response.status == 200) {
            var symbolStartDateDit = {}
            response.data.forEach(item => {
                var symbol = item['股票代码']
                symbol = symbolFull(symbol)
                symbolStartDateDit[symbol] = item['上市日期']
            });
            fs.writeFileSync(savePath + '/symbolStartDate.json', JSON.stringify(symbolStartDateDit))
            return { success: true }
        } else {
            return { success: false, error: response.status }
        }
    } catch (error) {
        return { success: false, error: error }
    }
}

async function awaitTime(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, time * 1000);
    })
}

//获取行业板块，以及板块成分股
export async function upDateHangyeGroup(needUpdateEveryHangye, progressCb) {
    var savePath = window.globalSetting['LocalDataFolder'] + '/hangyeGroup'
    if (fs.existsSync(savePath) == false) {
        fs.mkdirSync(savePath)
    }

    var ACodeArrPath = window.globalSetting['LocalDataFolder'] + '/symbolGroup/ACodeArr.json'
    if (fs.existsSync(ACodeArrPath) == false) {
        return { success: false, error: '缺少A股代码集合，请先拉取股票池数据' }
    }
    var ACodeArr = JSON.parse(fs.readFileSync(ACodeArrPath))

    var errorArr = []
    var url = window.globalSetting['DataHost'] + '/api/public/'
    var hangyeDit = {}
    try {
        var response = await axios.get(url + 'stock_board_industry_name_em'); // 将data作为参数传递到API接口
        if (response.status == 200) {
            response.data.forEach((item) => {
                hangyeDit[item['板块代码']] = item['板块名称']
            })
            var hangyeOptions = response.data.map((item) => {
                return { value: item['板块代码'], label: item['板块名称'] }
            })
            //只记录板块代码
            fs.writeFileSync(savePath + '/hangyeDit.json', JSON.stringify(hangyeDit))
            fs.writeFileSync(savePath + '/hangyeOptions.json', JSON.stringify(hangyeOptions))
            //记录详细信息
            fs.writeFileSync(savePath + '/hangyeList.json', JSON.stringify(response.data))
        } else {
            errorArr.push('stock_board_industry_name_em')
        }
    } catch (error) {
        errorArr.push('stock_board_industry_name_em')
    }

    var symbolsDit = {}
    //查询行业所属板块
    if (needUpdateEveryHangye == true) {
        var curCount = 0
        var totalCount = Object.keys(hangyeDit).length
        for (var key in hangyeDit) {
            curCount += 1
            if (progressCb != null) {
                progressCb(curCount + '/' + totalCount)
            }
            try {
                var response = await axios.get(url + 'stock_board_industry_cons_em', { params: { symbol: key } }); // 将data作为参数传递到API接口
                if (response.status == 200) {
                    console.log('response.data', response.data)
                    symbolsDit[key] = {}
                    response.data.forEach(item => {
                        var symbol = item['代码']
                        symbol = symbolFull(symbol)
                        symbolsDit[key][symbol] = item['名称']
                    })
                } else {
                    errorArr.push(key)
                }
            } catch (error) {
                errorArr.push(key)
            }
            //等待1秒再执行下一个请求防止请求过于频繁
            await awaitTime(1)
        }
        fs.writeFileSync(savePath + '/symbolsDit.json', JSON.stringify(symbolsDit))
    }

    if (errorArr.length == 0) {
        return { success: true }
    } else {
        return { success: false, error: '拉取失败:' + errorArr.join(',') }
    }
}

//检查服务运行状态
export async function checkServerState() {
    var urls = [
        window.globalSetting['DataHost'] + '/version',
        window.globalSetting['OrderHost'] + '/version',
        window.globalSetting['CodeHost'] + '/version'
    ]
    var result = []
    for (var i = 0; i < urls.length; i++) {
        var url = urls[i]
        try {
            var response = await axios.get(url); // 将data作为参数传递到API接口
            // console.log('response', response.status, response.data)
            result.push(response.status)
        } catch (error) {
            result.push('未启动')
        }
    }
    return result
}

// 

//防止裁剪时报错