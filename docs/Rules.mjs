

import * as YWRequest from './YWRequest.mjs';
import Decimal from './decimal.js';



// 

import moment from 'moment';

// QMT使用手册：http://dict.thinktrader.net/
// 【大QMT：内置Python，mini：XtQuant文档

// 登录账号：39134967
// 登录密码：259800
// QMT交易测试客户端下载链接
// 链接：https://download.gjzq.com.cn/temp/organ/gjzqqmt_ceshi.rar

// QMT使用手册：http://dict.thinktrader.net/
// 【大QMT：内置Python，mini：XtQuant文档】
// 【QMT如何安装和配置？】
// https://zhuanlan.zhihu.com/p/646365347
// 【QMT如何进行回测？】
// https://zhuanlan.zhihu.com/p/647295801
// 【QMT如何进行交易？】
// https://zhuanlan.zhihu.com/p/652066776

// miniQMT的使用方式：
// https://zhuanlan.zhihu.com/p/688296339



// var moment = null
// var YWRequest = null
// export function init(config){
//   moment = config.moment
//   YWRequest = config.YWRequest
// }
// {
//   "代码": "000021.SZ",
//   "今开": 16.16,
//   "换手率": 1.3810589788027,
//   "成交量": 21544498,
//   "昨收": 16.21,
//   "涨跌幅": -2.4676125848242,
//   "最高": 16.17,
//   "最低": 15.71,
//   "总市值": 24672889766.28,
//   "市盈率-动态": 38.276205600983,
//   "市净率": 2.2507371094384,
//   "收盘": 15.81
// },

// 昨竞比是指：今天集合竞价的总金额或者总成交量，除以前一日的总金额或总成交量，得出的数据。

//这个暂时只有选择分时数据选项的配置
export var huiceConfig = {
  secondKLine: 'min1Option' //设置rule使用的是5分钟级别的数据还是1分钟级别的数据
}

export function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj){return obj};
  
    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
  
    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        var len = obj.length;
        for (var i = 0;i < len; ++i) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }
  
    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }
}

//克隆并且初始化
export function cloneAndInit(obj){
  var newObj = clone(obj)
  newObj.id = getId()
  // newObj.checked = true
  if(newObj.values != null){
    for(var i = 0; i < newObj.values.length; i++){
      var oneRow = newObj.values[i]
      if(oneRow.type == 'select'){
        // console.log('oneRow.options', oneRow.options == 'min5Option', oneRow.options)
        if(oneRow.options == 'minOption'){
          // console.log('huiceConfig.secondKLine', huiceConfig.secondKLine, YWRequest[huiceConfig.secondKLine])
          oneRow.options = YWRequest[huiceConfig.secondKLine]
          // console.log('重新赋值了', oneRow.options)
        }else if(oneRow.options == 'jiheJinJiaTimeOption'){
          oneRow.options = YWRequest.jiheJinJiaTimeOption
        }else if(YWRequest[oneRow.options] != null){
          oneRow.options = YWRequest[oneRow.options]
        }
      }else if(oneRow.type == 'autoInput'){
        oneRow.options = YWRequest['allSymbolNameArr']
      }
    }
  }
  return newObj
}

function fourRoundToDecimals(num, fixedCound) {
  var scale = Math.pow(10, fixedCound)
  return new Decimal(Math.round(new Decimal(num).mul(scale))).div(scale).toNumber()
}

//计算数值序列中的最大回撤
export function calculateMaxDrawdown(prices) {
  if (prices.length < 2) {
      return 0; // 如果价格数据不足，无法计算回撤
  }
  var maxDayIndex = 0
  var minDayIndex = 0
  var peak = prices[0]; // 初始化最高点为第一个价格
  var maxDown = 0; // 初始化最大回撤为0
  var whenMaxDownMaxDayIndex = 0

  for (let i = 1; i < prices.length; i++) {
      if (prices[i] > peak) {
          peak = prices[i]; // 更新最高点
          maxDayIndex = i
      }
      var tempDrawdown = (peak - prices[i]) / peak; // 计算当前点到历史最高点的下降幅度
      if (tempDrawdown > maxDown) {
          maxDown = tempDrawdown; // 更新最大回撤
          minDayIndex = i
          whenMaxDownMaxDayIndex = maxDayIndex
      }
  }

  return {maxDown, maxDayIndex, minDayIndex, whenMaxDownMaxDayIndex}; // 返回最大回撤，以小数形式表示（例如，0.25表示25%的回撤）
}


//返回时间1是否大于时间2（不包括等于）
function time1BigTime2(time1, time2){
  var time2Arr = time2.split(':')
  var time1Arr = time1.split(':')
  if(time1Arr[0] > time2Arr[0]){
      return true
  }else if(time1Arr[0] == time2Arr[0]){
      if(time1Arr[1] > time2Arr[1]){
          return true
      }else if(time1Arr[1] == time2Arr[1]){
          if(time1Arr[2] == null || time2Arr[2] == null){
            return false
          }
          if(time1Arr[2] > time2Arr[2]){
              return true
          }else{
              return false
          }
      }else{
          return false
      }
  }else{
      return false
  }
}

//指数对比
export var ZishuOption = [
  {value: 'sh000001', label: '上证指数'},
  {value: 'sz399001', label: '深证成指'},
  {value: 'sz399006', label: '创业板指'},
  {value: 'sh000688', label: '科创50'},
  {value: 'sh000016', label: '上证50'},
  {value: 'sz899050', label: '北证50'},
  {value: 'sh000300', label: '沪深300'},
]

export var RunTimeOption = [
  {value: 'openBefore', label: '开盘前', des: '09:25的时候执行，处理和集合竞价相关的规则'},
  {value: 'openAfter', label: '开盘后', des: '9:30的时候执行，处理和开盘下单相关的规则'},
  {value: 'closeBefore', label: '收盘前',  des: '14:57的时候执行，处理和收盘下单相关的规则'},
  {value: 'closeAfter', label: '收盘后', des: '收盘后且获取到当日大盘数据的更新后执行，处理常规的选股规则'},
  {value: 'inOpenTime', label: '盘中分时', des: '盘中执行，处理使用了分时数据的规则，勾选此项后，开盘期间每隔一段时间就执行一次，分时间隔在实盘配置中选择'},
]

//根据policy返回可选执行的时间
export function genRunTimeOption(policy){
  return RunTimeOption.filter((item)=>{
      if(item.value == 'openBefore'){
          return policy.needJinjiaData == true
      }else if(item.value == 'inOpenTime'){
          return policy.needMinData == true
      }
      if(item.value == 'openAfter' || item.value == 'closeBefore'){
          if(policy.rulesDit.ruleOfBuy.length == 0 && policy.rulesDit.ruleOfSale.length == 0){
              //没有买入规则，也没有卖出规则，那开盘收盘的时候执行也没有意义
              return false
          }
      }
      return true
  })
}

//股票池
export var SymbolGroup = [
    {value: 'cy', label: '创业板', api: 'stock_cy_a_spot_em'},
    {value: 'kc', label: '科创板', api: 'stock_kc_a_spot_em'},
    {value: 'BJ', label: '京A股', api: 'stock_bj_a_spot_em'},
    {value: 'SZ', label: '深A股', api: 'stock_sz_a_spot_em'},
    {value: 'SH', label: '沪A股', api: 'stock_sh_a_spot_em'},
    {value: 'new', label: '新股', api: 'stock_zh_a_new_em'},
    {value: 'secondNew', label: '次新股', api: 'stock_zh_a_new'},
    {value: 'st', label: 'ST股', api: 'stock_zh_a_st_em'},
    {value: 'ts', label: '退市股', api: 'stock_zh_a_ts_em'},
]



//比较选项
const CompireOption = [
  {value: 'bigger', label: '大于'},
  {value: 'small', label: '小于'},
  {value: 'equire', label: '等于'},
  {value: 'biggerEquire', label: '大于等于'},
  {value: 'smallEquire', label: '小于等于'},
]

const NewMoreOption = [
  {value: 'bigger', label: '新高'},
  {value: 'small', label: '新低'},
]

const TopValueOption = [
  {value: 'bigger', label: '最大值'},
  {value: 'small', label: '最小值'},
]

const ValueTypeOption = [
  {value: '涨停价', label: '涨停价'},
  {value: '跌停价', label: '跌停价'},
]

export const minTypeOption = [
  {value: 'min1Option', label: '1分钟级别'},
  {value: 'min5Option', label: '5分钟级别'},
]

const SymbolKeyToDBKey = {
  '日期': ['date'],
  '时间': ['time'],
  '开盘': ['open'],
  '今开': ['open'],
  '收盘': ['close'],
  '换手率': ['handpre'],
  '成交量': ['volume'],
  '成交额': ['money'],
  '最高': ['max'],
  '最低': ['min'],
  '昨收': ['precolse'],
  '涨跌幅': ['updownpre'],
  '总市值': ['totalprice'],
  '涨跌幅': ['updownpre'],
  '市盈率': ['shiyinlv'],
  '市净率': ['shijinlv'],
  '涨停价': ['close', 'precolse', 'updownpre'],
  '跌停价': ['close', 'precolse', 'updownpre'],
}


///
function GenSelectKeys(needDatas){
  var selectArr = []
  for(var i = 0; i < needDatas.length; i++){
    if(SymbolKeyToDBKey[needDatas[i]] != null){
      selectArr = selectArr.concat(SymbolKeyToDBKey[needDatas[i]])
    }
  }
  return selectArr
}



const SymbolOption = [
  {value: '开盘', label: '开盘价'},
  {value: '收盘', label: '收盘价'},
  {value: '换手率', label: '换手率'},
  {value: '成交量', label: '成交量'},
  {value: '成交额', label: '成交额'},
  {value: '最高', label: '最高价'},
  {value: '最低', label: '最低价'},
  {value: '涨停价', label: '涨停价'}, //此处的价格需要根据昨日收盘价计算
  {value: '跌停价', label: '跌停价'}, //此处的价格需要根据昨日收盘价计算
  {value: '昨收', label: '昨收'},
  {value: '涨跌幅', label: '涨跌幅'},
  {value: '总市值', label: '总市值'},
  {value: '市盈率', label: '市盈率'},
  {value: '市净率', label: '市净率'},
].concat((YWRequest['SymbolMaOption']))

const SymbolKey = {
  open: '开盘',
  close: '收盘',
  max: '最高',
  min: '最低',
  volmue: '成交量',
  priceVolmue: '成交额',
  handPre: '换手率'
}

const SymbolOptionOfMin = [
  {value: '开盘', label: '开盘价'},
  {value: '收盘', label: '收盘价'},
  {value: '最高', label: '最高价'},
  {value: '最低', label: '最低价'},
  {value: '成交量', label: '成交量'},
  {value: '成交额', label: '成交额'},
  {value: '换手率', label: '换手率'},
]

const SymbolPriceOption = [
    {value: '开盘', label: '开盘价'},
    {value: '收盘', label: '收盘价'},
    {value: '最高', label: '最高价'},
    {value: '最低', label: '最低价'},
    {value: '涨停价', label: '涨停价'}, //此处的价格需要根据昨日收盘价计算
    {value: '跌停价', label: '跌停价'}, //此处的价格需要根据昨日收盘价计算
    {value: '昨收', label: '昨收'},
].concat((YWRequest['SymbolMaOption'])) //拼接均价选项

const SymbolPriceOptionOfBuySale = [
  {value: '开盘', label: '开盘价'},
  {value: '收盘', label: '收盘价'},
  {value: '最高', label: '最高价'},
  {value: '最低', label: '最低价'},
]

const JiheJinjiaOption = [
  {value: '开盘', label: '开盘'},
  {value: '成交量', label: '成交量'},
  {value: '成交额', label: '成交额'},
]

function getTimeByPriceKey(key){
  if(key == '今开' || key == '开盘'){
    return '09:35'
  }else{
    return '14:55'
  }
}


const DoTypeOption = [
  {value: 'buy', label: '买入'},
  {value: 'sale', label: '卖出'},
]

//交易类型
const DoType = {
  buy:'buy',
  sale: 'sale'
}

function optionValueToLabel(value, option){
  var findOption = option.find((item)=>{
    return item.value == value
  })
  if(findOption != null){
    return findOption.label
  }
  return ''
}

//均价线选项
const SymbolMaOption = [
    {value: 'MA_5',   label: '5日均价'  },
    {value: 'MA_10',  label: '10日均价' },
    {value: 'MA_20',  label: '20日均价' },
    {value: 'MA_30',  label: '30日均价' },
    {value: 'MA_60',  label: '60日均价' },
    {value: 'MA_120', label: '120日均价'},
]

//均量选项
const SymbolMaVolOption = [
  {value: 'MAVol_3', label: '前3日均量'},
  {value: 'MAVol_5', label: '前5日均量'},
  {value: 'MAVol_10', label: '前10日均量'},
]

//创业板和新股是有部份股票重复的
const SymbolGroupOption = [
  {value: 'SH', label: '沪A股', findIndex: -1},
  {value: 'SZ', label: '深A股', findIndex: -1},
  {value: 'BJ', label: '京A股', findIndex: -1},
  // {value: '.HK', label: '港股', findIndex: -1},
  {value: 'new', label: '新股', findIndex: 0},            //在实盘数据是以实时股池为准，在回测时以上市一个月以内的股票为准
  {value: 'secondNew', label: '次新股', findIndex: 0},    //在实盘数据是以实时股池为准，在回测中以上市时间小于12个月为准
  {value: 'cy', label: '创业板', findIndex: 0},
  {value: 'kc', label: '科创板', findIndex: 0},
  {value: 'st', label: 'ST股', findIndex: 0}, //st股是风险警示板的股票，但是还没有退市
  {value: 'ts', label: '退市股', findIndex: 0}, //已经退市的股票，包含ST的股票，也有可能还么有St就退市的，也有退市没有改名字的
]

const BoolenOption = [{value: 'true', label: '是'}, {value: 'false', label: '否'}]

const DownPointOption = [{value: 'downBreak', label: '跌破前低'}, {value: 'downBack', label: '未跌破前低'}]
const UpPointOption = [{value: 'upBreak', label: '突破前高'}, {value: 'upBack', label: '未突破前高'}]

const RuleType = {
  RuleOfSelect: 'ruleOfSelect',
  RuleOfBuy: 'ruleOfBuy',
  RuleOfSale: 'ruleOfSale',
}
//ruleOfSelect ruleOfBuy ruleOfSale


//比较两个的值
function compireTwoValue(firstValue, compire, secondValue){
  var result = false
  if(compire == 'bigger'){
      result = firstValue > secondValue
  }else if(compire == 'small'){
      result = firstValue < secondValue
  }else if(compire == 'equire'){
      result = firstValue == secondValue
  }else if(compire == 'biggerEquire'){
      result = firstValue >= secondValue
  }else if(compire == 'smallEquire'){
      result = firstValue <= secondValue
  }
  return result
}

//比较两个时间的大小
function compireTwoTime(firstValue, compire, secondValue){
  var result = false
  if(compire == 'bigger'){
    if(firstValue == secondValue){
      result = false
    }else{
      result = time1BigTime2(firstValue, secondValue)
    }
  }else if(compire == 'small'){
      if(firstValue == secondValue){
        result = false
      }else{
        result = !time1BigTime2(firstValue, secondValue)
      }
  }else if(compire == 'equire'){
      result = firstValue == secondValue
  }else if(compire == 'biggerEquire'){
      if(firstValue == secondValue){
        result = true
      }else{
        result = time1BigTime2(firstValue, secondValue)
      }
  }else if(compire == 'smallEquire'){
      if(firstValue == secondValue){
        result = true
      }else{
        result = !time1BigTime2(firstValue, secondValue)
      }
  }
  return result
}

//比较两个日期的大小
function compireTwoDate(firstValue, compire, secondValue){
  if(compire == 'bigger'){
      return moment(firstValue).isAfter(moment(secondValue))
  }else if(compire == 'small'){
      return moment(firstValue).isBefore(moment(secondValue))
  }else if(compire == 'equire'){
      return moment(firstValue).isSame(moment(secondValue))
  }else if(compire == 'biggerEquire'){
      return moment(firstValue).isSameOrAfter(moment(secondValue))
  }else if(compire == 'smallEquire'){
      return moment(firstValue).isSameOrBefore(moment(secondValue))
  }
}

//获取涨跌停幅度，
// 沪市主板股票代码一般是600、601、603开头；        涨跌停限制10个点，ST 5个点
// 深市主板股票代码一般是000、001、002、003开头；    涨跌停限制10个点，ST 5个点
// 科创板股票底代码一般是688，300开头；  涨跌停限制20个点
// 北交所股票代码一般是8开头，      涨跌停限制30个点
function getMaxPre(symbol){
  if(symbol == null){
    return 10
  }
  if(symbol.indexOf('.BJ') != -1){
    //北交所
    return 30
  }
  if(YWRequest.symbolGroupDit['cy'] != null){
    if(YWRequest.symbolGroupDit['cy'][symbol] != null){
      return 20
    }
  }
  if(YWRequest.symbolGroupDit['kc'] != null){
    if(YWRequest.symbolGroupDit['kc'][symbol] != null){
      return 20
    }
  }
  if(YWRequest.symbolGroupDit['st'] != null){
    if(YWRequest.symbolGroupDit['st'][symbol] != null){
      return 5
    }
  }
  if(symbol.indexOf('688') == 0 || symbol.indexOf('300') == 0){
    //科创板
    return 20
  }
  var name = YWRequest.allSymbolDit[symbol]
  if(name == null){
    return 10
  }
  if(name.indexOf("ST") != -1){
    return 5
  }else{
    return 10
  }
}


//涉及买入卖出的规则都会记录交易信息，共用一个方法
function recordJiaoyiInfo(fullObject, symbol, price, time, type){
  // console.log('记录一下交易操作', type, time, symbol, price)
  if(time == null){
    console.log('recordJiaoyiInfo time == null')
    return false
  }
  if(time.split(' ')[1] == '15:00'){
    //已经收盘了，当天无法成交
    return false
  }
  var result = false
  var config = fullObject.otherConfig
  var offsePresent = null
  if(config != null){
    offsePresent = config.offsePresent
  }
  if(fullObject.jiaoyiInfo == null){
    fullObject.jiaoyiInfo = {}
  }
  if(fullObject.jiaoyiInfo[symbol] == null){
    fullObject.jiaoyiInfo[symbol] = {}
  }
  if(type == DoType.buy){
    if(fullObject.jiaoyiInfo[symbol].buyPrice == null){
      if(offsePresent != null){
        //以更高价买入
        price = (1 + offsePresent / 100) * price
      }
      fullObject.jiaoyiInfo[symbol].buyPrice = price  //记录买入价格
      fullObject.jiaoyiInfo[symbol].buyTime = time
      if(fullObject.eventHandle != null){
        fullObject.eventHandle({type: DoType.buy})
      }
      result = true
    }
  }else if(type == DoType.sale){
      //只会触发一次卖出，不能重复卖出，且卖出需要在买入之后
      var buyPrice = fullObject.jiaoyiInfo[symbol].buyPrice
      var buyTime = fullObject.jiaoyiInfo[symbol]['buyTime']
      var buyTimeNextDay = moment(moment(buyTime).add(1, 'day').format('YYYY-MM-DD')) //+1天格式化去掉时间，新的交易只要大于当日0点就可以交易
      if(fullObject.jiaoyiInfo[symbol].salePrice == null && buyPrice != null && moment(time).isSameOrAfter(buyTimeNextDay)){
        // console.log('记录卖出',moment(time).format('YYYY-MM-DD'), moment(buyTime).format('YYYY-MM-DD'), moment(buyTime).add(1, 'day').format("YYYY-MM-DD"))
        if(offsePresent != null){
          //以更低价卖出
          price = (1 - offsePresent / 100) * price
        }
        fullObject.jiaoyiInfo[symbol].salePrice = price //记录卖出价格
        fullObject.jiaoyiInfo[symbol].saleTime = time   
        //如果已经有买入价格，计算获利比例
        var winPresent = fourRoundToDecimals((price - buyPrice) / buyPrice * 100, 2)
        fullObject.jiaoyiInfo[symbol].winPresent = winPresent
        if(fullObject.eventHandle != null){
          fullObject.eventHandle({type: DoType.sale})
        }
        result = true
      }else{

      }
  }
  return result
}

//获取交易记录
function getJiaoyiInfo(fullObject, symbol){
  if(fullObject.jiaoyiInfo == null){
    return null 
  }
  return fullObject.jiaoyiInfo[symbol]
}

//筛选掉不能执行卖出操作的股票
function filterCantSaleSymbol(fullObject, symbolArr, doType){
    return symbolArr.filter((symbol)=>{
      if(fullObject.jiaoyiInfo != null && fullObject.jiaoyiInfo[symbol]){
        if(fullObject.jiaoyiInfo[symbol] != null){
          if(doType == DoType.buy){
            return fullObject.jiaoyiInfo[symbol].buyPrice == null
          }else if(doType == DoType.sale){
            return fullObject.jiaoyiInfo[symbol].salePrice == null && fullObject.jiaoyiInfo[symbol].buyPrice != null
          }
        }else{
          if(doType == DoType.sale){
            //如果是卖出条件，都没有买入，也没有必要卖出了
            return false
          }
        }
        return true
      }else{
          if(doType == DoType.sale){
            //如果是卖出条件，都没有买入，也没有必要卖出了
            return false
          }
      }
      return true
    })
}

//判断股票是否涨跌停oneDay
function isUpOrDownStop(data) {
  if(data['昨收'] == null || data['收盘'] == null){
      return false
  }

  //这里还得判断是否是创业板，如果创业板的话是20
  var baseMaxPre = getMaxPre(data['代码'])

  if(Math.abs(data['涨跌幅']) >= baseMaxPre){
      return true
  }else{
      // 涨停价按前收盘价×1.1计算后需四舍五入到分
      //判断是否因为四舍五入导致没有超过10
      var scale = new Decimal(1).add(new Decimal(baseMaxPre).div(100))
      var upValue = new Decimal(data['昨收']).mul(scale).toNumber()
      var result = fourRoundToDecimals(upValue, 2)
      // console.log('虽然涨幅没有达到10%， 看看收盘价是否和涨停价一致', result, data['收盘'], data)

      if(result == data['收盘']){
          // console.log('虽然涨幅没有达到10%， 但也算涨停了', data['涨跌幅'])
          return true
      }
      var scale = new Decimal(1).sub(new Decimal(baseMaxPre).div(100))
      var downValue = new Decimal(data['昨收']).mul(scale).toNumber()
      var result2 = fourRoundToDecimals(downValue, 2)
      // console.log('downValue', downValue)
      // console.log('虽然跌幅没有达到10%， 看看收盘价是否和跌停价一致', result2, data['收盘'], data)
      if(result2 == data['收盘']){
        // console.log('虽然跌幅没有达到10%， 但也算跌停了', data['涨跌幅'])
        return true
      }
      return false
  }
}

//从数据中获取数据
function getSymbolDataByKey(data, key){
  if(data == null){
    //处理异常情况
    return null
  }

  if(key == '涨停价'){
    var baseMaxPre = getMaxPre(data['代码'])
    var upValue = data['昨收'] * (1 + baseMaxPre / 100)
    // console.log('计算涨停价格', baseMaxPre, data['昨收'], upValue, )
    return fourRoundToDecimals(upValue, 2)
  }else if(key == '跌停价'){
    var baseMaxPre = getMaxPre(data['代码'])
    var downValue = data['昨收'] * (1 - baseMaxPre / 100)
    return fourRoundToDecimals(downValue, 2)
  }else{
    if(key == '今开'){
      if(data['开盘'] != null){
        return data['开盘']
      }
    }else if(key == '开盘'){
      if(data['今开'] != null){
        return data['今开']
      }
    }else if(key == '收盘'){
      if(data['最新价'] != null){
        return data['最新价']
      }
    }
    if(key == '市盈率'){
      if(data['市盈率-动态'] != null){
        return data['市盈率-动态']
      }
    }
    if(Array.isArray(data) == true){
      //是数组形式的，没有key，根据key获取index
      var index = YWRequest.OneMinDataKeyIndex[key]
      // console.log('返回index', key, index)
      return data[index]
    }
    return data[key]
  }
}

