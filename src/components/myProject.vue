<template>
  <el-container>
    <div style="height:200px">
      <el-card class="box-card" shadow="never">
        <i style="font-size:20px;float:left;margin-top:50px;" class='el-icon-plus'>   添加新项目</i>
      </el-card>
    </div>
    <div style="float:right">
      <el-card class="box-card" v-for="project in projectList" :key="project.project_id" shadow="never">
        <div slot="header" class="clearfix">
          <span>{{project.project_name}}</span>
          <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
        </div>
        <div class="text item">
          所属领域：
        </div>
        <div class="text item">
          权限：
        </div>
      </el-card>
    </div>
    <el-dialog title="新增项目" :visible.sync="addDialogVisible">
      <!-- <el-form :model="newGraph">
          <el-form-item label="知识图谱名称" :label-width="formLabelWidth">
          <el-input v-model="newGraph.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="所属领域名称" :label-width="formLabelWidth">
              <el-select v-model="newGraph.domain_id" placeholder="请选择">
                  <el-option
                  v-for="domain in domain_list"
                  :key="domain.domain_id"
                  :label="domain.domain_name"
                  :value="domain.domain_id">
                  </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="图谱权限" :label-width="formLabelWidth">
          <el-radio v-model="newGraph.private" label="0">公开</el-radio>
          <el-radio v-model="newGraph.private" label="1">私有</el-radio>
          </el-form-item>
      </el-form> -->
      <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addGraph()">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<style>
  .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
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
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 200px;
    height:200px;
    margin-right:10px;
    display:inline-block;
    margin-bottom:10px;
  }

  .card {
    width: 200px;
    height: 200px;
    margin-bottom:10px;
    margin-top:10px;
  }
</style>

<script>
export default {
  created (){
    this.getProjectList();
  },
  data () {
    return {
      projectList:[],
      currentDate: new Date(),
      addDialogVisible: false
    };
  },
  methods:{
    async getProjectList (){
      const res = await this.$http.get('list_projects');
      this.projectList = res.data.data;
      console.log(res);
    }
  }
};
</script>
