<template>
  <el-container>
    <el-row>
      <div style="height:80px;margin-right:12px;margin-left:40px;margin-bottom:10px;" @click="addDialogVisible = true">
        <el-card shadow="hover" style="height:100%;margin-bottom:10px;"> 
            <i style="font-size:20px;float:left;margin-top:10px;" class='el-icon-plus'>   添加新项目</i>
        </el-card>
      </div>
      <el-col
        :span="5"
        v-for="project in projectList"
        :key="project.project_id"
        :offset="1"
      >
      <el-card style="">
        <img
          src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
          class="image"
        >
        <div style="padding: 14px;">
          <span>{{project.project_name}}</span>
          <div class="bottom clearfix">
            <time class="time">{{ currentDate }}</time>
            <el-button type="text" class="button">查看详情</el-button>
          </div>
        </div>
      </el-card>
      </el-col>
    </el-row>
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

  .clearfix:before,
  /* .clearfix:after {
      display: table;
      content: "";
  } */
  
  .clearfix:after {
      clear: both
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
