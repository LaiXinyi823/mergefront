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
            <div @click="graphDetail(graph.graph_id,graph.graph_name,graph.domain_id)">
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
                    <el-menu-item>实体类型列表</el-menu-item>
                    <el-menu-item v-for="collection in collections_list" :key="collection" :unique-opened="true" @click="showEntitys(collection,1)" >
                    <template slot="title">
                        <i class="el-icon-star-on"></i>
                        <span>{{collection}}</span>
                    </template>
                    </el-menu-item>
                </el-menu>
            </el-col>
        </div>
        <div style="margin-left:130px;margin-top:5px;">
        <el-card shadow="never">
            <el-button @click="addEntityVisible=true" size="mini" type="primary" icon="el-icon-plus" style="margin-left:10px;margin-right:10px;margin-bottom:10px;" circle>
            </el-button>添加实体节点
            <el-table :data="vertexs_list" border style="width: 100%" size="mini">
                <div id="main" style="width: 100%;height:100%;"></div>
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column prop="_id" label="id" width="300"></el-table-column>
                <el-table-column prop="_key" label="key" width="300"></el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button type="success" icon="el-icon-picture" circle @click="graphVisible=true;vertex_id=scope.row._id"></el-button>
                        <el-button type="primary" icon="el-icon-edit" circle @click="editVisible=true;vertex_id=scope.row._id"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 添加新实体节点 -->
            <el-dialog title="添加新实体节点" :visible.sync="addEntityVisible">
                <el-form :model="newVertex">
                    <el-form-item label="实体类型" :label-width="formLabelWidth">
                        {{collection}}
                    </el-form-item>
                    <el-form-item label="实体节点名称" :label-width="formLabelWidth">
                    <el-input v-model="newVertex.name" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="addEntityVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addNode(collection)">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 以中心节点方式展示图谱 -->
            <el-dialog title="图谱显示" :fullscreen=fullscreen :visible.sync="graphVisible" @opened="openDialog(maxDepth)" @close="maxDepth=2;fullscreen=false">
                <div id="main" ref="graph" style="width: 600px;height:400px;"></div>
                <!-- 图中显示层数 -->
                <div style="margin-left:25%;">
                    显示层数：
                    <el-select v-model="maxDepth" placeholder="2" size="mini" @change="showEditGraph(maxDepth)">
                        <el-option
                        v-for="i in 5"
                        :key="i"
                        :label="i"
                        :value="i">
                        </el-option>
                    </el-select>
                    <div style="float:right"><el-link @click="fullscreen = true" :underline=false><i class="el-icon-full-screen">全屏显示</i></el-link></div>
                </div>
            </el-dialog>
            <!-- 展示该图谱的中心实体对应的关系列表（编辑功能） -->
            <el-dialog :title="'图谱编辑-中心节点：'+vertex_id" :visible.sync="editVisible" @opened="openDialog('1')">
                <el-table :data="graph_links_sorted" style="width: 100%">
                    <el-table-column label="关系类型" width="140">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.relation }} 
                            <el-button @click="addEdge(scope.row.relation)" size="mini" type="info" icon="el-icon-plus" style="margin-left:10px" circle></el-button>
                        </span>
                    </template>
                    </el-table-column>
                    
                    <el-table-column width="240" label="起点实体">
                        <template slot-scope="scope">
                            <div v-for="node in scope.row.nodes" :key="node.node_id" style="float:left;margin-right:5px">
                                <div v-if="node.from_or_to=='source'">
                                    <div slot="reference" class="name-wrapper" style="margin-bottom:3px;">
                                        <el-tag size="medium">{{ node.node_name }} 
                                           <template>
                                                <el-popconfirm title="确定删除该节点吗？" icon-color="red" :confirm="deleteEdge(node.link_id)">
                                                <i class="el-icon-close" slot="reference"></i>
                                                </el-popconfirm>
                                            </template>
                                        </el-tag>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column width="240" label="终点实体">
                        <template slot-scope="scope">
                            <div v-for="node in scope.row.nodes" :key="node.node_id" style="float:left;margin-right:5px">
                                <div v-if="node.from_or_to=='target'">
                                    <div slot="reference" class="name-wrapper">
                                        <el-tag size="medium">{{ node.node_name }}
                                            <i class="el-icon-close" @click="deleteNodeVisible=true"></i>
                                        </el-tag>
                                    </div>
                                </div>
                                <el-dialog title="提示" :visible.sync="deleteNodeVisible" width="30%" center>
                                    <span>您确定要删除当前节点:{{node.node_id}}吗？</span>
                                    <span slot="footer" class="dialog-footer">
                                        <el-button @click="deleteNodeVisible = false">取 消</el-button>
                                        <el-button type="primary" @click="deleteEdge(node.node_id)">确 定</el-button>
                                    </span>
                                </el-dialog>
                            </div>
                            
                        </template>
                    </el-table-column>
                </el-table>
                <el-button type="text" @click="addRelationVisible = true">为该节点创建新的关系</el-button>
                <el-dialog title="新增关系类型" :visible.sync="addRelationVisible">
                <el-form :model="newRelation">
                    <el-form-item label="关系类型名称" label-width="100px">
                        <el-input v-model="newRelation.relationName" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="选择节点" label-width="100px">
                        <el-cascader placeholder="搜索节点" v-model="newRelation.node_id" :options="options" :props="{ multiple: true }" filterable></el-cascader>
                    </el-form-item>
                    <el-form-item label="所选节点为" label-width="100px">
                        <template>
                        <el-radio v-model="newRelation.relationRadio" label="source">起始节点</el-radio>
                        <el-radio v-model="newRelation.relationRadio" label="target">终点节点</el-radio>
                        </template>
                    </el-form-item>
                    
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="addRelationVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addRelation()">确 定</el-button>
                </div>
            </el-dialog>
            </el-dialog>
            
        </el-card>
        </div>
    </div>
  </el-container>
