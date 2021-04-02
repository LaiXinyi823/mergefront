<template>
  <el-container>
    <div v-if="opt == 'projectList'">
      <div @click="addDialogVisible=true" style="height: 200px; float: left">
        <el-card class="box-card" shadow="never">
          <i style="font-size: 20px; float: left; margin-top: 50px" class="el-icon-plus">
            添加新项目</i>
        </el-card>
      </div>
      <div @click="projectDetail(project.project_id, project.project_name)">
        <el-card class="box-card" v-for="project in projectList" :key="project.project_id" shadow="never">
          <div slot="header" class="clearfix">
            <span>{{ project.project_name }}</span>
            <el-button style="float: right; padding: 3px 0" type="text" >
              查看详情</el-button>
          </div>
          <div class="text item">所属领域：</div>
          <div class="text item">权限：</div>
        </el-card>
      </div>
      <el-dialog title="新增项目" :visible.sync="addDialogVisible">
        <el-form :model="newProject">
            <el-form-item label="项目名称" :label-width="formLabelWidth">
            <el-input v-model="newProject.name" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addProject()">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <div v-if="opt == 'projectDetail'" style="width: 100%; height: 100px; background: white">
      <el-card style="width: 100%; height: 65px; background-color: #fff" shadow="never">
        <el-page-header @back="goBack()" :content="project_name + ' 项目详情'" style="float: left">
        </el-page-header>
      </el-card>
      <div style="width: 100%; margin-top: 5px">
        <el-tabs type="border-card">
          <el-tab-pane>
            <span slot="label"><i class="el-icon-document"></i> 文本生成知识图谱子图</span>
            <div>
              <!-- 输入文本数据 -->
              <el-aside width="540px" style="float:left">
                <el-card shadow="always">
                  <h5 style="margin: 0; display: inline; width: 30px">
                    输入文本
                  </h5>
                  <el-divider content-position="left" style="margin: 10px;" />
                  <el-input type="textarea" :rows="10" placeholder="请输入待生成知识图谱的文本内容" v-model="textarea" class="textinput"/>
                  <el-button @click="gen_childGraph()" type="primary" plain style="float:right;margin-top:3px;margin-bottom:3px;"> 确认生成 </el-button>
                </el-card>
              </el-aside>
              <!-- 生成知识图谱子图 -->
              <el-aside width="700px" height="100%" class="childKG" style="float:right">
                <el-card shadow="always">
                  <h5 style="margin: 0; display: inline; width: 50px">生成子图</h5>
                  <el-divider content-position="left" style="margin: 15px" />
                  <!-- <div class="block"> -->
                     <div id="main" ref="childGraph" style="width: 600px;height:300px;"></div>
                  <!-- </div> -->
                  <template>
                    <el-table
                      :data="child_graph_data"
                      height="320"
                      font-size="12px"
                      border
                      style="width: 100%"
                      :row-style="{ height: '10px' }"
                      :cell-style="{ padding: '0' }"
                    >
                      <el-table-column fixed type="index" label="序号" width="50" />
                      <el-table-column prop="e1" label="起点实体" width="80" />
                      <el-table-column prop="e1_type" label="起点实体类型" width="110" />
                      <el-table-column prop="e2" label="终点实体" width="80" />
                      <el-table-column prop="e2_type" label="终点实体类型" width="110" />
                      <el-table-column prop="relation_type" label="关系类型" width="80" />
                      <el-table-column fixed="right" label="操作" width="100">
                        <template slot-scope="scope">
                          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                          <el-button type="text" size="small"> 编辑 </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-card>
              </el-aside>
            </div>

            <!-- 知识图谱融合 -->
            <el-aside width="540px" height="100%" style="margin-top:5px;">
              <el-card shadow="always">
                <h5 style="margin:0;display:inline;width:50px;">
                  知识图谱融合预览
                </h5>
                <el-button style="float:right" type="primary" plain>
                  确认融合
                </el-button>
                <el-divider content-position="left" style="margin:10px"/>
                <div class="block">
                  <el-image :src="src" style="width:40%;height:50%;margin-left:30%;"/>
                </div>
                <h5 style="color:#800000;">
                  提示：新增4个实体，对应3种关系
                </h5>
                <h4 style="float:left;margin:0;">
                  显示层数：
                </h4>
                <el-input-number size="mini" v-model="num1" style="float:left"/>
                <h4 style="float:left;margin:0;margin-left:30px;">
                  显示条数：
                </h4>
                <el-input-number size="mini" v-model="num2" style="float:left"/>
              </el-card>
            </el-aside>
          </el-tab-pane>

          <el-tab-pane>
            <span slot="label"><i class="el-icon-user"></i> 用户管理</span>
            用户管理
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </el-container>
</template>

