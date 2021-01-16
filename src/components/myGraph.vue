<template>
  <el-container>
    <div v-if="opt=='graphs'" style="width:100%;height:100px;">
        <el-row :gutter="35">
            <div style="height:80px;margin-right:12px;margin-left:17px;margin-bottom:10px;" @click="addDialogVisible = true">
                <el-card shadow="hover" style="height:100%;margin-bottom:10px;"> 
                    <i style="font-size:20px;float:left;margin-top:10px;" class='el-icon-plus'>   添加新图谱</i>
                </el-card>
            </div>
            <el-col :span="4.5" v-for="graph in graph_list" :key="graph.graph_id" :offset="0">
            <div @click="graphDetail(graph.graph_id)">
                <el-card shadow="hover" style="width: 200px;height: 200px;margin-bottom:10px;">
                <el-image style="width: 100px; height: 100px; margin-left:20%;margin-top:5%;"
                src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"></el-image>
                <h4>{{ graph.graph_name}}</h4>
                </el-card>
            </div>
            </el-col>
        </el-row>
        <el-dialog title="新增知识图谱" :visible.sync="addDialogVisible">
            <el-form :model="newGraph">
                <el-form-item label="知识图谱名称" :label-width="formLabelWidth">
                <el-input v-model="newGraph.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属领域ID" :label-width="formLabelWidth">
                <el-input v-model="newGraph.domain_id" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="图谱权限" :label-width="formLabelWidth">
                <el-radio v-model="newGraph.private" label="0">公开</el-radio>
                <el-radio v-model="newGraph.private" label="1">私有</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addGraph()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
    <div v-if="opt=='graphDetail'" style="width:100%;height:100px;">
        <el-card style="width:100%;height:65px;background-color:#fff;">
        <el-page-header @back="goBack()" content="知识图谱详情页面" style="float:left;"> </el-page-header>
        <!-- <el-radio-group v-model="graph_or_table" style="bottom:10%;margin-right:10px;float:right;">
        <el-radio-button label="图谱显示"></el-radio-button>
        <el-radio-button label="数据表格"></el-radio-button>
        </el-radio-group> -->
        以数据表格显示
        <el-switch
            v-model="graph_or_table"
            active-color="#1e90ff"
            inactive-color="#dcdcdc">
        </el-switch>
        </el-card>
        {{graph_id}}
    </div>
  </el-container>
</template>

<script>
export default {
    inject:['reload'],
    data (){
        return {
            opt:'graphs',
            graph_id:'',
            graph_list: [],
            graph_or_table:'图谱显示',
            addDialogVisible: false,
            newGraph:{
                name:'',
                private:'0',
                domain_id:''
            },
            formLabelWidth: '120px'
        };
    },
    created(){
        this.getMygraphList();
    },
    methods: {
        // 获取我的图谱
        async getMygraphList (){
            const res = await this.$http.get('list_graphs');
            this.graph_list = res.data.data;
            console.log(res.data.data);
        },
        // 添加图谱
        async addGraph (){
            console.log(this.newGraph);
            const {data:res} = await this.$http.post('create_graph',
            {'name':this.newGraph.name,
             'domain_id':this.newGraph.domain_id,
             'private': parseInt(this.newGraph.private)
            });
            if (res.errno === '0'){
                this.$message({
                    showClose: true,
                    message: '添加知识图谱成功！',
                    type: 'success'
                });
                this.addDialogVisible = false;
                this.reload();
            }
            else if (res.errno==="4003"){
                this.$message({
                    showClose: true,
                    message: res.errmsg,
                    type: 'warning'
                });
            }
            else {
                this.$message({
                    showClose: true,
                    message: res.errmsg,
                    type: 'error'
                });
            }
            console.log(res);
        },
        // 查看图谱详情
        graphDetail(graph_id) {
            this.opt = 'graphDetail';
            this.graph_id = graph_id;
        },
        // 详情界面返回函数
        goBack() {
            this.opt = 'graphs';
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
