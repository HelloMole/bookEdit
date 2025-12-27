const BaseType = {
    input: 'input',
    middle: 'middle',
    output: 'output',
    objects: 'objects',
    data: 'data'
}

const lightColor = {
    "#EA3F5D": {name: '红', color:"#F794A6"},
    "#4FB18E": {name: '绿', color:"#A1DFC9"},
    "#3A6BD2": {name: '蓝', color:"#8AA7E3"},
    "#EE7D30": {name: '橙', color:"#F1AD7F"},
    "#AC25FF": {name: '紫', color:"#DAA2FC"},
    "#4D4D4D": {name: '灰', color:"#BEBEBE"},
}

const typeConfig = {
    input: {color: '#EA3F5D', key: 'input', isBase: true},
    middle: {color: '#4FB18E', key: 'middle', isBase: true},
    output: {color: '#3A6BD2', key: 'output', isBase: true},
    objects: {color: '#EE7D30', key: 'objects', isBase: true},
    data: {color: '#AC25FF', key: 'data', isBase: true},
    menu: {color: '#4D4D4D', key: 'menu', isBase: true, showDot: true},
}

const zhilinConfig = { 
    // 'CaiDanComponent','SpinePlusComponent'
    DrawComponent: {key: 'DrawComponent', 
        baseType:'output',
        defaultSize: [422,501],
        inputSolt: {
            start: {index: 0, type: 'number',info: '开始绘制'},
            pause: {index: 1, type: 'number',info: '停止绘制'},
            clear: {index: 2, type: 'number',info: '删除绘制'},
            check: {index: 4, type: 'number',info: '检测绘制'},
            linkCodeNode: {index: 3, type: 'robot',info: '关联对象'},
        }, 
        outputSolt: {
            result: {index: 0, type: 'number',info: '绘制结果'},
        },
        cardexSolt:{index: 0, type: 'number', info: '关联实体'},
        icon: 'customComponent',
        otherConfig:{
            lineWidth: {type: 'sliderValue', title: '线条粗细', default: 5},
            strokeColor: {type:'colorValue', title: '线条颜色', default:  "167BA4"},
            fillColor: {type:'colorValue', title: '填充颜色', default:  "23C7F2"},
            breakDraw: {type: 'toggleGroup', title:'停止绘制后，下一次绘制不连接上次绘制线段', chooses: ['否','是'], default: 0},
            isStroke:{type: 'toggleGroup', title:'是绘制线条还是填充形状', chooses: ['填充形状','绘制线条'], default: 1},
            recordType:{type: 'toggleGroup', title:'记录数据点', chooses: ['记录路径点','记录起点终点'], default: 0},
            startPosRobot: {type: 'robot', title: '起点的【创建物体】或【引用物体】组件', default: ""},
            checkStrokeRobot: {type: 'robot', title: '在【删除绘制】输入时进行绘制检测的【创建物体】或【引用物体】组件', default: ""},
            ifRightNotClear:{type: 'toggleGroup', title:'如果路径检测正确就不要清除绘制内容（单绘制检测生效时）', chooses: ['否','是'], default: 1},
            startWhenTouchFirst:{type: 'toggleGroup', title:'触摸到第一个开始检测的点时才开始绘制', chooses: ['否','是'], default: 0},
            checkInLastTouch:{type: 'toggleGroup', title:'检测的路径终点在最后一个碰撞区域内', chooses: ['否','是'], default: 0},
            checkType:{type: 'toggleGroup', title:'检测方式', chooses: ['仅涂满','按顺序检测'], default: 0},
            tipsInfo1:{type: 'tipsInfo', title: '说明', default: '记录数据点选择【记录起点终点】时，只能【绘制线条】'},
            tipsInfo2:{type: 'tipsInfo', title: '说明', default: '起点的【创建物体】或【引用物体】组件 关联后，会作为【记录起点终点】的起点，如果未关联，则以记录的第一个点为起点'},
        }
    },
    "cc.Mask":{key: 'cc.Mask',
            baseType:'output',
            useingBaseSscriptRobot: true,
            defaultSize: [306,285],
            changeSize:[[306,285]],
            inputSolt: {
            }, 
            outputSolt: {
            },
            cardexSolt:{index: 0, type: 'number', info: '关联实体'},
            icon: 'customComponent',
            otherConfig:{
                type:{type: 'toggleGroup', title:'遮罩类型', chooses: ['矩形','圆形','图片'], choosesKey: [cc.Mask.Type.RECT, cc.Mask.Type.ELLIPSE, cc.Mask.Type.IMAGE_STENCIL], default: 0},//'图片'未添加
                inverted:{type: 'toggleGroup', title:'反向遮罩', chooses: ['否','是'], default: 0, isBoolen: true},
                alphaThreshold:{type: 'sliderValue', title: '透明度阀值', default: 0.5, range: [0, 1]},
                segements:{type: 'sliderValue', title: '椭圆遮罩曲线数', default: 50, range: [1, 100]},
                radius:{type: 'sliderValue', title: '矩形圆角曲线数', default: 0, range: [0, 100]},
                spriteFrame:{type: 'spriteFrame', title: '【遮罩类型】为图片时设置图片路径', default: ''}
    }},
    MotionText:{key: 'MotionText',
                baseType:'output',
                defaultSize: [306,350],
                changeSize:[[306,350]],
                inputSolt: {
                    number: {index: 0, type: 'number',info: '启用'},
                    hide: {index: 1, type: 'number',info: '隐藏'},
                }, 
                outputSolt: {
                    onend: {index: 0, type: 'number',info: '播放结束'}
                },
                cardexSolt:{index: 0, type: 'number', info: '关联实体'},
                icon: 'customComponent',
                otherConfig:{
                    autoRun:{type: 'toggleGroup', title:'自动播放', chooses: ['否','是'], default: 0},
                    dir:{type: 'toggleGroup', title:'动画方向', chooses: ['横向','竖向'], default: 0},
                    hideBeforRun:{type: 'toggleGroup', title:'运行前隐藏', chooses: ['否','是'], default: 0},
                    hideAfterRun:{type: 'toggleGroup', title:'运行结束隐藏', chooses: ['否','是'], default: 0},
                    hideBaseLabel:{type: 'toggleGroup', title:'隐藏底层文字', chooses: ['否','是'], default: 0},
                    position: {type: 'stringValue', title: '分段位置', default: "0,1"},
                    positionTime: {type: 'stringValue', title: '分段时间', default: "0,2"},
                    maskColor: {type: 'colorValue', title: '蒙版颜色', default: '88BF3D'},
                    tipsInfo1:{type: 'tipsInfo', title: '说明', default: '【分段位置】用,分割位置信息，最小0，最大1，是宽度的百分比形式，如果0,0.3,1，就是分了两段速度的动画过渡到字幕全部覆盖，对应的【分段时间】也至少有3个，例如0,1.3,2，表示前0.3的字幕用了1.3秒过渡，后0.7的字幕用了0.7秒就过渡完了'},
                    tipsInfo2:{type: 'tipsInfo', title: '说明', default: '挂载的物体类型设置需要设置为Label，【启用】传0时停止播放并恢复字幕到未播放状态，传不为0时开始播放，如果播放时传不为0时会从头开始播放，【隐藏】不管输入何值触发即隐藏'},
            }},
    CaiDanComponent: {key: 'CaiDanComponent',
                        baseType:'output',
                        defaultSize: [306,285],
                        changeSize:[[306,285],[306,395]],
                        inputSolt: {
                           
                        }, 
                        outputSolt: {
                            onclick:  {index: 0, type: 'number',info: '点击'}
                        },
                        cardexSolt:{index: 0, type: 'number', info: '关联实体'},
                        icon: 'customComponent',
                        otherConfig:{
                            caidanYuyin: {type: 'stringValue', title: '彩蛋语音', default: ""},
                            caidanId: {type: 'sliderValue', title: '彩蛋Id', default: 0},
                            caidanPosX: {type: 'sliderValue', title: '桃桃动画位置X', default: 0},
                            caidanPosY: {type: 'sliderValue', title: '桃桃动画位置Y', default: 0},
                            startSound: {type: 'stringValue', title: '出现语音', default: ""},
                            playSound:{type: 'toggleGroup', title:'播放声音', chooses: ['不播放','播放'], default: 1},
    }},
    CaiDanComponent2: {key: 'CaiDanComponent2',
                        baseType:'output',
                        defaultSize: [306,285],
                        changeSize:[[306,285],[306,395]],
                        inputSolt: {
                        
                        }, 
                        outputSolt: {
                            onclick:  {index: 0, type: 'number',info: '点击'}
                        },
                        cardexSolt:{index: 0, type: 'number', info: '关联实体'},
                        icon: 'customComponent',
                        otherConfig:{
                            caidanId: {type: 'sliderValue', title: '彩蛋Id', default: 0},
    }},
    ChatComponent: {key: 'ChatComponent',
        baseType:'output',
        inputSolt: {
            number1: {index: 0, type: 'number',info: '输入', canEdit: true},
            number2: {index: 1, type: 'number',info: '更新', canEdit: true}
        }, 
        outputSolt: {
            onclick:  {index: 0, type: 'number',info: '点击'}
        },
        cardexSolt:{index: 0, type: 'number', info: '关联实体'},
        icon: 'customComponent',
        otherConfig:{
            key: {type: 'stringValue', title: '点击标记', default: ""},
            dirType:{type: 'toggleGroup', title:'气泡箭头方向', chooses: ['左下','右下','右上','左上'], default: 0},
            tipsInfo1:{type: 'tipsInfo', title: '说明', default: '【输入】传0时隐藏气泡，不为0时显示，点击了对应的物体，调用【更新】更新点击标记'},
    }},
    VoiceCheck: {key: 'VoiceCheck',
        isSingleClass: true,//使用此参数，表示当前class不关联Node，直接关联Robot
        baseType:'output',
        inputSolt: {
            start: {index: 0, type: 'number',info: '开始'},
            stop: {index: 1, type: 'number',info: '停止'}
        }, 
        outputSolt: {
            star:  {index: 0, type: 'number',info: '输出'}
        },
        icon: 'customComponent',
        otherConfig:{
            testStr: {type: 'stringValue', title: '检测的字符', default: ""},
            testStrGroup: {type: 'stringValue', title: '检测的词组（用,分割）', default: ""},
            checkType:{type: 'toggleGroup', title:'检测模式', chooses: ['跟读','关键字模式'], default: 0},
            tipsInfo1:{type: 'tipsInfo', title: '说明', default: '【检测模式】选「跟读」，testStr生效，选「关键字模式」testStrGroup生效，关键字类似：你好,今天,开心，可配置1～4个关键字'},
        }
    },
    InGirdMapAI: {key: 'InGirdMapAI',
        baseType:'output',
        inputSolt: {
        }, 
        outputSolt: {
        },
        cardexSolt:{index: 0, type: 'number', info: '关联实体'},
        icon: 'customComponent',
        otherConfig:{
            id: {type: 'stringValue', title: 'id', default: "0"},
            girdMapRobot: {type: 'robot', title: '关联【格子地图】组件', default: ""},
    }},
    DynamicTexture: {key: 'DynamicTexture',
        baseType:'output',
        inputSolt: {
         
        }, 
        outputSolt: {
           
        },
        cardexSolt:{index: 0, type: 'number', info: '关联实体'},
        icon: 'customComponent',
        otherConfig:{
            tipsInfo1:{type: 'tipsInfo', title: '说明', default: '挂在创建物体为图片的节点下使用，该节点下所有物体都会被实时渲染为一张Texture，赋值于此节点上，在场景中不可见，用于配合AnyMask使用'},
    }},
    AnyMask: {key: 'AnyMask',
        baseType:'output',
        inputSolt: {
            
        }, 
        outputSolt: {
           
        },
        cardexSolt:{index: 0, type: 'number', info: '关联实体'},
        cardacSolt:{index: 0, type: 'number', info: '关联实体'},
        icon: 'customComponent',
        otherConfig:{
            tipsInfo1:{type: 'tipsInfo', title: '关联方式', default: '右上端关联目标节点，左下端关联作为蒙版的物体'},
            tipsInfo1:{type: 'tipsInfo', title: '说明', default: '挂在一个空物体下使用，该节点下所有物体都会根据关联的实体对象上的Sprite蒙版渲染，可直接关联一个图片类型的节点作为蒙版，也可以关联DynamicTexture'},
        }
    },
    SpinePlusComponent: {key: 'SpinePlusComponent',
                        baseType:'output',
                        defaultSize: [306,285],
                        changeSize:[[306,285],[306,395]],
                        inputSolt: {
                            number: {index: 0, type: 'number',info: '输入', canEdit: true}
                        }, 
                        outputSolt: {
                            
                        },
                        cardexSolt:{index: 0, type: 'number', info: '关联实体'},
                        icon: 'customComponent',
                        otherConfig:{
                           
    }},
    ProgressCompoment: {key: 'ProgressCompoment',
                baseType:'output',
                defaultSize: [306,285],
                changeSize:[[306,285],[306,395]],
                inputSolt: {
                    number: {index: 0, type: 'number',info: '进度'}
                }, 
                outputSolt: {
                    number: {index: 0, type: 'number',info: '增量'},
                },
                cardexSolt:{index: 0, type: 'number', info: '关联实体'},
                icon: 'customComponent',
                otherConfig:{
                
            }},
    AngleCompoment:{key: 'AngleCompoment',
        baseType:'output',
        inputSolt: {
            number1: {index: 0, type: 'number',info: '开启监听'},
            reset: {index: 1, type: 'number',info: '重置'}
        }, 
        outputSolt: {
            number1: {index: 0, type: 'number',info: '输出'},
        },
        cardexSolt:{index: 0, type: 'number', info: '关联实体'},

        icon: 'customComponent',
        otherConfig:{
        }
    },
    ScaleObj: {key: 'ScaleObj',
            baseType:'output',
            defaultSize: [306,285],
            changeSize:[[306,285],[306,395]],
            inputSolt: {
                number: {index: 0, type: 'number',info: '启用'}
            }, 
            outputSolt: {
                onScale: {index: 0, type: 'number',info: '触发缩放'}
            },
            cardexSolt:{index: 0, type: 'number', info: '关联实体'},
            icon: 'customComponent',
            otherConfig:{
                scaleMin: {type: 'sliderValue', title: '最小缩放', default: 0.5},
                scaleMax: {type: 'sliderValue', title: '最大缩放', default: 2},
                dynimicCenter:{type: 'toggleGroup', title:'是否以当前中心缩放', chooses: ['否', '是'], default: 0},
                tipsInfo1:{type: 'tipsInfo', title: '默认就是启用状态', default: ''},
    }},
    AutoTips: {key: 'AutoTips',
            baseType:'output',
            inputSolt: {
                number: {index: 0, type: 'number',info: '启用'},
                resetTime: {index: 1, type: 'number',info: '重置计时'}
            }, 
            outputSolt: {
            },
            cardexSolt:{index: 0, type: 'number', info: '关联实体'},
            icon: 'customComponent',
            otherConfig:{
                quesionYuyin: {type: 'stringValue', title: '问题语音', default: ""},
                waitTime: {type: 'sliderValue', title: '等待时间', default: 25},
            }
    },
    value: {key: 'value',
                        baseType:'input',
                        defaultSize: [306,285],
                        changeSize:[[306,285],[306,395]],
                        inputSolt: {
                            number: {index: 0, type: 'number',info: '触发', canEdit: true}
                        }, 
                        outputSolt: {
                            number: {index: 0, type: 'number',info: '1', canEdit: true}
                        },
                        otherConfig:{
                            value: {type: 'sliderValue', title: '数值', default: 1},
                            modal:{type: 'toggleGroup', title:'开始时是否自动输出', chooses: ['是', '否'], default: 0},
                        }},
    valueString: {key: 'valueString',
                        baseType:'input',
                        defaultSize: [306,345],
                        inputSolt: {
                            number: {index: 0, type: 'number',info: '触发', canEdit: true}
                        }, 
                        outputSolt: {
                            string: {index: 0, type: 'string',info: '...', canEdit: true}
                        },
                        otherConfig:{
                            value: {type: 'stringValue', title: '字符串', default: ""},
                            modal:{type: 'toggleGroup', title:'开始时是否自动输出', chooses: ['是', '否'], default: 0},
    }},
                        
    controll: {key: 'controll',
                        baseType:'input',
                        inputSolt: {
                            number1: {index: 0, type: 'function', info: '启用'},
                        },
                        outputSolt: {
                            number1: {index: 0, type: 'number', info: '左右'},
                            number2: {index: 0, type: 'number', info: '上下'}, 
                        },
                        otherConfig:{
                            controllType: {type: 'toggleGroup', title:'操控模式', chooses: ['拖拽', '点按'], default: 0},
                            modal:{type: 'toggleGroup', title:'输出模式', chooses: ['仅改变时', '持续'], default: 0},
                            outputScale: {type: 'sliderValue', title: '输出向量缩放倍数', default: 250},
                            tipsInfo1:{type: 'tipsInfo', title: '说明', default: '操作杆的x和y的范围：[-1, 1]，当拖动操控杆时\n仅改变时：操控杆移发生位移变化时输出当前操作杆范围\n持续：一直输出操控杆当前值*这一帧的时长'},
                        }
                    },
    customButton: {key: 'customButton',
                        baseType:'input',
                        inputSolt: {
                            number1: {index: 0, type: 'function', info: '启用'},
                        },
                        outputSolt: {
                            touchStart: {index: 0, type: 'function', info: '按下'},
                            touchEnd: {index: 1, type: 'function', info: '结束'},
                            touchCancel: {index: 2, type: 'function', info: '取消'},
                        },
                        otherConfig:{
                            customeName: {type: 'stringValue', title: '自定义名称', default: "输入名称"},
                            keyName:{type: 'toggleGroup', title:'按键名称', chooses: ['自定义','A', 'B', 'X', 'Y','O','上','下','左','右'], default: 0},
                            scale: {type: 'sliderValue', title: '按钮大小', default: 10},
                            paddingRight: {type: 'sliderValue', title: '按钮到屏幕右边的距离', default: 150},
                            paddingLeft: {type: 'sliderValue', title: '按钮到屏幕左边的距离', default: 0},
                            paddingBottom: {type: 'sliderValue', title: '按钮到屏幕底部的距离', default: 150},
                            paddingTop: {type: 'sliderValue', title: '按钮到屏幕顶部的距离', default: 0},
                           
                            tipsInfo1:{type: 'tipsInfo', title: '说明', default: '按钮到屏幕的距离有四个配置，分别是上下左右，如果填0则表示这个配置不生效，左右都不为0只有右会生效，上下都不为0只有下会生效'},
                        }},
    touchStart: {key: 'touchStart',
                        baseType:'input',
                        inputSolt: {
                            number1: {index: 0, type: 'function', info: '监听'},
                        },
                        outputSolt: {
                            number1: {index: 0, type: 'function', info: '开始X'},
                            number2: {index: 1, type: 'function', info: '开始Y'},
                            number3: {index: 2, type: 'number', info: '开始'},
                        },
                        cardexSolt:{index: 0, type: 'number', info: '关联实体'},
                        otherConfig:{
                            controllObj:{type: 'toggleGroup', title:'是否控制关联物体位置', chooses: ['否','是'], default: 0},
                        }},
    touchMove: {key: 'touchMove',
                        baseType:'input',
                        inputSolt: {
                            number1: {index: 0, type: 'function', info: '监听'},
                        },
                        outputSolt: {
                            number1: {index: 0, type: 'number', info: 'X轴移动'},
                            number2: {index: 0, type: 'number', info: 'Y轴移动'},
                        },
                        cardexSolt:{index: 0, type: 'number', info: '关联实体'},
                        otherConfig:{
                            needCheckIn:{type: 'toggleGroup', title:'是否检测在碰撞框内才输出', chooses: ['否','是'], default: 0},
                            controllObj:{type: 'toggleGroup', title:'是否控制关联物体位置', chooses: ['否','是'], default: 0},
                            mutplayTouch: {type: 'toggleGroup', title:'多点触摸时停止响应', chooses: ['否','是'], default: 0}
                        }},
    touchEnd: {key: 'touchEnd',
                        baseType:'input',
                        defaultSize: [306,450],
                        inputSolt: {
                            number1: {index: 0, type: 'function', info: '监听'},
                        },
                        outputSolt: {
                            number1: {index: 0, type: 'number', info: '结束X'},
                            number2: {index: 1, type: 'number', info: '结束Y'},
                            number3: {index: 2, type: 'number', info: '结束'},
                        },
                        cardexSolt:{index: 0, type: 'number', info: '关联实体'},
                        otherConfig:{
                            controllObj:{type: 'toggleGroup', title:'是否控制关联物体位置', chooses: ['否','是'], default: 0},
                            listernTouchCancel:{type: 'toggleGroup', title:'触摸取消时是否也触发', chooses: ['是','否'], default: 0},
                            tipsInfo1:{type: 'tipsInfo', title: '说明', default: '触摸开始到触摸结束时移动的距离小于10，【结束】输出为1，大于10，【结束】输出为2'},
                        }},
    leftOrRightAct: {key: 'leftOrRightAct',
                        baseType:'input',
                        inputSolt: {
                            number1: {index: 0, type: 'number', info: '监听'},
                        },
                        outputSolt: {
                            number1: {index: 0, type: 'number', info: 'x轴'},
                            number2: {index: 1, type: 'number', info: 'y轴'},
                            number3: {index: 2, type: 'number', info: 'z轴'},
                        },
                        otherConfig:{
                            modal:{type: 'toggleGroup', title:'输出模式', chooses: ['收到回调输出','每帧输出'], default: 0},
                        }},
    forwardOrbackAct: {key: 'forwardOrbackAct',
                        baseType:'input',
                        inputSolt: {},
                        outputSolt: {
                            number1: {index: 0, type: 'number', info: '值'},
                        }},
    shakeAct: {key: 'shakeAct',
                        baseType:'input',
                        inputSolt: {},
                        outputSolt: {
                            number1: {index: 0, type: 'number', info: '设备摇晃'},
                        }},
    rotationAct: {key: 'rotationAct',
                        baseType:'input',
                        inputSolt: {},
                        outputSolt: {
                            number1: {index: 0, type: 'number', info: '设备旋转'},
                        }},
    gameStart: {key: 'gameStart',
                        baseType:'input',
                        inputSolt: {},
                        outputSolt: {
                            number1: {index: 0, type: 'number', info: '游戏开始'}
                        },
                        otherConfig:{
                            modal:{type: 'toggleGroup', title:'输出时机', chooses: ['开始时','初始化时','初始化前'], default: 0},
                            tipsInfo1:{type: 'tipsInfo', title: '说明', default: '【开始时】初始化结束之后输出逻辑\n【初始化时】在开始时之前输出逻辑\n【初始化前】在所有robot初始化之前执行逻辑，仅用于动态赋值修改config，不建议做其它逻辑操作'},
                        }},
    objectDestroy: {key: 'objectDestroy',
                        baseType:'input',
                        inputSolt: {},
                        outputSolt: {
                            number1: {index: 0, type: 'function', info: '物品销毁'}
                        }},
    add: {key: 'add',
                        baseType:'middle',
                        inputSolt: {
                            number1: {index: 0, type: 'number', info: '数字1'},
                            number2: {index: 1, type: 'number', info: '数字2'},
                        },
                        outputSolt:{
                            number: {index: 0, type: 'number', info: '结果'},
                        },
                        otherConfig:{
                            input1Keep:{type: 'toggleGroup', title:'输入1是否保持状态', chooses: ['否', '是'], default: 1},
                            input2Keep:{type: 'toggleGroup', title:'输入2是否保持状态', chooses: ['否', '是'], default: 1},
                        }
                    },
    del: {key: 'del',
                        baseType:'middle',
                        inputSolt: {
                            number1: {index: 0, type: 'number', info: '被减数'},
                            number2: {index: 1, type: 'number', info: '减数'},
                        },
                        outputSolt:{
                            number: {index: 0, type: 'number', info: '结果'},
                        },
                        otherConfig:{
                            input1Keep:{type: 'toggleGroup', title:'输入1是否保持状态', chooses: ['否', '是'], default: 1},
                            input2Keep:{type: 'toggleGroup', title:'输入2是否保持状态', chooses: ['否', '是'], default: 1},
                        }},
    x: {key: 'x',
                        baseType:'middle',
                        inputSolt: {
                            number1: {index: 0, type: 'number', info: '数字1'},
                            number2: {index: 1, type: 'number', info: '数字2'},
                        },
                        outputSolt:{
                            number: {index: 0, type: 'number', info: '结果'},
                        },
                        otherConfig:{
                            input1Keep:{type: 'toggleGroup', title:'输入1是否保持状态', chooses: ['否', '是'], default: 1},
                            input2Keep:{type: 'toggleGroup', title:'输入2是否保持状态', chooses: ['否', '是'], default: 1},
                        }},
    chu: {key: 'chu',
                        baseType:'middle',
                        inputSolt: {
                            number1: {index: 0, type: 'number', info: '被除数'},
                            number2: {index: 1, type: 'number', info: '除数'},
                        },
                        outputSolt:{
                            number: {index: 0, type: 'number', info: '结果'},
                        },
                        otherConfig:{
                            input1Keep:{type: 'toggleGroup', title:'输入1是否保持状态', chooses: ['否', '是'], default: 1},
                            input2Keep:{type: 'toggleGroup', title:'输入2是否保持状态', chooses: ['否', '是'], default: 1},
                        }},
    length: {key: 'length',
                        baseType:'middle',
                        inputSolt: {
                            number1: {index: 0, type: 'number', info: 'x'},
                            number2: {index: 1, type: 'number', info: 'y'},
                        },
                        outputSolt:{
                            number: {index: 0, type: 'number', info: '长度'},
                        },
                        otherConfig:{
                            input1Keep:{type: 'toggleGroup', title:'输入1是否保持状态', chooses: ['否', '是'], default: 1},
                            input2Keep:{type: 'toggleGroup', title:'输入2是否保持状态', chooses: ['否', '是'], default: 1},
                        }},
    angleDifference:{key: 'angleDifference',
                        baseType:'middle',
                        inputSolt: {
                            number1: {index: 0, type: 'number', info: '角度1'},
                            number2: {index: 1, type: 'number', info: '角度2'},
                        },
                        outputSolt:{
                            number: {index: 0, type: 'number', info: '结果'},
                        },
                        otherConfig:{
                            inputType:{type: 'toggleGroup', title:'输入的类型', chooses: ['角度', '向量'], default: 0},
                            input1Keep:{type: 'toggleGroup', title:'输入1是否保持状态', chooses: ['否', '是'], default: 1},
                            input2Keep:{type: 'toggleGroup', title:'输入2是否保持状态', chooses: ['否', '是'], default: 1},
                        }},
    vectorToAngel:{key: 'vectorToAngel',
                        baseType:'middle',
                        inputSolt: {
                            number1: {index: 0, type: 'number', info: 'x坐标'},
                            number2: {index: 1, type: 'number', info: 'y坐标'},
                        },
                        outputSolt:{
                            number: {index: 0, type: 'number', info: '角度'},
                        },
                        otherConfig:{
                            input1Keep:{type: 'toggleGroup', title:'输入1是否保持状态', chooses: ['否', '是'], default: 1},
                            input2Keep:{type: 'toggleGroup', title:'输入2是否保持状态', chooses: ['否', '是'], default: 1},
                        }}, 
    angleConvertVector :{key: 'angleConvertVector',
                        baseType:'middle',
                        inputSolt: {
                            number1: {index: 0, type: 'number', info: '角度'},
                            number2: {index: 1, type: 'number', info: '斜边长'},
                        },
                        outputSolt:{
                            number1: {index: 0, type: 'number', info: 'x长'},
                            number2: {index: 1, type: 'number', info: 'y长'},
                        },
                        otherConfig:{
                            input1Keep:{type: 'toggleGroup', title:'输入1是否保持状态', chooses: ['否', '是'], default: 1},
                            input2Keep:{type: 'toggleGroup', title:'输入2是否保持状态', chooses: ['否', '是'], default: 1},
                        }},                 
    upCount: {key: 'upCount',
                        baseType:'middle',
                        inputSolt: {
                            add: {index: 0, type: 'number', info: '增加'},
                            delete: {index: 1, type: 'number', info: '减少'},
                            reset: {index: 2, type: 'number', info: '重置'}
                        },
                        outputSolt:{
                            number: {index: 0, type: 'number', info: '', },
                        },
                        otherConfig:{
                            startValue: {type: 'sliderValue', title: '开始时的计数值', default: 0},
                            modal:{type: 'toggleGroup', title:'模式', chooses: ['无限制', '范围限制', '循环', '来回'], default: 1},
                            range:{type: 'rangeValue', title: '计数范围', default: [1,10]},
                            tigger:{type: 'toggleGroup', title: '计数的时机', chooses: ['从0改变时', '不为0时持续'], default: 0},
                            upStepmodal:{type: 'toggleGroup', title: '步进模式（仅当【计数的时机】为【不为0时持续】时生效）', chooses: ['乘以时间', '不乘以时间'], default: 0},
                            stepValue: {type: 'sliderValue', title: '步进数值', default: 1},
                            resetMode: {type: 'toggleGroup', title: '重置模式', chooses: ['重置为开始', '重置为输入'], default: 0},
                            tipsInfo1:{type: 'tipsInfo', title: '说明', default: '【重置】输入时会将当前计数重置为输入值'},
                        },
            },
    abs: {key: 'abs',
                        baseType:'middle',
                        inputSolt: {
                            number: {index: 0, type: 'number', info: '输入'},
                        },
                        outputSolt:{
                            number: {index: 0, type: 'number', info: '输出'},
                        }},
    revertNegative: {key: 'revertNegative',
                        baseType:'middle',
                        inputSolt: {
                            number: {index: 0, type: 'number', info: '输入'},
                        },
                        outputSolt:{
                            number: {index: 0, type: 'number', info: '输出'},
                        }},
    dataObject:{key: 'dataObject',
                        baseType:'middle',
                        inputSolt: {
                            number1: {index: 0, type: 'number', info: '挂载'},
                            number2: {index: 1, type: 'number', info: '触发'},  //触发可以传一个值，如果number不为空就取值，输出值
                        },
                        cardacSolt:{index: 0, type: 'number', info: '关联指令'},
                        outputSolt:{
                            number1: {index: 0, type: 'number', info: 'key'},
                            number2: {index: 1, type: 'number', info: 'value'},
                        }},
    getKeyValue:{key: 'getKeyValue',
                        baseType:'middle',
                        inputSolt: {
                            number1: {index: 0, type: 'number', info: '挂载'},
                            number2: {index: 1, type: 'number', info: '触发'},
                        },
                        cardacSolt:{index: 0, type: 'number', info: '关联指令'},
                        outputSolt:{
                        },
                        otherConfig:{
                            outputSoltCount:{type: 'sliderValue', title: '输出值数量', default: 2, range: [1, 20],  valueByArrLength: 'outputSoltInfo'},
                            customeKey: {type: 'stringValue', title: '自定义取值key', default: ""},
                            tipsInfo1:{type: 'tipsInfo', title: '说明', default: '自定义取值输入不为空时，将作为【节点信息】,格式：key1,key2,key3 使用英文,作为分割'},
                            outputSoltInfo:{type: 'config', title: '节点信息', default: []},
                        },
                },
    squareRoot: {key: 'squareRoot',
                        baseType:'middle',
                        inputSolt: {
                            number: {index: 0, type: 'number', info: '输入'},
                        },
                        outputSolt:{
                            number: {index: 0, type: 'number', info: '输出'},
                        }},
    toint: {key: 'toint',
                        baseType:'middle',
                        inputSolt: {
                            floor: {index: 0, type: 'number', info: '向下取整'},
                            ceil: {index: 1, type: 'number', info: '向上取整'},
                            round: {index: 2, type: 'number', info: '四舍五入'},
                        },
                        outputSolt:{
                            number: {index: 0, type: 'number', info: '输出'},
                        }},
    notRight:{key: 'notRight',
                    baseType:'middle',
                    inputSolt: {
                        number: {index: 0, type: 'number', info: '输入'},
                    },
                    outputSolt:{
                        number: {index: 0, type: 'number', info: '输出'},
                    },
                    otherConfig:{
                        breakOutPut:{type: 'toggleGroup', title:'结果为0时阻断输出', chooses: ['否', '是'], default: 0}
                    }
                },
    orRight:{key: 'orRight',
                    baseType:'middle',
                    inputSolt: {
                        number1: {index: 0, type: 'number', info: '输入1'},
                        number2: {index: 1, type: 'number', info: '输入2'},
                        number3: {index: 2, type: 'number', info: '输入3'},
                    },
                    outputSolt:{
                        number: {index: 0, type: 'number', info: '输出'},
                    },
                    otherConfig:{
                        modal:{type: 'toggleGroup', title:'判定开始时机', chooses: ['任意一个', '全输入'], default: 0},
                        breakOutPut:{type: 'toggleGroup', title:'结果为0时阻断输出', chooses: ['否', '是'], default: 0}
                    }
                },
    allRight:{key: 'allRight',
                    baseType:'middle',
                    inputSolt: {
                        number1: {index: 0, type: 'number', info: '输入1'},
                        number2: {index: 1, type: 'number', info: '输入2'},
                    },
                    outputSolt:{
                        number: {index: 0, type: 'number', info: '输出'},
                    },
                    otherConfig:{
                        modal:{type: 'toggleGroup', title:'判定开始时机', chooses: ['任意一个', '全输入'], default: 0},
                        input1Keep:{type: 'toggleGroup', title:'输入1是否保持状态', chooses: ['否', '是'], default: 0},
                        input2Keep:{type: 'toggleGroup', title:'输入2是否保持状态', chooses: ['否', '是'], default: 0},
                        console:{type: 'toggleGroup', title:'打印标记', chooses: ['无', 'AAA','BBB','CCC','DDD','EEE','FFF','GGG','HHH','III'], default: 0},
                        breakOutPut:{type: 'toggleGroup', title:'结果为0时阻断输出', chooses: ['否', '是'], default: 0}
                    }
                },
    equire:{key: 'equire',
                    baseType:'middle',
                    iconOffset: {x: 0, y: 20},
                    inputSolt: {
                        number1: {index: 0, type: 'number', info: '输入1'},
                        number2: {index: 1, type: 'number', info: '输入2'},
                    },
                    outputSolt:{
                        number: {index: 0, type: 'number', info: '输出'},
                    },
                    otherConfig:{
                        input1Keep:{type: 'toggleGroup', title:'输入1是否保持状态', chooses: ['否', '是'], default: 1},
                        input2Keep:{type: 'toggleGroup', title:'输入2是否保持状态', chooses: ['否', '是'], default: 1},
                        breakOutPut:{type: 'toggleGroup', title:'结果为0时阻断输出', chooses: ['否', '是'], default: 0}
                    }
                },
    litter:{key: 'litter',
                    baseType:'middle',
                    inputSolt: {
                        number1: {index: 0, type: 'number', info: '左边'},
                        number2: {index: 1, type: 'number', info: '右边'},
                    },
                    outputSolt:{
                        number: {index: 0, type: 'number', info: '输出'},
                    },
                    otherConfig:{
                        input1Keep:{type: 'toggleGroup', title:'输入1是否保持状态', chooses: ['否', '是'], default: 1},
                        input2Keep:{type: 'toggleGroup', title:'输入2是否保持状态', chooses: ['否', '是'], default: 1},
                        breakOutPut:{type: 'toggleGroup', title:'结果为0时阻断输出', chooses: ['否', '是'], default: 0}
                    }
                },
    bigger: {key: 'bigger',
                    baseType:'middle',
                    inputSolt: {
                        number1: {index: 0, type: 'number', info: '左边'},
                        number2: {index: 1, type: 'number', info: '右边'},
                    },
                    outputSolt:{
                        number: {index: 0, type: 'number', info: '输出'},
                    },
                    otherConfig:{
                        input1Keep:{type: 'toggleGroup', title:'输入1是否保持状态', chooses: ['否', '是'], default: 1},
                        input2Keep:{type: 'toggleGroup', title:'输入2是否保持状态', chooses: ['否', '是'], default: 1},
                        breakOutPut:{type: 'toggleGroup', title:'结果为0时阻断输出', chooses: ['否', '是'], default: 0}
                    }
                },
    inRange:{key: 'inRange',
                    baseType:'middle',
                    inputSolt: {
                        number1: {index: 0, type: 'number', info: '最小值'},
                        number2: {index: 1, type: 'number', info: '比较值'},
                        number3: {index: 2, type: 'number', info: '最大值'},
                    },
                    outputSolt:{
                        number: {index: 0, type: 'number', info: '输出'},
                        number2: {index: 0, type: 'number', info: '结果'},
                    },
                    otherConfig:{
                        number1:{type: 'sliderValue', title: '最小值', default: 1},
                        number3:{type: 'sliderValue', title: '最大值', default: 10},
                        input1Keep:{type: 'toggleGroup', title:'最小值是否保持状态', chooses: ['否', '是'], default: 1},
                        input2Keep:{type: 'toggleGroup', title:'最大值是否保持状态', chooses: ['否', '是'], default: 1},
                        breakOutPut:{type: 'toggleGroup', title:'结果为0时阻断输出', chooses: ['否', '是'], default: 0},
                        contanLeftAndRigght:{type: 'toggleGroup', title:'是否包含等于最大值和最小值', chooses: ['否', '是'], default: 0},
                        tipsInfo1:{type: 'tipsInfo', title: '说明', default: '最小值最大值可连线赋值，也可以在配置中填写值，如果连线了则配置中的值失效'},
                        tipsInfo2:{type: 'tipsInfo', title: '说明', default: '输出:输出是否符合对比条件，符合为1不符合为0,结果:输出根据条件优化后的值，如果输入比较值小于最小条件值，结果为最小条件值，如果大于最大条件值，结果为最大条件值，如果在最小和最大条件值之间，结果为比较值'},
                    }
                },
    mapping: {key: 'mapping',
                        baseType:'middle',
                        inputSolt: {
                            number1: {index: 0, type: 'number', info: '目标数值'},
                            number2: {index: 1, type: 'number', info: '范围左：0'},
                            number3: {index: 2, type: 'number', info: '范围右：10'},
                        },
                        outputSolt:{
                            number: {index: 0, type: 'number', info: '结果'},
                        }},     
    timeDown: {key: 'timeDown',
                        baseType:'middle',
                        inputSolt: {
                            number1: {index: 0, type: 'number', info: '输入'},
                            number2: {index: 1, type: 'number', info: '等待时间'},
                            number3: {index: 2, type: 'number', info: '是否循环'},
                        }, 
                        outputSolt: {
                            number: {index: 0, type: 'number',info: '输出'}
                        },
                        otherConfig:{
                            number2:{type: 'sliderValue', title: '等待时间', default: 1},
                            number3:{type: 'toggleGroup', title:'是否循环',chooses:["否", "是"], default: 0},
                            tipsInfo1:{type: 'tipsInfo', title: '说明', default: '等待时间如果为0的话表示等待1帧。输入的值不为0时即执行倒计时，输入值为0时停止倒计时，输出的值为当前输出帧和上一帧的时间差'},
                        }},
    randomNum:{key: 'randomNum',
                        baseType:'middle',
                        inputSolt: {
                            number: {index: 0, type: 'number', info: '输入'},
                        },
                        outputSolt:{
                            number: {index: 0, type: 'number', info: '输出'},
                        }, 
                        otherConfig:{
                            modal:{type: 'toggleGroup', title:'随机模式', chooses: ['仅一次','每条线'], default: 0},
                            tipsInfo1:{type: 'tipsInfo', title: '说明', default: '生成的随机值[0,输入值-1]，仅一次：输入时随机获得一个随机值，输出时每条线都输出该值，每条线：每条线输出的时候都会重新生成一个随机值'},
                        }},
    checkTag:{key: 'checkTag',
                        baseType:'middle',
                        findKey: 'checkTag,customeName,modal',
                        inputSolt: {
                            number1: {index: 0, type: 'number', info: '触发'},
                            number2: {index: 1, type: 'number', info: '值'},
                        },
                        outputSolt:{
                            number: {index: 0, type: 'number', info: '输出'},
                        },
                        cardexSolt:{index: 0, type: 'number', info: '关联实体'},
                        otherConfig:{
                            customeName: {type: 'stringValue', title: '自定义状态名称', default: ""},
                            customeValue: {type: 'stringValue', title: '自定义状态值', default: ""},
                            
                            modal:{type: 'toggleGroup', title:'状态名称', chooses: ['自定义','动画是否播放中', '是否不可交互', '游戏是否开始', '游戏是否结束', '引导是否显示','当前执行逻辑','逻辑A是否触发','逻辑B是否触发','逻辑C是否触发','逻辑D是否触发'], default: 0},
                            
                            breakOutPut:{type: 'toggleGroup', title:'当前值为0时阻断输出', chooses: ['否', '是'], default: 0},
                            initWithValue:{type: 'toggleGroup', title:'初始化时将自定义状态值赋值', chooses: ['否', '是'], default: 0},

                            tipsInfo1:{type: 'tipsInfo', title: '说明', default: '如果关联实体，则以该实体为状态的对象，状态名称和自定义状态名称将不起作用，如果不关联实体，则反之；自定义状态名称不可以用0~20作为标记，与默认的冲突'},
                            tipsInfo2:{type: 'tipsInfo', title: '输入说明', default: '触发输入不为0时会输出，值输入时不管是多少都会输出'},
                            tipsInfo3:{type: 'tipsInfo', title: '输入说明', default: '【customeValue】可以填+1或-1，+2，+3，-3，带正负号的值，可以实现每次输入改变值时自增自减'}
                        }
             },
    sendData:{key: 'sendData',
                        baseType:'middle',
                        defaultSize: [314,285],
                        findKey: 'acceptData,customeName',
                        inputSolt: {
                            number: {index: 0, type: 'number', info: '输入'},
                        },
                        outputSolt:{
                            number: {index: 0, type: 'string', info: 'A', hideDropNode: true},
                        },
                        otherConfig:{
                            customeName: {type: 'stringValue', title: '自定义名称', default: "A"},
                            tipsInfo1:{type: 'tipsInfo', title: '说明', default: '该值为绑定连线逻辑不支持动态修改'},
                        }
             },
    acceptData:{key: 'acceptData',
                        baseType:'middle',
                        defaultSize: [306,285],
                        findKey: 'sendData,customeName',
                        inputSolt: {
                            number: {index: 0, type: 'string', info: 'A', hideDropNode: true},
                        },
                        outputSolt:{
                            number: {index: 0, type: 'number', info: '输出'},
                        },
                        otherConfig:{
                            customeName: {type: 'stringValue', title: '自定义名称', default: "A"},
                            tipsInfo1:{type: 'tipsInfo', title: '说明', default: '该值为绑定连线逻辑不支持动态修改'},
                        }
                    },
    writeNote:{key: 'writeNote',
                        baseType:'middle',
                        color: '#A6A6A6',
                        zIndex: -1,
                        inputSolt: {
                            robot1: {index: 0, type: 'robot', info: '创建引用'},
                            value1: {index: 1, type: 'number', info: '传值输入1'},
                            value2: {index: 2, type: 'number', info: '传值输入2'},
                        },
                        outputSolt:{
                            robot1: {index: 0, type: 'robot', info: '引用输出'},
                            value1: {index: 1, type: 'number', info: '传值输出1'},
                            value2: {index: 2, type: 'number', info: '传值输出2'},
                        },
                        otherConfig:{
                            modal:{type: 'toggleGroup', title:'是否作为方法块', chooses: ['否','静态方法块','动态方法块'], default: 0},
                            cardTitle:{type: 'stringValue', title: '备注将作为卡片标题显示', default: "个人备忘录"},
                            tipsInfo1:{type: 'tipsInfo', title: '是否作为方法块说明', default: '如果选择【静态方法块】，此备忘录中所有指令在运行时将根据【输入扩展】和【输出扩展】的节点数量创建副本，这样在编辑的时候如果遇到多个物体相同的操作可以减少许多重复连线，如果作为方法块，【物体】不要直接放到方法块中，而是使用【引用物体】作为操作对象，在调用方法块的时候传入【物体】实例，一个方法块中可以有好几个【输入扩展】，也可以有好几个【输出扩展】，但是输入扩展和输出扩展的节点数量一定要一致，否则会导致在创建副本的时候无法找到正确的引用。该值不值支持动态修改'},
                            tipsInfo2:{type: 'tipsInfo', title: '动态方法块说明', default: '如果选择【动态方法块】，此备忘录中所有指令在运行时将根据【创建引用】的输入节点，输入引用物体动态创建副本，同时【输入扩展】【输出扩展】将不再作为创建的数量依据，但是依然生效，输入输出的连线为对应第几个副本'},
                        },
                },
    inputArr:{
                key: 'inputArr',
                baseType:'middle',
                defaultSize: [235,489],
                changeSize:[[235,489]],
                heightBySolt: true,
                cantValueArr: true,
                inputSolt: {
                    input0: {index: 0, type: 'number', info: '1'},
                    input1: {index: 1, type: 'number', info: '2'},
                    input2: {index: 2, type: 'number', info: '3'},
                    input3: {index: 3, type: 'number', info: '4'},
                },
                outputSolt:{
                    number: {index: 0, type: 'number', info: ''},
                },
                otherConfig:{
                    modal:{type: 'toggleGroup', title:'克隆源标记', chooses: ['否', '是'], default: 0},
                    inputSoltCount:{type: 'sliderValue', title: '输入节点数量', default: 4, range: [2, 12]},
                    tipsInfo1:{type: 'tipsInfo', title: '说明', default: '当其放在方法块中时，此输入节点数量将作为方法块的备份数量，当在方法块外面使用时，就是普通的多个输入，单个输出，也不要动态修改该值'},
                    tipsInfo2:{type: 'tipsInfo', title: '说明', default: '克隆源标记，程序控制，不要手动修改，保持否选项即可，也不要动态修改该值'}
                },
            },
    outputArr:{
                key: 'outputArr',
                baseType:'middle',
                defaultSize: [235,489],
                changeSize:[[235,489]],
                heightBySolt: true,
                cantValueArr: true,
                inputSolt: {
                    number: {index: 0, type: 'number', info: '1'},
                },
                outputSolt:{
                    output0: {index: 0, type: 'number', info: '1'},
                    output1: {index: 1, type: 'number', info: '2'},
                    output2: {index: 2, type: 'number', info: '3'},
                    output3: {index: 3, type: 'number', info: '4'},
                },
                otherConfig:{
                    modal:{type: 'toggleGroup', title:'克隆源标记', chooses: ['否', '是'], default: 0},
                    outputSoltCount:{type: 'sliderValue', title: '输入节点数量', default: 4, range: [2, 12]},
                    tipsInfo1:{type: 'tipsInfo', title: '说明', default: '当其放在方法块中时，将配合【输入节点】，例如输入节点的第一个点触发了，当指令执行到此时，也只会输出对应的第一个点，当第三个点触发时则输出第三个点，以此推累，这么设计的目的是当共线逻辑执行后，可以根据输入的是哪个线的逻辑继续执行分线逻辑。也不要动态修改该值'},
                    tipsInfo2:{type: 'tipsInfo', title: '说明', default: '克隆源标记，程序控制，不要手动修改，保持否选项即可，也不要动态修改该值'}
                },
            },
    outputLine:{
            key: 'outputLine',
            baseType:'middle',
            defaultSize: [235,489],
            changeSize:[[235,489]],
            cantValueArr: true,
            heightBySolt: true,
            inputSolt: {
                number: {index: 0, type: 'number', info: '1'},
            },
            outputSolt:{
                output0: {index: 0, type: 'number', info: '1'},
                output1: {index: 1, type: 'number', info: '2'},
                output2: {index: 2, type: 'number', info: '3'},
                output3: {index: 3, type: 'number', info: '4'},
            },
            otherConfig:{
                outputSoltCount:{type: 'sliderValue', title: '输入节点数量', default: 4, range: [2, 12]},
                tipsInfo1:{type: 'tipsInfo', title: '说明', default: '根据输入的值输出不同的节点，输入0，则第1个节点输出值1，输入1，则第2个节点输出值1，输入2，则第3个节点输出值1,以此类推'},
            },
        },
    linkArr:{
            key: 'linkArr',
            baseType:'middle',
            defaultSize: [235,489],
            changeSize:[[235,489]],
            heightBySolt: true,
            cantValueArr: true,
            inputSolt: {
                input0: {index: 0, type: 'number', info: '1'},
                input1: {index: 1, type: 'number', info: '2'},
                input2: {index: 2, type: 'number', info: '3'},
                input3: {index: 3, type: 'number', info: '4'},
            },
            outputSolt:{
                output0: {index: 0, type: 'number', info: '1'},
                output1: {index: 1, type: 'number', info: '2'},
                output2: {index: 2, type: 'number', info: '3'},
                output3: {index: 3, type: 'number', info: '4'},
            },
            otherConfig:{
                inputSoltCount:{type: 'sliderValue', title: '输入节点数量', default: 4, range: [2, 12]},
                outputSoltCount:{type: 'sliderValue', title: '输出节点数量', default: 4, range: [2, 12]},
                tipsInfo1:{type: 'tipsInfo', title: '说明', default: '用于并联两个方法块，不支持动态赋值'},
            },
    },
    lighting:{
        key: 'lighting',
        baseType:'middle',
        defaultSize: [235,489],
        changeSize:[[235,489]],
        cantValueArr: true,
        inputSolt: {
        },
        outputSolt:{
            output0: {index: 0, type: 'number', info: '连接', singleLine: true},
        },
        otherConfig:{
            inputSoltCount:{type: 'sliderValue', title: '输入节点数量', default: 0, range: [0, 30], valueByArrLength: 'inputSoltInfo'},
            inputSoltInfo:{type: 'config', title: '节点信息', default: []},
            tipsInfo1:{type: 'tipsInfo', title: '说明', default: '用于在运行时动态万能修改任意卡片的配置，自身不支持动态赋值，大部分卡片的配置被修改后，再次执行逻辑时配置才会生效，某些Robot做了适配，当收到了配置修改，会立刻生效'},
        },
    },
    lightingOut:{
        key: 'lightingOut',
        baseType:'middle',
        defaultSize: [235,489],
        changeSize:[[235,489]],
        cantValueArr: true,
        inputSolt: {
            number: {index: 0, type: 'number', info: '输入'},
        },
        cardexSolt:{index: 0, type: 'number', info: '关联实体', canDrag: true, singleLine: true},
        outputSolt:{
            
        },
        otherConfig:{
            outputSoltCount:{type: 'sliderValue', title: '输出节点数量', default: 0, range: [0, 30], valueByArrLength: 'outputSoltInfo'},
            outputSoltInfo:{type: 'config', title: '节点信息', default: []},
            tipsInfo1:{type: 'tipsInfo', title: '说明', default: '用于在运行时动态万能获取任意卡片的配置的值'},
        },
    },
    textCode:{
        key: 'textCode',
        baseType:'middle',
        inputSolt: {
            number: {index: 0, type: 'number', info: 'valueA'},
        },
        outputSolt:{
            number: {index: 0, type: 'number', info: 'valueB'},
        },
        otherConfig:{
            codeString:{type: 'stringValue', title: '执行代码片段', default: ""},
            tipsInfo1:{type: 'tipsInfo', title: '说明', default: '直接输入代码执行'},
        },
    },
    exportObject:{key: 'exportObject', baseType:'middle',
                    color: '#2DA66A',
                    inputSolt: {
                        robot1: {index: 0, type: 'robot', info: '引用'},
                        number1: {index: 1, type: 'number', info: '触发'},
                    },
                    cardacSolt:{index: 0, type: 'number', info: '关联指令'},
                    outputSolt:{
                        number: {index: 0, type: 'number', info: '输出'},
                        robot: {index: 1, type: 'robot', info: '物体'},
                    },
                    otherConfig:{
                        modal:{type: 'toggleGroup', title:'当引用输入的时触发【输出1】【物体】', chooses: ['否', '是'], default: 1},
                        tipsInfo1:{type: 'tipsInfo', title: '说明', default: '引用对象,为了实现连线的逻辑复用，引用对象可以动态连接一个实体，连线逻辑对引用对象的操作将操作实体对象'},
                        tipsInfo2:{type: 'tipsInfo', title: '插槽说明', default: '引用1、2、3可以输入三个不同的物体，当物体上的触发插槽输入时将输出自身到引用物体上'},
                        tipsInfo3:{type: 'tipsInfo', title: '支持指令', default: '支持绑定引用对象的指令：传感器，动画'}
                    },
                },
    consoleInfo: {key: 'consoleInfo',
                baseType:'output',
                inputSolt: {
                    number1: {index: 0, type: 'number', info: ''},
                },
                outputSolt:{
                },
                otherConfig:{
                    modal:{type: 'toggleGroup', title:'状态名称', chooses: ['显示输入值','自定义','自定义+输入值'], default: 0},
                    customInfo:{type: 'stringValue', title: '提示的内容', default: ""}
                },
            }, 
    showTextTip: {key: 'showTextTip',
                        baseType:'output',
                        iconOffset: {x: 0, y: -50},
                        inputSolt: {
                            number1: {index: 0, type: 'number', info: '内容'},
                        },
                        outputSolt:{
                        },
                        otherConfig:{
                            modal:{type: 'toggleGroup', title:'状态名称', chooses: ['显示输入值','自定义','自定义+输入值'], default: 0},
                            customInfo:{type: 'stringValue', title: '提示的内容', default: ""}
                        },
                    }, 
    showConfirm: {key: 'showConfirm',
                        baseType:'output',
                        iconOffset: {x: 0, y: 20},
                        inputSolt: {
                            number1: {index: 0, type: 'number', info: '显示'},
                        },
                        outputSolt:{
                            yes: {index: 0, type: 'number', info: '确认'},
                            no: {index: 1, type: 'number', info: '取消'},
                        },
                        otherConfig:{
                            modal:{type: 'toggleGroup', title:'状态名称', chooses: ['显示输入值','自定义','自定义+输入值'], default: 0},
                            customInfo:{type: 'stringValue', title: '提示的内容', default: ""}
                        },
                    }, 
    stopTime: {key: 'stopTime',
                        baseType:'output',
                        inputSolt: {
                            number1: {index: 0, type: 'number', info: '是否停止'},
                        },
                        outputSolt:{
                        }}, 
    timeScale: {key: 'timeScale',
                        baseType:'output',
                        inputSolt: {
                            number1: {index: 0, type: 'number', info: '缩放倍数'},
                        },
                        outputSolt:{
                        }}, 
    vibrate: {key: 'vibrate',
                        baseType:'output',
                        inputSolt: {
                            number1: {index: 0, type: 'number', info: '震动'},
                        },
                        outputSolt:{
                        },
                        otherConfig:{
                            modal:{type: 'toggleGroup', title:'模式', chooses: ['短震动', '长震动'], default: 0},
                            tipsInfo1:{type: 'tipsInfo', title: '让设备震动', default: '输入不为0时震动'}
                        },
                    }, 
        sound: {key: 'sound',
                baseType:'output',
                inputSolt: {
                    number1: {index: 0, type: 'number', info: '播放'},
                },
                outputSolt:{
                    number1: {index: 0, type: 'number', info: '结束'},
                },
                // iconOffset: {x: 0, y: -40},
                otherConfig:{
                    customeName: {type: 'stringValue', title: '自定义音频', default: "输入资源名称"},
                    modal:{type: 'toggleGroup', title:'选择音频', chooses: ['自定义音频','胜利', '开始', '倒计时'], default: 0},
                    yinggui:{type: 'toggleGroup', title:'选择音轨', chooses: ['无(叠加播放)', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'], default: 0},
                    loop:{type: 'toggleGroup', title:'是否循环',chooses:['循环','播放一次'], default: 1},
                    volume: {type: 'sliderValue', title: '音量', default: 5, range: [0, 10]},
                    tipsInfo1:{type: 'tipsInfo', title: '播放音频', default: '输入不为0时播放，输入0时停止播放，同一时间一个音轨只会有一个音乐在播放状态'}
            },
        },

        
        animate:{key: 'animate',
                    baseType:'objects',
                    inputSolt: {
                        number1: {index: 0, type: 'number', info: '播放'},
                    },
                    outputSolt:{
                        number1: {index: 0, type: 'number', info: '结束'},
                        number2: {index: 1, type: 'number', info: '点击'},
                    },
                    cardexSolt:{index: 0, type: 'number', info: '关联实体'},
                    otherConfig:{
                        modal:{type: 'toggleGroup', title:'更新模式', chooses: ['全设置','仅设置皮肤','仅设置动画'], default: 0},
                        skin: {type: 'toggleGroup', title: '选择皮肤', chooses:['待初始化'], default: 0},
                        playAniName: {type: 'toggleGroup', title: '选择动画', chooses:['待初始化'], default: 0},
                        loop:{type: 'toggleGroup', title:'是否循环',chooses:['循环','播放一次'], default: 1},
                        timeScale: {type: 'sliderValue', title: '播放速率', default: 10, range: [0, 50]},
                        autoRun:{type: 'toggleGroup', title:'是否自动播放',chooses:['否','是'], default: 0},
                        clickWait:{type: 'toggleGroup', title:'点击后等待当前动画结束后输出',chooses:['否','是'], default: 0},
                        softChange:{type: 'toggleGroup', title:'柔性过度——防止上一个动画未播完跳帧',chooses:['否','是'], default: 0},
                        cancelEvent:{type: 'toggleGroup', title:'是否取消其它触摸事件监听',chooses:['是','否'], default: 0},
                        aniEndCanClick: {type: 'toggleGroup', title:'动画播放结束后才响应点击',chooses:['是','否'], default: 0},
                        tipsInfo1:{type: 'tipsInfo', title: '更新模式', default: '仅设置皮肤时，不会影响当前动画播放状态，结束和点击将不会进行输出，也不会取消原来动画绑定的点击事件结束事件'},
                        tipsInfo2:{type: 'tipsInfo', title: '连线规则', default: '当多个Spine类型的物体连接到这个组件，可以实现一个此Robot控制多个物体播放相同的动画'}
                    }
                },
        tween:{
                    key: 'tween',
                    baseType:'objects',
                    inputSolt: {
                        number1: {index: 0, type: 'number', info: '播放'},
                    },
                    outputSolt:{
                        number1: {index: 0, type: 'number', info: '结束'},
                        number2: {index: 1, type: 'number', info: '点击'},
                    },
                    cardexSolt:{index: 0, type: 'number', info: '关联实体'},
                    otherConfig:{
                        duration: {type: 'sliderValue', title: '动画时长', default: 10, range: [0, 300]},
                        delay: {type: 'sliderValue', title: '延迟播放时间', default: 0, range: [0, 300]},
                        easing: {type: 'toggleGroup', title: '缓动效果', chooses:['无','淡入','淡出','淡入淡出','回弹','弹跳'], default: 0},
                        x: {type: 'sliderValue', title:'坐标-x', default: 0 },
                        y: {type: 'sliderValue', title:'坐标-y', default: 0 },
                        scaleX: {type: 'sliderValue', title:'缩放-x', default: 10, range:[0, 100] },
                        scaleY: {type: 'sliderValue', title:'缩放-y', default: 10, range:[0, 100] },
                        opacity:{type: 'sliderValue', title:'透明度', default: 255, range:[0, 255] },
                        angle: {type: 'sliderValue', title:'角度', default: 0, range:[-360, 360] },
                        zoomRatio: {type: 'sliderValue', title:'相机缩放', default: 10, range:[0, 100] },
                        tweenMode: {type: 'toggleGroup', title: '动画模式', chooses:['变化到目标值','变化多少值'], default: 0},
                        justChange: {type: 'toggleGroup', title: '其它自定义切换', chooses:['无','层级','显隐', '宽', '高','自定义标签'], default: 0},
                        justChangeValue: {type: 'sliderValue', title: '自定义切换的值', default: 0},
                        dontTween: {type: 'toggleGroup', title: '不播放动画，直接修改属性', chooses:['否','是'], default: 0},
                        cancelEvent:{type: 'toggleGroup', title:'是否取消其它触摸事件监听',chooses:['是','否'], default: 0},
                        cancelOtherTween:{type: 'toggleGroup', title:'是否取消其它数值动画的播放',chooses:['否','是'], default: 0},
                        tipsInfo1:{type: 'tipsInfo', title: '数值说明', default: '除x、y、angle、opacity、外其余参数在运行时均x0.1'},
                        tipsInfo2:{type: 'tipsInfo', title: '参数说明', default: '如果设置的是照相机，只有zoomRatio、x、y字段会生效，如果设置的是物体，zoomRatio不生效'}
                    }
        },
        bezierCurve:{
            key: 'bezierCurve',
            baseType:'objects',
            inputSolt: {
                number1: {index: 0, type: 'number', info: '播放'},
                resetT: {index: 0, type: 'number', info: '重置位置'},
            },
            outputSolt:{
                number1: {index: 0, type: 'number', info: '结束'},
            },
            cardexSolt:{index: 0, type: 'number', info: '关联实体'},
            otherConfig:{
                points:{type: 'config', title: '曲线控制点', default: [0,0 , 100,100 , 200,0], canAdd: true},
                startT:  {type: 'sliderValue', title: '起始位置（百分比）', default: 0, range: [0, 100]},
                endT:  {type: 'sliderValue', title: '终点位置（百分比）', default: 100, range: [0, 100]},
                aniType: {type: 'toggleGroup', title: '播放类型', chooses:['随步长','随时间','随长度'], default: 0},
                duration: {type: 'sliderValue', title: '动画时长（随时间）', default: 10, range: [0, 300]},
                oneStep: {type: 'sliderValue', title: '动画步长（随步长）', default: 1, range: [0, 100]},   //输入1时表示一次增加百分之一
                lookUp: {type: 'toggleGroup', title: '角度跟随路径', chooses:['否','是'], default: 0},
                startResetT: {type: 'toggleGroup', title: '随时间开始运行时重置', chooses:['是','否'], default: 0},
                // points:{type: 'config', title: '曲线控制点', default: [0,0 , 100,100 , 200,0], canAdd: true},
                tipsInfo1:{type: 'tipsInfo', title: '播放类型说明', default: '【随步长】输入一次根据步长增加移动位置的百分比，不停的输入直至移动到终点位置\n【随时间】输入后自动根据时间从起始位置运行到终点位置\n 【随长度】根据输入的数值移动对应长度'},
            }
        },
        connection:  {key: 'connection',
                        baseType:'objects',
                        defaultSize: [280,280],
                        inputSolt: {
                            number1: {index: 0, type: 'robot', info: '放置'},
                        },
                        cardacSolt:{index: 0, type: 'number', info: '关联父物体'},
                        cardexSolt:{index: 0, type: 'number', info: '关联子物体'},
                        outputSolt:{
                            
                        },
                        otherConfig:{
                            tipsInfo1:{type: 'tipsInfo', title: '关联方式', default: '右上端关联父物体，左下端关联子物体'},
                        }
        }, 
        layoutEx:{
                key: 'layoutEx',
                baseType:'objects',
                inputSolt: {
                    
                },
                cardexSolt:{index: 0, type: 'number', info: '关联实体'},
                inputSolt:{
                    number1: {index: 0, type: 'robot', info: '放置'},
                    number2: {index: 1, type: 'number', info: '取出'}
                },
                outputSolt:{
                    robot1: {index: 0, type: 'robot', info: '物体'},
                    robot2: {index: 1, type: 'robot', info: '物体'},
                },
                otherConfig:{
                    girdWidth: {type: 'sliderValue', title:'格子长度', default: 100, range:[1, 2580]},
                    girdHeight: {type: 'sliderValue', title:'格子高度', default: 100, range:[1, 2580]},
                    rowNums: {type: 'sliderValue', title:'行数', default: 1, range:[1, 100]},
                    columnNums: {type: 'sliderValue', title:'列数', default: 1, range:[1, 100]},
                    dir:{type: 'toggleGroup', title: '排列方向', chooses:['右上','左下','右下','左上'], default: 0},
                    xOrY:{type: 'toggleGroup', title: '排列顺序', chooses:['X轴优先','Y轴优先'], default: 0},
                    sizeMode: {type: 'toggleGroup', title: '尺寸适应', chooses:['固定尺寸数量','扩展列数','扩展行数'], default: 0},
                    showMode: {type: 'toggleGroup', title: '扩展显示模式', chooses:['无','超出部分隐藏','尺寸自适应'], default: 0},
                    canEmpty: {type: 'toggleGroup', title: '是否可以空置', chooses:['否','是'], default: 0},
                    canDragChangePos: {type: 'toggleGroup', title: '是否可以调整位置', chooses:['否','是'], default: 0},
                    dragInputAni: {type: 'toggleGroup', title: '放置是否有动画', chooses:['否','是'], default: 1},
                    layoutAni: {type: 'toggleGroup', title: '取出是否有动画', chooses:['否','是'], default: 1},
                    aniType: {type: 'toggleGroup', title: '放置位移动画时长', chooses:['固定时间','固定速度'], default: 0},
                    speed: {type: 'sliderValue', title:'动画速度或时长', default: 5},
                    cellGoodCount: {type: 'sliderValue', title:'格子能放的物品数量', default: 1},
                    tipsInfo1:{type: 'tipsInfo', title: '关联方式', default: '右上端关联父物体，接收输入放置和取出的robot，会自动排列当前容器内的物品'},
                }
        },
        girdMap:{
                key: 'girdMap',
                baseType:'objects',
                defaultSize: [306,485],
                inputSolt: {
                    
                },
                cardexSolt:{index: 0, type: 'number', info: '关联实体'},
                inputSolt:{
                    number1: {index: 0, type: 'robot', info: '放置'},
                    number2: {index: 1, type: 'number', info: '导出'},
                },
                outputSolt:{
                    robot1: {index: 0, type: 'robot', info: '选中物体'},
                    robot2: {index: 1, type: 'robot', info: '取消选中物体'},
                    robot3: {index: 2, type: 'robot', info: '点击物体'},
                    exportData: {index: 3, type: 'object', info: '导出数据'},
                },
                otherConfig:{
                    canEdit: {type: 'toggleGroup', title: '是否进入编辑模式', chooses:['否','是'], default: 0},
                    unlockGirdTypes: {type: 'array', title: '地图内哪些类型的格子解锁了', default: []},
                    mapGirds: {type: 'array', title: '地图内格子类型配置', default: []},
                    mapGoods: {type: 'array', title: '地图内已有物件配置', default: []},
                    girdWidth: {type: 'sliderValue', title:'单个格子长度', default: 100, range:[1, 2580]},
                    girdHeight: {type: 'sliderValue', title:'单个格子高度', default: 100, range:[1, 2580]},
                    columnNums: {type: 'sliderValue', title:'地图x轴长度', default: 1, range:[1, 1000]},
                    rowNums: {type: 'sliderValue', title:'地图y轴长度', default: 1, range:[1, 1000]},
                    yScale: {type: 'sliderValue', title:'地图y轴压缩', default:  0.628, range:[0, 1]},
                    xRotation: {type: 'sliderValue', title:'2.5D效果旋转角度', default: 45, range:[0, 180]},
                    tipsInfo1:{type: 'tipsInfo', title: '输出说明', default:'【进入编辑模式】选择地图上任意物体时会触发【选中物体】，如果已经选择了物体又选择另一个物体，会先触发【取消选中物体】，或者点击空白地方也会触发【取消选中物体】\n未进入编辑模式，点击地图上有物体的格子会触发【点击物体】'},
                }
        },
        scrollRect:{
                key: 'scrollRect',
                baseType:'objects',
                inputSolt: {
                    
                },
                cardexSolt:{index: 0, type: 'number', info: '关联实体'},
                cardacSolt:{index: 0, type: 'number', info: '关联子物体'},
                inputSolt:{
                    // number1: {index: 0, type: 'robot', info: '放置'},
                },
                outputSolt:{
                    // robot1: {index: 0, type: 'robot', info: '选中物体'},
                    // robot2: {index: 1, type: 'robot', info: '取消选中物体'},
                },
                otherConfig:{

                    width: {type: 'sliderValue', title:'视图的宽度', default: 800, range:[1, 9999]},
                    height: {type: 'sliderValue', title:'视图的高度', default: 250, range:[1, 9999]},

                    xScroll:{type: 'toggleGroup', title:'x轴是否滚动', chooses: ['是','否'], default: 0},
                    yScroll:{type: 'toggleGroup', title:'y轴是否滚动', chooses: ['是','否'], default: 0},
                    mask:{type: 'toggleGroup', title:'超出视图范围是否隐藏', chooses: ['是','否'], default: 0},

                    cancelInnerEvents:{type: 'toggleGroup', title:'滚动时是否取消子节点上注册的触摸事件', chooses: ['是','否'], default: 0},
                    inertia:{type: 'toggleGroup', title:'是否开启滚动惯性', chooses: ['是','否'], default: 0},
                    elastic:{type: 'toggleGroup', title:'是否允许滚动内容超过边界，并在停止触摸后回弹', chooses: ['是','否'], default: 0},
                }
        },
        createObject: {
                    key: 'createObject',
                    baseType:'objects',
                    cantValueArr: true,
                    inputSolt: {
                        number1: {index: 0, type: 'number', info: '创建'},
                        number2: {index: 1, type: 'number', info: '触发'},
                    },
                    cardacSolt:{index: 0, type: 'number', info: '关联指令'},
                    cardexSolt:{index: 0, type: 'number', info: '关联指令'},
                    outputSolt:{
                        robot1: {index: 0, type: 'robot', info: '被引用'},
                        number2: {index: 1, type: 'number', info: '输出'},
                    },
                    otherConfig:{
                        group: {type: 'toggleGroup', title: '渲染模式', chooses:['默认','UI'], default: 0},
                        customeName: {type: 'stringValue', title: '加载显示内容', default: "资源名称"},
                        modal:{type: 'toggleGroup', title:'物体类型', chooses: ['空','图片','绘制','spine','文本'], default: 0},
                        showTime:{type: 'toggleGroup', title: '加载时机', chooses:['初始化时','输入时'], default: 0},
                        premulAlpha: {type: 'toggleGroup', title: '是否预乘', chooses:['否','是'], default: 0},
                        zIndex:{type: 'sliderValue', title:'层级',  default: 1},
                        dynamiczIndex: {type: 'toggleGroup', title: '根据y轴坐标动态更新层级', chooses:['否','是'], default: 0},
                        x:{type: 'sliderValue', title:'坐标-x', default: 0 },
                        y:{type: 'sliderValue', title:'坐标-y', default: 0 },
                        scaleX:{type: 'sliderValue', title:'缩放-x', default: 10, range:[0, 100] },
                        scaleY:{type: 'sliderValue', title:'缩放-y', default: 10, range:[0, 100] },
                        opacity:{type: 'sliderValue', title:'透明度', default: 255, range:[0, 255] },
                        angle: {type: 'sliderValue', title:'角度', default: 0, range:[-360, 360] },
                        anchorX: {type: 'sliderValue', title:'锚点x', default: 5, range:[0, 10] },
                        anchorY: {type: 'sliderValue', title:'锚点y', default: 5, range:[0, 10] },
                        width: {type: 'sliderValue', title:'宽度', default: 50 },
                        height: {type: 'sliderValue', title:'高度', default: 50 },
                        color: {type: 'colorValue', title: '物体颜色', default: "ffffff"},
                        string: {type: 'stringValue', title:'显示文本（包括以下设置类型为文本时生效）', default: ""},
                        outLineWidth: {type: 'sliderValue', title:'描边宽度', default: 0, range:[0, 100] },
                        outLineColor: {type: 'colorValue', title:'描边颜色', default: "ffffff"},
                        colliderValue: {type: 'colliderValue', single: true, title:'设置碰撞框', default: {}},
                        tipsInfo1:{type: 'tipsInfo', title: '引用说明', default:'输入【触发】时先执行【被引用】，然后执行【输出】，这样输出的时候如果要传递其它参数，引用物体一定是绑定好该物体的'},
                        tipsInfo2:{type: 'tipsInfo', title: '锚点说明', default:'锚点为0时在最（左）下端，为10时在最（右）上端，如果被【自动布局】关联，则物体的锚点会被其操控，一般用于文字排列的对齐'}
                    }
                }, 
        space:{
                    key: 'space',
                    baseType:'objects',
                    defaultSize: [1350,950],
                    positionFixed: false,   //位置是否固定在界面上
                    //上193 下8 左35.21 右35.21
                    //想起来了，这里设置的是卡片大小，然后卡片节点要看whitenode
                    // [1125.72, 635.71]
                    changeSize:[[313.2,507.7],[1196.12,835],[1350,950],[1030,740],[1350,740],[1030,950]],
                    single: true,
                    cardacSolt:{index: 0, type: 'number', info: '关联指令'},
                    inputSolt: {
                        
                    },
                    outputSolt:{
                       
                    },
                },
        camera:{
                key: 'camera',
                baseType:'objects',
                single: true,
                color: '#3F42EA',
                inputSolt: {
                },
                cardacSolt:{index: 0, type: 'number', info: '关联指令'},
                outputSolt:{
                
                },
                otherConfig:{
                    x:{type: 'sliderValue', title:'坐标-x', default: 0 },
                    y:{type: 'sliderValue', title:'坐标-y', default: 0 },
                    offsetx:{type: 'sliderValue', title:'以space为原点偏移-x', default: 0 },
                    offsety:{type: 'sliderValue', title:'以space为原点偏移-y', default: 0 },
                    zoomRatio:{type: 'sliderValue', title:'视图缩放', default: 10, range:[0, 100]},
                    tipsInfo1:{type: 'tipsInfo', title: '参数说明', default: 'x0.1才是真实的缩放比例， offsetx， offsetx为程序预留字段，无需手动修改'}
                }
        },
        position:{key: 'position',
                    baseType:'objects',
                    subType: 'objectSensor',
                    iconOffset: {x: 0, y: -40},
                    inputSolt: {
                        number1: {index: 0, type: 'number', info: '触发'},
                        x: {index: 1, type: 'number', info: '修改x'},
                        y: {index: 2, type: 'number', info: '修改y'},

                    },
                    cardexSolt:{index: 0, type: 'number', info: '关联指令'},
                    outputSolt:{
                        x: {index: 0, type: 'number', info: 'x坐标'},
                        y: {index: 1, type: 'number', info: 'y坐标'},
                    },
                    otherConfig:{
                        xRange:{type: 'rangeValue', title: 'x范围', default: [-999999,999999]},
                        yRange:{type: 'rangeValue', title: 'y范围', default: [-999999,999999]},
                        rangeWithSize:{type: 'toggleGroup', title: '范围限制包含节点尺寸', chooses: ['否','是'], default: 0},
                        consoleInfo:{type: 'toggleGroup', title:'打印坐标信息', chooses: ['否','是'], default: 0},
                        modal:{type: 'toggleGroup', title:'修改方式', chooses: ['直接修改','增量修改'], default: 0},
                        tipsInfo1:{type: 'tipsInfo', title: '修改方式参数说明', default: '直接修改：直接设置值为输入数值，增量修改：在原始数值上加减数值'},
                        tipsInfo2:{type: 'tipsInfo', title: '输入输出说明', default: '触发表示就算位置没有变化也触发一次输出逻辑，输入x、y表示设置坐标，输出x、y表示监听到坐标变化触发，这两个接口不能头尾相连，会死循环！'}
                    }
        },
        contact: {
                key: 'contact',
                baseType:'objects',
                subType: 'objectSensor',
                iconOffset: {x: 0, y: -40},
                inputSolt: {
                    number1: {index: 0, type: 'number', info: '触发'},
                },
                cardexSolt:{index: 0, type: 'number', info: '触发检测对象'},
                cardacSolt:{index: 0, type: 'number', info: '等待检测对象'},
                outputSolt:{
                    number1: {index: 0, type: 'number', info: '是否接触'},
                    robot1: {index: 1, type: 'robot', info: '接触对象'},
                },
                otherConfig:{
                    modal:{type: 'toggleGroup', title:'输出模式', chooses: ['一直输出','仅触发时输出'], default: 0},
                }
        },
        angle:{key: 'angle',
                    baseType:'objects',
                    subType: 'objectSensor',
                    iconOffset: {x: 0, y: -40},
                    inputSolt: {
                        number1: {index: 0, type: 'number', info: '触发'},
                        angle: {index: 1, type: 'number', info: '修改'},
                    },
                    cardexSolt:{index: 0, type: 'number', info: '关联指令'},
                    outputSolt:{
                        angle: {index: 0, type: 'number', info: '角度'},
                    },
                    otherConfig:{
                        angleRange:{type: 'rangeValue', title: '角度范围', default: [-999999,999999]},
                        consoleInfo:{type: 'toggleGroup', title:'打印角度信息', chooses: ['否','是'], default: 0},
                        modal:{type: 'toggleGroup', title:'修改方式', chooses: ['直接修改','增量修改'], default: 0},
                        tipsInfo1:{type: 'tipsInfo', title: '修改方式参数说明', default: '直接修改：直接设置值为输入数值，增量修改：在原始数值上加减数值'},
                        tipsInfo2:{type: 'tipsInfo', title: '输入输出说明', default: '触发表示就算角度没有变化也触发一次输出逻辑，输入表示设置角度，输出角度表示监听到角度变化触发，这两个接口不能头尾相连，会死循环！'}
                    }
        },
        speed:{key: 'speed',
                        baseType:'objects',
                        subType: 'objectSensor',
                        iconOffset: {x: 0, y: -40},
                        inputSolt: {
                            number1: {index: 0, type: 'number', info: '触发'},
                            number2: {index: 1, type: 'number', info: '修改'},
                        },
                        cardexSolt:{index: 0, type: 'number', info: '关联指令'},
                        outputSolt:{
                            number1: {index: 0, type: 'number', info: '监听'},
                        },
                        otherConfig:{
                            customKey:{type: 'toggleGroup', title:'监听信息', chooses: ['透明度','层级','缩放X','缩放Y','长度','高度','显隐'], choosesKey: ['opacity', 'zIndex','scaleX','scaleY','width','height','active'], default: 0},
                            range:{type: 'rangeValue', title: '范围', default: [-999999,999999]},
                            consoleInfo:{type: 'toggleGroup', title:'打印信息', chooses: ['否','是'], default: 0},
                            modal:{type: 'toggleGroup', title:'修改方式', chooses: ['直接修改','增量修改'], default: 0},
                            tipsInfo1:{type: 'tipsInfo', title: '修改方式参数说明', default: '直接修改：直接设置值为输入数值，增量修改：在原始数值上加减数值'},
                            tipsInfo2:{type: 'tipsInfo', title: '输入输出说明', default: '触发表示就算角度没有变化也触发一次输出逻辑，输入表示设置角度，输出角度表示监听到角度变化触发，这两个接口不能头尾相连，会死循环！'}
                        }
                },
        endGame:{
                    key: 'endGame',
                    baseType:'output',
                    inputSolt: {
                        number1: {index: 0, type: 'number', info: '结束'},
                    },
                    outputSolt:{
                    
                    },
                },
        showHandTip:{
                    key: 'showHandTip',
                    baseType:'output',
                    inputSolt: {
                        number1: {index: 0, type: 'number', info: '显示'},
                        number2: {index: 1, type: 'number', info: '关闭'},
                    },
                    cardexSolt:{index: 0, type: 'number', info: '关联指令'},
                    outputSolt:{
                        number1: {index: 0, type: 'number', info: '结束'},
                    },
                    //在创建此指令时自动创建另一个指令
                    createEx:[{key: 'createObject', link: {self: 'cardexSolt', other: 'cardacSolt'}, otherConfig: {customeName: 'P0_Common_Finger', modal: 3, premulAlpha: 1, zIndex: 9999}}],
                    otherConfig:{
                        modal:{type: 'toggleGroup', title:'类型', chooses: ['单次点击','快速点击','拖拽','上下滑动','左右滑动','转圈','长按'], default: 0},
                        scale:{type: 'sliderValue', title:'大小', default: 10 },

                        tipsInfo1:{type: 'tipsInfo', title: '当模式为拖拽时设置参数', default: ''},
                        x:{type: 'sliderValue', title:'拖拽终点-x', default: 0 },
                        y:{type: 'sliderValue', title:'拖拽终点-y', default: 0 },

                        tipsInfo2:{type: 'tipsInfo', title: '当模式为上下滑动或左右滑动或转圈设置参数', default: ''},
                        length:{type: 'sliderValue', title:'长度或半径', default: 100 },
                        speed:{type: 'sliderValue', title:'速度', default: 400 },

                        tipsInfo4:{type: 'tipsInfo', title: '其它说明', default: '创建该指令时会自动创建一个引导显示对象并关联，显示状态下一个提示循环结束时会输出1'},
                    }
        },
        blockTouch:{
            key: 'blockTouch',
            baseType:'output',
            cantValueArr: true,
            single: true,   //只能有一个
            inputSolt: {
                number1: {index: 0, type: 'number', info: '开启'},
                number2: {index: 1, type: 'number', info: '关闭'},
            },
            outputSolt:{
                
            },
            otherConfig:{
                tipsInfo2:{type: 'tipsInfo', title: '输入说明', default: '输入为0时不触发任何操作，开启输入时，阻挡空间内的元素触发触摸事件，关闭输入时，空间内的元素可以触发触摸事件'}
            }
        },
        restartGame:{
                    key: 'restartGame',
                    baseType:'output',
                    inputSolt: {
                        number1: {index: 0, type: 'number', info: '重启'},
                    },
                    outputSolt:{
                    
                    },
                },
        changeGame:{
                    key: 'changeGame',
                    baseType:'output',
                    inputSolt: {
                        number1: {index: 0, type: 'number', info: '切换'},
                    },
                    outputSolt:{
                        
                    },
                    otherConfig:{
                        gamePath: {type: 'stringValue', title: '切换的另一个json配置的名称，仅限同一bundle下的配置', default: ""},
                        pageIndex: {type: 'sliderValue', title: '如果当前打开绘本，则切换当前绘本另一页', default: 0},
                    }
                },
        screenSize:{
            key: 'screenSize',
            baseType:'data',
            inputSolt: {
                number1: {index: 0, type: 'number', info: '触发'},
            },
            outputSolt:{
                number1: {index: 0, type: 'number', info: '4:3'},
                number2: {index: 1, type: 'number', info: '16:9'},
                number3: {index: 2, type: 'number', info: '18:9'},
            },
        },
        systemData:{
            key: 'systemData',
            baseType:'data',
            inputSolt: {
                number1: {index: 0, type: 'number', info: '获取'},
            },
            outputSolt:{
                number1: {index: 0, type: 'number', info: '值'},
            },
            otherConfig:{//cc.sys.os
                modal:{type: 'toggleGroup', title:'类型', chooses: ['时间戳-秒','年:月:日','时:分:秒','时:分','系统','版本','配置表','Object','Array','空间宽度', '空间高度','空间X轴范围','空间Y轴范围'], default: 0},
                fileName:{type: 'stringValue', title: '配置表名称（仅类型为「配置表」时生效）', default: ""},
                tipsInfo1:{type: 'tipsInfo', title: '空间X/Y轴范围', default: '输出空间的x轴范围，是一个数组，如[-1280,1280]，表示该空间最左侧x坐标为-1280，最右侧坐标为1280'},
            }
        },
        setData:{
            key: 'setData',
            baseType:'data',
            inputSolt: {
                number1: {index: 0, type: 'number', info: 'value'},
                saveKey: {index: 0, type: 'value', info: 'saveKey'}
            },
            outputSolt:{
                // number1: {index: 0, type: 'number', info: ''},
            },
            otherConfig:{//
                tipsInfo1:{type: 'tipsInfo', title: '传入参数说明', default: '传入saveKey时不保存，只更新saveKey，传入value时保存'},
                saveKey:{type: 'stringValue', title: '保存数据的key', default: "defaultKey"},
            }
        },
        
        //查询是否有值
        //增（index || key，value）
        //删（index || key） 
        //查(value, key || index) 
        //改（index || key，value）
        
        //数组拼接，object组合，
        
        //push()
        //delete()
        //

        handData:{
            key: 'handData',
            baseType:'data',
            inputSolt: {
                keyOrIndex: {index: 0, type: 'number', info: 'key'},
                value: {index: 1, type: 'number', info: 'value'},
                number1: {index: 2, type: 'number', info: '触发'}
            },
            cardexSolt:{index: 0, type: 'number', info: '关联数据'},
            outputSolt:{
                number1: {index: 0, type: 'number', info: '结果'},
                number2: {index: 1, type: 'number', info: '原始数据'},
            },
            otherConfig:{//
                keyOrIndex: {type: 'stringValue', title: '字符标记或数组下标（从1开始）', default: ""},
                value: {type: 'stringValue', title: '值', default: ""},
                modal:{type: 'toggleGroup', title:'操作类型', chooses: ['增加','删除','查询','修改','数量','取值'], default: 0},
                tipsInfo0:{type: 'tipsInfo', title: '【触发】', default: '输出关联的数据结构的原始数据，同时其它操作成功了也会输出原始数据'},
                tipsInfo1:{type: 'tipsInfo', title: '当类型为数组时的传值，key为数组下标', default: '只有有效操作才会输出【增加】value必传，key选传，不传时增加到数组最后面，操作成功输出1\n【删除】key必传，value选传，传值时为删除数量，操作成功输出1 \n【查询】value必传，key不传，查询到值输出顺序从1开始，未查询到输出0\n【修改】key必传，value必传，修改成功输出1\n【数量】传任意一个触发，输出数组长度\n【取值】key必传，value不传，输出对应key的值'},
                tipsInfo2:{type: 'tipsInfo', title: '当类型为object时的传值', default: '【增加】value必传，key必传\n【删除】key必传，value不传\n【查询】value必传，key不传，查询到了传key，查询不到传0\n【修改】key必传，value必传，修改成功输出1\n【数量】传任意一个触发，输出Object长度\n【取值】key必传，value不传，输出对应key的值'},
            }
        },
        customData:{
            key: 'customData',
            baseType:'data',
            inputSolt: {
                number1: {index: 0, type: 'number', info: '获取'},
            },
            outputSolt:{
                number1: {index: 0, type: 'number', info: '输出'},
            },
            otherConfig:{//
                saveKey:{type: 'stringValue', title: '保存数据的key', default: "defaultKey"},
                ifEmpty:{type: 'toggleGroup', title:'如果值为空的话', chooses: ['输出0','不输出'], default: 0},
            }
        },
        userData:{
            key: 'userData',
            baseType:'data',
            inputSolt: {
                number1: {index: 0, type: 'number', info: '获取'},
            },
            outputSolt:{
                number1: {index: 0, type: 'number', info: '输出'},
            },
            otherConfig:{//
                saveKey:{type: 'stringValue', title: '玩家数据的key', default: "defaultKey"},
            }
        },
        addBagGood:{
            key: 'addBagGood',
            baseType:'data',
            inputSolt: {
                number1: {index: 0, type: 'number', info: '执行'},
            },
            outputSolt:{
                number: {index: 0, type: 'number', info: '结果'},
            },
            otherConfig:{
                goodId: {type: 'stringValue', title: '物品id', default: ""},
                count:{type: 'sliderValue', title:'数量', default: 1 },
                isReset:{type: 'toggleGroup', title:'是否重置', chooses: ['否','是'], default: 0},
                tipsInfo0:{type: 'tipsInfo', title: '说明', default: '数量填0则返回物品数量，如果【是否重置】选中为是，则直接修改物品数量，而不是增加'},
            }
        },
        useBagGood:{
            key: 'useBagGood',
            baseType:'data',
            inputSolt: {
                number1: {index: 0, type: 'number', info: '执行'},
            },
            outputSolt:{
                number: {index: 0, type: 'number', info: '结果'},
            },
            otherConfig:{
                goodId: {type: 'stringValue', title: '物品id', default: ""},
                count:{type: 'sliderValue', title:'数量', default: 1 },
            }
        },
        //特殊配制，编辑器设置
        CodePanelSetting: {
            key: 'CodePanelSetting',
            baseType:'menu',
            cantValueArr: true,
            otherConfig:{
                showBigIcon:{type: 'toggleGroup', title:'图标大小', chooses: ['大','小'], default: 0},
                showGreenLine:{type: 'toggleGroup', title: '显示绿线', chooses: ['显示', '不显示'], default: 0},
                showFps:{type: 'toggleGroup', title: '显示帧率', chooses: ['显示', '不显示'], default: 1},
                mouseScale: {type: 'sliderValue', title: '鼠标滚轮缩放灵敏度', default: 10, range: [1, 1000]}
            }
        }
}

const zhString = {
    'input':'输入',
    'middle':'中间',
    'output':'输出',
    'objects':'物件',
    'data':'数据',
    'value':'常数',
    'valueString':'文字',
    'button':'按下按键',
    'screen':'触摸屏',
    'phoneSensor':'动作感应',
    'event': '游戏内的变化',
    'controll':'摇杆',
    'controllHorizontal':'摇杆前后',
    'customButton':'自定义按键',
    'touchStart':'触摸开始',
    'touchMove': '触摸移动',
    'touchEnd': '触摸结束',
    'leftOrRightAct': '重力感应',
    'forwardOrbackAct':'前后倾斜',
    'shakeAct':'摇晃',
    'rotationAct':'转动',
    'gameStart':'开始时',
    'objectDestroy':'物体损坏时',
    'calculate':'计算',
    'covert': '转换',
    'angleCalculate':'角度计算',
    'compare':'比较',
    'inRange': '范围内',
    'logic':'逻辑',
    'change':'变化',
    'tool':'工具',
    'mapping':'映射',
    'toint':'取整数',
    'squareRoot':'平方根',
    'abs':'绝对值',
    'revertNegative':'正负反转',
    'dataObject': '数据结构',
    'getKeyValue': '数据取值',
    'angleDifference':'角度差',
    'vectorToAngel':'将位置转换为角度',
    'angleConvertVector':'将角度转换为位置',
    'allRight':'且',
    'orRight':'或',
    'notRight':'非',    //输入值为0时，输出1，输出值为0之外的值时，输出0
    'checkTag':'标记状态',
    'upCount': '计数',
    'timeDown': '倒计时',
    'randomNum': '随机数',
    'sendData':'无线传送发射',
    'acceptData':'无线传送接收',
    'writeNote':'个人备忘录',
    'exportObject':'引用物体',
    'media':'播放媒体',
    'time':'时间控制',
    'game':'游戏控制',
    'other': '其它',
    'bgm': '背景音',
    'sound': '播放音频',
    'vibrate':'震动',
    'stopTime':'停止时间',
    'timeScale':'时间缩放',
    'restartGame':'重新开始',
    'endGame':'游戏结束',
    'changeGame':'切换游戏',
    'showTextTip':'文字提示',
    'consoleInfo':'输出控制台',
    'showConfirm':'确认框',
    'showHandTip':'触摸提示',
    'blockTouch':'屏蔽触摸',
    'sprite':'绘制图片',
    'animate':'骨骼动画',
    'animates':'动画',
    'tween':'数值动画',
    'bezierCurve':'路径动画',
    'powerOfGod':'神秘力量',
    'objectSensor':'传感器',
    'space':'空间',
    'camera':'照相机',
    'createObject':'物体',
    'destroyObject':'销毁物体',
    'sendObject':'传送物体',
    'gravity':'引力',
    'contact':'接触感应器',
    'destroy':'销毁感应器',
    'position':'位置感应器',
    'speed':'其它感应器',
    'acceleration':'加速度感应器',
    'angle':'角度感应器',
    'angleSpeed':'角速度感应器',
    'connection': '连接零件',
    'layoutEx': '自动布局',
    'girdMap': '格子地图',
    'scrollRect':'滚动视图',
    'group': '物体成组',
    'getData':'获取数据',
    'setData':'记录数据',
    'controllData':'修改数据',
    'handData':'操作数据',
    'bagControll':'背包',
    'friend':'朋友',
    'systemData':'系统数据',
    'screenSize':'屏幕适配',
    'customData':'自定义数据',
    'userData':'玩家数据',
    'addBagGood':'添加物品',
    'useBagGood':'使用物品',
    'getFriend':'获取好友',
    'add': '加',
    'del': '减',
    'x': '乘',
    'chu': '除',
    'length': "长度",
    'equire': '等于',
    'litter': '小于',
    'bigger': '大于',
    'menu':'菜单',
    'startBtn':'运行',
    'previewBtn':'预览',
    'importBtn':'导入',
    'exportBtn':'导出到缓存',
    'downloadBtn':'下载到本地',
    'freshBtn': '刷新',
    'closeViewBtn': '关闭',
    'bigIcon':'大icon显示',
    'hideLine': '隐藏绿线',
    'debugMode': '预览Debug模式 OFF',
    'recordMode': 'recordMode',
    'clearBtn': '删除缓存',
    'showFps': 'showFps',
    'setting': '设置',
    'customComponent': '脚本组件',
    'inputArr': '输入扩展',
    'outputArr': '输出扩展',
    'outputLine': '输出逻辑线',
    'linkArr': '关联扩展',
    'lighting': '动态赋值',
    'lightingOut': '动态取值',
    'textCode': 'js文本'
}

const SubType = {
    input: {
        'value': ['value'],
        'valueString': ['valueString'],
        "gameStart": ["gameStart"],
        "button": ['controll','customButton'],
        "screen": ['touchStart','touchMove','touchEnd'],
        "leftOrRightAct": ["leftOrRightAct"]
        // "phoneSensor": ['leftOrRightAct','shakeAct','rotationAct']
        //"event": ['gameStart','objectDestroy']
    },
    middle: {
        'tool': ['sendData', 'acceptData', 'writeNote','exportObject','inputArr','outputArr','linkArr','lighting','lightingOut', 'outputLine', 'textCode'],
        'calculate': ['add','del','x','chu','length'],
        'covert':['mapping','toint','squareRoot','abs','revertNegative','dataObject', 'getKeyValue'],
        'angleCalculate': ['angleDifference','vectorToAngel', 'angleConvertVector'],
        'compare': ['equire','litter','bigger','inRange'],
        'logic': ['allRight', 'orRight','notRight'],
        'change': ['checkTag', 'upCount', 'timeDown', 'randomNum']
    },
    output: {
        'customComponent': ['MotionText','CaiDanComponent','CaiDanComponent2','SpinePlusComponent','ProgressCompoment','AngleCompoment','ScaleObj', 'AutoTips', 'ChatComponent','AnyMask','DynamicTexture','cc.Mask','InGirdMapAI','DrawComponent','VoiceCheck'],
        'sound': ['sound'],
        'vibrate': ['vibrate'],
        'time': ['stopTime','timeScale'],
        'game': ['restartGame', 'endGame', 'changeGame'],
        'other': ['showTextTip', 'showHandTip', 'blockTouch','showConfirm','consoleInfo']
    },
    objects: {
        'createObject': ['createObject'],
        'animates': ['animate','tween', 'bezierCurve'],
        'sprite': ['sprite'],
        // 'destroyObject': ['destroyObject'],
        'objectSensor': ['contact','destroy','position','speed','angle'],
        'group': ['connection','layoutEx','girdMap','scrollRect'],
        'space': ['space'],
        'camera': ['camera']
    },
    data: {
        'getData':['systemData','customData','userData','screenSize'],
        'controllData':['setData','handData'],
        'bagControll':['addBagGood','useBagGood'],
        // 'friend': ['getFriend']
    },
    menu: {
        'closeViewBtn':['closeViewBtn'],
        'startBtn':['startBtn'],
        'previewBtn':['previewBtn'],
        'importBtn':['importBtn'],
        'exportBtn':['exportBtn'],
        'downloadBtn':['downloadBtn'],
        'freshBtn':['freshBtn'],
        'clearBtn': ['clearBtn'],
        'setting': ['setting'],
        'debugMode':['debugMode'],
        'recordMode':['recordMode']
    }
}

var checkTreeDifBefore = (tree1, tree2)=>{
    var forMin = Math.min(tree1.length, tree2.length)
    var curIndex = forMin
    for(var i = 0; i < forMin; i++){
        if(tree1[i] != tree2[i]){
            curIndex = i
            break
        }
    }
    return curIndex
}

var getValueByKeyArr = (obj, keyArr)=>{
    if(keyArr.length == 0){return null}
    var curObj = obj
    for(var i = 0; i < keyArr.length; i++){
        if(curObj[keyArr[i]] != null){
            curObj = curObj[keyArr[i]]
            // console.log('curObj', curObj)
        }else{
            curObj = null
            break
        }
    }
    if(curObj == null){
        return
    }
    if(curObj instanceof Array == true){
        return curObj
    }else{
        return Object.keys(curObj)
    }
}

var clone = (obj)=> {
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

var robotsToJson = (robots)=>{
    var json = []
    var space = null
    for(var i = 0; i < robots.length; i++){
        var robot = robots[i]
        if(robot.config.key == 'space'){
            space = robot
            break
        }
    }

    for(var i = 0; i < robots.length; i++){
        var robot = robots[i]
        var obj = {config:{key: robot.config.key, otherConfig: {}},  linkDatas: {}, nodeValue:{}, id: robot.id }
        var node = robot.instance.node
        obj.nodeValue = {x: Math.round(node.x) , y: Math.round(node.y), width: Math.round(node.width), height: Math.round(node.height)}
        if(robot.instance.lock == true){
            obj.nodeValue.lock = true
        }

        if(robot.config.curValueArr != null && robot.config.curValueArr.length > 0){
            //导出数组otherConfig的数组形式
            obj.config.curValueArr = robot.config.curValueArr
        }

        for(var key in robot.config.otherConfig){
            if(robot.config.otherConfig[key].type != 'tipsInfo'){//提示语就不要导入到json里去了
                obj.config.otherConfig[key] = robot.config.otherConfig[key].default
            }
        }
        if(obj.config.key == 'camera'){
            if(space != null){
                var whiteNode = space.instance.node.getChildByName('space').getChildByName('whiteNode')
                var worldPos = whiteNode.parent.convertToWorldSpaceAR(whiteNode.position)
                var nodePos = space.instance.node.parent.convertToNodeSpaceAR(worldPos)
                
                obj.config.otherConfig['offsetx'] = nodePos.x
                obj.config.otherConfig['offsety'] = nodePos.y
            }
        }

        if(obj.config.key == 'writeNote'){
            if(obj.config.otherConfig['modal'] != 0){
                obj.inblockRobots = []
                for(var z = 0; z < robot.findCards.length; z++){
                    if(robot.findCards[z].node.active == true){
                        obj.inblockRobots.push(robot.findCards[z].robot.id)
                    }
                }
            }
        }


        // (x - offsetx) * 2 = realX
        // (node.x - space.instance.node.x) * 2 = realX
        // / 2 - node.x = newoffsex

        for(var key in robot.linkDatas){
            var linkData = robot.linkDatas[key]
            if(linkData instanceof Array == true){
                obj.linkDatas[key] = []
                for(var j = 0; j < linkData.length; j++){
                    obj.linkDatas[key].push({solt: linkData[j].solt, robot: linkData[j].robot.id, otherSolt: linkData[j].otherSolt})
                }
            }else{
                obj.linkDatas[key] = {}
                for(var key2 in robot.config[key]){ //改成按照outputSolt中的key的顺序倒出
                    var subLinkDataArr = linkData[key2]
                    obj.linkDatas[key][key2] = []
                    for(var j = 0; j < subLinkDataArr.length; j++){
                        obj.linkDatas[key][key2].push({solt: subLinkDataArr[j].solt, sort: subLinkDataArr[j].sort, robot: subLinkDataArr[j].robot.id, otherSolt: subLinkDataArr[j].otherSolt})
                    }
                }
            }
        }
        json.push(obj)
    }
    // console.log("robotsToJson", json)
    // cc.sys.localStorage.setItem('robotsToJson', JSON.stringify(json));
    return json
}

var jsonToWorkSpace = (json, workSpace)=>{

}



var id = 0
var getID = ()=>{
    return id++
}

export default{
    BaseType,
    zhString,
    SubType,
    typeConfig,
    getValueByKeyArr,
    checkTreeDifBefore,
    zhilinConfig,
    clone,
    getID,
    robotsToJson,
    jsonToWorkSpace,
    lightColor
}