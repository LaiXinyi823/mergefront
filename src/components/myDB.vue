<template>
  <el-container>
    <div v-if="opt == 'DBList'">
      <div @click="addDialogVisible=true" style="height: 200px; float: left">
        <el-card class="box-card" shadow="never">
          <i style="font-size: 20px; float: left; margin-top: 50px" class="el-icon-plus">
            添加文本数据</i>
        </el-card>
      </div>
      <div @click="DBDetail()">
        <el-card
          class="box-card"
          v-for="project in projectList"
          :key="project.project_id"
          shadow="never"
        >
          <div slot="header" class="clearfix">
            <span>{{ project.project_name }}</span>
          </div>
        </el-card>
      </div>
      <el-dialog
        title="添加文本数据"
        :visible.sync="addDialogVisible"
      >
        <el-form :model="newDB">
          <el-form-item label="添加方式：">
            <el-radio
              v-model="method"
              label="DB"
            >
              DB
            </el-radio>
            <el-radio
              v-model="method"
              label="File"
            >
              File
            </el-radio>
          </el-form-item>
          <div v-if="method=='DB'">
            <el-form-item
              label="数据名称"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="newDB.name"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item
              label="数据类型"
              :label-width="formLabelWidth"
            >
              <el-radio-group v-model="newDB.data_type">
                <el-radio label="Text">
                  Text
                </el-radio>
                <el-radio label="MySQL">
                  MySQL
                </el-radio>
                <el-radio label="MongoDB">
                  MongoDB
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="ip"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="newDB.ip"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item
              label="port"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="newDB.port"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item
              label="username"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="newDB.username"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item
              label="password"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="newDB.password"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item
              label="db"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="newDB.db"
                autocomplete="off"
              />
            </el-form-item>
          </div>

          <div v-if="method=='File'">
            <el-upload
              class="upload-demo"
              ref="upload"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList"
              accept=".txt,.csv"
              :show-file-list="true"
            >
              <el-button
                slot="trigger"
                size="small"
                type="primary"
              >
                选取文件
              </el-button>
              <div
                slot="tip"
                class="el-upload__tip"
              >
                只能上传txt/csv文件
              </div>
            </el-upload>
          </div>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="addDialogVisible = false">
            取 消
          </el-button>
          <el-button type="primary">
            确 定
          </el-button>
        </div>
      </el-dialog>
    </div>

    <div
      v-if="opt == 'DBDetail'"
      style="width: 100%; height: 100px; background: white"
    >
      <el-card
        style="width: 100%; height: 65px; background-color: #fff"
        shadow="never"
      >
        <el-page-header
          @back="goBack()"
          :content="project_name + ' DB详情'"
          style="float: left"
        />
      </el-card>
      <div style="width: 100%; margin-top: 5px" />
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
      formLabelWidth: '120px',
      opt: 'DBList',
      project_id: 0,
      project_name: '',
      method:'DB',
      newDB:{
        'name':'',
        'data_type':'',
        'private':true,
        'ip':'',
        'port':'',
        'username':'',
        'password':'',
        'db':''
      },
      form:{
        dataType:'DB',
        DBname:''
      },
      tempForm:{
        name:''
      },
      tempDialogVisible:false,
      fileList: [{name: '', url: ''}]
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
    DBDetail(){
      this.opt = 'DBDetail';
    },
    handleRemove(file, fileList) {
        console.log(file, fileList);
    },
    handlePreview(file) {
        console.log(file);
    },
    handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
    }
  }
};
</script>


 