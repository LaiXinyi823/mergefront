<template>
  <el-container>
    <div class="myGraph">
        <el-row :gutter="10">
            <el-col :span="4" v-for="graph in graph_list" :key="graph.graph_id" :offset="1">
            <el-card shadow="hover" style="width: 200px;height: 200px;">
            <el-image style="width: 100px; height: 100px; margin-left:20%;margin-top:5%;"
            src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"></el-image>
            <h4>{{ graph.graph_name}}</h4>
            </el-card>
            </el-col>
        </el-row>
    </div>
    <div class='addGraph' style="float:left;">
        <el-card shadow="hover">
            <div class="icon-block">     
            <i class="el-icon-plus" /></div>
            <div>添加图谱</div> 
        </el-card>
    </div>
  </el-container>
</template>

<script>
export default {
    data (){
        return {
            graph_list: []
        };
    },
    created(){
        this.getMygraphList();
    },
    methods: {
      // 获取我的图谱
        async getMygraphList (){
            console.log("////");
            const res = await this.$http.get('list_graphs');
            this.graph_list = res.data.data;
            console.log(res.data.data);
    }
    }
};
</script>

<style>
.icon-block{
width:100px;
height:80px;
}

.el-card-define >>> .el-card__body {
height: 100%;
}

.cardImg{
height:50%;
width:50%;
}

.myGraph{
 width:100%;
}
</style>
