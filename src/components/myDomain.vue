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
                <el-button size="mini" style="margin-right: 5px;" @click="renameDialogVisible = true;rename.domain_id=scope.row.domain_id">编辑</el-button>
                <el-button size="mini" type="danger" @click="delDialogVisible = true;domain_id=scope.row.domain_id">删除</el-button>
            </template>
            </el-table-column>
        </el-table>
        <div>
            <el-button type="danger" style="margin-top: 20px;margin-left:10px;float:right;" @click="toggleSelection()">删除所选项</el-button>
            <el-button type="primary" style="margin-top: 20px;float:right;" @click="addDialogVisible = true">添加新领域</el-button>
            <el-button style="margin-top: 20px;float:left;" @click="toggleSelection()">取消全选</el-button>
        </div>
        <el-dialog
            title="删除提示"
            :visible.sync="delDialogVisible"
            width="30%"
        >
            <span>确认删除该领域？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteDomain(domain_id)">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="重命名该领域" :visible.sync="renameDialogVisible">
            <el-form :model="newDomain">
                <el-form-item label="输入新名称" :label-width="formLabelWidth">
                <el-input v-model="rename.name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="renameDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="renameDomain()">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="添加新领域" :visible.sync="addDialogVisible">
            <el-form :model="newDomain">
                <el-form-item label="输入新领域名称" :label-width="formLabelWidth">
                <el-input v-model="newDomain.name" autocomplete="off"></el-input>
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
        rename:{'domain_id':'','name':''},
        newDomain:{name:''},
        formLabelWidth: '120px',
        domain_id:'',
        domain_id_list:[]
        };
    },
    methods: {
        handleEdit(index, row) {
            console.log(index, row);
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        toggleSelection(rows) {
            if (rows) {
            rows.forEach(row => {
            });
            } else {
                console.log( this.$refs.multipleTable);
                this.$refs.multipleTable.clearSelection();
            }
        },
        async getDomainList (){
            const res = await this.$http.get('domain');
            this.domainList = res.data.data;
        },
        async addNewDomain (){
            const {data:res} = await this.$http.post('domain',this.newDomain);
            this.domainList = res.data;
            this.addDialogVisible = false;
            console.log(res);
            if (res.errno==="0"){
                this.$message({
                    showClose: true,
                    message: '添加新领域成功！',
                    type: 'success'
                });
            }
            else if (res.errno==="4003"){
                this.$message({
                    showClose: true,
                    message: '添加失败，该领域已存在！',
                    type: 'error'
                });
            }
            this.reload();
        },
        async renameDomain (){
            const {data:res} = await this.$http.post('rename_domain',this.rename);
            this.renameDialogVisible = false;
            console.log(res);
            if (res.errno==="0"){
                this.$message({
                    showClose: true,
                    message: '重命名成功！',
                    type: 'success'
                });
            }
            else if (res.errno==="4001"){
                this.$message({
                    showClose: true,
                    message: '修改失败，数据库异常！',
                    type: 'error'
                });
            }
            this.reload();
        },
        async deleteDomain(domain_id) {
            const {data:res} = this.$http.post('delete_domain',{'domain_id':domain_id});
            this.delDialogVisible = true;
            console.log(res);
            this.$message({
                showClose: true,
                message: '删除成功！',
                type: 'success'
            });
            this.reload();
        }
    },
};
</script>
