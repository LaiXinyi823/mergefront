<template>
  <el-container>
    <div v-if="opt=='graphs'" style="width:100%;height:100px;">
         选择领域：
            <el-select v-model="selectDomainID" placeholder="请选择">
                <el-option
                v-for="domain in domain_list"
                :key="domain.domain_id"
                :label="domain.domain_name"
                :value="domain.domain_id">
                </el-option>
            </el-select>
        <el-row :gutter="35">
            <div style="height:80px;margin-right:12px;margin-left:17px;margin-bottom:10px;" @click="addDialogVisible = true">
                <el-card shadow="hover" style="height:100%;margin-bottom:10px;"> 
                    <i style="font-size:20px;float:left;margin-top:10px;" class='el-icon-plus'>   添加新图谱</i>
                </el-card>
            </div>
            <el-col :span="4.5" v-for="graph in graph_list" :key="graph.graph_id" :offset="0">
            <div @click="graphDetail(graph.graph_id,graph.graph_name)">
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
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addGraph()">确 定</el-button>
            </div>
        </el-dialog>
    </div>

    <div v-if="opt=='graphDetail'" style="width:100%;height:100px;">
        <el-card style="width:100%;height:65px;background-color:#fff;">
        <el-page-header @back="goBack()" :content="graph_name + ' 图谱详情'" style="float:left;"> </el-page-header>
        <!-- <el-radio-group v-model="graph_or_table" style="bottom:10%;margin-right:10px;float:right;">
        </el-radio-group> -->
        <!-- <div class='switch'>
            以数据表格形式显示
            <el-switch
                v-model="table"
                active-color="#1e90ff"
                inactive-color="#dcdcdc"
                :change="showTable()"
            >
            </el-switch>
        </div> -->
        </el-card>
        <div style="margin-top:5px;">
            <el-col :span="3">
                <el-input placeholder="请输入内容" v-model="input3" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
                <el-menu default-active="2" class="el-menu-vertical-demo" style="margin-top:3px;">
                    <el-menu-item v-for="vertex in vertex_list" :key="vertex" :unique-opened="true" @click="show(subitem.option)" >
                    <template slot="title">
                        <i class="el-icon-star-on"></i>
                        <span>{{vertex}}</span>
                    </template>
                    </el-menu-item>
                </el-menu>
            </el-col>
        </div>
        <!-- <el-card style="width:88%;margin-top:10px;">
            <el-table :data="tableData" border height="300" style="width: 100%">
                <el-table-column fixed prop="order" label="序号" width="110" />
                <el-table-column prop="entity1Name" label="起点实体" width="170" />
                <el-table-column prop="entity1Type" label="起点实体类型" width="170"/>
                <el-table-column prop="entity2Name" label="终点实体" width="170" />
                <el-table-column prop="entity2Type" label="终点实体类型" width="170"/>
                <el-table-column prop="relationType" label="关系类型" width="150" />
                <el-table-column fixed="right" label="操作" width="150">
                    <template>
                    <el-button @click="editOpt = true" type="text" size="medium">
                        <i class="el-icon-edit" />
                    </el-button>
                    <el-button @click="deleteOpt = true" type="text" size="medium">
                        <i class="el-icon-delete" />
                    </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card> -->
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
            graph_name:'',
            graph_list: [],
            domain_list: [],
            vertex_list:[],
            selectDomainID: null,
            table:'false',
            addDialogVisible: false,
            newGraph:{
                name:'',
                private:'0',
                domain_id:''
            },
            formLabelWidth: '120px',
            tableData: [
                {
                order: '1',
                entity1Name: 'BILSTM-CRF',
                entity1Type: '处理',
                entity2Name: 'CRF',
                entity2Type: '处理任务',
                relationType: '对比关系',
                },
                {
                order: '2',
                entity1Name: '数据集',
                entity1Type: '处理方法',
                entity2Name: '双向',
                entity2Type: '处理任务',
                relationType: '应用关系',
                },
                {
                order: '3',
                entity1Name: '双向',
                entity1Type: '处理任务',
                entity2Name: 'BILSTM-CRF',
                entity2Type: '处理',
                relationType: '同指关系',
                },
                {
                order: '4',
                entity1Name: '双向',
                entity1Type: '处理任务',
                entity2Name: 'BILSTM-CRF',
                entity2Type: '处理',
                relationType: '同指关系',
                },
                {
                order: '5',
                entity1Name: '双向',
                entity1Type: '处理任务',
                entity2Name: 'BILSTM-CRF',
                entity2Type: '处理',
                relationType: '同指关系',
                },
            ],
        };
    },
    created(){
        this.getMygraphList();
        this.getMyDomainList();
    },
    methods: {
        // 获取我的图谱
        async getMygraphList (){
            const res = await this.$http.get('list_graphs',{params:{domain_id: this.selectDomainID}});
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
        async graphDetail(graph_id,graph_name) {
            this.opt = 'graphDetail';
            this.graph_id = graph_id;
            this.graph_name = graph_name;
            const { data:res } = await this.$http.get('show_vertex',{params:{graph_id:38}});
            console.log(res.data);
            this.vertex_list = res.data;
        },
        // 获取我的领域列表
        async getMyDomainList(){
            const { data:res} = await this.$http.get('list_domain');
            this.domain_list = res.data;
        },
        // 详情界面返回函数
        goBack() {
            this.opt = 'graphs';
        },
        // 以表格形式展示数据
        showTable(){

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
.switch{
 float:right;
}

</style>