//由于集合竞价数据非覆盖所有时间点，获取时需要处理缺少的时间点，具体方案查找相邻时间点的数据
function getJinJiaDataByTime(jinjiaData, symbol, time, key){
  if(jinjiaData[symbol] == null){
    return null
  }
  if(jinjiaData[symbol][time] != null){
    return jinjiaData[symbol][time][key]
  }
  var findNextTime = null
  for(var timeKey in jinjiaData[symbol]){
    var isBig = compireTwoTime(timeKey, 'bigger', time)
    if(isBig == true){
      findNextTime = timeKey
      break
    }
  }
  if(jinjiaData[symbol][findNextTime] != null){
    // console.log('由于' + time + '的时间为空，使用下一个时间' + findNextTime)
    return jinjiaData[symbol][findNextTime][key]
  }
  return null
}

//检查有效日期
async function checkVaildDate(fullObject, config){
  if(fullObject.isRealRun){
    if(fullObject.isWaitingMode == true){
      await YWRequest.CheckVaildDate(fullObject.start_date, config.day, fullObject.isWaitingMode)
      if(config.day2 != null){
          await YWRequest.CheckVaildDate(fullObject.start_date, config.day2, fullObject.isWaitingMode)
      }
    }else{
      var isVaildDate = false
      if(config.day != null){
        isVaildDate = await YWRequest.CheckVaildDate(fullObject.start_date, config.day, fullObject.isWaitingMode)
      }else if(config.day2 != null){
        isVaildDate = await YWRequest.CheckVaildDate(fullObject.start_date, config.day2, fullObject.isWaitingMode)
      }
      if(isVaildDate == false){
        return []
      }
    }
  }
}

//模版规则列表
export var templateRules = []

