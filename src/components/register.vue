<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img
          src="../assets/cqu1.jpg"
          alt=""
        >
      </div>
      <!-- 注册表单区域 -->
      <el-form
        label-width="80px"
        class="loginForm"
        :rules="registerFormRules"
        :model="registerForm"
        ref="registerFormRef"
      >
        <el-form-item
          label="手机号"
          prop="mobile"
        >
          <el-input v-model="registerForm.mobile" />
        </el-form-item>
        <el-form-item
          label="用户名"
          prop="name"
        >
          <el-input v-model="registerForm.name" />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            v-model="registerForm.password"
            type="password"
          />
        </el-form-item>
        <el-form-item
          label="密码确认"
          prop="password2"
        >
          <el-input
            v-model="registerForm.password2"
            type="password"
          />
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button
            type="primary"
            @click="register"
          >
            注册
          </el-button>
          <el-button
            type="info"
            @click="resetRegisterForm"
          >
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    // 手机号格式验证
    var checkphone = (rule, value, callback) => {
      // let phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
      if (value === '') {
        callback (new Error('请输入手机号'));
      } else if (!this.isCellPhone(value)) { // 引入methods中封装的检查手机格式的方法
        callback (new Error('请输入正确的手机号!'));
      } else {
        callback ();
      }
    };
    // 密码验证
    var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.registerForm.password2 !== '') {
            this.$refs.registerFormRef.validateField('checkPass');
          }
          callback();
        }
      };
      // 密码确认验证
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.registerForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return {
      // 这是注册表单的数据绑定对象
      registerForm: {
        mobile: '',
        name: '',
        password: '',
        password2: ''
      },
      // 这是表单的验证规则对象
      registerFormRules: {
        // 验证手机号是否合法
        mobile: [
          { required: true, validator: checkphone, trigger: 'blur' }
        ],
        // 验证用户名是否合法
        name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 密码是否合法
        password: [
          { required: true, validator: validatePass, trigger: 'blur' },
        ],
        // 验证密码是否合法
        password2: [
          { required: true, validator: validatePass2, trigger: 'blur' },
        ]
      }
    };
  },
  methods: {
    // 点击重置按钮，重置注册表单
    resetRegisterForm() {
      // console.log(this);
      this.$refs.registerFormRef.resetFields();
    },
    // 检查手机号
    isCellPhone (val) {
      if (!/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
        return false;
      } else {
        return true;
      }
    },
    register (){
        this.$refs.registerFormRef.validate(async valid => {
        // 后台的验证
        if (!valid) return;
        const result = await this.$http.post('users', this.registerForm);
        console.log(result);
        this.$router.replace('/home');
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  background-color:#011438;
  height: 100%;
}

.login_box {
  width: 500px;
  height: 400px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.loginForm{
  margin-top:100px;
  margin-left:10px;
  width:90%;
}
</style>
