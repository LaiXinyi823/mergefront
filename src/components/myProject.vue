<template>
  <el-container>
    <div v-if="opt == 'projectList'">
      <div @click="addDialogVisible=true" style="height: 200px; float: left">
        <el-card class="box-card" shadow="never">
          <i style="font-size: 20px; float: left; margin-top: 50px" class="el-icon-plus">
            添加新项目</i>
        </el-card>
      </div>
      <el-card class="box-card" v-for="project in projectList" :key="project.project_id" shadow="never">
        <div slot="header" class="clearfix">
          <span>{{ project.project_name }}</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="projectDetail(project.project_id, project.project_name)">
            查看详情</el-button>
        </div>
        <div class="text item">所属领域：</div>
        <div class="text item">权限：</div>
      </el-card>
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
            <div style="float:left">
              <!-- 输入文本数据 -->
              <el-aside width="500px">
                <el-card shadow="always">
                  <h5 style="margin: 0; display: inline; width: 30px">
                    输入文本
                  </h5>
                  <el-divider content-position="left" style="margin: 10px" />
                  <el-input type="textarea" :rows="3" placeholder="请输入待生成知识图谱的文本内容" v-model="textarea" class="textinput"/>
                  <el-button type="primary" plain style="float:right;margin-top:3px;margin-bottom:3px;"> 确认生成 </el-button>
                </el-card>
              </el-aside>
              <!-- 生成知识图谱子图 -->
              <el-aside width="500px" height="100%" class="childKG" style="margin-top:5px;">
                <el-card shadow="always">
                  <h5 style="margin: 0; display: inline; width: 50px">生成子图</h5>
                  <el-divider content-position="left" style="margin: 15px" />
                  <div class="block">
                    <el-image :src="src" style="width: 40%; margin-left: 30%" />
                  </div>
                  <template>
                    <el-table
                      :data="tableData"
                      height="250"
                      font-size="12px"
                      border
                      style="width: 100%"
                      :row-style="{ height: '10px' }"
                      :cell-style="{ padding: '0' }"
                    >
                      <el-table-column fixed prop="order" label="序号" width="50" />
                      <el-table-column prop="entity1Name" label="起点实体" width="80" />
                      <el-table-column prop="entity1Type" label="起点实体类型" width="110" />
                      <el-table-column prop="entity2Name" label="终点实体" width="80" />
                      <el-table-column prop="entity2Type" label="终点实体类型" width="110" />
                      <el-table-column prop="relationType" label="关系类型" width="80" />
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
            <el-aside width="740px" height="100%" style="float:right">
              <el-card shadow="always">
                <h5 style="margin:0;display:inline;width:50px;">
                  知识图谱融合预览
                </h5>
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
                <el-button type="primary" plain>
                  确认融合
                </el-button>
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
      tableData: [
        {
          order: '1',
          entity1Name: 'BILSTM-CRF',
          entity1Type: '处理',
          entity2Name: 'CRF',
          entity2Type: '处理任务',
          relationType: '对比关系',
        },
        {
          order: '2',
          entity1Name: '数据集',
          entity1Type: '处理方法',
          entity2Name: '双向',
          entity2Type: '处理任务',
          relationType: '应用关系',
        },
        {
          order: '3',
          entity1Name: '双向',
          entity1Type: '处理任务',
          entity2Name: 'BILSTM-CRF',
          entity2Type: '处理',
          relationType: '同指关系',
        },
        {
          order: '4',
          entity1Name: '双向',
          entity1Type: '处理任务',
          entity2Name: 'BILSTM-CRF',
          entity2Type: '处理',
          relationType: '同指关系',
        },
        {
          order: '5',
          entity1Name: '双向',
          entity1Type: '处理任务',
          entity2Name: 'BILSTM-CRF',
          entity2Type: '处理',
          relationType: '同指关系',
        },
      ],
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
  },
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