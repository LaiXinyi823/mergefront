<template>
  <el-container>
    <div v-if="opt == 'graphs'" style="width: 100%; height: 100%">
      选择查看某领域知识图谱：
      <el-select
        v-model="select_domain_id"
        placeholder="所有领域"
        clearable
        @change="get_my_graph_list"
        @clear="get_my_graph_list"
      >
        <el-option
          v-for="domain in domain_list"
          :key="domain.domain_id"
          :label="domain.domain_name"
          :value="domain.domain_id"
        />
      </el-select>
      <el-row :gutter="35">
        <!-- 原添加新图谱 -->
        <!-- <div
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
        </div> -->
        <el-col
          :span="4.5"
          v-for="graph in graph_list"
          :key="graph.graph_id"
          :offset="0"
        >
          <div
            @click="get_graph_detail(graph.graph_id)"
            style="margin-bottom: 5%"
          >
            <el-card
              shadow="hover"
              style="
                width: 200px;
                height: 200px;
                margin-bottom: 10px;
                margin-top: 10px;
              "
            >
              <el-image
                style="
                  width: 100px;
                  height: 100px;
                  margin-left: 20%;
                  margin-top: 5%;
                "
                src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3243406373,3135595743&fm=26&gp=0.jpg"
              />
              <h4>{{ graph.graph_name }}</h4>
            </el-card>
          </div>
        </el-col>
      </el-row>
      <el-dialog title="新增知识图谱" :visible.sync="addDialogVisible">
        <el-form :model="newGraph">
          <el-form-item label="知识图谱名称" :label-width="formLabelWidth">
            <el-input v-model="newGraph.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="所属领域名称" :label-width="formLabelWidth">
            <el-select v-model="newGraph.domain_id" placeholder="请选择">
              <el-option
                v-for="domain in domain_list"
                :key="domain.domain_id"
                :label="domain.domain_name"
                :value="domain.domain_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="图谱权限" :label-width="formLabelWidth">
            <el-radio v-model="newGraph.private" label="0"> 公开 </el-radio>
            <el-radio v-model="newGraph.private" label="1"> 私有 </el-radio>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false"> 取 消 </el-button>
          <el-button type="primary" @click="add_graph()"> 确 定 </el-button>
        </div>
      </el-dialog>
    </div>
    <div v-if="opt == 'get_graph_detail'" style="width: 100%; height: 100%">
      <el-card
        style="width: 100%; height: 65px; background-color: #fff"
        shadow="never"
      >
        <el-page-header
          @back="goBack()"
          :content="graph_name + ' 图谱详情'"
          style="float: left"
        />
        <div style="width: 20%; float: right">
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
      <div style="margin-top: 5px; background-color: #fff">
        <el-col :span="3">
          <el-button
            @click="addVertexVisible = true"
            size="mini"
            type="warning"
            icon="el-icon-star-off"
            style="
              margin-left: 10px;
              margin-right: 10px;
              margin-top: 10px;
              margin-bottom: 10px;
            "
            circle
          />添加实体类型
          <el-menu default-active="2" class="el-menu-vertical-demo">
            <el-menu-item>实体类型列表</el-menu-item>
            <el-menu-item
              v-for="collection in collections_list"
              :key="collection"
              :unique-opened="true"
              @click="show_graph_vertex(collection, 1)"
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
      <div style="margin-left: 130px; margin-top: 5px">
        <el-card shadow="never">
          <!-- 显示某类型下的所有实体 -->
          <div v-if="search == false" style="height: 100%; float: left">
            <el-button
              @click="addVertexVisible = true"
              size="mini"
              type="primary"
              icon="el-icon-plus"
              style="margin-left: 10px; margin-right: 10px; margin-bottom: 10px"
              circle
            />添加{{ collection }}节点
            <el-table
              :data="vertexs_list"
              border
              style="width: 100%"
              size="mini"
            >
              <el-table-column type="index" width="50" />
              <el-table-column prop="_id" label="ID" width="310" />
              <el-table-column prop="name" label="节点名称" width="310" />
              <el-table-column label="操作" width="400">
                <template slot-scope="scope">
                  <el-button
                    type="success"
                    icon="el-icon-picture"
                    circle
                    @click="
                      graphVisible = true
                      vertex = scope.row
                    "
                  />
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    circle
                    @click="
                      editVisible = true
                      vertex = scope.row
                    "
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
                      style="margin-left: 10px"
                      type="danger"
                      slot="reference"
                      icon="el-icon-delete"
                      circle
                      @click="vertex = scope.row"
                    />
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="block" style="margin-top: 10px; margin-left: 35%">
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
            <div style="margin-bottom: 10px">
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
              <el-table-column type="index" width="50" />
              <el-table-column prop="collection" label="节点类型" width="200" />
              <el-table-column prop="_id" label="ID" width="250" />
              <el-table-column prop="name" label="节点名称" width="250" />
              <el-table-column label="操作" width="320">
                <template slot-scope="scope">
                  <el-button
                    type="success"
                    icon="el-icon-picture"
                    circle
                    @click="
                      graphVisible = true
                      vertex = scope.row
                    "
                  />
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    circle
                    @click="
                      editVisible = true
                      vertex = scope.row
                    "
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
                      style="margin-left: 10px"
                      type="danger"
                      slot="reference"
                      icon="el-icon-delete"
                      circle
                      @click="vertex = scope.row"
                    />
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 添加新实体节点 -->
          <el-dialog title="添加新实体节点" :visible.sync="addVertexVisible">
            <el-form :model="newVertex">
              <el-form-item label="实体类型" :label-width="formLabelWidth">
                {{ collection }}
              </el-form-item>
              <el-form-item label="实体节点名称" :label-width="formLabelWidth">
                <el-input v-model="newVertex.name" autocomplete="off" />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="addVertexVisible = false"> 取 消 </el-button>
              <el-button type="primary" @click="addNode(collection)">
                确 定
              </el-button>
            </div>
          </el-dialog>
          <!-- 以中心节点方式展示图谱 -->
          <el-drawer
            title="图谱显示"
            :visible.sync="graphVisible"
            direction="rtl"
            size="60%"
            @opened="openDialog('1')"
            height="100%"
            @close="maxDepth"
          >
            <div
              style="
                width: 90%;
                height: 90%;
                margin-left: 20px;
                margin-right: 20px;
              "
            >
              <div
                id="graph"
                ref="graph"
                :style="{ width: '100%', height: '100%' }"
              />
            </div>
            <!-- 图中显示层数 -->
            <div style="margin-left: 40%; margin-top: 10px; bottom: 10px">
              显示层数：
              <el-select
                v-model="maxDepth"
                placeholder="1"
                size="mini"
                @change="showEditGraph(maxDepth)"
              >
                <el-option v-for="i in 5" :key="i" :label="i" :value="i" />
              </el-select>
            </div>
          </el-drawer>

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
              style="width: 95%; margin-left: 2%"
            >
              <el-table-column
                fixed="left"
                type="index"
                width="50"
              ></el-table-column>
              <el-table-column
                prop="e1_type"
                label="头节点类型"
                sortable
                width="180"
              ></el-table-column>
              <el-table-column
                prop="e1_name"
                label="头节点名"
                width="180"
              ></el-table-column>
              <el-table-column prop="relation" label="关系" width="180">
                <template slot-scope="scope">
                  <el-tag size="medium" type="success">{{
                    scope.row.relation
                  }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="e2_type"
                label="尾节点类型"
                width="180"
              ></el-table-column>
              <el-table-column
                prop="e2_name"
                label="尾节点名"
                width="180"
              ></el-table-column>
              <el-table-column fixed="right" label="操作" width="120">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click="scope.row.link_editVisible = true"
                    >编辑</el-button
                  >
                  <el-button
                    type="text"
                    size="small"
                    style="color: red"
                    @click="deleteEdge(scope.row.relation_id)"
                    >移除</el-button
                  >
                  <!-- 删除某一条边 -->
                  <el-dialog
                    title="提示"
                    :visible.sync="scope.row.link_deleteVisible"
                    width="30%"
                    center
                  >
                    <span
                      >您确定要删除这条关系数据吗？{{
                        scope.row.relation_id
                      }}</span
                    >
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="scope.row.link_deleteVisible = false"
                        >取 消</el-button
                      >
                      <el-button
                        type="primary"
                        @click="deleteEdge(scope.row.relation_id)"
                        >确 定</el-button
                      >
                    </span>
                  </el-dialog>

                  <!-- 编辑关系节点-drawer -->
                  <el-drawer
                    title="编辑数据"
                    :append-to-body="true"
                    :visible.sync="scope.row.link_editVisible"
                  >
                    <el-form label-width="200px" :model="newRelationData">
                      <el-form-item label="头节点实体">
                        <el-input
                          v-model="newRelationData.e1_name"
                          :placeholder="scope.row.e1_name"
                          style="width: 250px"
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="头节点实体类型">
                        <el-select
                          v-model="newRelationData.e1_type"
                          :placeholder="scope.row.e1_type"
                          style="width: 250px"
                        >
                          <el-option
                            v-for="collection in collections_list"
                            :key="collection"
                            :label="collection"
                            :value="collection"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="关系类型">
                        <el-select
                          v-model="newRelationData.relation"
                          :placeholder="scope.row.relation"
                          style="width: 250px"
                        >
                          <el-option
                            v-for="relation in relation_list"
                            :key="relation"
                            :label="relation"
                            :value="relation"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="尾节点实体">
                        <el-input
                          v-model="newRelationData.e2_name"
                          :placeholder="scope.row.e2_name"
                          style="width: 250px"
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="尾节点实体类型">
                        <el-select
                          v-model="newRelationData.e2_type"
                          :placeholder="scope.row.e2_type"
                          style="width: 250px"
                        >
                          <el-option
                            v-for="collection in collections_list"
                            :key="collection"
                            :label="collection"
                            :value="collection"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" @click="editData()"
                          >确认修改</el-button
                        >
                      </el-form-item>
                    </el-form>
                  </el-drawer>
                </template>
              </el-table-column>
            </el-table>
            <el-divider><i class="el-icon-s-operation"></i></el-divider>
            <el-button
              type="success"
              icon="el-icon-edit"
              style="margin-left: 2%"
              @click="renameVertexVisible = true"
              >重命名该中心节点: {{ vertex.name }}</el-button
            >
            <!-- 重命名中心节点名称 -->
            <el-drawer
              :title="'编辑数据——中心节点：' + vertex.name"
              :append-to-body="true"
              :visible.sync="renameVertexVisible"
            >
              <el-form style="margin-left: 10%">
                <el-form-item label="原名称" label-width="100px">
                  {{ vertex.name }}
                </el-form-item>
                <el-form-item label="新名称" label-width="100px">
                  <el-input v-model="rename" style="width: 60%" />
                </el-form-item>
                <el-form-item label-width="100px">
                  <el-button type="primary" @click="renameVertex()"
                    >确 定</el-button
                  >
                  <el-button @click="renameVertexVisible = false"
                    >取 消</el-button
                  >
                </el-form-item>
              </el-form>
            </el-drawer>
            <el-button
              type="primary"
              icon="el-icon-plus"
              style="margin-left: 2%"
              @click="addNewEdgeVisible = true"
              >新增关系节点</el-button
            >
            <!-- 新增关系节点-drawer -->
            <el-drawer
              :title="'编辑数据——中心节点：' + vertex.name"
              :append-to-body="true"
              :visible.sync="addNewEdgeVisible"
            >
              <el-divider><i class="el-icon-star-on"></i></el-divider>
              <!-- 模糊查询选择要添加的节点 -->
              <el-form
                ref="form"
                :model="newEdge"
                label-width="180px;"
                style="margin-left: 10%"
              >
                <el-form-item label="选择节点" prop="resource">
                  <el-autocomplete
                    v-model="newEdge.name"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入内容"
                    @select="handleSelectNewEdge"
                    style="width: 60%"
                  />
                </el-form-item>
                <el-form-item label="选择关系">
                  <el-select
                    v-model="newEdge.relation"
                    placeholder="请选择关系类型"
                    style="width: 60%"
                  >
                    <el-option
                      v-for="relation in relation_list"
                      :key="relation"
                      :label="relation"
                      :value="relation"
                    ></el-option>
                  </el-select>
                  <el-button
                    type="primary"
                    icon="el-icon-plus"
                    style="margin-left: 10px"
                    circle
                    @click="addRelationVisible = true"
                  ></el-button>
                </el-form-item>
                <el-form-item label="节点类型">
                  <el-radio-group v-model="newEdge.node_type">
                    <el-radio v-model="newEdge.node_type" label="from"
                      >起始节点</el-radio
                    >
                    <el-radio v-model="newEdge.node_type" label="to"
                      >终点节点</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="addEdge(newEdge.relation)"
                    >确认添加</el-button
                  >
                </el-form-item>
              </el-form>
            </el-drawer>
          </el-drawer>

          <!-- 为中心实体创建新的关系类型  -->
          <el-dialog
            title="新增关系类型"
            :visible.sync="addRelationVisible"
            style="width: 50%; margin: 0 auto"
          >
            <el-form :model="newRelation">
              <el-form-item label="关系类型名称" label-width="100px">
                <el-input
                  v-model="newRelation.relationName"
                  autocomplete="off"
                />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="addRelationVisible = false">取 消</el-button>
              <el-button type="primary" @click="addRelation()">确 定</el-button>
            </div>
          </el-dialog>

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
import * as echarts from 'echarts'
export default {
  created() {
    this.get_my_graph_list()
    this.getMyDomainList()
  },
  data() {
    return {
      opt: 'graphs',
      graph_id: '',
      search: '',
      graph_name: '',
      graph_list: [],
      domain_list: [],
      relation_list: [],
      collections_list: [], // 所有实体类型列表
      domain_id: '', // 被选中图谱的domain_id
      collection: '', // 当前所选择的实体类型
      vertex: {}, // 当前所选节点
      vertexs_list: [], // 某一类下所有实体列表
      vertex_nums: 0, // 实体列表包含的实体数
      vertex_pages: 0, // 包含页数，以8条为一页
      currentPage: 1, // 当前页数
      graph_nodes: [], // 展示图所涉及到的节点数据
      graph_links: [], // 展示图所涉及到的关系数据
      graph_categories: [], // 节点数据类型
      maxDepth: 1, // 图谱层数，默认为1
      select_domain_id: '',
      table: 'false',
      newGraph: {
        name: '',
        private: '0',
        domain_id: '',
      },
      newVertex: {
        name: '',
        attr_1: 'test',
      },
      newRelation: {
        relationName: '',
        node_id: '',
        name: '',
        relationRadio: '',
      },
      newEdge: {
        node_id: '',
        name: '',
        node_type: '',
        relation: '',
      },
      newRelationData: {
        e1_id: '',
        e1_type: '',
        e1_name: '',
        e2_id: '',
        e2_type: '',
        e2_name: '',
        relation_id: '',
        relation: '',
      },
      myChart: {},
      searchEdges: [],
      rename: '',
      formLabelWidth: '120px',
      searchVertexName: '',
      graphVisible: false,
      editVisible: false,
      deleteNodeVisible: false,
      addVertexVisible: false,
      addRelationVisible: false,
      addDialogVisible: false,
      addNewEdgeVisible: false,
      renameVertexVisible: false,
      innerDrawer: false,
      fullscreen: false,
      timeout: null,
      search: false, // 当用户启用在graph_detail界面搜索某节点为true
      searchResults: [], // 用户搜索的实体节点结果
      searchLen: 0,
    }
  },
  methods: {
    // 获取我的图谱
    async get_my_graph_list(value) {
      console.log(value)
      if (value == undefined) {
        var res = await this.$http.get('/graph/')
      } else {
        var res = await this.$http.get('/graph?domain=' + value)
      }
      this.graph_list = res.data.data
    },
    // 添加图谱
    async add_graph() {
      try {
        const { data: res } = await this.$http.post('graph/', {
          name: this.newGraph.name,
          domain_id: this.newGraph.domain_id,
          private: parseInt(this.newGraph.private),
        })

        this.$message({
          showClose: true,
          message: '添加知识图谱成功！',
          type: 'success',
        })
        this.addDialogVisible = false
      } catch (err) {
        this.$message({
          showClose: true,
          message: '添加知识图谱失败',
          type: 'error',
        })
        this.addDialogVisible = false
        this.reload()
      }
    },
    // 查看图谱详情
    async get_graph_detail(graph_id) {
      this.opt = 'get_graph_detail'
      this.graph_id = graph_id
      // 获取所有关系类型
      const { data: res } = await this.$http.get('graph/' + this.graph_id)
      this.relation_list = res.data.edges
      // 传入graph_id，get图中所涉及的实体类型
      this.collections_list = res.data.collections
      this.collection = this.collections_list[0]
      this.show_graph_vertex(this.collection, 1)
    },
    // 获取我的领域列表
    async getMyDomainList() {
      const { data: res } = await this.$http.get('domain')
      this.domain_list = res.data
    },
    // 详情界面返回函数
    goBack() {
      this.opt = 'graphs'
    },
    // 翻页
    changePage: function (currentPage) {
      this.currentPage = currentPage
      this.show_graph_vertex(this.collection, this.currentPage)
    },
    // 以表格形式展示某类型所有实体
    async show_graph_vertex(collection, page) {
      this.search = false
      this.collection = collection
      const { data: res } = await this.$http.get('graph/'+this.graph_id +'/vertex/'+collection +'?page='+page +'&len=10')
      console.log(res.data)
      this.vertexs_list = res.data.vertex
      this.vertex_nums = res.data.count
      this.vertex_pages = parseInt(res.data.pages)
    },
    // 打开显示图谱编辑的对话框
    openDialog(maxDepth) {
      this.$nextTick(() => {
        this.showEditGraph(maxDepth)
      })
    },
    // 展示以某实体为中心的图谱
    async showEditGraph(maxDepth) {
      this.graph_nodes = [] // 节点数据初始化
      this.graph_links = [] // 关系数据初始化
      this.graph_categories = [] //  关系类型初始化
      // 展示图谱
      if (this.graphVisible) {
        this.myChart = echarts.init(this.$refs.graph)
        this.myChart.showLoading()
        const { data: res } = await this.$http.post(
          this.domain_id + '/graph/' + this.graph_id + '/traverse',
          {
            startVertex: this.vertex._id,
            direction: 'any',
            maxDepth: parseInt(maxDepth),
            minDepth: 0,
          }
        )

        var len = res.data.paths.length
        // 每个path中包括1或2条边edges数组以及涉及到的节点vertices数组
        for (var i = 0; i < len; i++) {
          var vertices = res.data.paths[i].vertices
          var links = res.data.paths[i].edges
          var v_len = vertices.length
          var l_len = links.length
          // 获取节点数据
          for (var j = 0; j < v_len; j++) {
            vertices[j]['id'] = vertices[j]['_id']
            delete vertices[j]['_id']
            var category = { name: vertices[j]['id'].split('/')[0] }
            if (
              JSON.stringify(this.graph_categories).indexOf(
                JSON.stringify(category)
              ) > -1
            ) {
            } else {
              this.graph_categories.push(category)
            }
            vertices[j]['category'] = this.graph_categories.findIndex(
              (item) => item.name === category.name
            )
            console.log(vertices[j]['category'])
            if (
              JSON.stringify(this.graph_nodes).indexOf(
                JSON.stringify(vertices[j])
              ) > -1
            ) {
            } else {
              this.graph_nodes.push(vertices[j]) // 得到与中心实体相关的所有实体
            }
          }
          console.log(this.graph_nodes)
          console.log(this.graph_categories)
          // 获取关系数据
          // 关系数据格式
          // { "source": "persons/alice","id": "knows/247922","target": "persons/bob"}
          for (var k = 0; k < l_len; k++) {
            var relation = {
              id: links[k]._id,
              source: links[k]._from,
              target: links[k]._to,
            }
            if (
              links[k].length != 0 &&
              JSON.stringify(this.graph_links).indexOf(
                JSON.stringify(relation)
              ) == -1
            )
              this.graph_links.push(relation)
          }
        }
        // 节点数据格式
        // {"id": "persons/alice","_key": "alice","_rev": "_bukg8Sa---","name": "Alice"}
        this.graph_nodes.map(function (item) {
          return {
            id: item._id,
          }
        })
        // 使用Echarts展示
        this.myChart.hideLoading()
        var option = {
          title: {
            text: '中心节点: ' + this.vertex.name,
            subtext: 'Default layout',
            top: 'bottom',
            left: 'leftt',
          },
          tooltip: {},
          animationDurationUpdate: 1500,
          animationEasingUpdate: 'quinticInOut',
          legend: [
            {
              // selectedMode: 'single',
              data: this.graph_categories.map(function (a) {
                return a.name
              }),
            },
          ],
          color: [
            '#ee6666',
            '#91cc75',
            '#fac858',
            '#fc8452',
            '#9a60b4',
            '#ea7ccc',
            '#ca8622',
            '#bda29a',
            '#6e7074',
            '#546570',
            '#c4ccd3',
          ],

          series: [
            {
              type: 'graph',
              layout: 'force',
              symbolSize: 50,
              roam: true,
              // draggable: true,
              hoverAnimation: true,
              notMerge: true,
              force: {
                repulsion: 2500,
                edgeLength: [20, 50],
                draggable: true,
                layoutAnimation: true,
              },
              // itemStyle: {//配置节点的颜色
              //     normal: {
              //         color: function (params) {
              //             if (params.dataIndex == 0)
              //                 return 'red';
              //             else{
              //                 // var colorList = ['yellow','orange', 'green', 'blue', 'gray'];
              //                 // return colorList[params.dataIndex % 6];
              //             }
              //         },
              //     }
              // },
              symbolSize: function (value, params) {
                //改变节点大小
                if (params.dataIndex == 0) return 80
                else return 40
              },
              label: {
                show: true,
              },
              edgeSymbol: ['circle', 'arrow'],
              edgeSymbolSize: [4, 10],
              edgeLabel: {
                fontSize: 20,
              },
              nodes: this.graph_nodes, // 节点数据
              links: this.graph_links, // 关系数据
              categories: this.graph_categories, // 节点数据类型
              edgeLabel: {
                //边的标签设置
                show: true,
                // position: "middle",
                fontSize: 12,
                formatter: (params) => {
                  return params.data.id.split('/')[0]
                },
              },
              lineStyle: {
                opacity: 0.9,
                width: 2,
                curveness: 0,
                // color:'source'
              },
            },
          ],
        }
        //节点拖拽固定
        this.myChart.on('mouseup', function (params) {
          var option = myChart.getOption()
          option.series[0].data[params.dataIndex].x = params.event.offsetX
          option.series[0].data[params.dataIndex].y = params.event.offsetY
          option.series[0].data[params.dataIndex].fixed = true
          this.myChart.setOption(option)
        })
        this.myChart.setOption(option)
        // window.onresize = function () {
        //   this.myChart.resize();
        // }
        //点击事件
        // this.myChart.on('click', function (params) {
        //     if (params.dataType == 'node') {
        //         console.log(params.name);
        //     }
        //     else if (params.dataType == 'edge'){
        //         console.log(params);
        //     }
        // });
      } else if (this.editVisible) {
        this.graph_links = []
        const { data: result } = await this.$http.post(
          this.domain_id + '/graph/' + this.graph_id + '/neighbor',
          {
            startVertex: this.vertex._id,
          }
        )
        var links = result.data
        for (var i = 0; i < links.length; i++) {
          var link = {}
          link['e1_id'] = links[i]['_from']
          link['e1_type'] = links[i]['_from'].split('/')[0]
          link['e1_name'] = links[i]['_from_name']
          link['e2_id'] = links[i]['_to']
          link['e2_type'] = links[i]['_to'].split('/')[0]
          link['e2_name'] = links[i]['_to_name']
          link['relation_id'] = links[i]['_id']
          link['relation'] = links[i]['_id'].split('/')[0]
          link['link_deleteVisible'] = false
          link['link_editVisible'] = false
          this.graph_links.push(link)
        }
      }
    },
    // 全屏显示知识图谱
    fullGraph() {
      this.fullscreen = true
      var myChart = echarts.init(this.$refs.graph)
      myChart.resize({
        width: '1500px',
        height: '600px',
      })
    },
    // 添加中心节点
    async addNode(type) {
      const res = await this.$http.post(
        this.domain_id + '/graph/' + this.graph_id + '/vertex/' + type,
        this.newVertex
      )
      this.addVertexVisible = false
    },
    // 添加新的关系类型------------未加后端
    async addRelation() {
      if (this.newRelation.relationRadio == 'target')
        var param = {
          from: this.vertex._id,
          to: this.newRelation.node_id,
          attribute: {},
        }
      else
        var param = {
          from: this.newRelation.node_id,
          to: this.vertex._id,
          attribute: {},
        }
      const { data: res } = await this.$http.post(
        this.domain_id +
          '/graph/' +
          this.graph_id +
          '/edge/' +
          this.newRelation.relationName,
        param
      )
      if (res.errno == '0') {
        this.$message({
          showClose: true,
          message: '添加新关系类型成功！',
          type: 'success',
        })
      } else {
        this.$message({
          showClose: true,
          message: '添加失败！',
          type: 'error',
        })
      }
      this.addRelationVisible = false
      this.showEditGraph()
      this.editVisible = true
    },
    // 删除与中心节点有关的某个节点（删除二者关系）
    deleteEdge(link_id) {
      this.$confirm('此操作将永久删除该关系, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          console.log('delete')
          this.$http
            .delete(
              this.domain_id + '/graph/' + this.graph_id + '/edge/' + link_id
            )
            .then((res) => {
              if (res.data.errno == '0') {
                this.$message({
                  showClose: true,
                  message: '删除节点成功！',
                  type: 'success',
                })
              } else {
                this.$message({
                  showClose: true,
                  message: '删除失败！',
                  type: 'error',
                })
              }
              this.deleteNodeVisible = false
              this.showEditGraph('1')
            })
        })
        .catch(() => {
          console.log('cancel')
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 为中心节点添加一条边（模糊搜索选已存在的节点）
    async addEdge(relation) {
      var new_edge = {
        from: '',
        to: '',
        attribute: {},
      }
      if (this.newEdge.node_type == 'from')
        new_edge = {
          from: this.newEdge.node_id,
          to: this.vertex._id,
          attribute: {},
        }
      else
        new_edge = {
          from: this.vertex._id,
          to: this.newEdge.node_id,
          attribute: {},
        }
      var { data: res } = await this.$http.post(
        this.domain_id + '/graph/' + this.graph_id + '/edge/' + relation,
        new_edge
      )
      if (res.errno == '0') {
        this.$message({
          showClose: true,
          message: '添加新节点成功！',
          type: 'success',
        })
        this.addNewEdgeVisible = false
      } else {
        this.$message({
          showClose: true,
          message: '添加失败！',
          type: 'error',
        })
      }
      this.showEditGraph('1')
    },
    // 模糊查找节点
    async querySearchAsync(queryString, cb) {
      var { data: results } = await this.$http.get(
        this.domain_id +
          '/graph/' +
          this.graph_id +
          '/vertex/like?' +
          'name=' +
          queryString +
          '&len=10'
      )
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results.data)
      }, 3000 * Math.random())
    },
    // 模糊查找后确定选择创建某条边 选择某个节点
    handleSelectNewEdge(item) {
      this.newEdge.node_id = item._id
    },
    // 模糊查找后确定选择创建某个新的关系类型 与某个节点
    handleSelectNewRelation(item) {
      this.newRelation.node_id = item._id
    },
    // 模糊查询某个实体并以表格形式显示
    async searchVertex() {
      this.search = true
      var { data: res } = await this.$http.get(
        this.domain_id +
          '/graph/' +
          this.graph_id +
          '/vertex/like?' +
          'name=' +
          this.searchVertexName +
          '&len=10'
      )
      this.searchResults = res.data
      for (var i = 0; i < this.searchResults.length; i++) {
        this.searchResults[i].collection = this.searchResults[i]._id.split(
          '/'
        )[0]
        this.searchResults[i].name = this.searchResults[i].value
      }
      this.searchLen = this.searchResults.length
    },
    // 重命名中心实体名称
    async renameVertex() {
      var param = {
        name: this.rename,
      }
      var { data: res } = await this.$http.patch(
        this.domain_id +
          '/graph/' +
          this.graph_id +
          '/vertex/' +
          this.vertex._id,
        param
      )
      if (res.errno == '0') {
        this.$message({
          showClose: true,
          message: '重命名成功！',
          type: 'success',
        })
        this.addNewEdgeVisible = false
      } else {
        this.$message({
          showClose: true,
          message: '重命名失败！',
          type: 'error',
        })
      }
      this.renameVertexVisible = false
      this.editVisible = false
      this.show_graph_vertex(this.collection, this.currentPage)
    },
    // 删除某个中心实体
    async deleteVertex() {
      var { data: res } = await this.$http.delete(
        this.domain_id +
          '/graph/' +
          this.graph_id +
          '/vertex/' +
          this.vertex._id
      )
      if (res.errno == '0') {
        this.$message({
          showClose: true,
          message: '删除节点成功！',
          type: 'success',
        })
      } else {
        this.$message({
          showClose: true,
          message: '删除失败！',
          type: 'error',
        })
      }
      this.show_graph_vertex(this.collection, this.currentPage)
    },
    // 表格过滤器
    filterTag(value, row) {
      return row.tag === value
    },
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    // 图谱数据更改
    editData() {},
  },
}
</script>

<style>
#graph {
  width: 100%;
  height: 300px;
}

.icon-block {
  width: 100px;
  height: 80px;
}

.el-card-define >>> .el-card__body {
  height: 100%;
}

.cardImg {
  height: 50%;
  width: 50%;
}

.myGraph {
  width: 100%;
}
.switch {
  float: right;
}
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
