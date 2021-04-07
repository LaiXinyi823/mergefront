<template>
  <el-container>
    <div v-if="opt == 'projectList'">
      <div
        @click="addDialogVisible=true"
        style="height: 200px; float: left"
      >
        <el-card
          class="box-card"
          shadow="never"
        >
          <i
            style="font-size: 20px; float: left; margin-top: 50px"
            class="el-icon-plus"
          >
            添加新项目</i>
        </el-card>
      </div>
      <div @click="projectDetail()">
        <el-card
          class="box-card"
          v-for="project in projectList"
          :key="project.project_id"
          shadow="never"
        >
          <div
            slot="header"
            class="clearfix"
          >
            <span>{{ project.project_name }}</span>
          </div>
          <div class="text item">
            所属领域：
          </div>
          <div class="text item">
            权限：
          </div>
        </el-card>
      </div>
      <el-dialog
        title="新增项目"
        :visible.sync="addDialogVisible"
      >
        <el-form :model="newProject">
          <el-form-item
            label="项目名称"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="newProject.name"
              autocomplete="off"
            />
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="addDialogVisible = false">
            取 消
          </el-button>
          <el-button
            type="primary"
            @click="addProject()"
          >
            确 定
          </el-button>
        </div>
      </el-dialog>
    </div>

    <div
      v-if="opt == 'projectDetail'"
      style="width: 100%; height: 100px; background: white"
    >
      <el-card
        style="width: 100%; height: 65px; background-color: #fff"
        shadow="never"
      >
        <el-page-header
          @back="goBack()"
          :content="project_name + ' 项目详情'"
          style="float: left"
        />
      </el-card>
      <div style="width: 100%; margin-top: 5px">
        <el-tabs type="border-card">
          <el-tab-pane>
            <span slot="label"><i class="el-icon-document" />标注数据</span>
            <el-form
              ref="form"
              :model="form"
              label-width="100px"
            >
              <el-form-item label="标注方式：">
                <el-radio
                  v-model="form.dataType"
                  label="DB"
                >
                  DB
                </el-radio>
                <el-radio
                  v-model="form.dataType"
                  label="Text"
                >
                  Text
                </el-radio>
              </el-form-item>
              <!-- 以数据库的形式进行标注 -->
              <el-form-item
                v-if="form.dataType=='DB'"
                label="选择数据："
              >
                <el-select
                  v-model="form.DBname"
                  placeholder="请选择数据库来源"
                >
                  <el-option
                    label="DB_1"
                    value="shanghai"
                  />
                  <el-option
                    label="DB_2"
                    value="beijing"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="form.dataType=='DB'"
                label="选择模型："
              >
                <el-select
                  v-model="form.DBname"
                  placeholder="请选择模型"
                >
                  <el-option
                    label="Model_1"
                    value="shanghai"
                  />
                  <el-option
                    label="Model_2"
                    value="beijing"
                  />
                </el-select>
              </el-form-item>
              <el-form-item v-if="form.dataType=='DB'">
                <el-button type="primary">
                  开始标注
                </el-button>
                <el-button @click="tempDialogVisible=true">
                  暂存
                </el-button>
              </el-form-item>                  
            </el-form>  
            <!-- 以单个文本生成子图的形式进行标注 -->
            <div v-if="form.dataType=='Text'">
              <div style="float:left;">
                <!-- 输入文本数据 -->
                <el-aside width="700px">
                  <el-card shadow="always">
                    <h5 style="margin: 0; display: inline; width: 30px">
                      输入文本
                    </h5>
                    <el-divider
                      content-position="left"
                      style="margin: 10px;"
                    />
                    <el-input
                      type="textarea"
                      :rows="10"
                      placeholder="请输入待生成知识图谱的文本内容"
                      v-model="textarea"
                      class="textinput"
                    />
                    <el-button
                      @click="gen_childGraph()"
                      type="primary"
                      plain
                      style="float:right;margin-top:3px;margin-bottom:3px;"
                    >
                      确认生成
                    </el-button>
                  </el-card>
                </el-aside>
                <!-- 生成知识图谱子图 -->
                <el-aside
                  width="700px"
                  height="100%"
                  class="childKG"
                >
                  <el-card shadow="always">
                    <h5 style="margin: 0; display: inline; width: 50px">
                      生成子图
                    </h5>
                    <el-divider
                      content-position="left"
                      style="margin: 15px"
                    />
                    <!-- <div class="block"> -->
                    <div
                      id="main"
                      ref="childGraph"
                      style="width: 600px;height:300px;"
                    />
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
                        <el-table-column
                          fixed
                          type="index"
                          label="序号"
                          width="50"
                        />
                        <el-table-column
                          prop="e1"
                          label="起点实体"
                          width="80"
                        />
                        <el-table-column
                          prop="e1_type"
                          label="起点实体类型"
                          width="110"
                        />
                        <el-table-column
                          prop="e2"
                          label="终点实体"
                          width="80"
                        />
                        <el-table-column
                          prop="e2_type"
                          label="终点实体类型"
                          width="110"
                        />
                        <el-table-column
                          prop="relation_type"
                          label="关系类型"
                          width="80"
                        />
                        <el-table-column
                          fixed="right"
                          label="操作"
                          width="100"
                        >
                          <template slot-scope="scope">
                            <el-button
                              @click="handleClick(scope.row)"
                              type="text"
                              size="small"
                            >
                              查看
                            </el-button>
                            <el-button
                              type="text"
                              size="small"
                            >
                              编辑
                            </el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </template>
                  </el-card>
                </el-aside>
              </div>
              <el-aside
                width="540px"
                height="100%"
                style="margin-top:10px;float:right"
              >
                <el-form
                  ref="form"
                  v-if="form.dataType=='Text'"
                  :model="form"
                  label-width="100px"
                >
                  <el-form-item label="选择模型：">
                    <el-select
                      v-model="form.DBname"
                      placeholder="请选择模型"
                    >
                      <el-option
                        label="Model_1"
                        value="shanghai"
                      />
                      <el-option
                        label="Model_2"
                        value="beijing"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary">
                      开始标注
                    </el-button>
                    <el-button @click="tempDialogVisible=true">
                      暂存
                    </el-button>
                  </el-form-item>                  
                </el-form>  
              </el-aside>
            </div>      
            <el-dialog
              title="暂存"
              :visible.sync="tempDialogVisible"
            >
              <el-form :model="tempForm">
                <el-form-item
                  label="数据集名称"
                  :label-width="formLabelWidth"
                >
                  <el-input
                    v-model="tempForm.name"
                    autocomplete="off"
                  />
                </el-form-item>
              </el-form>
              <div
                slot="footer"
                class="dialog-footer"
              >
                <el-button @click="tempDialogVisible = false">
                  取 消
                </el-button>
                <el-button type="primary">
                  确 定
                </el-button>
              </div>
            </el-dialog>    
          </el-tab-pane>

          <el-tab-pane>
            <span slot="label"><i class="el-icon-user" /> 用户管理</span>
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
    this.getProjectList();
  },
  data() {
    return {
      projectList: [],
      addDialogVisible: false,
      formLabelWidth: '100px',
      opt: 'projectList',
      project_id: 0,
      project_name: '',
      newProject:{
        "name":'',
        "domain":''
      },
      form:{
        dataType:'DB',
        DBname:''
      },
      tempForm:{
        name:''
      },
      textarea:'', // 用户输入文本内容
      num1: 1,
      num2: 10,
      src:
        'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      child_graph_data: [],
      tempDialogVisible:false
    };
  },
  methods: {
    async getProjectList() {
      const res = await this.$http.get('list_projects');
      this.projectList = res.data.data;
    },
    // 详情界面返回函数
    goBack() {
      this.opt = 'projectList';
    },
    projectDetail(){
      this.opt = 'projectDetail';
    }
  }
};
</script>