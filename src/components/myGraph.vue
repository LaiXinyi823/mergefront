<template>
  <el-container>
    <div
      v-if="opt=='graphs'"
      style="width:100%;height:100px;"
    >
      选择查看某领域知识图谱：
      <el-select
        v-model="selectDomainID"
        placeholder="请选择"
      >
        <el-option
          v-for="domain in domain_list"
          :key="domain.domain_id"
          :label="domain.domain_name"
          :value="domain.domain_id"
          @change="getMygraphList(selectDomainID)"
        />
      </el-select>
      <el-row :gutter="35">
        <div
          @click="addDialogVisible = true"
          style="float:left;margin-left:20px;margin-top:10px;"
        >
          <el-card
            shadow="hover"
            style="width: 200px;height: 200px;margin-bottom:10px;"
          > 
            <i
              style="font-size:20px;float:left;margin-top:50px;"
              class="el-icon-plus"
            >   添加新图谱</i>
          </el-card>
        </div>
        <el-col
          :span="4.5"
          v-for="graph in graph_list"
          :key="graph.graph_id"
          :offset="0"
        >
          <div @click="graphDetail(graph.graph_id,graph.graph_name,graph.domain_id)">
            <el-card
              shadow="hover"
              style="width: 200px;height: 200px;margin-bottom:10px;margin-top:10px;"
            >
              <el-image
                style="width: 100px; height: 100px; margin-left:20%;margin-top:5%;"
                src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3243406373,3135595743&fm=26&gp=0.jpg"
              />
              <h4>{{ graph.graph_name }}</h4>
            </el-card>
          </div>
        </el-col>
      </el-row>
      <el-dialog
        title="新增知识图谱"
        :visible.sync="addDialogVisible"
      >
        <el-form :model="newGraph">
          <el-form-item
            label="知识图谱名称"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="newGraph.name"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="所属领域名称"
            :label-width="formLabelWidth"
          >
            <el-select
              v-model="newGraph.domain_id"
              placeholder="请选择"
            >
              <el-option
                v-for="domain in domain_list"
                :key="domain.domain_id"
                :label="domain.domain_name"
                :value="domain.domain_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="图谱权限"
            :label-width="formLabelWidth"
          >
            <el-radio
              v-model="newGraph.private"
              label="0"
            >
              公开
            </el-radio>
            <el-radio
              v-model="newGraph.private"
              label="1"
            >
              私有
            </el-radio>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="addDialogVisible = false">
            取 消
          </el-button>
          <el-button
            type="primary"
            @click="addGraph()"
          >
            确 定
          </el-button>
        </div>
      </el-dialog>
    </div>
    <div
      v-if="opt=='graphDetail'"
      style="width:100%;height:100px;"
    >
      <el-card
        style="width:100%;height:65px;background-color:#fff;"
        shadow="never"
      >
        <el-page-header
          @back="goBack()"
          :content="graph_name + ' 图谱详情'"
          style="float:left"
        />
        <div style="width:20%;float:right;">
          <el-input
            placeholder="输入节点名称"
            v-model="searchVertexName"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchVertex()"
            />
          </el-input>
        </div>
      </el-card>
      <div style="margin-top:5px;">
        <el-col :span="3">
          <el-button
            @click="addVertexVisible=true"
            size="mini"
            type="warning"
            icon="el-icon-star-off"
            style="margin-left:10px;margin-right:10px;margin-top:10px;margin-bottom:10px;"
            circle
          />添加实体类型
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            style="margin-top:3px;"
          >
            <el-menu-item>实体类型列表</el-menu-item>
            <el-menu-item
              v-for="collection in collections_list"
              :key="collection"
              :unique-opened="true"
              @click="showVertexs(collection,1)"
            >
              <template slot="title">
                <i class="el-icon-star-on" />
                <span>{{ collection }}</span>
              </template>
            </el-menu-item>
          </el-menu>
        </el-col>
      </div>
      <!-- 显示某一类实体节点表格 -->
      <div style="margin-left:130px;margin-top:5px;">
        <el-card shadow="never">
          <!-- 显示某类型下的所有实体 -->
          <div
            v-if="search==false"
            style="height:100%"
          >
            <el-button
              @click="addVertexVisible=true"
              size="mini"
              type="primary"
              icon="el-icon-plus"
              style="margin-left:10px;margin-right:10px;margin-bottom:10px;"
              circle
            />添加{{ collection }}节点
            <el-table
              :data="vertexs_list"
              border
              style="width: 100%"
              size="mini"
            >
              <el-table-column
                type="index"
                width="50"
              />
              <el-table-column
                prop="_id"
                label="ID"
                width="310"
              />
              <el-table-column
                prop="name"
                label="节点名称"
                width="310"
              />
              <el-table-column
                label="操作"
                width="400"
              >
                <template slot-scope="scope">
                  <el-button
                    type="success"
                    icon="el-icon-picture"
                    circle
                    @click="graphVisible=true;vertex=scope.row"
                  />
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    circle
                    @click="editVisible=true;vertex=scope.row"
                  />
                  <el-popconfirm
                    confirm-button-text="确定"
                    cancel-button-text="取消"
                    icon="el-icon-info"
                    icon-color="red"
                    title="确定删除该节点及其与其他节点的所有关系吗？"
                    @confirm="deleteVertex()"
                  >
                    <el-button
                      style="margin-left:10px"
                      type="danger"
                      slot="reference"
                      icon="el-icon-delete"
                      circle
                      @click="vertex=scope.row"
                    />
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div
              class="block"
              style="margin-top:10px;margin-left:35%"
            >
              <el-pagination
                @current-change="changePage"
                :current-page="currentPage"
                :page-size="10"
                layout="total, prev, pager, next, jumper"
                :total="vertex_nums"
              />
            </div>
          </div>
          <!-- 显示用户搜索的实体节点 -->
          <div v-else>
            <div style="margin-bottom:10px;">
              <b>查询到:{{ searchLen }}个相关节点</b>
            </div>
            <!-- <div style="float:right;">
                未搜索到目标节点？
                添加节点<el-button @click="addVertexVisible=true" size="mini" type="primary" icon="el-icon-plus" style="margin-left:10px;margin-right:20px;margin-bottom:10px;" circle>
                </el-button></div> -->
            <el-table
              :data="searchResults"
              border
              style="width: 100%"
              height="500"
              size="mini"
            >
              <el-table-column
                type="index"
                width="50"
              />
              <el-table-column
                prop="collection"
                label="节点类型"
                width="200"
              />
              <el-table-column
                prop="_id"
                label="ID"
                width="250"
              />
              <el-table-column
                prop="name"
                label="节点名称"
                width="250"
              />
              <el-table-column label="操作" width="320">
                <template slot-scope="scope">
                  <el-button type="success" icon="el-icon-picture" circle @click="graphVisible=true;vertex=scope.row"/>
                  <el-button type="primary" icon="el-icon-edit" circle @click="editVisible=true;vertex=scope.row"/>
                  <el-popconfirm
                    confirm-button-text="确定"
                    cancel-button-text="取消"
                    icon="el-icon-info"
                    icon-color="red"
                    title="确定删除该节点及其与其他节点的所有关系吗？"
                    @confirm="deleteVertex()"
                  >
                    <el-button
                      style="margin-left:10px"
                      type="danger"
                      slot="reference"
                      icon="el-icon-delete"
                      circle
                      @click="vertex=scope.row"
                    />
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 添加新实体节点 -->
          <el-dialog
            title="添加新实体节点"
            :visible.sync="addVertexVisible"
          >
            <el-form :model="newVertex">
              <el-form-item
                label="实体类型"
                :label-width="formLabelWidth"
              >
                {{ collection }}
              </el-form-item>
              <el-form-item
                label="实体节点名称"
                :label-width="formLabelWidth"
              >
                <el-input
                  v-model="newVertex.name"
                  autocomplete="off"
                />
              </el-form-item>
            </el-form>
            <div
              slot="footer"
              class="dialog-footer"
            >
              <el-button @click="addVertexVisible = false">
                取 消
              </el-button>
              <el-button
                type="primary"
                @click="addNode(collection)"
              >
                确 定
              </el-button>
            </div>
          </el-dialog>
          <!-- 以中心节点方式展示图谱 -->
          <el-dialog
            title="图谱显示"
            width="35%"
            :fullscreen="fullscreen"
            :visible.sync="graphVisible"
            @opened="openDialog(maxDepth)"
            @close="closeFullScreen()"
          >
            <div
              id="main"
              ref="graph"
              style="width: 600px;height:400px;"
            />
            <!-- 图中显示层数 -->
            <div style="position:absolute;margin-left:25%;bottom: 10px;">
              显示层数：
              <el-select
                v-model="maxDepth"
                placeholder="2"
                size="mini"
                @change="showEditGraph(maxDepth)"
              >
                <el-option
                  v-for="i in 5"
                  :key="i"
                  :label="i"
                  :value="i"
                />
              </el-select>
            </div>
            <div style="position:absolute;top: 16px;right:60px;float:left">
              <el-link
                @click="fullGraph()"
                :underline="false"
              >
                <i class="el-icon-full-screen" />
              </el-link>
            </div>
          </el-dialog>
          <!-- 展示该图谱的中心实体对应的关系列表（编辑功能） -->
          <el-drawer
            :title="'中心节点：' + vertex.name"
            :visible.sync="editVisible"
            direction="rtl"
            size="60%"
            height="100%"
            @opened="openDialog('1')"
          >
            <el-table
              ref="filterTable"
              :data="graph_links"
              max-height="600"
              style="width: 95%;margin-left:2%;">
              <el-table-column fixed="left" type="index" width="50"></el-table-column>
              <el-table-column prop="e1_type" label="起始类型" sortable width="180"></el-table-column>
              <el-table-column prop="e1_name" label="起始节点名" width="180"></el-table-column>
              <el-table-column prop="relation" label="关系" width="180">
                <template slot-scope="scope">
                  <el-tag size="medium" type="primary">{{ scope.row.relation}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="e2_type" label="终止类型" width="180"></el-table-column>
              <el-table-column prop="e2_name" label="终止节点名" width="180"></el-table-column>
              <el-table-column fixed="right" label="操作" width="120">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small">
                    移除
                  </el-button>
                  <el-button
                    type="text"
                    size="small">
                    编辑
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-drawer>




          <!-- <el-dialog
            :title="'图谱编辑-中心节点：'+ vertex.name"
            :visible.sync="graphVisible"
            @opened="openDialog('1')"
          >
            <el-table
              :data="graph_links_sorted"
              style="width: 100%"
            >
              <el-table-column
                label="关系类型"
                width="180"
              >
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.relation }}        
                    <el-button
                      slot="reference"
                      size="mini"
                      type="info"
                      icon="el-icon-plus"
                      style="margin-left:10px"
                      circle
                      @click="addNewEdgeVisible=true"
                    />
                  </span> -->
                  <!-- 新增与中心实体有关的节点 -->
                  <!-- <el-dialog title="新增关系节点" :visible.sync="addNewEdgeVisible">
                    <el-form :model="newEdge"> -->
                      <!-- 模糊查询选择要添加的节点 -->
                      <!-- <el-form-item label="选择节点" prop="resource" label-width="100px">
                        <el-autocomplete
                          v-model="newEdge.name"
                          :fetch-suggestions="querySearchAsync"
                          placeholder="请输入内容"
                          @select="handleSelectNewEdge"
                        />
                      </el-form-item>
                      <el-form-item label="节点类型" prop="resource">
                        <el-radio-group v-model="newEdge.node_type">
                          <el-radio v-model="newEdge.node_type" label="from">起始节点</el-radio>
                          <el-radio v-model="newEdge.node_type" label="to">终点节点</el-radio>
                        </el-radio-group>
                      </el-form-item>               
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                      <el-button @click="addRelationVisible = false">取 消</el-button>
                      <el-button type="primary" @click="addEdge(scope.row.relation)">确 定</el-button>
                    </div>
                  </el-dialog>
                </template>
              </el-table-column> -->
                    
              <!-- 显示与中心节点有关的起始节点 -->
              <!-- <el-table-column width="240" label="起点实体">
                <template slot-scope="scope">
                  <div v-for="node in scope.row.nodes" :key="node.node_id" style="float:left;margin-right:5px">
                    <div v-if="node.from_or_to=='source'">
                      <div slot="reference" class="name-wrapper" style="margin-bottom:3px;">
                        <el-tag size="medium">
                          {{ node.node_name }} 
                          <i class="el-icon-close" @click="node.node_deleteVisible=true"/>
                        </el-tag>
                      </div>
                      <el-dialog title="提示" :visible.sync="node.node_deleteVisible" width="30%" center>
                        <span>您确定要删除当前节点:{{ node.node_id }}吗？</span>
                        <span slot="footer" class="dialog-footer">
                          <el-button @click="node.node_deleteVisible = false">取 消</el-button>
                          <el-button type="primary" @click="deleteEdge(node.node_id)">确 定</el-button>
                        </span>
                      </el-dialog>  
                    </div>
                  </div>
                </template>
              </el-table-column> -->

              <!-- 显示与中心实体有关的终点实体 -->
              <!-- <el-table-column width="240" label="终点实体">
                <template slot-scope="scope">
                  <div v-for="node in scope.row.nodes" :key="node.node_id" style="float:left;margin-right:5px">
                    <div v-if="node.from_or_to=='target'">
                      <div slot="reference" class="name-wrapper">
                        <el-tag size="medium">
                          {{ node.node_name }}
                          <i class="el-icon-close" @click="node.node_deleteVisible=true"/>
                        </el-tag>
                      </div>
                      <el-dialog title="提示" :visible.sync="node.node_deleteVisible" width="30%" center>
                        <span>您确定要删除当前节点:{{ node.node_id }}吗？</span>
                        <span slot="footer" class="dialog-footer">
                          <el-button @click="node.node_deleteVisible = false">取 消</el-button>
                          <el-button type="primary" @click="deleteEdge(node.node_id)">确 定</el-button>
                        </span>
                      </el-dialog>
                    </div>
                  </div>   
                </template>
              </el-table-column>
            </el-table> -->

            <!-- 为中心实体创建新的关系类型 -->
            <!-- <el-button type="text" @click="addRelationVisible = true">为该节点创建新的关系</el-button>
            <el-dialog title="新增关系类型" :visible.sync="addRelationVisible">
              <el-form :model="newRelation">
                <el-form-item label="关系类型名称" label-width="100px">
                  <el-input v-model="newRelation.relationName" autocomplete="off"/>
                </el-form-item>
                <el-form-item label="选择节点" prop="resource" label-width="100px">
                  <el-autocomplete v-model="newRelation.name" :fetch-suggestions="querySearchAsync" placeholder="请输入内容" @select="handleSelectNewRelation"/>
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
            </el-dialog> -->

            <!-- 重命名某中心实体 -->
            <!-- <div>
              <el-button type="text" @click="renameVertexVisible = true">
                重命名该中心节点名称
              </el-button>
            </div>
            <el-dialog title="重命名该中心节点" :visible.sync="renameVertexVisible">
              <el-form>
                <el-form-item label="原名称" label-width="100px">
                  {{ vertex.name }}
                </el-form-item>    
                <el-form-item label="新名称" label-width="100px">
                  <el-input v-model="rename" />
                </el-form-item>                 
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="addRelationVisible = false">取 消</el-button>
                <el-button type="primary" @click="renameVertex()">确 定</el-button>
              </div>
            </el-dialog>
          </el-dialog>        -->
        </el-card>        
      </div>
    </div>
  </el-container>