export const RuleList = [
    {
      name: '输入数据',   //用于告诉程序这个策略需要获取多少天的股票数据进行评测
      id: '0',            //序号
      des: '用于告诉程序这个策略输入的数据第一天的日期，策略将以此日期做为第一个交易日的数据，也是所有策略的首个添加的规则，用于提供数据，注意：这个日期修改只会影响点击检查的结果，不会影响回测的结果，只是用于在编辑规则的时候切换不同的日期查看这一天的执行结果，如果需要修改回测的年份，请在回测配置中修改',
      key: 'ruleOfDayCount',  //唯一key
      forceChecked: true, //必须选中
      group: [RuleType.RuleOfSelect],
      values:  [{key: 'start_date', type: 'OneDatePicker', value: '2024-01-02',  
        disabledDate: (day)=>{ 
          return YWRequest.tradeDateDit[day.format('YYYY-MM-DD')] == null
        }
      }],
      // 貌似没有用到  {key: 'day', type: 'number', value: 30, before:'获取', after: '个交易日', min: 1, max: 365, step: 1}
      //arr是进行筛选的股票代码数组，config是当前规则的配置，fullObject是整个执行过程中产生的数据
      filter: (arr, config, fullObject)=>{
        //暂时先这样，返回dataArr，日期列表另外获取
        fullObject.start_date = config.start_date
        // fullObject.daySpace = config.day  //记录一下需要获取的股票天数范围
        return Object.keys(YWRequest.allSymbolDit)//GetNextDaysData(config.start_date, config.day).dataArr
      }
    },
    {
      name: '股票类型筛选', //这个规则的名称
      id: '10',            //序号
      des: '用于筛选股票类型科创板等，后续增加股票板块的筛选',
      key: 'ruleOfSymbolType',  //唯一key
      //参数列表
      values:  [
        {key: 'searchType', type: 'select', value: 'notcontain', options: [{value: 'notcontain', label: '不属于'}, {value: 'contain', label: '属于'}], des: '当选择属于时，股票只要属于任意一个勾选的股票池，就符合条件，当选择不属于时，筛选出的股票需要不属于每一个勾选的股池'},
        {key: 'groups', value: ['BJ', 'new', 'secondNew', 'cy', 'kc', 'st', 'ts'], type: 'checkboxGroup' , options: SymbolGroupOption}
        
      ],
      filter: (arr, config, fullObject)=>{
        arr = arr.filter((symbol)=>{
          var result = false
          if(config.searchType == 'notcontain'){
            result = true
          }
          for(var i = 0; i < config.groups.length; i++){
            var str = config.groups[i]
            if(config.searchType == 'notcontain'){
              //只要代码开头不是就 不属于
              //当不属于时，得满足所有条件才能返回true
              if(YWRequest.symbolEx[str] != null){
                result = symbol.indexOf(str) == -1 
              }else if(YWRequest.symbolGroupDit[str] != null){
                result = YWRequest.symbolGroupDit[str][symbol] == null
              }
              if(result == false){
                break
              }
            }else if(config.searchType == 'contain'){
              //必须是在开头才算，目前很多股票都是以开头来分类的
              //当属于时，满足任意一个条件就返回
              // console.log('YWRequest.symbolEx', YWRequest.symbolEx, str, symbol)
              if(YWRequest.symbolEx[str] != null){
                result = symbol.indexOf(str) != -1 
              }else if(YWRequest.symbolGroupDit[str] != null){
                result = YWRequest.symbolGroupDit[str][symbol] != null
              }else{
                // return false
              }
              if(result == true){
                break
              }
            }
          }
          return result
        })
        config = null
        return arr
      },
    },
    {
      name: '股票名称条件', //这个规则的名称
      id: '1',            //序号
      des: '用于筛选股票名称中是否包含某些字符，同时也可以用来判断这个股票是否ST，因为ST的股票名称中会带有ST，注意：下载股票数据的时候已经剔除了ST股票，所以在模拟策略时需要添加不包含ST股票的规则，因为ST股票无法获取到数据',
      key: 'ruleOfSymbolName',  //唯一key
      //参数列表
      values:  [{key: 'searchType', type: 'select', value: 'notcontain', options: [{value: 'notcontain', label: '不包含'}, {value: 'contain', label: '包含'}]},{key: 'str', value: 'ST', type: 'autoInput', options: 'allSymbolNameArr'}],
      //筛选方法，暂时只有必要条件会直接操作股票列表，非必要条件，将对股票进行加分
      filter: (arr, config, fullObject)=>{
        arr = arr.filter((item)=>{
            var name = YWRequest.allSymbolDit[item]
            if(name == null){
                return false
            }
            if(config.searchType == 'notcontain'){
                return name.indexOf(config.str) == -1
            }else if(config.searchType == 'contain'){
                return name.indexOf(config.str) != -1
            }
        })
        config = null
        return arr
      },
    },
    {
      name: '股票代码筛选', //这个规则的名称
      id: '9',            //序号
      des: '用于筛选股票代码中是否包含某些字符，股票代码包含后缀，其中.SZ表示深市，.SH表示沪市，.BJ表示北交所，又或者筛选包含666的股票代码',
      key: 'ruleOfSymbolCode',  //唯一key
      //参数列表
      values:  [{key: 'searchType', type: 'select', value: 'notcontain', options: [{value: 'notcontain', label: '不包含'}, {value: 'contain', label: '包含'}]},{key: 'str', value: '.BJ', type: 'input'}],
      //筛选方法，暂时只有必要条件会直接操作股票列表，非必要条件，将对股票进行加分
      filter: (arr, config, fullObject)=>{
        arr = arr.filter((symbol)=>{
            if(config.searchType == 'notcontain'){
                return symbol.indexOf(config.str) == -1
            }else if(config.searchType == 'contain'){
                return symbol.indexOf(config.str) != -1
            }
        })
        config = null
        return arr
      },
    },
    {
      name: '股票所属行业筛选', //这个规则的名称
      id: '39',            //序号
      des: '用于筛选股票所属的行业分类，行业板块的列表可在系统设置中更新',
      key: 'ruleOfSymbolByHangye',  //唯一key
      //参数列表
      values:  [
        {key: 'searchType', type: 'select', value: 'notcontain', options: [{value: 'notcontain', label: '不属于'}, {value: 'contain', label: '属于'}], des: '当选择属于时，股票只要属于任意一个勾选的行业，就符合条件，当选择不属于时，筛选出的股票需要不属于每一个勾选的行业'},
        {key: 'groups', type: 'select', value: [], width: '500px' , maxTagCount: 5, mode: 'multiple', options: 'hangyeOptions'},
      ],
      filter: (arr, config, fullObject)=>{
        arr = arr.filter((symbol)=>{
           var result = false
          if(config.searchType == 'notcontain'){
            result = true
          }
          for(var i = 0; i < config.groups.length; i++){
            var hangye = config.groups[i]
            // console.log("config", YWRequest.hangyeSymbols[hangye], symbol, YWRequest.hangyeSymbols[hangye][symbol] )

            if(config.searchType == 'notcontain'){
              //只要代码开头不是就 不属于
              //当不属于时，得满足所有条件才能返回true
              if(YWRequest.hangyeSymbols[hangye] != null){
                result = YWRequest.hangyeSymbols[hangye][symbol] == null
              }
              if(result == false){
                break
              }
            }else if(config.searchType == 'contain'){
              //必须是在开头才算，目前很多股票都是以开头来分类的
              //当属于时，满足任意一个条件就返回
              // console.log('YWRequest.symbolEx', YWRequest.symbolEx, str, symbol)
              if(YWRequest.hangyeSymbols[hangye] != null){
                result = YWRequest.hangyeSymbols[hangye][symbol] != null
              }
              if(result == true){
                break
              }
            }
          }
          return result
        })
        config = null
        return arr
      },
    },
    {
      name: '股票上市天数筛选', //这个规则的名称
      id: '34',            //序号
      des: '次新股和新股股池仅能获取近期的，在回测时应该通过股票的上市日期来判断测试的那一天是否为新股，从而实现在回测时过滤掉新股。当前股票的上市日期只能获取到2010年之后上市的股票，2010年之前上市的股票将默认通过筛选。注意，此规则同时会筛选掉策略执行到那一天还没有上市的股票',
      key: 'ruleOfSymbolDate',  //唯一key
      //参数列表
      values:  [
        {key: 'compire', type: 'select', value: 'bigger', options: CompireOption},
        {key: 'days', value: 365, type: 'number', min: 1 , step: 1, formatter:value => `${value}天`, parser:value => Number(value.replace('天', ''))},
      ],
      filter: (arr, config, fullObject)=>{
        if(YWRequest.symbolGroupDit['symbolStartDate'] != null){
            arr = arr.filter((symbol)=>{
              var result = false //如果没有股票的上市日期，默认就是true
              var symbolStartDate = YWRequest.symbolGroupDit['symbolStartDate'][symbol]
              if(symbolStartDate == null){
                symbolStartDate = '2009-01-01'
              }
              var days = moment(fullObject.start_date).diff(moment(symbolStartDate), 'days')
              if(days >= 0){
                  //如果days小于0说明还没有上市，更没有比较的意义了
                  result = compireTwoValue(days, config.compire, config.days)
                  // if(result == true){
                  //   // console.log(symbol, '的上市日期',  symbolStartDate, days )
                  // }else{
                  //   console.log(symbol, '的上市日期',  symbolStartDate, days )
                  // }
              }
              return result
            })
        }
        config = null
        return arr
      },
    },
    {
      name: '第n日已经连续上涨x天', //这个规则的名称
      id: '44',            //序号
      des: '筛选出连续上涨的股票，收盘价大于开盘价则判定为上涨',
      key: 'ruleOfContinuousUp',  //唯一key
      //参数列表
      values:  [
        {key: 'day', type: 'number', value: 1, min: -365, max: 365, step: 1, formatter:value => `第${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
        {key: 'days', value: 5, type: 'number', min: 1 , step: 1, max: 30, before: '连涨天数', width:'150px', formatter:value => `${value}天`, parser:value => Number(value.replace('天', ''))},
        // {key: 'compire', type: 'select', value: 'biggerEquire', options: CompireOption},
      ],
      filter: async (arr, config, fullObject)=>{
        // var symbolsDit = strArrToDit(arr)
        // var dapanData = await YWRequest.getOneDayDataDeal(fullObject.start_date, 1, arr)

        //如果没有交易日会默认获取上一天的
        var startDate = YWRequest.GetNextDay(fullObject.start_date, config.day)
        var {dataArr, dateArr} = await YWRequest.GetUpperDaysDataDeal(startDate, config.days, arr)
        // if(dateArr[0] != fullObject.start_date){
        //   console.warn('注意传入的fullObject.start_date不是交易日，回测时将不会出现这一天的操作')
        // }
        // console.log('dateArr', dateArr)

        var valueDit = {}
        for(var i = 0; i < dataArr.length; i++){
          var upDapanDataDit = arrToDit(dataArr[i], '代码')
          // console.log('upDapanDataDit', upDapanDataDit, arr)
          for(var j = 0; j < arr.length; j++){
            var symbol = arr[j]
            if(upDapanDataDit[symbol] != null){
              var firstValue = getSymbolDataByKey(upDapanDataDit[symbol], '开盘') 
              var secondValue = getSymbolDataByKey(upDapanDataDit[symbol], '收盘')
              if(secondValue > firstValue){
                if(valueDit[symbol] == null){
                  valueDit[symbol] = 1
                }else{
                   valueDit[symbol] += 1
                }
              }
            }
            firstValue = null
            secondValue = null
            symbol = null
          }
          upDapanDataDit = null
        }

        // var dapanDataDit = arrToDit(dataArr[0], '代码')
        // dataArr.splice(0, 1) //返回的数据包含 start_date 的数据，这里不需要，所以删除

        arr = arr.filter((symbol)=>{
          // let value = valueDit[symbol]
          // if(value == null){
          //   value = 0
          // }
          // return compireTwoValue(value, config.compire, config.days)
          return valueDit[symbol] == config.days
        })
        valueDit = null
        // symbolsDit = null
        dataArr = null
        dateArr = null
        config = null
        return arr
      },
    },
    {
      name: '第n日已经连续下跌x天', //这个规则的名称
      id: '45',            //序号
      des: '筛选出连续下跌的股票，收盘价小于开盘价则判定为下跌',
      key: 'ruleOfContinuousDown',  //唯一key
      //参数列表
      values:  [
        {key: 'day', type: 'number', value: 1, min: -365, max: 365, step: 1, formatter:value => `第${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
        {key: 'days', value: 5, type: 'number', min: 1 , step: 1, max: 30, before: '连跌天数', width:'150px', formatter:value => `${value}天`, parser:value => Number(value.replace('天', ''))},
        // {key: 'compire', type: 'select', value: 'biggerEquire', options: CompireOption},
      ],
      filter: async (arr, config, fullObject)=>{
        // var symbolsDit = strArrToDit(arr)
        // var dapanData = await YWRequest.getOneDayDataDeal(fullObject.start_date, 1, arr)

        //如果没有交易日会默认获取上一天的
        var startDate = YWRequest.GetNextDay(fullObject.start_date, config.day)
        var {dataArr, dateArr} = await YWRequest.GetUpperDaysDataDeal(startDate, config.days, arr)
        // if(dateArr[0] != fullObject.start_date){
        //   console.warn('注意传入的fullObject.start_date不是交易日，回测时将不会出现这一天的操作')
        // }
        // console.log('dateArr', dateArr)

        var valueDit = {}
        for(var i = 0; i < dataArr.length; i++){
          var upDapanDataDit = arrToDit(dataArr[i], '代码')
          // console.log('upDapanDataDit', upDapanDataDit, arr)
          for(var j = 0; j < arr.length; j++){
            var symbol = arr[j]
            if(upDapanDataDit[symbol] != null){
              var firstValue = getSymbolDataByKey(upDapanDataDit[symbol], '开盘') 
              var secondValue = getSymbolDataByKey(upDapanDataDit[symbol], '收盘')
              if(secondValue < firstValue){
                if(valueDit[symbol] == null){
                  valueDit[symbol] = 1
                }else{
                   valueDit[symbol] += 1
                }
              }
            }
            firstValue = null
            secondValue = null
            symbol = null
          }
          upDapanDataDit = null
        }

        // var dapanDataDit = arrToDit(dataArr[0], '代码')
        // dataArr.splice(0, 1) //返回的数据包含 start_date 的数据，这里不需要，所以删除

        arr = arr.filter((symbol)=>{
          // let value = valueDit[symbol]
          // if(value == null){
          //   value = 0
          // }
          // return compireTwoValue(value, config.compire, config.days)
          return valueDit[symbol] == config.days
        })
        valueDit = null
        // symbolsDit = null
        dataArr = null
        dateArr = null
        config = null
        return arr
      },
    },
    {
      name: '第n日大盘恐慌程度', //这个规则的名称
      id: '42',            //序号
      des: '下跌行情中，1日的下跌不会恐慌，2日下跌也不会恐慌，但连续3日，乃至连续4日，连续5日下跌会使投资者感到恐慌，计算方式是连续下跌>=x天的股票占比，建议此值为连续下跌5天的股票占比5%，大盘往往会开始反弹。注意：当此规则放在选股规则中，如果触发恐慌，会返回所有输入的股票，如果不触发则不会返回任何股票，当此规则放在买入规则，可以实现触发恐慌才买入',
      key: 'ruleOfPanicIndex',  //唯一key
      //参数列表
      values:  [
        {key: 'day', type: 'number', value: 1, min: 1, max: 365, step: 1, formatter:value => `第${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
        {key: 'days', value: 5, type: 'number', min: 1 , step: 1, max: 30, before: '连跌天数', width:'150px', formatter:value => `${value}天`, parser:value => Number(value.replace('天', ''))},
        {key: 'compire', type: 'select', value: 'bigger', options: CompireOption},
        {key: 'secondValue', type: 'number', value: 5,  min: 0, step:0.5, max: 100,  before: '股票占比', width:'150px',  formatter:value => `${value}%`, parser:value => Number(value.replace('%', ''))},
      ],
      filter: async (arr, config, fullObject)=>{
        var backArr = await checkVaildDate(fullObject, config)
        if(backArr != null){
          return backArr
        }

        // var day = config.day - 1
        //这里要筛选掉退市股
        var vaildArr = arr
        if(YWRequest.symbolGroupDit['ts'] != null){
          vaildArr = arr.filter((symbol)=>{
            return YWRequest.symbolGroupDit['ts'][symbol] == null
          })
        }
        var startDate = YWRequest.GetNextDay(fullObject.start_date, config.day)
        // console.log('fullObject.start_date', fullObject.start_date, day, startDate)
        var {dataArr, dateArr} = await YWRequest.GetUpperDaysDataDeal(startDate, config.days, vaildArr)
        // console.log('GetUpperDaysData', dataArr, dateArr)

        // var result2 = await YWRequest.GetUpperDaysDataDB(startDate, config.days)
        // console.log('GetUpperDaysData2', result2)

        var valueDit = {}
        for(var i = 0; i < dataArr.length; i++){
          for(var j = 0; j < dataArr[i].length; j++){
            var symbol = dataArr[i][j]['代码']
            // if(YWRequest.symbolGroupDit['ts'] != null && YWRequest.symbolGroupDit['ts'][symbol] != null){
            //   //过滤掉退市的股票
            //   continue
            // }
            var firstValue = getSymbolDataByKey(dataArr[i][j], '开盘') 
            var secondValue = getSymbolDataByKey(dataArr[i][j], '收盘')
            // if(firstValue == null || secondValue == null){
            //   continue
            // }
            if(firstValue != null || secondValue != null){
                if(secondValue < firstValue){
                  if(valueDit[symbol] == null){
                    valueDit[symbol] = 1
                  }else{
                    valueDit[symbol] += 1
                  }
                }
            }
            firstValue = null
            secondValue = null
            symbol = null
          }
        }

        var count = 0
        var fenmu = 0
        for(var symbol in valueDit){
          if(valueDit[symbol] == config.days){
            count += 1
          }
          fenmu += 1
        }
        // console.log('连跌valueDit', count, fenmu)
        var result = compireTwoValue(count / fenmu * 100 , config.compire, config.secondValue)
        if(result == false){
          arr = []
        }
        vaildArr = null
        valueDit = null
        config = null
        return arr
      },
    },
    {
      name: '第n日大盘贪婪程度', //这个规则的名称
      id: '43',            //序号
      des: '同理连续多日的上涨，容易出现情绪高点。和恐慌情绪虽有相似，又不完全一致，计算方式是连续上涨>=x天的股票占比，建议此值为连续3天上涨的股票数量占比24%，大盘往往会开始回撤。注意：当此规则放在选股规则中，如果触发贪婪，会返回所有输入的股票，如果不触发则不会返回任何股票，当此规则放在卖出规则，可以实现触发贪婪才卖出',
      key: 'ruleOfGreedyIndex',  //唯一key
      //参数列表
      values:  [
        {key: 'day', type: 'number', value: 2, min: 1, max: 365, step: 1, formatter:value => `第${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
        {key: 'days', value: 3, type: 'number', min: 1 , step: 1, max: 30, before: '连涨天数', width:'150px', formatter:value => `${value}天`, parser:value => Number(value.replace('天', ''))},
        {key: 'compire', type: 'select', value: 'bigger', options: CompireOption},
        {key: 'secondValue', type: 'number', value: 24,  min: 0, step:0.5, max: 100,  before: '股票占比', width:'150px',  formatter:value => `${value}%`, parser:value => Number(value.replace('%', ''))},
      ],
      filter: async (arr, config, fullObject)=>{
        var backArr = await checkVaildDate(fullObject, config)
        if(backArr != null){
          return backArr
        }


        var vaildArr = arr
        if(YWRequest.symbolGroupDit['ts'] != null){
          vaildArr = arr.filter((symbol)=>{
            return YWRequest.symbolGroupDit['ts'][symbol] == null
          })
        }
        // var day = config.day - 1
        var startDate = YWRequest.GetNextDay(fullObject.start_date, config.day)
        // console.log('fullObject.start_date', fullObject.start_date, day, startDate)
        var {dataArr, dateArr} = await YWRequest.GetUpperDaysDataDeal(startDate, config.days, vaildArr)


        var valueDit = {}
        for(var i = 0; i < dataArr.length; i++){
          for(var j = 0; j < dataArr[i].length; j++){
            var symbol = dataArr[i][j]['代码']
            // if(YWRequest.symbolGroupDit['ts'] != null && YWRequest.symbolGroupDit['ts'][symbol] != null){
            //   //过滤掉退市的股票
            //   continue
            // }
            var firstValue = getSymbolDataByKey(dataArr[i][j], '开盘') 
            var secondValue = getSymbolDataByKey(dataArr[i][j], '收盘')
            if(firstValue != null || secondValue != null){
                if(secondValue > firstValue){
                if(valueDit[symbol] == null){
                  valueDit[symbol] = 1
                }else{
                  valueDit[symbol] += 1
                }
              }
            }
            firstValue = null
            secondValue = null
            symbol = null
          }
        }

        var count = 0
        var fenmu = 0
        for(var symbol in valueDit){
          if(valueDit[symbol] == config.days){
            count += 1
          }
          fenmu += 1
        }
        // console.log('连跌valueDit', count, fenmu)
        var result = compireTwoValue(count / fenmu * 100 , config.compire, config.secondValue)
        if(result == false){
          arr = []
        }
        vaildArr = null
        valueDit = null
        config = null
        return arr
      },
    },
    {
      name: '任意n个条件满足', 
      id: '2',
      des: '当有多个条件是非全部要满足，而是任意满足其中n个即可时，使用此规则，同时指令放置在此元素下，注意:n必须小于等于输入的规则数量，当n等于输入的规则数量时，等同于所有条件满足',
      key: 'orRule',  //唯一key
      inCardBottom: true,
      hasConfigPopover: true,//是否传递父级配置
      getTitle: function(){
        return '任意' + this.values[0].value + '个条件满足'
      },
      values: [
        {key: 'trueCount', value: 1, type: 'number', min: 1 , step: 1, formatter:value => `${value}个`, parser:value => Number(value.replace('个', ''))},
        {key: 'configPopover', title: '传递参数', value: false, type: 'bool', des: '当此规则嵌套在另一个规则下时，可以设置是否传递父节点的可变参数给子节点'},  //是否支持传递上级节点传入的配置到自己的子节点
        {key: 'rules', value: [], type: 'values', inBottom: true}],
      filter: async (arr, config, fullObject, dapanMinDataDit)=>{
        var dit = {}
        for(var i = 0; i < config.rules.length; i++){
          var oneRule = config.rules[i]
          if(oneRule.checked != true){
            continue
          }
          if(RuleDit[oneRule.key] != null){
            var oneConfig = arrToDit(oneRule.values, 'key', 'value')
            oneConfig.ruleId = oneRule.id
            if(config.configPopover == true){
              for(var key in config){
                if(key != 'configPopover' && key != 'rules' && key != 'ruleId' && key != 'trueCount'){
                  oneConfig[key] = config[key]
                }
              }
            }
            var onearr = await RuleDit[oneRule.key].filter(arr, oneConfig, fullObject, dapanMinDataDit)
            oneRule.resultCount = onearr.length
            for(var j = 0; j < onearr.length; j++){
              if(dit[onearr[j]] == null){
                dit[onearr[j]] = 1
              }else{
                dit[onearr[j]] += 1
              }
            }
            oneConfig = null
            onearr = null
          }else{
            console.log('规则缺失', oneRule)
          }
          oneRule = null
        }
        // return Object.keys(dit)
        arr = arr.filter((item)=>{
          //至少满足其中n个条件
          return dit[item] >= config.trueCount
        })
        dit = null
        config = null
        return arr
      }
    },
    {
      name: '所有条件满足', 
      id: '3',
      des: '当有多个条件全部要满足时，使用此规则，同时指令放置在此元素下，可以和任意条件满足嵌套使用，此规则中的所有子规则顺序执行，先执行的规则会优先筛选掉不符合规则的股票。',
      key: 'andRule',  //唯一key
      inCardBottom: true,
      hasConfigPopover: true,//是否传递父级配置
      values: [
        {key:'configPopover', title: '传递参数', value: false, type: 'bool', des: '当此规则嵌套在另一个规则下时，可以设置是否传递父节点的可变参数给子节点'},  //是否支持传递上级节点传入的配置到自己的子节点
        {key:'rules', value: [], type: 'values', inBottom: true}
      ],
      filter: async (arr, config, fullObject, dapanMinDataDit)=>{
        for(var i = 0; i < config.rules.length; i++){
          var oneRule = config.rules[i]
          if(oneRule.checked != true){
            continue
          }
          if(RuleDit[oneRule.key] != null){
            var oneConfig = arrToDit(oneRule.values, 'key', 'value')
            oneConfig.ruleId = oneRule.id
            if(config.configPopover == true){
              for(var key in config){
                if(key != 'configPopover' && key != 'rules' && key != 'ruleId'){
                  oneConfig[key] = config[key]
                }
              }
            }
            arr = await RuleDit[oneRule.key].filter(arr, oneConfig, fullObject, dapanMinDataDit)
            oneRule.resultCount = arr.length
            oneConfig = null
            if(arr.length == 0){
              //筛选结果已经为0了，没有在继续下去的意义了
              break
            }
          }else{
            console.log('规则缺失', oneRule)
          }
          oneRule = null
        }
        return arr
      }
    },
    {
      name: '等待所有条件满足', 
      id: '40',
      des: '此规则用于嵌套在循环规则中，会记录子节点每次循环的结果，当所有子节点都触发过时，此条件会触发，通过此规则，可以实现循环第一次规则1触发，规则2没触发，此规则不触发，循环第三次时规则1未触发，规则2触发，但由于规则1已经在第一次触发，所以第三次时此规则将触发。当此规则没有嵌套在循环规则下时，其功能和【所有条件满足】相同。此规则可以分别对每个子规则需要触发的次数进行设置，在每个子规则的前面有个需要出发次数的标签，当标签为空时默认需要触发1次，当标签不为空时，子规则累计触发次数需要达到标签次数才能触发，注意：标签填的次数一定要小于等于循环次数，如果大于循环次数，此规则将永远不会触发',
      key: 'waitEveryRuleToggle',  //唯一key
      inCardBottom: true,
      hasConfigPopover: true, //是否传递父级配置
      values: [
        {key: 'needSequence', title: '是否需要按顺序触发', value: false, type: 'bool', des: '当按顺序触发时，必须所有规则按照由上往下的顺序触发才可以，当后面的规则比前面的规则先触发时，将被忽略'},  //是否支持传递上级节点传入的配置到自己的子节点
        {key: 'configPopover', title: '传递参数', value: true, type: 'bool', des: '当此规则嵌套在另一个规则下时，可以设置是否传递父节点的可变参数给子节点，注意，此规则一定需要开启这个配置'},  //是否支持传递上级节点传入的配置到自己的子节点
        {key: 'rules', value: [], type: 'values', inBottom: true, showChildScore: true}
      ],
      filter: async (arr, config, fullObject, dapanMinDataDit)=>{
        // console.log('waitEveryRuleToggle config', config, this)
        var thisRuleId = 'waitEveryRuleToggle_' + config.ruleId
        if(config.ruleId == null){
          console.log('waitEveryRuleToggle_ config.ruleId不应该为空')
        }
        if(fullObject[thisRuleId] == null){
          fullObject[thisRuleId] = {}
        }
        // var ruleToggleDit = {}
        // var thisRuleId = 'config'
        var rulesToggleCountDit = {}

        for(var i = 0; i < config.rules.length; i++){
          var oneRule = config.rules[i]
          if(oneRule.checked != true){
            continue
          }
          if(RuleDit[oneRule.key] != null){
            rulesToggleCountDit[oneRule.id] = (oneRule.score ? oneRule.score : 1)
            var oneConfig = arrToDit(oneRule.values, 'key', 'value')
            oneConfig.ruleId = oneRule.id
            if(config.configPopover == true){
              for(var key in config){
                if(key != 'configPopover' && key != 'rules' && key != 'needScore' && key != 'ruleId'){
                  oneConfig[key] = config[key]
                }
              }
            }
            var onearr = await RuleDit[oneRule.key].filter(arr, oneConfig, fullObject, dapanMinDataDit)
            oneRule.resultCount = onearr.length
            for(var j = 0; j < onearr.length; j++){
              let symbol = onearr[j]
              if(fullObject[thisRuleId][symbol] == null){
                fullObject[thisRuleId][symbol] = {}
              }
              if(config.needSequence == true){
                if(i > 0){
                  var upRuleId = config.rules[i - 1].id
                  if(!(fullObject[thisRuleId][symbol][upRuleId] >= rulesToggleCountDit[upRuleId])){
                    //上一个规则还没有被触发，忽略当前触发的规则
                    continue
                  }
                }
              }
              if(fullObject[thisRuleId][symbol][oneRule.id] == null){
                fullObject[thisRuleId][symbol][oneRule.id] = 1
              }else{
                fullObject[thisRuleId][symbol][oneRule.id] += 1
              }
            }
            oneConfig = null
            onearr = null
          }else{
            console.log('规则缺失', oneRule)
          }
          oneRule = null
        }
        // console.log("rulesToggleCountDit", config.day, rulesToggleCountDit, JSON.parse(JSON.stringify(fullObject[thisRuleId])))
        arr = arr.filter((symbol)=>{
          //说明这个股票全部满足条件
          var result = true
          if(fullObject[thisRuleId][symbol] != null){
            for(var ruleId in rulesToggleCountDit){
                if(fullObject[thisRuleId][symbol][ruleId] >= rulesToggleCountDit[ruleId]){
                  //当每个都达到指定次数就可以返回true了
                }else{
                  result = false
                  break
                }
            }
          }else{
            //没有说明一次条件都没触发
            result = false
          }
          return result
        })
        rulesToggleCountDit = null
        thisRuleId = null
        return arr
      }
    },
    {
      name: '任意n个条件累计分值达标', 
      id: '29',
      des: '可以对此规则下的每一个条件进行分值权重设定，条件满足时获得对应分值，当权重为负时，触发了条件会扣分，筛选得分超过设定值的股票，此规则比任意n个条件满足具有更高的灵活性',
      key: 'scoreAddRule',  //唯一key
      inCardBottom: true,
      hasConfigPopover: true,//是否传递父级配置
      values: [
        {key: 'needScore', value: 60, type: 'number',  step: 5, formatter:value => `${value}分`, parser:value => Number(value.replace('分', ''))},
        {key: 'configPopover', title: '传递参数', value: false, type: 'bool', des: '当此规则嵌套在另一个规则下时，可以设置是否传递父节点的可变参数给子节点'},  //是否支持传递上级节点传入的配置到自己的子节点
        {key: 'rules', value: [], type: 'values', inBottom: true, showChildScore: true}
      ],
      filter: async (arr, config, fullObject, dapanMinDataDit)=>{
        var dit = {}
        for(var i = 0; i < config.rules.length; i++){
          var oneRule = config.rules[i]
          if(oneRule.checked != true){
            continue
          }
          if(RuleDit[oneRule.key] != null){
            var oneConfig = arrToDit(oneRule.values, 'key', 'value')
            oneConfig.ruleId = oneRule.id
            if(config.configPopover == true){
              for(var key in config){
                if(key != 'configPopover' && key != 'rules' && key != 'needScore' && key != 'ruleId'){
                  oneConfig[key] = config[key]
                }
              }
            }
            var onearr = await RuleDit[oneRule.key].filter(arr, oneConfig, fullObject, dapanMinDataDit)
            oneRule.resultCount = onearr.length
            for(var j = 0; j < onearr.length; j++){
              if(dit[onearr[j]] == null){
                 dit[onearr[j]] = (oneRule.score ? oneRule.score : 0)
              }else{
                dit[onearr[j]] += (oneRule.score ? oneRule.score : 0)
              }
            }
            oneConfig = null
            onearr = null
          }else{
            console.log('规则缺失', oneRule)
          }
          oneRule = null
        }
        arr = arr.filter((symbol)=>{
          //说明这个股票全部满足条件
          return dit[symbol] >= config.needScore //config.rules.length
        })
        dit = null
        return arr
      }
    },
    {
      name: '第n日是否涨停', 
      id: '4',
      des: '筛选第n日是否涨停，n为以当前输入日期开始算第n个交易日，当n为1时，就是当前输入的日期',
      key: 'isUpStop',  //唯一key
      justByDay: true, 
      getTitle: function(hideChildKeys){
        if(hideChildKeys != null && hideChildKeys.indexOf('day') != -1){
          return '是否涨停'
        }else{
          return '第' + this.values[0].value + '日是否涨停'
        }
      },
      values:  [
        {key: 'day', type: 'number', value: 1, min: 1, max: 365, step: 1, formatter:value => `n=${value}`, parser:value => Number(value.replace('n=', ''))},
        {key: 'isTrue', type: 'select', value: 'true', options: BoolenOption},
      ],
      filter: async (arr, config, fullObject)=>{
        var backArr = await checkVaildDate(fullObject, config)
        if(backArr != null){
          return backArr
        }

          // var symbolsDit = strArrToDit(arr)
          var dapanData = await YWRequest.getOneDayDataDeal(fullObject.start_date, config.day, arr, {select: GenSelectKeys(['涨停价'])})  //['symbol', 'close', 'precolse', 'updownpre']
          // console.log('是否涨停规则获取到的dapanData', dapanData)

          // var dapanData2 = await YWRequest.getOneDayDataDB(fullObject.start_date, config.day, arr)

          // console.log('db获取到的dapanData2', dapanData2)


          var dapanDataDit = arrToDit(dapanData, '代码')
          arr = arr.filter((symbol)=>{
            var result = false
            if(dapanDataDit[symbol] != null){
              if(dapanDataDit[symbol]['涨跌幅'] < 0){
                //如果涨幅为负就一定不是涨停了
              }else{
                result = isUpOrDownStop(dapanDataDit[symbol])
              }
            }
            if(config.isTrue == 'false'){
              result = !result
            }
            return result
          })
          // symbolsDit = null
          dapanData = null
          dapanDataDit = null
          return arr
      }
    },
    {
      name: '第n日分时是否涨停', 
      id: '48',
      des: '筛选第n日某一时刻是否涨停，n为以当前输入日期开始算第n个交易日，当n为1时，就是当前输入的日期',
      key: 'minisUpStop',  //唯一key
      needMinData: true,
      getTitle: function(hideChildKeys){
        // console.log('hideChildKeys', hideChildKeys)
        if(hideChildKeys != null && hideChildKeys.length > 0){
          var str = ''
          if(hideChildKeys.indexOf('day') == -1){
            str = '第' + this.values[0].value + '日'
          }
          if(hideChildKeys.indexOf('time') == -1){
            str += this.values[1].value + '分'
          }
          return str + '是否涨停'
        }else{
          return '第' + this.values[0].value + '日' + this.values[1].value + '分是否涨停'
        }
      },
      values:  [
        {key: 'day', type: 'number', value: 1, min: 1, max: 365, step: 1, formatter:value => `n=${value}`, parser:value => Number(value.replace('n=', ''))},
        {key: 'time', type: 'select', value: '09:45', options: 'minOption'},
        {key: 'isTrue', type: 'select', value: 'true', options: BoolenOption},
      ],
      filter: async (arr, config, fullObject, dapanMinDataDit)=>{
        var backArr = await checkVaildDate(fullObject, config)
        if(backArr != null){
          return backArr
        }

        if(dapanMinDataDit == null){
            //如果传入了就不需要重复获取了
            dapanMinDataDit = await YWRequest.getOneDayMinDataByType(fullObject.start_date, config.day, arr, {timeDit: true, justTimes: [config.time]}, huiceConfig.secondKLine)
        }

          // var symbolsDit = strArrToDit(arr)
          var dapanData = await YWRequest.getOneDayDataDeal(fullObject.start_date, config.day, arr, {select: GenSelectKeys(['涨停价'])})  //['symbol', 'close', 'precolse', 'updownpre']
          // console.log('是否涨停规则获取到的dapanData', dapanData)

          // var dapanData2 = await YWRequest.getOneDayDataDB(fullObject.start_date, config.day, arr)

          // console.log('db获取到的dapanData2', dapanData2)
          var dapanDataDit = arrToDit(dapanData, '代码')
          arr = arr.filter((symbol)=>{
            var result = false
            if(dapanDataDit[symbol] != null && dapanMinDataDit[symbol] != null){
              if(dapanMinDataDit[symbol][config.time] != null){
                  var closePrice =  getSymbolDataByKey(dapanMinDataDit[symbol][config.time], '收盘')
                  var upDonwPrice = getSymbolDataByKey(dapanDataDit[symbol], '涨停价')
                  // console.log('判断分时是否涨停', closePrice, upDonwPrice)
                  result = compireTwoValue(closePrice, 'equire', upDonwPrice)
              }
            }
            if(config.isTrue == 'false'){
              result = !result
            }
            return result
          })
          // symbolsDit = null
          dapanData = null
          dapanDataDit = null
          dapanMinDataDit = null
          return arr
      }
    },
    {
      name: '第n日是否跌停', 
      id: '5',
      des: '筛选第n日是否跌停，n为以当前输入日期开始算第n个交易日，当n为1时，就是当前输入的日期',
      key: 'isDownStop',  //唯一key
      justByDay: true, 
      getTitle: function(hideChildKeys){
        if(hideChildKeys != null && hideChildKeys.indexOf('day') != -1){
          return '是否跌停'
        }else{
          return '第' + this.values[0].value + '日是否跌停'
        }
      },
      values:  [
        {key: 'day', type: 'number', value: 1, min: 1, max: 365, step: 1, formatter:value => `n=${value}`, parser:value => Number(value.replace('n=', ''))},
        {key: 'isTrue', type: 'select', value: 'true', options: [{value: 'true', label: '是'}, {value: 'false', label: '否'}]}
      ],
      filter: async (arr, config, fullObject)=>{
        var backArr = await checkVaildDate(fullObject, config)
        if(backArr != null){
          return backArr
        }

          // var symbolsDit = strArrToDit(arr)
          var dapanData = await YWRequest.getOneDayDataDeal(fullObject.start_date, config.day, arr, {select: GenSelectKeys(['跌停价'])})  //['symbol', 'close', 'precolse', 'updownpre']
          var dapanDataDit = arrToDit(dapanData, '代码')
          arr = arr.filter((symbol)=>{
            var result = false
            if(dapanDataDit[symbol] != null){
              if(dapanDataDit[symbol]['涨跌幅'] > 0){
                //如果涨幅为正就一定不是涨停了
              }else{
                result = isUpOrDownStop(dapanDataDit[symbol])
                // console.log('isUpOrDownStop', result, symbol, dapanDataDit[symbol])
              }
            }
            if(config.isTrue == 'false'){
              result = !result
            }
            return result
          })
          // symbolsDit = null
          dapanData = null
          dapanDataDit = null
          config = null
          return arr
      }
    },
    {
      name: '第n日分时是否跌停', 
      id: '50',
      des: '筛选第n日某一时刻是否跌停，n为以当前输入日期开始算第n个交易日，当n为1时，就是当前输入的日期',
      key: 'minisDownStop',  //唯一key
      needMinData: true,
      getTitle: function(hideChildKeys){
        // console.log('hideChildKeys', hideChildKeys)
        if(hideChildKeys != null && hideChildKeys.length > 0){
          var str = ''
          if(hideChildKeys.indexOf('day') == -1){
            str = '第' + this.values[0].value + '日'
          }
          if(hideChildKeys.indexOf('time') == -1){
            str += this.values[1].value + '分'
          }
          return str + '是否跌停'
        }else{
          return '第' + this.values[0].value + '日' + this.values[1].value + '分是否跌停'
        }
      },
      values:  [
        {key: 'day', type: 'number', value: 1, min: 1, max: 365, step: 1, formatter:value => `n=${value}`, parser:value => Number(value.replace('n=', ''))},
        {key: 'time', type: 'select', value: '09:45', options: 'minOption'},
        {key: 'isTrue', type: 'select', value: 'true', options: BoolenOption},
      ],
      filter: async (arr, config, fullObject, dapanMinDataDit)=>{
        var backArr = await checkVaildDate(fullObject, config)
        if(backArr != null){
          return backArr
        }

        if(dapanMinDataDit == null){
            //如果传入了就不需要重复获取了
            dapanMinDataDit = await YWRequest.getOneDayMinDataByType(fullObject.start_date, config.day, arr, {timeDit: true, justTimes: [config.time]}, huiceConfig.secondKLine)
        }

          // var symbolsDit = strArrToDit(arr)
          var dapanData = await YWRequest.getOneDayDataDeal(fullObject.start_date, config.day, arr, {select: GenSelectKeys(['跌停价'])})  //['symbol', 'close', 'precolse', 'updownpre']
          // console.log('是否涨停规则获取到的dapanData', dapanData)

          // var dapanData2 = await YWRequest.getOneDayDataDB(fullObject.start_date, config.day, arr)

          // console.log('db获取到的dapanData2', dapanData2)
          var dapanDataDit = arrToDit(dapanData, '代码')
          arr = arr.filter((symbol)=>{
            var result = false
            if(dapanDataDit[symbol] != null && dapanMinDataDit[symbol] != null){
              if(dapanMinDataDit[symbol][config.time] != null){
                  var closePrice =  getSymbolDataByKey(dapanMinDataDit[symbol][config.time], '收盘')
                  var upDonwPrice = getSymbolDataByKey(dapanDataDit[symbol], '跌停价')
                  // console.log('判断分时是否跌停', closePrice, upDonwPrice)
                  result = compireTwoValue(closePrice, 'equire', upDonwPrice)
              }
            }
            if(config.isTrue == 'false'){
              result = !result
            }
            return result
          })
          // symbolsDit = null
          dapanData = null
          dapanDataDit = null
          dapanMinDataDit = null
          return arr
      }
    },
    {
        name: '第n日数据筛选-数值', 
        id: '6',
        des: '筛选第n日换手率指标，n为以当前输入日期开始算第n个交易日，当n为1时，就是当前输入的日期',
        key: 'compareByValue',  //唯一key
        getTitle: function(hideChildKeys){
          if(hideChildKeys != null && hideChildKeys.indexOf('day') != -1){
            return '数据筛选'
          }else{
            return '第' + this.values[0].value + '日数据筛选'
          }
        },
        values:  [
            {key: 'day', type: 'number', value: 1, min: 1, max: 365, step: 1, formatter:value => `n=${value}`, parser:value => Number(value.replace('n=', ''))},
            {key: 'firstKey', type: 'select', value: '换手率', options: SymbolOption},
            {key: 'compire', type: 'select', value: 'bigger', options: CompireOption},
            {key: 'secondValue', type: 'number', width: '180px' ,value: 5, step:0.5},
        ],
        filter: async (arr, config, fullObject)=>{
          var backArr = await checkVaildDate(fullObject, config)
          if(backArr != null){
            return backArr
          }

            // var symbolsDit = strArrToDit(arr)
            var dapanData = await YWRequest.getOneDayDataDeal(fullObject.start_date, config.day, arr, {select: GenSelectKeys([config.firstKey])})
            var dapanDataDit = arrToDit(dapanData, '代码')
            // console.log('开始执行rule compareByValue',symbolsDit, config)
            arr = arr.filter((symbol)=>{
              var result = false
              if(dapanDataDit[symbol] != null){
                var firstValue = getSymbolDataByKey(dapanDataDit[symbol], config.firstKey)
                result = compireTwoValue(firstValue, config.compire, config.secondValue)
              }
              return result
            })
            // symbolsDit = null
            dapanData = null
            dapanDataDit = null
            config = null
            return arr
        }
    },
    {
      name: '第n日数据筛选-选项', 
      id: '7',
      des: '筛选第n日各个数据的对比，比如开盘价小于涨停价，其中后一个指标可以乘以一个倍数',
      key: 'compareByChoose',  //唯一key
      getTitle: function(hideChildKeys){
        if(hideChildKeys != null && hideChildKeys.indexOf('day') != -1){
          return '数据筛选'
        }else{
          return '第' + this.values[0].value + '日数据筛选'
        }
      },
      values:[
          {key: 'day', type: 'number', value: 1, min: 1, max: 365, step: 1, formatter:value => `n=${value}`, parser:value => Number(value.replace('n=', ''))},
          {key: 'firstKey', type: 'select', value: '开盘', options: SymbolOption},
          {key: 'compire', type: 'select', value: 'small', options: CompireOption},
          {key: 'secondKey', type: 'select', value: '涨停价', options: SymbolOption},
          {key: 'valueScale', type: 'number', value: 1, step: 0.01, formatter:value => `${value}倍`, parser:value => Number(value.replace('倍', ''))},
      ],
      filter: async (arr, config, fullObject)=>{
        var backArr = await checkVaildDate(fullObject, config)
        if(backArr != null){
          return backArr
        }

          // var symbolsDit = strArrToDit(arr)
          var dapanData = await YWRequest.getOneDayDataDeal(fullObject.start_date, config.day, arr, {select: GenSelectKeys([config.firstKey, config.secondKey])})
          var dapanDataDit = arrToDit(dapanData, '代码')
          arr = arr.filter((symbol)=>{
            var result = false
            if(dapanDataDit[symbol] != null){
              var firstValue  = getSymbolDataByKey(dapanDataDit[symbol], config.firstKey)
              var secondValue = getSymbolDataByKey(dapanDataDit[symbol], config.secondKey)
              result = compireTwoValue(firstValue, config.compire, secondValue * config.valueScale)
              // if(result == true){
              //   console.log('firstValue', firstValue, secondValue)
              // }
            }
            return result
          })
          // symbolsDit = null
          dapanData = null
          dapanDataDit = null
          config = null
          return arr
      }
    },
    {
      name: '第n日是否长下影线', 
      id: '23',
      des: '指当日k线蜡烛图出现长下影线，下影线长度一般需达到实体部分的2倍以上，且无上影线或极短‌，在连续下跌末期出现此形态可能是金针探底，走势开始反转的信号',
      key: 'isLongDownLine',  //唯一key
      getTitle: function(hideChildKeys){
        if(hideChildKeys != null && hideChildKeys.indexOf('day') != -1){
          return '是否长下影线'
        }else{
          return '第' + this.values[0].value + '日是否长下影线'
        }
      },
      values:[
          {key: 'day', type: 'number', value: 1, min: 1, max: 365, step: 1, formatter:value => `n=${value}`, parser:value => Number(value.replace('n=', ''))},
          {key: 'downLineScale', type: 'number', value: 2, step: 0.1, before:'下影线', width:'140px', formatter:value => `${value}倍`, parser:value => Number(value.replace('倍', '')), 'des': '下影线是实体部分的多少倍以上'},
          {key: 'upLineScale', type: 'number', value: 0.5, step: 0.1, before:'上影线', width:'140px', formatter:value => `${value}倍`, parser:value => Number(value.replace('倍', '')), 'des': '上影线是实体部分的多少倍以下'},
      ],
      filter: async (arr, config, fullObject)=>{
          var backArr = await checkVaildDate(fullObject, config)
          if(backArr != null){
            return backArr
          }
          // var symbolsDit = strArrToDit(arr)
          var dapanData = await YWRequest.getOneDayDataDeal(fullObject.start_date, config.day, arr, {select: ['open', 'close', 'max', 'min']})
          var dapanDataDit = arrToDit(dapanData, '代码')
          arr = arr.filter((symbol)=>{
            var result = false
            if(dapanDataDit[symbol] != null){
              var open  = getSymbolDataByKey(dapanDataDit[symbol], SymbolKey.open)
              var close = getSymbolDataByKey(dapanDataDit[symbol], SymbolKey.close)
              var max   = getSymbolDataByKey(dapanDataDit[symbol], SymbolKey.max)
              var min   = getSymbolDataByKey(dapanDataDit[symbol], SymbolKey.min)

              var downLine = (Math.min(close, open) - min) / Math.abs(close - open)
              var upLine = (max - Math.max(close, open)) / Math.abs(close - open)

              var result1 = compireTwoValue(downLine, 'biggerEquire', config.downLineScale)
              var result2 = compireTwoValue(upLine,   'smallEquire',  config.upLineScale)
              result = result1 && result2
              result1 = null
              result2 = null
              downLine = null
              upLine = null
              open = null
              close = null
              min = null
              max = null
            }
            return result
          })
          // symbolsDit = null
          dapanData = null
          dapanDataDit = null
          config = null
          return arr
      }
    },
    {
      name: '第n日是否长上影线', 
      id: '24',
      des: '指当日k线蜡烛图出现长上影线，上影线长度一般需达到实体部分的2倍以上，且无下影线或极短‌，在连续上涨末期出现此形态可能是见顶信号',
      key: 'isLongUpLine',  //唯一key
      getTitle: function(hideChildKeys){
        if(hideChildKeys != null && hideChildKeys.indexOf('day') != -1){
          return '是否长上影线'
        }else{
          return '第' + this.values[0].value + '日是否长上影线'
        }
      },
      values:[
          {key: 'day', type: 'number', value: 1, min: 1, max: 365, step: 1, formatter:value => `n=${value}`, parser:value => Number(value.replace('n=', ''))},
          {key: 'downLineScale', type: 'number', value: 0.5, step: 0.1, before:'下影线', width:'140px', formatter:value => `${value}倍`, parser:value => Number(value.replace('倍', '')), 'des': '下影线是实体部分的多少倍以下'},
          {key: 'upLineScale', type: 'number', value: 2, step: 0.1, before:'上影线', width:'140px', formatter:value => `${value}倍`, parser:value => Number(value.replace('倍', '')), 'des': '上影线是实体部分的多少倍以上'},
      ],
      filter: async (arr, config, fullObject)=>{
          // var symbolsDit = strArrToDit(arr)
          var backArr = await checkVaildDate(fullObject, config)
          if(backArr != null){
            return backArr
          }

          var dapanData = await YWRequest.getOneDayDataDeal(fullObject.start_date, config.day, arr, {select: ['open', 'close', 'max', 'min']})
          var dapanDataDit = arrToDit(dapanData, '代码')
          arr = arr.filter((symbol)=>{
            var result = false
            if(dapanDataDit[symbol] != null){
              var open  = getSymbolDataByKey(dapanDataDit[symbol], SymbolKey.open)
              var close = getSymbolDataByKey(dapanDataDit[symbol], SymbolKey.close)
              var max   = getSymbolDataByKey(dapanDataDit[symbol], SymbolKey.max)
              var min   = getSymbolDataByKey(dapanDataDit[symbol], SymbolKey.min)

              var downLine = (Math.min(close, open) - min) / Math.abs(close - open)
              var upLine = (max - Math.max(close, open))   / Math.abs(close - open)

              var result1 = compireTwoValue(downLine, 'smallEquire',   config.downLineScale)
              var result2 = compireTwoValue(upLine,   'biggerEquire',  config.upLineScale)
              result = result1 && result2
              result1 = null
              result2 = null
              downLine = null
              upLine = null
              open = null
              close = null
              min = null
              max = null
            }
            return result
          })
          // symbolsDit = null
          dapanData = null
          dapanDataDit = null
          config = null
          return arr
      }
    },
    {
      name: '第n日是否十字星', 
      id: '25',
      des: '指当日k线蜡烛图出现十字星收盘，可能是绿十字也可能是红十字，一般情况下收盘价开盘价等于或相近',
      key: 'isShizhixin',  //唯一key
      getTitle: function(hideChildKeys){
        if(hideChildKeys != null && hideChildKeys.indexOf('day') != -1){
          return '是否十字星'
        }else{
          return '第' + this.values[0].value + '日是否十字星'
        }
      },
      values:[
          {key: 'day', type: 'number', value: 1, min: 1, max: 365, step: 1, formatter:value => `n=${value}`, parser:value => Number(value.replace('n=', ''))},
          {key: 'closeWithOpen', type: 'number', value: 0.03, step: 0.01, before:'实体', width:'140px', formatter:value => `${value}%`, parser:value => Number(value.replace('%', '')), 'des': '开盘和收盘的价格相差百分比'},
      ],
      filter: async (arr, config, fullObject)=>{
          // var symbolsDit = strArrToDit(arr)
          var backArr = await checkVaildDate(fullObject, config)
          if(backArr != null){
            return backArr
          }

          var dapanData = await YWRequest.getOneDayDataDeal(fullObject.start_date, config.day, arr, {select: ['open', 'close']})
          var dapanDataDit = arrToDit(dapanData, '代码')
          arr = arr.filter((symbol)=>{
            var result = false
            if(dapanDataDit[symbol] != null){
              var open  = getSymbolDataByKey(dapanDataDit[symbol], SymbolKey.open)
              var close = getSymbolDataByKey(dapanDataDit[symbol], SymbolKey.close)

              var bigger = Math.max(open, close)
              var small =  Math.min(open, close)
              var present = (bigger - small) / small
              // console.log("present", present)
              result = compireTwoValue(present, 'smallEquire',  config.closeWithOpen * 0.01)
              open = null
              close = null
              bigger = null
              small = null
              present = null
            }
            return result
          })
          // symbolsDit = null
          dapanData = null
          dapanDataDit = null
          config = null
          return arr
      }
    },
    {
      name: '双日数据对比', 
      id: '8',
      des: '对比两个交易日的指标，即可以选择同一个指标，也可以选择不同指标进行对比，其中后一个指标可以乘以一个倍数',
      key: 'compareTwoDay',  //唯一key
      getTitle: function(hideChildKeys){
        if(hideChildKeys != null && hideChildKeys.indexOf('day') != -1){
          return '数据对比第' + this.values[3].value + '日'
        }else{
          return '第' + this.values[0].value + '日数据对比第' + this.values[3].value + '日'
        }
      },
      values:[
          {key: 'day', type: 'number', value: 2, min: 1, max: 365, step: 1, formatter:value => `第${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
          {key: 'dataKey', type: 'select', value: '成交量', options: SymbolOption},
          {key: 'compire', type: 'select', value: 'bigger', options: CompireOption},
          {key: 'day2', type: 'number', value: 1, min: 1, max: 365, step: 1, formatter:value => `第${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
          {key: 'dataKey2', type: 'select', value: '成交量', options: SymbolOption},
          {key: 'valueScale', type: 'number', value: 1.5, step: 0.01, formatter:value => `${value}倍`, parser:value => Number(value.replace('倍', ''))},
      ],
      filter: async (arr, config, fullObject)=>{
          var backArr = await checkVaildDate(fullObject, config)
          if(backArr != null){
            return backArr
          }
          // var symbolsDit = strArrToDit(arr)
          var dapanData = await YWRequest.getOneDayDataDeal(fullObject.start_date, config.day, arr, {select: GenSelectKeys([config.dataKey])})
          var dapanDataDit = arrToDit(dapanData, '代码')

          var dapanData2 = await YWRequest.getOneDayDataDeal(fullObject.start_date, config.day2, arr, {select: GenSelectKeys([config.dataKey2])})
          var dapanDataDit2 = arrToDit(dapanData2, '代码')

          arr = arr.filter((symbol)=>{
            var result = false
            if(dapanDataDit[symbol] != null && dapanDataDit2[symbol] != null){
              var firstValue  = getSymbolDataByKey(dapanDataDit[symbol], config.dataKey)
              var secondValue = getSymbolDataByKey(dapanDataDit2[symbol], config.dataKey2)
              result = compireTwoValue(firstValue, config.compire, secondValue * config.valueScale)
            }
            return result
          })
          // symbolsDit = null
          dapanData = null
          dapanDataDit = null
          dapanData2 = null
          dapanDataDit2 = null
          config = null
          return arr
      },
    },
    {
      name: '第n日数据对比近x日最高/低值', 
      id: '41',
      des: '选择某一个指标对比近n日最值，即可以选择同一个指标，也可以选择不同指标进行对比，其中后一个指标可以乘以一个倍数，注意：近x日是以第n日为当天的往前x日的数据，不包含第n日的数据',
      key: 'compareRecentDayTopValue',  //唯一key
      getTitle: function(hideChildKeys){
        if(hideChildKeys != null && hideChildKeys.indexOf('day') != -1){
          return '数据对比近' + this.values[3].value + '日'
        }else{
          return '第' + this.values[0].value + '日数据对比近' + this.values[3].value + '日'
        }
      },
      values:[
          {key: 'day', type: 'number', value: 1, min: 1, max: 365, step: 1, formatter:value => `第${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
          {key: 'dataKey', type: 'select', value: '收盘', options: SymbolOption},
          {key: 'compire', type: 'select', value: 'small', options: CompireOption},
          {key: 'recentDay', type: 'number', value: 30, min: 1, max: 365, step: 1, formatter:value => `近${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
          {key: 'dataKey2', type: 'select', value: '最高', options: SymbolOption},
          {key: 'topType', type: 'select', value: 'bigger', options: TopValueOption},
          {key: 'valueScale', type: 'number', value: 0.8, step: 0.01, formatter:value => `${value}倍`, parser:value => Number(value.replace('倍', ''))},
      ],
      filter: async (arr, config, fullObject)=>{
        var backArr = await checkVaildDate(fullObject, config)
        if(backArr != null){
          return backArr
        }
        // var day = config.day - 1
        var startDate = YWRequest.GetNextDay(fullObject.start_date, config.day)

        // var symbolsDit = strArrToDit(arr)
        // var dapanData = await YWRequest.getOneDayDataDeal(fullObject.start_date, 1, symbolsDit)

        //如果没有交易日会默认获取上一天的
        var {dataArr, dateArr} = await YWRequest.GetUpperDaysDataDeal(startDate, config.recentDay, arr)
        
        var dapanDataDit = arrToDit(dataArr[0], '代码')
        dataArr.splice(0, 1) //返回的数据包含 start_date 的数据，这里不需要，所以删除

        var valueDit = {}
        // console.log("dataArr", dataArr, dapanDataDit)
        
        for(var i = 0; i < dataArr.length; i++){
          var upDapanDataDit = arrToDit(dataArr[i], '代码')
          // console.log('upDapanDataDit', upDapanDataDit, arr)
          for(var j = 0; j < arr.length; j++){
            var symbol = arr[j]
            if(upDapanDataDit[symbol] != null){
              var firstValue  = getSymbolDataByKey(upDapanDataDit[symbol], config.dataKey2)
              if(valueDit[symbol] == null){
                valueDit[symbol] = firstValue
              }else{
                if(compireTwoValue(firstValue, config.topType, valueDit[symbol])){
                  valueDit[symbol] = firstValue
                }
              }
            }
            firstValue = null
            symbol = null
          }
          upDapanDataDit = null
        }

        //最后的一天判断是否创新高
        // console.log('valueDit', valueDit)
        arr = arr.filter((symbol)=>{
          var result = false
          if(dapanDataDit[symbol] != null && valueDit[symbol] != null){
              var firstValue = getSymbolDataByKey(dapanDataDit[symbol], config.dataKey)
              result = compireTwoValue(firstValue, config.compire, valueDit[symbol] * config.valueScale)
          }
          return result
        })
        valueDit = null
        // symbolsDit = null
        dataArr = null
        config = null
        // dapanData = null
        dapanDataDit = null
        return arr
      },
    },
    {
      name: '某指标创近n日内新高/低', 
      id: '33',
      des: '筛选某个指标是否为最近n日内的新高或者新低，默认倍率为1，即只要比上一个数值大就算新高，如果倍率设置为1.2，则每一次创新高的值都要比上一个值大1.2倍。当选项为新低时，则是每一次创新低仅需要要比上一个值的1.2倍小，此规则的最近n日的值会影响回测效率，如果设置的越大，回测运行的速度越慢。',
      key: 'isRecentDayMax',  //唯一key
      getTitle: function(hideChildKeys){
        return optionValueToLabel(this.values[1].value, SymbolOption) + '创近' + this.values[0].value + '日' + optionValueToLabel(this.values[2].value, NewMoreOption)
      },
      values:[
          {key: 'recentDay', type: 'number', value: 30, min: 1, max: 999, step: 5, formatter:value => `近${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
          {key: 'dataKey', type: 'select', value: '收盘', options: SymbolOption},
          {key: 'compire', type: 'select', value: 'bigger', options: NewMoreOption},
          {key: 'valueScale', type: 'number', value: 1, step: 0.01, formatter:value => `${value}倍`, parser:value => Number(value.replace('倍', ''))},
      ],
      filter: async (arr, config, fullObject)=>{
        // var symbolsDit = strArrToDit(arr)
        // var dapanData = await YWRequest.getOneDayDataDeal(fullObject.start_date, 1, symbolsDit)

        //如果没有交易日会默认获取上一天的
        var {dataArr, dateArr} = await YWRequest.GetUpperDaysDataDeal(fullObject.start_date, config.recentDay, arr)
        if(dateArr[0] != fullObject.start_date){
          console.warn('注意传入的fullObject.start_date不是交易日，回测时将不会出现这一天的操作')
        }
        var dapanDataDit = arrToDit(dataArr[0], '代码')
        dataArr.splice(0, 1) //返回的数据包含 start_date 的数据，这里不需要，所以删除
        // console.log("dateArr,  fullObject.start_date", dateArr, fullObject.start_date)

        var valueDit = {}
        // console.log("dataArr", dataArr, dapanDataDit)
        for(var i = 0; i < dataArr.length; i++){
          var upDapanDataDit = arrToDit(dataArr[i], '代码')
          // console.log('upDapanDataDit', upDapanDataDit, arr)
          for(var j = 0; j < arr.length; j++){
            var symbol = arr[j]
            if(upDapanDataDit[symbol] != null){
              var firstValue  = getSymbolDataByKey(upDapanDataDit[symbol], config.dataKey)
              if(valueDit[symbol] == null){
                valueDit[symbol] = firstValue
              }else{
                if(compireTwoValue(firstValue, config.compire, valueDit[symbol] * config.valueScale)){
                  valueDit[symbol] = firstValue
                }
              }
            }
            firstValue = null
            symbol = null
          }
          upDapanDataDit = null
        }

        //最后的一天判断是否创新高
        // console.log('valueDit', valueDit)
        arr = arr.filter((symbol)=>{
          var result = false
          if(dapanDataDit[symbol] != null && valueDit[symbol] != null){
              var firstValue = getSymbolDataByKey(dapanDataDit[symbol], config.dataKey)
              result = compireTwoValue(firstValue, config.compire, valueDit[symbol] * config.valueScale)
          }
          return result
        })
        valueDit = null
        // symbolsDit = null
        dataArr = null
        config = null
        // dapanData = null
        dapanDataDit = null
        return arr
      },
    },
    {
      name: '双日分时数据对比', 
      id: '20',
      des: '对比两个交易日的分时数据指标，即可以选择同一个指标，也可以选择不同指标进行对比，其中后一个指标可以乘以一个倍数',
      key: 'compareTwoDayMin',  //唯一key
      needMinData: true, 
      getTitle: function(hideChildKeys){
        if(hideChildKeys != null && hideChildKeys.indexOf('day') != -1){
          return '分时数据对比第' + this.values[4].value + '日'
        }else{
          return '第' + this.values[0].value + '日分时数据对比第' + this.values[4].value + '日'
        }
      },
      values:[
          {key: 'day', type: 'number', value: 2, min: 1, max: 365, step: 1, formatter:value => `第${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
          {key: 'time', type: 'select', value: '09:45', options: 'minOption'},
          {key: 'dataKey', type: 'select', value: '换手率', options: SymbolOptionOfMin},
          {key: 'compire', type: 'select', value: 'bigger', options: CompireOption},
          {key: 'day2', type: 'number', value: 1, min: 1, max: 365, step: 1, formatter:value => `第${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
          {key: 'time2', type: 'select', value: '09:45', options: 'minOption'},
          {key: 'dataKey2', type: 'select', value: '换手率', options: SymbolOptionOfMin},
          {key: 'valueScale', type: 'number', value: 1.5, step: 0.01, formatter:value => `${value}倍`, parser:value => Number(value.replace('倍', ''))},
      ],
      filter: async (arr, config, fullObject, dapanMinDataDit)=>{
          // var symbolsDit = strArrToDit(arr)
          var backArr = await checkVaildDate(fullObject, config)
          if(backArr != null){
            return backArr
          }

          if(dapanMinDataDit == null){
            //如果传入了就不需要重复获取了
             dapanMinDataDit = await YWRequest.getOneDayMinDataByType(fullObject.start_date, config.day, arr, {timeDit: true, justTimes: [config.time]}, huiceConfig.secondKLine)
          }
          //要对比的那一天的数据没有传入，还是需要单独获取
          var dapanMinDataDit2 = await YWRequest.getOneDayMinDataByType(fullObject.start_date, config.day2, arr, {timeDit: true, justTimes: [config.time2]}, huiceConfig.secondKLine)
          
          // console.log('获取到的dapanMinDataDit2', dapanMinDataDit, dapanMinDataDit2)
          arr = arr.filter((symbol)=>{
            var result = false
            if(dapanMinDataDit[symbol] != null && dapanMinDataDit2[symbol] != null){
              var firstValue  = getSymbolDataByKey(dapanMinDataDit[symbol][config.time], config.dataKey)
              var secondValue = getSymbolDataByKey(dapanMinDataDit2[symbol][config.time2], config.dataKey2)
              result = compireTwoValue(firstValue, config.compire, secondValue * config.valueScale)
              firstValue = null
              secondValue = null
            }
            return result
          })
          dapanMinDataDit2 = null
          dapanMinDataDit = null
          // symbolsDit = null
          config = null
          return arr
      },
    },
    {
      name: '分时数据对比单日数据', 
      id: '21',
      des: '用其中一个交易日的分时数据对比另一个交易日的日k数据，即可以选择同一个指标，也可以选择不同指标进行对比，其中后一个指标可以乘以一个倍数',
      key: 'compareMinWithOtherDay',  //唯一key
      needMinData: true, 
      getTitle: function(hideChildKeys){
        if(hideChildKeys != null && hideChildKeys.indexOf('day') != -1){
          return '分时数据对比第' + this.values[4].value + '日k线数据'
        }else{
          return '第' + this.values[0].value + '日分时数据对比第' + this.values[4].value + '日k线数据'
        }
      },
      values:[
          {key: 'day', type: 'number', value: 2, min: 1, max: 365, step: 1, formatter:value => `第${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
          {key: 'time', type: 'select', value: '09:45', options: 'minOption'},
          {key: 'dataKey', type: 'select', value: '换手率', options: SymbolOptionOfMin},
          {key: 'compire', type: 'select', value: 'bigger', options: CompireOption},
          {key: 'day2', type: 'number', value: 1, min: 1, max: 365, step: 1, formatter:value => `第${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
          {key: 'dataKey2', type: 'select', value: '换手率', options: SymbolOption},
          {key: 'valueScale', type: 'number', value: 1.5, step: 0.01, formatter:value => `${value}倍`, parser:value => Number(value.replace('倍', ''))},
      ],
      filter: async (arr, config, fullObject, dapanMinDataDit)=>{
          // var symbolsDit = strArrToDit(arr)
          var backArr = await checkVaildDate(fullObject, config)
          if(backArr != null){
            return backArr
          }
          if(dapanMinDataDit == null){
            //如果传入了就不需要重复获取了
             dapanMinDataDit = await YWRequest.getOneDayMinDataByType(fullObject.start_date, config.day, arr, {timeDit: true, justTimes: [config.time]}, huiceConfig.secondKLine)
            // dapanMinDataDit = await YWRequest.getOneDayMin1Data(fullObject.start_date, config.day, symbolsDit, {timeDit: true, justTimes: [config.time]})
            // console.log('dapanMinDataDit', dapanMinDataDit)
            // var dapanMinDataDitDb = await YWRequest.getOneDayMin1DataDb(fullObject.start_date, config.day, arr, {timeDit: true, justTimes: [config.time]})
            // console.log('dapanMinDataDitDb', dapanMinDataDitDb)
          }
          //要对比的那一天的数据没有传入，还是需要单独获取
          var dapanData2 = await YWRequest.getOneDayDataDeal(fullObject.start_date, config.day2, arr, {select: GenSelectKeys([config.dataKey2])})
          var dapanDataDit2 = arrToDit(dapanData2, '代码')


          // console.log('获取到的dapanMinDataDit2', dapanMinDataDit, dapanMinDataDit2)
          arr = arr.filter((symbol)=>{
            var result = false
            if(dapanMinDataDit[symbol] != null && dapanDataDit2[symbol] != null){
              var firstValue  = getSymbolDataByKey(dapanMinDataDit[symbol][config.time], config.dataKey)
              var secondValue = getSymbolDataByKey(dapanDataDit2[symbol], config.dataKey2)
              result = compireTwoValue(firstValue, config.compire, secondValue * config.valueScale)
              firstValue = null
              secondValue = null
            }
            return result
          })
          dapanData2 = null
          dapanDataDit2 = null
          dapanMinDataDit = null
          // symbolsDit = null
          config = null
          return arr
      },
    },
    {
      name: '分时累计成交量对比单日成交量', 
      id: '22',
      des: '用一个交易日从开盘到某一时刻的累计成交量对比另一天的成交量',
      key: 'compareMinVolumeWithOtherDay',  //唯一key
      needMinData: true, 
      getTitle: function(hideChildKeys){
        if(hideChildKeys != null && hideChildKeys.indexOf('day') != -1){
          return '分时累计成交量对比第' + this.values[3].value + '日成交量'
        }else{
          return '第' + this.values[0].value + '日分时累计成交量对比' + this.values[3].value + '日成交量'
        }
      },
      values:[
          {key: 'day', type: 'number', value: 2, min: 1, max: 365, step: 1, formatter:value => `第${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
          {key: 'time', type: 'select', value: '09:45', options: 'minOption'},
          // {key: 'dataKey', type: 'select', value: '成交量', options: SymbolOptionOfMin},
          {key: 'compire', type: 'select', value: 'bigger', options: CompireOption},
          {key: 'day2', type: 'number', value: 1, min: 1, max: 365, step: 1, formatter:value => `第${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
          // {key: 'dataKey2', type: 'select', value: '成交量', options: SymbolOption},
          {key: 'valueScale', type: 'number', value: 1.5, step: 0.01, formatter:value => `${value}倍`, parser:value => Number(value.replace('倍', ''))},
      ],
      filter: async (arr, config, fullObject, dapanMinDataDit)=>{
          var backArr = await checkVaildDate(fullObject, config)
          if(backArr != null){
            return backArr
          }
          // var symbolsDit = strArrToDit(arr)
          var beforeTimes = []
          for(var j = 0; j < YWRequest[huiceConfig.secondKLine].length; j++){
            if(compireTwoTime(config.time, 'biggerEquire', YWRequest[huiceConfig.secondKLine][j].value)){
              beforeTimes.push(YWRequest[huiceConfig.secondKLine][j].value)
            }
          }
          // console.log('beforeTimes', beforeTimes)
          if(dapanMinDataDit == null){
            //如果传入了就不需要重复获取了
             dapanMinDataDit = await YWRequest.getOneDayMinDataByType(fullObject.start_date, config.day, arr, {timeDit: true, justTimes: beforeTimes}, huiceConfig.secondKLine)
          }
          //要对比的那一天的数据没有传入，还是需要单独获取
          var dapanData2 = await YWRequest.getOneDayDataDeal(fullObject.start_date, config.day2, arr, {select: ['volume']})
          var dapanDataDit2 = arrToDit(dapanData2, '代码')


          // console.log('获取到的dapanMinDataDit2', dapanMinDataDit, dapanMinDataDit2)
          arr = arr.filter((symbol)=>{
            var result = false
            if(dapanMinDataDit[symbol] != null && dapanDataDit2[symbol] != null){
              var firstValue = 0
              for(var j = 0; j < beforeTimes.length; j++){
                firstValue += getSymbolDataByKey(dapanMinDataDit[symbol][beforeTimes[j]], '成交量')
              }
              var secondValue = getSymbolDataByKey(dapanDataDit2[symbol], '成交量')
              result = compireTwoValue(firstValue, config.compire, secondValue * config.valueScale)
              firstValue = null
              secondValue = null
            }
            return result
          })
          beforeTimes = null
          dapanData2 = null
          dapanDataDit2 = null
          dapanMinDataDit = null
          // symbolsDit = null
          config = null
          return arr
      },
    },
    {
        name: '第n日均价数据对比', 
        id: '11',
        des: '对比某天的某个价格指标是否超过均价',
        key: 'compareMAPrice',  //唯一key
        getTitle: function(hideChildKeys){
          if(hideChildKeys != null && hideChildKeys.indexOf('day') != -1){
            return '均价数据对比'
          }else{
           return '第' + this.values[0].value + '日均价数据对比'
          }
        },
        values:[
            {key: 'day', type: 'number', value: 2, min: 1, max: 365, step: 1, formatter:value => `第${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
            {key: 'dataKey', type: 'select', value: '收盘', options: SymbolPriceOption},
            {key: 'compire', type: 'select', value: 'bigger', options: CompireOption},
            {key: 'maDay', type: 'select', value: 'MA_5', options: 'SymbolMaOption'},
        ],
        filter: async (arr, config, fullObject)=>{
          var backArr = await checkVaildDate(fullObject, config)
          if(backArr != null){
            return backArr
          }
            // var symbolsDit = strArrToDit(arr)
            var needMa = [config.maDay]
            var select = {}
            if(config.dataKey.indexOf('MA') == 0){
              needMa.push(config.dataKey)
            }else{
              // var selectArr = SymbolKeyToDBKey[config.dataKey]
              // selectArr.forEach(element => {
              //    select[element] = 1
              // });
            }

            // for(var i = 0; i < needMa.length; i++){
            //   var value = needMa[i].split('_')[1]
            //   select['ma' + value] = 1
            // }
              

            // console.log('needMa', needMa)
            // console.log('select', Object.keys(select))
            var dapanData = await YWRequest.getOneDayDataDeal(fullObject.start_date, config.day, arr, {maPriceArr: needMa, select: GenSelectKeys([config.dataKey]) })
            var dapanDataDit = arrToDit(dapanData, '代码')
            // console.log('compareMAPrice dapanData', dapanDataDit)s
            // console.log('获取到的数据是否包含均价', dapanData)

            arr = arr.filter((symbol)=>{
                var result = false
                if(dapanDataDit[symbol] != null){
                    var firstValue  = getSymbolDataByKey(dapanDataDit[symbol], config.dataKey)
                    var secondValue = getSymbolDataByKey(dapanDataDit[symbol], config.maDay)
                    result = compireTwoValue(firstValue, config.compire, secondValue)
                }
                return result
            })
            // symbolsDit = null
            needMa = null
            config = null
            dapanData = null
            dapanDataDit = null
            select = null
            return arr
        },
    },
    {
      name: '第n日量比数据对比', 
      id: '12',
      des: '对比某天的成交量是否超过前N天的平均成交量',
      key: 'compareMAVolume',  //唯一key
      getTitle: function(hideChildKeys){
        if(hideChildKeys != null && hideChildKeys.indexOf('day') != -1){
          return '量比数据对比'
        }else{
          return '第' + this.values[0].value + '日成交量数据对比'
        }
      },
      values:[
          {key: 'day', type: 'number', value: 2, min: 1, max: 365, step: 1, formatter:value => `第${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
          {key: 'compire', type: 'select', value: 'bigger', options: CompireOption},
          {key: 'maDay', type: 'select', value: 'MAVol_5', options: SymbolMaVolOption},
          {key: 'valueScale', type: 'number', value: 3.5, step: 0.5, formatter:value => `${value}倍`, parser:value => Number(value.replace('倍', ''))},
      ],
      filter: async (arr, config, fullObject)=>{
          var backArr = await checkVaildDate(fullObject, config)
          if(backArr != null){
            return backArr
          }
          // var symbolsDit = strArrToDit(arr)
          var needMa = [config.maDay]
          // console.log('needMaVol', needMa)
          var dapanData = await YWRequest.getOneDayDataDeal(fullObject.start_date, config.day, arr, {maVolArr: needMa})
          var dapanDataDit = arrToDit(dapanData, '代码')
          
          // console.log('获取到的数据是否包含均量', dapanData)

          arr = arr.filter((symbol)=>{
              var result = false
              if(dapanDataDit[symbol] != null){
                  var firstValue  = getSymbolDataByKey(dapanDataDit[symbol], '成交量')
                  var secondValue = getSymbolDataByKey(dapanDataDit[symbol], config.maDay)
                  result = compireTwoValue(firstValue, config.compire, secondValue * config.valueScale)
              }
              return result
          })
          // symbolsDit = null
          needMa = null
          dapanData = null
          dapanDataDit = null
          config = null
          return arr
      },
    },
    {
      name: '第n日买入做多', 
      id: '13',
      des: '这是一个买入规则，用于回测时股票的买入计划',
      key: 'justBuy',  //唯一key
      group: [RuleType.RuleOfBuy],  //此规则适用的分组
      // 买入卖出规则应该从条件判断的规则中独立出来，便于各种条件组合，如果绑定规则，不同规则的组合性将变弱
      getTitle: function(hideChildKeys){
          if(hideChildKeys != null && hideChildKeys.indexOf('day') != -1){
            return '买入做多'
          }else{
            return '第' + this.values[0].value + '日买入做多'
          }
      },
      values:[
          {key: 'day', type: 'number', value: 4, min: 1, max: 365, step: 1, formatter:value => `第${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
          {key: 'dataKey', type: 'select', value: '最低', options: SymbolPriceOptionOfBuySale},
      ],
      isOrderRule: true,
      filter: async (arr, config, fullObject)=>{
          var backArr = await checkVaildDate(fullObject, config)
          if(backArr != null){
            return backArr
          }
          // var symbolsDit = strArrToDit(arr)
          var dapanData = await YWRequest.getOneDayDataDeal(fullObject.start_date, config.day, arr, {select: GenSelectKeys([config.dataKey, '日期'])})
          var dapanDataDit = arrToDit(dapanData, '代码')
          
          arr = arr.filter((symbol)=>{
              var result = false
              if(dapanDataDit[symbol] != null){
                  var price = getSymbolDataByKey(dapanDataDit[symbol], config.dataKey)
                  var date = getSymbolDataByKey(dapanDataDit[symbol], '日期')
                  var time = getTimeByPriceKey(config.dataKey)
                  result = recordJiaoyiInfo(fullObject, symbol, price, date + ' ' + time, DoType.buy)
              }
              return result
          })
          // symbolsDit = null
          dapanData = null
          dapanDataDit = null
          return arr
      },
    },
    {
      name: '第n日卖出平仓', 
      id: '14',
      des: '这是一个卖出规则，用于回测时股票的卖出计划',
      key: 'justSale',  //唯一key
      group: [RuleType.RuleOfSale],  //此规则适用的分组
      getTitle: function(hideChildKeys){
        if(hideChildKeys != null && hideChildKeys.indexOf('day') != -1){
          return '卖出平仓'
        }else{
          return '第' + this.values[0].value + '日卖出平仓'
        }
      },
      values:[
          {key: 'day', type: 'number', value: 5, min: 1, max: 365, step: 1, formatter:value => `第${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
          {key: 'dataKey', type: 'select', value: '最高', options: SymbolPriceOptionOfBuySale},
      ],
      isOrderRule: true,
      filter: async (arr, config, fullObject)=>{
          var backArr = await checkVaildDate(fullObject, config)
          if(backArr != null){
            return backArr
          }
          // var symbolsDit = strArrToDit(arr)
          var dapanData = await YWRequest.getOneDayDataDeal(fullObject.start_date, config.day, arr,  {select: GenSelectKeys([config.dataKey, '日期'])})
          var dapanDataDit = arrToDit(dapanData, '代码')
          
          arr = arr.filter((symbol)=>{
              var result = false
              if(dapanDataDit[symbol] != null){
                var price = getSymbolDataByKey(dapanDataDit[symbol], config.dataKey)
                var date = getSymbolDataByKey(dapanDataDit[symbol], '日期')
                var time = getTimeByPriceKey(config.dataKey)
                result = recordJiaoyiInfo(fullObject, symbol, price, date + ' ' + time, DoType.sale)
              }
              return result
          })
          // symbolsDit = null
          dapanData = null
          dapanDataDit = null
          config = null
          return arr
      },
    },
    {
      name: '第n日卖出平仓', 
      id: '47',
      des: '这是一个分时卖出规则，用于回测时股票的卖出计划',
      key: 'justSaleByOneMin',  //唯一key
      group: [RuleType.RuleOfSale],  //此规则适用的分组
      getTitle: function(hideChildKeys){
        if(hideChildKeys != null && hideChildKeys.indexOf('day') != -1){
          return '卖出平仓'
        }else{
          return '第' + this.values[0].value + '日卖出平仓'
        }
      },
      values:[
          {key: 'day', type: 'number', value: 5, min: 1, max: 365, step: 1, formatter:value => `第${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
          {key: 'time', type: 'select', value: '09:35', options: 'minOption'},
          {key: 'dataKey', type: 'select', value: '最高', options: SymbolPriceOptionOfBuySale},
      ],
      isOrderRule: true,
      needMinData: true, 
      filter: async (arr, config, fullObject, dapanMinData)=>{
          var backArr = await checkVaildDate(fullObject, config)
          if(backArr != null){
            return backArr
          }

          arr = filterCantSaleSymbol(fullObject, arr, DoType.sale)
          var symbolsDit = strArrToDit(arr)
          if(dapanMinData == null){
            dapanMinData = await YWRequest.getOneDayMinDataByType(fullObject.start_date, config.day, arr, {timeDit: true}, huiceConfig.secondKLine)
          }
          // console.log('分时卖出平仓', dapanMinData)
          arr = arr.filter((symbol)=>{
              var result = false
              if(dapanMinData[symbol] != null && dapanMinData[symbol][config.time] != null){
                var price = getSymbolDataByKey(dapanMinData[symbol][config.time], config.dataKey)
                var time = getSymbolDataByKey(dapanMinData[symbol][config.time], '时间')
                // console.log("提交卖出", symbol, price, time)
                result = recordJiaoyiInfo(fullObject, symbol, price, time, DoType.sale)
              }
              return result
          })
          symbolsDit = null
          dapanMinData = null
          config = null
          return arr
      },
    },
    {
      name: '分时价格对比均价', 
      id: '15',
      des: '这是一个日内数据监测的规则，当股价跌破均价时触发，注意：此规则需要分时数据，如果当天分时数据缺失，则规则无法正常生效',
      key: 'whenPriceDownAveprice',  //唯一key
      //group: [RuleType.RuleOfSale, RuleType.RuleOfBuy],  //此规则适用的分组
      needMinData: true,  //是否需要分时数据，如果当天分时数据缺失，则规则无法正常生效
      values:[
          {key: 'day', type: 'number', value: 5, min: 1, max: 365, step: 1, formatter:value => `第${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
          {key: 'time', type: 'select', value: '09:35', options: 'minOption'},
          {key: 'dataKey', type: 'select', value: '收盘', options: SymbolPriceOptionOfBuySale},
          {key: 'compire', type: 'select', value: 'small', options: CompireOption},
          {key: 'valueScale', type: 'number', value: 1, step: 0.01, formatter:value => `${value}倍`, parser:value => Number(value.replace('倍', ''))},
          // {key: 'doType', type: 'select', value: 'sale', options: DoTypeOption},
      ],
      filter: async (arr, config, fullObject, dapanMinData)=>{
          var backArr = await checkVaildDate(fullObject, config)
          if(backArr != null){
            return backArr
          }
          // var symbolsDit = strArrToDit(arr)
          //这里返回的已经是以symbol为key的股票字典，value为数组格式的分时数据序列
          //均价得循环计算得出，所以还得获取一整天的先
          if(dapanMinData == null){
            dapanMinData = await YWRequest.getOneDayMinDataByType(fullObject.start_date, config.day, arr, {avePrice: "均价", timeDit: true}, huiceConfig.secondKLine)
            // var dapanMinDataDitDb = await YWRequest.getOneDayMin1DataDb(fullObject.start_date, config.day, arr, {timeDit: true, avePrice: "均价"})  //justTimes: [config.time]
            // console.log('dapanMinDataDitDb', dapanMinDataDitDb)
          }
          // console.log('dapanMinData dd', dapanMinData)
          // 代码 开盘 成交量 成交额 换手率 收盘 时间 最低 最高
          arr = arr.filter((symbol)=>{
              var result = false
              if(dapanMinData[symbol] != null){
                  var oneMinData = dapanMinData[symbol][config.time]
                  if(oneMinData != null){
                    var price = getSymbolDataByKey(oneMinData, config.dataKey)
                    var junjia = getSymbolDataByKey(oneMinData, '均价')
                    result = compireTwoValue(price, config.compire, junjia * config.valueScale)
                  }
              }
              return result
          })
          // symbolsDit = null
          dapanMinData = null
          config = null
          return arr
      },
    },
    {
      name: '任意n个条件满足时下单', 
      id: '16',
      des: '当有多个条件是非全部要满足，而是任意满足其中n个即可时，使用此规则，同时指令放置在此元素下，注意:n必须小于等于输入的规则数量，当n等于输入的规则数量时，等同于所有条件满足',
      key: 'anyRuleOrder',  //唯一key
      inCardBottom: true,
      getTitle: function(hideChildKeys){
        if(hideChildKeys != null && hideChildKeys.indexOf('day') != -1){
          return '任意' + this.values[1].value + '个条件满足时' + optionValueToLabel(this.values[3].value, DoTypeOption)
        }else{
          return '第' + this.values[0].value  + '日任意' + this.values[1].value + '个条件满足时' + optionValueToLabel(this.values[3].value, DoTypeOption)
        }
      },
      group: [RuleType.RuleOfBuy, RuleType.RuleOfSale],
      isOrderRule: true,
      needMinData: true, 
      isLoop: true,
      values: [
        {key: 'day', type: 'number', value: 5, min: 1, max: 365, step: 1, formatter:value => `第${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
        {key: 'trueCount', value: 1, type: 'number', min: 1 , step: 1, formatter:value => `${value}个`, parser:value => Number(value.replace('个', ''))},
        {key: 'dataKey', type: 'select', value: '收盘', options: SymbolPriceOptionOfBuySale},
        {key: 'doType',  type: 'select', value: 'buy', options: DoTypeOption},
        {key: 'rules', value: [], type: 'values', inBottom: true,  hideChildKeys: ['day', 'time']},
      ],
      filter: async (arr, config, fullObject)=>{
        var backArr = await checkVaildDate(fullObject, config)
        if(backArr != null){
          return backArr
        }
        //过滤掉已经下单购买的，这样可以在循环的时候减少重复获取数据
        arr = filterCantSaleSymbol(fullObject, arr, config.doType)
        // var symbolsDit = strArrToDit(arr)
        var dapanMinData = await YWRequest.getOneDayMinDataByType(fullObject.start_date, config.day, arr, {avePrice: "均价", timeDit: true}, huiceConfig.secondKLine)
        // console.log('dapanMinData', dapanMinData)
        // 此方法会对所有一级子节点的key为'day', 'time'的参数进行覆盖
        var returnDit = {}
        for(var timeIndex = 0; timeIndex < YWRequest[huiceConfig.secondKLine].length; timeIndex++){
          var time = YWRequest[huiceConfig.secondKLine][timeIndex].value
          var dit = {}
          for(var i = 0; i < config.rules.length; i++){
            var oneRule = config.rules[i]
            if(oneRule.checked != true){
              continue
            }
            if(RuleDit[oneRule.key] != null){
              var oneConfig = arrToDit(oneRule.values, 'key', 'value')
              oneConfig.ruleId = oneRule.id
              //直接覆盖当前的配置到子规则，不管子规则有没有配置，因为就算没有配置项，也不影响，但是总有会需要用到的情况
              oneConfig.time = time
              oneConfig.day = config.day

              var onearr = await RuleDit[oneRule.key].filter(arr, oneConfig, fullObject, dapanMinData)
              oneRule.resultCount = onearr.length
              for(var j = 0; j < onearr.length; j++){
                if(dit[onearr[j]] == null){
                  dit[onearr[j]] = 1
                }else{
                  dit[onearr[j]] += 1
                }
              }
              oneConfig = null
              oneRule = null
              onearr = null
            }else{
              console.log('规则缺失', oneRule)
            }
          }
          // console.log('当前时间有多少满足的条件', time, dit)
          arr.filter((symbol)=>{
            //至少满足其中n个条件
            if(dit[symbol] >= config.trueCount && dapanMinData[symbol] != null){
              var oneMinData = dapanMinData[symbol][time]
              var dateTime = getSymbolDataByKey(oneMinData, '时间')
              var price = getSymbolDataByKey(oneMinData, config.dataKey)
              // if(config.doType == DoType.sale){
              //   console.log('记录卖出', config.dataKey, oneMinData, dateTime, price)
              // }
              var result = recordJiaoyiInfo(fullObject, symbol, price, dateTime, config.doType)
              if(result == true){
                returnDit[symbol] = 1
              }
              return result
            }
            return false
          })
        }
        // 这里返回的是一天的分时数据循环下来触发交易的股票数据
        // 虽然会返回筛选后的数组，但是是否会覆盖传入的数组取决于上层调用者
        // 清除引用
        dapanMinData = null
        // symbolsDit = null
        return Object.keys(returnDit)
      }
    },
    {
      name: '任意n个条件满足时下单', 
      id: '27',
      des: '当有多个条件是非全部要满足，而是任意满足其中n个即可时，使用此规则，同时指令放置在此元素下，注意:n必须小于等于输入的规则数量，当n等于输入的规则数量时，等同于所有条件满足',
      key: 'anyRuleOrderByDay',  //唯一key
      inCardBottom: true,
      getTitle: function(hideChildKeys){
        if(hideChildKeys != null && hideChildKeys.indexOf('day') != -1){
          return '任意' + this.values[1].value + '个条件满足时' + optionValueToLabel(this.values[3].value, DoTypeOption)
        }else{
          return '第' + this.values[0].value  + '日任意' + this.values[1].value + '个条件满足时' + optionValueToLabel(this.values[3].value, DoTypeOption)
        }
      },
      group: [RuleType.RuleOfBuy, RuleType.RuleOfSale],
      isOrderRule: true,
      justByDay: true, 
      // isLoop: true,
      values: [
        {key: 'day', type: 'number', value: 5, min: 1, max: 365, step: 1, formatter:value => `第${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
        {key: 'trueCount', value: 1, type: 'number', min: 1 , step: 1, formatter:value => `${value}个`, parser:value => Number(value.replace('个', ''))},
        {key: 'dataKey', type: 'select', value: '收盘', options: SymbolPriceOptionOfBuySale, des: '以哪个价格做为下单价'},
        {key: 'doType',  type: 'select', value: 'buy', options: DoTypeOption},
        {key: 'rules', value: [], type: 'values', inBottom: true,  hideChildKeys: ['day']},
      ],
      filter: async (arr, config, fullObject)=>{
        var backArr = await checkVaildDate(fullObject, config)
        if(backArr != null){
          return backArr
        }
        // var symbolsDit = strArrToDit(arr)
        var dapanData = await YWRequest.getOneDayDataDeal(fullObject.start_date, config.day, arr,  {select: GenSelectKeys([config.dataKey, '日期'])})
        var dapanDataDit = arrToDit(dapanData, '代码')

        // 此方法会对所有一级子节点的key为'day', 'time'的参数进行覆盖
        var returnDit = {}
        var dit = {}

        for(var i = 0; i < config.rules.length; i++){
          var oneRule = config.rules[i]
          if(oneRule.checked != true){
            continue
          }
          if(RuleDit[oneRule.key] != null){
            var oneConfig = arrToDit(oneRule.values, 'key', 'value')
            oneConfig.ruleId = oneRule.id
            //直接覆盖当前的配置到子规则，不管子规则有没有配置，因为就算没有配置项，也不影响，但是总有会需要用到的情况
            oneConfig.day = config.day

            var onearr = await RuleDit[oneRule.key].filter(arr, oneConfig, fullObject)
            oneRule.resultCount = onearr.length
            for(var j = 0; j < onearr.length; j++){
              if(dit[onearr[j]] == null){
                dit[onearr[j]] = 1
              }else{
                dit[onearr[j]] += 1
              }
            }
            oneConfig = null
            oneRule = null
            onearr = null
          }else{
            console.log('规则缺失', oneRule)
          }
        }
        // console.log('当前时间有多少满足的条件', time, dit)
        var oneLoopArr = arr.filter((symbol)=>{
          //至少满足其中n个条件
          if(dit[symbol] >= config.trueCount){
            var oneMinData = dapanDataDit[symbol]
            var dateTime = getSymbolDataByKey(oneMinData, '日期')
            var price = getSymbolDataByKey(oneMinData, config.dataKey)
            var time = getTimeByPriceKey(config.dataKey)
            var result = recordJiaoyiInfo(fullObject, symbol, price, dateTime + ' ' + time, config.doType)
            if(result == true){
              returnDit[symbol] = 1
            }
            oneMinData = null
            dateTime = null
            price = null
            time = null
            return result
          }
          return false
        })

        // 这里返回的是一天的分时数据循环下来触发交易的股票数据
        // 虽然会返回筛选后的数组，但是是否会覆盖传入的数组取决于上层调用者
        // 清除引用
        dapanData = null
        dapanDataDit = null
        // symbolsDit = null
        dit = null
        return Object.keys(returnDit)
      }
    },
    {
      name: '循环n天', 
      id: '28',
      des: '对一段交易日进行顺序执行，以减少重复规则，当此规则在筛选列表中时，子规则触发达到累计次数时，此规则触发，开始值结束值可以为负数，表示以当前起点日期往前多少天，例如-1表示上一个交易日，-2表示上两个交易日，当开始值和结束值区间包含0时，0将会被跳过（因为0不代表任何一个交易日）。',
      key: 'loopRunDay',  //唯一key
      inCardBottom: true,
      getTitle: function(hideChildKeys){
        return '循环第' + this.values[0].value  + '日到第' + this.values[1].value + '日'
      },
      justByDay: true, 
      isLoop: true,
      values: [
        {key: 'dayStart', type: 'number', value: 5, min: -365, max: 365, step: 1, formatter:value => `第${value}日`, before:'开始', width: '130px', des: '从第几天开始循环，包含开始循环的当天', parser:value => Number(value.substr(1,value.length - 2))},
        {key: 'dayEnd', type: 'number', value: 5, min: -365, max: 365, step: 1, formatter:value => `第${value}日`, before:'结束', width: '130px', des: '循环到第几天结束，包含结束循环的当天，结束的值需要比开始的值大', parser:value => Number(value.substr(1,value.length - 2))},
        {key: 'compire', type: 'select', value: 'biggerEquire', options: CompireOption, des: '选择规则是满足右侧次数还是不能超过右侧次数'},
        {key: 'toggleCount', type: 'number', value: 1, min: 0, max: 9999, step: 1, formatter:value => `${value}次`, before:'累计', width: '130px', des: '在循环过程中子规则需要累计触发的次数，达到累计触发次数，此规则才触发，当有多个子规则时，子规则的触发次数会累加，如果此规则位于买入卖出规则的根结点，则此参数无任何作用（买入卖出规则按顺序执行但不会筛选股票）', parser:value => Number(value.replace('次', ''))},
        {key: 'rules', value: [], type: 'values', inBottom: true, hideChildKeys: ['day']},
      ],
      filter: async (arr, config, fullObject)=>{
        // 此方法会对所有一级子节点的key为'day', 'time'的参数进行覆盖
        var returnDit = {}

        //循环每天
        for(var day = config.dayStart; day <= config.dayEnd; day++){
          // console.log('当前循环到第几天', day)
          if(day == 0){
            //如果天数是0的话，直接跳过
            continue
          }
          for(var i = 0; i < config.rules.length; i++){
            var oneRule = config.rules[i]
            if(oneRule.checked != true){
              continue
            }
            if(RuleDit[oneRule.key] != null){
              var oneConfig = arrToDit(oneRule.values, 'key', 'value')
              oneConfig.ruleId = oneRule.id
              //直接覆盖当前的配置到子规则，不管子规则有没有配置，因为就算没有配置项，也不影响，但是总有会需要用到的情况
              oneConfig.day = day
  
              var onearr = await RuleDit[oneRule.key].filter(arr, oneConfig, fullObject)
              oneRule.resultCount = onearr.length
              for(var j = 0; j < onearr.length; j++){
                if(returnDit[onearr[j]] == null){
                  returnDit[onearr[j]] = 1
                }else{
                  returnDit[onearr[j]] += 1
                }
              }
              oneConfig = null
              onearr = null
            }else{
              console.log('规则缺失', oneRule)
            }
            oneRule = null
          }
        }
        // 这里返回的是一天的分时数据循环下来触发交易的股票数据
        // 虽然会返回筛选后的数组，但是是否会覆盖传入的数组取决于上层调用者
        // 清除引用
        // console.log('returnDit', returnDit)
        arr = arr.filter((symbol)=>{
          var firstValue = 0
          if(returnDit[symbol] != null){
            firstValue = returnDit[symbol]
          }
          return compireTwoValue(firstValue, config.compire, config.toggleCount)
        })
        returnDit = null

        return arr
      }
    },
    {
      name: '循环第n日的分时数据', 
      id: '31',
      des: '循环某一日的分时数据，当循环中的规则满足时返回筛选结果列表',
      key: 'loopOneDayMinTimeData',  //唯一key
      inCardBottom: true,
      getTitle: function(hideChildKeys){
        if(hideChildKeys != null && hideChildKeys.indexOf('day') != -1){
          return '循环分时数据任意' + this.values[1].value + '个条件满足'
        }else{
          return '循环第' + this.values[0].value  + '日分时数据任意' + this.values[1].value + '个条件满足'
        }
      },
      needMinData: true, 
      isLoop: true,
      values: [
        {key: 'day', type: 'number', value: 5, min: 1, max: 365, step: 1, formatter:value => `第${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
        {key: 'trueCount', value: 1, type: 'number', min: 1 , step: 1, formatter:value => `${value}个`, parser:value => Number(value.replace('个', ''))},
        {key: 'rules', value: [], type: 'values', inBottom: true,  hideChildKeys: ['day', 'time']},
      ],
      filter: async (arr, config, fullObject)=>{
        var backArr = await checkVaildDate(fullObject, config)
        if(backArr != null){
          return backArr
        }
        // var symbolsDit = strArrToDit(arr)
        var dapanMinData = await YWRequest.getOneDayMinDataByType(fullObject.start_date, config.day, arr, {avePrice: "均价", timeDit: true}, huiceConfig.secondKLine)

        // 此方法会对所有一级子节点的key为'day', 'time'的参数进行覆盖
        var returnDit = {}
        for(var timeIndex = 0; timeIndex < YWRequest[huiceConfig.secondKLine].length; timeIndex++){
          var time = YWRequest[huiceConfig.secondKLine][timeIndex].value
          var dit = {}
          for(var i = 0; i < config.rules.length; i++){
            var oneRule = config.rules[i]
            if(oneRule.checked != true){
              continue
            }
            if(RuleDit[oneRule.key] != null){
              var oneConfig = arrToDit(oneRule.values, 'key', 'value')
              oneConfig.ruleId = oneRule.id
              //直接覆盖当前的配置到子规则，不管子规则有没有配置，因为就算没有配置项，也不影响，但是总有会需要用到的情况
              oneConfig.time = time
              oneConfig.day = config.day

              var onearr = await RuleDit[oneRule.key].filter(arr, oneConfig, fullObject, dapanMinData)
              oneRule.resultCount = onearr.length
              for(var j = 0; j < onearr.length; j++){
                if(dit[onearr[j]] == null){
                  dit[onearr[j]] = 1
                }else{
                  dit[onearr[j]] += 1
                }
              }
              oneConfig = null
              oneRule = null
              onearr = null
            }else{
              console.log('规则缺失', oneRule)
            }
          }
          // console.log('当前时间有多少满足的条件', time, dit)
          arr.filter((symbol)=>{
            //至少满足其中n个条件
            if(dit[symbol] >= config.trueCount){
              returnDit[symbol] = 1
              return true
            }
            return false
          })
          time = null
          dit = null
        }
        // 这里返回的是一天的分时数据循环下来触发交易的股票数据
        // 虽然会返回筛选后的数组，但是是否会覆盖传入的数组取决于上层调用者
        // 清除引用
        dapanMinData = null
        // symbolsDit = null
        return Object.keys(returnDit)
      }
    },
    {
      name: '是否双底企稳', 
      id: '17',
      des: '用于判断某一天的分时k线是否有双底企稳形态，判断方法为股价下跌至均价线下，又拉伸回均价以上，如果需要更强硬的企稳判断，建议增加判断收盘价是否在均价线以上的规则，如果此规则放在循环分时数据下单的项目中，此规则将自动根据当前可访问的最大时间来返回是否触发规则，不会访问未来数据',
      key: 'isDoubleDownThenUp',  //唯一key
      needMinData: true,  //是否需要分时数据，如果当天分时数据缺失，则规则无法正常生效
      getTitle: function(hideChildKeys){
        if(hideChildKeys != null && hideChildKeys.indexOf('day') != -1){
          return '是否双底企稳'
        }else{
          return '第' + this.values[0].value + '日是否双底企稳'
        }
      },
      values:[
          {key: 'day', type: 'number', value: 3, min: 1, max: 365, step: 1, formatter:value => `第${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
          {key: 'isTrue', type: 'select', value: 'true', options: BoolenOption},
          {key: 'valueScale', type: 'number', value: 0.985, step: 0.01, formatter:value => `${value}倍`, des:'此数值是指当某一时刻收盘价跌到低于均价的多少倍才能触发算下跌，然后从低位上涨' ,parser:value => Number(value.replace('倍', ''))},
          {key: 'valueScaleUp', type: 'number', value: 1, step: 0.01, formatter:value => `${value}倍`, des:'此数值是指当某一时刻收盘价涨到高于均价多少倍才算企稳' ,parser:value => Number(value.replace('倍', ''))},
      ],
      filter: async (arr, config, fullObject, dapanMinData)=>{
          var backArr = await checkVaildDate(fullObject, config)
          if(backArr != null){
            return backArr
          }
          // var symbolsDit = strArrToDit(arr)
          //这里返回的已经是以symbol为key的股票字典，value为数组格式的分时数据序列
          //均价得循环计算得出，所以还得获取一整天的先
          // dapanMinData是dit
          if(dapanMinData == null){
            dapanMinData = await YWRequest.getOneDayMinDataByType(fullObject.start_date, config.day, arr, {avePrice: "均价", timeDit: true}, huiceConfig.secondKLine)
          }
          // var dapanMinDataArr = await YWRequest.getOneDayMinDataByType(fullObject.start_date, config.day, symbolsDit, {avePrice: "均价", timeDit: false}, huiceConfig.secondKLine)
          // console.log('dapanMinDataArr dd', dapanMinDataArr)
          // 代码 开盘 成交量 成交额 换手率 收盘 时间 最低 最高
          arr = arr.filter((symbol)=>{
              var isSmallAvePrice = false
              var isThenBiggerAvePrice = false
              if(dapanMinData[symbol] != null){
                for(var time in dapanMinData[symbol]){
                  var oneMinData = dapanMinData[symbol][time]

                  var price =  getSymbolDataByKey(oneMinData, '收盘')
                  var junjia = getSymbolDataByKey(oneMinData, '均价')
                  if(isSmallAvePrice == false){
                    isSmallAvePrice = compireTwoValue(price, 'small', junjia * config.valueScale)
                    if(isSmallAvePrice == true){
                      // console.log('触发了小于均价对比',symbol, oneMinData['时间'], price, junjia)
                    }
                  }else{
                    isThenBiggerAvePrice = compireTwoValue(price, 'bigger', junjia * config.valueScaleUp)
                    if(isThenBiggerAvePrice == true){
                      // console.log('触发了大于均价对比',symbol,oneMinData['时间'], price, junjia * config.valueScaleUp)
                      break
                    }
                  }

                  if(config.time != null){
                    //当传入了时间时，此规则只能顺序执行到此事件结束为止
                    if(config.time == time){
                      //已经执行到此时间了，不能再继续执行
                      // console.log('已经执行到此时间了，不能再继续执行', config.time)
                      break
                    }
                  }
                }
              }
              if(config.isTrue == 'true'){
                return isThenBiggerAvePrice
              }
              return !isThenBiggerAvePrice
          })
          // symbolsDit = null
          dapanMinData = null
          return arr
      },
    },
    {
      name: '时间比较', 
      id: '18',
      des: '用于在循环分时数据时某一时刻的时间比较',
      key: 'timeCompire',  //唯一key
      values:[
          {key: 'time', type: 'select', value: '09:35', options: 'minOption'},
          {key: 'compire', type: 'select', value: 'bigger', options: CompireOption},
          {key: 'timeToCompire', type: 'select', value: '09:45', options: 'minOption'},
      ],
      filter: async (arr, config, fullObject, dapanMinData)=>{
          // 代码 开盘 成交量 成交额 换手率 收盘 时间 最低 最高
          return arr.filter((symbol)=>{
            return compireTwoTime(config.time, config.compire, config.timeToCompire)
          })
      },
    },
    {
      name: '获利比较', 
      id: '19',
      des: '用于在循环分时数据时对某一时刻持仓的获利幅度进行筛选',
      key: 'winPresentCompire',  //唯一key
      needMinData: true,
      group: [RuleType.RuleOfBuy, RuleType.RuleOfSale],
      values:[
          {key: 'day', type: 'number', value: 3, min: 1, max: 365, step: 1, formatter:value => `第${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
          {key: 'time', type: 'select', value: '09:35', options: 'minOption'},
          {key: 'dataKey', type: 'select', value: '收盘', options: SymbolPriceOptionOfBuySale, des: '以分时的哪一个指标计算获利比例'},
          {key: 'compire', type: 'select', value: 'bigger', options: CompireOption},
          {key: 'winPresent', type: 'number', value: 5, step: 0.1, formatter:value => `${value}%`, parser:value => Number(value.replace('%', ''))},
      ],
      filter: async (arr, config, fullObject, dapanMinData)=>{
          var backArr = await checkVaildDate(fullObject, config)
          if(backArr != null){
            return backArr
          }
          // 代码 开盘 成交量 成交额 换手率 收盘 时间 最低 最高
          if(dapanMinData == null){
            // var symbolsDit = strArrToDit(arr)
            dapanMinData = await YWRequest.getOneDayMinDataByType(fullObject.start_date, config.day, arr, {avePrice: "均价", timeDit: true}, huiceConfig.secondKLine)
            // symbolsDit = null
          }

          arr = arr.filter((symbol)=>{
            var oneJiaoyiInfo = getJiaoyiInfo(fullObject, symbol)
            if(oneJiaoyiInfo == null){
              return false
            }
            if(oneJiaoyiInfo.buyPrice == null){
              return false
            }

            if(dapanMinData[symbol] != null){
              var oneMinData = dapanMinData[symbol][config.time]
              if(oneMinData != null){
                var price = getSymbolDataByKey(oneMinData, config.dataKey)
                var buyPrice = oneJiaoyiInfo.buyPrice
                var winPresent = (price - buyPrice) / buyPrice * 100
                // console.log('比较获利', winPresent, config.winPresent)
                return compireTwoValue(winPresent, config.compire, config.winPresent)
              }
            }
            return false
          })
          dapanMinData = null
          return arr
      },
    },
    {
      name: '获利比较', 
      id: '26',
      des: '以日k数据计算获利幅度进行筛选，适合在缺少分时数据时使用',
      key: 'winPresentCompireDay',  //唯一key
      group: [RuleType.RuleOfBuy, RuleType.RuleOfSale],
      justByDay: true,
      values:[
          {key: 'day', type: 'number', value: 3, min: 1, max: 365, step: 1, formatter:value => `第${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
          {key: 'dataKey', type: 'select', value: '收盘', options: SymbolPriceOptionOfBuySale, des: '以哪一个指标计算获利比例'},
          {key: 'compire', type: 'select', value: 'bigger', options: CompireOption},
          {key: 'winPresent', type: 'number', value: 5, step: 0.1, formatter:value => `${value}%`, parser:value => Number(value.replace('%', ''))},
      ],
      filter: async (arr, config, fullObject)=>{
          var backArr = await checkVaildDate(fullObject, config)
          if(backArr != null){
            return backArr
          }
          // 代码 开盘 成交量 成交额 换手率 收盘 时间 最低 最高
          // var symbolsDit = strArrToDit(arr)
          var dapanData = await YWRequest.getOneDayDataDeal(fullObject.start_date, config.day, arr, {select: GenSelectKeys([config.dataKey])})
          var dapanDataDit = arrToDit(dapanData, '代码')

          arr = arr.filter((symbol)=>{
            var oneJiaoyiInfo = getJiaoyiInfo(fullObject, symbol)
            if(oneJiaoyiInfo == null){
              return false
            }
            if(oneJiaoyiInfo.buyPrice == null){
              return false
            }

            if(dapanDataDit[symbol] != null){
              var oneData = dapanDataDit[symbol]
              if(oneData != null){
                var price = getSymbolDataByKey(oneData, config.dataKey)
                var buyPrice = oneJiaoyiInfo.buyPrice
                var winPresent = (price - buyPrice) / buyPrice * 100
                // console.log('比较获利', winPresent, config.winPresent)
                return compireTwoValue(winPresent, config.compire, config.winPresent)
              }
            }
            return false
          })
          // symbolsDit = null
          dapanData = null 
          dapanDataDit = null
          return arr
      },
    },
    {
      name: '是否判定为上涨未突破前高', 
      id: '30',
      des: '一般情况下用于循环分时数据的规则下，在循环分时数据时判断当第二次进入上涨趋势时是否没有超过前面的高点，如果上涨趋势中断且没有超过前高，触发此规则。此规则的触发比较频繁，细微的k线抖动也可能触发此规则，最好配合偏离均价的判断，过滤掉均价附近的触发。',
      key: 'volumeAndPriceIsTop',  //唯一key
      needMinData: true,  //是否需要分时数据，如果当天分时数据缺失，则规则无法正常生效
      getTitle: function(hideChildKeys){
        if(hideChildKeys != null && hideChildKeys.indexOf('day') != -1){
          var dayStr = hideChildKeys.indexOf('day') != -1 ? '' : '第' + this.values[0].value + '日'
          var minStr = hideChildKeys.indexOf('time') != -1 ? '' : this.values[1].value
          return dayStr + minStr + '是否判定为上涨' + optionValueToLabel(this.values[3].value, UpPointOption)
        }else{
          return '第' + this.values[0].value + '日' + this.values[1].value + '是否判定为上涨'  + optionValueToLabel(this.values[3].value, UpPointOption)
        }
      },
      values:[
          {key: 'day', type: 'number', value: 3, min: 1, max: 365, step: 1, formatter:value => `第${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
          {key: 'time', type: 'select', value: '10:55', options: 'minOption'},
          {key: 'isTrue', type: 'select', value: 'true', options: BoolenOption},
          {key: 'togglePoint', type: 'select', value: 'upBack', title:'触发模式', options: UpPointOption}
      ],
      filter: async (arr, config, fullObject, dapanMinData)=>{
          var backArr = await checkVaildDate(fullObject, config)
          if(backArr != null){
            return backArr
          }
          // var symbolsDit = strArrToDit(arr)
          //这里返回的已经是以symbol为key的股票字典，value为数组格式的分时数据序列
          //均价得循环计算得出，所以还得获取一整天的先
          // dapanMinData是dit
          if(dapanMinData == null){
            dapanMinData = await YWRequest.getOneDayMinDataByType(fullObject.start_date, config.day, arr, {avePrice: "均价", timeDit: true}, huiceConfig.secondKLine)
          }
          // console.log('dapanMinDataArr dd', dapanMinDataArr)
          // 代码 开盘 成交量 成交额 换手率 收盘 时间 最低 最高
          arr = arr.filter((symbol)=>{
              var result = false
              if(dapanMinData[symbol] != null){
                var maxPoint = null
                var minPoint = null

                var maxPrice = null
                var minPrice = null
                
                //自启动点后的最高价，当设置最高价后，如果下一个时间点的收盘小于此价格，
                //且当前最高价的时间点还是在启动点之前，说明上涨没突破之前的高价
                var secondMaxPrice = null
                var secondMinPrice = null
                var secondPoint = null //第二个最高点

                var oneUpLoogCount = 0          //把一次上涨超过第一个最高价，然后触发上涨未突破算作一轮完整的上涨，当出现第二轮上涨未突破的时候，卖出
                var upBreakMaxToggle = false    //是否激活了上涨突破前高

                var upStartPoint = null
                for(var time in dapanMinData[symbol]){
                  result = false  //每一个时间点的循环开始，result重置为false

                  var oneMinData = dapanMinData[symbol][time]
                
                  var minOpenPrice = getSymbolDataByKey(oneMinData, '开盘')
                  var minClosePrice = getSymbolDataByKey(oneMinData, '收盘')
                  
                  // 计算最高价时使用最高价格
                  // var minMaxPrice = getSymbolDataByKey(oneMinData, '最高')
                  // var minMinPrice = getSymbolDataByKey(oneMinData, '最低')

                  //改成用实体部分的最大值最小值
                  var minMaxPrice = Math.max(minOpenPrice, minClosePrice) //实体部分的最小值
                  var minMinPrice = Math.min(minOpenPrice, minClosePrice) //实体部分的最大值


                  if(maxPoint == null){
                    maxPoint = time
                    maxPrice = minMaxPrice

                    minPoint = time
                    minPrice = minClosePrice
                    //当前是第一个时间点，直接设置完最高价就跳过
                    continue
                  }
                  if(minClosePrice < minPrice){
                    minPoint = time
                    minPrice = minClosePrice
                    if(upStartPoint != null){
                      // console.log(time, '跌破了上涨前的最低点minPrice', minPoint, upBreakMaxToggle)
                      upStartPoint = null
                      // if(upBreakMaxToggle == true){
                        oneUpLoogCount += 1
                        // upBreakMaxToggle = false
                      // }

                      // console.log('第' + oneUpLoogCount + '次上涨未突破前高，且跌破支撑位，应该卖出了', time, minClosePrice , '对比的时间和价格:', secondPoint, secondMinPrice)
                      if(config.togglePoint == 'upBack' && oneUpLoogCount >= 2){
                        result = true
                      }
                    }
                  }else if(minMaxPrice > maxPrice){
                    maxPoint = time
                    maxPrice = minMaxPrice
                    //同时移动最地点，确保最低点总是在最高点右侧

                    minPoint = time
                    minPrice = minClosePrice
                    if(upStartPoint != null){
                      //上涨突破前高
                      upBreakMaxToggle = true
                      oneUpLoogCount = 0  //如果突破前高，那次数也修改了
                      if(config.togglePoint == 'upBreak'){
                        result = true
                      }
                    }
                    upStartPoint = null //每次更新了最低点，启动点就重置，启动点为下一次没有更新最低点也没有更新最高点的点
                  }else{
                    //如果既没有刷新最高价也没有刷新最低价
                    if(upStartPoint == null){
                      //如果上涨启动点为空，设置上涨启动点
                      upStartPoint = time
                      // secondMaxPrice = null //maxPrice
                      secondPoint = null //time //第二个最高点
                    }
                  }

                  // console.log('当前时间', time, 'minPoint', minPoint, 'maxPoint', maxPoint, 'upStartPoint', upStartPoint, 'secondPoint', secondPoint, )

                  //如果启动点不为空
                  if(upStartPoint != null){
                    if(secondPoint == null){
                      secondMaxPrice = minMaxPrice
                      secondMinPrice = minMinPrice
                      secondPoint = time
                    }else{
                      if(minMaxPrice > secondMaxPrice){ //minMaxPrice 改成 minClosePrice 以实体作为最大值
                        secondMaxPrice = minMaxPrice
                        secondMinPrice = minMinPrice
                        secondPoint = time
                        // console.log('重新设置secondPoint', time, minMaxPrice, minMinPrice)
                      }else{
                        //收盘价也低于上一个的最低价才算跌下来了
                        // console.log(time, 'minClosePrice < secondMinPrice', minClosePrice < secondMinPrice, minClosePrice , secondMinPrice)
                        if(minClosePrice < secondMinPrice){
                          // if(upBreakMaxToggle == true){
                            oneUpLoogCount += 1
                            upBreakMaxToggle = false
                          // }
                          // console.log('第' + oneUpLoogCount + '次上涨未突破前高，应该卖出了', time, minClosePrice , '对比的时间和价格:', secondPoint, secondMinPrice)
                          upStartPoint = null //没有上涨启动点饿了
                          if(config.togglePoint == 'upBack' && oneUpLoogCount >= 2){
                            result = true
                          }
                        }
                      }
                    }
                  }

                  if(config.time != null){
                    //当传入了时间时，此规则只能顺序执行到此事件结束为止
                    if(config.time == time){
                      //已经执行到此时间了，不能再继续执行
                      // console.log('已经执行到此时间的最低点和最高点', time, minPoint, maxPoint)
                      // console.log('已经执行到此时间了，不能再继续执行', config.time)
                      break
                    }
                  }
                }
                // console.log('已经执行到此时间的最低点和最高点', time, minPoint, maxPoint)
              }
              if(config.isTrue == 'true'){
                return result
              }
              return !result
          })
          // symbolsDit = null
          dapanMinData = null
          return arr
      },
    },
    {
      name: '是否判定为下跌跌破前低', 
      id: '35',
      des: '一般情况下用于循环分时数据的规则下，在循环分时数据时判断当第二次进入下跌趋势时是否有跌破前面的低点，触发模式有两种可选，一种是当下跌超过前低点时触发，另一种是下跌趋势中断且没有跌破前低触发。此规则的触发比较频繁，细微的k线抖动也可能触发此规则，最好配合偏离均价的判断，过滤掉均价附近的触发。',
      key: 'volumeAndPriceIsLow',  //唯一key
      needMinData: true,  //是否需要分时数据，如果当天分时数据缺失，则规则无法正常生效
      getTitle: function(hideChildKeys){
        if(hideChildKeys != null){
          var dayStr = hideChildKeys.indexOf('day') != -1 ? '' : '第' + this.values[0].value + '日'
          var minStr = hideChildKeys.indexOf('time') != -1 ? '' : this.values[1].value
          return dayStr + minStr + '是否判定为下跌' + optionValueToLabel(this.values[3].value, DownPointOption)
        }else{
          return '第' + this.values[0].value + '日' + this.values[1].value + '是否判定为下跌' + optionValueToLabel(this.values[3].value, DownPointOption)
        }
      },
      values:[
          {key: 'day', type: 'number', value: 3, min: 1, max: 365, step: 1, formatter:value => `第${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
          {key: 'time', type: 'select', value: '10:55', options: 'minOption'},
          {key: 'isTrue', type: 'select', value: 'true', options: BoolenOption},
          {key: 'togglePoint', type: 'select', value: 'downBreak', title:'触发模式', options: DownPointOption}
      ],
      filter: async (arr, config, fullObject, dapanMinData)=>{
          var backArr = await checkVaildDate(fullObject, config)
          if(backArr != null){
            return backArr
          }
          // var symbolsDit = strArrToDit(arr)
          //这里返回的已经是以symbol为key的股票字典，value为数组格式的分时数据序列
          //均价得循环计算得出，所以还得获取一整天的先
          // dapanMinData是dit
          if(dapanMinData == null){
            dapanMinData = await YWRequest.getOneDayMinDataByType(fullObject.start_date, config.day, arr, {avePrice: "均价", timeDit: true}, huiceConfig.secondKLine)
          }
          // console.log('dapanMinDataArr dd', dapanMinData)
          // 代码 开盘 成交量 成交额 换手率 收盘 时间 最低 最高
          arr = arr.filter((symbol)=>{
              var result = false
              if(dapanMinData[symbol] != null){
                var maxPoint = null
                var minPoint = null

                var maxPrice = null
                var minPrice = null
                
                //这里的启动点变成了下跌的启动点，而不是上涨的启动点，下跌的启动点和上涨的启动点相反
                //自启动点后的最低价，当设置最低价后，如果下一个时间点的收盘小于此价格，
                //且当前最低价的时间点还是在启动点之前，说明下涨没突破之前的低价
                //启动点总是在最低价的右侧
                var secondMaxPrice = null
                var secondMinPrice = null
                var secondPoint = null

                var downStartPoint = null
                for(var time in dapanMinData[symbol]){
                  result = false  //每一个时间点的循环开始，result重置为false
                  var oneMinData = dapanMinData[symbol][time]
                
                  var minOpenPrice = getSymbolDataByKey(oneMinData, '开盘')
                  var minClosePrice = getSymbolDataByKey(oneMinData, '收盘')
                  // 计算最高价时使用最高价格
                  // var minMaxPrice = getSymbolDataByKey(oneMinData, '最高')
                  // var minMinPrice = getSymbolDataByKey(oneMinData, '最低')

                  //改成用实体部分的最大值最小值
                  var minMaxPrice = Math.max(minOpenPrice, minClosePrice) //实体部分的最小值
                  var minMinPrice = Math.min(minOpenPrice, minClosePrice) //实体部分的最大值


                  if(maxPoint == null){
                    maxPoint = time
                    maxPrice = minMaxPrice

                    minPoint = time
                    minPrice = minClosePrice
                    //当前是第一个时间点，直接设置完最高价最低价就跳过
                    continue
                  }

                  if(minClosePrice < minPrice){
                    minPoint = time
                    minPrice = minClosePrice
                    //同时移动最高点，确保最高点总是在最低点右侧
                    maxPoint = time
                    maxPrice = minMaxPrice
                    if(downStartPoint != null){
                      // console.log('下跌跌破前低了', time, config)
                      if(config.togglePoint == 'downBreak'){
                        result = true
                      }
                    }
                    downStartPoint = null
                  }else if(minMaxPrice > maxPrice){
                    maxPoint = time
                    maxPrice = minMaxPrice
                    downStartPoint = null //每次更新了最低点，启动点就重置，启动点为下一次没有更新最低点也没有更新最高点的点
                  }else{
                    //如果既没有刷新最高价也没有刷新最低价
                    if(downStartPoint == null){
                      //如果上涨启动点为空，设置上涨启动点
                      downStartPoint = time
                      secondPoint = null //time
                    }
                  }
                  // console.log('当前时间', time, '最高点', maxPoint, '最低点', minPoint, '下跌启动点', downStartPoint)
                  //如果启动点不为空
                  if(downStartPoint != null){
                    if(secondPoint == null){
                      secondMaxPrice = minMaxPrice
                      secondMinPrice = minMinPrice
                      secondPoint = time
                    }else{
                      if(minClosePrice < secondMinPrice){
                        secondMaxPrice = minMaxPrice
                        secondMinPrice = minMinPrice
                        secondPoint = time
                      }else{
                        //收盘价也高于上一个最高价价才算未跌破前低，反弹了
                        if(minClosePrice > secondMaxPrice){
                          // console.log('下跌未跌破前低，应该买入了', time, minMaxPrice , '对比的时间和价格:', secondPoint, secondMaxPrice)
                          downStartPoint = null //没有上涨启动点饿了
                          //这里触发的是未跌破前低，现在需要跌破前低的触发
                          if(config.togglePoint == 'downBack'){
                            result = true
                          }
                        }
                      }
                    }
                  }

                  if(config.time != null){
                    //当传入了时间时，此规则只能顺序执行到此事件结束为止
                    if(config.time == time){
                      //已经执行到此时间了，不能再继续执行
                      // console.log('已经执行到此时间的最低点和最高点', time, minPoint, maxPoint)
                      // console.log('已经执行到此时间了，不能再继续执行', config.time, result)
                      break
                    }
                  }
                }
                // console.log('已经执行到此时间的最低点和最高点', time, minPoint, maxPoint)
              }
              if(config.isTrue == 'true'){
                return result
              }
              return !result
          })
          // symbolsDit = null
          dapanMinData = null
          return arr
      },
    },
    {
      name: '第n日集合竞价对比', 
      id: '32',
      des: '筛选第n日集合竞价的数据对比，其中后一个指标可以乘以一个倍数，集合竞价的数据，交易快照可能出现价格缺失的情况，价格取值顺序买1->卖1->现价，其中9:20价格指的是9:20:00至9:20:09之间最后一个快照的价格，9:24价格指的是9:24分最后一个快照的价格，9:25同理',
      key: 'jinjiaCompareByChoose',  //唯一key
      getTitle: function(hideChildKeys){
        if(hideChildKeys != null && hideChildKeys.indexOf('day') != -1){
          return '集合竞价对比'
        }else{
          return '第' + this.values[0].value + '日集合竞价对比'
        }
      },
      needJinjiaData: true, 
      values:[
          {key: 'day', type: 'number', value: 1, min: 1, max: 365, step: 1, formatter:value => `n=${value}`, parser:value => Number(value.replace('n=', ''))},
          {key: 'time', type: 'select', value: '09:24:57', options: 'jiheJinJiaTimeOption'},
          {key: 'firstKey', type: 'select', value: '开盘', options: JiheJinjiaOption},
          {key: 'compire', type: 'select', value: 'small', options: CompireOption},
          {key: 'time2', type: 'select', value: '09:25:00', options: 'jiheJinJiaTimeOption'},
          {key: 'secondKey', type: 'select', value: '开盘', options: JiheJinjiaOption},
          {key: 'valueScale', type: 'number', value: 1, step: 0.01, formatter:value => `${value}倍`, parser:value => Number(value.replace('倍', ''))},
      ],
      filter: async (arr, config, fullObject)=>{
          var backArr = await checkVaildDate(fullObject, config)
          if(backArr != null){
            return backArr
          }
          var symbolsDit = strArrToDit(arr)
          var jinjiaData = YWRequest.getJihejinjiaDataV2(fullObject.start_date, config.day, symbolsDit, {timeDit: true})
          // if(Object.keys(jinjiaData).length == 0){
          //   // console.log('获得的jinjiaData为空', fullObject.start_date, config.day, symbolsDit)
          // }
          // console.log('获得的jinjiaData', jinjiaData, config.time2)
          arr = arr.filter((symbol)=>{
            var result = false
            if(jinjiaData[symbol] != null){
              var firstValue  = getJinJiaDataByTime(jinjiaData, symbol, config.time, config.firstKey)
              var secondValue = getJinJiaDataByTime(jinjiaData, symbol, config.time2, config.secondKey)
              // if(jinjiaData[symbol][config.time] != null){
              //   // console.log('获得的jinjiaData time', jinjiaData[symbol][config.time])
              //   firstValue = jinjiaData[symbol][config.time][config.firstKey]
              // }
              // if(jinjiaData[symbol][config.time2] != null){
              //   // console.log('获得的jinjiaData time2', jinjiaData[symbol][config.time2])
              //   secondValue = jinjiaData[symbol][config.time2][config.secondKey]
              // }
              
              // console.log('获得的jinjiaData secondValue, secondValue', firstValue, secondValue, compireTwoValue(firstValue, config.compire, secondValue * config.valueScale))
              //如果值为空，那就不能对比
              if(firstValue != null && secondValue != null){
                result = compireTwoValue(firstValue, config.compire, secondValue * config.valueScale)
              }
            }
            return result
          })
          symbolsDit = null
          jinjiaData = null
          config = null
          return arr
      }
    },
    {
      name: '第n日集合竞价对比日K数据', 
      id: '36',
      des: '筛选第n日集合竞价的数据对比，其中后一个指标可以乘以一个倍数，集合竞价的数据，交易快照可能出现某一时间缺失的情况，并不严格按照每9秒一次快照',
      key: 'jinjiaCompareDayByChoose',  //唯一key
      getTitle: function(hideChildKeys){
        if(hideChildKeys != null && hideChildKeys.indexOf('day') != -1){
          return '集合竞价对比第' + this.values[4].value + '日K数据'
        }else{
          return '第' + this.values[0].value + '日集合竞价对比第' + this.values[4].value + '日K数据'
        }
      },
      needJinjiaData: true, 
      values:[
          {key: 'day', type: 'number', value: 1, min: 1, max: 365, step: 1, formatter:value => `第${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
          {key: 'time', type: 'select', value: '09:24:57', options: 'jiheJinJiaTimeOption'},
          {key: 'firstKey', type: 'select', value: '开盘', options: JiheJinjiaOption},
          {key: 'compire', type: 'select', value: 'small', options: CompireOption},
          {key: 'day2', type: 'number', value: 1, min: 1, max: 365, step: 1, formatter:value => `第${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
          {key: 'secondKey', type: 'select', value: '涨停价', options: SymbolOption},
          {key: 'valueScale', type: 'number', value: 1, step: 0.01, formatter:value => `${value}倍`, parser:value => Number(value.replace('倍', ''))},
      ],
      filter: async (arr, config, fullObject)=>{
          var backArr = await checkVaildDate(fullObject, config)
          if(backArr != null){
            return backArr
          }
          var symbolsDit = strArrToDit(arr)
          var jinjiaData = YWRequest.getJihejinjiaDataV2(fullObject.start_date, config.day, symbolsDit, {timeDit: true})
          var dapanData = await YWRequest.getOneDayDataDeal(fullObject.start_date, config.day2, arr,  {select: GenSelectKeys([config.secondKey])})
          var dapanDataDit = arrToDit(dapanData, '代码')

          // console.log('获得的jinjiaData', jinjiaData, dapanDataDit)
          arr = arr.filter((symbol)=>{
            var result = false
            if(jinjiaData[symbol] != null && dapanDataDit[symbol] != null){
              var firstValue  = getJinJiaDataByTime(jinjiaData, symbol, config.time, config.firstKey)
              var secondValue = null
              
              if(dapanDataDit[symbol]){
                secondValue = getSymbolDataByKey(dapanDataDit[symbol], config.secondKey)
              }
              if(firstValue != null && secondValue != null){
                result = compireTwoValue(firstValue, config.compire, secondValue * config.valueScale)
              }
              firstValue = null
              secondValue = null
            }
            return result
          })
          symbolsDit = null
          jinjiaData = null
          dapanData = null
          dapanDataDit = null
          config = null
          return arr
      }
    },
    {
      name: '第n日集合竞价期间是否涨/跌停', 
      id: '37',
      des: '当集合竞价期间出现涨停或跌停时触发',
      key: 'jinjiaHasDownOrUpTop',  //唯一key
      getTitle: function(hideChildKeys){
        if(hideChildKeys != null && hideChildKeys.indexOf('day') != -1){
          return '集合竞价是否出现' + optionValueToLabel(this.values[2].value, ValueTypeOption)
        }else{
          return '第' + this.values[0].value + '日集合竞价是否出现' + optionValueToLabel(this.values[2].value, ValueTypeOption)
        }
      },
      needJinjiaData: true, 
      values:[
          {key: 'day', type: 'number', value: 1, min: 1, max: 365, step: 1, formatter:value => `第${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
          {key: 'timeSpace', type: 'TimePicker', value: ['09:20:00', '09:24:57'], des: '设置只有在某一时间段内涨停或跌停此规则会触发，包含起止时间', format: 'HH:mm:ss'},
          // {key: 'compire', type: 'select', value: 'smallEquire', options: CompireOption},
          {key: 'valueType', type: 'select', value: '跌停价', options: ValueTypeOption},
          {key: 'valueScale', type: 'number', value: 1, step: 0.01, formatter:value => `${value}倍`, parser:value => Number(value.replace('倍', '')), 'des': '可以设置上一个值乘的倍率，如果填1表示，必须出现跌停/涨停价，如果填0.99表示离涨跌停差一个1个点以内也触发'},
      ],
      filter: async (arr, config, fullObject)=>{
          var backArr = await checkVaildDate(fullObject, config)
          if(backArr != null){
            return backArr
          }

          var symbolsDit = strArrToDit(arr)
          var jinjiaData = YWRequest.getJihejinjiaDataV2(fullObject.start_date, config.day, symbolsDit, {timeDit: false})
          var dapanData = await YWRequest.getOneDayDataDeal(fullObject.start_date, config.day, arr)
          var dapanDataDit = arrToDit(dapanData, '代码')
          var compire = config.valueType == '跌停价' ? 'smallEquire' : 'biggerEquire'

          // console.log('获得的jinjiaData', jinjiaData, dapanDataDit)
          arr = arr.filter((symbol)=>{
            var result = false
            if(jinjiaData[symbol] != null && dapanDataDit[symbol] != null){
              for(var i = 0; i < jinjiaData[symbol].length; i++){
                var time = jinjiaData[symbol][i]['时间']
                // console.log('时间是否在区间内', time, config.timeSpace[0], )
                if(compireTwoTime(time, 'biggerEquire', config.timeSpace[0]) && compireTwoTime(time, 'smallEquire', config.timeSpace[1])){
                  var firstValue  = getJinJiaDataByTime(jinjiaData, symbol, time, '开盘') 
                  var secondValue = getSymbolDataByKey(dapanDataDit[symbol], config.valueType)
                  // console.log('当前对比', time, firstValue, compire, secondValue)
                  if(firstValue != null && secondValue != null){
                    result = compireTwoValue(firstValue, compire, secondValue * config.valueScale)
                  }
                  firstValue = null
                  secondValue = null
                  if(result == true){
                    break
                  }
                }
              }
            }
            return result
          })
          symbolsDit = null
          dapanDataDit = null
          jinjiaData = null
          config = null
          compire = null
          return arr
      }
    },
    {
      name: '第n日竞昨比筛选', 
      id: '38',
      des: '筛选第n日竞昨比数据，竞昨比的计算方式为第n日的集合竞价期间成交量/上一日成交量x100%',
      key: 'jinjiaVolumePreCompareByValue',  //唯一key
      getTitle: function(hideChildKeys){
        if(hideChildKeys != null && hideChildKeys.indexOf('day') != -1){
          return '竞昨比筛选'
        }else{
          return '第' + this.values[0].value + '日竞昨比筛选'
        }
      },
      needJinjiaData: true, 
      values:[
          {key: 'day', type: 'number', value: 1, min: 1, max: 365, step: 1, formatter:value => `第${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
          {key: 'compire', type: 'select', value: 'biggerEquire', options: CompireOption},
          {key: 'secondValue', type: 'number', value: 5, step: 0.1, formatter:value => `${value}%`, parser:value => Number(value.replace('%', ''))},
      ],
      filter: async (arr, config, fullObject)=>{
          var backArr = await checkVaildDate(fullObject, config)
          if(backArr != null){
            return backArr
          }

          var symbolsDit = strArrToDit(arr)
          var jinjiaData = YWRequest.getJihejinjiaDataV2(fullObject.start_date, config.day, symbolsDit, {timeDit: false})
          var upDay = config.day - 1
          if(upDay == 0){
            //0不代表任何一天
            upDay = -1
          }
          var dapanData = await YWRequest.getOneDayDataDeal(fullObject.start_date, upDay, arr)
          var dapanDataDit = arrToDit(dapanData, '代码')

          // console.log('获得的jinjiaData', jinjiaData, dapanDataDit)
          
          arr = arr.filter((symbol)=>{
            var result = false
            if(jinjiaData[symbol] != null && dapanDataDit[symbol] != null){
              var todayVolume  = null 
              var upVolume = null 
              if(jinjiaData[symbol][jinjiaData[symbol].length - 1] != null){
                todayVolume = getSymbolDataByKey(jinjiaData[symbol][jinjiaData[symbol].length - 1], '成交量')
              }
              upVolume = getSymbolDataByKey(dapanDataDit[symbol], '成交量')
              // console.log('计算出来的竞昨比', todayVolume / upVolume * 100)
              if(todayVolume != null && upVolume != null){
                result = compireTwoValue(todayVolume / upVolume * 100, config.compire, config.secondValue)
              }
              todayVolume = null
              upVolume = null
            }else{
              // if(jinjiaData[symbol] == null){
              //   console.warn(symbol, '集合竞价数据为空')
              // }
              // if(dapanDataDit[symbol] == null){
              //   console.warn(symbol, 'dapanDataDit数据为空')
              // }
            }
            return result
          })
          symbolsDit = null
          jinjiaData = null
          dapanData = null
          dapanDataDit = null
          config = null
          return arr
      }
    },
    {
      name: '便签', 
      id: '46',
      des: '在任意地方写一段注释，不会对规则执行有任何影响，便于往后再编辑规则时不会忘记为什么要这样做',
      key: 'ruleOfJustNotes',  //唯一key
      forceChecked: true, //必须选中
      values:[
          {key: 'info', type: 'input', value: '', width: '828px'},
      ],
      filter: (arr, config, fullObject)=>{
        return arr
      }
    },
    {
      name: '折叠', 
      id: '53',
      des: '折叠一部分规则，此规则等同于所有条件满足，但可以自定义名称',
      key: 'ruleOfCollapse',  //唯一key
      values:[
          {key: 'info', type: 'input', value: '', width: '828px'},
          {key:'configPopover', title: '传递参数', value: false, type: 'bool', des: '当此规则嵌套在另一个规则下时，可以设置是否传递父节点的可变参数给子节点'},  //是否支持传递上级节点传入的配置到自己的子节点
          {key:'rules', value: [], type: 'values', inBottom: true}
      ],
      inCardBottom: true,
      hasConfigPopover: true,//是否传递父级配置
      filter: async (arr, config, fullObject, dapanMinDataDit)=>{
        var andRule = RuleDit['andRule']
        // console.log('调用AndRule执行', config)
        return await andRule.filter(arr, config, fullObject, dapanMinDataDit)
      }
    },
    {
      name: '导出第n日数据', 
      id: '54',
      des: '回测结束后，可导出表格中加上第n日的数据，此规则应放在选股规则的最底部',
      key: 'ruleOfExportExcel',  //唯一key
      justByDay: true, 
      getTitle: function(hideChildKeys){
        if(hideChildKeys != null && hideChildKeys.indexOf('day') != -1){
          return '导出数据'
        }else{
          return '导出第' + this.values[0].value + '日数据'
        }
      },
      values:[
        {key: 'day', type: 'number', value: 1, min: 1, max: 365, step: 1, formatter:value => `第${value}日`, parser:value => Number(value.substr(1,value.length - 2))},
        {key: 'exportKeys', type: 'select', value: [], width: '500px' , maxTagCount: 99, mode: 'multiple', options: SymbolOption},
      ],
      filter: async (arr, config, fullObject)=>{
        if(fullObject.isRealRun == true){
          //此规则在实盘运行中不生效
          return arr
        }
        // var symbolsDit = strArrToDit(arr)
        var dapanData = await YWRequest.getOneDayDataDeal(fullObject.start_date, config.day, arr)
        var dapanDataDit = arrToDit(dapanData, '代码')
        // console.log('导出第n日数据，获取到了dapanDataDit',dapanDataDit)
        
        if(fullObject.exportData == null){
          fullObject.exportData = {}
        }
        for(var j = 0; j < arr.length; j++){
         
          if(dapanDataDit[arr[j]] == null){
            continue
          }
          if(fullObject.exportData[arr[j]] == null){
            fullObject.exportData[arr[j]] = {}
          }
          for(var i = 0; i < config.exportKeys.length; i++){
            //写入到fulllObject中去
            var key = config.exportKeys[i]
            var label = optionValueToLabel(key, SymbolOption)
            var value = getSymbolDataByKey(dapanDataDit[arr[j]], key)
            fullObject.exportData[arr[j]]['第' + config.day + '日' +  label] = value
          }
        }

        // console.log('dataDit', dataDit)
        
        // symbolsDit = null
        dapanData = null
        dapanDataDit = null
        config = null
        return arr
      }
    }
]

var oriId = 0
//获取一个id
export function getId(){
  oriId += 1
  // console.log('当前oriId', oriId)
  return oriId
}

function strArrToDit(list){
  var dit = {}
  for(var i = 0; i < list.length; i++){
    dit[list[i]] = 1
  }
  return dit
}

//数组转换为选项
export function arrToOptions(list){
  var options = []
  for(var i = 0; i < list.length; i++){
    options.push({value: list[i], label: list[i]})
  }
  return options
}

//选项转换为数组
export function optionsToArr(options){
  var arr = []
  for(var i = 0; i < options.length; i++){
    arr.push(options[i].value)
  }
  return arr
}


export function arrToDit(list, key, valueKey){
  if (Array.isArray(list)) {

  }else{
    //如果是对象就直接返回object
    return list
  }
  var dit = {}
  if(key == null){
    key = 'key'
  }
  for(var i = 0; i < list.length; i++){
    if(valueKey == null){
      dit[list[i][key]] = list[i]
    }else{
      dit[list[i][key]] = list[i][valueKey]
    }
  }
  return dit
}

function ditToArr(dit){
  var arr = []
  for(var key in dit){
    arr.push(dit[key])
  }
  return arr
}


export const RuleDit = arrToDit(RuleList)

export function ruleDitToSaveData(ruleDit){
  var dit = {}
  for(var key in ruleDit){
    dit[key] = ruleToSaveData(ruleDit[key])
    // console.log('其中一个转换结果', dit[key])
  }
  return dit
}

//简化一下规则
export function ruleToSaveData(rules){
  var list = []
  for(var i = 0; i < rules.length; i++){
    var oneRule = rules[i]
    var config = {}
    for(var j = 0; j < oneRule.values.length; j++){
      var oneValue = oneRule.values[j]
      if(oneValue.type == 'values'){
        config[oneValue['key']] = ruleToSaveData(oneValue['value'])
      }else{
        config[oneValue['key']] = oneValue['value']
      }
    }
    var obj = {
      key: oneRule.key,
      checked: oneRule.checked,
      id: oneRule.id,
      values: config
    }
    if(oneRule.score != null){
      obj.score = oneRule.score
    }
    list.push(obj)
  }
  return list
}

//将保存的简化版规则转换成可编辑的rule列表
export function saveDataToRule(rules){
  var list = []
  for(var i = 0; i < rules.length; i++){
      var oneRule = rules[i]
      var key = oneRule.key
      // if(key == 'orRuleBuy'){
      //   key = 'anyRuleOrderByDay'
      // }
      if(RuleDit[key] != null){
        var rule = cloneAndInit(RuleDit[key]) //JSON.parse(JSON.stringify(RuleDit[oneRule.key]))  
        rule.checked = oneRule.checked
        if(oneRule.score != null){
          rule.score = oneRule.score
        }
        for(var j = 0; j < rule.values.length; j++){
          var oneValue = rule.values[j]
          if(oneRule.values[oneValue.key] != null){
            if(oneValue.type == 'values'){
              oneValue.value = saveDataToRule(oneRule.values[oneValue.key])
            }else{
              oneValue.value = oneRule.values[oneValue.key]
            }
          }
        }
        list.push(rule)
      }else{
        console.warn('规则列表中不存在：' + key)
      }
      oneRule = null
  }
  rules = null
  return list
}


//循环所有的规则，是否跳过没有check的rule
export function loopAllRule(ruleList, cb, jumpNoCheck){
  for(var i = 0; i < ruleList.length; i++){
    if(jumpNoCheck == true){
      //跳过没有勾选的股票
      if(ruleList[i].checked != true){
        continue
      }
    }
    if(cb != null){
      cb(ruleList[i])
    }
    for(var j = 0; j < ruleList[i].values.length; j++){
        var valueConfig = ruleList[i].values[j]
        if(valueConfig.type == 'values'){
          loopAllRule(valueConfig.value, cb)
        }
    }
  }
}

//获取第一个执行的规则
//第一个执行的规则应该是ruleOfDayCount
export function getFirstRunRule(ruleList){
  if(ruleList.length == 0){
    return null
  }
  var rule = ruleList[0]
  var valueRules = arrToDit(rule.values, 'key', 'value')
  if(valueRules.rules != null){
    //说明是嵌套规则，查询只规则是否是嵌套规则，直到返回第一个规则不是嵌套规则的规则
    return getFirstRunRule(valueRules.rules)
  }else{
    return rule
  }
}

//获取策略的最大运行周期（从激活日期访问到最大的天数）
//获取策略的一些信息，是否使用集合竞价数据，是否使用分时数据，是否有循环，最大天数
export function getPolicyInfo(ruleDit){
    var maxDay = 0
    var needMinData = false
    var needJinjiaData = false

    var noBuyRule  = true   //缺少买入规则
    var noSaleRule = true   //缺少卖出规则

    var emptySaleRules = false  //空卖出规则
    var emptyBuyRules = false   //空买入规则
    var emptySelectRules = false  //空选股规则

    // var rightRule = true  //对的卖出规则

    var errorInfo = []  //规则中是否有错误

    //可能的key ruleOfBuy  ruleOfSale  ruleOfSelect
    for(var key in ruleDit){
      var rulesList = ruleDit[key]
      if(key == 'ruleOfBuy'){
        if(rulesList.length == 0){
          emptyBuyRules = true
        }
      }else if(key == 'ruleOfSale'){
       if(rulesList.length == 0){
          emptySaleRules = true
        }
      }else if(key == 'ruleOfSelect'){
       if(rulesList.length == 0){
          emptySelectRules = true
          errorInfo.push({error: '选股规则不能为空', ruleId: null, rootRuleKey: key})
        }else{
          var rule = getFirstRunRule(rulesList)
          // console.log('第一个规则应该是', result)
          if(rule.key != "ruleOfDayCount"){
             errorInfo.push({error: '选股规则中第一个规则必须为输入数据', ruleId: null, rootRuleKey: key})
          }
        }
      }
      loopAllRule(rulesList, (rule)=>{
        // console.log('rule', rule)
        if(RuleDit[rule.key] != null){
          if(RuleDit[rule.key].needJinjiaData == true){
            //需要用到竞价数据
            needJinjiaData = true
          }
          if(RuleDit[rule.key].needMinData == true){
            //需要用到分时数据，如果在实盘状态，且在选股策略中，是否需要选择？
            needMinData = true
          }
          var ruleConfig = arrToDit(rule.values, 'key', 'value')
          if(RuleDit[rule.key].isOrderRule == true){
            //如果是下单规则
            if(key == 'ruleOfBuy'){
              if(rule.key == 'justBuy'){
                 noBuyRule = false   //有买入规则
              }
              if(rule.key == 'anyRuleOrder' || rule.key == 'anyRuleOrderByDay'){
                if(ruleConfig.doType == 'sale'){
                  errorInfo.push({error: '在买入规则中设置了卖出规则', ruleId: rule.id, rootRuleKey: key})
                }else{
                  noBuyRule = false   //有买入规则
                }
              }
            }else if(key == 'ruleOfSale'){
              if(rule.key == 'justSale'){
                 noSaleRule = false  //有卖出规则
              }
              if(rule.key == 'justSaleByOneMin'){
                 noSaleRule = false  //有卖出规则
              }
              if(rule.key == 'anyRuleOrder' || rule.key == 'anyRuleOrderByDay'){
                if(ruleConfig.doType == 'buy'){
                  errorInfo.push({error: '在卖出规则中设置了买入规则', ruleId: rule.id, rootRuleKey: key })
                }else{
                  noSaleRule = false   //有卖出规则
                }
              }
            }
          }
        }
        for(var dataKey in rule.values){
          var value = rule.values[dataKey]
          if(dataKey == 'day' || dataKey == 'day2'){
            if(maxDay < value){
              maxDay = value
            }
          }
        }
      }, true)
    }
    return {
      maxDay: maxDay, 
      needMinData: needMinData, 
      needJinjiaData: needJinjiaData,
      noBuyRule: noBuyRule,
      noSaleRule: noSaleRule,
      emptyBuyRules: emptyBuyRules,
      emptySaleRules: emptySaleRules,
      errorInfo: errorInfo
    }
}

//执行一个规则序列
export async function runRules(rules, fullObject, arr, needFilter){
    // console.log('RuleDit', RuleDit)
    // var fullObject = {}
    if(fullObject == null){
      fullObject = {}
    }
    // var detail = {everyRuleFilter:[]}

    for(var i = 0; i < rules.length; i++){
      var oneRule = rules[i]
      if(oneRule.checked != true){
        //只有已经勾选的规则生效，没有勾选生效的规则直接跳过
        continue
      }
      var key = oneRule.key
      // console.log('当前执行rule名称', key)
      if(RuleDit[key] != null){
        var config = arrToDit(oneRule.values, 'key', 'value')
        config.ruleId = oneRule.id
        if(arr == null){
          //首次输入为空
          // if(key != 'ruleOfDayCount'){
          //    break
          // }
          arr = []
        }
        var returnArr = await RuleDit[key].filter(arr, config, fullObject)
        if(needFilter == true){
          arr = returnArr
        }
        // console.log('一个rule运行结束后返回的arr', arr)
        if(arr == null){
          console.warn('arr不应该在执行时变成null')
          break
        }
        oneRule.resultCount = returnArr.length
        if(arr.length == 0){
          //如果arr已经为空了，就没有继续下去的必要了
          break
        }
      }
    }
    // console.log('runRules result Arr ', arr)
    // arr
    if(arr == null){
      arr = []
    }
    return arr
    // .map((item)=>{
    //     return {symbol: item, name: YWRequest.allSymbolDit[item]}
    // })
}

//计算一下平均盈利
function calculateAveWinPresent(obj){
  
}


//运行一次规则，并且传入此规则的运行记录，用于在实盘运行中
export async function runFullRulesWithFullObject(ruleDit, fullObject) {
    // console.log('rulesDit', ruleDit)
    var start_date = fullObject.start_date
    // console.log("fullObject.start_date", )
    fullObject.isRealRun = true  //设置实盘运行标记，部分规则会对实盘运行做特殊处理

    if(start_date != null){
      var firstRule = getFirstRunRule(ruleDit[RuleType.RuleOfSelect])
      if(firstRule != null){
        if(Array.isArray(firstRule.values)){
          firstRule.values[0].value = start_date
        }else{
          firstRule.values.start_date = start_date
        }
      }
    }

    //筛选方法，会筛选股票列表
    var arr = await runRules(ruleDit[RuleType.RuleOfSelect], fullObject, null, true)  

    if(fullObject.eventHandle != null){
      fullObject.eventHandle({type: 'select', arr: arr})
    }
    //买入规则，传入筛选后的股票列表，进一步触发买点，不会筛选数组
    if(arr.length != 0){
      //如果arr == 0已经没有执行买入规则的必要了
      arr = await runRules(ruleDit[RuleType.RuleOfBuy], fullObject, arr, false)         
    }
    if(arr.length != 0){
      // 如果arr == 0已经没有执行卖出规则的必要了
      arr = await runRules(ruleDit[RuleType.RuleOfSale], fullObject, arr, false)       
    }
    //卖出规则，传入买入后的股票（即使传入第一步筛选后的列表也不影响，只计算有完整买卖的盈亏结果，没有完整买卖点的不记录策略盈亏统计），进一步触发卖点，不会筛选数组，
    //计算一下平均盈利百分比
    var count = 0
    var present = 0
    for(var key in fullObject.jiaoyiInfo){
      if(fullObject.jiaoyiInfo[key].winPresent != null && isNaN(fullObject.jiaoyiInfo[key].winPresent) == false){
        present += fullObject.jiaoyiInfo[key].winPresent
        count += 1
      }
    }
    if(count != 0){
      fullObject.aveWinPresent = fourRoundToDecimals(present / count, 2)
    }else{
      fullObject.aveWinPresent = 0
    }
    //全部执行结束了，清楚handle
    eventHandle = null
    return arr
}


//运行一次完整的筛选->买入->卖出，周期
export async function runFullRules(ruleDit, start_date, otherConfig){
  var fullObject = {}
  fullObject.otherConfig = {}
  if(otherConfig != null){
    fullObject.otherConfig = otherConfig
  }
  if(start_date != null){
    // if(Array.isArray(ruleDit[RuleType.RuleOfSelect][0].values)){
    //   ruleDit[RuleType.RuleOfSelect][0].values[0].value = start_date
    // }else{
    //   ruleDit[RuleType.RuleOfSelect][0].values.start_date = start_date
    // }
    var firstRule = getFirstRunRule(ruleDit[RuleType.RuleOfSelect])
    if(firstRule != null){
      if(Array.isArray(firstRule.values)){
        firstRule.values[0].value = start_date
      }else{
        firstRule.values.start_date = start_date
      }
    }
  }
  //筛选方法，会筛选股票列表
  var arr = await runRules(ruleDit[RuleType.RuleOfSelect], fullObject, null, true)  
  //买入规则，传入筛选后的股票列表，进一步触发买点，不会筛选数组
  if(arr.length != 0){
    //如果arr == 0已经没有执行买入规则的必要了
    arr = await runRules(ruleDit[RuleType.RuleOfBuy], fullObject, arr, false)         
  }
  if(arr.length != 0){
    // 如果arr == 0已经没有执行卖出规则的必要了
    arr = await runRules(ruleDit[RuleType.RuleOfSale], fullObject, arr, false)       
  }
  //卖出规则，传入买入后的股票（即使传入第一步筛选后的列表也不影响，只计算有完整买卖的盈亏结果，没有完整买卖点的不记录策略盈亏统计），进一步触发卖点，不会筛选数组，
  //计算一下平均盈利百分比
  var count = 0
  var present = 0
  for(var key in fullObject.jiaoyiInfo){
    if(fullObject.jiaoyiInfo[key].winPresent != null && isNaN(fullObject.jiaoyiInfo[key].winPresent) == false){
      present += fullObject.jiaoyiInfo[key].winPresent
      count += 1
    }
  }
  if(count != 0){
    fullObject.aveWinPresent = fourRoundToDecimals(present / count, 2)
  }else{
    fullObject.aveWinPresent = 0
  }
  // console.log('执行结果', arr, fullObject)
  return {arr, fullObject}
}



export function getAveWinPresent(dateResultDit){
  var count = 0
  var present = 0
  for(var key in dateResultDit){
    count += 1
    present += dateResultDit[key].fullObject.aveWinPresent
  }
  return fourRoundToDecimals(present / count, 2)
}

//测试一年的结果
export async function huiceOneYear(ruleDit, year, cb, otherConfig){
  var times = YWRequest.getTradeDateArr(year)
  if(times.length == 0){
    console.log('没有年交易日数据', year)
  }
  var dateResultDit = {}
  for(var i = 0; i < times.length; i++){
    var result = await runFullRules(ruleDit, times[i], otherConfig)
    if(result.fullObject != null){
      //删除设置项已经不需要了
      delete result.fullObject['otherConfig']
    }
    dateResultDit[times[i]] = result
    // if(cb != null){
    //   cb((i + 1) / times.length)
    // }
    if(cb != null){
      //返回进度的同时返回最新执行的一天的结果
      cb({ progress: (i + 1) / times.length, data: result })
    }
  }
  return dateResultDit
}

//测试很多年的结果
export async function huiceYears(ruleDit, years, cb, otherConfig){
  var yearResultDit = {}
  years.sort((a, b)=>{
    return a - b
  })
  for(var i = 0; i < years.length; i++){
    var dateResultDit = await huiceOneYear(ruleDit, years[i], (info)=>{
      info.progress = (i + info.progress) / years.length 
      if(cb != null){
        cb(info)
      }
    }, otherConfig)
    yearResultDit = {...yearResultDit, ...dateResultDit} 
  }
  return yearResultDit
}

//获取开始结束日期区间内的date，包含开始和结束日期
export function getTradeDatesBySpace(start_date, end_date) {
    var endDate = moment(end_date)
    var times = []
    var addCount = 0
    while(moment(start_date).add(addCount, 'days').diff(endDate) <= 0){
      var dayKey = moment(start_date).add(addCount, 'days').format('YYYY-MM-DD')
      if(YWRequest.tradeDateDit[dayKey] != null){
        times.push(dayKey)
      }
      addCount += 1
    }
    return times
}


//直接回测指定日期范围内的数据
export async function huiceDates(ruleDit, start_date, end_date, cb, otherConfig) {
    var dateResultDit = {}
    var times = getTradeDatesBySpace(start_date, end_date)

    for(var i = 0; i < times.length; i++){
      var result = await runFullRules(ruleDit, times[i], otherConfig)
      if(result.fullObject != null){
        //删除设置项已经不需要了
        delete result.fullObject['otherConfig']
      }
      dateResultDit[times[i]] = result
      if(cb != null){
        //返回进度的同时返回最新执行的一天的结果
        cb({ progress: (i + 1) / times.length, data: result })
      }
    }
    return dateResultDit
}

//计算夏普比率使用年化单位
//使用月收益计算标准差 月收益率标准差需乘以根号12转换成年化标准差
//年化收益率 = (1 + 日收益率)的252个交易日 - 1
//标准差的计算，每个月的均值收益率，计算方差，(每个月的值-平均值)平方 相加 / 12个月，标准差=方差开平方
//夏普比率 (年化收益率-无风险基准收益率)/标准差

// 小于0：收益未覆盖风险
// 低于1.0：风险调整收益较差。
// 1.0–2.0：合格至良好区间。
// 高于3.0：属于极优水平

//年化收益率是否考虑复利再投资，要分两种情况计算，一种是不复利，即赚得的利润不加码投资，另一种是赚到的利润再加入到本金中投资

function calculBiazunca(valueArr, justDown){
  //justDown 为true时，计算下行标准差，仅收益率为负数时的标准差
  var num = 0
  if(justDown == true){
    valueArr = valueArr.filter((value)=>{
      return value < 0
    })
  }
  for(var i = 0; i < valueArr.length; i++){
    num += valueArr[i]
  }
  var aveNum = num / valueArr.length
  var num2 = 0

  for(var i = 0; i < valueArr.length; i++){
    num2 += Math.pow(valueArr[i] - aveNum, 2)
  }
  var avePowNum =  num2 / valueArr.length
  return Math.sqrt(avePowNum) * Math.sqrt(valueArr.length)
}

//计算夏普比率
export function calculXiapuPresent(nianhua, biaozunca, base){
  if(base == null){
    base = 3
  }
  return(nianhua - base)/biaozunca
}

//计算测试一年的结果详情（对结果中的数据进行统计）
export function calculHuiceResult(oneYearResultDit, calculateConfig){
    if(calculateConfig == null){
      calculateConfig = {}
    }
    // console.log("oneYearResultDit", oneYearResultDit)s

    var jiaoyiCount = 0
    var winCount = 0
    var souyilv = 0   //这里以1为基数来计算就行了，如果需要计算金额只需要x本金
    var money = 100   //本金，为1时刚好等于收益率
    var winMoney = 0  //利润  //如果亏了，本金会被消耗
  
    var presentArr = [] //记录每一天的收益率，用于计算标准差
    var winMoneyArr = []  //累计收益  
    var winMoneyEveryDayArr = []  //每日收益，复利和单利是不一样的曲线

    var nextDayAddMoney = 0
    var addPresent = 0

    var yearObj = {}
   

    //统计最近30， 90， 180个交易日的收益
    var recentDaysWinArr = [0, 0, 0]
    var recentDaysWin = [30, 90, 180]

    var dayArr  = Object.keys(oneYearResultDit)
    var lastDay = moment(dayArr[dayArr.length - 1])


    var baseWindPointArr = []
    if(calculateConfig.baseWinPoint == null){
      calculateConfig.baseWinPoint = 'sh000001'
    }
    if(calculateConfig.baseWinPoint != null){
        var zhishuData = YWRequest.getZhishuData(calculateConfig.baseWinPoint)
        var zhishuDataDit = arrToDit(zhishuData, 'date', 'close')
        var startValue = null

         for(var day in oneYearResultDit){
          if(zhishuDataDit[day] != null){
            if(startValue == null){
              startValue = zhishuDataDit[day]
            }
            baseWindPointArr.push(((zhishuDataDit[day] - startValue) / startValue * 100).toFixed(2))
          }else{
            baseWindPointArr.push('-')
          }
        }
    }
   
    // console.log('zhishuData', zhishuData)
    
    for(var day in oneYearResultDit){
      yearObj[moment(day).year()]  = 1
      var fullObject = oneYearResultDit[day].fullObject
      var jiaoyiInfo = fullObject.jiaoyiInfo

      if(fullObject.aveWinPresent == null){
        //计算一下平均盈利，为什么计算平均盈利而不是累计盈利，因为假设是可用的仓位平均分配到每一只股票上买入，而不是所有股票都可以全仓买入
        var aveWinPresent = 0
        var count = 0

        // console.log('计算平均盈利', jiaoyiInfo)
        for(var key in jiaoyiInfo){
          if(jiaoyiInfo[key].winPresent != null && isNaN(jiaoyiInfo[key].winPresent) == false){
              aveWinPresent += jiaoyiInfo[key].winPresent
              count += 1
          }
        }

        aveWinPresent = aveWinPresent / count
        fullObject.aveWinPresent = aveWinPresent
      }

      souyilv += fullObject.aveWinPresent
      presentArr.push(fullObject.aveWinPresent)

      if(fullObject.aveWinPresent == null || isNaN(fullObject.aveWinPresent)){
          console.warn('错误的aveWinPresent', day)
      }
      //这一天的盈利额度
      var oneDayWinMoney = money * fullObject.aveWinPresent / 100
      addPresent += fullObject.aveWinPresent
      
      var days = lastDay.diff(moment(day), 'days')

      for(var j = 0; j < recentDaysWin.length; j++){
        if(days <= recentDaysWin[j]){
          recentDaysWinArr[j] += fullObject.aveWinPresent
        }
      }

      winMoney += oneDayWinMoney
      //考虑到A股的T+1机制，已经买入卖出的时间差来不操作等情况，复利的利润必须隔一天才能投入股市
      if(calculateConfig.isBackMoney == 'backMoney'){
        //盈利加到本金上去
        if(nextDayAddMoney != 0){
          money += nextDayAddMoney
        }
        nextDayAddMoney = oneDayWinMoney
      }else{
        //暂时假设投资过程中不管亏多少，都可以补足本金为一开始的额度
      }
      //记录一下盈利额度
      winMoneyArr.push(Number(winMoney.toFixed(2)))
      winMoneyEveryDayArr.push(Number(oneDayWinMoney.toFixed(2)))

      for(var symbol in jiaoyiInfo){
        var oneInfo = jiaoyiInfo[symbol]
        if(oneInfo.buyPrice != null && oneInfo.salePrice != null){
          jiaoyiCount += 1
          if(oneInfo.winPresent > 0){
            winCount += 1
          }
        }
      }
    }
  
    recentDaysWinArr = recentDaysWinArr.map((item)=>{
      return item.toFixed(2)
    })

    var years = Object.keys(yearObj).length
    var biaozunca = calculBiazunca(presentArr)
    var downBiaozunca = calculBiazunca(presentArr, true)
    var xiapuPresent = calculXiapuPresent(addPresent, biaozunca, 3 * years) 
    var suotinuoPresent = calculXiapuPresent(addPresent, downBiaozunca,  3 * years) 

    var {maxDown, maxDayIndex, minDayIndex, whenMaxDownMaxDayIndex} = calculateMaxDrawdown(winMoneyArr)
    var huiceInfo = {
      jiaoyiCount: jiaoyiCount,
      jiaoyiWinPresent: (winCount / jiaoyiCount * 100).toFixed(2),
      addPresent: addPresent.toFixed(2),  //这里的收益是累计收益，要转换为年化收益
      yearPresent: (addPresent / years).toFixed(2), //
      recentDaysWinArr: recentDaysWinArr, 
      maxHuice:(maxDown * 100).toFixed(2), 
      maxDay: dayArr[maxDayIndex],
      minDay: dayArr[minDayIndex],
      whenMaxDownMaxDay: dayArr[whenMaxDownMaxDayIndex],
      biaozunca: biaozunca,
      xiapuPresent: xiapuPresent.toFixed(2),
      suotinuoPresent: suotinuoPresent.toFixed(2),
      dateArr: dayArr,
      presentArr: presentArr,                     //每天的收益率
      winMoneyArr: winMoneyArr,                   //累计的收益率
      baseWindPointArr: baseWindPointArr,         //指数的收益率
      winMoneyEveryDayArr: winMoneyEveryDayArr,   //累计的收益率
      yearObj: yearObj,                           //包含的年份
    }
    // console.log("统计结果", huiceInfo)
    return huiceInfo
}