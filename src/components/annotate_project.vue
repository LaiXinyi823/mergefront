<template>
  <el-container>
    <div v-if="opt == 'projectList'">
      <div style="margin-top:10px;margin-bottom:30px;">
        <el-button type="primary" icon="el-icon-plus" circle @click="addDialogVisible=true" style="margin-left:20px;margin-right:20px;"></el-button>创建新标注项目
      </div>
      <el-col
        :span="4.5"
        v-for="project in projectList"
        :key="project.project_id"
        :offset="0"
      >
        <div>
          <el-card
            class="box-card"
            shadow="never"
            style="height:80%"
          >
            <div slot="header" class="clearfix" @click="projectDetail(project.project_id, project.project_name)">
              <span>{{ project.project_name }}</span>
            </div>
            <el-button @click="opt='projectList',project_id=project.project_id,updateDialogVisible=true" style="float: left;color:#606266" type="text">编辑
            </el-button>
            <el-button @click="opt='projectList',project_id=project.project_id,deleteDialogVisible=true" style="float: right;color:#F56C6C" type="text">删除
            </el-button>
          </el-card>
        </div>
      </el-col>
      <!-- 创建新的标注项目 -->
      <el-dialog title="新增标注项目" :visible.sync="addDialogVisible" style="width:40%;margin:0 auto">
        <el-form :model="newAnnotationProject">
          <el-form-item label="项目名称" :label-width="formLabelWidth">
            <el-input v-model="newAnnotationProject.name" autocomplete="off"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addAnnotationProject">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 重命名 -->
    <el-dialog title="重命名" :visible.sync="updateDialogVisible" style="width:40%;margin:0 auto">
      <el-form :model="rename">
        <el-form-item label="输入新名称" :label-width="formLabelWidth">
          <el-input v-model="rename.name" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="renameProject">确 定</el-button>
      </div>
    </el-dialog>
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
          <el-tab-pane label="标注项目">
            <!-- <div style="margin-bottom:10px;">
              标注方式：
              <el-radio v-model="label_op" label="DB">数据库</el-radio>
              <el-radio v-model="label_op" label="TEXT">文本</el-radio>
            </div> -->
            <el-divider><i class="el-icon-s-flag"></i></el-divider>
            <!-- <div v-if="label_op=='DB'"> -->
            <div style="margin-bottom:20px;">
              <div style="float:left;margin-left:30px;">
                选择文本数据：
                <el-select v-model="anotation.data" placeholder="请选择">
                  <el-option
                    v-for="item in rawdata_list"
                    :key="item.data_id"
                    :label="item.data_name"
                    :value="item.data_id">
                  </el-option>
                </el-select>
              </div>
              <div style="float:left;margin-left:30px;">
                选择标注模型：
                <el-select v-model="anotation.model" placeholder="请选择">
                  <el-option
                    v-for="item in modelList"
                    :key="item.model_id"
                    :label="item.model_name"
                    :value="item.model_url">
                  </el-option>
                </el-select>
              </div>
              <el-button v-if="task.task_id" type="primary" style="margin-left:50px;" disabled>开始标注</el-button>
              <el-button v-else type="primary" style="margin-left:50px;" @click="addTask()">开始标注</el-button>
            </div>
            <div v-if="task.task_id" style="width:100%;margin-left:30px;margin-top:30px;margin-bottom:30px;">任务执行进度：
              <el-tag v-if="task.task_state.state=='SUCCESS'" type="success">执行完毕</el-tag>
              <el-tag v-if="task.task_state.state=='PENDING'" type="warning">等待中</el-tag>
              <el-tag v-if="task.task_state.state=='PROGRESS'" type="danger">执行中</el-tag>
              <el-progress v-if="task.task_state.state=='SUCCESS'" :percentage="100" status="success" style="width:50%;margin-top:10px;"></el-progress>
              <el-progress v-else :percentage="parseInt((task.task_state.current/task.task_state.total)*100)" style="width:50%;margin-top:10px;"></el-progress>
            </div>
             
              <!-- 模型抽取生成三元组列表 -->
              <div style="width:90%;" v-if="tripledataVisible==true">
                <div style="margin-left:20px;margin-bottom:10px;"><span style="color:#409EFF"><i class="el-icon-s-data"></i>  三元组数据</span></div>
                <el-table
                  ref="filterTable"
                  border
                  :data="task.task_state.result"
                  max-height="600"
                  style="width: 95%;margin-left:2%;">
                  <el-table-column fixed="left" type="index" width="50"></el-table-column>
                  <el-table-column prop="e1_type" label="头节点类型" sortable width="180"></el-table-column>
                  <el-table-column prop="e1" label="头节点名" width="180"></el-table-column>
                  <el-table-column prop="relation_type" label="关系" width="180">
                    <template slot-scope="scope">
                      <el-tag size="medium" type="success">{{ scope.row.relation_type}}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="e2_type" label="尾节点类型" width="180"></el-table-column>
                  <el-table-column prop="e2" label="尾节点名" width="180"></el-table-column>
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
                <!-- <div style="margin-left:20px;margin-top:20px;margin-bottom:10px;"><span style="color:#E6A23C"><i class="el-icon-warning"></i>  孤立节点</span></div> -->
                <!-- <el-table
                  ref="filterTable"
                  border
                  :data="tripledata"
                  max-height="600"
                  style="width: 50%;margin-left:2%;">
                  <el-table-column fixed="left" type="index" width="50"></el-table-column>
                  <el-table-column prop="e1_type" label="类型" sortable width="180"></el-table-column>
                  <el-table-column prop="e1_name" label="节点名" width="180"></el-table-column>
                  <el-table-column fixed="right" label="操作" width="120">
                    <template slot-scope="scope">
                      <el-button type="text" size="small">移除</el-button> -->
                        <!-- 删除某一条边 -->
                        <!-- <el-dialog title="提示" :visible.sync="scope.row.link_deleteVisible" width="30%" center>
                          <span>您确定要删除这条关系数据吗？{{scope.row.relation_id}}</span>
                          <span slot="footer" class="dialog-footer">
                            <el-button @click="scope.row.link_deleteVisible = false">取 消</el-button>
                            <el-button type="primary">确 定</el-button>
                          </span>
                        </el-dialog>   -->
                      <!-- <el-button type="text" size="small">编辑</el-button> -->
                        <!-- 编辑关系节点-drawer -->
                        <!-- <el-drawer
                          title="编辑数据"
                          :append-to-body="true"
                          :visible.sync="scope.row.link_editVisible">
                          <p>_(:зゝ∠)_</p>
                        </el-drawer> -->
                    <!-- </template>
                  </el-table-column>
                </el-table> -->
                <div style="margin-top:20px;margin-left:30px;float:left"><el-button type="primary" icon="el-icon-check" @click="newTripledataVisible=true">审核通过，暂存数据</el-button></div>
                <div style="margin-top:20px;margin-left:20px;float:left"><el-button type="success" icon="el-icon-pie-chart">直接创建融合项目</el-button></div>
              </div>
              <el-dialog title="暂存三元组数据" :visible.sync="newTripledataVisible" style="margin:auto;width:50%;">
                <el-form :model="new_tripledata">
                  <el-form-item label="三元组名称" :label-width="formLabelWidth">
                    <el-input v-model="new_tripledata.name" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="是否设置私有" :label-width="formLabelWidth" style="width:500px">
                    <el-radio-group v-model="new_tripledata.private">
                      <el-radio :label="true">是</el-radio>
                      <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="newTripledataVisible = false">取 消</el-button>
                  <el-button type="success" @click="saveTripleData(),new_tripledata.result=task.task_state.result">确认导入</el-button>
                </div>
              </el-dialog>

            <!-- </div> -->


            <!-- <div v-if="label_op=='TEXT'"> -->
              <!-- <div style="float:left;width:40%"> -->
                <!-- 输入文本数据 -->
                <!-- <el-aside width="100%">
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
                </el-aside> -->
                <!-- 生成知识图谱子图 -->
                <!-- <div style="margin-top:5px;">
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
              </div> -->

              <!-- 知识图谱融合 -->
              <!-- <div style="float:left;width:58%;margin-left:20px;">
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
              </div> -->
            <!-- </div> -->
          </el-tab-pane>

          <!-- <el-tab-pane>
            <span slot="label"><i class="el-icon-user" /> 用户管理</span>
            用户管理
          </el-tab-pane> -->
        </el-tabs>
      </div>
    </div>
  </el-container>
