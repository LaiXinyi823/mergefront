<template>
    <div style="background:white">
        <!-- 模型列表 -->
        <el-table 
        :data="model_list"
        style="width: 100%;">
            <el-table-column
            label="模型ID"
            width="120">
            <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.ID }}</span>
            </template>
            </el-table-column>
            <el-table-column
            label="模型类型"
            width="180">
            <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                    <el-tag v-if="scope.row.type=='默认'" size="medium">{{ scope.row.type }}</el-tag>
                    <el-tag v-else size="medium" type="success">{{ scope.row.type }}</el-tag>
                </div>
            </template>
            </el-table-column>
            <el-table-column
            label="模型名称"
            width="180">
            <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.name }}</span>
            </template>
            </el-table-column>
            <el-table-column
            label="模型url"
            width="300">
            <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.url }}</span>
            </template>
            </el-table-column>
            <el-table-column
            label="描述"
            width="300">
            <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.desc }}</span>
            </template>
            </el-table-column>
            <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button
                size="mini"
                @click="editDialogVisible=true,current_model=scope.row">编辑</el-button>
                <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
            </el-table-column>
        </el-table> 
        <!-- 分页 -->
        <div class="block" style="margin-top:2%;margin-left:10%;margin-left:35%">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-size="10"
                layout="total, prev, pager, next, jumper"
                :total="totalPage">
            </el-pagination>
        </div>
        <div>
        <el-button type="primary" style="margin-top: 20px;float:left;" @click="addDialogVisible = true">
            添加新模型
        </el-button>
        </div>
        <!-- 添加新模型-对话框 -->
        <el-dialog title="添加新模型" :visible.sync="addDialogVisible" style="width:50%;margin:0 auto">
            <el-form :model="new_model">
                <el-form-item label="模型名称" :label-width="formLabelWidth">
                <el-input v-model="new_model.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="模型url" :label-width="formLabelWidth">
                <el-input v-model="new_model.url" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="new_model.desc"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑模型-对话框 -->
        <el-dialog title="编辑模型信息" :visible.sync="editDialogVisible" style="width:50%;margin:0 auto">
            <el-form :model="current_model">
                <el-form-item label="模型名称" :label-width="formLabelWidth">
                <el-input v-model="current_model.name" :placeholder="current_model.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="模型url" :label-width="formLabelWidth">
                <el-input v-model="current_model.url" :placeholder="current_model.url" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="current_model.desc" :placeholder="current_model.desc"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

export default {
   data(){
       return{
        formLabelWidth:'100px',
        model_list:[{ID:'1',name:'模型1',url:'http:1232434343',type:'默认',desc:'一个模型'},{ID:'2',name:'模型2',url:'http:1232434343',type:'自定义',desc:'一个模型'}],
        currentPage:1,
        totalPage:1,
        addDialogVisible:false,
        editDialogVisible:false,
        new_model:{ID:'',name:'',url:'',desc:''},
        current_model:{}
       }
   },
   methods:{
       handleEdit(index, row){

       },
       handleDelete(index, row){
            this.$confirm('确定删除该模型？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
                });
            },

   }
}
</script>


