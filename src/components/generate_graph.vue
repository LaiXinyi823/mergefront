<template>
    <el-container>
        <div style="width: 100%; height: 100%;">
            <el-card style="width: 100%; height: 100%;">
                <el-divider content-position="left" style="margin-bottom:20px;">知识图谱构建</el-divider>
                <el-form ref="form" :model="new_graph" label-width="120px" style="width:30%;margin:0 auto">
                    <el-form-item label="图谱名称" style="width:64%">
                        <el-input v-model="new_graph.name"></el-input>
                    </el-form-item>
                    <el-form-item label="选择数据集" >
                        <el-select v-model="new_graph.data_id" placeholder="请选择三元组数据">
                        <!-- <el-option :v-for="item in tripledataList" :label="item.data_name" :value="item.data_id"></el-option> -->
                        <el-option
                            v-for="data in tripledataList"
                            :key="data.data_id"
                            :label="data.data_name"
                            :value="data.data_id"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="权限">
                        <el-radio-group v-model="new_graph.private">
                        <el-radio :label="true">私有</el-radio>
                        <el-radio :label="false">公开</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="add_new_graph()">立即构建</el-button>
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
        this.getTripledataList();
    },
    data(){
        return{
            tripledataList:[],
            domain_list:[],
            new_graph:{name:'',private:true,domain_id:'27',data_id:''}
        }
    },
    methods:{
        // 获取三元组数据列表
        async getTripledataList(){
            var {data: res} = await this.$http.get('data?dtype=data');
            this.tripledataList = res.data;
            console.log(this.tripledataList)
        },
        // 添加新的知识图谱
        async add_new_graph(){
            var graph={
                    name:this.new_graph.name,
                    private:this.new_graph.private,
                    domain_id:'27'
                }
            // console.log(graph)
            try{
                var res = this.$http.post('graph/',graph);
                console.log(res);
                this.$message({
                    showClose: true,
                    message: '创建图谱成功！',
                    type: 'success'
                });

            }
            catch{
                 this.$message({
                showClose: true,
                message: '异常！',
                type: 'error'
            });
            }
            
        },
        // 获取我的领域列表
        async getMyDomainList() {
            const { data: res } = await this.$http.get('domain')
            this.domain_list = res.data
        },
    }
}
</script>
