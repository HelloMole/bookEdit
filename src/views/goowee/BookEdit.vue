<!-- 条件选股，循环股票市场所有股票，找出相应k线图 -->
<template>
  <a-config-provider :locale="locale" component-size="small">
  <div class="about">

    <!-- <Component is="DownloadOutlined" /> -->
    <!-- <a-menu v-model:selectedKeys=
     、currentSelectMenu" mode="horizontal" :items="menuItems" /> -->

    <!-- <h1>This is an about page</h1> -->
    <!-- <div>{{ currentSelectMenu[0] }}</div> -->

    <a-tabs id="tabHtml" v-show="curOpenLayout[4] == 1" :tabBarStyle="{'margin-bottom':'0px'}" style="user-select: none;" v-model:activeKey="tabActiveKey" type="editable-card" @edit="onEdit" size="small" :hideAdd="true">
      <template #rightExtra>
        <a-flex gap="small" align="center" style="margin-right: 10px;">
          <a-button   type="primary" @click="onClickPublishBtn(tabActiveKey)">
            <template #icon>
              <CloudUploadOutlined />
            </template>
            发布
          </a-button>
          <a-button   type="primary" @click="onClickSaveBtn(tabActiveKey)">
                <template #icon>
              <SaveOutlined />
            </template>
            保存
          </a-button>
          <a-button-group v-if="tabActiveKey != 0" compact>
            <a-button :type="curOpenLayout[0] ? 'primary' : 'default'" @click="onClickChangeShowView(0)">
                <template #icon><SettingOutlined /></template>
            </a-button>
            <a-button :type="curOpenLayout[1] ? 'primary' : 'default'" @click="onClickChangeShowView(1)">
                <template #icon><PictureOutlined /></template>
            </a-button>
            <a-button :type="curOpenLayout[2] ? 'primary' : 'default'" @click="onClickChangeShowView(2)">
                <template #icon><UnorderedListOutlined /></template>
            </a-button>
            <a-button :type="curOpenLayout[3] ? 'primary' : 'default'" >
                <template #icon><NodeIndexOutlined /></template>
            </a-button>
            <a-button :type="curOpenLayout[4] ? 'primary' : 'default'" @click="onClickChangeShowView(4)">
                <template #icon><UpCircleOutlined /></template>
            </a-button>
            
            <!-- <a-button :type="curOpenLayout[1] ? 'primary' : 'default'" @click="()=>{curOpenLayout[1] = !curOpenLayout[1]}">
                <template #icon><FunctionOutlined /></template>
            </a-button>
            <a-button :type="curOpenLayout[2] ? 'primary' : 'default'" @click="()=>{curOpenLayout[2] = !curOpenLayout[2]}">
                <template #icon><PieChartOutlined /></template>
            </a-button>
            <a-button :type="curOpenLayout[3] ? 'primary' : 'default'" @click="()=>{curOpenLayout[3] = !curOpenLayout[3]}">
                <template #icon><LineChartOutlined /></template>
            </a-button> -->
          </a-button-group>
          <a-switch size='default' style="height: 100%;" v-model:checked="isOpenDark"  v-on:change="onHandDarkMode">
              <template #checkedChildren><Component is="BulbFilled"/></template>
              <template #unCheckedChildren><Component is="BulbOutlined"/></template>
          </a-switch>
        </a-flex>
      </template>
      <a-tab-pane v-for="pane in menuItems" :key="pane.key" :tab="pane.title" :closable="pane.closable">
        <!-- {{pane.label }} -->
        <!-- <template v-if="pane.key == 0">
        </template> -->
      </a-tab-pane>
    </a-tabs>
    <div></div>
    <!--  -->
    <!-- <template> -->
      <div v-if="tabActiveKey == 0">
        <a-flex  gap="5"  style="padding: 5px;">
              <!-- <a-input-group v-if="currentSelectMenu[0] == 1" compact style="width: auto;">
                <a-input v-model:value="inputModelName" style="width: 250px"  addon-before="新建绘本" placeholder="输入绘本编号"/>
                <a-input v-model:value="inputModelDes" style="width: 500px"  placeholder="输入绘本显示名称"/>
                
              </a-input-group> -->
              
              <a-popconfirm v-if="currentSelectMenu[0] == 1" title="新建一个绘本" @confirm="onBtnCreateModel(null, this.newProjectName)">
                <template #description>
                  <a-input v-model:value="newProjectName" addon-before="绘本编号" placeholder="请输入新绘本编号" style="margin-bottom: 5px;"/>
                  <a-input v-model:value="inputModelDes"  addon-before="绘本备注" placeholder="输入绘本备注"/>
                </template>
                <a-button type="primary">新建绘本</a-button>
              </a-popconfirm>
              <!-- <a-button type="primary"  v-on:click="onBtnCreateModel(null, this.newProjectName)">新建绘本</a-button> -->
              <a-button type="primary" v-if="currentSelectMenu[0] == 1" @click="onBtnImportOldVersion">
                导入旧版绘本
                <!-- <input type="file" @change="onBtnImportOldVersion" ref="modelImport" accept=".txt,.json" -->
                <!-- style="opacity:0; font-size: 30px; width: 100%; position: absolute;  top: 0; left: 0"> -->
              </a-button>
              <a-button type="primary" v-if="currentSelectMenu[0] == 1">
                导入绘本配置
                <input type="file" @change="onBtnImportExcelConfig" ref="modelImport" accept=".xlsx"
                style="opacity:0; font-size: 30px; width: 100%; position: absolute;  top: 0; left: 0">
              </a-button>
              <!-- <div style="margin-left: 30px;">筛选：</div> -->
              <!-- <ConfigInput :values="searchConfig" :vertical="false" marginLeft="100px" @onChange="onsearchConfigChange"/> -->
              <div style="flex-grow: 1;"></div>
              <!-- <a-button type="primary" v-if="currentSelectMenu[0] == 1" @click="jumpTo('RuleRealRun')">
                策略实盘
              </a-button>-->
              <!-- <a-button type="primary" @click="publishTableData">发布</a-button>
              <a-button type="primary" @click="saveTableData">保存</a-button> -->
              <a-popconfirm v-if="currentSelectMenu[0] == 1" title="系统设置" placement="bottomRight" @confirm="onSaveSetting">
                <template #description>
                  <ConfigInput :values="systemSetting" :vertical="true" marginLeft="0px"/> 
                </template>
                <a-button type="primary">系统设置</a-button>
              </a-popconfirm>
        </a-flex>
        <VueDraggable v-if="currentSelectMenu[0] == 1" v-model="modelTableDatas" target=".ant-table-tbody"  draggable=".ant-table-row" :sort="true" :animation="150" @onUpdate="onUpdate" @end="onEnd">
          <a-table :columns="modelTableColumns" :data-source="modelTableDatas" size="small" bordered :pagination="false" rowKey="name" :scroll="{y: screenHeight - 88}">
          <!-- <template #headerCell="{ column }">
            <template v-if="column.key === 'name'">
              <span>
                模型Nmae
              </span>
            </template>
          </template> -->
          <!-- 自定义表格筛选 -->
          <template #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
            <a-flex vertical style="padding: 8px" gap="small" >
              <a-input
                ref="searchInput"
                placeholder="搜索名称或编号"
                :value="selectedKeys[0]"
                style="width: 188px; margin-bottom: 8px; display: block"
                @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
              />
              <a-select size="small" :value="selectedKeys" placeholder="筛选分组" :style="{width: '100%'}" mode="tags" :maxTagCount="1" :options="bookGroupBySearch" @change="e => setSelectedKeys(e)"></a-select>
              <div>
                <a-button
                  type="primary"
                  size="small"
                  style="width: 90px; margin-right: 8px"
                  @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
                >
                  <template #icon><SearchOutlined /></template>
                  搜索
                </a-button>
                <a-button size="small" style="width: 90px" @click="handleReset(clearFilters)">
                  重置
                </a-button>
              </div>
            </a-flex>
          </template>
          <template #customFilterIcon="{ filtered }">
            <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }" />
          </template>
          <template   #bodyCell="{ column, record }">
              <template v-if="column.key === 'des'">
                <a-flex gap="small">
                    <div>{{record.des}}</div>
                    <div style="flex-grow: 1;"></div>
                    <a-popconfirm v-if="currentSelectMenu[0] == 1" title="修改绘本备注" @confirm="onBtnEditProjectDes(record.name)">
                      <template #description>
                        <a-input v-model:value="inputModelDes"  addon-before="绘本备注" placeholder="请输入绘本备注" style="width: 500px;"/>
                      </template>
                      <a-button type="text">
                          <EditOutlined />
                        </a-button>
                    </a-popconfirm>
                    <!-- <a-button>修改</a-button> -->
                </a-flex>
              </template>
              <template v-if="column.key === 'action'">
                <a-flex gap="small" align="center" justify="center" style="overflow: scroll;">
                  <a-button  size="small" type="primary" v-on:click="onBtnLoadModel(record.name)">编辑</a-button>
                  <a-button  size="small" type="default" v-on:click="onBtnExportModel(record.name)">
                    <DownloadOutlined />
                  </a-button>
                  <a-popconfirm title="复制绘本" placement="bottomRight" @confirm="onBtnCopyModel(record.name)">
                    <template #description>
                      <a-input v-model:value="newProjectName" placeholder="请输入新绘本编号" />
                    </template>
                    <a-button>
                      <CopyOutlined />
                    </a-button>
                  </a-popconfirm>
                  <!-- <a-button  size="small" v-on:click="onBtnCopyModel(record.name)">复制</a-button> -->
                  <a-popconfirm title="删除警告" placement="bottomRight">
                    <template #description>
                      <div style="width: 200px;">确定要删除绘本：{{ record.name }}?</div>
                      <div v-if="record.config != null" style="width: 200px;">《{{record.config.name}}》</div>
                      <div style="position: relative; right:0px; color:#FF4D50">此操作不可撤销，需校验权限</div>
                      <!-- <VerificationCode @emailCode="emailCode"></VerificationCode> -->
                      <!-- <van-password-input :value="verificationCode"  :focused="showKeyboard" @focus="showKeyboard = true" :mask="false" style="width: 300px;" info="输入操作权限验证码"/> -->
                      <!-- <van-number-keyboard v-model:value="verificationCode" :show="showKeyboard" @blur="showKeyboard = false"/> -->
                      <arco-verification-code v-model="verificationCode"   :formatter="(inputValue) =>  /^\d*$/.test(inputValue) ? inputValue : false"/>
                    </template>
                    <template #okButton>
                      <a-button danger @click="onBtnDeleteModel(record.name)">
                      确定
                    </a-button>
                    </template>
                    <a-button type="text" danger shape="circle"  >
                      <DeleteOutlined />
                    </a-button>
                  </a-popconfirm>
                </a-flex>
              </template>
              <template v-if="column.key === 'publishTime'">
                {{formatTime(record.publishTime)}}
              </template>
              <template v-if="column.key === 'name'">
                <a-flex gap="small">
                  <a-button type="link" @click="onBtnLoadModel(record.name)">{{ record.name }}</a-button>
                  <div style="flex-grow: 1;"></div>
                  <a-popconfirm title="重命名绘本编号" @confirm="onBtnRenameProject(record.name)">
                      <template #description>
                        <a-input v-model:value="newProjectName" placeholder="请输入新绘本编号" />
                      </template>
                      <a-button type="text">
                        <EditOutlined />
                      </a-button>
                    </a-popconfirm>
                </a-flex>
              </template>
              <template v-if="column.key === 'showName'">
                <a-flex gap="small">
                <div>{{ record.config ? (record.config.name ? record.config.name : '' ) : '' }}</div>
                <div style="flex-grow: 1;"></div>
                <a-popconfirm title="修改绘本配置" placement="right" @confirm="onConfigChangeSave(record)">
                    <template #description>
                      <a-flex align="center" justify="center" style=" width: 100%;">
                        <a-upload-dragger  name="file"  style="padding: 0px;  margin-bottom: 5px;" :multiple="false" @change="handleChangeCover" :customRequest="handleUploadCover" @drop="handleDropCover">
                          <div style="width: 100px; height: 130px;  border-radius: 12%; position: relative;">
                            <img style="width: 100%; height: 100%; object-fit:cover; position: absolute; top: 0; left: 0;" :src="getCoverUrl(record)"></img>
                          </div>
                        </a-upload-dragger>
                      </a-flex>
                      <!-- <div>

                      </div> -->
                      <!-- <div style=" width: 100px; height: 130px; top: 0%; left: 0%; display: flex; justify-content: center; align-items: center; ">
                          <div v-if="record.img != null" style="position: relative; width: 100%; height: 100%;  overflow: hidden;">
                              <img style="width: 100%; height: 100%; object-fit:contain; position: absolute; top: 0; left: 0;" :src="getCoverUrl(record)"></img>
                          </div>
                          <a-tag v-else style="margin-right: 0px;" :color="record.modal == '文本' ? 'purple' : 'blue'">{{record.modal == '文本' ? (record.customeName.length > 8 ? record.customeName.substring(0, 8) + '...' : record.customeName) : record.modal }}</a-tag>
                      </div> -->
                      <ConfigInput :values="huiceConfig" :vertical="true" marginLeft="0px"/>
                    </template>
                    <a-button @click="onClickTableConfig(record)">
                      <SettingOutlined />
                    </a-button>
                </a-popconfirm>
                </a-flex>
              </template>
          </template>
          </a-table>
        </VueDraggable>
      </div>
      <a-flex v-show="tabActiveKey != 0" gap="small" style="padding: 5px; overflow:auto;" :style="{height: workSpaceHeight}">
        <!-- policyList -->
        <div v-show="curOpenLayout[0] || curOpenLayout[1] || curOpenLayout[2]" id="leftFlexView" style="display: flex; flex-direction: column; gap: 5px;">
          <div id="huiceConfigCard" style="display: flex; flex-direction: column; gap: 5px;">
            <a-card v-if="curOpenLayout[0]" size="small" title="绘本配置" style="min-width: 332px; user-select: none;">
              <ConfigInput :values="huiceConfig" :vertical="true" marginLeft="0px" @onChange="onhuiceConfigChange"/>              
            </a-card>
            <TopFreeDrag v-show="curOpenLayout[1]" ref="previewParent" drageHandId="dragTitle" :enableDrag="cocosConfig.cocosPreviewCanDrag" :aspectRadio="cocosConfig.aspectRadio" :oriHeight='previewCardMinHeight' :localStorageDrag="true">
              <!-- 根据比例计算如果宽度为332，计算高度 (332 - 10) * (designViewHeight / designViewWidth) -->
              <UseElementSize style="width: 100%; height: 100%; " :style="{'min-width': previewCardMinWidth + 'px',  'min-height': previewCardMinHeight + 'px'}" v-slot="{width, height}">
                <!-- Width: {{ width }} Height: {{ height }} -->
                <a-card style="height: 100%;" :style="{'min-width': previewCardMinWidth + 'px',  'min-height': previewCardMinHeight + 'px'}" @click.stop="()=>{}" @mousemove.stop="()=>{}">
                    <template #title>
                      <div id="dragTitle" style="cursor:move;">分镜预览</div>
                    </template>
                    <template #extra>
                        <a-flex gap="small">
                          <!-- <a-button @click="onClickFreshPreview">刷新</a-button> -->
                          <!-- <a-button type="link" shape="circle" @click="onClickExpandPreview"> -->
                            <!-- <ExpandAltOutlined /> -->
                            <!-- <LockOutlined v-if="cocosConfig.radioLock" style="font-size:larger; color: #1568DD" @click="onClickTreePreview('radioLock')"/>
                            <UnlockOutlined v-else style="font-size:larger;" @click="onClickTreePreview('radioLock')"/> -->
                            <a-select v-if="cocosConfig.cocosPreviewCanDrag" size="small" optionLabelProp="value"  :dropdownMatchSelectWidth="150" v-model:value="cocosConfig.radio" :options="cocosConfig.radioOptions" @change="onChangeRadionPicker(cocosConfig.radio)"></a-select>
                            <a-tooltip>
                              <template #title>清空场景</template>
                              <ClearOutlined style="font-size:larger; color: #FF4D50" @click="onClickClearScene"/>
                            </a-tooltip>
                            <a-tooltip>
                              <template #title>激活摄像机预览</template>
                              <VideoCameraOutlined :style="{'color' : !cocosConfig.isPreviewMode ? '#1568DD' : ''}" style="font-size:larger;" @click="onClickTreePreview('isPreviewMode')" />
                            </a-tooltip>
                            <a-tooltip>
                              <template #title>显示安全框</template>
                              <NumberOutlined :style="{'color' : cocosConfig.cocosPreviewIsShowGird ? '#1568DD' : ''}" style="font-size:larger;"  @click="onClickTreePreview('cocosPreviewIsShowGird')" />
                            </a-tooltip>
                            <a-tooltip>
                              <template #title>显示节点树</template>
                              <DeploymentUnitOutlined :style="{'color' : cocosConfig.cocosPreviewIsShowTree ? '#1568DD' : ''}" style="font-size:large;" @click="onClickTreePreview('cocosPreviewIsShowTree')" />
                            </a-tooltip>
                            <a-tooltip>
                              <template #title>显示帧率信息</template>
                              <DashboardOutlined style="font-size:large;" :style="{'color' : cocosConfig.cocosPreviewIsShowState ? '#1568DD' : ''}"  @click="onClickTreePreview('cocosPreviewIsShowState')"/>
                            </a-tooltip>
                            <a-tooltip>
                              <template #title>显示碰撞框</template>
                              <GatewayOutlined style="font-size:large;" :style="{'color' : cocosConfig.cocosPreviewIsShowColiderBox ? '#1568DD' : ''}" @click="onClickTreePreview('cocosPreviewIsShowColiderBox')"/>
                            </a-tooltip>
                            <!-- #1677FF -->
                            <SoundFilled v-if="cocosConfig.mute == false" style="font-size:large; color:#1677FF; " @click="onClickTreePreview('mute')"/>
                            <SoundOutlined v-else style="font-size:large;"  @click="onClickTreePreview('mute')"/>
                            <!-- <SyncOutlined style="font-size:larger;" @click="onClickFreshPreview"/> -->
                            <FullscreenOutlined v-if="cocosConfig.cocosPreviewCanDrag == false" style="font-size: large;" @click="onClickTreePreview('cocosPreviewCanDrag')"/>
                            <FullscreenExitOutlined v-else style="font-size: large;" @click="onClickTreePreview('cocosPreviewCanDrag')"/>

                            <a-tooltip>
                              <template #title>在新窗口中预览</template>
                              <BlockOutlined style="font-size: large;" @click="onClickNewPreview"/>
                            </a-tooltip>
                            <!-- <CompressOutlined /> -->
                            <!-- FullscreenExitOutlined -->
                          <!-- </a-button> -->
                        </a-flex>
                    </template>
                    <div id="GameDiv" v-element-size="onPreviewSizeChange" style="position:absolute; user-select: none;" :style="{width: (width - 12) + 'px', height: (height - 50) + 'px'}">
                      <canvas id='GameCanvas' style="user-select: none;" :width="width - 12" :height="height - 50"></canvas>
                      <!-- <canvas id='SpineCanvas' :width="width - 12" :height="height - 50"></canvas> -->
                      <div v-if='cocosConfig.cocosPreviewIsShowGird' v-for="line in saveAreaLines" style="position:absolute; background-color: #FF4D50;" :style="{top: line.top + 'px', left: line.left + 'px', width: line.width, height: line.height}"></div>
                    </div>
                    <TopFreeDrag v-if="cocosConfig.cocosPreviewIsShowTree" :enableDrag="true" :oriWidth="229" disableWidth handPosOnLeft style="position: absolute; top: 0;" :style="{'left':  - cocosPreviewTreeWidth - 4 + 'px'}">
                        <UseElementSize :style="{'min-height': previewCardMinHeight + 'px'}" style="width: 100%; height: 100%;" v-slot="{width, height}">
                          <a-card  v-element-size="onPreviewTreeSizeChange" title="节点层级" >
                              <template #extra>
                                <a-flex gap="middle">
                                  <ExpandAltOutlined style="font-size:larger;" @click="onClickTreeExport"/>
                                  <CodeOutlined style="font-size:larger;"      @click="onClickConsoleSelect"/>
                                  <SyncOutlined style="font-size:larger;"      @click="onClickFreshPreview"/>
                                </a-flex>
                              </template>
                              <div style="overflow: scroll;" :style="{height: (height - 50) + 'px'}">
                                <a-tree :tree-data="cocosPreviewTreeData" v-model:expandedKeys="expandedKeys" :fieldNames="{title:'name', key:'id' }" @select="onSelectCocosNode"></a-tree>
                              </div>
                          </a-card>
                        </UseElementSize>
                    </TopFreeDrag>
                </a-card>
              </UseElementSize>
            </TopFreeDrag>
          </div>
          <a-card id="celueLiebiaoCard" class="widthAni" v-if="curOpenLayout[2]" :style="{'width': expandPolicyList ?  '700px' : '332px'}" size="small" title="分镜列表"  style="min-width: 332px; flex-grow: 1;  flex-shrink: 0; user-select: none;">
            <template #extra>
              <a-flex gap="small" align="center" justify="center">
                <!-- <a-tooltip v-if="expandPolicyList" placement="topLeft">
                  <template #title>列表折叠时显示哪一个绘本</template>
                    始终显示
                  <a-select size="small" v-model:value="policyShowKey" style="width: 130px;" :options="showByKeyOptions"></a-select>
                </a-tooltip>
                <a-tooltip v-if="expandPolicyList" placement="topLeft">
                  <template #title>以哪一个绘本进行排序</template>
                    排序
                  <a-select size="small" v-model:value="policySortKey" style="width: 130px;" :options="showByKeyOptions"></a-select>
                </a-tooltip> -->
                <!-- <a-button  type="primary" shape="circle" @click="()=>{policySortKeyIsDown = !policySortKeyIsDown}">
                  <SwapOutlined :rotate="90"/>
                </a-button> -->
                <a-popconfirm title="新建分镜" @confirm="onClickAddPolicy">
                  <template #description>
                    <a-input v-model:value="newPolicyName" placeholder="请输入分镜名称" />
                  </template>
                  <a-button type="primary" shape="circle">
                    <PlusOutlined />
                  </a-button>
                </a-popconfirm>

                <a-popconfirm title="复制当前选中分镜" @confirm="onClickCopyPolicy">
                  <template #description>
                    <div>复制到哪个绘本下：</div>
                    <a-select size="small" style="width: 100%; margin-bottom: 7px;"  v-model:value="copyToProject" :options="getProjectOptions()"></a-select>
                    <div>新的分镜名称：</div>
                    <a-input v-model:value="newPolicyName" placeholder="请输入新分镜名称" />
                  </template>
                  <a-button type="primary" ghost shape="circle">
                    <CopyOutlined />
                  </a-button>
                </a-popconfirm>

                <a-popconfirm title="确认删除当前选中的分镜吗？" @confirm="onClickDeletePolicy">
                  <template #description>
                    <div style="position: relative; right:0px; color:#FF4D50">此操作不可撤销，需校验权限</div>
                    <arco-verification-code v-model="verificationCode"   :formatter="(inputValue) =>  /^\d*$/.test(inputValue) ? inputValue : false"/>
                  </template>
                  <a-button type="primary" danger shape="circle"  >
                    <DeleteOutlined />
                  </a-button>
                </a-popconfirm>

                <!-- <a-popconfirm title="回测列表中所有分镜？" @confirm="onClickLoopAllPolicy">
                  <a-button  shape="circle"  >
                    <CaretRightOutlined />
                  </a-button>
                </a-popconfirm> -->

                <a-switch size="default" v-model:checked="expandPolicyList">
                  <template #checkedChildren><MenuOutlined /></template>
                  <template #unCheckedChildren><LineOutlined :rotate='90'/></template>
                </a-switch>
              </a-flex>
            </template>
            <VueDraggable v-if="curEditTabDit[tabActiveKey] != null" :animation="150" v-model="curEditTabDit[tabActiveKey].policyList" :sort="true" :style="{height: celueLiebiaoBodyHeight + 'px'}" style="display: flex; flex-direction: column; gap: 5px; overflow:scroll; ">
              <a-card  v-for="item, index in curEditTabDit[tabActiveKey].policyList" :key="item.name" size="small" @click='onClickOnePolicy(item)'>
                <template #title>
                  <a-flex gap="0px" align="center" >
                    <!-- <a-button type="default"  style="margin-right: 5px;" @click="onClickSendToRealRun(item.name)">
                      <template #icon>
                        <UploadOutlined />
                      </template>
                    </a-button> -->
                    <div style="flex-shrink: 0; max-width: 150px;" :style="{'color': curEditTabDit[tabActiveKey] != null && curEditTabDit[tabActiveKey].curSelectPolicy == item.name ? '#3c89e8' : ''}">{{(index + 1) + '.' + item.name }}</div>
                    <div style="height: 10px; width: 10px; flex-grow: 1;"></div>
                  </a-flex>
                </template>
                <template #extra>
                  <!-- 记录一下当前执行回测的策略是哪个 -->
                  <a-flex gap="small" align="center" >
                    <a-switch v-model:checked="item.active" @click="onStopClick"/>
                    <!-- 开始运行按钮 -->
                    <!-- <a-button style="flex-shrink: 0;" v-if="getPolicyStateByName(null, item.name, 'inRun') != true" type="text" shape="circle" @click="onClickPolicyRun(item)">
                      <CaretRightOutlined />
                    </a-button> -->
                    <!-- <div v-if="getPolicyStateByName(null, item.name, 'progress') > 0 && getPolicyStateByName(null, item.name, 'progress') < 100">剩余{{getPolicyStateByName(null, item.name, 'completeTime')}}</div>
                    <a-progress
                      v-if="getPolicyStateByName(null, item.name, 'progress') > 0 && getPolicyStateByName(null, item.name, 'progress') < 100"
                      style="flex-shrink: 0;"
                      type="circle"
                      trail-color="#e6f4ff"
                      :percent="getPolicyStateByName(null, item.name, 'progress')"
                      :stroke-width="20"
                      :size="18"
                      :format="number => `进行中，已完成${number}%`"
                    /> -->
                    <!-- 停止运行按钮 -->
                    <!-- <a-button style="flex-shrink: 0;" v-if="getPolicyStateByName(null, item.name, 'inRun') == true" type="text" shape="circle" danger @click="onClickPolicyStop(item)">
                     <CloseOutlined />
                    </a-button> -->
                  </a-flex>
                </template>
              </a-card>
            </VueDraggable>
          </a-card>
        </div>
        <a-card id="canvasCard" size="small" style="user-select: none;">
              <template #title>
                <!-- <div>{{ curEditTabDit[tabActiveKey] != null ? curEditTabDit[tabActiveKey].curSelectPolicy : '' }}</div> -->
                 <a-flex gap="small" align='center'>
                    <!-- <div>蓝图</div> -->
                    <a-segmented v-model:value="ruleChooseTabOption"  block  :options="['蓝图', '表格']" />
                    <div style="display: flex; height: 37px; user-select: none; overflow: hidden; margin-top: -8px; justify-content: left; width: 100%;">
                        <a-menu  mode="horizontal" triggerSubMenuAction="click"  :items="ruleMenu" :selectable="false" @openChange="onMenuOpenChange" @click="onClickMenuItem" style="user-select: none; width: 450px;"/>
                    </div>

                    <a-flex gap="small" align='center' v-if="importProgress != 0 && importProgress != 100">
                      <div>资源导入中{{ importInfo }}</div>
                      <a-progress :percent="importProgress || 0"  type="circle" :size="20" :stroke-width="20" :format="number => `导入资源中，已完成${number}%`" style="flex-shrink: 0;"/>
                    </a-flex>

                    <div>自动替换</div>
                    <a-tooltip>
                      <template #title>开启后上传资源将自动替换所有分镜中已使用的同名称资源</template>
                      <a-switch v-model:checked="configs.uploadReplaceAssestByName"/>
                    </a-tooltip>

                   
                    <!-- <div>录制操作</div>
                    <a-tooltip>
                      <template #title>开启后点击运行，将自动录制点击操作，停止后自动结束录制操作</template>
                      <a-switch v-model:checked="configs.autoRecordTouch"/>
                    </a-tooltip>
                    <div>自动点击</div>
                    <a-tooltip>
                      <template #title>开启后点击运行，如果当前有录制好的操作，将自动点击需要触发的操作，与录制操作是互斥选项</template>
                      <a-switch v-model:checked="configs.autoRunRecordTouch"/>
                    </a-tooltip> -->

                    <a-button>
                       上传资源
                       <input type="file" @change="onBtnImportAssest" ref="modelImport2" multiple accept=".png,.jpg,.jepg,.json,.atlas,.mp3,.wav"
                       style="opacity:0; font-size: 30px; width: 100%; position: absolute;  top: 0; left: 0">
                    </a-button>

                    <a-tooltip>
                      <template #title>
                        <div>录制操作：运行后将录制点击事件，停止后结束录制并记录到当前分镜</div>
                        <div>自动点击：运行后如果当前有录制好的操作，将自动点击需要触发的操作</div>
                      </template>
                      <a-radio-group v-model:value="configs.recordType" button-style="solid">
                        <a-radio-button value="none">关闭</a-radio-button>
                        <a-radio-button value="autoRecordTouch">录制操作</a-radio-button>
                        <a-radio-button value="autoRunRecordTouch">自动点击</a-radio-button>
                      </a-radio-group>
                    </a-tooltip>

                    <!-- <a-button  @click='onClickRunGraphStep'>检查</a-button> -->
                     <!-- :loading="getPolicyState(tabActiveKey, 'isStartLoading') == true" -->
                    <a-button v-if="freshState != null && getPolicyState(tabActiveKey, 'isRuning') != true" @click='onClickRunGraph' >运行</a-button>
                    <a-button v-else danger @click='onClickStopGraph'>停止</a-button>
                    <DownCircleOutlined v-if="curOpenLayout[4] == 0" style="font-size: larger; color: #1568DD;" @click="onClickChangeShowView(4)"/>
                 </a-flex>
              </template>
              <div :style="{width: canvasWidth + 'px', height: canvasHeight + 'px'}" style="position:relative;"  @drop.prevent="handleDrop">
                <canvas v-show="ruleChooseTabOption == '蓝图'" id='mycanvas' :width="canvasWidth" :height="canvasHeight" @litegraph:canvas="onLiteGraphCanvas"></canvas>
                <VueDraggable v-show="ruleChooseTabOption == '表格'" v-model="curEditLgraphTable" target=".ant-table-tbody"  draggable=".ant-table-row" :sort="true" :animation="150" @end="onLgraphTableDragEnd">
                  <!--暂时用不到选择功能 :row-selection="{selectedRowKeys: graphTableSelectRows, onChange: onSelectChange}" -->
                  <a-table :columns="graphTableColumns"  :data-source="curEditLgraphTable" size="small" :bordered="true" :pagination="false" rowKey="id"  :scroll="{ x: canvasWidth - 80, y: canvasHeight - 40  }" @resizeColumn="handleResizeTableColumn">
                    <template #headerCell="{ column }">
                      <template v-if="column.key == 'linkNode_1'">
                        <a-tooltip>
                          <template #title>此列下的动画指令将在进入页面时自动播放，注意：如果两个spine动画同时播放，第二个将覆盖前一个，如果两个数值动画同时播放，可能相互影响</template>
                          {{column.title}}
                        </a-tooltip>
                      </template>
                      <template v-if="column.key == 'action'">
                          <a-flex align="center" gap="4">
                              <div>操作</div>
                              <div style="flex-grow: 1"></div>
                              <a-tooltip placement="bottomRight">
                                <template #title>添加关联指令列</template>
                                <AppstoreAddOutlined @click='addOneColumnToTable'/>
                              </a-tooltip>
                              <a-tooltip placement="bottomRight">
                                <template #title>显示资源名称列</template>
                                <a-switch v-model:checked="configs.showNameColumn" @change='addNameColumnToTable'/>
                              </a-tooltip>
                          </a-flex>
                      </template>
                    </template>
                    <template #bodyCell="{ column, record, index }">
                        <template v-if="column.key == 'modal'">
                            {{ record.modal }}
                        </template>
                        <template v-if="column.key == 'img'">
                            <a-popover title="预览" placement="left" trigger="click">
                                <template #content>
                                    <img :src="record.img" style="max-width: 300px; max-height: 300px;"/></img>
                                    <div>物体类型：{{record.modal}}</div>
                                    <div>资源：{{record.customeName}}</div>
                                </template>
                                <div style="position: absolute; width: 100%; height: 100%; top: 0%; left: 0%; display: flex; justify-content: center; align-items: center; ">
                                    <div v-if="record.img != null" style="position: relative; width: 100%; height: 100%;  overflow: hidden;">
                                       <img style="width: 100%; height: 100%; object-fit:contain; position: absolute; top: 0; left: 0;" :src="record.img"></img>
                                    </div>
                                    <a-tag v-else style="margin-right: 0px;" :color="record.modal == '文本' ? 'purple' : 'blue'">{{record.modal == '文本' ? (record.customeName.length > 8 ? record.customeName.substring(0, 8) + '...' : record.customeName) : record.modal }}</a-tag>
                                </div>
                            </a-popover>


                            <!-- <div v-if="record.modal == '文本'">{{record.customeName}}</div> -->
                            <!-- <a-avatar src="https://www.antdv.com/assets/logo.1ef800a8.svg" /> -->
                            <!-- <div>这里显示头像</div> -->
                            <!-- {{ record.img }} -->
                        </template>

                        <!-- target=".ant-table-tbody"  draggable=".ant-table-row" -->
                        <template v-if="column.key.indexOf('linkNode') != -1">
                              <!-- <a-flex gap="0px" > -->
                                <VueDraggable class="我是拖拽parent" v-if="record[column.key] != null"  v-model="record[column.key]" :data-row="index" :data-col="column.key"  group="tableCell" :animation="150"  @end="onGraphTableCellDragEnd($event, record, column.key)">  
                                  <a-flex v-for="node,index in record[column.key]" gap="3" :style="{'margin-top': index == 0 ? '0px' : '8px'}">
                                    <a-dropdown>
                                      <MoreOutlined @click.prevent/>
                                      <template #overlay>
                                        <a-menu  :items="moreActionMenu" :selectable="false" @openChange="onMenuOpenChange" @click="onClickMenuItem($event, record, column.key, index)"></a-menu>
                                      </template>
                                    </a-dropdown>
                                    <a-dropdown v-if="node.noInput == false" @openChange="getCellInputLinkMenu($event,record, column.key, index)">
                                        <!-- 这里是输入节点 -->
                                      <LoginOutlined @click.prevent :style='{color: node.inputs.length == 0 ? "red" : "green"}'/>
                                      <template #overlay>
                                        <div>
                                          <a-menu :items="inputLinkMenu" :selectable="false" @openChange="onMenuOpenChange"  @click="onClickCellInputMenuItem($event, record, column.key, index)"></a-menu>
                                        </div>
                                      </template>
                                    </a-dropdown>
                                    <a-tag style="margin-right: 0px;" :color="highlightNodeDit[node.id] == 1 ? '#87d068' : (node.tagColor ? node.tagColor : '')">{{node.title + node.id}}</a-tag>
                                    <ConfigInput v-if="node.config != null" gap="3" :values="node.config" marginLeft="0px" @onChange="onGraphTableConfigChange($event, record, column.key, index)"></ConfigInput>
                                    <a-dropdown v-if="node.noOutput == false" @openChange="getCellOutputLinkMenu($event, record, column.key, index)">
                                        <!-- 这里是输出节点 -->
                                      <LogoutOutlined @click.prevent :style='{color: node.outputs.length == 0 ? "red" : "green"}'/>
                                      <template #overlay>
                                        <a-menu :items="outputLinkMenu" :selectable="false" @openChange="onMenuOpenChange"  @click="onClickCellOutputMenuItem($event, record, column.key, index)"></a-menu>
                                      </template>
                                    </a-dropdown>
                                  </a-flex>
                                </VueDraggable>  
                                <a-dropdown v-if="record[column.key] != null && record[column.key].length == 0">
                                  <MoreOutlined @click.prevent/>
                                  <template #overlay>
                                    <a-menu :items="moreActionMenu" :selectable="false" @openChange="onMenuOpenChange" @click="onClickMenuItem($event, record, column.key, -1)"></a-menu>
                                  </template>
                                </a-dropdown>
                                <!-- <div  style="flex-grow: 2; height: 2px; margin-right: -5px"></div> -->
                              <!-- </a-flex> -->
                        </template>
                        

                        <template v-if="column.key == 'action'">
                          <a-flex gap="small" align="center" justify="center" style="overflow: scroll;">
                            <!-- <a-button  size="small" type="primary" v-on:click="onBtnLoadModel(record.name)">编辑</a-button> -->
                            <!-- <a-button  size="small" v-on:click="onBtnCopyModel(record.name)">复制</a-button> -->
                            <a-popconfirm title="删除警告" placement="rightTop">
                              <template #description>
                                <div style="width: 200px;">确定要删除id{{ record.id }}物体?</div>
                                <!-- <div v-if="record.config != null" style="width: 200px;">《{{record.config.name}}》</div> -->
                                <!-- <div style="position: relative; right:0px; color:#FF4D50">此操作不可撤销</div> -->
                              </template>
                              <template #okButton>
                                <a-button danger @click="onBtnDeleteTableRow(index, record)">
                                确定
                              </a-button>
                              </template>
                              <a-button type="text" danger shape="circle"  >
                                <DeleteOutlined />
                              </a-button>
                            </a-popconfirm>
                            <a-button type="text"  shape="circle" @click="toggleNodeIdToGraph(record.id)">
                              <AimOutlined />
                            </a-button>
                          </a-flex>
                        </template>
                    </template>
                  </a-table>
                </VueDraggable>
                <div v-if="isShowMenu == true" :style="{width: canvasWidth + 'px', height: canvasHeight + 'px'}" style="position:absolute;  opacity:0.4; top: 0;"></div>
              </div>
              <!-- <div>这里显示编辑卡片</div> -->
        </a-card>
      </a-flex>
    <!-- </template> -->
    <!-- <div>
      <a-flex gap="middle" style="padding: 5px;">
        
        <div style="width: 50px;"></div>
        <div style="flex-grow: 1;"></div>
       
      </a-flex>
    </div> -->
  </div>
  <a-tooltip placement="left">
    <template #title>AI助手</template>
    <a-float-button v-show="!showAiChatModal" @click="openAiChat"  type="primary"><template #icon><RobotOutlined /></template></a-float-button>
  </a-tooltip>
  
  <!-- AI聊天卡片 -->
  <AiChatCard ref="aiChatCardRef" :open="showAiChatModal" @close="closeAiChat" @send="handleAiChatSend" />
  
  <a-modal v-model:open="importModelOpen" title="导入旧版绘本" @ok="handleOkImport">
      <ConfigInput :vertical="true" gap="3" :values="importOldVersionConfig" marginLeft="0px" @onChange="onImportOldVersionConfigChange"></ConfigInput>
      
      <div style="margin-top: 10px;">
          <!-- <a-button @click="onFreshCanImportPage">刷新可选导入页面</a-button> -->
          <a-checkbox style="" :indeterminate="importCheckedIndeterminate" v-model:checked="importCheckAll" @change="onCheckAllChange">
            全选
          </a-checkbox>
      </div>
      <a-divider style="margin-bottom: 5px; margin-top: 5px;"/>
      <a-checkbox-group v-model:value="importCheckedPageList" :options="importPageOptions" @change="onImportPageCheck"/>


      <a-flex gap="small" align='center' justify="flex-end" style="margin-top: 10px; " v-if="importProgress != null && importProgress != 0 && importProgress != 100">
        <div>资源导入中{{ importInfo }}</div>
        <a-progress :percent="importProgress || 0"  type="circle" :size="20" :stroke-width="20" :format="number => `导入资源中，已完成${number}%`" style="flex-shrink: 0;"/>
      </a-flex>
      <!-- <a-input v-model:value="newProjectName" addon-before="绘本编号" placeholder="请输入新绘本编号" style="margin-bottom: 5px;"/>
      <a-input v-model:value="inputModelDes"  addon-before="绘本备注" placeholder="输入绘本备注"/> -->
      <!-- <div style="margin-top: 10px; margin-bottom: 5px;">绘本中包含的策略：</div> -->
      <!-- <a-tag v-if="waitImportProject != null" color="#3b5999" v-for="item in waitImportProject.policyList">{{ item.name }}</a-tag> -->
  </a-modal>
    <a-modal v-model:open="editColiderOpen" :width="800" :footer="null" :destroyOnClose="true" title="编辑碰撞框">
      <MarkEdit :img='editColiderImg' :pointArr="pointArr" :imgScale="editColiderScale" @onChange="onMarkEditOk"></MarkEdit>    
    </a-modal>
    <a-modal v-model:open="editSoundTextOpen" :width="1200" :footer="null" :destroyOnClose="true" :maskClosable="false" title="编辑音频字幕">
      <SoundTextEdit :audioUrl="editSoundTextParams.url" :config="editSoundTextParams.motionTextData" @onChange="onSoundTextEditOk"></SoundTextEdit>
    </a-modal>
    <a-modal v-model:open="showCreateMotionTextModal" :width="600"  :destroyOnClose="true" title="创建字幕" @ok="handleOkCreateMotionText">
      <ConfigInput :vertical="true" gap="3" :values="createMotionTextConfig" marginLeft="0px"></ConfigInput>
    </a-modal>
    <a-modal v-model:open="showSoundBoxModal" :width="1000" :footer="null" :maskClosable="false" :destroyOnClose="true"  @ok="handleOkSoundMotionText">
        <template #title>
          <a-flex gap="small" align="center">
            <div v-if="curShowAssestBoxType == 'soundBox'" style="font-size:large;">音频资源库</div>
            <div v-if="curShowAssestBoxType == 'spineBox'" style="font-size:large;">动画资源库</div>
            <div v-if="curShowAssestBoxType == 'imageBox'" style="font-size:large;">图片资源库</div>

            <div style="margin-left: 30px;">仅显示当前分镜资源</div>
            <a-switch style="margin-right: 30px;" v-model:checked="justCurrentPage" @change="freshAssestBoxData"/>

            <a-flex gap="small" align='center' v-if="importProgress != 0 && importProgress != 100">
              <div>资源导入中{{ importInfo }}</div>
              <a-progress :percent="importProgress || 0"  type="circle" :size="20" :stroke-width="20" :format="number => `导入资源中，已完成${number}%`" style="flex-shrink: 0;"/>
            </a-flex>
            
            <a-button>
                全局替换资源
                <input type="file" @change="onBtnImportAssest" ref="modelImport2" multiple accept=".png,.jpg,.jepg,.json,.atlas,.mp3,.wav"
                style="opacity:0; font-size: 30px; width: 100%; position: absolute;  top: 0; left: 0">
            </a-button>
          </a-flex>
        </template>
       <a-table :columns="soundBoxColumns" :data-source="soundBoxDatas" size="small" @change="handleSoundBoxTableChange" bordered :pagination="false" rowKey="customeName">
          <!-- <template #headerCell="{ column }">
            <template v-if="column.key === 'name'">
              <span>
                模型Nmae
              </span>
            </template>
          </template> -->
          <template  #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                   <a-flex gap="small" align="center" justify="center" style="overflow: scroll;">
                    <!-- <a-button  size="small" type="primary" v-on:click="onBtnLoadModel(record.name)">编辑</a-button> -->
                    <!-- <a-button  size="small" v-on:click="onBtnCopyModel(record.name)">复制</a-button> -->
                    <!-- <a-tooltip placement="bottomRight">
                      <template #title>在所有分镜中替换该资源的使用</template>
                      <a-button>替换</a-button>
                    </a-tooltip> -->
                    <a-tooltip placement="bottomRight">
                      <template #title>将此音频添加到当前编辑的分镜</template>
                      <a-button @click="onBtnUseBoxOneRow(record)">使用</a-button>
                    </a-tooltip>
                    <a-button @click="onBtnDownLoadBoxOneRow(record)">下载</a-button>
                    <a-button @click="onBtnPlayBoxOneRow(record)">播放</a-button>
                    <!-- <a-popconfirm title="删除警告" placement="rightTop">
                      <template #description>
                        <div style="width: 200px;">确定要删除资源{{ record.name }}?</div>
                        <div style="position: relative; right:0px; color:#FF4D50">此操作不可撤销</div>
                      </template>
                      <template #okButton>
                        <a-button danger @click="onBtnDeleteBoxTableRow(index, record)">
                        确定
                      </a-button>
                      </template>
                      <a-button type="text" danger shape="circle"  >
                        <DeleteOutlined />
                      </a-button>
                    </a-popconfirm> -->
                  </a-flex>
              </template>
              <template v-if="column.key === 'graphUse'">
                  <a-flex style="overflow: scroll;">
                    <a-tag v-for="item in record['graphUse']">{{ item }}</a-tag>
                  </a-flex>
              </template>
          </template>
       </a-table>
    </a-modal>
    
  </a-config-provider>
