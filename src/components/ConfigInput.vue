<!-- 这是一个用于聚合所有输入类元素的组件，输入指定的config配置项目，生成对应的输入元素，并在修改时发送修改后的config值 -->
<template>
    <a-flex :vertical='vertical' :gap='gap' :style="{'margin-left': this.marginLeft}" >
        <template v-for="(rowConfig, key) in values" :key="key">
            <template v-if="((vertical == true && rowConfig.inBottom) || (vertical == false && rowConfig.inBottom == null)) && (hideChildKeys == null || hideChildKeys.indexOf(rowConfig.key) == -1)">
                <a-flex align="center" :gap='gap' :style="{width: width ? width : ''}">
                    <div v-if="rowConfig.title != null" style="margin-right: 5px; flex-shrink: 0;">{{ rowConfig.title }}</div>
                    <a-tooltip placement="topLeft">
                        <template #title v-if="rowConfig.des != null">{{ rowConfig.des }}</template>
                            <a-time-picker v-if="rowConfig.type == 'oneTimePicker'" v-model:value="rowConfig.value" :format="rowConfig.format" :valueFormat="rowConfig.format"  @change="onChangeTimePicker($event, rowConfig)"/>
                            <a-time-range-picker v-if="rowConfig.type == 'TimePicker'" v-model:value="rowConfig.value" :format="rowConfig.format" :valueFormat="rowConfig.format" @change="onChangeTimePicker($event, rowConfig)"/>
                            <a-range-picker v-if="rowConfig.type == 'DatePicker'" v-model:value="rowConfig.value" valueFormat="YYYY-MM-DD"  :presets="rowConfig.presets" @change="onChangeDataPicker($event, rowConfig)"/>
                            <a-date-picker size="small"  v-if="rowConfig.type == 'OneDatePicker'" v-model:value="rowConfig.value" :valueFormat="rowConfig.valueFormat ? rowConfig.valueFormat : 'YYYY-MM-DD'" :picker="rowConfig.picker != null ? rowConfig.picker : 'date'" :show-time="rowConfig.showTime || false" :disabledDate="rowConfig.disabledDate" :disabled="rowConfig.disabled"  @change="onChangeOneDataPicker($event, rowConfig)" />
                            <a-input-number size="small" v-if="rowConfig.type == 'number'"  v-model:value="rowConfig.value" :style="{width: rowConfig.width ? rowConfig.width : '80px'}" :min="rowConfig.min" :max="rowConfig.max" :addon-before="rowConfig.before" :addon-after="rowConfig.after" :formatter="rowConfig.formatter" :parser="rowConfig.parser" :step="rowConfig.step" :disabled="rowConfig.disabled" @change="onNumberInputChange($event, rowConfig)"></a-input-number>
                            <a-input size="small" v-if="rowConfig.type == 'input'" :placeholder="rowConfig.des"  :style="{width: rowConfig.width ? rowConfig.width : '120px'}" style="flex-grow: 1;" :bordered="rowConfig.bordered != null ? rowConfig.bordered : true"  v-model:value="rowConfig.value" @change="onInputChange($event, rowConfig)" />
                            <a-textarea v-if="rowConfig.type == 'inputArea'" v-model:value="rowConfig.value" :placeholder="rowConfig.placeholder" :rows="rowConfig.rows ? rowConfig.rows : 4" />
                            <a-auto-complete size="small" v-if="rowConfig.type == 'autoInput'" v-model:value="rowConfig.value" :options="rowConfig.options" :filter-option="filterOption" :style="{width: rowConfig.width ? rowConfig.width : '120px'}" style="flex-grow: 1;"/>   
                            <a-select size="small" v-if="rowConfig.type == 'select'"  v-model:value="rowConfig.value" :style="{width: rowConfig.width ? rowConfig.width : '130px'}" :mode="rowConfig.mode" :maxTagCount="rowConfig.maxTagCount" :options="rowConfig.options" @change="onChangeSelectPicker($event, rowConfig)"></a-select>
                            <a-radio-group v-if="rowConfig.type == 'radio'" v-model:value="rowConfig.value" :options="rowConfig.options" optionType='button' buttonStyle='solid' @change="onRadioGroupChang($event, rowConfig)">
                                <!-- <a-radio-button v-for="item in rowConfig.options" :value="item.value">{{item.label}}</a-radio-button> -->
                            </a-radio-group>
                            <a-checkbox-group v-if="rowConfig.type == 'checkboxGroup'" v-model:value="rowConfig.value" :options="rowConfig.options" />
                            <a-switch v-if="rowConfig.type == 'bool'" v-model:checked="rowConfig.value" @change="onSwitchChange($event, rowConfig)"/>
                    </a-tooltip>
                    <a-button v-if="rowConfig.isPath == true" @click="onClickChoosePath(e, rowConfig)">选择目录</a-button>
                </a-flex>
                <ConfigValues v-if="rowConfig.type == 'values'" :showChildScore="rowConfig.showChildScore" :hideChildKeys="rowConfig.hideChildKeys" :configList="rowConfig.value" @onChange="onRuleChange($event, rowConfig)"></ConfigValues>
            </template>
        </template>
    </a-flex>
