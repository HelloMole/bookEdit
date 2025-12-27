<!-- 这是一个用于聚合所有输入类元素的组件，输入指定的config配置项目，生成对应的输入元素，并在修改时发送修改后的config值 -->
<template>
    <div style="width: 100%; height: 100%;">
        <div id="wavesurferParent" style="width: 100%;"></div>
        <a-flex vertical gap="small" style="margin-top: 10px;">
            <!-- :title="'字幕' + (textIndex + 1)" -->
            <a-card v-for="(item, textIndex) in dataSource" size="small" >
                <template #title>
                    <a-flex gap="small" style="margin-right: 10px;">
                        <a-button danger @click="onClickDelOneText(textIndex)">删除字幕</a-button>
                        <a-input v-model:value="item.text" placeholder="输入字幕内容" />
                    </a-flex>
                </template>
                <template #extra>
                    <a-flex gap="small">
                        <div style="max-width: 300px;  overflow: scroll;">
                            <a-radio-group v-model:value="item.curTimeIndex" @change="onPosChange(item)"  button-style="solid" style="width: max-content;">
                                <a-radio-button v-for="(value, index) in item.times" :value="index" >{{ index + 1 }}</a-radio-button>
                            </a-radio-group>
                        </div>
                        <a-button @click="onClickAddTimePos(item)">打点</a-button>
                        <a-button @click="onClickResetTimePos(item)">修改</a-button>
                        <a-button danger @click="onClickDeleteTimePos(item)">删除选中时间点</a-button>
                    </a-flex>
                </template>
                <a-flex  gap="small" vertical >
                    <a-flex >
                        <div v-element-size="(e)=>{item.width = e.width}" style="font-size:20px; color:#4D96FD;">{{item.text}}</div>
                    </a-flex>
                    <div style="position: absolute; overflow: hidden;" :style="{width: (item.width * item.curProgress * 0.01) + 'px'}">
                        <div style="font-size: 20px; color:#FDA54D; width: 999px;">{{item.text}}</div>
                    </div>
                    <a-slider id="test" :style="{width: item.width + 'px'}" v-model:value="item.curProgress" :step="0.01" :tipFormatter="null"/>
                </a-flex>
            </a-card>
            <a-flex v-if="wsArr.length > 0" gap="small" wrap="wrap" style="margin-top: 10px;">
                <template v-for="item,index in wsArr">
                    <a-tag v-if="item.cw != null" style="cursor: pointer; margin-right: 0;" @click="onClickCwTag(index)" @mouseenter="onTouchCwTag(index)" @mouseleave="onLeaveCwTag(index)">{{ item.cw[0].w }}</a-tag>
                    <icon-oblique-line v-if="item.isSplit || index == curTouchCwIndex" @click="onClickDelSplite(index)" style="cursor: pointer; color:#4D96FD; font-size: 22; stroke-linecap: round; stroke-linejoin: miter-clip; stroke-width: 5;"/>
                </template>
                <a-button  type="primary" style="margin-left: 20px;" @click="onClickWsToText">生成字幕</a-button>
            </a-flex>
            <a-flex gap="small" style="margin-top: 10px;">
                <a-button type="primary" @click="onClickPlayOrPause">播放/暂停</a-button>
                <a-button type="primary" @click="onClickAddOneText">增加一行字幕</a-button>
                <div style="height: 1px; flex-grow: 1;"></div>
                <a-button type="primary" :loading="inLoading" @click="onClickAuto">自动识别</a-button>
                <a-button type="primary" @click="onClickPreview">预览</a-button>
                <a-button type="primary" @click="onClickSave">保存</a-button>
            </a-flex>
        </a-flex>
    </div>
</template>
   