</template>

<script>
import axios from 'axios'
import { createTextVNode, nextTick,  ref, h } from 'vue';
import 'dayjs/locale/zh-cn' ///修改日期选择器中的语言为中文
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import moment from 'moment';

// import { useCodemirror } from "../../components/RuleEditor/index.js";
import TreeCom from "../../components/RuleEditor/components/tree.vue";
import DescCom from "../../components/RuleEditor/components/desc.vue";
import MarkEdit from "../../components/MarkEdit.vue"
import SoundTextEdit from "../../components/SoundTextEdit.vue"
import AiChatCard from "../../components/AiChatCard.vue"

import {fnData, functionDescription} from "../../components/RuleEditor/fnData.js"
import { get, set, del } from 'idb-keyval';
// import { VueDraggable } from 'vue-draggable-plus'
import * as Rules from '../lianghua/Rules.js';
// import { checkKey } from '@/ActiveTool.js';
// import CryptoJS from 'crypto-js'
import * as XLSX from 'xlsx';
import { message, Modal, notification, Tag  } from 'ant-design-vue';
import { useDraggable, useElementSize } from '@vueuse/core';
import { UseElementSize } from '@vueuse/components';

import { LoginOutlined,  LogoutOutlined, ApiOutlined, BuildOutlined, MacCommandOutlined, ToolOutlined, CloseCircleOutlined, CloseOutlined, ApiFilled, RobotOutlined, BulbOutlined } from '@ant-design/icons-vue';

import { zhString } from '@/litegraph/zhString';
import {LGraph, LiteGraph, LGraphCanvas, LGraphNode, createBounds} from '../../litegraph/litegraph'
import * as CocosMgr from '../../viewCode/CocosMgr'
import '../../viewCode/RegisterNodeType'
import SparkMD5 from 'spark-md5';
import { initializeAgent } from '@/openai/agentByThird.js';


import * as OSS from 'ali-oss/dist/aliyun-oss-sdk';
import { RenderSpine } from '@/viewCode/RenderSpine';
import { SpineToImg } from '@/viewCode/SpineToImg';
import { RenderSpineCanvas } from '@/viewCode/RenderSpineCanvas';
import { name } from 'dayjs/locale/zh-cn';
import ConfigInput from '@/components/ConfigInput.vue';
import { overlapBounding } from '@/litegraph/measure';
import { sort } from '../../pinyin_getFirstLetterList.js';

import VoiceCheck from '@/xfyun/VoiceCheck';

const totpSecret = 'LNKFKRGPNZNUYSLX2VSDSQKJKZDTSRLD';



//改成动态创建，不要写死
var ossClient = null


//要实现spine动画的预览
//https://github.com/EsotericSoftware/spine-runtimes/tree/4.2/spine-ts

//webgl模式和canvas模式的区别？

function isEmptyString(str) {
  return /^\s*$/.test(str);
}


function fakeClick(obj) {
  var ev = document.createEvent("MouseEvents");
  ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  obj.dispatchEvent(ev);
}

//保存到本地
function exportRaw(name, data) {
    var urlObject = window.URL || window.webkitURL || window;
    var export_blob = new Blob([data]);
    var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
    save_link.href = urlObject.createObjectURL(export_blob);
    save_link.download = name;
    fakeClick(save_link);
} 


//不同的场景用不同的key
const TableDataSaveKey = 'celueTableBooks'
const POLICYKEY = ''  //云端读取文件 不要用POLICYKEY


// const currentSelectMenu = ref(['mail']);
//新增绘本的概念，一个绘本下可以有多个策略，便于对比不同策略的回撤结果
const menuItems = ref([
  {
    key: '0',
    label: '绘本列表',
    title: '绘本列表',
    closable: false
  }
])


//传递给组件的当前编辑的列表函数
const list2 = ref([])

//由于graph组件不能被vue的ref包裹引用，所以单独拎出来保存，不保存在this中
const graphDit = {}

//当前的 graphArr = []
let recordTouch = []

//书本分组
const bookGroup = [
  {value: '-1',  label: '已下架'},
  {value: '101', label: '主页推荐'},
  {value: '0',   label: '动物世界'},
  {value: '1',   label:'节日里的中国'},
  {value: '3',   label:'魔法拼音国'},
  {value: '4',   label:'原来如此的故事'},
  {value: '5',   label:'塔塔启蒙'}
]

const bookGroupBySearch = [
  {value: '已下架',  label: '已下架'},
  {value: '主页推荐', label: '主页推荐'},
  {value: '动物世界',   label: '动物世界'},
  {value: '节日里的中国',   label:'节日里的中国'},
  {value: '魔法拼音国',   label:'魔法拼音国'},
  {value: '原来如此的故事',   label:'原来如此的故事'},
  {value: '塔塔启蒙',   label:'塔塔启蒙'}
]