</template>
   
<script>
import { choosePath } from '@/ElectronTool'

  
  export default {
    name: 'ConfigInput',
    props:{
        marginLeft: {type: String, default:'10px', required: false},
        width:{type: String, required: false},
        gap:{type: String, default: 'small', required: false},
        values:{type: Array, required: false},
        vertical:{type: Boolean, required: false},
        hideChildKeys: {type: Array, default: [], required: false},
        // showChildScore: {type: Boolean, default: false, required: false},
    },
    data() {
      return {
        dataSource: [],
      }
    },
    methods: {
        checkCanShow(rowConfig){
            if(this.vertical == true){
                //垂直排列，只显示垂直排列的
                if(rowConfig.inBottom == true){
                    return true
                }else{
                    return false
                }
            }else{
                //水平排列只显示水平排列的
                if(rowConfig.inBottom == true){
                    return false
                }else{
                    return true
                }
            }
        },
        handleSearch(value, spe){
            if(value == '' || value == null){
                this.dataSource = []
                return 
            }
            if(Number(value) >= 0){
                if(value.length < 3){
                    this.dataSource = []
                    return
                }
            }
            
            return this.dataSource
            // console.log('dataSource', this.dataSource)
        },
        onNumberInputChange(e, rowConfig){
            // console.log("onNumberInputChange values", this.values)
            this.$emit('onChange',  rowConfig.key)
        },
        onInputChange(e, rowConfig){    
            // console.log('onQueryConfigInput', e)
            //传送数据事件不能和内部兼听的事件重名
            // console.log("onInputChange values", this.values)
            this.$emit('onChange',  rowConfig.key)
        },
        onChangeSelectPicker(e, rowConfig){
            // console.log("onChangeSelectPicker values", this.values)
            this.$emit('onChange',  rowConfig.key)
        },
        onRadioGroupChang(e, rowConfig){
            this.$emit('onChange',  rowConfig.key)
        },
        onChangeOneDataPicker(e, rowConfig){
            this.$emit('onChange',  rowConfig.key)
        },
        onChangeDataPicker(e, rowConfig){
            this.$emit('onChange',  rowConfig.key)
        },
        onChangeTimePicker(e, rowConfig){
            this.$emit('onChange',  rowConfig.key)
        },
        onRuleChange(e, rowConfig){
            // console.log("configInput 收到了 ConfigValues 的数据修改", e)
            rowConfig.value = e
            this.$emit('onChange',  rowConfig.key)
        },
        //点击选择目录按钮
        onClickChoosePath(e, rowConfig){
            // console.log('window.electronAPI', window.electronAPI)
            var folderPath = choosePath()
            if(folderPath != null){
                rowConfig.value = folderPath
                this.$emit('onChange',  rowConfig.key)
            }
        },
        //switch组件切换时通知
        onSwitchChange(e, rowConfig){
            // console.log("onSwitchChange", e, rowConfig)
            this.$emit('onChange',  rowConfig.key)
        },
        filterOption(input, option){
            return option.value.indexOf(input) != -1
        }
    }
  }
  </script>
   
  <style scoped>
 
  </style>