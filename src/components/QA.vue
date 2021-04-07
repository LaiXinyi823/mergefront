<template>
    <div style="margin-top: 10px; width:700px; margin-left:10px">
        <el-card>
            <h3>请输入问题：</h3>
            <el-input placeholder="请输入内容" v-model="question" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </el-card>
        <el-card style="margin-top:20px;">
            <h3>答案：</h3>
            <el-input placeholder="" v-model="answer" class="input-with-select">
            </el-input>
        </el-card>
        <el-card style="margin-top:20px;">
            <h3>知识图谱子图：</h3>
            <div id="main" ref="graph" style="width: 600px;height:400px;"></div>
                <!-- 图中显示层数 -->
            <div style="position:absolute;margin-left:25%;bottom: 10px;">
                显示层数：
                <el-select v-model="maxDepth" placeholder="2" size="mini" @change="showEditGraph(maxDepth)">
                    <el-option
                    v-for="i in 5"
                    :key="i"
                    :label="i"
                    :value="i">
                    </el-option>
                </el-select>
            </div>
        </el-card>

    </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    created (){
        this.showEditGraph(2)
    },
    data (){
        return {
            question:'',
            answer:'',
            domain_id:'27',
            graph_id:'40',
            vertex_id:'',
            graph_nodes:[],
            graph_links:[]
        }
    },
    methods:{
       
    }
}
</script>