<script>
import * as echarts from 'echarts'
export default {
  created() {
    this.getProjectList()
  },
  data() {
    return {
      projectList: [],
      currentDate: new Date(),
      addDialogVisible: false,
      formLabelWidth: '100px',
      opt: 'projectList',
      project_id: 0,
      project_name: '',
      newProject:{
        "name":'',
        "domain":''
      },
      textarea:'', // 用户输入文本内容
      num1: 1,
      num2: 10,
      src:
        'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      child_graph_data: [],
    }
  },
  methods: {
    async getProjectList() {
      const res = await this.$http.get('list_projects')
      this.projectList = res.data.data
    },
    // 查看项目详情
    projectDetail(project_id, project_name) {
      this.project_id = project_id
      this.project_name = project_name
      this.opt = 'projectDetail'
      console.log(this.opt)
    },
    // 详情界面返回函数
    goBack() {
      this.opt = 'projectList'
    },
    // 文本生成知识图谱子图
    async gen_childGraph(){
      const res = await this.$http.get('http://39.100.48.36:3012/predict_re?sentence=' + this.textarea)
      // print(res)
      console.log(res.data.relations)
      var data = res.data.relations
      this.graph_nodes = []; // 节点数据初始化
      this.graph_links = []; // 关系数据初始化
      this.child_graph_data = res.data.relations
      var len = data.length;
      for(var i=0;i<len;i++){
        if(JSON.stringify(this.graph_nodes).indexOf(JSON.stringify(data[i]['e1']))>-1){
        }
        else{
          this.graph_nodes.push(
            {
              "id":data[i]['e1_type'] + '/' + data[i]['e1'],
              "name":data[i]['e1'],
              "type":data[i]['e1_type']
            }
            
          )
        }
        if(JSON.stringify(this.graph_nodes).indexOf(JSON.stringify(data[i]['e2']))>-1){
        }
        else{
          this.graph_nodes.push(
            {
              "id":data[i]['e2_type'] + '/' + data[i]['e2'],
              "name":data[i]['e2'],
              "type":data[i]['e2_type']
            }
          )
        }
        this.graph_links.push(
          {
            "id":data[i]['relation_type'] + '/' + data[i]['e1_type'] + '/'
             + data[i]['e1'] + 'to' + data[i]['e2_type'] + '/' + data[i]['e2'],
            "source":data[i]['e1_type'] + '/' + data[i]['e1'],
            "target":data[i]['e2_type'] + '/' + data[i]['e2']
          }
        )
      }
      // 使用Echarts展示
      var myChart = echarts.init(this.$refs.childGraph);
      var option = {
                    tooltip: {},
                    animationDurationUpdate: 1500,
                    animationEasingUpdate: 'quinticInOut',
                    series: [
                        {
                            type: 'graph',
                            layout: 'force',
                            symbolSize: 50,
                            roam: true,
                            force: {
                                repulsion: 2500,
                                edgeLength: [10, 50],
                                draggable:true
                            },
                            itemStyle: {//配置节点的颜色
                                normal: {
                                    color: function (params) {
                                      var colorList = ['red','yellow','orange', 'green', 'blue', 'gray'];
                                      return colorList[params.dataIndex]                                    
                                    },
                                }
                            },
                            symbolSize: function (value, params) {//改变节点大小
                              return 40
                            },
                            label: {
                                show: true
                            },
                            edgeSymbol: ['circle', 'arrow'],
                            edgeSymbolSize: [4, 10],
                            edgeLabel: {
                                fontSize: 20
                            },
                            nodes: this.graph_nodes, // 节点数据
                            links: this.graph_links, // 关系数据
                            edgeLabel: {//边的设置
                                show: true,
                                position: "middle",
                                fontSize: 12,
                                formatter: (params) => {
                                    return params.data.id.split('/')[0];
                                },
                            },
                            lineStyle: {
                                opacity: 0.9,
                                width: 2,
                                curveness: 0
                            }
                            }
                            ]
                    };
                    myChart.setOption(option);    
                    //点击事件
                    myChart.on('click', function (params) {
                        if (params.dataType == 'node') {
                            console.log(params.name)
                        }
                        else if (params.dataType == 'edge'){
                            console.log(params)
                        }
                    });
            }
    }
}
</script>
<style>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.image {
  width: 100%;
  display: block;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 200px;
  height: 200px;
  margin-right: 10px;
  display: inline-block;
  margin-bottom: 10px;
}

.card {
  width: 200px;
  height: 200px;
  margin-bottom: 10px;
  margin-top: 10px;
}
 /* 文本输入框样式 */
.textinput {
  width: 450px;
  margin-top: 0;
  margin-left: 5px;
  margin-right: 5px;
}
</style>