<template>
  <el-container>
    <el-row>
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
      currentDate: new Date()
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
