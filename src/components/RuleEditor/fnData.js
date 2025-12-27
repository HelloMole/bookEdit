export const fnData = [
    {
        title: "常用函数",
        key: "1",
        children: [
        {
            title: "MOD",
            desc: "求余数",
            ex: "MOD(3, -2)",
            key: "1-1",
            enCode:'MOD'
        },
        {
            title: "ABS",
            desc: "绝对值",
            key: "1-2",
            enCode:'ABS'
        },
        {
            title: "RAND",
            desc: "[0,1]区间的随机数",
            key: "1-3",
            enCode:'RAND'
        },
        {
            title: "ROUND",
            desc: "四舍五入取整",
            key: "1-4",
            enCode:'ROUND'
        },
        {
            title: "ROUNDDOWN",
            desc: "向下取整",
            key: "1-5",
            enCode:'ROUNDDOWN'
        },
        {
            title: "ROUNDUP",
            desc: "向上取整",
            ex: "ROUNDUP(-3.14159, 2)",
            key: "1-6",
            enCode:'ROUNDUP'
        },
        {
            title: "SQRT",
            desc: "平方根",
            key: "1-7",
            enCode:'SQRT'
        },
        {
            title: "SUM",
            desc: "求和",
            ex: "SUM(-5, 15, 32, 'Hello World!')",
            key: "1-8",
            enCode:'SUM'
        },
        {
            title: "SUMIF",
            desc: "对满足条件的值求和",
            ex: "SUMIF([2,4,8,16], '>5')",
            key: "1-9",
            enCode:'SUMIF'
        },
        ],
    },
    {
        title: "日期转换",
        key: "2",
        children: [
        {
            title: "DAY",
            desc: "获取日期中的天",
            key: "2-1",
            enCode:'DAY'
        },
        {
            title: "HOUR",
            desc: "获取日期中的小时",
            key: "2-2",
            enCode:'HOUR'
        },
        {
            title: "MINUTE",
            desc: "获取日期中的分钟",
            key: "2-3",
            enCode:'MINUTE'
        },
        {
            title: "SECOND",
            desc: "获取日期中的秒数",
            key: "2-4",
            enCode:'SECOND'
        },
        {
            title: "MONTH",
            desc: "获取日期中的月份",
            key: "2-5",
            enCode:'MONTH'
        },
        {
            title: "YEAR",
            desc: "获取日期中的年份",
            key: "2-6",
            enCode:'YEAR'
        },
        {
            title: "NOW",
            desc: "获取当前日期，包含时间",
            key: "2-7",
            enCode:'NOW'
        },
        {
            title: "DAYS",
            desc: "返回两个日期相差的天数",
            key: "2-8",
            enCode:'DAYS'
        },
        {
            title: "DATE",
            desc: "通过输入年月日生成时间",
            key: "2-9",
            enCode:'DATE'
        },
        {
            title: "DATEVALUE",
            desc: "通过输入日期字符串生成时间",
            key: "2-10",
            enCode:'DATEVALUE'
        }
        ],
    },
    {
        title: "逻辑运算",
        key: "3",
        children: [
        {
            title: "AND",
            desc: "所有输入满足True时输出True",
            key: "3-1",
            enCode:'AND'
        },
        {
            title: "IF",
            desc: "条件判断",
            key: "3-2",
            enCode:'IF'
        },{
            title: "NOT",
            desc: "输出相反的True或者False",
            key: "3-3",
            enCode:'NOT'
        },{
            title: "OR",
            desc: "任意条件为真则返回真",
            key: "3-4",
            enCode:'OR'
        },
        {
            title: "TRUE",
            desc: "返回true",
            key: "3-5",
            enCode:'TRUE'
        },{
            title: "FALSE",
            desc: "返回false",
            key: "3-6",
            enCode:'FALSE'
        },
        {
            title: "SWITCH",
            desc: "多条件判断",
            key: "3-7",
            enCode:'SWITCH'
        },
        ],
    },
    {
        title: "统计运算",
        key: "4",
        children: [
        {
            title: "MAX",
            desc: "获取一组输入中最大的数",
            key: "4-1",
            enCode:'MAX'
        },
        {
            title: "MIN",
            desc: "获取一组输入中最小的数",
            key: "4-2",
            enCode:'MIN'
        },
        {
            title: "AVERAGE",
            desc: "求平均数",
            key: "4-3",
            enCode:'AVERAGE'
        },
        {
            title: "AVEDEV",
            desc: "求平均数偏差平均值",
            key: "4-4",
            enCode:'AVEDEV'
        },
        {
            title: "COUNT",
            desc: "返回输入的数量",
            key: "4-5",
            enCode:'COUNT'
        },
        {
            title: "COUNTIF",
            desc: "返回满足条件的输入数量",
            key: "4-6",
            enCode:'COUNTIF'
        }]
    }
]

