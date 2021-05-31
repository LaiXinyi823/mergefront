<template>
  <div style="margin:0 auto">
    <el-table :data="domainList" style="width: 100%;">
      <el-table-column type="index" width="200">
      </el-table-column>
      <el-table-column label="领域ID" width="300">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.domain_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="领域名称" width="300">
        <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.domain_name }}</el-tag>
            </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="renameDialogVisible = true;domain_id=scope.row.domain_id">重命名</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="delDialogVisible = true;domain_id=scope.row.domain_id">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="float:left">
      <el-button type="primary" style="margin-top: 20px;" @click="addDialogVisible = true">添加新领域</el-button>
    </div>
    <!-- 删除某领域 -->
    <el-dialog title="删除提示" :visible.sync="delDialogVisible" width="30%">
      <span>确认删除该领域？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="danger" @click="deleteDomain()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 重命名该领域 -->
    <el-dialog title="重命名该领域" :visible.sync="renameDialogVisible" style="width:40%">
      <el-form :model="newDomain">
        <el-form-item label="输入新名称" :label-width="formLabelWidth">
          <el-input v-model="rename.name" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="renameDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="renameDomain()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加新领域 -->
    <el-dialog title="添加新领域" :visible.sync="addDialogVisible" style="width:40%;margin:0 auto">
      <el-form :model="newDomain">
        <el-form-item label="输入新领域名称" :label-width="formLabelWidth">
          <el-input v-model="newDomain.name" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewDomain()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
    inject:['reload'],
    created (){
        this.getDomainList();
    },
    data() {
        return {
        domainList:[],
        search: '',
        multipleSelection: [],
        renameDialogVisible: false,
        addDialogVisible: false,
        delDialogVisible: false,
        rename:{'name':''},
        newDomain:{name:''},
        formLabelWidth: '120px',
        domain_id:0,
        domain_id_list:[]
        };
    },
    methods: {
      // 获取领域列表
      async getDomainList (){
        const res = await this.$http.get('domain');
        this.domainList = res.data.data;
      },
      // 添加新的领域
      async addNewDomain (){
        const {data:res} = await this.$http.post('domain',this.newDomain);
        this.domainList = res.data;
        this.addDialogVisible = false;
        if (res.message==="Create domain succeed."){
            this.$message({
                showClose: true,
                message: '添加新领域成功！',
                type: 'success'
            });
        }
        else{
            this.$message({
                showClose: true,
                message: '添加失败，该领域已存在！',
                type: 'error'
            });
        }
        this.reload();
      },
      // 重命名领域名称
      async renameDomain (){
        const {data:res} = await this.$http.patch('domain/'+this.domain_id,this.rename);
        this.renameDialogVisible = false;
        if (res.message==="Updata domain succeed."){
            this.$message({
                showClose: true,
                message: '重命名成功！',
                type: 'success'
            });
        }
        else{
            this.$message({
                showClose: true,
                message: '修改失败，数据库异常！',
                type: 'error'
            });
        }
        this.reload();
      },
      // 删除领域
      async deleteDomain() {
        console.log(this.domain_id);
        const res= this.$http.delete('domain/'+this.domain_id);
        this.$message({
            showClose: true,
            message: '删除该领域成功！',
            type: 'success'
        });
        this.reload();
      }
    },
};
</script>