</template>

<script>
import * as echarts from 'echarts';
export default {
  inject:['reload'],
  created() {
    this.getProjectList();
    this.project_task={};
    this.getRawdataList();
    this.getModelList();
  },
  data() {
    return {
      projectList: [],
      rawdata_list:[],
      modelList:[{model_id:1,model_name:'三元组抽取'}],
      currentDate: new Date(),
      addDialogVisible: false,
      formLabelWidth: '100px',
      opt: 'projectList',
      project_id: 0,
      project_name: '',
      rename:{name:''},
      newAnnotationProject:{
        name:'',
        type_id:0
      },
      textarea:'', // 用户输入文本内容
      num1: 1,
      num2: 10,
      src:
        'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      child_graph_data: [],
      childTableVisible:false,
      deleteDialogVisible:false,
      updateDialogVisible:false,
      newTripledataVisible:false,
      drawer: false,
      label_op:'DB',
      anotation:{data:'',model:''},
      tripledataVisible:false,
      project_task:{},
      task:{task_id:'',task_state:{}},
      task_state:{},
      new_tripledata:{name:'',private:true,result:{}}
    };
  },
  methods: {
    // 获取项目列表
    async getProjectList() {
      const res = await this.$http.get('project?type=annotation');
      this.projectList = res.data.data;
    },
    // 获取DB列表
    async getRawdataList(){
      const {data: res} = await this.$http.get('data?dtype=text');
      this.rawdata_list = res.data;
    },
    // 获取标注模型列表
    async getModelList(){
      const {data: res} = await this.$http.get('model');
      this.modelList = res.data;
    },
    // 新建标注项目
    async addAnnotationProject(){
      try{
        let res = await this.$http.post('project',this.newAnnotationProject);
        this.$message({
          showClose: true,
          message: '创建标注项目成功！',
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
    // rename
    async renameProject(){
      console.log(this.rename)
      try{
        let res = await this.$http.patch('project/'+this.project_id,this.rename);
        this.$message({
          showClose: true,
          message: '成功！',
          type: 'success',
        })
        
      }
      catch(err){
        this.$message({
          showClose: true,
          message: '出现异常！',
          type: 'error',
        })
      }
      this.updateDialogVisible=false;
      this.reload();
    },
    // 详情界面返回函数
    goBack() {
      this.opt = 'projectList';
      this.anotation={data:'',model:''};
      this.tripledataVisible=false;
      this.task={task_id:'',task_state:{}}
    },
    // 查看项目详情
    projectDetail(project_id, project_name) {
      this.project_id = project_id;
      this.project_name = project_name;
      this.opt = 'projectDetail';
      this.task.task_id = this.project_task[project_id];
      if(this.task.task_id){
        this.getTaskState();
        if(this.task.task_state.state=="SUCCESS"){
          this.tripledataVisible=true;
        }
        else{
          this.tripledataVisible=false;
        }
      }
      
      // this.getTaskState(this.task.task_id);
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
    // 新建任务
    async addTask(){
      try{
        let {data:res} = await this.$http.post('project/'+ this.project_id +'/task',
        {data_id:this.anotation.data,model_url:this.anotation.model});
        this.project_task[this.project_id] = res.data.task_id;
        this.$message({
          showClose: true,
          message: '开始标注！',
          type: 'success',
        })
        this.task.task_id=res.data.task_id;
        this.getTaskState();
      }
      catch{
        this.$message({
          showClose: true,
          message: '出现异常！',
          type: 'error',
        })
      }
      
    },
    // 查看任务状态
    async getTaskState(){
        let {data:res} = await this.$http.get('project/'+ this.project_id +'/task?task_id='+this.task.task_id);
        this.task.task_state=res.data;
        if(this.task.task_state.state=="SUCCESS"){
          console.log(this.task.task_state.result)
          this.report();
          return;
        }
        else if(this.task.task_state.state=="PENDING"){
          let _this = this;
          setTimeout(function(){_this.getTaskState()},1000);
        }
        else if(this.task.task_state.state=="FAILURE"){
          console.log(this.task.task_state.state)
        }
        else{
          let _this = this;
          console.log(this.task.task_state.state)
          setTimeout(function(){_this.getTaskState()},1000);
        }
     
    },
    // 生成报表
    report(){
      this.tripledataVisible=true;
    },
    // 暂存生成的三元组数据
    saveTripleData(){
      // console.log(this.new_tripledata)
      // let res = this.$http.post('project/'+ this.project_id +'/task_result',this.new_tripledata);
      // console.log(res)
      this.$message({
          showClose: true,
          message: '暂存三元组数据成功！',
          type: 'success',
        })
      this.newTripledataVisible=false;
    },

    // 文本生成知识图谱子图
    // async gen_childGraph(){
    //   const res = await this.$http.get('http://39.100.48.36:3012/predict_re?sentence=' + this.textarea);
    //   // print(res)
    //   console.log(res.data.relations);
    //   var data = res.data.relations;
    //   this.graph_nodes = []; // 节点数据初始化
    //   this.graph_links = []; // 关系数据初始化
    //   this.child_graph_data = res.data.relations;
    //   var len = data.length;
    //   for(var i=0;i<len;i++){
    //     if(JSON.stringify(this.graph_nodes).indexOf(JSON.stringify(data[i]['e1']))>-1){
    //     }
    //     else{
    //       this.graph_nodes.push(
    //         {
    //           "id":data[i]['e1_type'] + '/' + data[i]['e1'],
    //           "name":data[i]['e1'],
    //           "type":data[i]['e1_type']
    //         }
            
    //       );
    //     }
    //     if(JSON.stringify(this.graph_nodes).indexOf(JSON.stringify(data[i]['e2']))>-1){
    //     }
    //     else{
    //       this.graph_nodes.push(
    //         {
    //           "id":data[i]['e2_type'] + '/' + data[i]['e2'],
    //           "name":data[i]['e2'],
    //           "type":data[i]['e2_type']
    //         }
    //       );
    //     }
    //     this.graph_links.push(
    //       {
    //         "id":data[i]['relation_type'] + '/' + data[i]['e1_type'] + '/'
    //          + data[i]['e1'] + 'to' + data[i]['e2_type'] + '/' + data[i]['e2'],
    //         "source":data[i]['e1_type'] + '/' + data[i]['e1'],
    //         "target":data[i]['e2_type'] + '/' + data[i]['e2']
    //       }
    //     );
    //   }
    //   // 使用Echarts展示
    //   var myChart = echarts.init(this.$refs.childGraph);
    //   var option = {
    //                 tooltip: {},
    //                 animationDurationUpdate: 1500,
    //                 animationEasingUpdate: 'quinticInOut',
    //                 series: [
    //                     {
    //                         type: 'graph',
    //                         layout: 'force',
    //                         symbolSize: 50,
    //                         roam: true,
    //                         force: {
    //                             repulsion: 2500,
    //                             edgeLength: [10, 50],
    //                             draggable:true
    //                         },
    //                         itemStyle: {//配置节点的颜色
    //                             normal: {
    //                                 color: function (params) {
    //                                   var colorList = ['red','yellow','orange', 'green', 'blue', 'gray'];
    //                                   return colorList[params.dataIndex];                                    
    //                                 },
    //                             }
    //                         },
    //                         symbolSize: function (value, params) {//改变节点大小
    //                           return 40;
    //                         },
    //                         label: {
    //                             show: true
    //                         },
    //                         edgeSymbol: ['circle', 'arrow'],
    //                         edgeSymbolSize: [4, 10],
    //                         edgeLabel: {
    //                             fontSize: 20
    //                         },
    //                         nodes: this.graph_nodes, // 节点数据
    //                         links: this.graph_links, // 关系数据
    //                         edgeLabel: {//边的设置
    //                             show: true,
    //                             position: "middle",
    //                             fontSize: 12,
    //                             formatter: (params) => {
    //                                 return params.data.id.split('/')[0];
    //                             },
    //                         },
    //                         lineStyle: {
    //                             opacity: 0.9,
    //                             width: 2,
    //                             curveness: 0
    //                         }
    //                         }
    //                         ]
    //                 };
    //                 myChart.setOption(option);    
    //                 //点击事件
    //                 myChart.on('click', function (params) {
    //                     if (params.dataType == 'node') {
    //                         console.log(params.name);
    //                     }
    //                     else if (params.dataType == 'edge'){
    //                         console.log(params);
    //                     }
    //                 });
    //         }
    // },
    handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    }
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