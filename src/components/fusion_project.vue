<template>
  <el-container>
    <div v-if="opt == 'projectList'">
      <div style="margin-top:10px;margin-bottom:30px;">
        <el-button type="success" icon="el-icon-plus" circle @click="addDialogVisible=true" style="margin-left:20px;margin-right:20px;"></el-button>创建新融合项目
      </div>
      <el-col
        :span="4.5"
        v-for="project in projectList"
        :key="project.project_id"
        :offset="0"
      >
        <div @click="projectDetail(project.project_id, project.project_name)">
          <el-card
            class="box-card"
            shadow="never"
            style="height:80%"
          >
            <div slot="header" class="clearfix">
              <span>{{ project.project_name }}</span>
            </div>
            <el-button @click="project_id=project.project_id,deleteDialogVisible=true" style="float: left;color:#606266" type="text">编辑
            </el-button>
            <el-button @click="project_id=project.project_id,deleteDialogVisible=true" style="float: right;color:#F56C6C" type="text">删除
            </el-button>
          </el-card>
        </div>
      </el-col>
      <!-- 创建新的标注项目 -->
      <el-dialog title="新增标注项目" :visible.sync="addDialogVisible" style="width:40%;margin:0 auto">
        <el-form :model="newFusionProject">
          <el-form-item label="项目名称" :label-width="formLabelWidth">
            <el-input v-model="newFusionProject.name" autocomplete="off"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addFusionProject()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 删除标注项目 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="30%"
      center>
      <span>确认删除该项目？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteProject(project_id)">确 定</el-button>
      </span>
    </el-dialog>

    <div v-if="opt == 'projectDetail'" style="width: 100%; height: 100%;">
      <el-card style="width: 100%; height: 65px;" shadow="never">
        <el-page-header @back="goBack()" :content="project_name + ' 项目详情'" style="float: left"/>
      </el-card>
      <div style="width: 100%; margin-top: 5px">
        <el-tabs type="border-card">
          <el-tab-pane>
            <span slot="label"><i class="el-icon-document"/> 融合项目</span>
            <!-- <div style="margin-bottom:10px;">
              融合数据：
              <el-radio v-model="op" label="triple_data">三元组</el-radio> -->
              <!-- <el-radio v-model="label_op" label="TEXT">单文本</el-radio> -->
            <!-- </div> -->
            <el-divider><i class="el-icon-s-flag"></i></el-divider>
            <div>
              <div style="margin-bottom:20px;">
              <div style="float:left;margin-left:30px;">
                选择待融合数据：
                <el-select v-model="fusion.data" placeholder="请选择">
                  <el-option
                    v-for="item in tripledataList"
                    :key="item.data_id"
                    :label="item.data_name"
                    :value="item.data_id">
                  </el-option>
                </el-select>
              </div>
              <div style="float:left;margin-left:30px;">
                选择融合模型：
                <el-select v-model="fusion.model" placeholder="请选择">
                  <el-option
                    v-for="item in modelList"
                    :key="item.model_id"
                    :label="item.model_name"
                    :value="item.model_id">
                  </el-option>
                </el-select>
              </div>
              <div style="float:left;margin-left:30px;">
                选择待融合图谱：
                <el-select v-model="fusion.graph" placeholder="请选择">
                  <el-option
                    v-for="item in graphList"
                    :key="item.graph_id"
                    :label="item.graph_name"
                    :value="item.graph_id">
                  </el-option>
                </el-select>
              </div>
              <el-button type="primary" style="margin-left:50px;" @click="tripledataVisible=true">生成融合报告</el-button>
            </div>         
            </div>
            <!-- 模型抽取生成三元组列表 -->
            <div v-if="tripledataVisible==true">
              <div style="margin-left:20px;margin-bottom:10px;">
                  <el-divider content-position="left"><span style="color:#409EFF"><i class="el-icon-paperclip"></i>  情况1: 至少一个实体已存在知识图谱中</span>
                  </el-divider>
              </div>
                  <el-table
                    ref="filterTable"
                    border
                    :data="newTripledata"
                    max-height="600"
                    style="width: 83%;margin-left:2%;">
                    <el-table-column fixed="left" type="index" width="50"></el-table-column>
                    <el-table-column prop="e1_type" label="起始类型" sortable width="180"></el-table-column>
                    <el-table-column prop="e1_name" label="起始节点名" width="180"></el-table-column>
                    <el-table-column prop="relation" label="关系" width="180">
                      <template slot-scope="scope">
                        <el-tag size="medium" type="success">{{ scope.row.relation}}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column prop="e2_type" label="终止类型" width="180"></el-table-column>
                    <el-table-column prop="e2_name" label="终止节点名" width="180"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="120">
                      <template slot-scope="scope">
                          <!-- 删除某一条边 -->
                          <!-- <el-dialog title="提示" :visible.sync="scope.row.link_deleteVisible" width="30%" center>
                            <span>您确定要删除这条关系数据吗？{{scope.row.relation_id}}</span>
                            <span slot="footer" class="dialog-footer">
                              <el-button @click="scope.row.link_deleteVisible = false">取 消</el-button>
                              <el-button type="primary">确 定</el-button>
                            </span>
                          </el-dialog>   -->
                        <el-button type="text" size="small">编辑</el-button>
                        <el-button type="text" size="small" style="color:red">移除</el-button>
                          <!-- 编辑关系节点-drawer -->
                          <!-- <el-drawer
                            title="编辑数据"
                            :append-to-body="true"
                            :visible.sync="scope.row.link_editVisible">
                            <p>_(:зゝ∠)_</p>
                          </el-drawer> -->
                      </template>
                    </el-table-column>
                  </el-table>
              <div style="margin-left:20px;margin-bottom:10px;margin-top:20px;">
                  <el-divider content-position="left"><span style="color:#67C23A"><i class="el-icon-circle-plus-outline"></i>  情况2: 两实体均为新实体</span>
                  </el-divider>
              </div>
                  <el-table
                    ref="filterTable"
                    border
                    :data="tripledata"
                    max-height="600"
                    style="width: 83%;margin-left:2%;">
                    <el-table-column fixed="left" type="index" width="50"></el-table-column>
                    <el-table-column prop="e1_type" label="起始类型" sortable width="180"></el-table-column>
                    <el-table-column prop="e1_name" label="起始节点名" width="180"></el-table-column>
                    <el-table-column prop="relation" label="关系" width="180">
                      <template slot-scope="scope">
                        <el-tag size="medium" type="success">{{ scope.row.relation}}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column prop="e2_type" label="终止类型" width="180"></el-table-column>
                    <el-table-column prop="e2_name" label="终止节点名" width="180"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="120">
                      <template slot-scope="scope">
                          <!-- 删除某一条边 -->
                          <!-- <el-dialog title="提示" :visible.sync="scope.row.link_deleteVisible" width="30%" center>
                            <span>您确定要删除这条关系数据吗？{{scope.row.relation_id}}</span>
                            <span slot="footer" class="dialog-footer">
                              <el-button @click="scope.row.link_deleteVisible = false">取 消</el-button>
                              <el-button type="primary">确 定</el-button>
                            </span>
                          </el-dialog>   -->
                        <el-button type="text" size="small">编辑</el-button>
                        <el-button type="text" size="small" style="color:red">移除</el-button>
                          <!-- 编辑关系节点-drawer -->
                          <!-- <el-drawer
                            title="编辑数据"
                            :append-to-body="true"
                            :visible.sync="scope.row.link_editVisible">
                            <p>_(:зゝ∠)_</p>
                          </el-drawer> -->
                      </template>
                    </el-table-column>
                  </el-table>
              <div style="margin-left:20px;margin-bottom:10px;margin-top:20px;">
                  <el-divider content-position="left"><span style="color:#909399"><i class="el-icon-warning"></i>  情况3: 孤立新节点</span>
                  </el-divider>
              </div>
                  <el-table
                    ref="filterTable"
                    border
                    :data="tripledata"
                    max-height="600"
                    style="width: 35%;margin-left:2%;">
                    <el-table-column fixed="left" type="index" width="50"></el-table-column>
                    <el-table-column prop="e1_type" label="类型" sortable width="180"></el-table-column>
                    <el-table-column prop="e1_name" label="节点名" width="180"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="120">
                      <template slot-scope="scope">
                          <!-- 删除某一条边 -->
                          <!-- <el-dialog title="提示" :visible.sync="scope.row.link_deleteVisible" width="30%" center>
                            <span>您确定要删除这条关系数据吗？{{scope.row.relation_id}}</span>
                            <span slot="footer" class="dialog-footer">
                              <el-button @click="scope.row.link_deleteVisible = false">取 消</el-button>
                              <el-button type="primary">确 定</el-button>
                            </span>
                          </el-dialog>   -->
                        <el-button type="text" size="small">编辑</el-button>
                        <el-button type="text" size="small" style="color:red">移除</el-button>
                          <!-- 编辑关系节点-drawer -->
                          <!-- <el-drawer
                            title="编辑数据"
                            :append-to-body="true"
                            :visible.sync="scope.row.link_editVisible">
                            <p>_(:зゝ∠)_</p>
                          </el-drawer> -->
                      </template>
                    </el-table-column>
                  </el-table>
              <div style="margin-top:20px;margin-left:30px;float:left"><el-button type="primary" icon="el-icon-check">审核通过，确认融合</el-button></div>
            </div>

            <!-- <div v-if="label_op=='TEXT'">
              <div style="float:left;width:40%">
                <el-aside width="100%">
                  <el-card shadow="always">
                    <h5 style="margin: 0; display: inline; width: 30px">输入文本</h5>
                    <el-divider content-position="left"/>
                    <el-input type="textarea" :rows="7" placeholder="请输入待生成知识图谱的文本内容" v-model="textarea" class="textinput"/>
                    <el-divider></el-divider>
                    选择模型：
                    <el-select v-model="label_model" placeholder="请选择">
                      <el-option
                        v-for="item in modelList"
                        :key="item.data_id"
                        :label="item.data_name"
                        :value="item.data_id">
                      </el-option>
                    </el-select>
                      <el-button type="primary" style="margin-left:30px;" @click="gen_childGraph()">开始标注</el-button>
                      <el-button type="success" style="margin-left:10px;">暂存</el-button>
                  </el-card>
                </el-aside>
                <div style="margin-top:5px;">
                  <el-aside width="100%" height="100%">
                    <el-card shadow="always">
                      <h5 style="margin: 0; display: inline; width: 50px">生成子图</h5>
                      <el-link style="float:right" @click="childTableVisible=true" :underline="false">查看对应数据表格<i class="el-icon-view el-icon--right"></i> </el-link>
                      <el-divider content-position="left" style="margin: 15px"/>
                      <el-dialog title="子图对应的三元组数据" :visible.sync="childTableVisible" width="40%">
                        <el-table
                          :data="child_graph_data"
                          height="320"
                          font-size="12px"
                          border
                          style="width: 100%"
                          :row-style="{ height: '10px' }"
                          :cell-style="{ padding: '0' }"
                        >
                          <el-table-column fixed type="index" label="序号" width="50"/>
                          <el-table-column prop="e1" label="起点实体" width="110"/>
                          <el-table-column prop="e1_type" label="起点实体类型" width="110"/>
                          <el-table-column prop="e2" label="终点实体" width="110"/>
                          <el-table-column prop="e2_type" label="终点实体类型" width="110"/>
                          <el-table-column prop="relation_type" label="关系类型" width="110"/>
                          <el-table-column fixed="right" label="操作" width="100">
                            <template slot-scope="scope">
                              <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
                              <el-button type="text" size="small">删除</el-button>
                            </template>
                          </el-table-column>
                        </el-table>
                      </el-dialog>
                      <div id="main" ref="childGraph" style="width: 600px;height:300px;"/>
                    </el-card>
                  </el-aside>
                </div>
              </div>

              <div style="float:left;width:58%;margin-left:20px;">
                <el-aside width="100%" height="100%">
                  <el-card shadow="always">
                    <h5 style="margin:0;display:inline;width:50px;">知识图谱融合预览</h5>
                    <el-divider content-position="left" style="margin:10px"/>
                    <div class="block">
                      <el-image :src="src" style="width:40%;height:50%;margin-left:30%;"/>
                    </div>
                    <h5 style="color:#800000;">提示：新增4个实体，对应3种关系</h5>
                    <el-link style="float:right" @click="drawer=true" :underline="false">查看融合报告<i class="el-icon-view el-icon--right"></i> </el-link>
                    <el-drawer
                      title="我是标题"
                      :visible.sync="drawer"
                      :direction="direction"
                      :before-close="handleClose">
                      <span>我来啦!</span>
                    </el-drawer>

                    <h4 style="float:left;margin:0;">显示层数：</h4>
                    <el-input-number size="mini" v-model="num1" style="float:left"/>
                    <h4 style="float:left;margin:0;margin-left:30px;">显示条数：</h4>
                    <el-input-number size="mini" v-model="num2" style="float:left"/>
                    <el-button style="float:right" type="primary" plain>确认融合</el-button>
                  </el-card>
                </el-aside>
              </div>
            </div> -->
          </el-tab-pane>

        </el-tabs>
      </div>
    </div>
  </el-container>
