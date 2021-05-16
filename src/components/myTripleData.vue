<template>
  <el-container>
    <div style="width:100%">
      <!-- 数据列表 -->
      <el-tabs type="border-card">
        <el-tab-pane label="数据列表">
          <el-table :data="triple_data_list">
            <el-table-column label="数据ID" width="180">
              <template slot-scope="scope">
                <span>{{ scope.row.data_id }}</span>
              </template>
            </el-table-column>
            <el-table-column label="数据名称" width="250">
              <template slot-scope="scope">
                <span><div style="font-weight:bold">{{ scope.row.data_name }}</div></span>
              </template>
            </el-table-column>
            <el-table-column label="数据类型" width="180">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.data_type=='0'" size="medium">三元组</el-tag>
                <el-tag v-if="scope.row.data_type=='1'" size="medium">MySQL</el-tag>
                <el-tag v-if="scope.row.data_type=='2'" size="medium" type="warning">MongoDB</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="数据权限" width="180">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag v-if="scope.row.private==true" size="medium" type="danger">私有</el-tag>
                  <el-tag v-else size="medium" type="success">公开</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" style="margin-left: 10px">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">查看编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加新的raw_data -->
        <el-tab-pane label="导入数据">
            <el-divider><i class="el-icon-receiving"></i></el-divider>
            <!-- 添加文件 -->
            <div style="margin-left:25%">
              <el-form id="new_raw_data_file">
                <el-form-item label="数据名称" :label-width="formLabelWidth" style="width:500px">
                  <el-input v-model="new_raw_data_file.name" name="name" autocomplete="off"/>
                </el-form-item>
                <el-form-item label="是否设置私有" :label-width="formLabelWidth" style="width:500px">
                  <el-radio-group v-model="new_raw_data_file.private">
                    <el-radio label="true">是</el-radio>
                    <el-radio label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
              <el-upload
                class="upload-demo"
                ref="upload"
                action="http://127.0.0.1:5000/api/v1.0/triple_data"
                :on-preview="handlePreview"
                :on-exceed="handleExceed"
                :file-list="file_list"
                :data="new_raw_data_file"
                accept=".txt"
                :show-file-list="true"
                style="margin-left:13%"
                >
                <el-button slot="trigger" size="small" type="info">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="confirm_add_file">确认上传</el-button>
                <div slot="tip" class="el-upload__tip"><i class="el-icon-warning-outline" style="color:red"/><font color="red">只能上传txt文件</font></div>
              </el-upload>
            </div>
        </el-tab-pane>
      <!-- </el-tabs> -->
      </el-tabs>
    </div>
  </el-container>
</template>

<script>
export default {
  inject:['reload'],
  created() {
    this.get_triple_data_list();
  },
  data() {
    return {
      triple_data_list: [],
      addDialogVisible: false,
      formLabelWidth: '120px',
      opt: 'raw_data_list',
      raw_data_id: 0,
      raw_data_name: '',
      method:'DB',
      new_raw_data_DB:{
        "name":'',
        "data_type":'',
        "private":true,
        "ip":'',
        "port":'',
        "username":'',
        "password":'',
        "db":''
      },
      file_list:[],
      file:{},
      params:{},
      new_raw_data_file:{
        "name":'',
        "data_type":0,
        "private":true,
      },
      form:{
        dataType:'DB',
        DBname:''
      },
      tempForm:{
        name:''
      },
      tempDialogVisible:false,
    };
  },
  methods: {
    async get_triple_data_list() {
      const {data: res} = await this.$http.get('triple_data');
      console.log(res.data)
      this.triple_data_list = res.data;
    },
    // 详情界面返回函数
    goBack() {
      this.opt = 'projectList';
    },
    // 导入raw_data
    async add_raw_data_DB(){
      console.log(this.new_raw_data_DB)
      this.new_raw_data_DB.data_type=parseInt(this.new_raw_data_DB.data_type)
      if(this.new_raw_data_DB.private=='true')
        this.new_raw_data_DB.private=true;
      else
        this.new_raw_data_DB.private=false;
      const {data: res} = await this.$http.post('raw_data',this.new_raw_data_DB);
      console.log(res)
      if (res.errno==="0"){
        this.$message({
            showClose: true,
            message: '导入成功！',
            type: 'success'
        });
        this.reload();
      }
      else{
          this.$message({
              showClose: true,
              message: '导入失败！',
              type: 'error'
          });
      }    
    },
    add_raw_data_file(fileObj){
      this.file = fileObj.file
      this.params = new FormData(); 
      this.params.append("data", this.file);
      this.params.append("data_type", 0);
      this.params.append("private",this.new_raw_data_file.private);
      this.params.append("name",this.new_raw_data_file.name);
      for(var pair of this.params.entries()) {
        console.log(pair[0]+ ', '+ pair[1]);
      }
    },
    confirm_add_file(){
      for(var pair of this.params.entries()) {
        console.log(pair[0]+ ', '+ pair[1]);
      }
      const res = this.$http.post('raw_data', this.params)
      console.log(res)
    },
    // 重置导入数据表格(有问题)
    resetForm() {
        this.$refs.new_raw_data_DB.resetFields();
        console.log("1")
    },
    raw_data_detail(){
      this.opt = 'DBDetail';
    },
    handlePreview(file) {
        console.log(file);
    },
    handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },

  }
};
</script>


 