<script>
    import VoiceCheck from '@/xfyun/VoiceCheck';
    import WaveSurfer from 'wavesurfer.js'
    import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'

    export default {
        name: 'SoundTextEdit',
        props:{
            // marginLeft: {type: String, default:'10px', required: false},
            // width:{type: String, required: false},
            // values:{type: Array, required: false},
            // vertical:{type: Boolean, required: false},
            // hideChildKeys: {type: Array, default: [], required: false},

            audioUrl:{type: String, required: true},
            config: {type: Object, required: false},
            // colliderValue: {type: Object, default: {}, required: false},
            // showChildScore: {type: Boolean, default: false, required: false},
        },
        data() {
            return {
                //{text: '', position: [], times: [], width: 0, curProgress: 0, curTimeIndex: 0}
                inLoading: false,
                dataSource: [],
                wsArr: [],
                curTouchCwIndex: -1
            }
        },
        mounted () {
            console.log('初始化时的配置', this.config)
            this.dataSource = this.config
            this.wavesurfer = WaveSurfer.create({
                container: document.getElementById('wavesurferParent'),
                waveColor: 'rgb(77, 150, 253)',
                progressColor: 'rgb(253, 165, 77)',
                url: this.audioUrl,
                audioRate: 1, // set the initial playback rate
                // mediaControls: true,
                plugins: [
                    Hover.create({
                        lineColor: '#ff0000',
                        lineWidth: 2,
                        labelBackground: '#555',
                        labelColor: '#fff',
                        labelSize: '11px',
                        labelPreferLeft: false,
                        formatTimeCallback: (seconds)=>{
                            // console.log('formatTimeCallback', seconds)
                            return seconds.toFixed(3) + 's'
                        }
                    })
                ]
            })
            
        },
        unmounted(){
            
        },
        methods: {
            //switch组件切换时通知
            // onSwitchChange(e, rowConfig){
            //     // console.log("onSwitchChange", e, rowConfig)
            //     this.$emit('onChange',  rowConfig.key)
            // },

            onClickPlayOrPause(){
                if(this.wavesurfer != null){
                    this.wavesurfer.playPause()
                }
            },

            startRun(){
                cc.Tween.stopAllByTarget(this.node.children[0])
            },

            //自动生成配音
            onClickAuto(){
                this.inLoading = true
                VoiceCheck.startTestByUrl(this.audioUrl, (wsArr)=>{
                    this.inLoading = false
                    console.log('我获取到了字幕结果', wsArr)
                    this.wsArr = wsArr
                })
            },

            ///如果当前播放了字幕，是否也要重新播放字幕？
            //点击预览字幕
            onClickPreview(){
                if(this.wavesurfer != null){
                    this.wavesurfer.stop()
                    setTimeout(() => {
                        this.wavesurfer.play()
                    }, 10);
                }     
                let runText = (oneText)=>{
                    // console.log('开始运行时间点', oneText)
                    // cc.Tween.stopAllByTarget(oneText)
                    var time = oneText.times[oneText.curTimeIndex] - oneText.times[oneText.curTimeIndex - 1]
                    let progress = oneText.position[oneText.curTimeIndex]
                    let delayTime = 0
                    if(oneText.curTimeIndex == 1){
                        //第一个时间其实是等待时间
                        delayTime = oneText.times[0]
                    }
                    // console.log(oneText.text,'curProgress', progress, 'time', time)
                    cc.tween(oneText).delay(delayTime).to(time, {'curProgress': progress}).call(()=>{
                        if(oneText.position[oneText.curTimeIndex + 1] != null){
                            oneText.curTimeIndex += 1
                            runText(oneText)
                        }
                    }).start()
                }
                for(var i = 0; i < this.dataSource.length; i++){
                    let oneText2 = this.dataSource[i]
                    if(oneText2.times.length > 1){
                        oneText2.curTimeIndex = 1
                        oneText2.curProgress = oneText2.position[0]
                        //至少要有两个时间点才可以运行
                        runText(oneText2)
                    }
                }
            },

            //增加一段字幕
            onClickAddOneText(){
                // dataSource: [{text: '', position: [], times: [], width: 0, curProgress: 0, curTimeIndex: 0}],
                this.dataSource.push({text: '', position: [], times: [], width: 0, curProgress: 0, curTimeIndex: 0})
            },

            //删除一段字幕
            onClickDelOneText(index){
                // console.log('我应该删除字幕', index)
                this.dataSource.splice(index, 1)
            },

            //增加了时间点
            onClickAddTimePos(item){
                item.times.push(this.wavesurfer.getCurrentTime())
                item.position.push(item.curProgress)
                item.curTimeIndex = item.times.length - 1
                // console.log('增加了时间', this.wavesurfer.getCurrentTime())
            },

            //点击修改时间点
            onClickResetTimePos(item){
                if(item.times[item.curTimeIndex] == null){
                    return
                }
                item.times[item.curTimeIndex] = this.wavesurfer.getCurrentTime()
                item.position[item.curTimeIndex] = item.curProgress
            },

            //点击删除时间点
            onClickDeleteTimePos(item){
                if(item.times[item.curTimeIndex] == null){
                    return
                }
                item.times.splice(item.curTimeIndex, 1)
                item.position.splice(item.curTimeIndex, 1)
                let upIndex = item.curTimeIndex - 1
                if(upIndex < 0){
                    upIndex = 0
                }
                item.curTimeIndex = upIndex
                this.onPosChange(item)
            },

            //选择了一个时间点
            onPosChange(item){
                let time = item.times[item.curTimeIndex]
                let pos = item.position[item.curTimeIndex]
                if(item.times[item.curTimeIndex] == null){
                    //删除到最后一个时为空
                    time = 0
                    pos = 0
                }
                if(this.wavesurfer != null){
                    this.wavesurfer.setTime(time)
                }
                console.log('设置了时间', time)
                item.curProgress = pos
            },
            
            // onTextSizeChange(e, item){
            //     if(e == null){
            //         return
            //     }
            //     console.log('onTextSizeChange', e)
            //     if(item != null){
            //         item.width = e.width
            //     }
            // }

            onClickCwTag(index){
                // console.log('onClickCwTag ' + index)
                //生成分词
                if(this.wsArr[index + 1] != null){
                    if(this.wsArr[index + 1].isSplit ){
                        return
                    }
                }else{
                    return
                }
                this.wsArr.splice(index + 1, 0, {isSplit: true})
                this.curTouchCwIndex = -1
            },


            //点击删除节点
            onClickDelSplite(index){
                this.wsArr.splice(index, 1)
            },


            onTouchCwTag(index){
                // console.log('onTouchCwTag ' + index)
                if(this.wsArr[index + 1] != null){
                    if(this.wsArr[index + 1].isSplit ){
                        this.curTouchCwIndex = -1
                    }else{
                        this.curTouchCwIndex = index
                    }
                }else{
                     this.curTouchCwIndex = -1
                    // this.curTouchCwIndex = index
                }
            },

            onLeaveCwTag(index){
                 this.curTouchCwIndex = -1
            },

            //将ws转换为字幕
            onClickWsToText(){
                //先构造每一行的文本，再构造每一行的文本过渡时间
                this.dataSource.push({text: '', position: [], times: [], width: 0, curProgress: 0, curTimeIndex: 0})
                for(var i = 0; i < this.wsArr.length; i++){
                    let oneCw = this.wsArr[i]
                    if(oneCw.isSplit == true){
                        this.dataSource.push({text: '', position: [], times: [], width: 0, curProgress: 0, curTimeIndex: 0})
                    }else{
                        let oneTextLine = this.dataSource[this.dataSource.length - 1]
                        oneTextLine.text += oneCw.cw[0].w
                    }
                }
                let curIndex = 0
                let curText = ''
                for(var i = 0; i < this.wsArr.length; i++){
                    let oneCw = this.wsArr[i]
                    let oneTextLine = this.dataSource[curIndex]
                    if(oneCw.isSplit == true){
                        //百分比位置设置为结束
                        oneTextLine.position.push(100)
                        if(this.wsArr[i + 1] != null){
                            //设置到下一段时间
                            oneTextLine.times.push(this.wsArr[i + 1].bg / 100)
                        }else{
                            //设置到音频结束的时间
                            oneTextLine.times.push(this.wavesurfer.getDuration())
                        }
                        curIndex += 1
                        curText = ''
                    }else{
                        oneTextLine.position.push(curText.length / oneTextLine.text.length * 100)
                        curText += oneCw.cw[0].w
                        oneTextLine.times.push(oneCw.bg / 100)
                    }
                }
                //如果最后没有为1，还是需要手动加
                let oneTextLine = this.dataSource[curIndex]
                if(oneTextLine.position[oneTextLine.position.length - 1] != 100){
                    oneTextLine.position.push(100)
                    oneTextLine.times.push(this.wavesurfer.getDuration())
                }
            },

            //点击保存时间点
            onClickSave(){
                // console.log('this.dataSource', this.dataSource)
                this.$emit('onChange',  this.dataSource)
            }
        }
    }
  </script>
   
  <style scoped>
 
  </style>