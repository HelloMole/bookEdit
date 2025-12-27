

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