export const functionDescription = {
    SUM: {
        title: "求和",
        example: "SUM(数值1,数值2,...)",
        description: "SUM(数学成绩,语文成绩,英语成绩,...) = 各科总成绩",
    },
    SUMIF: {
        title: "对满足条件的值求和",
        example: "SUM([数值1,数值2,...], '>数值')",
        description: "SUMIF([2,4,8,16], '>5') = 24",
    },
    AVERAGE: {
        title: "平均数",
        example: "AVERAGE(数值1,数值2,...)",
        description: "AVERAGE(数学成绩,语文成绩,英语成绩,...) = 平均成绩",
    },
    IF: {
        title: "条件判断",
        example: "IF(条件,真值,假值)",
        description: "IF(数学成绩>90,优秀,良好)",
    },
    MOD: {
        title: "求余数",
        example: "MOD(3, -2)",
        description: "返回第一个数除第二数的余数,结果：-1",
    },
    ABS: {
        title: "绝对值",
        example: "ABS(-2)",
        description: "返回结果：2",
    },
    RAND: {
        title: "随机数",
        example: "RAND()",
        description: "返回[0,1]区间的随机数",
    },
    ROUND: {
        title: "四舍五入取整",
        example: "ROUND(626.3, -3)",
        description: "四舍五入取整，第二个参数控制保留到小数点后几位，如果是负数则向小数点前保留，上面例子返回1000，相当于在百位上四舍五入",
    },
    ROUNDDOWN: {
        title: "向下取整",
        example: "ROUNDDOWN(-3.14159, 2)",
        description: "向下取整，第二个参数控制保留到小数点后几位，如果是负数则向小数点前保留，上面例子返回-3.14",
    },
    ROUNDUP: {
        title: "向上取整",
        example: "ROUNDUP(-3.14159, 2)",
        description: "第二个参数控制保留到小数点后几位，如果是负数则向小数点前保留，上面例子返回-3.15",
    },
    SQRT: {
        title: "平方根",
        example: "SQRT(16)",
        description: "返回一个数的平方根，上面例子返回4",
    },
    DAY: {
        title: "获取日期中的天",
        example: "DAY('2025-02-25')",
        description: "返回一个日期的天，上面例子返回25",
    },
    HOUR: {
        title: "获取日期中的小时",
        example: "HOUR('7/18/2011 7:45:00 AM')",
        description: "返回一个日期的小时，上面例子返回7",
    },
    MINUTE: {
        title: "获取日期中的分钟",
        example: "MINUTE('7/18/2011 7:45:00 AM')",
        description: "返回一个日期的分钟，上面例子返回45",
    },
    SECOND: {
        title: "获取日期中的秒数",
        example: "SECOND('2/1/2011 4:48:18 PM')",
        description: "返回一个日期的秒数，上面例子返回18",
    },
    MONTH: {
        title: "获取日期中的月份",
        example: "MONTH('2025-02-25')",
        description: "返回一个日期的秒数，上面例子返回2",
    },
    YEAR: {
        title: "获取日期中的年份",
        example: "YEAR('2025-02-25')",
        description: "返回一个日期的秒数，上面例子返回2025",
    },
    NOW: {
        title: "获取当前日期，包含时间",
        example: "NOW()",
        description: "返回当前系统时间，Wed Mar 19 2025 17:27:49 GMT+0800 (中国标准时间)",
    },
    DATE: {
        title: "通过输入年月日生成时间",
        example: "DATE(2025, 9, 10)",
        description: "生成时间：Wed Sep 10 2025 00:00:00 GMT+0800 (中国标准时间)",
    },
    DATEVALUE: {
        title: "通过输入日期字符串生成时间",
        example: "DATEVALUE('8/22/2011')",
        description: "生成时间：Mon Aug 22 2011 00:00:00 GMT+0800 (中国标准时间)",
    },
    DAYS: {
        title: "返回两个日期相差的天数",
        example: "DAYS('2025-02-25', '2025-04-25')",
        description: "如果第一个日期小于第二个日期，则返回的是负数，上面的例子返回-59",
    },
    AND: {
        title: "且运算",
        example: "AND(true, false, true)",
        description: "所有输入满足True时输出True，上述例子返回false",
    },
    OR: {
        title: "或运算",
        example: "OR(true, false, true)",
        description: "任意输入满足True时输出True，上述例子返回true",
    },
    IF: {
        title: "条件判断",
        example: "IF(true, 'Hello!', 'Goodbye!')",
        description: "如果为true返回第一个结果，否则返回第二个，上述例子返回Hello!",
    },
    NOT: {
        title: "非运算",
        example: "NOT(true)",
        description: "输出相反的True或者False，上述例子返回false",
    },
    TRUE: {
        title: "真boolen值",
        example: "TRUE()",
        description: "返回true",
    },
    FALSE: {
        title: "假boolen值",
        example: "FALSE()",
        description: "返回false",
    },
    SWITCH: {
        title: "多条件判断",
        example: "SWITCH(表达式, 值1, 结果1, 值2, 结果2, ...)",
        description: "这里的“表达式”是一个计算结果，而“值1”、“值2”等是你要与表达式结果进行比对的值。如果表达式的值与某个值匹配，函数会返回对应的结果；如果没有匹配项，可以指定一个默认值。SWITCH(7, 9, 'Nine', 7, 'Seven')返回结果Seven",
    },
    MAX: {
        title: "获取一组输入中最大的数",
        example: "MAX([0.1,0.2], [0.4,0.8]) or MAX(0.1,0.2,0.8,0.4)",
        description: "上述示例返回0.8",
    },
    MIN: {
        title: "获取一组输入中最小的数",
        example: "MIN([0.1,0.2], [0.4,0.8]) or MIN(0.1,0.2,0.8,0.4)",
        description: "上述示例返回0.1",
    },
    AVERAGE: {
        title: "求平均数",
        example: "AVERAGE([2,4], [8,16]) or AVERAGE(2,4,8,16)",
        description: "上述示例返回7.5",
    },
    AVEDEV: {
        title: "求偏差平均值",
        example: "AVEDEV([2,4], [8,16] or or AVERAGE(2,4,8,16))",
        description: "上述示例返回4.5",
    },
    COUNT: {
        title: "返回输入的数量",
        example: "COUNT([2,4], [8,16] or or COUNT(2,4,8,16))",
        description: "上述示例返回4",
    },
    COUNTIF: {
        title: "返回满足条件的输入数量",
        example: "COUNTIF([1,2,3,4],'>3')",
        description: "上述示例返回1",
    },
}

// var completions = []
// export const getCompletions = ()=>{
//     if(completions.length == 0){
        
//     }
// }

