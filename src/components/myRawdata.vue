<template>
  <el-container>
    <div v-if="opt == 'raw_data_list'" style="width:100%">
      <!-- 数据列表 -->
      <el-tabs type="border-card">
        <el-tab-pane label="数据列表">
        <el-table :data="raw_data_list">
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
              <el-tag v-if="scope.row.data_type=='0'" size="medium" type="info">Text</el-tag>
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
              <!-- <el-button size="mini" @click="handleEdit( scope.row)">查看编辑</el-button> -->
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin-top:2%;margin-left:10%">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="totalPage">
          </el-pagination>
        </div>
        <!-- 编辑数据-对话框 -->
        </el-tab-pane>
        <!-- 添加新的raw_data -->
        <el-tab-pane label="导入数据">
            <!-- 选择添加方式 -->
            请选择导入方式：
            <el-radio v-model="method" label="DB">数据库</el-radio>
            <el-radio v-model="method" label="File">文件</el-radio>
            <el-divider><i class="el-icon-receiving"></i></el-divider>
            <!--添加DB-->
            <el-form v-if="method=='DB'" :model="new_raw_data_DB" ref="new_raw_data_DB" style="margin-left:25%">
              <el-form-item label="数据名称" :label-width="formLabelWidth" style="width:500px">
                <el-input v-model="new_raw_data_DB.name" autocomplete="off"/>
              </el-form-item>
              <el-form-item label="所属领域" :label-width="formLabelWidth">
                <el-select v-model="new_raw_data_DB.domain_id" placeholder="请选择">
                  <el-option v-for="item in domain_list" :key="item.domain_id" :label="item.domain_name" :value="item.domain_id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否设置私有" :label-width="formLabelWidth" style="width:500px">
                <el-radio-group v-model="new_raw_data_DB.private">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="数据类型" :label-width="formLabelWidth" style="width:500px">
                <el-radio-group v-model="new_raw_data_DB.data_info.server">
                  <el-radio label="mysql">MySQL</el-radio>
                  <el-radio label="mongodb">MongoDB</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="ip" :label-width="formLabelWidth" style="width:500px">
                <el-input v-model="new_raw_data_DB.data_info.ip" autocomplete="off"/>
              </el-form-item>
              <el-form-item label="port" :label-width="formLabelWidth" style="width:500px">
                <el-input v-model="new_raw_data_DB.data_info.port" autocomplete="off"/>
              </el-form-item>
              <el-form-item label="username" :label-width="formLabelWidth" style="width:500px">
                <el-input v-model="new_raw_data_DB.data_info.username" autocomplete="off"/>
              </el-form-item>
              <el-form-item label="password" :label-width="formLabelWidth" style="width:500px">
                <el-input type="password" v-model="new_raw_data_DB.data_info.password" autocomplete="off"/>
              </el-form-item>
              <el-form-item label="db" :label-width="formLabelWidth" style="width:500px">
                <el-input v-model="new_raw_data_DB.data_info.db" autocomplete="off"/>
              </el-form-item>
              <el-form-item>
                <el-button @click="add_raw_data_DB" type="primary" style="margin-left:13%;width:250px;">确 定</el-button>
                <el-button @click="resetForm">重 置</el-button>               
              </el-form-item>
            </el-form>
            <!-- 添加文件 -->
            <div v-if="method=='File'" style="margin-left:25%">
              <el-form id="new_raw_data_file">
                <el-form-item label="数据名称" :label-width="formLabelWidth" style="width:500px">
                  <el-input v-model="new_raw_data_file.name" name="name" autocomplete="off"/>
                </el-form-item>
                <el-form-item label="所属领域" :label-width="formLabelWidth">
                <el-select v-model="new_raw_data_file.domain_id" placeholder="请选择">
                  <el-option v-for="item in domain_list" :key="item.domain_id" :label="item.domain_name" :value="item.domain_id"></el-option>
                </el-select>
              </el-form-item>
                <el-form-item label="是否设置私有" :label-width="formLabelWidth" style="width:500px">
                  <el-radio-group v-model="new_raw_data_file.private">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
              <div style="margin-left:10%">
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  action
                  :http-request="confirm_add_file" 
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :file-list="fileList"
                  :auto-upload="true">
                  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                  <el-button style="margin-left:10px;" size="small" type="success" @click="submitUpload">确认导入</el-button>
                  <div slot="tip" class="el-upload__tip" style="color:red">只能上传.txt文件</div>
                </el-upload>
              </div>
            </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div v-if="opt == 'raw_data_detail'" style="width: 100%; height: 100px; background: white">
      <el-card style="width: 100%; height: 65px; background-color: #fff" shadow="never">
        <el-page-header @back="goBack()" :content="project_name + ' DB详情'" style="float: left"/>
      </el-card>
      <div style="width: 100%; margin-top: 5px" />
    </div>
  </el-container>
