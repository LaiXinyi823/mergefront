<template>
  <el-row type="flex" :gutter="0">
    <!-- <el-col
      :span="5"
      v-for="(o, index) in 2"
      :key="o"
      :offset="index > 0 ?1 : 0"
    >
      <el-card :body-style="{ padding: '0px' }">
        <div style="padding: 14px;">
          <img
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            class="img"
          >
          <div class="title">
            知识图谱1
          </div>
          <div class="sub-title">
            领域
          </div>
          <div class="text-no">
            创建时间
          </div>
          <div class="bottom clearfix">
            <el-button
              type="text"
              class="button"
              @click="deleteCount"
            >
              删除
            </el-button>
            <el-button
              type="text"
              class="button"
              @click="checkMsg(item)"
            >
              查看
            </el-button>
          </div>
        </div>
      </el-card>
    </el-col> -->
    <el-col :span="5">
    <el-card shadow="hover">
      知识图谱1
    </el-card>
    </el-col>
    <el-card class="el-card-define">
      <div
        class="add-btn"
        @click="addMyKG"
      >
        <div class="icon-block">     
          <i class="el-icon-plus" />
        </div>
        <div>添加图谱</div> 
      </div>
    </el-card>
  </el-row>
</template>

<style>
.img {
width:80%;
height:100px;
margin-left: 10%;
}
.clearfix:before,
.clearfix:after {
display: table;
content: "";
}

.clearfix:after {
clear: both
}

.graphCard {
width:50%;
height:40%;
}

.el-card-define {
min-height: 100%;
height: 100%;
}

.el-card-define >>> .el-card__body {
height: 100%;
}
</style>

<script>
export default {
  data () {
    return {
      currentDate: new Date()
    };
  }
};
</script>