// console('hello tensorflow', tf)
export default {
  name: 'App',

  components: {
    // HelloWorld
    TreeCom,
    DescCom,
    UseElementSize,
    MarkEdit,
    SoundTextEdit,
    AiChatCard,
    // VerificationCode
    // VueDraggable
  },
  setup(){
    return {
    }
  },
  data() {
    // const value1 = ref<string>('a');
    return {
      locale: zhCN,
      isOpenDark: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
      screenHeight: document.body.clientHeight,
      screenWidth: document.body.clientWidth,
      fnData: fnData,
      curFnInfo: ref(null),
      symbolData: null,
      showDataSetIndex: 0,
      showDataSetResult: 0,
      menuItems:menuItems,
      freshState: false,
      currentSelectMenu: ref(['1']),
      bookGroup: bookGroup,
      bookGroupBySearch: bookGroupBySearch,
      modelTableColumns: [
          {
            title: '绘本编号',
            dataIndex: 'name',
            key: 'name',
             ellipsis: true,
            width: '9%',
          },
          {
            title: '名称',
            dataIndex: 'showName',
            key: 'showName',
            ellipsis: true,
            width: '11%',
            customFilterDropdown: true,
            onFilter: (value, record)=>{
              let group = bookGroup.find((item)=>{
                return item.label == value
              })
              // console.log('record', group, record)
              if(group != null){
                if(record.config.group.indexOf != null){
                  if(record.config.group.indexOf(group.value) != -1){
                    return true
                  }
                }
              }
              return record.name.toString().toLowerCase().includes(value.toLowerCase()) || record.config.name.toLowerCase().includes(value.toLowerCase())
            },
          },
          {
            title: '备注（不会出现在App中）',
            dataIndex: 'des',
            key: 'des',
            ellipsis: true,
            width: '18%',
          },
          {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            ellipsis: true,
            width: '9%',
          },
          {
            title: '发布时间',
            dataIndex: 'publishTime',
            ellipsis: true,
            key: 'publishTime',
            width: '9%',
          },
          // {
          //   title: '回测结果',
          //   dataIndex: 'accuracy',
          //   key: 'accuracy',
          //   width: '24%',
          // },
          {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            ellipsis: true,
            width: '15%',
          }
      ],
      graphTableColumns: [
          {
            title: '预览',
            dataIndex: 'img',
            key: 'img',
            // ellipsis: true,
            // resizable: true,
            fixed: 'left',
            width: '130px',
            // minWidth: 52,
            // maxWidth: 52
          },
          // {
          //   title: '类型',
          //   dataIndex: 'modal',
          //   key: 'modal',
          //   // ellipsis: true,
          //   // resizable: true,
          //   width: 75,
          //   // minWidth: 75,
          //   // maxWidth: 75
          // },
          // {
          //   title: '资源',
          //   dataIndex: 'customeName',
          //   key: 'customeName',
          //   ellipsis: true,
          //   resizable: true,
          //   width: 200,
          //   // minWidth: 50,
          // },
          {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            // ellipsis: true,
            // resizable: true,
            fixed: 'right',
            width: 80, //表格的滚动开始位置需要减去这个 width canvasWidth - 
          }
      ],

      //filteredInfo
      //
      filteredInfo: ref({}),
      sortedInfo: ref({}),
      soundBoxColumns: [
          {
            title: '资源名称',
            dataIndex: 'name',
            key: 'name', //customeName隐藏
            sorter: (a,b) => sort(a.name, b.name),
            sortOrder: 'ascend'
          },
          {
            title: '版本',
            dataIndex: 'md5',
            key: 'md5',
          },
          {
            title: '分镜使用',
            dataIndex: 'graphUse',
            key: 'graphUse',
            ellipsis: true
          },
          {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
          },
          // {
          //   title: '节点id',
          //   dataIndex: 'nodeId',
          //   key: 'nodeId',
          // },
      ],
      curEditLgraphTable: ref([]),
      graphTableSelectRows: ref([]),
      modelTableDatas: ref([]),
      soundBoxDatas: ref([]),
      // inputModelName: '',
      inputModelDes: '',
      tabActiveKey: ref(menuItems.value[0].key),
      list2: list2,

      //当前编辑的tab数据
      curEditTabDit: ref({}), //curEditRulesDit，resultSymbolList，curSelectSymbolItem，全都要放到这里
      curOpenLayout: ref([0, 1, 1, 1, 1]),

      searchConfig: ref([
          {key: 'name', type: 'input', value: '',  title: '过滤名称'},
          {key: 'group', type: 'select', value: [], title: '过滤分组', mode: 'tags', width: '200px', maxTagCount: 3, options: bookGroup},
      ]),

      huiceConfig: ref([
        {key: 'name', type: 'input', value: '',  title: '名称', inBottom: true},
        {key: 'splitName', type: 'input', value: '',  title: '简称', inBottom: true},
        {key: 'author', type: 'input', value: '塔塔工作室/文',  title: '作者', inBottom: true},
        {key: 'draw', type: 'input', value: '塔塔工作室/绘', title: '绘制', inBottom: true},
        {key: 'press', type: 'input', value: '', title: '出版社', inBottom: true},
        {key: 'labels', type: 'select', value: [], title: '标签', mode: 'tags', width: '100%', maxTagCount: 3, inBottom: true},
        {key: 'group', type: 'select', value: [], title: '分组', mode: 'tags', width: '100%', maxTagCount: 3, options: bookGroup, inBottom: true},
        
        {key: 'desc', type: 'inputArea', value: '', title: '简介', inBottom: true, placeholder: '请输入绘本简介'},
        {key: 'price', type: 'number', value: 0, step: 1, width:'100%', formatter:value => `${value}元`, parser:value => Number(value.replace('元', '')), title: '价格', inBottom: true},
        {key: 'freepage', type: 'number', value: 0, step: 1, width:'100%', formatter:value => `${value}页`, parser:value => Number(value.replace('页', '')), title: '免费页数', inBottom: true},

        {key: 'show', type: 'bool', value: true, title: '是否上架', inBottom: true},
        // {key: 'sort', type: 'number', value: 0, step: 1, width:'100%' , title: '优先级', inBottom: true},
        {key: 'record', type: 'bool', value: false, title: '是否录音', inBottom: true},
        {key: 'justOld', type: 'bool', value: false, title: '仍然使用旧版绘本', inBottom: true},

        {key: 'emptyClickEffect', type: 'select', value: '', title: '空白处点击效果', width: '100%', inBottom: true, options: [
          {value: '', label: '无'},
          {value: 'story/prefab/P12_FJ0_AN', label: '气泡'},
          {value: 'story/prefab/P08_FJ0_AN', label: '萤火虫光'}
        ]},


      ]),

      ruleChooseTabOption: '蓝图',
      checkAllRule: false,
      checkIndeterminate: true,
      newPolicyName: '',
      copyToProject: '',  //拷贝策略到哪个绘本下
      newProjectName: '',
      celueLiebiaoCardHeight: 0,
      celueLiebiaoBodyHeight: 0,
      canvasHeight: 0,
      canvasWidth: 0,

      gameCanvasWidth: 320,
      gameCanvasHeight: 180,
      gameCanvasCardWidth: 0,
      gameCanvasCardHeight: 180,

      previewCardMinWidth: 332,
      previewCardMinHeight: 229,


      width: 320,
      height: 180,

      workSpaceHeight: 200, ///工作区域的高度
      celueEditBodyHeight: 0, //策略编辑区域的高度
      expandPolicyList: false,
      policyShowKey: 'none',
      policySortKey: 'none',
      policySortKeyIsDown: false,
      freshCheckBool: true,
      freshResultList: true,
      items: [],
      showByKeyOptions: [
        {value: 'none', label: '无'},
        {value: 'xiapuPresent', label: '夏普比率'},
        {value: 'suotinuoPresent', label: '索提诺比率'},
        {value: 'yearPresent', label: '年化收益'},
        {value: 'jiaoyiWinPresent', label: '胜率'},
        {value: 'jiaoyiCount', label: '交易次数'},
        {value: 'maxHuice', label: '最大回撤'},
      ],

      //策略模版列表
      importModelOpen: false,
      importOldVersionConfig: ref([
          // {key: 'years', type: 'select', value: [], maxTagCount: 0, mode:'multiple', options: []},
          // /Users/guyi/Documents/work/tataread2026/assets/bundleStory/880012
          // /Users/yaowei/Documents/work/tataread2026/assets/bundleStory/880012
          {key: 'bookFolder',  type: 'input', value: '/Users/yaowei/Documents/work/tataread2026/assets/bundleStory/880012', width: '400px', title: '绘本目录' , des: '选择Cocos AssestBundle下的书本目录' , isPath: true, inBottom: true},
          {key: 'bookId',  type: 'input', value: '', title: '绘本编号', inBottom: true},
          // {key: 'bookName',  type: 'input', value: '', title: '绘本名称', inBottom: true},
          // {key: 'bookDes',  type: 'input', value: '', title: '绘本备注', inBottom: true},
      ]),
      createMotionTextConfig: ref([
          // {key: 'years', type: 'select', value: [], maxTagCount: 0, mode:'multiple', options: []},
          // /Users/guyi/Documents/work/tataread2026/assets/bundleStory/880012
          // /Users/yaowei/Documents/work/tataread2026/assets/bundleStory/880012
          {key: 'content',  type: 'input', value: '', title: '内容', inBottom: true},
      ]),
      importCheckedIndeterminate: false,
      importCheckedPageList: ref([]),
      importPageOptions: ref([]),
      importCheckAll: false,

      editColiderOpen: false,
      editSoundTextOpen: false,
      editSoundTextParams: {},
      editColiderImg: '',
      pointArr:[],
      editColiderScale: 1,
      
      //等待导入的绘本
      importProgress: 0,
      importInfo: "0/0",
      waitImportProject: null,
      ruleMenu: [],
      moreActionMenu: [],
      isShowMenu: false,
      // cocosPreviewCanDrag: false,
      // cocosPreviewIsShowState: false,
      // cocosPreviewIsShowTree: false,
      cocosPreviewTreeWidth: 0,
      cocosPreviewTreeData:[],
      expandedKeys: [],
      fileList: [],  //文件上传的列表
      highlightNodeDit: {},
      outputLinkMenu: ref([]),
      inputLinkMenu: ref([]),

      waitLink: {},

      cocosConfig: {
        cocosPreviewIsShowTree: false,  //是否显示节点树
        cocosPreviewIsShowState: false, //是否显示状态
        cocosPreviewIsShowGird: false,  //是否显示参考线
        cocosPreviewCanDrag: false,     //是否可以拖拽
        isPreviewMode: true,           //是否可以预览
        cocosPreviewIsShowColiderBox: false, //是否显示碰撞框
        mute: false,    //是否静音状态

        radioLock: false,               //比例是否锁定状态
        radio: '2560:1500',
        aspectRadio: 1500 / 2560,
        radioOptions: [
          {value: '无比例', label: '无比例'},
          {value: '16:9', label: '常规显示器'},
          {value: '4:3', label: 'ipad'},
          {value: '19.5:9', label: 'iPhone全面屏'},
          {value: '2560:1500', label: '绘本设计分辨率'},
        ]
      },
      systemSetting: ref([
          // {key: 'localMode',  type: 'bool', value: true, title: '使用本地存储模式', inBottom: true},
          // {key: 'years', type: 'select', value: [], maxTagCount: 0, mode:'multiple', options: []},
          {key: 'accessKeyId',  type: 'input', value: '', width: '400px', title: 'accessKeyId', inBottom: true},
          {key: 'accessKeySecret',  type: 'input', value: '', title: 'accessKeySecret', inBottom: true},
          {key: 'bucket',  type: 'input', value: 'animalcastle-app-resources', title: 'bucket', inBottom: true},
          {key: 'cloudHost',  type: 'input', value: 'https://animalcastle-app-resources.oss-cn-shanghai.aliyuncs.com', title: 'cloudHost', inBottom: true},
          
          {key: 'xunfeiAppid',  type: 'input', value: '145d2560', width: '400px', title: 'xunfeiAppid', inBottom: true},
          {key: 'xunfeiApiSecret',  type: 'input', value: 'MTM3ZWQ2Y2Y4ZmEyMTEwYWVmMDg3NmRk', width: '400px', title: 'xunfeiApiSecret', inBottom: true},
          {key: 'xunfeiApiKey',  type: 'input', value: '4c75d2411acf143f4145ba8b72a03bdc', width: '400px', title: 'xunfeiApiKey', inBottom: true},

          {key: 'OpenAibaseURL',  type: 'input', value: 'https://api.gptsapi.net/v1', width: '400px', title: 'OpenAibaseURL', inBottom: true},
          {key: 'OpenAiapiKey',  type: 'input', value: 'sk-hlKc1190aba25b66617fa0d7b631f42dedb70ffc2f2FghUc', width: '400px', title: 'OpenAiapiKey', inBottom: true},
      ]),

      copyedNode: {},
      configs: {
        showNameColumn: false,
        uploadReplaceAssestByName: true,
        recordType: 'none'
      },
      showCreateMotionTextModal: false,
      showSoundBoxModal: false,
      verificationCode: '',
      showKeyboard: true,
      justCurrentPage: true, //查看所有页面的资源还是仅当前编辑的页面
      curShowAssestBoxType: '', //当前资源面板显示的资源类型
      showAiChatModal: false
    };
  },
  watch:{
    policySortKey(newValue, oldValue){
      this.sortPolicyList()
    },
    policySortKeyIsDown(newValue, oldValue){
      this.sortPolicyList()
    },
    currentSelectMenu(newValue, oldValue){
      console.log('newValue', newValue[0], oldValue[0])
    },

    ruleChooseTabOption(newValue, oldValue){
      if(this.waitLink.nodeObj != null){
        this.$message.info({content: '绑定取消', key:  this.waitLink.nodeObj.id, duration: 1})
        this.waitLink = {}
      }
      if(newValue == '表格'){
        this.getCurEditLgraphTable()
      }
    },

    tabActiveKey(newValue, oldValue){
      console.log('tabActiveKey', newValue, oldValue)
      if(oldValue != 0){
        //切换标签页时自动保存
        this.onClickSaveBtn(oldValue)
      }
      if(newValue != 0){
        this.freshCurEdit()
        this.$nextTick(()=>{
          // this.getCardBodyHeight('celueLiebiaoCard')
          this.calculateHeight()
        })
        this.copyToProject = newValue
      }

      if(newValue == 0){
        //切换到首页，画布也被销毁了
        // CocosMgr.clearScene()
        this.clearCurEditLgragh(oldValue)
        if(this.lgcanvas != null){
          this.lgcanvas.clear()
          this.lgcanvas = null
        }
      }else{
        if(newValue != oldValue){
          this.clearCurEditLgragh(oldValue)
        }
        this.$nextTick(()=>{
          this.updateCurShowLGraph()
        })
      }
      
      // setTimeout(() => {
    //   this.getCardBodyHeight('celueLiebiaoCard')
    // }, 3000);
    },
  },
  async mounted() {
    // let arr = ['王五', '9', 'a李四', 'abca', 'a张三', '张三', 10, 'b', '李四2', '10', 'abc123', 2, '09', 1, 12, '02', 'a', '01', 'abc11', 'abc2', '李四'];
    // let arrsort = arr.sort(sort)
    // console.log('arrsort', arrsort)

    // watch(this.currentSelectMenu, (value)=>{
    //   console.log('currentSelectMenu', this.currentSelectMenu[0], value[0])
    // })
    // console.log('2025-05-13T00:00:00.000', moment('2025-05-13T00:00:00.000').format("YYYY_MM_DD"))
            // <!-- 根据比例计算如果宽度为332，计算高度 (332 - 10) * (designViewHeight / designViewWidth) -->
    

    let curOpenLayout = localStorage.getItem('BookEdit_curOpenLayout')
    if(curOpenLayout != null){
      this.curOpenLayout =  JSON.parse(curOpenLayout)
    }

    //左右间隔10，上下间隔10，标题高度38
    this.previewCardMinHeight = (this.previewCardMinWidth - 10) * (CocosMgr.designViewHeight / CocosMgr.designViewWidth) + 10 + 38

    window.channel = new BroadcastChannel('BookEditFM');
    // window.channel.postMessage({ type: 'update', data: '新内容' });
    // window.channel.onmessage = (event) => {
    //     console.log('收到消息:', event.data);
    // };
    


    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      this.isOpenDark = event.matches
    });

    let config = localStorage.getItem('bookEditConfig')
    if(config != null){
      try {
        config = JSON.parse(config)
        for(var i = 0; i < this.systemSetting.length; i++){
          if(config[this.systemSetting[i].key] != null){
            this.systemSetting[i].value = config[this.systemSetting[i].key]
          }
        }
        //初始化基础配置
        CocosMgr.setRootHost(config.cloudHost + '/bookEdit')
        VoiceCheck.setConfig(config['xunfeiAppid'], config['xunfeiApiSecret'], config['xunfeiApiKey'])
        initializeAgent(config['OpenAibaseURL'], config['OpenAiapiKey'])
        // console.log('bookEditConfig', config, this.systemSetting)
        ossClient = new OSS.default({
            region: 'oss-cn-shanghai',
            accessKeyId: config.accessKeyId,
            accessKeySecret: config.accessKeySecret,
            bucket: config.bucket
        }); 
        const result = await ossClient.listV2({
          prefix: 'bookEditProject/',
          delimiter: '/'
        });
     
        console.log('云端文件列表',result.objects);
      } catch (error) {
        console.log('初始化云储存失败', error)
        this.$message.error('初始化云储存失败:' + error, 0)
      }
    }else{
      this.$message.warn('使用前请先进行系统设置',0)
    }
    

    document.title = '绘本编辑器'

    var self = this
    window.onresize = () => {
      return (() => {
        this.screenHeight = document.body.clientHeight
        this.screenWidth = document.body.clientWidth
        this.calculateHeight()
        // this.$nextTick(()=>{
        //   this.getCardBodyHeight('celueLiebiaoCard')
        // })
      })()
    }

    window.onChangeGraph = this.onChangeGraph

    window.onGraphMenuClick = this.onGraphMenuClick

    window.onGraphNodeClick = this.onGraphNodeClick

    window.uploadGroupFile = this.uploadGroupFile

    window.setDropXY = (x, y)=>{
      this.dropedX = x
      this.dropedY = y
    }

    window.antAleart = (msg)=>{
      this.$message.warn(msg)
    }

    // 为 AI Agent 提供获取当前编辑蓝图的方法
    window.getCurrentEditGraph = () => {
      return this.getCurEditLGraph()
    }

    // 为 AI Agent 提供刷新画布的方法
    window.refreshLiteGraphCanvas = () => {
      if(this.lgcanvas != null && this.lgcanvas.graph != null){
        this.lgcanvas.draw(true, true)
      }
    }

    if (window.require) {

    }


    var modelTableDatas = await this.getFromLocalOrCloud(TableDataSaveKey) //get(TableDataSaveKey)
    //现在列表只存放名称，和时间等信息，不存放绘本明细，每个绘本单独保存
    if(modelTableDatas != null){
      modelTableDatas.forEach((item)=>{
        this.modelTableDatas.push(item)
      })
    }
    // console.log('本地保存的modelTableDatas', modelTableDatas)
    // new SymbolData().load()
    // setTimeout(() => {
    //   this.getCardBodyHeight('celueLiebiaoCard')
    // }, 3000);
    this.calculateHeight()


    this.ruleMenu = this.getMenu('')
    this.ruleMenu.push({
      key: 'onestep/',
      label: '快捷操作',
      has_submenu: true,
      icon: h(ToolOutlined),
      children: [
        {key: 'viewToCenter', label: '重置界面中心点', has_submenu: false},
        {key: 'autoSetAni', label: '自动设置动画', has_submenu: false},
        {key: 'autoSetOldData', label: '适配导入旧版数据', has_submenu: false},
        {key: 'layoutNodes', label: '扩散节点', has_submenu: false},   //导入后的节点位置乱了，需要重新设置
        {key: 'layoutNodesJustX', label: '向右扩散节点', has_submenu: false},   //导入后的节点位置乱了，需要重新设置
        {key: 'girdNodes', label: '优化节点排列', has_submenu: false}, //导入后的节点位置乱了，需要重新设置
        {key: 'collase', label: '折叠节点', has_submenu: true, children: [
           {key: 'collapseAll_objects/createObject',     label: '折叠所有物体节点',    has_submenu: false},
           {key: 'collapseAll_objects/animates/animate', label: '折叠所有骨骼动画节点', has_submenu: false},
           {key: 'collapseAll', label: '折叠所有节点', has_submenu: false},
        ]},
        {key: 'expand', label: '展开节点', has_submenu: true, children: [
           {key: 'expandAll_objects/createObject',     label: '展开所有物体节点',    has_submenu: false},
           {key: 'expandAll_objects/animates/animate', label: '展开所有骨骼动画节点', has_submenu: false},
           {key: 'expandAll_middle/change/timeDown', label: '展开所有延迟触发节点', has_submenu: false},
           {key: 'expandAll_middle/tool/acceptData', label: '展开无线传送接收', has_submenu: false},
           {key: 'expandAll_middle/tool/sendData', label: '展开无线传送发送', has_submenu: false},
           {key: 'expandAll', label: '展开所有节点', has_submenu: false},
        ]},
        // {key: 'createMotionText', label: '创建字幕', has_submenu: false},  //暂时废弃了，改为从播放音频卡片添加字幕
        {key: 'soundBox', label: '音频库', has_submenu: false},
        {key: 'spineBox', label: '动画库', has_submenu: false}
      ]
    })
    this.moreActionMenu = [
      {key: 'deleteNode', label: '删除指令', has_submenu: false},
      // {key: 'chengeMenus', label: '修改指令', has_submenu: true, children: this.ruleMenu},
      {key: 'addMenus',  label:  '添加指令', has_submenu: true, children: this.ruleMenu },
      {key: 'copyNode',  label:  '复制', has_submenu: false },
      {key: 'pasteNode', label:  '粘贴', has_submenu: false },
      {key: 'toggleToGraph', label: '定位到蓝图', has_submenu: false },
    ]
    console.log('最终的menu', this.ruleMenu)
  },
  methods: {
    onUpdate(e){
      console.log("onUpdate", e)
    },
    onEnd(){
      console.log('onEnd',this.modelTableDatas)
    },
    pushTo(url){
        this.$router.push(url)
    },
    jumpTo(url){
       this.$router.replace(url)
    },

    formatTime(time){
      if(time == null){
        return ''
      }
      return moment(time).format('YYYY/MM/DD HH:mm:ss')
    },

    //从本地或者网络获取数据
    async getFromLocalOrCloud(key){
      let systemSetting = Rules.arrToDit(this.systemSetting,'key','value')
      // if(systemSetting.localMode == true){
      //   return await get(key) 
      // }
      let cloudHost = systemSetting.cloudHost
      try {
          var result = await axios.get(cloudHost + '/bookEditProject/' + key + '.json?timestamp=' + new Date().getTime())
          // console.log('云端文件内容', key, result.data)
          if(typeof result.data == 'object'){
            return result.data
          }else{
            this.$message.error('不存在Json文件:' + '/bookEditProject/' + key + '.json', 3)
          }
      } catch (error) {
          this.$message.error('网络出错，获取云端数据失败:' + error, 3)
      }
    },

    //保存到本地或网络
    async setToLocalOrCloud(key, obj){
        // let systemSetting = Rules.arrToDit(this.systemSetting,'key','value')
        // if(systemSetting.localMode == true){
        //   await set(key, JSON.parse(JSON.stringify(obj)))
        //   return true
        // }
        if(ossClient == null){
          this.$message.error('当前没有访问远程资源权限！请先设置AccessKey')
          return
        }
        try {
          let blob = new Blob([JSON.stringify(obj)], {type: 'text/plain'})
          await ossClient.put('bookEditProject/' + key + '.json' , blob)
          return true
        } catch (error) {
          this.$message.error('保存' + key + '失败:' + error, 3)
        }
    },

    //删除本地或网络上的某个内容
    async delToLocalOrCloud(key){
      // let systemSetting = Rules.arrToDit(this.systemSetting,'key','value')
      // if(systemSetting.localMode == true){
      //   await del(key)
      //   return
      // }
      if(ossClient == null){
        this.$message.error('当前没有访问远程资源权限！请先设置AccessKey')
        return
      }
      await ossClient.delete('bookEditProject/' + key + '.json');
    },

    getMenu(base_category){
      ///构建规则菜单选项
      var menuIconDit = {
        'middle/': h(ApiOutlined),
        'input/': h(LogoutOutlined),
        'output/':  h(LoginOutlined),
        'objects/':  h(BuildOutlined),
        'onestep/':  h(ToolOutlined)
      }
      var categories = LiteGraph.getNodeTypesCategories()
      .filter(category => category.startsWith(base_category))
      // var dit = {}
      // for(var i = 0; i < menus2.length; i++){
      //   var menus = LiteGraph.getNodeTypesInCategory(menus2[i])
      //   console.log(menus2[i], menus)
      // }
      var entries = []
      for (const category of categories) {
        if (!category) continue

        const base_category_regex = new RegExp(`^(${base_category})`)
        const category_name = category
          .replace(base_category_regex, "")
          .split("/", 1)[0]
        const category_path =
          base_category === ""
            ? `${category_name}/`
            : `${base_category}${category_name}/`

        let name = category_name
        // in case it has a namespace like "shader::math/rand" it hides the namespace
        if (name.includes("::")) name = name.split("::", 2)[1]

        const index = entries.findIndex(entry => entry.key === category_path)
        if (index === -1) {
          var entry = {
            key: category_path,
            label: zhString[name] ? zhString[name] : name,
            has_submenu: true,
            children: this.getMenu(category_path)
          }
          if(menuIconDit[category_path] != null){
           entry.icon = menuIconDit[category_path]
          }
          entries.push(entry)
        }
      }

      const nodes = LiteGraph.getNodeTypesInCategory(
        base_category.slice(0, -1),
      )

      for (const node of nodes) {
        if (node.skip_list) continue

        const entry = {
          key: node.type,     //唯一标记，不可以修改
          label: zhString[node.title] ? zhString[node.title] : node.title ,  //显示的标题，可以翻译
          has_submenu: false,
        }

        entries.push(entry)
      }

      // console.log('entries', entries)
      return entries
    },

    //获取当前的所有资源， 可选择直接返回字典类型
    getResArr(assestTypes, justDit, justCurrentPage){
        //创建字幕
        //获取当前绘本所有的音频
        //soundBoxColumns
        let policyList = this.curEditTabDit[this.tabActiveKey].policyList
        if(justCurrentPage == true){
          let curSelectPolicy = this.curEditTabDit[this.tabActiveKey].curSelectPolicy
          // console.log('curSelectPolicy', curSelectPolicy, this.curEditTabDit[this.tabActiveKey])
          policyList = policyList.filter((page)=>{
            return page.name == curSelectPolicy
          })
        }
        let soundDit = {}
        let soundArr = []
        for(var i = 0; i < policyList.length; i++){
          let graphJson = policyList[i].graphJson
          if(graphJson == null){
            continue
          }
          for(var j = 0; j < graphJson.nodes.length; j++ ){
            let node = graphJson.nodes[j]
            if(node.properties.customeName != null){
              let obj = {
                graphUse: [policyList[i].name],
                nodeId: node.id,
                customeName: node.properties.customeName
              } 

              let canInput = false
              if(node.type == 'output/sound'){
                if(assestTypes.indexOf('sound') != -1){
                  obj.md5 = node.properties.customeName.split('.')[1]
                  obj.name = node.properties.customeName.split('.')[0]
                  obj.type = 'sound'
                  canInput = true
                }
              }else if(node.type == 'objects/createObject'){
                if(node.properties.modal == CocosMgr.ObjectTypeEnum.spine){
                  if(assestTypes.indexOf('spine') != -1){
                    obj.md5 = node.properties.customeName.split('/')[0]
                    obj.name = node.properties.customeName.split('/')[1]
                    obj.type = 'spine'
                    if(obj.name == null){
                      obj.name = obj.md5
                    }
                    canInput = true
                  }
                }else if(node.properties.modal == CocosMgr.ObjectTypeEnum.sprite){
                  if(assestTypes.indexOf('sprite') != -1){
                    obj.md5 = node.properties.customeName.split('.')[1]
                    obj.name = node.properties.customeName.split('.')[0]
                    obj.type = 'image'
                    canInput = true
                  }
                }
              }

              if(canInput){
                if(soundDit[obj.customeName] != null){
                  soundDit[obj.customeName].graphUse.push(policyList[i].name)
                }else{
                  soundDit[obj.customeName] = obj
                }
              }
            }
          }
        }
        if(justDit == true){
          return soundDit
        }
        for(var key in soundDit){
          soundArr.push(soundDit[key])
        }
        return soundArr
    },

    replaceFileGrpup(oneFile){
      //暂时仅仅替换当前页面的文件
      let graph = this.getCurEditLGraph()
      if(graph == null){
        return
      }
      // let oneFile = groupFile[i]
       
      let hasReplace = false
      let fileType = CocosMgr.getFileType(oneFile.type)
      if(fileType == '音频'){
        let sounds = graph.findNodesByType('output/sound')
        for(var j = 0; j < sounds.length; j++){
          let node = sounds[j]
          if(node.properties.customeName.split('.')[0] == oneFile.name){
            node.setProperty('customeName', oneFile.customeName)
            hasReplace = true
          }
        }
      }else if(fileType == '图片'){
        let objects = graph.findNodesByType('objects/createObject')
        for(var j = 0; j < objects.length; j++){
          let node = objects[j]
          if(node.properties.modal == CocosMgr.ObjectTypeEnum.sprite && node.properties.customeName.split('.')[0] == oneFile.name){
            node.setProperty('customeName', oneFile.customeName)
            node.onWidgetChanged('资源')
            hasReplace = true
          }
        }
      }else if(fileType == 'spine'){
        let objects = graph.findNodesByType('objects/createObject')
        for(var j = 0; j < objects.length; j++){
          let node = objects[j]
          if(node.properties.modal == CocosMgr.ObjectTypeEnum.spine && node.properties.customeName.split('/')[1] == oneFile.name){
            node.setProperty('customeName', oneFile.customeName)
            node.onWidgetChanged('资源')
            hasReplace = true
          }
        }
      }
      //let curResDit = this.getResArr(['sound','spine','sprite'], true)
      // console.log('当前资源列表', curResDit)
      return hasReplace
    },

    //替换当前绘本中用到的所有资源
    replaceFileGroupByBook(oneFile){
      let policyList = this.curEditTabDit[this.tabActiveKey].policyList
      for(var i = 0; i < policyList.length; i++){
        let graphJson = policyList[i].graphJson
        if(graphJson == null){
          continue
        }
        for(var j = 0; j < graphJson.nodes.length; j++ ){
          let node = graphJson.nodes[j]
          if(node.properties.customeName != null){
            if(node.type == 'output/sound'){
              if(node.properties.customeName.split('.')[0] == oneFile.name){
                node.properties.customeName = oneFile.customeName
              }
            }else if(node.type == 'objects/createObject'){
              if(node.properties.modal == CocosMgr.ObjectTypeEnum.spine){
                if(node.properties.customeName.split('/')[1] == oneFile.name){
                    node.properties.customeName = oneFile.customeName
                }
              }else if(node.properties.modal == CocosMgr.ObjectTypeEnum.sprite){
                if(node.properties.customeName.split('.')[0] == oneFile.name){
                    node.properties.customeName = oneFile.customeName
                }
              }
            }
          }
        }
      }
    },

    //当前点击了按钮
    onClickMenuItem(event, targetRowRecord, columnKey, index){
      if(this.waitLink.nodeObj != null){
          this.$message.info({content: '绑定取消', key:  this.waitLink.nodeObj.id, duration: 1})
          this.waitLink = {}
      }

      // console.log('onClickMenuItem', event, event.key, targetRowRecord, columnKey, index)
      // let topMenu = event.keyPath[0]
      if(event.key == 'viewToCenter'){
        //显示所有元素
        var graph = this.getCurEditLGraph()
        if(graph.nodes.length != 0){
          const bounds = createBounds(graph.nodes) //
          this.lgcanvas.animateToBounds(bounds, {zoom: 1})
        }
      }else if(event.key == 'autoSetAni'){
        //自动设置动画
        //将所有只有一个动画的骨骼动画设置成loop，自动播放
        var graph = this.getCurEditLGraph()
        var animates = graph.findNodesByType('objects/animates/animate')
        for(var i = 0; i < animates.length; i++){
          let aniNode = animates[i]
          aniNode.getEnums(true)

          //修复柔和过渡
          let upNode = aniNode.getInputNode(1)
          if(upNode != null && upNode.type == 'objects/animates/animate'){
            //上一个动画是同一个物体的动画输入，不需要柔和切换
            let target = upNode.getRealLinkNode()
            let targetSelf = aniNode.getRealLinkNode()
            if(target != null && targetSelf != null){
               if(target.id == targetSelf.id){
                  aniNode.setProperty('softChange', false)
               }
            }
          }
          if(upNode == null){
             aniNode.setProperty('softChange', false)
          }
        }
      }else if(event.key == 'autoSetOldData'){
        var graph = this.getCurEditLGraph()
        
        var animates = graph.findNodesByType('objects/animates/animate')
        for(var i = 0; i < animates.length; i++){
          let aniNode = animates[i]
          aniNode.getEnums(true)
          let upNode = aniNode.getInputNode(1)
          if(upNode != null && upNode.type == 'objects/animates/animate'){
            //上一个动画是同一个物体的动画输入，不需要柔和切换
            let target = upNode.getRealLinkNode()
            let targetSelf = aniNode.getRealLinkNode()
            if(target != null && targetSelf != null){
               if(target.id == targetSelf.id){
                  aniNode.setProperty('softChange', false)
               }
            }
          }
          if(upNode == null){
             aniNode.setProperty('softChange', false)
          }
        }

        let tweenNodes = graph.findNodesByType('objects/animates/tween')
        for(let i = 0; i < tweenNodes.length; i++){
          let node = tweenNodes[i]
          if(node.properties.tweenMode == '变化目标值'){
            let codeNode = node.getInputData(0, true)
            if(codeNode != null){
              //同步目标值的变化
              node.setProperty('anchorX', codeNode.anchorX)
              node.setProperty('anchorY', codeNode.anchorY)
              node.setProperty('width',   codeNode.width)
              node.setProperty('height',  codeNode.height)
              node.setProperty('color',  '#' + codeNode.color)
            }
          }else if(node.properties.tweenMode == '变化多少值'){
            node.setProperty('anchorX', 0)
            node.setProperty('anchorY', 0)
            node.setProperty('width',   0)
            node.setProperty('height',  0)
            node.setProperty('color',  '#000000')
          }
        }
      }else if(event.key == 'layoutNodes'){
        // let startX = 0  
        // let startY = 0
        // //先排列物体和和物体关联的节点
        var graph = this.getCurEditLGraph()
        // graph.arrange() //排列方式比较单一，就是横排或竖排
        // var objectNodes = graph.findNodesByType('objects/createObject')
        // let linkAniWidth = 0
        // for(var i = 0; i < objectNodes.length; i++){
        //   let objNode = objectNodes[i]
        //   objNode.pos = [startX, startY]
        //   if(linkAniWidth < objNode.width){
        //     linkAniWidth = objNode.width
        //   }
        //   startX += objNode.width + 3
        //   let rowY = startY
        //   let linkNodes = objNode.getOutputNodes(0)
        //   for(let j = 0; j < linkNodes.length; j++){
        //     let linkNode = linkNodes[j]
        //     linkNode.pos = [startX, startY]
        //     startY += linkNode.height + '3'
        //   }
        //   startX += linkAniWidth + 3
        //   startY = rowY
        // }
        // for(var i = 0; i < nodes.length; i++){
        //   let node = nodes[i]
          
        // }
        let loopCheek = ()=>{
          let hasOverlap = false
          for(let i = 0; i < graph.nodes.length; i++){
            let node = graph.nodes[i]
            for(let j = 0; j < graph.nodes.length; j++){
              let outherNode = graph.nodes[j]
              if(outherNode.id == node.id){
                continue
              }
              if(overlapBounding(node.boundingRect, outherNode.boundingRect)){
                // console.log('两个节点香蕉了', node, outherNode)
                // node.pos = [node.pos[0] + 2, node.pos[1] + 2]
                //整体像右下角扩张，只移动更靠右下角的节点
                if(node.pos[0] <= outherNode.pos[0]){
                  outherNode.pos = [outherNode.pos[0] + 11,  outherNode.pos[1]]
                  // node.pos = [node.pos[0] - 9,  node.pos[1]]
                }else{
                  node.pos = [node.pos[0] + 11,  node.pos[1]]
                  // outherNode.pos = [outherNode.pos[0] - 9,  outherNode.pos[1]]
                }
                if(node.pos[1] <= outherNode.pos[1]){
                  outherNode.pos = [outherNode.pos[0],  outherNode.pos[1] + 10]
                }else{
                  node.pos = [node.pos[0] ,  node.pos[1] + 10]
                }
                hasOverlap = true
              }
            }
          }
          graph.setDirtyCanvas(true, true)
          if(hasOverlap == true){
            setTimeout(() => {
              loopCheek()
            }, 10);
            //  loopCheek()
          }
        }
        loopCheek()
      }else if(event.key == 'layoutNodesJustX'){
        var graph = this.getCurEditLGraph()
        let loopCheek = ()=>{
          let hasOverlap = false
          for(let i = 0; i < graph.nodes.length; i++){
            let node = graph.nodes[i]
            for(let j = 0; j < graph.nodes.length; j++){
              let outherNode = graph.nodes[j]
              if(outherNode.id == node.id){
                continue
              }
              if(overlapBounding(node.boundingRect, outherNode.boundingRect)){
                // console.log('两个节点香蕉了', node, outherNode)
                // node.pos = [node.pos[0] + 2, node.pos[1] + 2]
                //整体像右下角扩张，只移动更靠右下角的节点
                if(node.pos[0] <= outherNode.pos[0]){
                  outherNode.pos = [outherNode.pos[0] + 3,  outherNode.pos[1]]
                  // node.pos = [node.pos[0] - 9,  node.pos[1]]
                }else{
                  node.pos = [node.pos[0] + 3,  node.pos[1]]
                  // outherNode.pos = [outherNode.pos[0] - 9,  outherNode.pos[1]]
                }
                // if(node.pos[1] <= outherNode.pos[1]){
                //   outherNode.pos = [outherNode.pos[0],  outherNode.pos[1] + 10]
                // }else{
                //   node.pos = [node.pos[0] ,  node.pos[1] + 10]
                // }
                hasOverlap = true
              }
            }
          }
          graph.setDirtyCanvas(true, true)
          if(hasOverlap == true){
            setTimeout(() => {
              loopCheek()
            }, 10);
            //  loopCheek()
          }
        }
        loopCheek()
      }else if(event.key == 'girdNodes'){
        var graph = this.getCurEditLGraph()
        // graph.arrange(100, 'vertical') //排列方式比较单一，就是横排或竖排

        //将简单节点移动到所有节点最下方，防止重叠
        if(graph.nodes.length == 0){
          return
        }

        let maxY = 0
        // [x, y, width, height]
        const bounds = createBounds(graph.nodes) 
        let startX = 0
        let startY = bounds[1] + bounds[3] + 50

        var objectNodes = graph.findNodesByType('objects/createObject')
        //按照层级顺序排列
        objectNodes.sort((a, b)=>{
          return a.properties.zIndex - b.properties.zIndex
        })
        for(var i = 0; i < objectNodes.length; i++){
          let objNode = objectNodes[i]
          let linkNodes = objNode.getOutputNodes(0) || []
          //判断是否简单连接
          let isSampleLink = true
          for(let j = 0; j < linkNodes.length; j++){
            let linkNode = linkNodes[j]
            if(linkNode.isAnyOutputConnected()){
              isSampleLink = false
              break
            }
            for(var k = 1; k < linkNode.inputs.length; k++){
              if(linkNode.getInputLink(k) != null){
                isSampleLink = false
                break
              }
            }
          }
          if(isSampleLink == true){
            objNode.pos = [startX, startY]
            let linkAniWidth = 0
            startX += objNode.width + 3
            let rowY = startY
            for(let j = 0; j < linkNodes.length; j++){
              let linkNode = linkNodes[j]
              linkNode.pos = [startX, startY]
              startY += linkNode.height + 3
              if(linkAniWidth < linkNode.width){
                linkAniWidth = linkNode.width
              }
              if(maxY < startY){
                maxY = startY
              }
            }
            startX += linkAniWidth + 3
            startY = rowY
            if(maxY < startY + objNode.height){
              maxY = startY + objNode.height
            }
          }else{
            //不修改物体节点位置，只把关联物体的节点和物体对齐
            // let rowY = objNode.pos[1]
            // for(let j = 0; j < linkNodes.length; j++){
            //   let linkNode = linkNodes[j]
            //   linkNode.pos = [objNode.pos[0] + objNode.width + 3, rowY]
            //   rowY += linkNode.height + 3
            //   if(maxY < rowY + linkNode.height){
            //     maxY = rowY + linkNode.height
            //   }
            // }
          }
        }

        //将动画事件音频排列到再下一列
        let soundNodes = graph.findNodesByType('output/sound')
        startX = 0
        startY = maxY + 100
        // console.log('找到soundNodes', soundNodes)
        for(var i = 0; i < soundNodes.length; i++){
          let soundNode = soundNodes[i]
          if(soundNode.isAnyOutputConnected() == false && soundNode.isAnyInputConnected() == false){
            soundNode.pos = [startX, startY]
            startX += soundNode.width + 5
          }
        }
      }else if(event.key.indexOf('expandAll') != -1 || event.key.indexOf('collapseAll') != -1){
        var splitType = event.key.split('_')
        var checkState = splitType[0] == 'expandAll' ? true : false
        var nodeType = splitType[1]
        
        var graph = this.getCurEditLGraph()
        let nodes = graph.nodes
        if(nodeType != null){
          nodes = graph.findNodesByType(nodeType)
        }

        for(var i = 0; i < nodes.length; i++){
          let node = nodes[i]
          if(node.collapsed == checkState){
            node.collapse()
          }
        }
      }else if(event.key == 'deleteNode'){
        let target = targetRowRecord[columnKey][index]
        if(target != null){
            var graph = this.getCurEditLGraph()
            let node = graph.getNodeById(target.id)
            graph.remove(node)
            targetRowRecord[columnKey].splice(index, 1)
        }
      }else if(event.key == 'copyNode'){
        let target = targetRowRecord[columnKey][index]
        if(target != null){
          this.copyedNode = {
            type: target.type,
            //暂时不需要记录参数
            // properties: LiteGraph.cloneObject(target.properties)
          }
        }else{
          this.$message.info('没有可复制的指令')
        }
      }else if(event.key == 'pasteNode'){
        // let target = targetRowRecord[columnKey][index]
        //直接调用创建节点
        if(this.copyedNode.type != null){
          this.onClickMenuItem({key: this.copyedNode.type}, targetRowRecord, columnKey, index)
        }else{
          this.$message.info('没有可粘贴的指令')
        }
      }else if(event.key == 'topMenus'){

      }else if(event.key == 'toggleToGraph'){
        let target = targetRowRecord[columnKey][index]
        if(target != null){
            this.toggleNodeIdToGraph(target.id)
        }
      }else if(event.key == 'createMotionText'){
        //创建字幕
        this.showCreateMotionTextModal = true
      }else if(event.key == 'soundBox' || event.key == 'spineBox' || event.key == 'imageBox'){        
        this.curShowAssestBoxType = event.key
        this.freshAssestBoxData()
        this.showSoundBoxModal = true
      }else{
        var graph = this.getCurEditLGraph()
        let targetObject = null
        if(targetRowRecord != null){
          targetObject = graph.getNodeById(targetRowRecord.id)
        }
        let added = this.addNodeToGraph(event.key, targetObject)
        if(added == null){
          return
        }
        // if(topMenu == 'chengeMenus'){
        //   //需要删除旧的选项
        // }else if(topMenu == 'addMenus'){
        //   //不需要删除旧的选项
        // }

        if(event.initProp != null){
          for(var key in event.initProp){
            added.setProperty(key, event.initProp[key])
          }
          if(added.onWidgetChanged != null){
            added.onWidgetChanged('物体类型')
          }
        }

        if(targetObject != null){
          let soltIndex = added.findSlotByType(true, 'codeNode')
          if(soltIndex != -1){

            // let target = targetRowRecord[columnKey]
            // if(target != null){
            //   let node = graph.getNodeById(target.id)
            //   graph.remove(node)
            //   delete targetRowRecord[columnKey]
            // }

            targetObject.connect(0, added, soltIndex)
          }else{
            // graph.remove(added)
            // this.$message.error('选择的规则无法直接和物体链接')
          }
        }

        if(targetRowRecord != null){
          let newlinkNode = this.genOneNodeToTableCell(added)
          targetRowRecord[columnKey].push(newlinkNode)
        }

        // if(columnKey == 'linkNode_1'){
        //   if(added.properties.autoRun != null && added.getInputDataType(0) == 'codeNode'){
        //     added.setProperty('autoRun', true)
        //   }
        // }

        //如果当前在表格模式下，需要做的特殊操作
        if(this.ruleChooseTabOption == '表格'){
          if(targetRowRecord == null){
            this.getCurEditLgraphTable()
          }else if(event.key == 'objects/createObject'){
            this.getCurEditLgraphTable()
          }else if(event.key == 'output/tips/showHandTip'){
            this.getCurEditLgraphTable()
          }else if(event.key == 'objects/camera'){
            this.getCurEditLgraphTable()
          }
        }

        //同时看看是否可以连接上一个指令的事件输入
        // let upColumnIndex = columnKey.split('_')[1]
        // let upColumnKey = 'linkNode_' + (Number(columnKey.split('_')[1]) - 1)
        // if(targetRowRecord[upColumnKey] != null){
        //     //有上一个，看看是否可以连接到上一个
        //     let upNode = graph.getNodeById(targetRowRecord[upColumnKey].id)
        //     let config = Rules.arrToDit(targetRowRecord[upColumnKey].config, 'key', 'value')
        //     if(config.spe_output != null){
        //       let soltIndex = config.spe_output
        //       console.log('soltIndex', soltIndex, Number(soltIndex))
        //       if(Number(soltIndex) >= 0){
        //         //如果是动画节点，都可以绑定到触发点1，其它节点暂不考虑
        //         let playSoltResult = added.findInputByType(LiteGraph.ACTION)
        //         if(playSoltResult != null && playSoltResult.index != -1){
        //           let playSoltIndex = playSoltResult.index
        //           upNode.connect(soltIndex, added, playSoltIndex)
        //         }else{
        //           console.warn('此规则没有可以链接的输入点')
        //         }
        //       }
        //     }else{
        //       // graph.remove(added)
        //       // this.$message.error('选择的规则无法在当前单元格进行链接')
        //     }
        // }
      }
    },

    freshAssestBoxData(){
        let justCurrentPage = this.justCurrentPage
        if(this.curShowAssestBoxType == 'soundBox'){
          this.soundBoxDatas = this.getResArr(['sound'], false, justCurrentPage)
        }else if(this.curShowAssestBoxType == 'spineBox'){
          this.soundBoxDatas = this.getResArr(['spine'], false, justCurrentPage)
        }else if(this.curShowAssestBoxType == 'imageBox'){
          this.soundBoxDatas = this.getResArr(['sprite'], false, justCurrentPage)
        }
    },

    //onBtnDeleteTableRow
    onBtnDeleteTableRow(rowIndex, row){
      console.log('点击删除row' ,rowIndex, row)
      var graph = this.getCurEditLGraph()
      for(var key in row){
        if(key.indexOf('linkNode') != -1){
          for(var i = 0; i < row[key].length; i++){
            let nodeObj = row[key][i]
            let node = graph.getNodeById(nodeObj.id)
            if(node != null){
              if(node.getInputDataType(0) == 'codeNode'){
                //只删除关联物体的指令，其余指令可能还会被其它逻辑引用
                let inputNode = node.getInputNode(0)
                if(inputNode != null){
                  if(inputNode.id == row.id){
                    graph.remove(node)
                  }
                }
              }
            }
          }
        }
      }
      let rowNode = graph.getNodeById(row.id)
      if(rowNode != null){
        graph.remove(rowNode)
      }
      this.getCurEditLgraphTable()
    }, 

    toggleNodeIdToGraph(id){
      var graph = this.getCurEditLGraph()
      let node = graph.getNodeById(id)
      if(node != null){
        this.ruleChooseTabOption = '蓝图'
        node.selected = true
        if(node.onSelected){
          node.onSelected()
        }
        if(node.collapsed){
          node.collapse()
        }
        let bounds = createBounds([node]) //
        this.lgcanvas.animateToBounds(bounds, {zoom: 1})
      }
    },

    //菜单状态是否切换
    onMenuOpenChange(opendMenuKeys){
      // console.log('eveen', event)
      if(opendMenuKeys.length == 0){
        // this.highlightNodeDit = {}
        this.isShowMenu = false
      }else{
        this.isShowMenu = true
      }
    },

    onClickChangeShowView(index){
      this.curOpenLayout[index] = !this.curOpenLayout[index]
      localStorage.setItem('BookEdit_curOpenLayout', JSON.stringify(this.curOpenLayout))
      this.$nextTick(()=>{
        this.calculateHeight()
      })
    },

    //获取绘本列表
    getProjectOptions(){
      // console.log("modelTableDatas", this.modelTableDatas)
      return this.modelTableDatas.map((item)=>{
        return {value: item.name, label: item.name}
      })
    },

    addItems (count = 1) {
      for (let i = 0; i < count; i++) {
        this.items.push({
          text: Math.random() * 1000 + '随机数字',
          id: this.items.length + 1,
        })
      }
      this.scrollToBottom()
    },

    scrollToBottom () {
      // this.$refs.scroller.scrollToBottom()
    },


    onSymbolInput(e){
      console.log('onInputSymbol', e)
      this.inputSymbol = e
    },

    onChangeDataPicker(e){
      console.log('onChangeDataPicker', e)
      var startTime = e[0].format('YYYY/MM/DD')
      var endTime =  e[1].format('YYYY/MM/DD')
      this.inputSymbolDate = startTime + '-' + endTime
    },

    //计算相关高度
    calculateHeight(){
        var tabObj = document.getElementById('tabHtml')
        var navObj = tabObj.getElementsByClassName('ant-tabs-nav')[0]
        // var canvasCard = document.getElementById('canvasCard')
        // console.log('canvasCard', canvasCard)

        var padding = 10 //card body的padding
        var gapMidle = 5
        var cardTitleHeight = 38

        // if(canvasCard != null){
        //   // console.log('canvasWidth', this.canvasWidth)
        // }

        if(navObj != null){
          var tabHeight = navObj.getBoundingClientRect().height
          // console.log('tabHeight', tabHeight)
          this.workSpaceHeight = this.screenHeight - tabHeight

          var huiceConfigCard = document.getElementById('canvasCard')
          var leftFlexView = document.getElementById('leftFlexView')
          let previewCard = document.getElementById('huiceConfigCard')
          // console.log('huiceConfigCard', huiceConfigCard)
          let previewCardRect = previewCard.getBoundingClientRect()

          this.celueEditBodyHeight = this.workSpaceHeight - padding * 2  - cardTitleHeight
          this.canvasWidth = this.screenWidth - padding * 2 - 2
          if(leftFlexView != null){
            var leftFlexViewRect = leftFlexView.getBoundingClientRect()
            this.canvasWidth = this.screenWidth - leftFlexViewRect.width - padding * 3 
          }
          if(huiceConfigCard != null){
            var huiceConfigCardRect = huiceConfigCard.getBoundingClientRect()
            // console.log('huiceConfigCardRect', huiceConfigCardRect)

            var headerObj = huiceConfigCard.getElementsByClassName('ant-card-head')[0]  //卡片头高度
            if(headerObj != null){
              var celueLiebiaoCardRect = headerObj.getBoundingClientRect()  //卡片标题高度
              //  console.log('查看数据', this.workSpaceHeight, huiceConfigCardRect.height)
              // console.log('查看数据', this.workSpaceHeight, previewCardRect.height, gapMidle, celueLiebiaoCardRect.height, padding)
              this.celueLiebiaoBodyHeight = this.workSpaceHeight - previewCardRect.height - gapMidle - celueLiebiaoCardRect.height - padding * 2 - 1
              
              //大canvas的高度
              this.canvasHeight = this.workSpaceHeight - celueLiebiaoCardRect.height - padding * 2 - 1
              // console.log('celueLiebiaoBodyHeight', this.celueLiebiaoBodyHeight)
            }
            // var celueLiebiaoCard = document.getElementById('canvasCard')
            // if(celueLiebiaoCard != null){
              
            // }
          }
        }else{
          console.warn('navObj == null')
        }
    },

    //获取卡片经过flex布局拉伸后的高度
    getCardBodyHeight(id){
      var htmlobj = document.getElementById(id)
      var returnHeight = 0
      if(htmlobj != null){
        var bodyObj = htmlobj.getElementsByClassName('ant-card-head')[0]
        if(bodyObj != null){
          var cardRect = htmlobj.getBoundingClientRect()
          var bound = bodyObj.getBoundingClientRect()
          // console.log('htmlobj',htmlobj, bodyObj, bound.height)
          this[id + 'Height'] = cardRect.height - bound.height - 10
          console.log('getCardBodyHeight', this[id + 'Height'])
        }
      }else{
        this.$nextTick(()=>{
          var htmlobj = document.getElementById(id)
          if(htmlobj != null){
            var bodyObj = htmlobj.getElementsByClassName('ant-card-body')[0]
            if(bodyObj != null){
              var cardRect = htmlobj.getBoundingClientRect()
              var bound = bodyObj.getBoundingClientRect()
              this[id + 'Height'] = cardRect.height - bound.height - 10
              console.log('getCardBodyHeight', this[id + 'Height'])
            }
          }else{
            //等待了1秒还是没有找到Height
            console.log('等待了1秒还是没有找到height')
          }
        })
      }
      return returnHeight
    }, 


    handleSortTagChange(e){
      console.log('handleSortTagChange', e, this.sortTableDatas)
    },


    //选择y轴数据填充
    handleYkeyChoose(e, y){
        var selectKey = e.key   //这里传入的是unsingInputDataKeys的下标
        var selectRow = y
        this.girdMap['y_' + selectRow] = selectKey
        console.log('y_' + selectRow, selectKey)
    },

    //规则编辑器聚焦
    onRuleEditFocus(e){
      console.log('onRuleEditFocus', e)
      this.curEditSortRule = e
    },

    insertRuleText(text, type){
      if(this.curEditSortRule == null){
        return
      }
      var index = this.sortTableDatas.findIndex((item)=>{
        return item.name == this.curEditSortRule
      })
      if(index > -1){
        if(this.sortTableDatas[index].codeMirror != null){
          this.sortTableDatas[index].codeMirror.insertText(text, type)
        }
      }
    },



    /**
     * @description 鼠标悬停展示函数描述
    */
    hoverFn(data){
      this.curFnInfo = functionDescription[data]
      console.log('hoverFn',this.curFnInfo)
    },

    //插入方法
    insertFn(data){
      if (!data.children) {
        this.insertRuleText(`${data.title}`, "fn");
      }
    },


    async run() {
    },

    //创建一个绘本
    async onBtnCreateModel(copyTargetJson, projectName){
      projectName += ''
      var name = projectName.replace(/\s/g, '');
      if(name == TableDataSaveKey){
        this.$message.error('绘本编号不能为预置字符串')
        return false
      }
      if(name == ''){
        this.$message.error('绘本编号为空')
        return false
      }
      var index = this.modelTableDatas.findIndex((item)=>{
        return item.name == projectName
      })
      if(index >= 0){
        this.$message.error('当前已存在绘本：' + projectName)
        return false
      }
      var modeJson = {
        key: projectName,   
        name: projectName,   //关联的模型名称
        des: this.inputModelDes != '' ? this.inputModelDes : ('创建时间：' + moment().format("YYYY/MM/DD HH:mm:ss")),
        createTime: moment().format("YYYY/MM/DD HH:mm:ss"),
        //一个绘本包含一系列规则，其中创建时包含一个默认策略
        policyList: [
          // {name: '页面一'}
        ], 
        config: {
          //其它的一些配置，这里暂时不保存规则了
        },
        // accuracy: '暂无回测结果',  //训练结果，每个分类的准确率，loss
      }
      if(copyTargetJson != null ){
        modeJson.config = copyTargetJson.config
        modeJson.policyList = copyTargetJson.policyList
      }

      // console.log('copyTargetJson', copyTargetJson)
      // console.log('modeJson', copyTargetJson)

      //同时保存详细
      await this.setToLocalOrCloud(POLICYKEY + modeJson.name, JSON.parse(JSON.stringify(modeJson)))
      this.modelTableDatas.push(modeJson)
      await this.saveTableData()
      return true
      // await set(TableDataSaveKey, JSON.parse(JSON.stringify(this.modelTableDatas)))
    },

       //点击复制绘本
    async onBtnCopyModel(name){
      let copyFromIndex = this.modelTableDatas.findIndex((item)=>{
        return item.name == name
      })
      if(copyFromIndex == -1){
        return
      }
      var copyTarget = this.modelTableDatas[copyFromIndex]
      if(copyTarget != null && copyTarget.name != null){
        var copyTargetJson = await this.getFromLocalOrCloud(POLICYKEY + copyTarget.name)
      }
      this.onBtnCreateModel(copyTargetJson, this.newProjectName)
    },


    //点击重命名绘本
    async onBtnRenameProject(name){
      var newNameIndex = this.modelTableDatas.findIndex((item)=>{
        return item.name == this.newProjectName
      })
      if(newNameIndex != -1){
        message.error('重命名失败，已存在绘本：' + this.newProjectName)
        return
      }
      var index = this.modelTableDatas.findIndex((item)=>{
        return item.name == name
      })
      if(index == -1){
        return
      }
      try {
          var modeJson = await this.getFromLocalOrCloud(POLICYKEY + this.modelTableDatas[index].name)
          await this.delToLocalOrCloud(POLICYKEY + this.modelTableDatas[index].name)
          modeJson.name = this.newProjectName
          modeJson.key = this.newProjectName
          await this.setToLocalOrCloud(POLICYKEY + this.newProjectName, modeJson)
      } catch (error) {
        message.error('重命名失败：' + error)
        return
      }

      this.modelTableDatas[index].name = this.newProjectName
      this.saveTableData()
    },

    getCoverUrl(record){
      if(record.cover == null || record.cover == ''){
        return  'https://cdn.goowee.cn/appres/bookcover/' + record.name + '.png'
      }
      return CocosMgr.rootHost + '/' + record.cover
    },

    handleChangeCover(info){
      console.log('handleChangeCover', info)
    },

    handleDropCover(e){
      console.log('handleDropCover',e);
    },

    handleUploadCover(e){
      console.log('handleUploadCover',e);
      return true
    },

    async onConfigChangeSave(record){
      record.config = Rules.arrToDit(this.huiceConfig, 'key', 'value')
      var modeJson = await this.getFromLocalOrCloud(POLICYKEY + record.name)
      modeJson.config = record.config
      await this.setToLocalOrCloud(POLICYKEY + record.name, modeJson)
      this.saveTableData()
      //在首页修改了绘本配置，如果修改的绘本已经打开标签页，需要更新标签页中的设置，否则标签页保存是会被覆盖
      var index = menuItems.value.findIndex((item)=>{
        return item.key == record.name
      })
      if(index != -1){
        // this.$message.info('当前已经打开：' + name)
        //直接跳转到
        // console.log('当前打开的标签页', menuItems.value[index])
        menuItems.value[index].modeJson.config = record.config
      }
    },

    //点击修改配置信息
    onClickTableConfig(record){
      console.log('onClickTableConfig', record.config)
      if(record.config != null){
        for(var i = 0; i < this.huiceConfig.length; i++){
          var key = this.huiceConfig[i].key
          if(record.config[key] != null){
            this.huiceConfig[i].value = record.config[key] 
          }
        }
      }
    },

    //修改绘本备注
    async onBtnEditProjectDes(name){
      var index = this.modelTableDatas.findIndex((item)=>{
        return item.name == name
      })
      if(index == -1){
        return
      }
      this.modelTableDatas[index].des = this.inputModelDes
      //仅仅作为项目描述，不作为绘本简介
      // var modeJson = await this.getFromLocalOrCloud(POLICYKEY + name)
      // if(modeJson != null){
      //   modeJson.des = this.inputModelDes
      //   await set(POLICYKEY + name, modeJson)
      // }
      this.saveTableData()
    },

    //viewCode到codeNode转换
    robotToGraphNode(robot){
      //robot格式
      // let robot = {
      //   config: {key: '', otherConfig: ''},
      //   id: 1,
      //   linkDatas: {
      //     cardacSolt: [
      //       {solt: '', robot: 2, otherSolt: ''}
      //     ],
      //     cardexSolt: [],
      //     inputSolt: {
      //       soltkey:{solt: '', sort: 1, robot: 101, otherSolt: ''}
      //     },
      //     outputSolt: {}
      //   },
      //   nodeValue: {x: -570, y: -273, width: 306, height: 395}
      // }
      if(CocosMgr.robotNodeEnum[robot.config.key] != null){
        let node = LiteGraph.createNode(CocosMgr.robotNodeEnum[robot.config.key])

        //同步其它设置
        for(var key in robot.config.otherConfig){
          let value = robot.config.otherConfig[key]
          if(node.properties[key] != null){
            //对enum特殊处理
            let widget = node.widgets.find((item)=>{
              return item.options.property == key
            })
            if(widget != null){
              if(widget.type == 'combo'){
                if(Array.isArray(widget.options.values)){
                  if(widget.options.values[value] != null){
                    value = widget.options.values[value]
                  }else{
                    console.warn('widget没有对应的值', key, value)
                  }
                }
              }
            }
            if(robot.config.key == 'sound'){
              if(key == 'loop'){
                value = !value
              }else if(key == 'volume'){
                value = value * 0.1
              }
            }
            if(robot.config.key == 'createObject'){
              if(key == 'scaleX' || key == 'scaleY' || key == 'anchorX' || key == 'anchorY'){
                value = value * 0.1
              }
              if(key == 'color' || key == 'outLineColor'){
                value = '#' + value
              }
            }

            if(robot.config.key == 'camera'){
              if(key == 'zoomRatio'){
                value = value * 0.1
              }
            }
            if(robot.config.key == 'animate'){
              if(key == 'timeScale'){
                value = value * 0.1
              }
              if(key == 'loop' || key == 'cancelEvent' || key == 'aniEndCanClick'){
                value = !value
              }
            }
            if(robot.config.key == 'touchEnd'){
              if(key == 'listernTouchCancel'){
                value = !value
              }
            }
            if(robot.config.key == 'tween'){
              if(key == 'cancelEvent'){
                value = !value
              }
              if(key == 'delay' || key == 'duration' || key == 'scaleX' || key == 'scaleY' || key == 'zoomRatio'){
                value = value * 0.1
              }
            }
            if(robot.config.key == 'bezierCurve'){
              if(key == 'duration'){
                value = value * 0.1
              }
              if(key == 'startResetT'){
                value = !value
              }
            }
            if(robot.config.key == 'showHandTip'){
              if(key == 'scale'){
                value = value * 0.1
              }
            }
            node.setProperty(key, value)
          }else{
            console.warn('node没有对应配置', key, robot.config.key, robot.config.otherConfig[key])
          }
          //如果类型是enum是否需要特殊处理？
        }
        if(robot.config.key == 'tween'){
          if(robot.config.otherConfig['tweenMode'] == 1){
            //原来的tween没有这些配置，将其设置为0
            node.setProperty('anchorX', 0)
            node.setProperty('anchorY', 0)
            node.setProperty('width', 0)
            node.setProperty('height', 0)
          }
        }
        return node
      }else{
        console.warn('没有对应的graphNode', robot.config.key)
      }
      return null
    },

    filterPageList(pageJsonList){
      return pageJsonList.filter((item)=>{
        let ex = item.split('.')
        if(ex[ex.length  - 1] != 'json'){
          return false
        }
        if(item.indexOf('_std') != -1){
          //过滤掉无剧情版本的
          return false
        }
        if(item.indexOf('_') == -1){
          return false
        }
        if(item.indexOf('_kepu') != -1){
          //过滤掉科普json
          return false
        }
        // if(item.indexOf('p1') == -1){
        //   return false
        // }
        return true
      }).sort((a, b)=>{
          let indexa = a.indexOf('p') + 1
          let indexaEnd = a.indexOf('.')
          let numa = a.substring(indexa, indexaEnd)

          let indexb = b.indexOf('p') + 1
          let indexbEnd = b.indexOf('.')
          let numb = b.substring(indexb, indexbEnd)
          // console.log(indexa, numa, indexb, numb)
          return Number(numa) - Number(numb) 
      })
    },

    onFreshCanImportPage(){
      if(window.require == null){
         this.$message.warn('此功能仅在桌面版可用，网页版无法使用')
        return
      }
      let fs = window.require('fs')
      let config = Rules.arrToDit(this.importOldVersionConfig, 'key', 'value')
      let  pageJsonList  = []
      if(fs.existsSync(config.bookFolder + '/json') == true){
        // this.$message.error('所选目录下json文件夹不存在')
        pageJsonList = fs.readdirSync(config.bookFolder + '/json')
        pageJsonList = this.filterPageList(pageJsonList)
      }
      this.importPageOptions = pageJsonList
      this.importCheckedPageList = pageJsonList
      this.importCheckAll = true
      this.importCheckedIndeterminate = false
    },

    onImportOldVersionConfigChange(key){
      if(key == 'bookFolder'){
        this.onFreshCanImportPage()
      }
    },

    //导入页面点击
    onImportPageCheck(){
      this.importCheckedIndeterminate = !!this.importCheckedPageList.length && this.importCheckedPageList.length < this.importPageOptions.length;
      this.importCheckAll = this.importCheckedPageList.length === this.importPageOptions.length;
      // console.log('onImportPageCheck',this.importCheckedPageList,  this.importCheckAll , this.importCheckedIndeterminate)
    },

    onCheckAllChange(e){
      this.importCheckedPageList = e.target.checked ? this.importPageOptions : []
      this.importCheckedIndeterminate = false
      this.importCheckAll = e.target.checked
      console.log(this.importCheckedPageList)
      // Object.assign(this, {
      //   importCheckedIndeterminate: false,
      //   importCheckAll: e.target.checked,
      // });
    },

    //导入从文件加载的绘本
    async handleOkImport(){
      // var result = await this.onBtnCreateModel(this.waitImportProject, this.newProjectName)
      // if(result == true){
      //   this.importModelOpen = false
        
      //   this.waitImportProject = null
      // }
      //这里要导入并创建新的绘本，如果已经存在，不重复导入
      if(window.require == null){
         this.$message.warn('此功能仅在桌面版可用，网页版无法使用')
        return
      }
      let fs = window.require('fs')
      let config = Rules.arrToDit(this.importOldVersionConfig, 'key', 'value')
        
      // readdirSync existsSync
      // /Users/yaowei/Documents/work/tataread2026/assets/bundleStory/880012
      let needFolders = ['image', 'sound', 'spine'] //'image', 'sound', 'spine', 'json'
      //校验是否是绘本文件夹
      if(fs.existsSync(config.bookFolder + '/json') == false){
        this.$message.error('所选目录下json文件夹不存在')
        return 
      }
      //spine文件需要特殊操作，获取其中包含的音频事件
      for(var i = 0 ; i < needFolders.length; i++){
        let folder = config.bookFolder + '/' + needFolders[i]
        if(fs.existsSync(folder) == false){
          this.$message.error('所选目录下' + needFolders[i] + '文件夹不存在')
          return 
        }
      }
      //是绘本文件夹，先上传所有资源，方便之后使用
      let assetsList = []
      let spineEventSound = {}
      for(var i = 0 ; i < needFolders.length; i++){
        let folder = config.bookFolder + '/' + needFolders[i]
        let fileList = fs.readdirSync(folder)
        fileList = fileList.filter((item)=>{
          return item.indexOf('.meta') == -1
        }).map((item)=>{
          return {
            name: CocosMgr.getName(item), 
            path: config.bookFolder + '/' + needFolders[i] + '/' + item
          }
        })
        if(needFolders[i] == 'spine'){
          for(var j = 0; j < fileList.length; j++){
            if(fileList[j].path.indexOf('.json') != -1){
              let spineJson = JSON.parse(fs.readFileSync(fileList[j].path, 'utf-8'))
              if(spineJson.events != null){
                for(var eventKey in spineJson.events){
                  if(spineEventSound[CocosMgr.getBaseName(fileList[j].name)] == null){
                    spineEventSound[CocosMgr.getBaseName(fileList[j].name)] = []
                  }
                  spineEventSound[CocosMgr.getBaseName(fileList[j].name)].push(eventKey)
                }
              }
              // console.log('spineJson', spineJson)
            }
          }
        }
        assetsList = assetsList.concat(fileList)
      }

      let fileGroup = await this.prepareDealFiles(assetsList) //仅仅上传文件，不自动创建节点
      // console.log('上传文件的结果', fileGroup)
      let filesDit = {}
      for(let i = 0; i < fileGroup.length; i++){
        filesDit[fileGroup[i].name] = fileGroup[i].path
      }
      console.log('filesDit', filesDit)
      console.log('spineEventSound', spineEventSound)

      //读取所有页面json文件
      let newGraphList = []
      // let pageJsonList = fs.readdirSync(config.bookFolder + '/json')
      // pageJsonList = this.filterPageList(pageJsonList)
      CocosMgr.changeRunInmportState(true)
      let pageJsonList = this.importCheckedPageList
      for(var i = 0; i < pageJsonList.length; i++){
        let oneJsonName = pageJsonList[i]
        let onePageJson = JSON.parse(fs.readFileSync(config.bookFolder + '/json/' + oneJsonName, 'utf-8'))
        // console.log('oneJsonName',oneJsonName, onePageJson)
        let graph = new LGraph();
        let robotIdToNodeId = {}
        let robotDit = {}
        for(let j = 0; j < onePageJson.length; j++){
          let robot = onePageJson[j]
          robotDit[robot.id] = robot
          let node = this.robotToGraphNode(robot)
          if(node != null){
            //如果有资源需要上传资源文件
            // robot.config.key
            if(robot.config.key == 'createObject'){
              let customeName = robot.config.otherConfig.customeName
              let modal =  robot.config.otherConfig.modal
              if(modal == 1){
                //图片类型
                if(filesDit[customeName] != null){
                  node.setProperty('customeName', filesDit[customeName])
                }else{
                  //收藏品可能使用bookres中的图片，现在也放到云端
                  if(customeName.indexOf('.') == -1){
                    customeName = customeName + '.png' 
                    node.setProperty('customeName', customeName)
                  }
                }
              }else if(modal == 3){
                //spine动画
                if(filesDit[customeName] != null){
                  node.setProperty('customeName', filesDit[customeName])
                }else{
                  if(customeName == 'P0_Common_Finger'){
                    node.setProperty('premulAlpha', false)
                  }
                }
                //是否有事件声音，如果有添加
                if(spineEventSound[customeName] != null){
                  for(var k = 0; k < spineEventSound[customeName].length; k++){
                    let soundEvent = spineEventSound[customeName][k]
                    if(filesDit[soundEvent] != null){
                      let soundNode = LiteGraph.createNode('output/sound')
                      soundNode.setProperty('customeName', filesDit[soundEvent])
                      graph.add(soundNode)
                      console.log('添加了声音节点', filesDit[soundEvent])
                    }
                  }
                }
              }
            }else if(robot.config.key == 'sound'){
              let customeName = robot.config.otherConfig.customeName
              if(filesDit[customeName] != null){
                node.setProperty('customeName', filesDit[customeName])
              }
            }
            //cocos中坐标系为右上，这里为右下，所以y要反着来
            node.pos = [robot.nodeValue.x, -robot.nodeValue.y]
            graph.add(node)
            robotIdToNodeId[robot.id] = node.id
          }
        }
        // console.log('robotIdToNodeId', robotIdToNodeId)
        //所有node创建完成后，设置连线
        for(let j = 0; j < onePageJson.length; j++){
          let robot = onePageJson[j]
          if(robotIdToNodeId[robot.id] != null){
            let node = graph.getNodeById(robotIdToNodeId[robot.id])
            let outputKeys = Object.keys(robot.linkDatas.outputSolt)
            for(let soltIndex = 0; soltIndex < outputKeys.length ; soltIndex++){
              let key = outputKeys[soltIndex]
              for(let n = 0; n < robot.linkDatas.outputSolt[key].length; n++){
                let link = robot.linkDatas.outputSolt[key][n]  // solt: 'number1', sort: 1, robot: 297, otherSolt: 'number1'
                // console.log('连接信息', link)
                let linkRobot = robotDit[link.robot]
                let keys = Object.keys(linkRobot.linkDatas.inputSolt)
                let inputSoltIndex = keys.indexOf(link.otherSolt)
                let bindNodeId = robotIdToNodeId[link.robot]
                // if(robot.config.key == 'lighting'){
                //   //特殊配置
                //   // node.addOutput()
                //   console.log('lighting连接信息', link)
                // }
                if(bindNodeId != null){
                  let bindNode = graph.getNodeById(bindNodeId)
                  if(link.otherSolt == "cardTopSolt"){
                    //直接新增一个节点来连接
                    bindNode.addOutput('被引用', 'lgraphNode')
                    bindNode.connect(bindNode.outputs.length - 1, node, soltIndex)
                  }else{
                    // console.log('bindNodeId', bindNodeId, bindNode)
                    if(bindNode.inputs[0] != null){
                      //共用了，所以 index + 1
                      if(bindNode.inputs[0].type == 'codeNode'){
                        inputSoltIndex += 1
                      }
                    }
                    console.log(robot.config.key, '准备连接节点', n, robot, bindNode, soltIndex, inputSoltIndex, bindNode.getInputDataType(0))
                    if(inputSoltIndex != -1){
                      node.connect(soltIndex, bindNode, inputSoltIndex)
                    }else{
                      // console.log('找不到对应旧版的节点',robot, linkRobot, key, n)
                    }
                  }
                }
              }
            }
            for(let soltIndex = 0; soltIndex < robot.linkDatas.cardacSolt.length; soltIndex++){
              let link = robot.linkDatas.cardacSolt[soltIndex]  // solt: 'number1', sort: 1, robot: 297, otherSolt: 'number1'
              let bindNodeId = robotIdToNodeId[link.robot]
              if(bindNodeId != null){
                let bindNode = graph.getNodeById(bindNodeId)
                let findeResultOfOutput = node.findOutputByType('codeNode')
                let findeResult = bindNode.findInputByType('codeNode')
                // console.log('准备重新绑定物体输出', findeResultOfOutput.index, bindNode, findeResult.index)
                if(findeResult != null && findeResultOfOutput != null){
                  if(findeResult.index != -1 && findeResultOfOutput.index != -1){
                    node.connect(findeResultOfOutput.index, bindNode, findeResult.index)
                  }
                }else{
                  
                }
              }
            }
            //部分节点会接收多个codeNode连接，次级关联物体，非主关联物体
            let needConnectExSoltNode = ['connection']
            if(needConnectExSoltNode.indexOf(robot.config.key) != -1){
              console.log('needConnectExSoltNode', robot)
              for(let soltIndex = 0; soltIndex < robot.linkDatas.cardacSolt.length; soltIndex++){
                let link = robot.linkDatas.cardacSolt[soltIndex] 
                let bindNodeId = robotIdToNodeId[link.robot]
                if(bindNodeId != null){
                  let bindNode = graph.getNodeById(bindNodeId)
                  let findeResultOfOutput = bindNode.findOutputByType('codeNode')
                  let findeResult = node.inputs.findIndex((solt)=>{
                    return solt.type == 'codeNode' && solt.link == null
                  })
                  // console.log('查找节点是否为空', findeResult)
                  if(findeResult == -1){
                    //额外添加一个结果
                    if(node.onGetInputs != null){
                      let exInputs = node.onGetInputs()
                      let index = exInputs.findIndex((item)=>{
                        return item[1] == 'codeNode'
                      })
                      if(index != -1){
                        node.addInput(exInputs[index][0], exInputs[index][1])
                        findeResult = node.inputs.length - 1
                      }
                    }
                  }
                  // console.log('准备重新绑定物体输出', findeResultOfOutput.index, bindNode, findeResult.index)
                  if(findeResult != -1 && findeResultOfOutput != null){
                    if(findeResultOfOutput.index != -1){
                      bindNode.connect(findeResultOfOutput.index, node, findeResult)
                    }
                  }
                }
              }
            }
          }
        }
        newGraphList.push(graph)
      }
      // console.log('pageJsonList', pageJsonList)
      console.log('newGraphList', newGraphList)
      //最后再创建
      var result = await this.onBtnCreateModel(null, config.bookId)
      if(result == true){
        let modelJson = await this.getFromLocalOrCloud(POLICYKEY + config.bookId)
        if(modelJson != null){
          modelJson.policyList = newGraphList.map((item, index)=>{
            return {name: pageJsonList[index] != null ? CocosMgr.getBaseName(pageJsonList[index]) : ('页面' + index), graphJson: item.asSerialisable()}
          })
          for(var i = 0; i < newGraphList.length; i++){
            newGraphList[i].clear()
          }
          CocosMgr.changeRunInmportState(false)
          await this.setToLocalOrCloud(POLICYKEY + config.bookId, modelJson)
          this.importModelOpen = false
        }else{
           CocosMgr.changeRunInmportState(false)
        }
      }else{
        CocosMgr.changeRunInmportState(false)
      }
    },


    //打开一个绘本
    async onBtnLoadModel(name){
      var index = menuItems.value.findIndex((item)=>{
        return item.key == name
      })
      if(index != -1){
        // this.$message.info('当前已经打开：' + name)
        //直接跳转到
        this.tabActiveKey = name
        return
      }
      var openIndex = this.modelTableDatas.findIndex((item)=>{
        return item.name == name
      })
      if(openIndex == -1){
        this.$message.info('列表中不存在绘本：' + name)
        return
      }
      // var modelJson = this.modelTableDatas[openIndex]
      var modelJson = await this.getFromLocalOrCloud(POLICYKEY + name)
      if(modelJson != null){
        console.log('当前打开的modeljson', modelJson)
        if(modelJson.policyList != null){
          //初始化页面是否激活状态
          modelJson.policyList.forEach((item)=>{
            if(item.active == null){
              item.active = true
            }
          })
        }
        menuItems.value.push({ title: modelJson.name, label: 'Content of new Tab ' + modelJson.name, key: modelJson.name, modeJson: modelJson });
        this.tabActiveKey = modelJson.name
      }else{
        this.$message.error('打开失败，绘本缺失：' + name)
      }
    },

  

    //获取当前选中策略运行时的某个状态
    getPolicyState(tabActiveKey, key){
      // if(key == 'dateArr'){
      //   console.log('界面访问了dateArr')
      // }
      if(tabActiveKey == null){
        tabActiveKey = this.tabActiveKey
      }
      var oneTabDit = this.curEditTabDit[tabActiveKey]
      if(oneTabDit == null){
        return null
      }
      if(oneTabDit.curSelectPolicy == ''){
        return null
      }
      if(oneTabDit.policyState[oneTabDit.curSelectPolicy] == null){
        oneTabDit.policyState[oneTabDit.curSelectPolicy] = {
          resultSymbolList: [],
          curSelectSymbolItem: {},
          progress: 0,
        }
      }
      


      if(key != null){
        var returnValue = oneTabDit.policyState[oneTabDit.curSelectPolicy][key]
        
        return returnValue
      }else{
        return oneTabDit.policyState[oneTabDit.curSelectPolicy]
      }
    },

    getPolicyStateByName(tabActiveKey, name, key){
      if(tabActiveKey == null){
        tabActiveKey = this.tabActiveKey
      }
      var oneTabDit = this.curEditTabDit[tabActiveKey]
      if(oneTabDit == null){
        return null
      }
      if(oneTabDit.policyState[name] == null){
        oneTabDit.policyState[name] = {
          resultSymbolList: [],
          curSelectSymbolItem: {},
          progress: 0,
        }
      }
      if(key != null){
        return oneTabDit.policyState[name][key]
      }else{
        return oneTabDit.policyState[name]
      }
    },

    //设置当前策略运行时的某个状态
    setPolicyState(tabActiveKey, key, value){
      if(tabActiveKey == null){
        tabActiveKey = this.tabActiveKey
      }
      var onePolicyState = this.getPolicyState(tabActiveKey)
      if(onePolicyState != null){
        onePolicyState[key] = value
      }
    },

    //
    setPolicyStateByName(tabActiveKey, name, key, value){
      if(tabActiveKey == null){
        tabActiveKey = this.tabActiveKey
      }
      var onePolicyState = this.getPolicyStateByName(tabActiveKey, name)
      // console.log("setPolicyStateByName", onePolicyState, tabActiveKey, name, key, value)
      if(onePolicyState != null){
        onePolicyState[key] = value
      }
    },

    //刷新当前界面编辑的绘本，目前只要切换了tabActiveKey就会触发
    freshCurEdit(){
      if(this.curEditTabDit[this.tabActiveKey] == null){
        this.curEditTabDit[this.tabActiveKey] = {
          policyList: [], //所有分镜列表
          curSelectPolicy: '',
          curEditRulesDit: {ruleOfSelect: [], ruleOfBuy: [], ruleOfSale: []},   //当前编辑的规则
          resultSymbolList: [],   //显示筛选结果股票列表  //已经整合到policyState
          curSelectSymbolItem: {}, //当前选中的股票       //已经整合到policyState
          policyState: [],
        }
      }
      // console.log('当前的resultSymbolList',  this.curEditTabDit[this.tabActiveKey].resultSymbolList)
      var modelJson = menuItems.value.find((item)=>{return item.key == this.tabActiveKey}).modeJson
      // this.resultSymbolList = this.curEditTabDit[this.tabActiveKey].resultSymbolList
      // console.log('当前切换显示页面的modeJson', modelJson)
      if(modelJson != null){
        // var config = modelJson.config  //旧版单一策略模式已经废弃
        if(modelJson.policyList != null){
          this.curEditTabDit[this.tabActiveKey].policyList = modelJson.policyList
          if(modelJson.policyList.length > 0 && this.curEditTabDit[this.tabActiveKey].curSelectPolicy == ''){
            // this.curEditTabDit[this.tabActiveKey].curSelectPolicy = modelJson.policyList[0].name
            this.onClickOnePolicy(modelJson.policyList[0])
          }
        }
        if(modelJson.config != null){
          for(var i = 0; i < this.huiceConfig.length; i++){
            var key = this.huiceConfig[i].key
            if(modelJson.config[key] != null){
              this.huiceConfig[i].value = modelJson.config[key] 
            }
          }
        }
      }
    },

    //保存当前策略
    saveCurEditRule(tabActiveKey){
      if(tabActiveKey == null){
        tabActiveKey = this.tabActiveKey
      }
      if(this.curEditTabDit[tabActiveKey] == null){
        console.warn('this.curEditTabDit[tabActiveKey] == null', tabActiveKey)
        return
      }
      if(this.curEditTabDit[tabActiveKey].curSelectPolicy != ''){
        var policyList = this.curEditTabDit[tabActiveKey].policyList
        var index = policyList.findIndex((item)=>{
          return item.name == this.curEditTabDit[tabActiveKey].curSelectPolicy
        })
        if(index != -1){
          //临时保存
          if(graphDit[tabActiveKey] != null && graphDit[tabActiveKey][this.curEditTabDit[tabActiveKey].curSelectPolicy] != null){
            var graph = graphDit[tabActiveKey][this.curEditTabDit[tabActiveKey].curSelectPolicy] 
            if(recordTouch.length != 0){
              if(this.configs.recordType == 'autoRecordTouch'){
                let autoRunNodes = graph.findNodesByType('output/autoRunRecordTouch')
                let autoRunNode = autoRunNodes[0]
                if(autoRunNode == null){
                  autoRunNode = LiteGraph.createNode('output/autoRunRecordTouch')
                  graph.add(autoRunNode)
                }
                autoRunNode.setProperty('recordTouch', JSON.parse(JSON.stringify(recordTouch)))
              }
              recordTouch = []
            }
            policyList[index].graphJson = graph.asSerialisable()
            // console.log('当前保存策略recordTouch', policyList[index].recordTouch)
          }
        }
      }
    },

    onChangeGraph(gamePath, orPageIndex, andRun){
      console.log('onChangeGraph ' , gamePath, orPageIndex)
      let policyList = this.curEditTabDit[this.tabActiveKey].policyList
      console.log('policyList', policyList)
      let hasJump = false
      if(orPageIndex >= 0 && policyList[orPageIndex] != null){
        hasJump = true
        this.onClickOnePolicy(policyList[orPageIndex])
      }else{
        let index = policyList.findIndex((item)=>{
          return item.name == gamePath
        })
        if(index != -1){
          hasJump = true
          this.onClickOnePolicy(policyList[index])
        }
      }
      if(hasJump == true && andRun){
        this.autoRunPolicy = true
        // this.$nextTick(()=>{
        //     this.onClickRunGraph()
        // })
      }
    },

    onGraphMenuClick(menuName, params){
      console.log('点击了菜单', menuName)
      if(menuName == 'editColider'){
        this.editColiderOpen = true
        this.editColiderImg = params.img
        this.pointArr = params.pointArr
        this.onMarkEditOk = params.onValueChange
        this.editColiderScale = params.scale
      }else if(menuName == 'editSoundText'){
        //编辑音频
        this.editSoundTextOpen = true
        this.editSoundTextParams = params
        this.editSoundTextParams.url = CocosMgr.rootHost + '/' + params.customeName
        // this.onSoundTextEditOk = params.onValueChange
      }else if(menuName == 'layoutNodesJustX'){
        this.onClickMenuItem({key:'layoutNodesJustX'})
      }
    },

    onSoundTextEditOk(data){
      this.editSoundTextOpen = false
      if(this.editSoundTextParams.onValueChange != null){
        this.editSoundTextParams.onValueChange(data)
      }
    },

    //当graph节点点击
    onGraphNodeClick(event){
      if(this.configs.recordType == 'autoRecordTouch'){
        //当前可以录制操作
        console.log('我收到点击事件', event)
        recordTouch.push(event)
      }
    },

    // onMarkEditOk(){

    // },
    handleOkCreateMotionText(){
       let object = this.addNodeToGraph("objects/createObject")
       let motionText = this.addNodeToGraph("output/customComponent/MotionText", object)
       let config = Rules.arrToDit(this.createMotionTextConfig, 'key', 'value')
       let graph = this.getCurEditLGraph()
       let nodes = graph.findNodesByType('objects/createObject')
       let zIndex = 99
       if(nodes != null){
        zIndex = nodes.length
       }
       object.setProperty('modal', '文本')
       object.setProperty('x', 0)
       object.setProperty('y', 0)
       object.setProperty('zIndex', zIndex)
       object.setProperty('color', '#000000')
       object.setProperty('anchorX', 0)
       object.setProperty('outLineWidth', 4)
       object.setProperty('string', config.content)
       object.onWidgetChanged('物体类型')
       object.connect(0, motionText, 0)
       this.showCreateMotionTextModal = false
    },

    //handleOkSoundMotionText
    handleOkSoundMotionText(){
      if(this.templeteAudio != null){
          this.templeteAudio.pause()
          this.templeteAudio.src = ''
      }
      this.showSoundBoxModal = false
    },

    //点击了分镜列表
    onClickOnePolicy(policy){
      // console.log('onClickOnePolicy', policy)
      this.saveCurEditRule()
      // if(this.curEditTabDit[this.tabActiveKey].curSelectPolicy != ''){
      //   //先将之前选中的图和canvas取消关联
      //   var graph = this.getPolicyState(this.tabActiveKey, 'graph')
      //   if(graph != null){
      //     graph.detachCanvas(this.lgcanvas)
      //   }
      // }
      this.clearCurEditLgragh()
      if(policy == null){
        //取消选择
        this.curEditTabDit[this.tabActiveKey].curSelectPolicy = ''
        return
      }
      //保存切换之前的数据
      this.curEditTabDit[this.tabActiveKey].curSelectPolicy = policy.name
      this.$nextTick(()=>{
        this.updateCurShowLGraph()
      })
    },

    //点击新建策略
    onClickAddPolicy(){
      var policyList = this.curEditTabDit[this.tabActiveKey].policyList

      if(isEmptyString(this.newPolicyName)){
        this.$message.error('分镜名称不能为空')
        return 
      }

      var index = policyList.findIndex((item)=>{ return item.name == this.newPolicyName})

      if(index != -1){
        this.$message.error('当前列表已经存在分镜名称：' + this.newPolicyName)
        return
      }
      var newPolicy = {name: this.newPolicyName}
      this.curEditTabDit[this.tabActiveKey].policyList.push(newPolicy)
      // this.curEditTabDit[this.tabActiveKey].curSelectPolicy = newPolicy.name
    },

    //点击拷贝策略
    async onClickCopyPolicy(){
      if(isEmptyString(this.newPolicyName)){
        this.$message.error('分镜名称不能为空')
        return 
      }
      
      var newPolicy = {name: this.newPolicyName}
      var policyList = this.curEditTabDit[this.tabActiveKey].policyList
      var indexCopy = policyList.findIndex((item)=>{ 
          return item.name == this.curEditTabDit[this.tabActiveKey].curSelectPolicy
      })
      if(indexCopy != -1){
        newPolicy = Rules.clone(policyList[indexCopy]) 
        newPolicy.name = this.newPolicyName
      }
      
      if(this.curEditTabDit[this.copyToProject] != null){
        var copyToPolicyList = this.curEditTabDit[this.copyToProject].policyList //拷贝到分镜列表
        var index = copyToPolicyList.findIndex((item)=>{ return item.name == this.newPolicyName})
        if(index != -1){
          // console.log('this.curEditTabDit[this.copyToProject]', this.curEditTabDit[this.copyToProject])
          this.$message.error(this.copyToProject + '已经存在分镜：' + this.newPolicyName)
          return
        }
        this.curEditTabDit[this.copyToProject].policyList.push(newPolicy)
      }else{
        var modeJson = await this.getFromLocalOrCloud(POLICYKEY + this.copyToProject)
        if(modeJson != null){
          var index = modeJson.policyList.findIndex((item)=>{ return item.name == this.newPolicyName})
          if(index != -1){
            this.$message.error(modeJson.name + '已经存在分镜：' + this.newPolicyName)
            return
          }
          modeJson.policyList.push(newPolicy)
          await this.setToLocalOrCloud(POLICYKEY + this.copyToProject, modeJson)
        }
      }
    },

    //点击删除策略
    onClickDeletePolicy(){
      // console.log('totp', window.otplib.totp)
      // const token = window.otplib.authenticator.generate(secret);
      const isValid = window.otplib.authenticator.check(this.verificationCode, totpSecret);
      if(isValid == false){
        this.$message.error('权限验证码错误！')
        return
      }

      //点击删除一个策略
      if(this.curEditTabDit[this.tabActiveKey] == null){
        return
      }
      var policyList = this.curEditTabDit[this.tabActiveKey].policyList

      if(policyList.length <= 1){
        this.$message.error('绘本中至少要有一个分镜')
        return
      }

      console.log('确认删除分镜', this.curEditTabDit[this.tabActiveKey].curSelectPolicy)
      var index = policyList.findIndex((item)=>{
        return item.name == this.curEditTabDit[this.tabActiveKey].curSelectPolicy
      })
      if(index == -1){
        return
      }

      policyList.splice(index, 1) //删除了策略
      this.onClickOnePolicy(policyList[0])
    },

    //点击导出绘本
    async onBtnExportModel(name){
      // var modelTableDatas = await get(TableDataSaveKey)
      // if(modelTableDatas != null){
      //   var exportModel = modelTableDatas.find((item)=>{
      //     return item.name == name
      //   })
      //   if(exportModel != null){
      //     //只要导出模型构建的参数就行了，从另一台机器导入后重新训练
      //     exportRaw(exportModel.name + '.json', JSON.stringify(exportModel))
      //   }
      // }
      console.log('准备导出绘本', name)
      var exportModel = await this.getFromLocalOrCloud(POLICYKEY + name)
      if(exportModel != null){
        exportRaw(exportModel.name + '.json', JSON.stringify(exportModel))
      }else{
        //导出策略为空
      }
    },

    //导入绘本
    onBtnImportModel(info){
      // console.log("this.$refs.modelImport", this.$refs.modelImport[0])
      var file = null
      if( this.$refs.modelImport.files == null ){
        file = this.$refs.modelImport[0].files[0]
      }else{
        file = this.$refs.modelImport.files[0]
      }
      const fr = new FileReader()
      fr.onload = async (e) => {
        try {
          var data = JSON.parse(fr.result)
          ///处理导入文件的流程
          // console.log('onBtnImportModel', data, this.inputModelName)

          this.importModelOpen = true //导入状态确认
          this.newProjectName = data.name
          this.inputModelDes = data.des
          this.waitImportProject = data //先临时放置
        }catch (error){
          console.error('error', error)
        }
        file = null
      }
      fr.readAsText(file)
      info.target.value= ""
    },

    //导入旧版绘本，只能一本一本的导入
    onBtnImportOldVersion(info){
      if(window.require == null){
        this.$message.warn('此功能仅在桌面版可用，网页版无法使用')
        return
      }
       this.importModelOpen = true //导入状态确认
       this.onFreshCanImportPage()
          // this.newProjectName = data.name
          // this.inputModelDes = data.des

      // var file = null
      // if(this.$refs.modelImport.files == null ){
      //   file = this.$refs.modelImport[0].files[0]
      // }else{
      //   file = this.$refs.modelImport.files[0]
      // }
      // const fr = new FileReader()
      // fr.onload = async (e) => {
      //   try {
      //     var data = JSON.parse(fr.result)
      //     ///处理导入文件的流程
      //     // console.log('onBtnImportModel', data, this.inputModelName)
      //     console.log('导入的绘本文件', data)
      //     // this.importModelOpen = true //导入状态确认
      //     // this.newProjectName = data.name
      //     // this.inputModelDes = data.des
      //     // this.waitImportProject = data //先临时放置
      //   }catch (error){
      //     console.error('error', error)
      //   }
      //   file = null
      // }
      // fr.readAsText(file)
      // info.target.value= ""
    },

    //转换表格配置信息
    async parseExcelConfig(jsonData){
      //表格第一行是中文注释，第二行是key，默认将第一行作为key了，所以要替换掉
      let keyDit = jsonData[0]

      let configArr = []
      for(var i = 2; i < jsonData.length; i++){
        let oneRow = jsonData[i]
        let newRow = {}
        for(var key in keyDit){
          if(key == '__rowNum__'){
            continue
          }
          if(oneRow[key] == null){
           oneRow[key] = ''
          }
          if(keyDit[key] == 'grpup'){
            newRow[keyDit[key]] = oneRow[key].split(',')
          }else if(keyDit[key] == 'labels'){
            newRow[keyDit[key]] = oneRow[key].split(',')
          }else{
            newRow[keyDit[key]] = oneRow[key]
          }
        }
        // this.saveTableData()
        configArr.push(newRow)
        let index = this.modelTableDatas.findIndex((item)=>{
          return item.name == newRow.bookId
        })
        if(index == -1){
          //没有这本绘本，直接添加
          await this.onBtnCreateModel(null, newRow.bookId)
        }
        index = this.modelTableDatas.findIndex((item)=>{
          return item.name == newRow.bookId
        })
        if(index == -1){
          console.warn('创建失败了', newRow.bookId)
          continue
        }
        let currentConfig = Rules.arrToDit(this.huiceConfig, 'key', 'value')
        for(var configKey in currentConfig){
          // currentConfig[configKey]
          if(newRow[configKey] != null){
            this.modelTableDatas[index].config[configKey] = newRow[configKey]
          }
        }
      }
      this.saveTableData()
      console.log('configArr', configArr, this.modelTableDatas)
    },

    onBtnImportExcelConfig(event){
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0]; // 获取第一个工作表的名称
        const worksheet = workbook.Sheets[sheetName]; // 获取工作表数据
        const jsonData = XLSX.utils.sheet_to_json(worksheet); // 转换为JSON格式
        console.log('读取到的json数据',jsonData); // 处理JSON数据
        this.parseExcelConfig(jsonData)
      };
      reader.readAsArrayBuffer(file); // 对于xlsx/xls文件，使用ArrayBuffer读取方式
    },


    //删除验证码权限确认
    onFinishVerificationCode(val){
      
    },

    //点击删除绘本
    async onBtnDeleteModel(name){
      // console.log('onBtnDeleteModel', name)
      // console.log('totp', window.otplib.totp)
      // const token = window.otplib.authenticator.generate(secret);
      const isValid = window.otplib.authenticator.check(this.verificationCode, totpSecret);
      if(isValid == false){
        this.$message.error('权限验证码错误！')
        return
      }

      var index = this.modelTableDatas.findIndex((item)=>{
        return item.name == name
      })
      if(index == -1){
        return
      }
      this.modelTableDatas.splice(index, 1)
      this.delToLocalOrCloud(POLICYKEY + name)
      // await set(TableDataSaveKey, JSON.parse(JSON.stringify(this.modelTableDatas)))
      this.saveTableData()
      // if(this.currentShowModelName == name){
      //   this.currentShowModelName = null
      //   loadedModel = null
      // }
    },


 
    //打开一个绘本
    openTab(){
      this.activeKey = new Date().getTime()
      menuItems.value.push({ title: 'New Tab', label: 'Content of new Tab ' + this.activeKey, key: this.activeKey });
    },

    //关闭一个绘本，关闭绘本的同时也要保存绘本配置
    closeModelTab(targetKey){
      console.log('closeTab', targetKey)
      this.onClickSaveBtn(targetKey)  //如果关闭一个页面，就先保存一下，因为之后就找不到了
      let lastIndex = 0;
      menuItems.value.forEach((pane, i) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1;
        }
      });
      menuItems.value = menuItems.value.filter(pane => pane.key !== targetKey);
      if (menuItems.value.length && this.tabActiveKey === targetKey) {
        if (lastIndex >= 0) {
          this.tabActiveKey = menuItems.value[lastIndex].key;
        } else {
          this.tabActiveKey = menuItems.value[0].key;
        }
      }
      
      // CocosMgr.clearScene()
      this.$nextTick(()=>{
        //等待关闭之前内容保存好
        //并且清空graph
        var graphs = graphDit[targetKey]
        console.log('关闭绘本的情况graphDit', graphs)
        // for(var i = 0; i < graphs.length; i++){
        //   let graph = graphs[i]
        //   graph.clear()
        // }
        for(var key in graphs){
          graphs[key].clear()
        }
        delete graphDit[targetKey]
        // console.log('关闭绘本的情况graphDit', graphDit)
        delete this.curEditTabDit[targetKey]
        // console.log('删除了打开的key', targetKey)
      })
    },

    //保存标签页
    async onClickSaveBtn(tabKey){
      // console.log('onClickSaveBtn 保存标签页',tabKey)
      if(tabKey == 0){
        this.saveTableData()
        return
      }
      // return
      var index = menuItems.value.findIndex((item)=>{
        return item.key == tabKey
      })
      if(index == -1){
        console.log('menuItems find ' + tabKey + ' == -1')
        return
      }
      var modelJson = menuItems.value[index].modeJson
      // console.log('this.modelTableDatas', index,  modelJson)

      modelJson.config = Rules.arrToDit(this.huiceConfig, 'key', 'value')
      let index2 = this.modelTableDatas.findIndex((item)=>{
        return item.key == tabKey
      })
      if(index2 != -1){
        this.modelTableDatas[index2].config = modelJson.config // JSON.parse(JSON.stringify()) //Rules.arrToDit(this.huiceConfig, 'key', 'value')  //同时配置也保存在列表中
        // console.log('同时保存了配置', this.modelTableDatas[index2].config)
      }

      //切换前保存一下当前编辑的配置
      this.saveCurEditRule(tabKey)
      // console.log('当前保存的modeljson', modelJson.policyList, this.curEditTabDit[tabKey].policyList)
      //简化一下，只要保存规则的key和value就行了
      modelJson.policyList = this.curEditTabDit[tabKey].policyList  //由于现在小项目可以进行排序，所以需要重新关联引用
      // await set(TableDataSaveKey, JSON.parse(JSON.stringify(this.modelTableDatas)))
      //每个策略单独保存
      //需要先验证一下当前的文件是否和云端版本一致，如果不一致，无法保存云端，需要先从云端获取才能保存
      let cloudModelJson = await this.getFromLocalOrCloud(POLICYKEY + tabKey)
      if(cloudModelJson == null){
        message.error(tabKey + ' 保存失败：拉取云端文件失败')
        return
      }

      // console.log('云端的文件版本号', cloudModelJson.lastChangedTime, modelJson.lastChangedTime)
      if( cloudModelJson.lastChangedTime != null){
        if(cloudModelJson.lastChangedTime != modelJson.lastChangedTime){
          // message.error(tabKey + ' 保存失败：与云端版本冲突: 云端保存时间' + moment(cloudModelJson.lastChangedTime).format('MM/DD HH:mm:ss'), 3)
          notification.error({
              message: tabKey + ' 保存失败：与云端版本冲突',
              description: ()=>h('div', {style: {'white-space': 'pre-wrap'}}, '云端保存时间：' +  moment(cloudModelJson.lastChangedTime).format("YYYY-MM-DD HH:mm:ss") + '\n' + '本地打开时间：' +  moment(modelJson.lastChangedTime).format("YYYY-MM-DD HH:mm:ss")),
              duration: 0,
          });
          return
        }
      }
      let lastChangedTime = modelJson.lastChangedTime
      modelJson.lastChangedTime = new Date().getTime() //记录一下最后保存的时间
      var result = await this.setToLocalOrCloud(POLICYKEY + tabKey, JSON.parse(JSON.stringify(modelJson)))
      // console.log('要保存的 modelJson ', modelJson)
      await this.saveTableData()
      if(result == true){
        message.success(tabKey + ' 保存成功')
      }else{
        //保存失败了，重置保存时间
        modelJson.lastChangedTime  = lastChangedTime
      }
    },


    //发布绘本到云端
    //如果点击发布，应该是发布到正式版，用户可以直接看到的，平时保存是保存在测试文件夹
    async onClickPublishBtn(tabKey){
      if(tabKey == 0){
        this.publishTableData()
        return
      }
      // console.log('点击了发布绘本到云端', tabKey)
      //将这个软件所有编辑的内容都发布到云端，包括已经编辑的内容
      //访问oss的key单独填写，防止页面泄露
      var index = menuItems.value.findIndex((item)=>{
        return item.key == tabKey
      })
      if(index == -1){
        console.log('menuItems find ' + tabKey + ' == -1')
        return
      }
      var modelJson =  menuItems.value[index].modeJson
      // console.log('this.modelTableDatas', index,  modelJson)

      modelJson.config = Rules.arrToDit(this.huiceConfig, 'key', 'value')
      
      //切换前保存一下当前编辑的配置
      this.saveCurEditRule(tabKey)
      // console.log('当前保存的modeljson', modelJson.policyList, this.curEditTabDit[tabKey].policyList)
      //简化一下，只要保存规则的key和value就行了
      modelJson.policyList = this.curEditTabDit[tabKey].policyList  //由于现在小项目可以进行排序，所以需要重新关联引用
      // await set(TableDataSaveKey, JSON.parse(JSON.stringify(this.modelTableDatas)))
      //每个策略单独保存
      modelJson.lastChangedTime = new Date().getTime() //记录一下最后保存的时间
      
      // await set(POLICYKEY + tabKey, JSON.parse(JSON.stringify(modelJson)))
      console.log('要发布的modelJson ', modelJson)
      // exportRaw(modelJson.name + '.json', JSON.stringify(modelJson))
      console.log('bookes列表', this.modelTableDatas.findIndex)
      // message.success(tabKey + ' 保存成功')
      if(ossClient == null){
        this.$message.error('当前没有访问远程资源权限！请先设置AccessKey')
        return
      }
      try{
        let blob = new Blob([JSON.stringify(modelJson)], {type: 'text/plain'})
        await ossClient.put('bookEditRelease/' + modelJson.name + '.' + modelJson.lastChangedTime + '.json' , blob)

        let index = this.modelTableDatas.findIndex((item)=>{
          return item.name == modelJson.name
        })
        if(index != -1){
          this.modelTableDatas[index].publishTime = modelJson.lastChangedTime
        }
        let blob2 = new Blob([JSON.stringify(this.modelTableDatas)], {type: 'text/plain'})
        await ossClient.put('bookEditRelease/' + TableDataSaveKey + '.json' , blob2)
        await this.saveTableData()
        this.$message.success('发布成功！🎉🎉🎉')
      }catch (error) {
          this.$message.error('发布失败:' + error, 3)
          console.log('error', error)
        }
    },

    //发布tableData的修改
    async publishTableData(){
        await this.saveTableData()
        try{
          let blob2 = new Blob([JSON.stringify(this.modelTableDatas)], {type: 'text/plain'})
          await ossClient.put('bookEditRelease/' + TableDataSaveKey + '.json' , blob2)
          this.$message.success('发布成功！🎉🎉🎉')
        }catch (error) {
          this.$message.error('发布失败:' + error, 3)
        }
    },

    //新的页面方法
    onEdit(targetKey, action){
      console.log("onEdit targetKey", targetKey)
      if (action === 'add') {
        console.log('新建了文件')
        this.openTab()
      } else {
        this.closeModelTab(targetKey)
      }
    },


    //保存整个table
    async saveTableData(){
      // var tableData = JSON.parse(JSON.stringify(this.modelTableDatas))
      var tableData = this.modelTableDatas.map((item)=>{
        return {createTime: item.createTime, publishTime: item.publishTime, key: item.key, name: item.name, des: item.des, config: item.config}
      })
      if(tableData.length == 0){
        this.$message.error('要保存的列表不应该为空', 3)
        return
      }
      // console.log('准备保存table', tableData)
      try {
        await this.setToLocalOrCloud(TableDataSaveKey, JSON.parse(JSON.stringify(tableData)))
      } catch (error) {
        this.$message.error('保存失败：' + error, 3)
      }
    },


    //绘本配置修改了
    onhuiceConfigChange(key){
      console.log('哪一个绘本配置修改了', key)
    },


    //编辑页面的方法，复制的时候，原始数组里的方法不会复制过去
    onClone(event) {
      console.log('onClone', event)
    },


    //规则的参数发生改变，会直接修改原始的list，此处仅仅作为通知，不需要手动赋值
    onConfigInputChange(e){
      console.log('onConfigInputChange', e)
    },


    //对ipc调用进行封装，绘本，分镜名称，绘本配置，策略规则组
    ipcRunCall(tabActiveKey, policyName, huiceConfig, rulesDit){
      if(window.require){
        var {ipcRenderer} = window.require('electron')
        var arg = {tabActiveKey: tabActiveKey, policyName: policyName, rulesDit: rulesDit, huiceConfig: huiceConfig}
        var result = ipcRenderer.sendSync('loopCheckRule', JSON.parse(JSON.stringify(arg)))
        console.log('ipcRenderer 调用成功', result)
      }
    },


    //对列表进行排序
    sortPolicyList(){
        //对列表进行排序
        var policyList = this.curEditTabDit[this.tabActiveKey].policyList
        policyList.sort((policyA, policyB)=>{
          var valueA = 0
          var valueB = 0
          var huiceInfo = this.getPolicyStateByName(null, policyA.name, 'huiceInfo')
          if(huiceInfo != null){
            valueA = huiceInfo[this.policySortKey]
          }
          var huiceInfo2 = this.getPolicyStateByName(null, policyB.name, 'huiceInfo')
          if(huiceInfo2 != null){
            valueB = huiceInfo2[this.policySortKey]
          }
          huiceInfo = null
          huiceInfo2 = null
          if(this.policySortKeyIsDown == true){
            return valueA - valueB
          }
          return valueB - valueA
        })
    },


    //lgCanvas只有一个，需要持久化保存
    initLgraphCanvas(graph){
      
      if(this.lgcanvas != null){
        if(graph != null){
          // this.lgcanvas._graph_stack = 
          // graph.attachCanvas(this.lgcanvas)
          this.lgcanvas.setGraph(graph)
          // console.log('蓝图重新关联了画布')
          this.lgcanvas.draw(true, true) //让canvas按照当前绑定的蓝图重新绘制
        }
        return this.lgcanvas
      }
      if(document.getElementById('mycanvas') == null){
        return
      }
      console.log('准备创建lgcanvas')
      var lgcanvas = new LGraphCanvas("mycanvas", graph);
      this.lgcanvas = lgcanvas
      console.log('创建了lgcanvas')
      return lgcanvas
    },

    //刷新当前显示的界面
    async updateCurShowLGraph(){
      // this.initLgraphCanvas()
      var curSelectPolicy = this.curEditTabDit[this.tabActiveKey].curSelectPolicy
      if(curSelectPolicy == '' || curSelectPolicy == null){
        console.warn('curSelectPolicy == null')
        return
      }
      
      console.log('开始刷Graph, updateCurShowLGraph')

      if(graphDit[this.tabActiveKey] == null){
        graphDit[this.tabActiveKey] = {}
      }

      let hasInit = CocosMgr.hasInit

      //先初始化CocosMgr，如果没有初始化的话
      console.log('cocoMgr开始init')
      CocosMgr.init()
      await CocosMgr.waitCocosInit()
      console.log('cocoMgr加载完成')

      if(hasInit != true){
        let cocosConfig = localStorage.getItem('cocosConfig')
        if(cocosConfig != null){
          try {
            cocosConfig = JSON.parse(cocosConfig)
            if(cocosConfig['cocosPreviewIsShowState'] == true){
              CocosMgr.showOrHideFPS()
            }
            if(cocosConfig['cocosPreviewIsShowColiderBox'] == true){
              CocosMgr.showOrHideColiderBox()
            }
            if(cocosConfig['isPreviewMode'] == false){
              CocosMgr.changePreviewMode()
            }
            this.cocosConfig = cocosConfig
          }catch(error){
            console.error(error)
          }
        }
      }

      if(this.waitLink.nodeObj != null){
        this.$message.info({content: '绑定取消', key:  this.waitLink.nodeObj.id, duration: 1})
        this.waitLink = {}
      }

      // var graph = this.getPolicyState(this.tabActiveKey, 'graph')
      var graph = graphDit[this.tabActiveKey][curSelectPolicy]
      if(graph != null){
        // console.log('重新渲染一下graph就完事了', graph)
        //将graph重新挂载到canvas渲染
        // graph.attachCanvas(lgcanvas)
        this.initLgraphCanvas(graph)
        graph.config.mute = this.cocosConfig.mute

        if(this.autoRunPolicy == true){
          this.autoRunPolicy = false
          this.onClickRunGraph()
        }
        this.getCurEditLgraphTable()
        return
      }

      
      // CocosMgr.addNodeToScene()


      //测试加载Spine动画
      // var spineCanvas = document.getElementById('SpineCanvas')
      // var renderSpine = new RenderSpineCanvas()
      // var renderSpine = new SpineToImg()
      // renderSpine.canvas = spineCanvas
      
      // renderSpine.setAssets({
      //   dir: CocosMgr.rootHost,
      //   json: 'P12_FJ07_yy1.json',
      //   atlas: 'P12_FJ07_yy1.atlas',
      // })
      
      // setTimeout(() => {
          
      // }, 4000);

      graph = new LGraph();
      LiteGraph.debug = true
      LiteGraph.node_box_coloured_by_mode = true
      
      // console.log('registered_node_types', LiteGraph.registered_node_types)
      this.initLgraphCanvas(graph)

      // console.log('是否有graphJson', this.curEditTabDit[this.tabActiveKey].policyList)
      var index = this.curEditTabDit[this.tabActiveKey].policyList.findIndex((item)=>{
        return item.name == curSelectPolicy
      })
      if(index != -1){
        var policy = this.curEditTabDit[this.tabActiveKey].policyList[index]
        // console.log('是否有graphJson', policy)
        if(policy.graphJson != null){
          //从json加载蓝图
          graph.configure(policy.graphJson)
          if(window.channel != null){
            console.log('asSerialisable', graph.asSerialisable())
            window.channel.postMessage({ type: 'initLgraphCanvas', graph: JSON.parse(JSON.stringify(graph.asSerialisable())) });
          }
        }else{
          // var node_const = LiteGraph.createNode("basic/sum");
          // // console.log('node_const', node_const)
          // node_const.pos = [200,200];
          // graph.add(node_const);
          // // node_const.setValue(4.5);

          // var node_watch = LiteGraph.createNode("basic/sum");
          // node_watch.pos = [700,200];
          // graph.add(node_watch);
        }
      }

      graph.config.mute = this.cocosConfig.mute


      // node_const.connect(0, node_watch, 0 );
      // graph.load
      // var exprotObj = graph.asSerialisable()
      // exportRaw('liteGrapg.json', JSON.stringify(exprotObj))
      
      // graph.start()
      // console.log('创建了新的graph', graph)

      graphDit[this.tabActiveKey][curSelectPolicy] = graph
      if(this.autoRunPolicy == true){
        this.autoRunPolicy = false
        this.onClickRunGraph()
      }
      this.getCurEditLgraphTable()
      
      //保存引用到当前编辑的对象上
      //graph不能被vue去引用，只能放在全局？
      // this.setPolicyState(this.tabActiveKey, 'graph', graph)
      // console.log('graphDit', graphDit)
    },

    //获取当前编辑的蓝图
    getCurEditLGraph(){
      if(this.curEditTabDit[this.tabActiveKey] == null){
        return
      }
      var curSelectPolicy = this.curEditTabDit[this.tabActiveKey].curSelectPolicy
      if(curSelectPolicy == '' || curSelectPolicy == null){
        console.warn('curSelectPolicy == null')
        return
      }
      if(graphDit[this.tabActiveKey] == null){
        return
      }
      // var graph = this.getPolicyState(this.tabActiveKey, 'graph')
      return  graphDit[this.tabActiveKey][curSelectPolicy]
    },

    //清除当前编辑的Lgraph
    clearCurEditLgragh(tabActiveKey, curSelectPolicy){
      if(tabActiveKey == null){
        tabActiveKey = this.tabActiveKey
      }
      //将运行状态设置为false
      this.setPolicyState(tabActiveKey, 'isRuning', false)
      if(this.curEditTabDit[tabActiveKey] == null){
        return
      }
      if(curSelectPolicy == null){
          curSelectPolicy = this.curEditTabDit[tabActiveKey].curSelectPolicy
      }
      if(curSelectPolicy == '' || curSelectPolicy == null){
        console.warn('curSelectPolicy == null')
        return
      }
      if(graphDit[tabActiveKey] == null){
        return
      }
      // var graph = this.getPolicyState(this.tabActiveKey, 'graph')
      let graph = graphDit[tabActiveKey][curSelectPolicy]
      if(graph != null && graph.clear != null){
        graph.clear()
      }
      // console.log('清空当前打开的lgraph')
      delete graphDit[tabActiveKey][curSelectPolicy]
    },

    getCellInputLinks(nodeObj, withEmptySlot){
      let graph = this.getCurEditLGraph()
      if(graph == null){
        return []
      }
      let node = graph.getNodeById(nodeObj.id)
      // let findIndex = node.inputs.findIndex((item)=>{
      //   return item.type == LiteGraph.ACTION
      // })
      // let linkInputNode = node.getInputNode(findIndex)
      // if(linkInputNode == null){
      //   return null
      // }
      let linkInputNodes = []
      for(var i = 0; i < node.inputs.length; i++){
        let inputSlot = node.inputs[i]
        if(inputSlot.type == LiteGraph.ACTION){
            let inputNode = node.getInputNode(i)
            if(inputNode != null){
              if(inputNode.type != 'middle/logic/orToggle'){
                linkInputNodes.push({slotName: inputSlot.name, node: inputNode})
              }else{
                for(let j = 0; j < inputNode.inputs.length; j++){
                  let parentInput = inputNode.getInputNode(j)
                  if(parentInput != null || withEmptySlot == true){
                    linkInputNodes.push({slotName: inputSlot.name, node: parentInput})
                  }
                }
              }
            }else{
              if(withEmptySlot == true){
                linkInputNodes.push({slotName: inputSlot.name, node: null})
              }
            }
        }
      }
      return linkInputNodes
    },

    //获取单元格事件输入的菜单项目
    getCellInputLinkMenu(visible, record, column, index){
      if(visible != true){
        this.highlightNodeDit = {}
        return
      }
      // console.log('getCellInputLinkMenu', record, column, index)
      let graph = this.getCurEditLGraph()
      if(graph == null){
        return
      }
      let nodeObj = record[column][index]
      let linkInputNodes = this.getCellInputLinks(nodeObj, true)
      let hasLinkName = '当前行'
      this.highlightNodeDit = {}

      this.inputLinkMenu = []
      // if(linkInputNode != null){
      //   hasLinkName = linkInputNode.title + linkInputNode.id
      // }
      let hasLinkSolt = {}
      for(var i = 0 ; i < linkInputNodes.length; i++){
        let linkNode = linkInputNodes[i].node
        let slotName = linkInputNodes[i].slotName
        if(linkNode != null){
          this.highlightNodeDit[linkNode.id] = 1
          hasLinkSolt[slotName] = 1
          this.inputLinkMenu.push({key: 'unLinkInput_' + linkNode.id, label: '解绑：' + linkNode.title + linkNode.id + '-' + slotName,  has_submenu: false})
        }
      }

      if(this.waitLink.nodeObj != null){
        this.inputLinkMenu.push({type: 'divider'})
        for(var i = 0 ; i < linkInputNodes.length; i++){
          let slotName = linkInputNodes[i].slotName
          let index = this.inputLinkMenu.findIndex((item)=>{
            return item.slotName == slotName
          })
          if(index == -1){
            let obj = {key: 'linkInput_' + slotName, label: '绑定：' + slotName, slotName: slotName,  has_submenu: false }
            if(hasLinkSolt[slotName] == 1){
              obj.icon = h(ApiFilled, {style: {color: '#219021'}})
            }
            this.inputLinkMenu.push(obj)
          }
        }
      }
      // this.inputLinkMenu = [
      //   {key: 'curLinkMenu', label: '已绑定：' + hasLinkName , has_submenu: false},
      //   {type: 'divider'},  
      //   {key: 'linkInputNode', label: '绑定其它', has_submenu: false},
      //   {key: 'unLinkInput', label: '取消绑定', has_submenu: false},
      // ]
    },

    loopGetAllOutputNodes(node, soltIndex, arr){
       let outputNodes = node.getOutputNodes(soltIndex) || []
       for(var i = 0; i < outputNodes.length; i++){
          let item = outputNodes[i]
          if(item.type == 'middle/logic/orToggle'){
            this.loopGetAllOutputNodes(item, 0, arr)
          }else{
            arr.push(item)
          }
       }
    },

    //获取一个节点输出的信息
    getCellOutputLinks(nodeObj){
      let graph = this.getCurEditLGraph()
      if(graph == null){
        return []
      }
      let nodeObjConfig = {}
      if(nodeObj.config != null){
        nodeObjConfig = Rules.arrToDit(nodeObj.config, 'key', 'value')
      }
      let node = graph.getNodeById(nodeObj.id)
      //目前只能一个输出
      let findIndex = -1
      // if(nodeObjConfig.spe_output != null && Number(nodeObjConfig.spe_output) >= 0){
      //   //如果可选多个输出，显示当前选中的输出节点
      //   findIndex = Number(nodeObjConfig.spe_output)
      // }else{
      //   findIndex = node.outputs.findIndex((item)=>{
      //     return item.type == LiteGraph.EVENT && item.links != null
      //   })
      // }

      let linkOutputNodeDit = {} //输出根据输出的节点名称分组
      for(var i = 0; i < node.outputs.length; i++){
        let outputSlot = node.outputs[i]
        if(outputSlot.type == LiteGraph.EVENT){
          let outputNodes = []
          this.loopGetAllOutputNodes(node, i, outputNodes)
          linkOutputNodeDit[outputSlot.name] = outputNodes
        }
      }
      return linkOutputNodeDit
    },

    //获取输出的菜单选项
    getCellOutputLinkMenu(visible, record, column, index){
      if(visible != true){
        this.highlightNodeDit = {}
        return
      }
      // console.log('getCellOutputLinkMenu', record, column, index)
      let graph = this.getCurEditLGraph()
      if(graph == null){
        return
      }
      let nodeObj = record[column][index]
      let linkNodeDit = this.getCellOutputLinks(nodeObj)
      // console.log('linkNodes', linkNodes, nodeObj)
      let menu = []
      this.highlightNodeDit = {}
      for(var slotName in linkNodeDit){
        let outputsMenu = []
        for(var i = 0; i < linkNodeDit[slotName].length; i++){
          let item = linkNodeDit[slotName][i]
          this.highlightNodeDit[item.id] = 1
          outputsMenu.push({key: 'linked_' + item.id, label: item.title + item.id, has_submenu: false})
        }
        if(linkNodeDit[slotName].length > 0){
          outputsMenu.push({type: 'divider' })
        }
        outputsMenu.push({key: 'connect_' + slotName, label: '绑定其它', slotName: slotName, has_submenu: false})
        menu.push({key: slotName, label: slotName + '(' + linkNodeDit[slotName].length + ')',  children: outputsMenu})
      }
      
      // console.log('highlightNodeDit', this.highlightNodeDit)
      // menu.push({key: 'outLinks', label: '已绑定(' + outputsMenu.length + ')',  children: outputsMenu})
      this.outputLinkMenu = menu
    },

    //点击了输入节点菜单相关的功能
    onClickCellInputMenuItem(event, record, column, index){
      // console.log('onClickCellInputMenuItem', event.key, record, column, index)
      let menuKey = event.key
      let graph = this.getCurEditLGraph()
      if(graph == null){
        return
      }
      let nodeObj = record[column][index]
      let node = graph.getNodeById(nodeObj.id)
      if(menuKey.indexOf('unLinkInput') != -1){
        let linkNodeId = menuKey.split('_')[1]
        console.log('准备解除绑定--',node, nodeObj, menuKey, linkNodeId)
        //解绑table中的
        for(var i = 0; i < nodeObj.inputs.length; i++){
          if(nodeObj.inputs[i] == linkNodeId){
            nodeObj.inputs.splice(i, 1)
            break
          }
        }
        // 解绑蓝图中的
        for(var i = 0; i < node.inputs.length; i++){
          let inputNode = node.getInputNode(i)
          if(inputNode != null){
            if(inputNode.type == 'middle/logic/orToggle'){
              let soltIndex = inputNode.findConnectSoltIndex(linkNodeId)
              if(soltIndex != -1){
                inputNode.disconnectInput(soltIndex)
                break
              }
            }else{
              if(inputNode.id == linkNodeId){
                node.disconnectInput(i)
                // console.log('nodeObj', nodeObj)
                break
              } 
            }
          }
        }
      }else if(menuKey.indexOf('linkInput') != -1){
        //在这里进行绑定
        console.log('点击了绑定操作', menuKey, this.waitLink)
        if(this.waitLink.nodeObj != null){
          let slotName = this.waitLink.slotName
          let upNode = graph.getNodeById(this.waitLink.nodeObj.id)
          if(upNode.id == node.id){
            this.$message.error({content: '绑定失败，不能绑定指令自身的输入节点', key: this.waitLink.nodeObj.id, duration: 3})
            this.waitLink = {}
            return
          }
          let index = upNode.findOutputSlot(slotName)

          let inputSlotName = event.item.originItemValue.slotName
          let inputIndex =  node.findInputSlot(inputSlotName)
          // console.log('slotName', slotName, index, inputSlotName,inputIndex)
          if(index != -1 && inputIndex != -1){
            if(node.inputs[inputIndex].link == null){
              //可以直接绑定，否则创建一个任意触发中转
              upNode.connect(index, node, inputIndex)
            }else{
              let anyNodeType = 'middle/logic/orToggle'
              let otherOutputNode = node.getInputNode(inputIndex)
              if(otherOutputNode != null){
                if(otherOutputNode.type == anyNodeType){
                  //可以直接连接了
                  //需要注意的是，一个物体的同一个输出不应该连接同一个任意触发的多个输入，这样会导致重复触发
                  //所以在连接前需要判断是否已经连接了
                  if(otherOutputNode.checkHasConnectMyInput(upNode) == false){
                    upNode.connect(index, otherOutputNode, otherOutputNode.getFreeSoltIndex())
                  }else{
                    this.$message.error({content: '请勿重复绑定', key: this.waitLink.nodeObj.id, duration: 1})
                    this.waitLink = {}
                    return
                  }
                }else{
                  let oldlinkIndex = node.getInputLink(inputIndex).origin_slot
                  //创建一个任意触发，并重新连接旧的和新的
                  let anyNode = LiteGraph.createNode(anyNodeType)
                  graph.add(anyNode)
                  // console.log('当前连接的otherOutputNode', otherOutputNode)
                  otherOutputNode.connect(oldlinkIndex, anyNode, anyNode.getFreeSoltIndex())
                  upNode.connect(index, anyNode, anyNode.getFreeSoltIndex())
                  anyNode.connect(0, node, inputIndex)
                }
              }
            }
            this.$message.success({content: '绑定成功', key: this.waitLink.nodeObj.id, duration: 1})
            this.waitLink = {}
            //直接重新生成一遍table？
            //如果需要多次连线每次连线导致位置变化不人性化
            this.getCurEditLgraphTable()
          }
        }
      }
    },

    //点击了输出节点菜单相关的功能
    onClickCellOutputMenuItem(event, record, column, index){
      let menuKey = event.key
      console.log('menuKey', event.key, record, column, index)
      let obj = record[column][index]
      if(menuKey.indexOf('connect') != -1){
        let slotName = event.item.originItemValue.slotName
        //等待绑定指令
        if(this.waitLink.nodeObj != null){
          this.$message.info({content: '绑定取消', key:  this.waitLink.nodeObj.id, duration: 1})
          this.waitLink = {}
        }
        this.waitLink = {nodeObj: obj, slotName: slotName}
        let content =  '【' + slotName +  '】绑定:等待选择一个指令'
        let innerTag = h(Tag, {style: { 'margin-right': '0px'}},  obj.title + obj.id)
        let innerText = h('span', {style: {color: '#1668dc', 'margin-right': '20px'}}, content)
        let innerIcon = h(CloseOutlined, {style: {color: 'red', cursor: 'pointer' , 'margin-right': '-2px'},  onClick: ()=>{
          console.log('点击了关闭')
          if(this.waitLink.nodeObj != null){
            this.$message.info({content: '绑定取消', key:  this.waitLink.nodeObj.id, duration: 1})
            this.waitLink = {}
          }
        }})

        let container = h('span', {}, [innerTag, innerText, innerIcon])
        this.$message.loading({content: container, key:  obj.id, duration: 0})
        // setTimeout(() => {
        //   this.$message.success({ content: 'Loaded!', key: obj.id, duration: 2 });
        // }, 1000);
      }
    },

    

    genOneNodeToTableCell(linkNode){
      let obj = {id: linkNode.id, type: linkNode.type, title: linkNode.title, nodeList: [linkNode.id], noInput: false, noOutput: false, bgColor: '#6AFF92', inputs: [], outputs: []}
      let baseType = linkNode.type.split('/')[0]
      if(CocosMgr.typeColorEnum[baseType] != null){
        obj.tagColor = CocosMgr.typeColorEnum[baseType]
      }
      if(linkNode.type == 'objects/animates/animate'){
        linkNode.getEnums()
        // console.log('linkNode.outputs', linkNode.outputs)
        let outPutType = '无'
        if(linkNode.isOutputConnected(0) && linkNode.isOutputConnected(1)){
          outPutType =  '全部'
        }else if(linkNode.isOutputConnected(0)){
          outPutType =  0//linkNode.outputs[0].name
        }else if(linkNode.isOutputConnected(1)){
          outPutType =  1//linkNode.outputs[1].name
        }
        
        let arr = linkNode.outputs.map((item, index)=>{
            return {value: index, label: item.name}
        })
        arr.push({value: '无', label:'无'})

        obj.config = [
          // {key: 'skin', value: linkNode.properties.skin, type: 'select', options: linkNode._skins.map((item)=>{
          //   return {value: item, label: item}
          // })},
          {key: 'playAniName', value: linkNode.properties.playAniName, type: 'select', width: '70px', options: linkNode._animations.map((item)=>{
            return {value: item, label: item}
          })},
          // { key: 'spe_output', value: outPutType, type: 'select',  width: '70px', options: arr },
        ]
      }else if(linkNode.type == 'middle/logic/allToggle'){
        obj.config = [
          // {key: 'skin', value: linkNode.properties.skin, type: 'select', options: linkNode._skins.map((item)=>{
          //   return {value: item, label: item}
          // })},
          { key: 'inputCount', value: linkNode.inputs.length, des: '全部触发有多少个可输入节点，要所有可输入节点都满足才会触发下一步', type: 'number', min: 2},
        ]
      }else if(linkNode.type == 'middle/change/timeDown'){
        obj.config = [
          { key: 'time_in_ms', value: linkNode.properties.time_in_ms, des: '延迟时间（毫秒）', type: 'number', width: '70px', min: 0},
        ]
      }else if(linkNode.type == 'middle/change/timeDownCycle'){
        obj.config = [
          { key: 'interval', value: linkNode.properties.interval, des: '延迟时间（毫秒）', type: 'number', width: '70px', min: 0},
        ]
      }else if(linkNode.type == 'input/value'){
        obj.config = [
          { key: 'value', value: linkNode.properties.value, des: '数值', type: 'number', width: '70px'},
        ]
      }else if(linkNode.type == 'middle/tool/sendData'){
        obj.config = [
          { key: 'customeName', value: linkNode.properties.customeName, des: '发送事件', type: 'input', width: '70px'},
        ]
      }else if(linkNode.type == 'middle/tool/acceptData'){
        obj.config = [
          { key: 'customeName', value: linkNode.properties.customeName, des: '接收事件', type: 'input', width: '70px'},
        ]
      }else if(linkNode.type == 'output/sound'){
        obj.config = [
          { key: 'customeName', value: linkNode.properties.customeName, des: linkNode.properties.customeName, type: 'input', width: '70px'},
        ]
      }

      if(linkNode.findOutputByType(LiteGraph.EVENT) == null){
        obj.noOutput = true
      }

      if(linkNode.findInputByType(LiteGraph.ACTION) == null){
        obj.noInput = true
      }

      //构建输入的信息
      let linkInputs = this.getCellInputLinks(obj)
      // console.log('linkInputs', linkInputs)
      for(var i = 0; i < linkInputs.length; i++){
        obj.inputs.push(linkInputs[i].node.id)
      }

      //构建输出的信息
      let linkNodeDit = this.getCellOutputLinks(obj)
      for(var slotName in linkNodeDit){
        let linkOutputs = linkNodeDit[slotName]
        for(var i = 0 ; i < linkOutputs.length; i++){
          obj.outputs.push(slotName + '_' + linkOutputs[i].id)
        }
      }
      return obj
    },

    //要修改表格结构，一个单元格需要同时放置多个指令
    //allLinkNodes 是一个二维数组
    genLinkNodes(node, allLinkNodes, index){
      // console.log('genLinkNodes', node)
      let outputSolts = node.outputs
      // allLinkNodes.push([])
      if(allLinkNodes[index] == null){
        allLinkNodes[index] = []
      }
      for(var i = 0; i < outputSolts.length; i++){
        if(outputSolts[i].type == 'codeNode' || outputSolts[i].type == LiteGraph.EVENT){
          //物体类型的输出
          let nodes = node.getOutputNodes(i)
          if(nodes != null){
            for(var j = 0; j < nodes.length; j++){
              let nextNode = nodes[j]
              //已经是一行里面不重复添加了
              let aleardyIn = allLinkNodes.findIndex((item)=>{
                return item.findIndex((item2) => {
                  return item2.id == nextNode.id
                }) != -1
              })
              // let aleardyInRow = allLinkNodes[index].findIndex((item)=>{
              //   return item.id == nextNode.id
              // })
              // console.log('nextNode是否已经存在于格子中了', aleardyIn, '当前index'+ index, nextNode.id)
              if(aleardyIn != -1 && aleardyIn == index - 1){
                //如果关联在上一个但是其实应该关联在后面的
                let inUpIndex = allLinkNodes[aleardyIn].findIndex((item)=>{
                  return item.id == nextNode.id
                })
                allLinkNodes[aleardyIn].splice(inUpIndex, 1)
                aleardyIn = -1
              }
              if(aleardyIn == -1 ){
                //如果没加入才需要加入，已经加入了说明已经因为物体存在而加入了
                if(nextNode.type != 'middle/logic/orToggle'){
                  allLinkNodes[index].push(nextNode)
                }
                this.genLinkNodes(nextNode, allLinkNodes, index + 1)
                //已经废弃的判断方案，每个逻辑应该真实添加
                // if(outputSolts[i].type == 'codeNode'){
                //   //当关联的第一个为codeNode时，autoRun为逻辑输入起点，不是autoRun的理论上应该被流程引用
                //   if(nextNode.properties.autoRun != null){
                //     if(nextNode.properties.autoRun == true){
                //       this.genLinkNodes(nextNode, allLinkNodes, index + 1)
                //     }
                //   }else{
                //     //是其它指令的情况
                //     this.genLinkNodes(nextNode, allLinkNodes, index + 1)
                //   }
                // }else{
                //   // if(aleardyIn == -1){
                //     this.genLinkNodes(nextNode, allLinkNodes, index + 1)
                //   // }
                // }
              }
              //现在的问题是不同动画关联在一个物体上，由另一个动画触发的顺序却在后面，如何排序
              // if(aleardyInRow == -1){ //放置死循环
                
              // }
            }
          }
        }
      }
    },

    checkNotInTableNodes(table, exDit){
      let oneRowDit = {}
      let graph = this.getCurEditLGraph()

      for(var r = 0; r < table.length; r++){
        for(var key in table[r]){
          oneRowDit[table[r].id] = 1
          
          if(key.indexOf('linkNode') != -1){
            let linkNodes = table[r][key]
            // console.log('当前循环的linkNodes', linkNodes)
            for(var i = 0; i < linkNodes.length; i++){
              oneRowDit[linkNodes[i].id] = 1
            } 
          }
        }
      }
      // console.log('所有在table中的指令',  oneRowDit)
     
      for(var r = 0; r < table.length; r++){
        let lastCell = []
        let lastKey = 'linkNode_0'
        for(var key in table[r]){
          if(key.indexOf('linkNode') != -1){
            // lastKey = key
            let linkNodes = table[r][key]
            for(var i = 0; i < linkNodes.length; i++){
              let oneCell = linkNodes[i]
              let node = graph.getNodeById(oneCell.id)
              // console.log('oneCell', oneCell, node)
              for(var n = 0; n < node.inputs.length; n++){
                if(node.inputs[n].type == LiteGraph.ACTION){
                  let inputNode = node.getInputNode(n)
                  // console.log('绑定的input', node.title + node.id , n, inputNode)
                  if(inputNode != null){
                    if(oneRowDit[inputNode.id] == null){
                      if(inputNode.type != 'middle/logic/orToggle'){
                        //任意触发不加入到表格中去
                        //不存在，加入到最后一个
                        // console.log('不存在，加入到最后一个',inputNode.id )
                        lastCell.push(this.genOneNodeToTableCell(inputNode))
                        oneRowDit[inputNode.id] = 1 
                      }
                    }
                  }
                }
              }
            } 
           
          }
        }
        // console.log('checkNotInTableNodes', linkNodes, lastCell, oneRowDit)
        if(lastCell.length != 0){
          // linkNodes.push(lastCell)
          if(table[r][lastKey].length == 0){
            table[r][lastKey] = lastCell
          }else{
            table[r][lastKey] = table[r][lastKey].concat(lastCell)
          }
          // console.log('lastCell.length != 0', linkNodes, lastCell)
          // exDit['linkNode_' + (linkNodes.length - 1)] = 1
        }
      }

      //同时将没有被任何物体引用的指令单独放一行
      let noLinkAnyNodes = []
      // let nolinkNodes = [] //获取链接的其它组件，目前只分析动画组件

      for(var i = 0; i < graph.nodes.length; i++){
          let node = graph.nodes[i]
          // if(node.isAnyInputConnected() == false && node.isAnyOutputConnected() == false){
          //   noLinkAnyNodes.push(this.genOneNodeToTableCell(node))
          // }
          // if(node.type != 'objects/createObject' && node.type != 'objects/camera'){
            
          // }
          if(oneRowDit[node.id] == null){
            if(node.type != 'middle/logic/orToggle'){
              noLinkAnyNodes.push(this.genOneNodeToTableCell(node))
            }
            // this.genLinkNodes(node, nolinkNodes, 0)
          }
      }
      // console.log('nolinkNodes', nolinkNodes)
      if(noLinkAnyNodes.length != 0){
        // let emptyNode = LiteGraph.createNode('objects/createObject');
        // graph.add(emptyNode)

        let oneRow = {
          id: noLinkAnyNodes[0].id,
          modal: '无物体',
          // linkNode_0: noLinkAnyNodes,
        }
        for(var i = 0; i < noLinkAnyNodes.length; i++){
          let node = noLinkAnyNodes[i]
          // this.findSameRowUpNode(node, )
          oneRow['linkNode_' + i] = [node]
          exDit['linkNode_' + i] = 1
        }

        for(var key in oneRow){
          if(key.indexOf('linkNode') != -1){
            for(var n = 0; n < oneRow[key].length; n++){
                let cellOne = oneRow[key][n]
                let col = this.findSameRowUpNode(cellOne, oneRow)
                if(col != -1){
                  //找到了同一行下的node
                  let nextCol = 'linkNode_' + (col + 1)
                  // console.log('找到了同一行的哪一列是连接的', nextCol)
                  if(oneRow[nextCol] == null){
                    oneRow[nextCol] = []
                    exDit[nextCol] = 1
                  }
                  if(nextCol != key){
                    oneRow[nextCol].push(cellOne)
                    oneRow[key].splice(n, 1)
                    n--
                  }
                }
            }
          }
        }    

        let getNextNotEmptyCol = function(col){
          let nextCol = 'linkNode_' + (col + 1)
          if(oneRow[nextCol] != null){
            if(oneRow[nextCol].length > 0){
              return nextCol
            }else{
              return getNextNotEmptyCol(col + 1)
            }
          }else{
            return null
          }
        }
        
        //如果第一个格子为空，可以前移
        for(var key in oneRow){
          if(key.indexOf('linkNode') != -1){
            // console.log('当前格子是否为空', key, oneRow[key].length)
            if(oneRow[key].length == 0){
              let nextCol = getNextNotEmptyCol(Number(key.split('_')[1]))
              if(nextCol != null){
                oneRow[key] = oneRow[nextCol]
                oneRow[nextCol] = []
              }
            }
          }
        }

        // let oneRow = this.genOneNodeToTableCell(emptyNode)
        // oneRow.linkNode_0 = noLinkAnyNodes
        // setTimeout(() => {
        //   table.push(oneRow)
        // }, 5000);
        // table.splice(0, 0, oneRow)
        table.push(oneRow)
      }
      
      console.log('noLinkAnyNodes', noLinkAnyNodes)
    },

    //获取node在table的哪一行
    getNodeInRow(node){
      let findRow = null
      for(var i = 0; i < this.curEditLgraphTable.length; i++){
        if(this.curEditLgraphTable[i].id == node.id){
          findRow = this.curEditLgraphTable[i]
          break
        }
      }
      return findRow
    },

    //检查table指令是否与关联输入的节点为同一行，非常有效，一个完美的时间线表格实现了
    checkNodeIsSameRowWithUpNode(nodeObj, row){
      // return true
      let graph = this.getCurEditLGraph()
      let node = graph.getNodeById(nodeObj.id)
      if(node.getInputDataType(0) == 'codeNode'){
        let linkObject = node.getInputNode(0)
        if(linkObject != null && linkObject.id != row.id){
          //不在同一行
          return false
        }else{
          return true
        }
      }else{
        //判断输入的链接是否与其在同一行
        let inputLinks = this.getCellInputLinks(nodeObj)
        let isSame = false
        for(var i = 0; i < inputLinks.length; i++){
          let node = inputLinks[i].node
          let findRow = this.getNodeInRow(node)
          if(findRow != null){
            if(findRow.id == row.id){
              isSame = true
            }
          }
        }
        return isSame
      }
    },

    //找到同一行的前一个输入节点的column
    findSameRowUpNode(nodeObj, row){
      // let graph = this.getCurEditLGraph()
      // console.log('findSameRowUpNode', nodeObj, row)
      let findCol = -1
      for(var key in row){
        if(key.indexOf('linkNode') != -1){
          if(row[key] == null){
            console.warn('row[key] == null', key)
            continue
          }
          for(var i = 0; i < row[key].length; i++){
            let oneCellnodeObj = row[key][i]
            let findIndex = oneCellnodeObj.outputs.findIndex((item)=>{
              let arr = item.split('_')
              return arr[arr.length - 1] == nodeObj.id
            })
            if(findIndex != -1){
                findCol = Number(key.split('_')[1])
                break
            }
          }
        }
      }
      return findCol
    },

    sortTable(table, exDit){
      let graph = this.getCurEditLGraph()
      for(var i = 0; i < table.length; i++){
          let row = table[i]
          for(var key in row){
            if(key.indexOf('linkNode') != -1){
              for(var n = 0; n < row[key].length; n++){
                let cellOne = row[key][n]
                let node = graph.getNodeById(cellOne.id)
                //如果不是直接关联codeNode的指令还是会位置错误，应该判断指令直接关联的上一个节点是否同一行，如果不同一行，移动到对应的行去
                if(this.checkNodeIsSameRowWithUpNode(cellOne, row) == false){
                  console.log('不在同一行', cellOne.title + cellOne.id, row.customeName)  
                  let linkObject = node.getInputNode(0)
                  if(linkObject != null && linkObject.id != row.id){
                    //当前这一行出现了本该在其它列中出现的节点，查询在哪一行
                    let otherRow = table.find((item)=>{
                      let hasFind = false
                      if(item.id == linkObject.id){
                        for(var key2 in item){
                          if(key2.indexOf('linkNode') != -1){
                              let index = item[key2].findIndex((item2) =>{ 
                                return item2.id == cellOne.id
                              })
                              if(index != -1){
                                hasFind = true
                                break
                              }
                          }
                        }
                      }
                      return hasFind
                    })
                    // console.log('当前这一行出现了本该在其它列中出现的节点，查询在哪一行', cellOne.id, row.id, otherRow)
                    if(otherRow != null){
                      //找到了另一行，现在继续找另一行绑定的同一个指令，将指令移动到正确的位置中去
                      let findOtherCol = -1
                      for(var key2 in otherRow){
                        if(key2.indexOf('linkNode') != -1){
                          findOtherCol = otherRow[key2].findIndex((item)=>{
                            return item.id == cellOne.id
                          })
                        }
                        // console.log('找到了另一行，现在继续找另一行绑定的同一个指令，将指令移动到正确的位置中去', key2, findOtherCol, otherRow[key2])
                        if(findOtherCol != -1){
                          if(otherRow[key] == null){
                            otherRow[key] = []
                          }
                          otherRow[key].push(cellOne)
                          otherRow[key2].splice(findOtherCol, 1)
                          row[key].splice(n, 1)
                          n--
                          break
                        }
                      }
                    }else{
                      let col = this.findSameRowUpNode(cellOne, row)
                      console.log('虽然不在同一行，但也没有找到另一行', cellOne.title + cellOne.id, row.customeName, col)
                      if(col != -1){
                        //找到了同一行下的node
                        let nextCol = 'linkNode_' + (col + 1)
                        console.log('找到了同一行的哪一列是连接的', nextCol)
                        if(row[nextCol] == null){
                          row[nextCol] = []
                          exDit[nextCol] = 1
                        }
                        if(nextCol != key){
                          row[nextCol].push(cellOne)
                          row[key].splice(n, 1)
                          n--
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
    },

    //将graph转换为图的形式
    getCurEditLgraphTable(){
      let graph = this.getCurEditLGraph()
      if(graph == null){
        return
      }
      // console.log('getCurEditLgraphTable', graph)
      let table = []
      let exDit = {}
      table = graph.findNodesByType("objects/camera").concat(
        graph.findNodesByType('objects/createObject').sort((a, b)=>{
          return a.properties.zIndex - b.properties.zIndex 
        })
      )
      .map((node)=>{
        let oneRow = {id: node.id,  modal: node.properties.modal, customeName: node.properties.customeName}

        if(node.getPreviewImg != null){
          oneRow.img = node.getPreviewImg()
        }
        if(node.type == 'objects/camera'){
          oneRow.modal = '镜头'
        }

        if(oneRow.modal == '文本'){
          oneRow.customeName = node.properties.string
        }

        let linkNodes = [] //获取链接的其它组件，目前只分析动画组件
        this.genLinkNodes(node, linkNodes, 0)
        
        // console.log('一个物体关联的指令顺序', node, linkNodes)
        linkNodes = linkNodes.map((item)=>{
          return item.map(this.genOneNodeToTableCell) 
        })

        //没有直接连接object的指令，按照链接顺序遍历
        // 0是前置指令，当有没有直接关联物体的指令，且在逻辑前面，则放置在0列下
        oneRow['linkNode_0'] = []
        exDit['linkNode_0'] = 1
        for(var i = 1; i <= linkNodes.length; i++){
          oneRow['linkNode_' + i] = linkNodes[i - 1]  //现在这个是数组了
          exDit['linkNode_' + i] = 1
        }
        return oneRow
      })

      

      //对table中的数据进行重新排序，如果有关联物体的动画被其他地方引用，应该放在引用指令之后
      this.sortTable(table, exDit)

      //查询不在table中的指令，放到存在关联的那一行的最后一行去
      this.checkNotInTableNodes(table, exDit)
      
      let index = this.graphTableColumns.findIndex((row)=>{
        return row.key == 'linkNode_0'
      })
      console.log('linkNode_1:', index, this.graphTableColumns.length - 1 - index)
      if(index != -1){
        this.graphTableColumns.splice(index, this.graphTableColumns.length - 1 - index)
      }
      

      for(let key in exDit){
          for(var i = 0; i < table.length; i++){
            if(table[i][key] == null){
              table[i][key] = []
            }
          }
          this.graphTableColumns.splice(this.graphTableColumns.length - 1, 0, {
            title: key == 'linkNode_1' ? '初始关联指令'  : '关联指令',
            dataIndex: key,
            key: key,
            ellipsis: true,
            resizable: true,
            width: 220,
            minWidth: 75,
          })
      }
      console.log("table", table)
      this.curEditLgraphTable = table
    },

    //添加一列空的关联指令列到列表中
    addOneColumnToTable(){
      let max = 0
      for(var i = 0; i < this.graphTableColumns.length; i++){
        if(this.graphTableColumns[i].key.indexOf('linkNode_') != -1){
          let num = Number(this.graphTableColumns[i].key.split('_')[1])
          if(num > max){
            max = num
          }
        }
      }
      max += 1
      let key = 'linkNode_' + max
      this.graphTableColumns.splice(this.graphTableColumns.length - 1, 0, {
        title: '关联指令',
        dataIndex: key,
        key: key,
        ellipsis: true,
        resizable: true,
        width: 220,
        minWidth: 75,
      })
      for(var i = 0; i < this.curEditLgraphTable.length; i++){
        if(this.curEditLgraphTable[i][key] == null){
          this.curEditLgraphTable[i][key] = []
        }
      }
      return key
    },

    //添加名称列
    addNameColumnToTable(){
      // console.log('当前是否显示名称列',this.configs.showNameColumn)
      let showNameColumn = this.configs.showNameColumn
      if(showNameColumn == true){
         let oneColume = {
            title: '资源',
            dataIndex: 'customeName',
            key: 'customeName',
            ellipsis: true,
            resizable: true,
            width: 200,
            // minWidth: 50,
          }
          let index = this.graphTableColumns.findIndex((item)=>{
            return item.key == 'customeName'
          })
          if(index == -1){
            this.graphTableColumns.splice(1, 0, oneColume)
          }
      }else{
         let index = this.graphTableColumns.findIndex((item)=>{
            return item.key == 'customeName'
          })
          if(index != -1){
            this.graphTableColumns.splice(index, 1)
          }
      }
    },

    //当蓝图编辑结束
    onGraphTableConfigChange(key, targetRowRecord, columnKey, index){
        console.log('value修改了', key, targetRowRecord, columnKey)
        let graph = this.getCurEditLGraph()
        if(graph == null){
          return
        }
        let target = targetRowRecord[columnKey][index]
        if(target != null){
            let node = graph.getNodeById(target.id)
            let config = Rules.arrToDit(target.config, 'key', 'value')
            if(key == 'playAniName'){
              node.setProperty('loop', config[key].indexOf('std') != -1)
            }
            if(key == 'spe_output'){
              //现在改为专门的连接菜单选项去连接
              //特殊操作
              //查询表格是否有下一个，如果有的话就关联下一个
              // let nextColumnKey = 'linkNode_' + (Number(columnKey.split('_')[1]) + 1)
              // if(targetRowRecord[nextColumnKey] == null){
              //   nextColumnKey = 'linkNode_1'  //回到第一个
              // }
              // if(targetRowRecord[nextColumnKey] != null){
              //   for(var n = 0; n < targetRowRecord[nextColumnKey].length; n++){
              //     let nextNode = graph.getNodeById(targetRowRecord[nextColumnKey][n].id)
              //     let soltIndex = config[key]
              //     console.log('soltIndex', soltIndex, nextNode, Number(soltIndex))
              //     if(Number(soltIndex) >= 0){
              //       //如果是动画节点，都可以绑定到触发点1，其它节点暂不考虑
              //       let playSoltIndex = nextNode.findInputSlot('播放')
              //       if(playSoltIndex != -1){
              //         node.connect(soltIndex, nextNode, playSoltIndex)
              //       }else{
              //         console.warn('playSoltIndex == -1', playSoltIndex)
              //       }
              //     }else{
              //       //如果没有的话，将连接断开
              //       for(var i = 0; i < node.outputs.length; i++){
              //         node.disconnectOutput(i)
              //       }
              //       console.warn('soltIndex无效，断开所有连接', soltIndex)
              //     }
              //   }
              // }else{
              //   console.warn('nextColumnKey == null', nextColumnKey)
              // }
            }else if(key == 'inputCount'){
              //增加或减少输入slot的数量
              let count = config[key] - node.inputs.length
              console.log('增加还是减少inputslot数量', count, node.onGetInputs())
              if(count > 0){
                //增加
                if(node.onGetInputs != null){
                  for(var j = 0; j < count; j++){
                    let inPuts = node.onGetInputs()
                    if(inPuts[0] != null){
                      node.addInput(inPuts[0][0], inPuts[0][1])
                    }
                  }
                }
              }else{
                //减少
                for(var j = 0; j < Math.abs(count); j++){
                  node.removeInput(node.inputs.length - 1)
                }
              }
            }else{
              node.setProperty(key, config[key])
            }
        }
    },

    //当表格行拖拽结束
    onLgraphTableDragEnd(){
      // console.log('e', e,, this.curEditLgraphTable)
      let graph = this.getCurEditLGraph()

      for(var i = 0; i < this.curEditLgraphTable.length; i++){
        let oneRow = this.curEditLgraphTable[i]
        // console.log('oneRow', oneRow)     
        let node = graph.getNodeById(oneRow.id)  
        // console.log('node', node)     
        if(node != null){
          // node.properties.zIndex = i
          node.setProperty('zIndex', i)
        }
      }
    },

    handleResizeTableColumn(w, col){
      col.width = w;
    },

    onSelectChange(selectedRowKeys){
      this.graphTableSelectRows = selectedRowKeys
    },

    
    // onStart(e){
    //   console.log('onStart', e)
    // },
    // onAdd(e){
    //   console.log('onAdd', e)
    // },
    // onRemove(e){
    //   console.log('onRemove', e)
    // },
    //当表格中的单元格拖拽结束
    onGraphTableEnd(e, targetRowRecord, columnKey){
      // console.log('onGraphTableEnd', e) 
      let toInfo = e.to.dataset
      let targetInfo = e.target.dataset

      let targetChange = this.curEditLgraphTable[Number(targetInfo.row)][targetInfo.col]
      let toChange = this.curEditLgraphTable[Number(toInfo.row)][toInfo.col]

      let graph = this.getCurEditLGraph()
      //将此变化反应到蓝图中
    
      let targetNode = graph.getNodeById(targetChange.id)
      let toNode = graph.getNodeById(toChange.id)

      let targetLinkObjectId = this.curEditLgraphTable[Number(targetInfo.row)].id
      let targetLinkObject = graph.getNodeById(targetLinkObjectId)

      let toLinkObjectId = this.curEditLgraphTable[Number(toInfo.row)].id
      let toLinkObject = graph.getNodeById(toLinkObjectId)

      //如果是连接同一个物体的的顺序变化应该重新排序位置
      
      console.log('targetLinkObject', targetLinkObject, 'toLinkObject', toLinkObject)

      //对动画的触发顺序也要进行重新连接

      if(targetLinkObjectId == toLinkObjectId){
        //是关联同一个物体，对连接顺序进行重新排序
        // console.log('当前的连接', targetLinkObject.outputs[0].links.reverse(), targetLinkObject.outputs[0])
        let index1 = targetLinkObject.outputs[0].links.findIndex((linkId)=>{
          let link = graph.links.get(linkId)
          console.log('link', link.target_id, targetChange.id)
          return link.target_id == targetChange.id
        })
        let index2 = targetLinkObject.outputs[0].links.findIndex((linkId)=>{
          let link = graph.links.get(linkId)
          return link.target_id == toChange.id
        })
        // console.log('index1', index1, index2)
        let temp = targetLinkObject.outputs[0].links[index1]
        targetLinkObject.outputs[0].links[index1] = targetLinkObject.outputs[0].links[index2]
        targetLinkObject.outputs[0].links[index2] = temp
      }else{
        //不是关联同一个物体，直接重连，
        targetLinkObject.connect(0, toNode, 0)
        toLinkObject.connect(0, targetNode, 0)

        //并且重新排序？
      }

      
      toChange.nodeList.splice(0, toChange.nodeList.length)
      toChange.nodeList.push(toChange.id)
      targetChange.nodeList.push(targetChange.id)

      let temp = toChange
      this.curEditLgraphTable[Number(toInfo.row)][toInfo.col] = targetChange
      this.curEditLgraphTable[Number(targetInfo.row)][targetInfo.col] = temp


      // console.log('e, targetRowRecord, columnKey', toInfo , toChange, targetRowRecord, columnKey)
      // console.log('onGraphTableEnd', this.curEditLgraphTable ) 
    },

    //当单元格拖拽结束
    onGraphTableCellDragEnd(e, targetRowRecord, columnKey){
      //如果拖拽后没有重新连接，再次从蓝图中进入会复原
      let toInfo = e.to.dataset //拖拽到目标单元格
      let targetInfo = e.target.dataset //拖拽之前的单元格

      // console.log("onGraphTableCellDragEnd", toInfo, e, targetRowRecord, columnKey)
      let graph = this.getCurEditLGraph()
      if(graph == null){
        return 
      }
      let nodeObj = e.clonedData
      let node = graph.getNodeById(nodeObj.id)
      // console.log('node.properties.autoRun', node.properties.autoRun, toInfo.col)
      
      //拖拽后暂时不要自动设置autoRun了
      // if(node.properties.autoRun != null && node.getInputDataType(0) == 'codeNode'){
      //   if(toInfo.col == 'linkNode_1'){
      //     node.setProperty('autoRun', true)
      //   }else{
      //     node.setProperty('autoRun', false)
      //   }
      // }

      //重新和物体关联（如果拖拽的节点有codeNode输入的话）
      let codeNodeSlotIndex = node.findInputByType('codeNode')
      console.log('是否需要重新关联', codeNodeSlotIndex, node)
      if(codeNodeSlotIndex != -1){
        let toLinkObjectId = this.curEditLgraphTable[Number(toInfo.row)].id
        let toLinkObject = graph.getNodeById(toLinkObjectId)
        if(toLinkObject != null){
          if(toLinkObject.type == 'objects/createObject' || toLinkObject.type == 'objects/camera'){
            toLinkObject.connect(0, node, codeNodeSlotIndex)
          }
        }
      } 
    },

    //点击运行一次蓝图
    onClickRunGraphStep(){
      var curSelectPolicy = this.curEditTabDit[this.tabActiveKey].curSelectPolicy
      if(curSelectPolicy == '' || curSelectPolicy == null){
        console.warn('curSelectPolicy == null')
        return
      }

      var graph = graphDit[this.tabActiveKey][curSelectPolicy]
      graph.runStep()
    },

    

    //弱化了生命周期的概念，一个图不需要开始，结束，每一步都可以看成一次开始到结束
    //在这个蓝图模式里，strat是循环执行的模式，step是执行一次,但是如果以toggle驱动的话，只需要执行一次即可
    //且支持双向获取数据，node的执行顺序会按照连接顺序执行，如果两个节点循环连接还需要看具体执行情况？
    async onClickRunGraph(){
      var curSelectPolicy = this.curEditTabDit[this.tabActiveKey].curSelectPolicy
      if(curSelectPolicy == '' || curSelectPolicy == null){
        console.warn('curSelectPolicy == null')
        return
      }
      if(graphDit[this.tabActiveKey] == null){
        console.warn('graphDit[this.tabActiveKey] == null')
        return
      }
      var graph = graphDit[this.tabActiveKey][curSelectPolicy]
      if(graph == null){
        console.warn('graph == null' ,this.tabActiveKey, curSelectPolicy)
        return
      }
      this.setPolicyState(this.tabActiveKey , 'isStartLoading', true)
      if(window.channel){
        //运行的话直接发送最新的graph同步过去，防止有些东西不一样
        window.channel.postMessage({ type: 'graphStart' , graph: JSON.parse(JSON.stringify(graph.asSerialisable())) })
      }
      recordTouch = []  //重置录制事件列表

      if(this.configs.recordType == 'autoRunRecordTouch'){
        //运行时自动点击
        let autoRunNodes = graph.findNodesByType('output/autoRunRecordTouch')
        let autoRunNode = autoRunNodes[0]
        if(autoRunNode != null){
          autoRunNode.setProperty('active', true)
        }
      }else{
        //不执行自动点击
        let autoRunNodes = graph.findNodesByType('output/autoRunRecordTouch')
        let autoRunNode = autoRunNodes[0]
        if(autoRunNode != null){
          autoRunNode.setProperty('active', false)
        }
      }

      if(this.curOpenLayout[1] == 1){
        await graph.start()
      }
     
      this.setPolicyState(this.tabActiveKey , 'isRuning', true)
      this.setPolicyState(this.tabActiveKey , 'isStartLoading', false)
      // var isRunSuccess = this.getCurGraphIsRuning()
      this.freshState = !this.freshState
      // console.log('是否进入运行了', isRunSuccess)
    },

    //点击停止运行蓝图
    onClickStopGraph(){
      var curSelectPolicy = this.curEditTabDit[this.tabActiveKey].curSelectPolicy
      if(curSelectPolicy == '' || curSelectPolicy == null){
        console.warn('curSelectPolicy == null')
        return
      }
      if(graphDit[this.tabActiveKey] == null){
        return
      }
      var graph = graphDit[this.tabActiveKey][curSelectPolicy]
      if(this.curOpenLayout[1] == 1){
        graph.stop()
      }
      if(window.channel){
        window.channel.postMessage({ type: 'graphStop' })
      }
      this.setPolicyState(this.tabActiveKey , 'isRuning', false)
      this.freshState = !this.freshState
      if(this.configs.recordType == 'autoRecordTouch'){
        //当前是录制操作，自动保存一下
        this.saveCurEditRule()
      }
    },

    //addNodeToGraph
    addNodeToGraph(nodeType, targetObject){
        // var curSelectPolicy = this.curEditTabDit[this.tabActiveKey].curSelectPolicy
        // if(curSelectPolicy == '' || curSelectPolicy == null){
        //   console.warn('curSelectPolicy == null')
        //   return
        // }
        // if(graphDit[this.tabActiveKey] == null){
        //   return
        // }
        // var graph = graphDit[this.tabActiveKey][curSelectPolicy]
        if(this.lgcanvas == null){
            return
        }
        let graph = this.lgcanvas.graph
        if(graph == null){
          return
        }
        if(nodeType == 'objects/camera'){
          let hasAddArr = graph.findNodesByType(nodeType)
          if(hasAddArr.length > 0){
            this.$message.warn('只能添加一个镜头节点')
            return
          }
        }
        var node_const = LiteGraph.createNode(nodeType);
        // // console.log('node_const', node_const)
        node_const.pos = [200,200];
        if(graph.list_of_graphcanvas[0] != null){
          var viewport = graph.list_of_graphcanvas[0].visible_area
          // [-0, -0, 722, 754]
          if(targetObject != null){
             //自动查找关联物体所有关联node最下一个，放在最下一个的下面
             let nodes = targetObject.getOutputNodes(0)
             let maxX = targetObject.pos[0] + targetObject.width + 3
             let maxY = targetObject.pos[1]
             if(nodes != null){
              for(let i = 0; i < nodes.length; i++){
                let node = nodes[i]
                // if(node.pos[0] > maxX){
                //   maxX = node.pos[0]
                // }
                if(node.pos[1] > maxY){
                  maxY = node.pos[1] + node.height + 3 //这里为什么是加55呢
                }
              }
             }
             node_const.pos = [maxX, maxY]
          }else{
            node_const.pos = [(viewport[2]) * 0.5 + viewport[0],(viewport[3]) * 0.5 + viewport[1]];
          }
          console.log('viewport', viewport)
        }
        graph.add(node_const);
        //自动创建关联节点
        if(node_const.createLinkNode != null){
          node_const.createLinkNode()
        }
        return node_const
    },

    //获取编辑界面的中心位置
    getEditViewCenterPos(isTouchPos){
      if(this.lgcanvas == null){
        return [0, 0]
      }
      let viewport = this.lgcanvas.visible_area
      if(isTouchPos == true){
        return [(viewport[2]) * 0.5,(viewport[3]) * 0.5]; //  
      }else{
        return [(viewport[2]) * 0.5 + viewport[0], (viewport[3]) * 0.5 + viewport[1]]; 
      }
    },

    //这个框架很好的把运行时和渲染画布分离了，一个蓝图既可以脱离渲染运行，也可以连接一个画布实时渲染
    getCurGraphIsRuning(){
      if(this.curEditTabDit[this.tabActiveKey] == null){
        return false
      }
      var curSelectPolicy = this.curEditTabDit[this.tabActiveKey].curSelectPolicy
      if(curSelectPolicy == '' || curSelectPolicy == null){
        console.warn('curSelectPolicy == null')
        return false
      }
      if(graphDit[this.tabActiveKey] == null){
        return false
      }
      var graph = graphDit[this.tabActiveKey][curSelectPolicy]
      if(graph != null){
        console.log('获取到了蓝图的状态', graph.status , LGraph.STATUS_RUNNING)
        return graph.status == LGraph.STATUS_RUNNING
      }
      return false
    },
    
    onClickExpandPreview(){
      this.cocosPreviewCanDrag = !this.cocosPreviewCanDrag
    },

    onClickFreshPreview(){
      // var gameCanvas = document.getElementById('GameCanvas')
      // gameCanvas.getBoundingClientRect()
      // CocosMgr.updateCanvasSize(gameCanvas.width, gameCanvas.height)
      CocosMgr.refreshTree()
      console.log('TreeData', CocosMgr.treeData)
      this.cocosPreviewTreeData = CocosMgr.treeData
    },

    onClickConsoleSelect(){
      this.$message.info('对象已打印至控制台')
      console.log(CocosMgr.selectedNode)
    },

    onClickTreeExport(){
      console.log(this.expandedKeys)
      this.expandedKeys = CocosMgr.getHasChildrenNodeId()
    },

    onClickFpsPreview(){
      this.cocosPreviewIsShowState = CocosMgr.showOrHideFPS()
    },

    //现在改成统一切换配置信息
    onClickTreePreview(key){
      if(key == 'cocosPreviewIsShowState'){
        this.cocosConfig[key] = CocosMgr.showOrHideFPS()
        localStorage.setItem('cocosConfig', JSON.stringify(this.cocosConfig))
        return
      }
      if(key == 'cocosPreviewIsShowColiderBox'){
        this.cocosConfig[key] = CocosMgr.showOrHideColiderBox()
        localStorage.setItem('cocosConfig', JSON.stringify(this.cocosConfig))
        return
      }
      this.cocosConfig[key] = !this.cocosConfig[key]
      // this.cocosPreviewIsShowTree = !this.cocosPreviewIsShowTree
      if(key == 'cocosPreviewIsShowTree'){
        CocosMgr.refreshTree()
        this.cocosPreviewTreeData = CocosMgr.treeData
      }else if(key == 'cocosPreviewCanDrag'){
        if(this.cocosConfig['cocosPreviewIsShowGird']){
          this.cocosConfig['cocosPreviewIsShowGird'] = false
          setTimeout(() => {
            this.cocosConfig['cocosPreviewIsShowGird'] = true
          }, 700);
        } 
      }else if(key == 'isPreviewMode'){
        // CocosMgr.isPreviewMode = !CocosMgr.isPreviewMode
        CocosMgr.changePreviewMode()
        this.cocosConfig[key] = CocosMgr.isPreviewMode
        console.log('CocosMgr.isPreviewMode', CocosMgr.isPreviewMode)
      }else if(key == 'mute'){
        let graph = this.getCurEditLGraph()
        if(graph != null){
          graph.config.mute = this.cocosConfig.mute
        }
      }
      localStorage.setItem('cocosConfig', JSON.stringify(this.cocosConfig))
    },

    onClickNewPreview(){
      // console.log('location', window.location)
      // window.open(window.location)
      let newUrl = window.location.origin + window.location.pathname + '#/BookPreview'
      console.log("打开的url", newUrl,  window.location)
      window.open(newUrl, '_blank', 'height=1028,width=1634')
      setTimeout(() => {
        //发送当前场景
        let graph = this.getCurEditLGraph()
        if(window.channel != null && graph != null){
          window.channel.postMessage({ type: 'initLgraphCanvas', graph: JSON.parse(JSON.stringify(graph.asSerialisable())) });
        }
      }, 1000);
    },


    onChangeRadionPicker(value){
      console.log('onChangeRadionPicker', value)
      if(value != '无比例'){
        var valueArr = value.split(':')
        var height = Number(valueArr[1])
        var width = Number(valueArr[0])
        //由于这里设置的是卡片的比例，所以要加上卡片的标题高度
        this.cocosConfig.aspectRadio = height / width
      }else{
        this.cocosConfig.aspectRadio = 0
      }
      localStorage.setItem('cocosConfig', JSON.stringify(this.cocosConfig))
    },

    onClickClearScene(){
      CocosMgr.clearScene()  
      this.$message.info('已清空场景')
    },

    //当画布的尺寸修改了，要通知cocos
    onPreviewSizeChange(data){
      // console.log('onPreviewSizeChange', data.width, data.height)
      // clearTimeout(this.timeOutInt)
      setTimeout(() => {
        //如果不加setTimeout，切换标签页会导致预览界面渲染放大
        CocosMgr.updateCanvasSize(data.width, data.height)
      }, 100);
      // CocosMgr.updateCanvasSize(data.width, data.height)
      
      // this.$nextTick(()=>{
        
      // })

      //同时计算安全框线的位置
      var baseSize = {width: CocosMgr.designViewWidth,  height: CocosMgr.designViewHeight}
      var sizeOne = {width: 1920,  height: 1500} //框都是绘制在画布中间的
      var sizeTwo = {width: 2560,  height: 1080}
      var boxArr = [sizeOne, sizeTwo]
      var lineArr = []
      for(var i = 0; i < boxArr.length; i++){
          var box = boxArr[i]
          var marginTop = (baseSize.height - box.height) * 0.5
          var top1 = marginTop / baseSize.height
          var top2 = (box.height + marginTop) / baseSize.height

          if(top1 != 0){
            lineArr.push({top: top1 * data.height, left: 0, width: '100%', height: '2px'})
          }
          if(top2 != 1){
            lineArr.push({top: top2 * data.height, left: 0, width: '100%', height: '2px'})
          }

          var marginLeft = (baseSize.width - box.width) * 0.5
          var left1 = marginLeft / baseSize.width
          var left2 = (box.width + marginLeft) / baseSize.width
          if(left1 != 0){
            lineArr.push({ top: 0, left: left1 * data.width, width: '2px', height: '100%'})
          }
          if(left2 != 1){
            lineArr.push({ top: 0, left: left2 * data.width, width: '2px', height: '100%'})
          }
          // console.log('top1', top1, top2, left1, left2)
      }
      this.saveAreaLines = lineArr
      // console.log('saveAreaLines', this.saveAreaLines)
    },

    onPreviewTreeSizeChange(data){
      this.cocosPreviewTreeWidth = data.width
    },

    onSelectCocosNode(treeNodes){
      // console.log('选择了节点数的节点', treeNodes)
      var nodeId = treeNodes[0]
      var node = CocosMgr.getNodeById(nodeId)
      if(node != null){
        CocosMgr.drawNodeRect(node)
      }
    },


     //手动切换黑暗模式
    onHandDarkMode(isDarkMode){
        // console.log('onHandDarkMode', isDarkMode)
        if(window.onChangeDarkMode != null){
            window.onChangeDarkMode(isDarkMode)
        }
        // console.log(window.matchMedia('(prefers-color-scheme: dark)'))
    },
    
    //
    handleSoundBoxTableChange(pagination, filters, sorter){
      // console.log('Various parameters', pagination, filters, sorter);
      this.filteredInfo = filters;
      this.sortedInfo = sorter;
      if(sorter.columnKey != null){
        let index = this.soundBoxColumns.findIndex((item)=>{
          return item.key == sorter.columnKey
        })
        this.soundBoxColumns[index].sortOrder = sorter.order
      }
    },

    //点击资源库中的某一行使用
    onBtnUseBoxOneRow(record){
      console.log('onBtnUseBoxOneRow', record)
      if(record.type == 'sound'){
        this.onClickMenuItem({key: 'output/sound', initProp: {customeName: record.customeName}})
      }else if(record.type == 'spine'){
        this.onClickMenuItem({key: 'objects/createObject', initProp: {modal: CocosMgr.ObjectTypeEnum.spine, customeName: record.customeName}})
      }else if(record.type == 'image'){
        this.onClickMenuItem({key: 'objects/createObject', initProp: {modal: CocosMgr.ObjectTypeEnum.sprite, customeName: record.customeName}})
      }
      this.$message.success('已添加：' + record.customeName)
    },

    donwLoadUrl(url, name){
      let a = document.createElement('a')
        a.href = url
        a.download = name //record.name + CocosMgr.getExName(record.customeName, true)
        a.click()
    },

    onBtnDownLoadBoxOneRow(record){
      // console.log('record', record)
      let url = CocosMgr.rootHost + '/' + record.customeName
      // let name = record.name + CocosMgr.getExName(record.customeName, true)
      if(record.type == 'spine'){
        //需要下载三个文件
        this.donwLoadUrl(url + '.json',  record.name + '.json')
        setTimeout(() => {
          this.donwLoadUrl(url + '.atlas', record.name + '.atlas')
        }, 100);
         setTimeout(() => {
           this.donwLoadUrl(url + '.png',   record.name + '.png')
        }, 200);
      }else{
        this.donwLoadUrl(url, record.name + CocosMgr.getExName(record.customeName, true))  
      }
    },

    onBtnPlayBoxOneRow(record){
      let url = CocosMgr.rootHost + '/' + record.customeName
      console.log('record', record, url)
      if(record.type == 'spine'){

      }else if(record.type == 'sound'){
        //播放音频
        if(this.templeteAudio != null){
          this.templeteAudio.pause()
          this.templeteAudio.src = url
        }else{
          this.templeteAudio = new Audio(url);
        }
        this.templeteAudio.play()
      }
    },

    //handleChange
    onFileChange(info){
      console.log('handleChange' , info)
    },

    handleDragOver(event){
      event.dataTransfer.dropEffect = 'copy';
    },

    //如果是spine动画，那应该以三个文件来计算是否变化？

    //上传资源并自动在当前蓝图中生成物体对象
    async uploadOneFile(file, autoCreateNode){
      return new Promise((resolve, reject) => {
          const fr = new FileReader()
          const spark = new SparkMD5.ArrayBuffer();
         
          fr.onload = async (e)=>{
            try {
              spark.append(fr.result);
              var md5 = spark.end();
              // console.log('当前文件的md5', md5)
              var fileName = file.name
              var fileEx
              if(fileName.indexOf('.') != -1){
                fileName = file.name.split('.')
                fileEx = fileName[fileName.length - 1]
                fileName.splice(fileName.length - 1, 0, md5.substring(0, 8))
              }
              fileName = fileName.join('.')
              if(ossClient == null){
                this.$message.error('当前没有访问远程资源权限！请先设置AccessKey')
                return
              }
              //可以加上缓存，如果md5相同的说明上传过，无需重复上传
              await ossClient.put('bookEdit/' + fileName , file)
              
              //加入到蓝图中
              var graph = this.getCurEditLGraph()
              if(graph != null){
                // // console.log('node_const', node_const)
                var pos = [200,200];
                //计算要放置在蓝图中的位置
                if(graph.list_of_graphcanvas[0] != null){
                  var viewport = graph.list_of_graphcanvas[0].visible_area
                  // [-0, -0, 722, 754]
                  pos = [this.dropedX + viewport[0], this.dropedY + viewport[1]];
                  this.dropedX += 40
                  this.dropedY += 40
                  // console.log('viewport', viewport)
                }

                let fileType = CocosMgr.getFileType(fileEx)

                if(fileType != '音频'){
                  let node = LiteGraph.createNode("objects/createObject");
                  graph.add(node);
                  node.pos = pos
                  node.setProperty('modal', fileType)
                  console.log('fileType', fileType)
                  if(fileType == 'spine'){
                    console.log('直接设置了premulAlpha')
                    node.setProperty('premulAlpha', true)
                  }
                  node.setProperty('customeName', fileName)
                }else{
                  let node = LiteGraph.createNode("output/sound");
                  graph.add(node);
                  node.pos = pos
                  node.setProperty('customeName', fileName)
                }
                

                // node_const.setValue(4.5);
              }
              
              resolve()
            } catch (error) {
              console.error('资源上传失败：', error)
              this.$message.error('资源上传失败：' + file.name)
              resolve()
            }
          }
          fr.readAsArrayBuffer(file)
      })
    },


    //上传文件到目录
    async uploadFiles(files){
      console.log('上传了文件', files)
      for(var i = 0; i < files.length; i++){
        var file = files[i]
        await this.uploadOneFile(file, true)
      }
      console.log('上传文件结束')
    },

    //生成md5
    async genMd5(group){
      const spark = new SparkMD5.ArrayBuffer();
      for(var i = 0; i < group.files.length; i++){
        var result = await this.readArrayBufferFile(group.files[i])
        spark.append(result);
      }
      var md5 = spark.end();
      return md5.substring(0, 8)
    },

    //加入文件到蓝图
    addGroupFileToGraph(oneGroup){
      //加入到蓝图中
      var graph = this.getCurEditLGraph()
      if(graph != null){
        // // console.log('node_const', node_const)
        var pos = [200,200];
        //计算要放置在蓝图中的位置
        if(graph.list_of_graphcanvas[0] != null){
          var viewport = graph.list_of_graphcanvas[0].visible_area
          // [-0, -0, 722, 754]
          pos = [this.dropedX + viewport[0], this.dropedY + viewport[1]];
          // this.dropedY += 40
          // console.log('viewport', viewport)
        }
        if(oneGroup.x != null){
          pos[0] = oneGroup.x
        }
        if(oneGroup.y != null){
          pos[1] = oneGroup.y
        }

        let fileType = CocosMgr.getFileType(oneGroup.type)
        var objectTypes = ['空物体','图片','绘制','spine','文本']
        if(objectTypes.indexOf(fileType) != -1){
          let node = LiteGraph.createNode("objects/createObject");
          node.pos = pos
          this.dropedX += node.width + 3
          node.setProperty('modal', fileType)
          var count = graph.findNodesByType('objects/createObject').length
          console.log('当前页面object数量', count)
          node.setProperty('zIndex', count)
          node.setProperty('customeName', oneGroup.path)
          // node.flags.collapsed = true

          if(fileType == 'spine'){
            node.setProperty('premulAlpha', true)
            graph.add(node);
            //同时创建骨骼动画
             let aniNode = LiteGraph.createNode("objects/animates/animate");
             aniNode.setProperty('autoRun', true)
             aniNode.pos = [node.pos[0] + node.width + 3, node.pos[1]]
             this.dropedX += node.width + 3
             graph.add(aniNode);
             node.connect(0, aniNode, 0)
          }else{
            graph.add(node);
          }
        }else if(fileType == '音频'){
          let node = LiteGraph.createNode("output/sound");
          node.pos = pos
          this.dropedX += node.width + 3
          node.setProperty('customeName', oneGroup.path)
          graph.add(node);
        }
        // node_const.setValue(4.5);
      }
    },

    //上传一整组文件
    async uploadGroupFile(groupFile){
      if(ossClient == null){
        this.$message.error('当前没有访问远程资源权限！请先设置AccessKey')
        return
      }

      this.importProgress = 0
      this.importInfo = 0 + '/' + groupFile.length
      // this.setPolicyState(this.tabActiveKey, 'progress', 0)
      // this.setPolicyState(this.tabActiveKey, 'importInfo', 0 + '/' + groupFile.length)

      let fs = null
      if(window.require != null){
        fs = window.require('fs')
      }

      for(var i = 0; i < groupFile.length; i++){
        var oneGroup = groupFile[i]
        oneGroup.md5 = await this.genMd5(oneGroup)

        try {
          if(oneGroup.files.length == 1){
            var fileName = oneGroup.name + '.' + oneGroup.md5 + '.' + oneGroup.type
            oneGroup.path = fileName
            oneGroup.customeName = fileName
            if(typeof oneGroup.files[0].path == 'string'){
              if(fs != null){
                let buffer = fs.readFileSync(oneGroup.files[0].path);
                // let arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
                await ossClient.put('bookEdit/' + fileName, buffer)
              }else{
                console.warn('文件路径上传需要当前有fs环境')
              }
            }else{
              await ossClient.put('bookEdit/' + fileName, oneGroup.files[0])
            }
          }else{
            oneGroup.modal = 'spine'
            oneGroup.path = oneGroup.md5 + '/' + oneGroup.name
            oneGroup.customeName = oneGroup.path
            for(var j = 0; j < oneGroup.files.length; j++){
              if(typeof oneGroup.files[j].path == 'string'){
                if(fs != null){
                  let buffer = fs.readFileSync(oneGroup.files[j].path);
                  // let arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
                  // await ossClient.put('bookEdit/' + fileName, buffer)
                  await ossClient.put('bookEdit/' + oneGroup.md5 + '/' + oneGroup.files[j].name, buffer)
                }else{
                  console.warn('文件路径上传需要当前有fs环境')
                }
              }else{
                await ossClient.put('bookEdit/' + oneGroup.md5 + '/' + oneGroup.files[j].name, oneGroup.files[j])
              }
              
            }
          }
        } catch (error) {
          this.$message.error('上传文件失败:' + error, 3)
          console.log('error', error)
        }
        
        //创建node
        if(this.tabActiveKey != 0){
          //在资源面板上传的时候，不将文件添加到当前蓝图
          if(this.showSoundBoxModal == false){
              //在首页时是导入操作，不需要创建节点
              //在这里判断是否需要替换还是创建新节点，如果替换了就不需要创建节点
              if(this.configs.uploadReplaceAssestByName == true){
                let hasReplace = this.replaceFileGrpup(oneGroup)
                if(hasReplace == false){
                  this.addGroupFileToGraph(oneGroup)
                }
              }else{
                this.addGroupFileToGraph(oneGroup)
              }
          }else{
              //当前在资源面板的上传操作，仅仅替换资源，注意，此处不保存，需要手动保存
              this.replaceFileGroupByBook(oneGroup)
          }
        }

        this.importProgress = Math.ceil((i + 1) / groupFile.length * 100)
        this.importInfo = (i + 1) + '/' + groupFile.length

        if(this.showSoundBoxModal == true){
          //刷新一下当前资源面板的显示
          this.freshAssestBoxData()
        }

        // this.setPolicyState(this.tabActiveKey, 'progress',  Math.ceil((i + 1) / groupFile.length * 100))
        // this.setPolicyState(this.tabActiveKey, 'importInfo', )
      }
      if(this.ruleChooseTabOption == '表格'){
        this.getCurEditLgraphTable()
      }
      // CocosMgr.preLoad(groupFile)
      console.log('uploadGroupFile', groupFile)
    },


    async readJsonFile(file){
      if(typeof file.path == 'string'){
        if(window.require != null){
          let fs = window.require('fs')
          let text = fs.readFileSync(file.path, 'utf-8');
          return JSON.parse(text)
        }
      }
      return new Promise((resolve, reject) => {
          const fr = new FileReader()
          fr.onload = async (e)=>{
              resolve(JSON.parse(fr.result))
          }
          fr.readAsText(file)
      })
    },

    async readArrayBufferFile(file){
      if(typeof file.path == 'string'){
        if(window.require != null){
          let fs = window.require('fs')
          let buffer = fs.readFileSync(file.path);
          let arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
          return arrayBuffer
        }
      }
      return new Promise((resolve, reject) => {
          const fr = new FileReader()
          fr.onload = async (e)=>{
            resolve(fr.result)
          }
          fr.readAsArrayBuffer(file)
      })
    },

    // async readJsonFile(file){
    //   return new Promise((resolve, reject) => {
    //       const fr = new FileReader()
    //       fr.onload = async (e)=>{
    //           resolve(JSON.parse(fr.result))
    //       }
    //       fr.readAsText(file)
    //   })
    // },

    getSpineOtherFiles(filesDit, spineName){
      var arr = []
      for(var fileName in filesDit){
        var baseName = fileName.split('.')[0]
        if(baseName == spineName){
          arr.push(filesDit[fileName])
          delete filesDit[fileName]
        }
      }
      return arr
    },

    async prepareDealFiles(files){
      //先匹配所有spine文件
      var groupFile = []
      var filesDit = {}
      for(var i = 0; i < files.length; i++){
          // console.log('file【i】', files[i])
          filesDit[files[i].name] = files[i]
      }
      for(var fileName in filesDit){
         var file = filesDit[fileName]
         var fileEx = CocosMgr.getExName(fileName)
          if(fileEx == 'json'){
              var obj = await this.readJsonFile(file)
              // console.log(file.name, obj)
              if(obj.skeleton != null && obj.skeleton.spine != null){
                //文件列表中有spine动画文件
                var spineName = file.name.split('.')[0]
                var oneGroupFiles = this.getSpineOtherFiles(filesDit, spineName)
                groupFile.push({files: oneGroupFiles, type: 'spine', name: spineName})
              }
          }
      } 
      for(var fileName in filesDit){
        groupFile.push({files: [filesDit[fileName]], type: CocosMgr.getExName(fileName), name: CocosMgr.getBaseName(fileName)})
      }
      await this.uploadGroupFile(groupFile)
      return groupFile
      // console.log("groupFile", groupFile)
    },

    

    //要预处理文件，构建文件组，一个spine是一组文件，上传的是一组文件到后台，但是只创建一个节点
    handleDrop(event){
      const files = event.dataTransfer.files;
      //以元素的左上角为原点，右下角为最大坐标
      console.log('最终drop的位置', event.offsetX, event.offsetY)
      this.dropedX =  event.offsetX
      this.dropedY =  event.offsetY

      if (files.length) {
        this.prepareDealFiles(files); // 上传文件的方法
      }
    },

    onBtnImportAssest(info){
      var files = null
      if( this.$refs.modelImport2.files == null ){
        files = this.$refs.modelImport2[0].files
      }else{
        files = this.$refs.modelImport2.files
      }
      // console.log('上传资源', files)
      let centerPos = this.getEditViewCenterPos(true)
      this.dropedX = centerPos[0]
      this.dropedY = centerPos[1]

      if(files != null && files.length){
         this.prepareDealFiles(files); // 上传文件的方法
      }
      info.target.value= ""
    },

    //保存配置信息
    onSaveSetting(){
      let config = Rules.arrToDit(this.systemSetting, 'key', 'value')
      ossClient = new OSS.default({
          region: 'oss-cn-shanghai',
          accessKeyId: config.accessKeyId,
          accessKeySecret: config.accessKeySecret,
          bucket: config.bucket,
      });
      localStorage.setItem('bookEditConfig', JSON.stringify(config))
      // console.log('保存了配置信息', config)
    },


    onStopClick(event1, event2){
      // console.log('onStopClick', event)
      if(event1 != null){
        if(event1.stopPropagation){
          event1.stopPropagation()
        }
      }
      if(event2 != null){
        if(event2.stopPropagation){
          event2.stopPropagation()
        }
      }
    },

    //
    // async onSyncFromCloud(){
    //   // if(ossClient == null){
    //   //   this.$message.error('当前没有访问远程资源权限！请先设置AccessKey')
    //   //   return
    //   // }
    //   // let result = await ossClient.listV2({
    //   //   prefix: 'bookEditProject/',
    //   //   delimiter: '/'
    //   // });
    //   // console.log(result)
    //   await get()
    // }


    //筛选绘本列表
    handleSearch(selectedKeys, confirm, dataIndex){
      // console.log('selectedKeys', selectedKeys)
      confirm();
      // state.searchText = selectedKeys[0];
      // state.searchedColumn = dataIndex;
    },

    handleReset(clearFilters){
      clearFilters({ confirm: true });
      // state.searchText = '';
    },

    //打开Ai助理
    openAiChat(){
      this.showAiChatModal = true
    },

    //关闭Ai助理
    closeAiChat(){
      this.showAiChatModal = false
    },

    //处理AI聊天发送消息
    handleAiChatSend(message){
      // TODO: 实现发送消息逻辑
      console.log('发送消息:', message)
    },

    //监听蓝图事件
    onLiteGraphCanvas(event){
      console.log('onLiteGraphCanvas', event)
      if(event.detail.subType == 'node-double-click'){
        let node = event.detail.node
        // 获取 node id 和 type
        const nodeId = node.id
        const nodeType = node.type || node.constructor.type || 'unknown'
        
        // 确保 AI 聊天卡片打开
        if (!this.showAiChatModal) {
          this.showAiChatModal = true
        }
        
        // 将 node 信息发送到 AiChatCard 组件
        this.$nextTick(() => {
          if (this.$refs.aiChatCardRef) {
            this.$refs.aiChatCardRef.addNodeTag(nodeId, nodeType)
          }
        })
      }
    }

  }
}
</script>

<style>
.about {
  /* min-height: 100vh; */
  width: 100vw;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
}
.gird {
    /* transition: border-color 0.3s背景色和文字颜色在0.3秒内平滑过渡 */
}
.gird:hover{
  border-width: 1px; 
  border-style: solid;
  border-color: #1853AA;
}
#tfjs-visor-container{
  color: #2C3D50;
}
::after .ant-card-body {
    padding: 5px;
}
.expandPolicyList{
  width: 500px;
}
.noexpandPolicyList{
  width: 280px;
}
.widthAni{
  transition: width 0.5s ease-in-out;
}
</style>

<style scoped>
.about>>>
.ant-card
.ant-card-body{
  padding: 5px;
}

.about>>>
.ant-collapse
.ant-collapse-item
.ant-collapse-header{
  padding: 7px;
  padding-left: 10px;
}

.about>>>
.ant-collapse
.ant-collapse-item
.ant-collapse-header{
  padding: 7px;
  padding-left: 10px;
}

/* :where(.css-dev-only-do-not-override-13gz7x).ant-collapse>.ant-collapse-item >.ant-collapse-header */
.about>>>
.ant-collapse 
.ant-collapse-content
.ant-collapse-content-box {
    padding: 10px 10px;
    padding-top: 5px;
}

.about>>>
.ant-tree 
.ant-tree-indent-unit{
  width: 12px;
}

.about>>>
.ant-menu-light
.ant-menu-submenu-popup{
  user-select: none;
}

.about>>>
.ant-menu-submenu{
  user-select: none;
}

.about>>>
.ant-menu-submenu-popup
.ant-menu-vertical
.ant-menu-sub{
  user-select: none;
}


.ant-menu-vertical{
  user-select: none;
}






</style>