</template>

<script>
import * as echarts from 'echarts';
export default {
  created() {
    this.getProjectList();
    //this.getTripledataList();
    //this.getGraphList();
  },
  data() {
    return {
      projectList: [],
      tripledataList:[],
      modelList:[{model_id:1,model_name:'实体对齐模型'}],
      graphList:[],
      currentDate: new Date(),
      addDialogVisible: false,
      formLabelWidth: '100px',
      opt: 'projectList',
      project_id: 0,
      project_name: '',
      newFusionProject:{
        name:'',
        type_id:1
      },
      textarea:'', // 用户输入文本内容
      num1: 1,
      num2: 10,
      src:
        'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      child_graph_data: [],
      childTableVisible:false,
      drawer: false,
      op:'triple_data',
      fusion:{data:'',model:'',graph:''},
      tripledataVisible:false,
      newTripledata:[{e1_name:'深度强化学习',e1_type:'处理方法',e2_name:'知识推理',e2_type:'处理方法',relation:'应用关系'},
      {e1_name:'深度强化学习',e1_type:'处理方法',e2_name:'自然语言处理',e2_type:'处理方法',relation:'应用关系'},
      {e1_name:'深度强化学习',e1_type:'处理方法',e2_name:'多任务迁移深度强化学习',e2_type:'处理方法',relation:'包含关系'},
      {e1_name:'深度强化学习',e1_type:'处理方法',e2_name:'多智能体深度强化学习',e2_type:'处理方法',relation:'包含关系'},
      {e1_name:'深度强化学习',e1_type:'处理方法',e2_name:'分层深度强化学习',e2_type:'处理方法',relation:'包含关系'}]
    };
  },
  methods: {
    // 获取项目列表
    async getProjectList() {
      const res = await this.$http.get('project?type=fusion');
      this.projectList = res.data.data;
      console.log(this.projectList)
    },
    // 获取三元组数据列表
    async getTripledataList(){
      const {data: res} = await this.$http.get('triple_data');
      this.tripledataList = res.data;
      console.log(this.tripledataList)
    },
    // 获取融合模型列表
    async getModelList(){
      const {data: res} = await this.$http.get('model/fusion');
      this.modelList = res.data;
      console.log(this.modelList)
    },
    // 获取图谱列表
    async getGraphList(){
      const {data: res} = await this.$http.get('graph');
      this.graphList = res.data;
      console.log(this.graphList)
    },
    // 查看项目详情
    projectDetail(project_id, project_name) {
      this.project_id = project_id;
      this.project_name = project_name;
      this.opt = 'projectDetail';
      console.log(this.opt);
    },
    // 创建融合项目
    async addFusionProject(){
      try{
        let res = await this.$http.post('project',this.newFusionProject);
        this.$message({
          showClose: true,
          message: '创建融合项目成功！',
          type: 'success',
        })
        this.addDialogVisible=false;
      }
      catch(err){
        this.$message({
          showClose: true,
          message: '该项目已存在！',
          type: 'error',
        })
        this.addDialogVisible=false;
      }
      this.reload();
    },
    // 删除项目
    async deleteProject(project_id){
      try{
        let res = await this.$http.delete('project/'+project_id);
        this.$message({
          showClose: true,
          message: '删除项目成功！',
          type: 'success',
        })
        this.deleteDialogVisible = false;
      this.reload();
      }
      catch{
        this.$message({
          showClose: true,
          message: '出现异常！',
          type: 'error',
        })
        this.deleteDialogVisible = false;
      }
      this.reload();
    },
    // 详情界面返回函数
    goBack() {
      this.opt = 'projectList';
    },
    // 文本生成知识图谱子图
    async gen_childGraph(){
      const res = await this.$http.get('http://39.100.48.36:3012/predict_re?sentence=' + this.textarea);
      // print(res)
      console.log(res.data.relations);
      var data = res.data.relations;
      this.graph_nodes = []; // 节点数据初始化
      this.graph_links = []; // 关系数据初始化
      this.child_graph_data = res.data.relations;
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
            
          );
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
          );
        }
        this.graph_links.push(
          {
            "id":data[i]['relation_type'] + '/' + data[i]['e1_type'] + '/'
             + data[i]['e1'] + 'to' + data[i]['e2_type'] + '/' + data[i]['e2'],
            "source":data[i]['e1_type'] + '/' + data[i]['e1'],
            "target":data[i]['e2_type'] + '/' + data[i]['e2']
          }
        );
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
                                      return colorList[params.dataIndex];                                    
                                    },
                                }
                            },
                            symbolSize: function (value, params) {//改变节点大小
                              return 40;
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
                            console.log(params.name);
                        }
                        else if (params.dataType == 'edge'){
                            console.log(params);
                        }
                    });
            }
    },
    handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    }
};
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