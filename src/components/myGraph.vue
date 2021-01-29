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
        <el-card style="width:100%;height:65px;background-color:#fff;" shadow="never">
        <el-page-header @back="goBack()" :content="graph_name + ' 图谱详情'" style="float:left;"> </el-page-header>
        </el-card>
        <div style="margin-top:5px;">
            <el-col :span="3">
                <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
                <el-menu default-active="2" class="el-menu-vertical-demo" style="margin-top:3px;">
                    <el-menu-item v-for="vertex_item in vertex_list" :key="vertex_item" :unique-opened="true" @click="showEntitys(vertex_item,1)" >
                    <template slot="title">
                        <i class="el-icon-star-on"></i>
                        <span>{{vertex_item}}</span>
                    </template>
                    </el-menu-item>
                </el-menu>
            </el-col>
        </div>
        <div style="margin-left:130px;margin-top:5px;">
        <el-card shadow="never">
            <el-table :data="entity_list" border style="width: 100%" size="mini">
                <div id="main" style="width: 100%;height:100%;"></div>
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column prop="_id" label="id" width="300"></el-table-column>
                <el-table-column prop="_key" label="key" width="300"></el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button type="success" icon="el-icon-picture" circle @click="graphVisible=true;entity_id=scope.row._id"></el-button>
                        <el-button type="primary" icon="el-icon-edit" circle @click="handle(scope.$indeEditx, scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog title="图谱" :visible.sync="graphVisible" @opened="openGraph()">
                <div id="main" ref="graph" style="width: 600px;height:400px;"></div>
            </el-dialog>
            <div style="width:50%;margin-left:30%;margin-top:10px;">
                <el-pagination background layout="total, prev, pager, next" :page-size="8" :page-count="entity_pages" @current-change="changePage" :hide-on-single-page="true" style="margin:0 auto;"></el-pagination>
            </div>
        </el-card>
        </div>
    </div>
  </el-container>
</template>

<script>
import * as echarts from 'echarts'
export default {
    inject:['reload'],
    created(){
        this.getMygraphList();
        this.getMyDomainList();
    },
    data (){
        return {
            opt:'graphs',
            graph_id:'',
            search:'',
            graph_name:'',
            graph_list: [],
            domain_list: [],
            vertex_list:[],
            vertex:'', // 当前所选择的实体类型
            entity_id:'', // 当前所选择的实体
            entity_list:[], // 某一类下所有实体列表
            entity_nums:0, // 实体列表包含的实体数
            entity_pages:0, // 包含页数，以8条为一页
            currentPage:1, // 当前页数
            selectDomainID: null,
            table:'false',
            addDialogVisible: false,
            newGraph:{
                name:'',
                private:'0',
                domain_id:''
            },
            formLabelWidth: '120px',
            graphVisible: false,
            option:[]
        };
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
            // 传入graph_id，get图中所涉及的实体类型
            const { data:res } = await this.$http.get('show_vertex',{params:{graph_id:38}});
            console.log(res.data);
            this.vertex_list = res.data;
            this.vertex = this.vertex_list[0];
            this.showEntitys(this.vertex,1);
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
        changePage: function(currentPage){
            this.currentPage = currentPage;
            this.showEntitys(this.vertex,this.currentPage);
        },
        // 以表格形式展示某类型所有实体
        async showEntitys(vertex,page){
            this.vertex = vertex;
            const { data:res } = await this.$http.get('vertex_list',{params:{collection:vertex,page:page,len:8}});
            this.entity_list=res.data.vertex;
            this.entity_pages=parseInt(res.data.pages);
        },
        // 打开显示图的对话框
        openGraph(){
            console.log('open');
            this.$nextTick(() => {
                this.showGraph();
            });
        },
        // 展示以某实体为中心的图谱
        showGraph(){
            //var chartDom = document.getElementById('main');
            var myChart = echarts.init(this.$refs.graph);

            this.option = {
                title: {
                    text: '中心节点:' + this.entity_id
                },
                tooltip: {},
                animationDurationUpdate: 1500,
                animationEasingUpdate: 'quinticInOut',
                series: [
                    {
                        type: 'graph',
                        layout: 'none',
                        symbolSize: 50,
                        roam: true,
                        label: {
                            show: true
                        },
                        edgeSymbol: ['circle', 'arrow'],
                        edgeSymbolSize: [4, 10],
                        edgeLabel: {
                            fontSize: 20
                        },
                        data: [{
                            name: '节点1',
                            x: 300,
                            y: 300
                        }, {
                            name: '节点2',
                            x: 800,
                            y: 300
                        }, {
                            name: '节点3',
                            x: 550,
                            y: 100
                        }, {
                            name: '节点4',
                            x: 550,
                            y: 500
                        }],
                        // links: [],
                        links: [{
                            source: 0,
                            target: 1,
                            symbolSize: [5, 20],
                            label: {
                                show: true
                            },
                            lineStyle: {
                                width: 5,
                                curveness: 0.2
                            }
                        }, {
                            source: '节点2',
                            target: '节点1',
                            label: {
                                show: true
                            },
                            lineStyle: {
                                curveness: 0.2
                            }
                        }, {
                            source: '节点1',
                            target: '节点3'
                        }, {
                            source: '节点2',
                            target: '节点3'
                        }, {
                            source: '节点2',
                            target: '节点4'
                        }, {
                            source: '节点1',
                            target: '节点4'
                        }],
                        lineStyle: {
                            opacity: 0.9,
                            width: 2,
                            curveness: 0
                        }
                        }
                        ]
                    };
                    myChart.setOption(this.option);    
        },
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
