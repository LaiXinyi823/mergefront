<template>
    <div>
        <el-table ref="multipleTable" :data="domainList" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="ID" prop="domain_id"> </el-table-column>
            <el-table-column label="领域名称" prop="domain_name"> </el-table-column>
            <!-- <el-table-column label="操作权限" prop="name"> </el-table-column> -->
            <el-table-column align="right">
            <template slot="header">
                <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
            </template>
            <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
            </el-table-column>
        </el-table>
        <div>
            <el-button style="margin-top: 20px;float:left;" @click="dialogFormVisible = true">添加新领域</el-button>
            <el-button style="margin-top: 20px;float:right;" @click="toggleSelection()">取消全选</el-button>
        </div>
        <el-dialog title="添加新领域" :visible.sync="dialogFormVisible">
            <el-form :model="newDomain">
                <el-form-item label="输入新领域名称" :label-width="formLabelWidth">
                <el-input v-model="newDomain.name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addNewDomain()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
  created (){
      this.getDomainList();
  },
  data() {
    return {
      domainList:[],
      search: '',
      multipleSelection: [],
      dialogFormVisible: false,
      newDomain:{name:''},
      formLabelWidth: '120px'
    };
  },
  methods: {
    handleEdit(index, row) {
        console.log(index, row);
    },
    handleDelete(index, row) {
        console.log(index, row);
    },
    handleSelectionChange(val) {
        this.multipleSelection = val;
    },
    toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
    },
    async getDomainList (){
        const res = await this.$http.get('list_domain');
        this.domainList = res.data.data;
        console.log(res);
    },
    async addNewDomain (){
        const {data:res} = await this.$http.post('add_domain',this.newDomain);
        this.domainList = res.data;
        console.log(res.data);
        this.dialogFormVisible = false;
        this.$router.push('/home');
    }
  },
};
</script>