</template>

<script>
import * as echarts from 'echarts'
export default {
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
            domain_id:'', // 被选中图谱的domain_id
            collections_list:[],// 所有
            collection:'', // 当前所选择的实体类型
            vertex_id:'', // 当前所选择的实体
            vertexs_list:[], // 某一类下所有实体列表
            vertex_nums:0, // 实体列表包含的实体数
            vertex_pages:0, // 包含页数，以8条为一页
            currentPage:1, // 当前页数
            graph_nodes:[], // 展示图所涉及到的节点数据
            graph_links:[], // 展示图所涉及到的关系数据
            graph_links_sorted:[], // 按照关系类型进一步分类的数据
            maxDepth:2, // 图谱层数，默认为2
            selectDomainID: 'all',
            table:'false',
            newGraph:{
                name:'',
                private:'0',
                domain_id:''
            },
            newVertex:{
                name:'',
                attr_1:'test'
            },
            newRelation:{
                relationName:'',
                node_id:[],
                relationRadio:''
            },
            formLabelWidth: '120px',
            graphVisible: false,
            editVisible: false,
            deleteNodeVisible:false,
            addEntityVisible:false,
            addRelationVisible:false,
            addDialogVisible: false,
            fullscreen:false
        };
    },
    methods: {
        // 获取我的图谱
        async getMygraphList (){
            const res = await this.$http.get(this.selectDomainID+'/graph');
            this.graph_list = res.data.data;
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
        },
        // 查看图谱详情
        async graphDetail(graph_id,graph_name,domain_id) {
            this.opt = 'graphDetail';
            this.graph_id = graph_id;
            this.graph_name = graph_name;
            this.domain_id = domain_id;
            // 传入graph_id，get图中所涉及的实体类型
            const { data:res } = await this.$http.get(this.domain_id+'/graph/'+this.graph_id+'/vertex');
            this.collections_list = res.data;
            this.collection = this.collections_list[0];
            this.showEntitys(this.collection,1);
        },
        // 获取我的领域列表
        async getMyDomainList(){
            const { data:res } = await this.$http.get('domain');
            this.domain_list = res.data;
        },
        // 详情界面返回函数
        goBack() {
            this.opt = 'graphs';
        },
        // 翻页
        changePage: function(currentPage){
            this.currentPage = currentPage;
            this.showEntitys(this.collection,this.currentPage);
        },
        // 以表格形式展示某类型所有实体
        async showEntitys(collection,page){
            this.collection = collection;
            const { data:res } = await this.$http.get(this.domain_id+'/graph/'+this.graph_id+'/vertex/'+collection+'?page='+page+'&len='+8);
            this.vertexs_list=res.data.vertex;
            this.vertex_pages=parseInt(res.data.pages);
        },
        // 打开显示的对话框
        openDialog(maxDepth){
            this.$nextTick(() => {
                this.showEditGraph(maxDepth);
            });
        },
        // 展示以某实体为中心的图谱
        async showEditGraph(maxDepth){
            this.graph_nodes = []; // 节点数据初始化
            this.graph_links = []; // 关系数据初始化
            const { data:res } = await this.$http.post(this.domain_id+'/graph/'+this.graph_id+'/traverse',
            {
                startVertex:this.vertex_id,
                direction:'any',
                maxDepth:parseInt(maxDepth),
                minDepth:0
            });
            
            var len=res.data.paths.length;
            // 每个path中包括1/2条边edges数组以及涉及到的节点vertices数组
            for(var i=0;i<len;i++){
                var vertices=res.data.paths[i].vertices;
                var links=res.data.paths[i].edges;
                var v_len=vertices.length;
                var l_len=links.length;
                // 获取节点数据
                for(var j=0;j<v_len;j++){
                    vertices[j]['id']=vertices[j]['_id'];
                    delete vertices[j]['_id'];
                    if(JSON.stringify(this.graph_nodes).indexOf(JSON.stringify(vertices[j]))>-1){
                    }
                    else{
                        this.graph_nodes.push(vertices[j]); // 得到与中心实体相关的所有实体
                    }
                }
                // 获取关系数据
                // 关系数据格式
                // { "source": "persons/alice","id": "knows/247922","target": "persons/bob"}
                for(var k=0;k<l_len;k++)
                {
                    var relation={
                        id:links[k]._id,
                        source:links[k]._from,
                        target:links[k]._to
                    }
                    if(links[k].length!=0 && JSON.stringify(this.graph_links).indexOf(JSON.stringify(relation))==-1)
                        this.graph_links.push(relation);
                }
                    
            }
            // 节点数据格式
            // {"id": "persons/alice","_key": "alice","_rev": "_bukg8Sa---","name": "Alice"}
            this.graph_nodes.map(function(item){
                return{
                    id:item._id
                }
            });

            if(this.graphVisible){
                // 使用Echarts展示
                var myChart = echarts.init(this.$refs.graph);
                var option = {
                    title: {
                        text: '中心节点:' + this.vertex_id
                    },
                    tooltip: {},
                    animationDurationUpdate: 1500,
                    animationEasingUpdate: 'quinticInOut',
                    series: [
                        {
                            type: 'graph',
                            layout: 'force',
                            symbolSize: 50,
                            roam: true,
                            force: {
                                repulsion: 2500,
                                edgeLength: [10, 50],
                                draggable:true
                            },
                            itemStyle: {//配置节点的颜色
                                normal: {
                                    color: function (params) {
                                        if (params.dataIndex == 0)
                                            return 'red'
                                        else{
                                            var colorList = ['yellow','orange', 'green', 'blue', 'gray'];
                                            return colorList[params.dataIndex]
                                        }
                                        
                                    },

                                }
                            },
                            symbolSize: function (value, params) {//改变节点大小
                                if (params.dataIndex == 0)
                                    return 60
                                else
                                    return 40
                            },
                            label: {
                                show: true
                            },
                            edgeSymbol: ['circle', 'arrow'],
                            edgeSymbolSize: [4, 10],
                            edgeLabel: {
                                fontSize: 20
                            },
                            nodes: this.graph_nodes, // 节点数据
                            links: this.graph_links, // 关系数据
                            edgeLabel: {//边的设置
                                show: true,
                                position: "middle",
                                fontSize: 12,
                                formatter: (params) => {
                                    return params.data.id.split('/')[0];
                                },
                            },
                            lineStyle: {
                                opacity: 0.9,
                                width: 2,
                                curveness: 0
                            }
                            }
                            ]
                        };
                        myChart.setOption(option);    
                        //点击事件
                        myChart.on('click', function (params) {
                            if (params.dataType == 'node') {
                                console.log(params.name)
                            }
                            else if (params.dataType == 'edge'){
                                console.log(params)
                            }
                        });
            }

            else if(this.editVisible){
                this.graph_links_sorted=[]
                var relations=[]// 如 ['knows','love']
                for(var i=0;i<this.graph_links.length;i++){
                    console.log(i)
                    var source_node = this.graph_links[i]['source']
                    if(source_node == this.vertex_id)//中心节点为source节点
                        var from_or_to = 'target' //待将target节点加入列表中
                    else
                        var from_or_to = 'source' //待将source节点加入列表中
                    var relation = this.graph_links[i]['id'].split('/')[0]
                    var type_index = relations.indexOf(relation)
                    if(type_index==-1){
                        relations.push(relation) // 加入新关系类型
                        this.graph_links_sorted.push({relation:relation,nodes:[]}) 
                        // 加入新关系类型，及其相关节点列表 [{'knows':[{'BOB'},{'Alice'}]},{'love':[{'Kate'}]}]
                    }
                    type_index = relations.indexOf(relation)
                    var link_id = this.graph_links[i]['id']
                    var node_type = this.graph_links[i][from_or_to].split('/')[0]
                    var node_name = this.graph_links[i][from_or_to].split('/')[1]
                    this.graph_links_sorted[type_index].nodes.push({link_id:link_id,from_or_to:from_or_to,node_name:node_name,node_type:node_type,node_id:this.graph_links[i][from_or_to]})
                }
                console.log(this.graph_links_sorted)
            }  
        },
        // 添加中心节点
        async addNode(type){
            console.log(this.newVertex)
            const res = await this.$http.post(this.domain_id+'/graph/'+this.graph_id+'/vertex/'+type,this.newVertex)
            console.log(res)
            this.addEntityVisible=false
        },

        // 添加新的关系类型------------未加后端
        async addRelation(){
            if(this.newRelation.relationRadio=='target')
                var param = {
                    from:this.vertex_id,
                    to:this.newRelation.node_id,
                    attribute:{}
                }
            else
                var param = {
                    from:this.newRelation.node_id,
                    to:this.vertex_id,
                    attribute:{}
                }
            const {data:res} = await this.$http.post(this.domain_id+'/graph/'+this.graph_id+'/edge/'+ this.newRelation.relationName,param)
            console.log(param)
            console.log(res)
            if(res.errno=="0"){
                this.$message({
                    showClose: true,
                    message: '添加新关系类型成功！',
                    type: 'success'
                });
            }
            else{
                this.$message({
                    showClose: true,
                    message: '添加失败！',
                    type: 'error'
                });
            }
            this.addRelationVisible = false;
            this.showEditGraph();
            this.editVisible=true;
        },

        // 删除与中心节点有关的某个节点（删除二者关系）
        async deleteEdge(link_id){
            console.log(link_id)
            const {data:res} = await this.$http.delete(this.domain_id+'/graph/'+this.graph_id+'/edge/'+ link_id)
            console.log(res)
            if(res.errno=="0"){
                this.$message({
                    showClose: true,
                    message: '删除节点成功！',
                    type: 'success'
                });
            }
            else{
                this.$message({
                    showClose: true,
                    message: '删除失败！',
                    type: 'error'
                });
            }
            this.deleteNodeVisible = false;
        },

        // 为中心节点添加一条边（模糊搜索选已存在的节点）
        async addEdge(relation){
            const res = await this.$http.post(this.domain_id+'/graph/'+this.graph_id+'/edge/'+ relation,
            {
                from:this.vertex_id,
                to:'persons/alice',
                attribute:{}
            })
            console.log(res)
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