</template>

<script>
export default {
  inject:['reload'],
  created() {
    this.get_raw_data_list();
    this.getMyDomainList();
  },
  data() {
    return {
      fileList: [],
      domain_list:[],
      raw_data_list: [],
      addDialogVisible: false,
      formLabelWidth: '120px',
      opt: 'raw_data_list',
      raw_data_id: 0,
      raw_data_name: '',
      method:'DB',
      new_raw_data_DB:{
        name:'',
        data_type:'db',
        private:true,
        data_info:{
          server:'',
          ip:'',
          port:'',
          username:'',
          password:'',
          db:'',
        },
        domain_id:''
      },
      file:{},
      params:{},
      new_raw_data_file:{
        name:'',
        data_type:'text',
        private:true,
        domain_id:'',
        data_info:''
      },
      form:{
        dataType:'DB',
        DBname:''
      },
      tempForm:{
        name:''
      },
      tempDialogVisible:false,
      currentPage:1,
      totalPage:0
    };
  },
  methods: {
    async get_raw_data_list() {
      const {data: res} = await this.$http.get('data?dtype=text');
      this.raw_data_list = res.data;
      this.totalPage = res.data.length;
    },
    // 获取我的领域列表
    async getMyDomainList() {
      const { data: res } = await this.$http.get('domain')
      this.domain_list = res.data
    },
    // 详情界面返回函数
    goBack() {
      this.opt = 'projectList';
    },
    // 导入raw_data
    async add_raw_data_DB(){
      try{
        const {data: res} = await this.$http.post('data/',this.new_raw_data_DB);
        this.$message({
            showClose: true,
            message: '导入成功！',
            type: 'success'
        });
        this.reload();
      }
      catch{
        this.$message({
              showClose: true,
              message: '导入失败！',
              type: 'error'
          });
      }
    },
    async confirm_add_file(fileObj){
      let formData = new FormData();
      formData.set("file", fileObj.file);
      const {data:res} = await this.$http.post('upload/text', formData,
        {
          headers: {
            "Content-type": "multipart/form-data"
          }
        }
        )
      this.new_raw_data_file.data_info=res.url;
    },
    // 重置导入数据表格(有问题)
    resetForm() {
        this.$refs.new_raw_data_DB.resetFields();
        console.log("1")
    },
    raw_data_detail(){
      this.opt = 'DBDetail';
    },
    async submitUpload() {
      try{
        const res= await this.$http.post('data/',this.new_raw_data_file);
        this.$message({
            showClose: true,
            message: '导入成功！',
            type: 'success'
        });
        this.reload();
      }
      catch{
        this.$message({
            showClose: true,
            message: '异常！',
            type: 'error'
        });
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    async handleDelete(row){
      try{
        const { data: res } = await this.$http.delete('data/'+row.data_id)
        this.$message({
            showClose: true,
            message: '删除成功！',
            type: 'success'
        });
        this.reload();
      }
      catch{
        this.$message({
              showClose: true,
              message: '异常！',
              type: 'error'
          });
      }
      
    }

  }
};
</script>


 