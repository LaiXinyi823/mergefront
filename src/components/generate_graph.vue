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
                        <el-select v-model="new_graph.domian_id" placeholder="请选择三元组数据">
                        <!-- <el-option :v-for="item in tripledataList" :label="item.data_name" :value="item.data_id"></el-option> -->
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
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
        //this.getTripledataList();
    },
    data(){
        return{
            tripledataList:[],
            new_graph:{id:'',name:'',private:true,domain_id:''}
        }
    },
    methods:{
        // 获取三元组数据列表
        async getTripledataList(){
            var {data: res} = await this.$http.get('triple_data');
            this.tripledataList = res.data;
            console.log(this.tripledataList)
        },
        // 添加新的知识图谱
        async add_new_graph(){
            var {data:res} = this.$http.post(this.new_graph.domain_id+'graph');
            cosole.log(res);
        }
    }
}
</script>
