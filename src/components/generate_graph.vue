<template>
    <el-container>
        <div style="width: 100%; height: 100%;">
            <el-card style="width: 100%; height: 100%;">
                <el-divider content-position="left" style="margin-bottom:20px;">知识图谱构建</el-divider>
                <el-form ref="form" :model="newGraph" label-width="120px" style="width:30%;margin:0 auto">
                    <el-form-item label="图谱名称" style="width:91%">
                        <el-input v-model="newGraph.name"></el-input>
                    </el-form-item>
                    <el-form-item label="头节点类型" style="width:91%">
                        <el-input v-model="newGraph.e1_type"></el-input>
                    </el-form-item>
                    <el-form-item label="尾节点类型" style="width:91%">
                        <el-input v-model="newGraph.e2_type"></el-input>
                    </el-form-item>
                    <el-form-item label="关系类型" style="width:91%">
                        <el-input v-model="newGraph.relation_type"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="选择数据集" >
                        <el-select v-model="new_graph.data_id" placeholder="请选择三元组数据">
                        <el-option
                            v-for="data in triple_data_list"
                            :key="data.data_id"
                            :label="data.data_name"
                            :value="data.data_id"
                            />
                        </el-select>
                    </el-form-item> -->
                    <!-- <el-form-item label="选择领域" >
                        <el-select v-model="newGraph.domain_id" placeholder="请选择工业领域">
                        <el-option
                            v-for="data in domain_list"
                            :key="data.domain_id"
                            :label="data.domain_name"
                            :value="data.domain_id"
                            />
                        </el-select>
                    </el-form-item> -->

                    <!-- <el-form-item label="权限">
                        <el-radio-group v-model="newGraph.private">
                        <el-radio :label="true">私有</el-radio>
                        <el-radio :label="false">公开</el-radio>
                        </el-radio-group>
                    </el-form-item> -->

                    <el-form-item>
                        <el-button type="primary" @click="add_graph()">立即构建</el-button>
                    </el-form-item>
                    <!-- 提示用户所要构建图谱的所属领域 -->
                </el-form>
            </el-card>
        </div>
    </el-container>
</template>

<script>
export default{
    created(){
        // this.getTripledataList();
        this.getMyDomainList();
    },
    data(){
        return{
            triple_data_list:[],
            domain_list:[],
            newGraph: {
                
            },
            new_graph:'',
            totalPage:''
        }
    },
    methods:{
        // 获取领域列表
        async getDomainList (){
            const res = await this.$http.get('domain');
            this.domain_list = res.data.data;
        },
        // 获取三元组数据列表
        async getTripledataList(){
            const {data: res} = await this.$http.get('data?dtype=data');
            console.log(res.data);
            this.triple_data_list = res.data;
            this.totalPage = res.data.length;
        },
        async add_graph() {
            try {
                console.log(this.newGraph)
                const { data: res } = await this.$http.post('graph/', this.newGraph)

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
                //this.addDialogVisible = false
            }
        },
        // 添加新的知识图谱
        // async add_new_graph(){
        //     // var graph={
        //     //         name:this.new_graph.name,
        //     //         private:this.new_graph.private,
        //     //         domain_id:this.new_graph.domain_id
        //     //     }
        //     console.log(graph)
        //     try{
        //         var res = this.$http.post('graph/',graph);
        //         console.log(res);
        //         this.$message({
        //             showClose: true,
        //             message: '创建图谱成功！',
        //             type: 'success'
        //         });

        //     }
        //     catch{
        //          this.$message({
        //         showClose: true,
        //         message: '异常！',
        //         type: 'error'
        //     });
        //     }
            
        // },
        // 获取我的领域列表
        async getMyDomainList() {
            const { data: res } = await this.$http.get('domain')
            this.domain_list = res.data
        },
    }
}
</script>