</template>

<script>
import * as echarts from 'echarts';
export default {
    created(){
        this.getMygraphList('all');
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
            collections_list:[],// 所有实体类型列表
            collection:'', // 当前所选择的实体类型
            vertex:{},// 当前所选节点
            vertexs_list:[], // 某一类下所有实体列表
            vertex_nums:0, // 实体列表包含的实体数
            vertex_pages:0, // 包含页数，以8条为一页
            currentPage:1, // 当前页数
            graph_nodes:[], // 展示图所涉及到的节点数据
            graph_links:[], // 展示图所涉及到的关系数据
            graph_links_sorted:[], // 按照关系类型进一步分类的数据
            maxDepth:2, // 图谱层数，默认为2
            selectDomainID: '',
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
                node_id:'',
                name:'',
                relationRadio:''
            },
            newEdge:{
                node_id:'',
                name:'',
                node_type:''
            },
            searchEdges:[],
            rename:'',
            formLabelWidth: '120px',
            searchVertexName:'',
            graphVisible: false,
            editVisible: false,
            deleteNodeVisible:false,
            addVertexVisible:false,
            addRelationVisible:false,
            addDialogVisible: false,
            addNewEdgeVisible: false,
            renameVertexVisible: false,
            fullscreen:false,
            timeout:null,
            search:false,// 当用户启用在graph_detail界面搜索某节点为true
            searchResults:[], // 用户搜索的实体节点结果
            searchLen:0
        };
    },
    methods: {
        // 获取我的图谱
        async getMygraphList(selectDomainID){
            const res = await this.$http.get(selectDomainID+'/graph');
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
            this.showVertexs(this.collection,1);
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
            console.log(currentPage);
            this.currentPage = currentPage;
            this.showVertexs(this.collection,this.currentPage);
        },
        // 以表格形式展示某类型所有实体
        async showVertexs(collection,page){
            this.search = false;
            this.collection = collection;
            const { data:res } = await this.$http.get(this.domain_id+'/graph/'+this.graph_id+'/vertex/'+collection+'?page='+page+'&len=10');
            this.vertexs_list=res.data.vertex;
            this.vertex_nums =res.data.count;
            this.vertex_pages=parseInt(res.data.pages);
        },
        // 打开显示图谱编辑的对话框
        openDialog(maxDepth){
            this.$nextTick(() => {
                this.showEditGraph(maxDepth);
            });
        },
        // 展示以某实体为中心的图谱
        async showEditGraph(maxDepth){
            this.graph_nodes = []; // 节点数据初始化
            this.graph_links = []; // 关系数据初始化
            // 展示图谱
            if(this.graphVisible){
              const { data:res } = await this.$http.post(this.domain_id+'/graph/'+this.graph_id+'/traverse',
              {
                  startVertex:this.vertex._id,
                  direction:'any',
                  maxDepth:parseInt(maxDepth),
                  minDepth:0
              });
              
              var len=res.data.paths.length;
              // 每个path中包括1或2条边edges数组以及涉及到的节点vertices数组
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
                      };
                      if(links[k].length!=0 && JSON.stringify(this.graph_links).indexOf(JSON.stringify(relation))==-1)
                          this.graph_links.push(relation);
                  }
                        
                }
                // 节点数据格式
                // {"id": "persons/alice","_key": "alice","_rev": "_bukg8Sa---","name": "Alice"}
                this.graph_nodes.map(function(item){
                    return{
                        id:item._id
                    };
                });
                // 使用Echarts展示
                var myChart = echarts.init(this.$refs.graph);
                console.log(this.graph_nodes);
                console.log(this.graph_links);
                var option = {
                    title: {
                        text: '中心节点: ' + this.vertex.name
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
                            draggable: true,
                            force: {
                                repulsion: 2500,
                                edgeLength: [10, 50],
                                draggable:true
                            },
                            itemStyle: {//配置节点的颜色
                                normal: {
                                    color: function (params) {
                                        if (params.dataIndex == 0)
                                            return 'red';
                                        else{
                                            var colorList = ['yellow','orange', 'green', 'blue', 'gray'];
                                            return colorList[params.dataIndex % 6];
                                        }                                        
                                    },
                                }
                            },
                            symbolSize: function (value, params) {//改变节点大小
                                if (params.dataIndex == 0)
                                    return 60;
                                else
                                    return 40;
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
                                console.log(params.name);
                            }
                            else if (params.dataType == 'edge'){
                                console.log(params);
                            }
                        });
            }

            else if(this.editVisible){
              this.graph_links = [];
              const { data:result } = await this.$http.post(this.domain_id+'/graph/'+this.graph_id+'/neighbor',
              {
                  startVertex:this.vertex._id
              });
              var links=result.data;
              for(var i=0;i<links.length;i++){
                var link={};
                link['e1_type']=links[i]['_from'].split('/')[0];
                link['e1_name']=links[i]['_from_name'];
                link['e2_type']=links[i]['_to'].split('/')[0];
                link['e2_name']=links[i]['_to_name'];
                link['relation']=links[i]['_id'].split('/')[0];
                this.graph_links.push(link);
              }
              console.log(this.graph_links);
                // this.graph_links_sorted=[];
                // var relations=[];// 如 ['knows','love']
                // for(var i=0;i<this.graph_links.length;i++){
                //     var source_node = this.graph_links[i]['source'];
                //     if(source_node == this.vertex._id)//中心节点为source节点
                //         var from_or_to = 'target'; //待将target节点加入列表中
                //     else
                //         var from_or_to = 'source'; //待将source节点加入列表中
                //     var relation = this.graph_links[i]['id'].split('/')[0];
                //     var type_index = relations.indexOf(relation);
                //     if(type_index==-1){
                //         relations.push(relation); // 加入新关系类型
                //         this.graph_links_sorted.push({relation:relation,nodes:[]}); 
                //         // 加入新关系类型，及其相关节点列表 [{'knows':[{'BOB'},{'Alice'}]},{'love':[{'Kate'}]}]
                //     }
                //     type_index = relations.indexOf(relation);
                //     var link_id = this.graph_links[i]['id'];
                //     var node_type = this.graph_links[i][from_or_to].split('/')[0];
                //     var node_name = this.graph_links[i][from_or_to].split('/')[1];
                //     var node_deleteVisible;
                //     this.graph_links_sorted[type_index].nodes.push({link_id:link_id,from_or_to:from_or_to,node_name:node_name,node_type:node_type,node_id:this.graph_links[i][from_or_to],node_deleteVisible:false});
                // }
                const { data:res } = await this.$http.post(this.domain_id+'/graph/'+this.graph_id+'/neighbor',
                {
                    startVertex:this.vertex._id
                });
                
            }  
        },
        // 全屏显示知识图谱
        fullGraph(){
            this.fullscreen = true;
            var myChart = echarts.init(this.$refs.graph);
            myChart.resize({
                width: '1500px',
                height: '600px'
            });                 
        },
        // 关闭全屏
        closeFullScreen(){
            this.maxDepth=2;
            this.fullscreen=false;
            var myChart = echarts.init(this.$refs.graph);
            myChart.resize({
                width: '600px',
                height: '400px'
            });
        },
        // 添加中心节点
        async addNode(type){
            console.log(this.newVertex);
            const res = await this.$http.post(this.domain_id+'/graph/'+this.graph_id+'/vertex/'+type,this.newVertex);
            console.log(res);
            this.addVertexVisible=false;
        },
        // 添加新的关系类型------------未加后端
        async addRelation(){
            if(this.newRelation.relationRadio=='target')
                var param = {
                    from:this.vertex._id,
                    to:this.newRelation.node_id,
                    attribute:{}
                };
            else
                var param = {
                    from:this.newRelation.node_id,
                    to:this.vertex._id,
                    attribute:{}
                };
            const {data:res} = await this.$http.post(this.domain_id+'/graph/'+this.graph_id+'/edge/'+ this.newRelation.relationName,param);
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
            console.log(link_id);
            const {data:res} = await this.$http.delete(this.domain_id+'/graph/'+this.graph_id+'/edge/'+ link_id);
            console.log(res);
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
            this.showEditGraph('1');
        },
        // 为中心节点添加一条边（模糊搜索选已存在的节点）
        async addEdge(relation){
            var new_edge = {
                from:'',
                to:'',
                attribute:{}
            };
            if(this.newEdge.node_type == "from")
                new_edge = {
                    from: this.newEdge.node_id,
                    to: this.vertex._id,
                    attribute:{}
                };
            else
                new_edge = {
                    from: this.vertex._id,
                    to: this.newEdge.node_id,
                    attribute:{}
                };
            var {data:res} = await this.$http.post(this.domain_id+'/graph/'+this.graph_id+'/edge/'+ relation, new_edge);
            if(res.errno=="0"){
                this.$message({
                    showClose: true,
                    message: '添加新节点成功！',
                    type: 'success'
                });
                this.addNewEdgeVisible = false;
            }
            else{
                this.$message({
                    showClose: true,
                    message: '添加失败！',
                    type: 'error'
                });
            }
            this.showEditGraph('1');
        },
        // 模糊查找节点
        async querySearchAsync(queryString, cb) {
            var {data:results} = await this.$http.get(this.domain_id+'/graph/'+this.graph_id+'/vertex/like?'+ 'name=' + queryString + '&len=10');
            console.log(results.data);

            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                cb(results.data);
            }, 3000 * Math.random());
        },
        // 模糊查找后确定选择创建某条边 选择某个节点
        handleSelectNewEdge(item) {
            console.log(item);
            this.newEdge.node_id = item._id;
            console.log(this.newEdge);
        },
        // 模糊查找后确定选择创建某个新的关系类型 与某个节点
        handleSelectNewRelation(item){
            console.log(item);
            this.newRelation.node_id = item._id;
            console.log(this.newRelation);
        },
        // 模糊查询某个实体并以表格形式显示
        async searchVertex(){
            this.search = true;
            var {data:res} = await this.$http.get(this.domain_id+'/graph/'+this.graph_id+'/vertex/like?'+ 'name=' + this.searchVertexName + '&len=10');
            this.searchResults = res.data;
            for(var i=0;i<this.searchResults.length;i++){
                this.searchResults[i].collection= this.searchResults[i]._id.split('/')[0];
                this.searchResults[i].name = this.searchResults[i].value;
            }          
            this.searchLen = this.searchResults.length;
        },
        // 重命名中心实体名称
        async renameVertex(){
            console.log(this.vertex);
            var param={
                name:this.rename
            };
            console.log(typeof(param));
            var {data:results} = await this.$http.patch(this.domain_id+'/graph/'+this.graph_id+'/vertex/'+ this.vertex._id,param);
            console.log(results);
        },
        // 删除某个中心实体
        async deleteVertex(){
            var {data:res} = await this.$http.delete(this.domain_id+'/graph/'+this.graph_id+'/vertex/'+ this.vertex._id);
            console.log(res);
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
            this.showVertexs(this.collection,this.currentPage);
        },
        // 表格过滤器
        filterTag(value, row) {
        return row.tag === value;
        },
        filterHandler(value, row, column) {
          const property = column['property'];
          return row[property] === value;
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
