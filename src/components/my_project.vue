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
            <el-divider><i class="el-icon-s-flag"></i></el-divider>
              <el-form>
                <el-form-item label="文本内容">
                    <el-input type="textarea" v-model="raw_text"></el-input>
                </el-form-item>
              </el-form>
              <el-button type="primary" @click="start_annotate()">开始标注</el-button>
             
              <!-- 模型抽取生成三元组列表 -->
              <div style="width:90%;" v-if="tripledataVisible==true">
                <div style="margin-left:20px;margin-bottom:10px;"><span style="color:#409EFF"><i class="el-icon-s-data"></i>  三元组数据</span></div>
                <el-table
                  ref="filterTable"
                  border
                  :data="new_tripledata"
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
                      <el-button type="text" size="small" @click="fusiondialog=true, a_tripledata=scope.row">融合入图</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

               <el-dialog title="确定融合？" :visible.sync="fusiondialog">
                <el-form>
                    <el-form-item label="选择图谱：" :label-width="formLabelWidth">
                        <el-select
                            v-model="graph_id"
                            placeholder="所有图谱"
                            clearable
                            @change="get_my_graph_list"
                            @clear="get_my_graph_list"
                        >
                            <el-option
                            v-for="graph in graph_list"
                            :key="graph.graph_id"
                            :label="graph.graph_name"
                            :value="graph.graph_id"
                            />
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="fusiondialog=false"> 取 消 </el-button>
                    <el-button type="primary" @click="fusion()"> 确 定 </el-button>
                </div>
                </el-dialog>
              
          </el-tab-pane>

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
    this.get_my_graph_list();
  },
  data() {
    return {
      projectList: [],
      rawdata_list:[],
      graph_list:[],
      raw_text:'',
      graph_id:'',
      modelList:[{model_id:1,model_name:'三元组抽取'}],
      currentDate: new Date(),
      addDialogVisible: false,
      fusiondialog:false,
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
      new_tripledata:{name:'',private:true,result:{}},
      a_tripledata:{e1_type:'',e2_type:'',e1:'',e2:'',relation_type:''},
      newVertex: {
        name: ''
      },
      new_edge:{
        from: '',
        to: '',
        attribute: {},
      }
    };
  },
  methods: {
    // 获取项目列表
    async getProjectList() {
      const res = await this.$http.get('project?type=annotation');
      this.projectList = res.data.data;
    },
    // 获取我的图谱
    async get_my_graph_list(value) {
      console.log(value)
      if (value == undefined) {
        var res = await this.$http.get('/graph/')
      } else {
        var res = await this.$http.get('/graph?domain=' + value)
      }
      this.graph_list = res.data.data
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
    async start_annotate(){
      try{
        let {data:res}= await this.$http.get('http://39.100.48.36:3012/predict_re?sentence='+ this.raw_text);
        console.log(res)
        this.$message({
          showClose: true,
          message: '开始标注！',
          type: 'success',
        })
        console.log(res.relations)
        this.tripledataVisible=true
        this.new_tripledata=res.relations;
      }
      catch{
        this.$message({
          showClose: true,
          message: '出现异常！',
          type: 'error',
        })
      }
      
    },
    async fusion(){
        // console.log(this.a_tripledata)
        var param={
          'e1_type':this.a_tripledata.e1_type,
          'e2_type':this.a_tripledata.e2_type,
          'e1':this.a_tripledata.e1,
          'e2':this.a_tripledata.e2,
          'relation_type':this.a_tripledata.relation_type
        }
        try{
          const {data:res} = await this.$http.post('/graph/'+ this.graph_id + '/insert_triplet', param)
            this.$message({
              showClose: true,
              message: '成功！',
              type: 'success',
            })
            this.fusiondialog = false
          }
          catch{
            this.$message({
              showClose: true,
              message: '成功！',
              type: 'success',
            })
            this.fusiondialog = false
          }

        console.log(res.data)
    },
    async fusion_1(){
        // console.log(this.a_tripledata)
        var param={
          'e1_type':this.a_tripledata.e1_type,
          'e2_type':this.a_tripledata.e2_type,
          'e1':this.a_tripledata.e1,
          'e2':this.a_tripledata.e2,
          'relation_type':this.a_tripledata.relation_type
        }
        try{
          const {data:res} = await this.$http.post('/graph/'+ this.graph_id + '/insert_triplet', param)
            this.$message({
              showClose: true,
              message: '成功！',
              type: 'success',
            })
          }
          catch{
            this.$message({
              showClose: true,
              message: 'error!',
              type: 'error',
            })
          }

        console.log(res.data)
        this.fusiondialog = false
    },
    async addVertexType(new_name){
      var param = {
          name: new_name
      }
      try{
        const res = await this.$http.post(
        'graph/' + this.graph_id + '/vertex',
        param
      )
        this.$message({
          showClose: true,
          message: '成功！',
          type: 'success',
        })
      }
      catch{
        this.$message({
          showClose: true,
          message: 'error!',
          type: 'error',
        })
      }
      
      // this.addVertexTypeVisible = false;
      // this.get_graph_detail(this.graph_id)
    },
    async addNode(type, new_name) {
     var newVertex={
        name: new_name
      }
      try{
        const res = await this.$http.post(
        '27' + '/graph/' + this.graph_id + '/vertex/' + type,
        newVertex
      )
        this.$message({
          showClose: true,
          message: '成功！',
          type: 'success',
        })
      }
      catch{
        this.$message({
          showClose: true,
          message: 'error!',
          type: 'error',
        })
      }
      
      this.addVertexVisible = false;
      // this.show_graph_vertex(this.collection, this.currentPage)
    },
    async addEdge(relation) {
      new_edge = {
        from: this.newEdge.node_id,
        to: this.vertex._id,
        attribute: {},
      }
      try{
        var res = await this.$http.post(
        this.domain_id + '/graph/' + this.graph_id + '/edge/' + relation,
        new_edge
        )
        this.$message({
          showClose: true,
          message: '添加新节点成功！',
          type: 'success',
        })
        
      }
      catch{
        this.$message({
          showClose: true,
          message: '添加失败！',
          type: 'error',
        })
      }
      this.addNewEdgeVisible = false;
      this.showEditGraph('1')
   
      
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