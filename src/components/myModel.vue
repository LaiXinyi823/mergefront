<template>
    <div>
        <!-- 选择模型类型 -->
        <div style="margin-bottom:10px">
            选择模型类型：
            <el-select v-model="model_type" placeholder="全部模型" @change="getModellist()">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </div>
        <!-- 模型列表 -->
        <el-table 
        :data="model_list"
        style="width: 100%;">
            <el-table-column
            label="模型ID"
            width="120">
            <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.model_id }}</span>
            </template>
            </el-table-column>
            <el-table-column
            label="模型类型"
            width="180">
            <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                    <el-tag v-if="scope.row.model_type==0" size="medium">标注模型</el-tag>
                    <el-tag v-else size="medium" type="success">融合模型</el-tag>
                </div>
            </template>
            </el-table-column>
            <el-table-column
            label="模型名称"
            width="180">
            <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.model_name }}</span>
            </template>
            </el-table-column>
            <el-table-column
            label="模型url"
            width="300">
            <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.model_url }}</span>
            </template>
            </el-table-column>
            <el-table-column
            label="描述"
            width="300">
            <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.model_discription }}</span>
            </template>
            </el-table-column>
            <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button
                size="mini"
                @click="editDialogVisible=true,current_model=scope.row,update_model=scope.row">编辑</el-button>
                <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row.model_id)">删除</el-button>
            </template>
            </el-table-column>
        </el-table> 
        <!-- 分页 -->
        <!-- <div class="block" style="margin-top:2%;margin-left:10%;margin-left:35%">
            <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-size="10"
                layout="total, prev, pager, next, jumper"
                :total="totalPage">
            </el-pagination>
        </div> -->
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
                <el-form-item label="模型类型" :label-width="formLabelWidth">
                <el-select v-model="new_model.type" placeholder="请选择">
                    <el-option
                        v-for="item in new_model_type"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="模型url" :label-width="formLabelWidth">
                <el-input v-model="new_model.url" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="权限" :label-width="formLabelWidth">
                    <el-radio-group v-model="new_model.private">
                    <el-radio :label="true">私有</el-radio>
                    <el-radio :label="false">公开</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="new_model.discription"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addModel()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑模型-对话框 -->
        <el-dialog title="编辑模型信息" :visible.sync="editDialogVisible" style="width:50%;margin:0 auto">
            <el-form :model="update_model">
                <el-form-item label="模型名称" :label-width="formLabelWidth">
                <el-input v-model="update_model.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="模型类型" :label-width="formLabelWidth">
                <el-select v-if="current_model.model_type==0" v-model="update_model.type" placeholder="标注模型">
                    <el-option
                        v-for="item in new_model_type"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-else v-model="update_model.type" placeholder="融合模型">
                    <el-option
                        v-for="item in new_model_type"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="模型url" :label-width="formLabelWidth">
                <el-input v-model="update_model.url" :placeholder="current_model.model_url" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="权限" :label-width="formLabelWidth">
                    <el-radio-group v-model="update_model.private">
                    <el-radio :label="true">私有</el-radio>
                    <el-radio :label="false">公开</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="update_model.discription" :placeholder="current_model.model_discription"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleEdit()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

export default {
    inject:['reload'],
    data(){
        return{
            options:[{label:'标注模型',value:'/annotation'},{label:'融合模型',value:'/fusion'},{label:'全部模型',value:''}],
            new_model_type:[{label:'标注模型',value:0},{label:'融合模型',value:1}],
            model_type:'',
            formLabelWidth:'100px',
            model_list:[],
            currentPage:1,
            totalPage:1,
            addDialogVisible:false,
            editDialogVisible:false,
            new_model:{type:'',name:'',url:'',private:true,discription:''},
            update_model:{type:'',name:'',url:'',private:true,discription:''},
            current_model:{}
        }
    },
    created(){
        this.getModellist();
    },
    methods:{
        // 获取模型列表
        async getModellist(){
            const {data:res} = await this.$http.get('model'+this.model_type);
            this.model_list=res.data;
        },
        // 添加新的模型
        async addModel(){
            console.log(this.new_model);
            const {data:res} = await this.$http.post('model',this.new_model);
            console.log(res);
            this.addDialogVisible = false;
            if(res.message=="Create model succeed."){
                this.$message({
                    showClose: true,
                    message: '添加新模型成功！',
                    type: 'success'
                });
            }
            else if(res.message=="Model already exist."){
                this.$message({
                    showClose: true,
                    message: '该模型已存在！',
                    type: 'error'
                });
            }
            this.getModellist();
        },
        // 更新选中模型
        handleEdit(){
            console.log(this.current_model)
            console.log(this.update_model)
        },
        // 删除选中模型
        handleDelete(model_id){
            this.$confirm('确定删除该模型？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(async() => {
                    console.log(model_id)
                    const {data:res} = await this.$http.delete('model/'+model_id);
                    console.log(res);
                    if(res.message=="Delete model succeed."){
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getModellist();
                    }                  
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


