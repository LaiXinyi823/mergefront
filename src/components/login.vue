<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <!-- <img
          src="../assets/linggongyun.jpg"
          alt=""
        > -->
        <img
          src="../assets/cqu1.jpg"
          alt=""
        >
      </div>
      <!-- 登录表单区域 -->
      <el-form
        label-width="80px"
        class="loginForm"
        :rules="loginFormRules"
        :model="loginForm"
        ref="loginFormRef"
      >
        <el-form-item label="手机号">
          <el-input v-model="loginForm.mobile" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="loginForm.password"
            type="password"
          />
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button
            type="primary"
            @click="login"
          >
            登录
          </el-button>
          <el-button
            type="info"
            @click="resetLoginForm"
          >
            重置
          </el-button>
        </el-form-item>
      </el-form>
      <el-link
        type="info"
        @click="goto('/register')"
        style="margin-top:20px;margin-right:10px;"
      >
        账号注册
      </el-link>
      <el-link
        type="info"
        @click="goto('/demo')"
        style="margin-top:20px;margin-right:10px;"
      >
        演示入口
      </el-link>
    </div>
    <el-alert
      v-if="error_1"
      title="登录失败"
      type="error"
      description="用户名或密码错误！"
      show-icon
    />
    <el-alert
      v-if="error_2"
      title="登录失败"
      type="error"
      description="手机号码格式不正确！"
      show-icon
    />
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
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        mobile: 'admin',
        password: '123456'
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        mobile: [
          { required: true, validator: checkphone, trigger: 'blur' }
        ],
        // 密码是否合法
        password: [
          { required: true, validator: validatePass, trigger: 'blur' },
        ]
      },
      error_1: false,
      error_2: false
    };
  },
  methods: {
    // 点击重置按钮，重置登录表单
    resetLoginForm() {
      // console.log(this);
      this.$refs.loginFormRef.resetFields();
    },
    // 检查手机号
    isCellPhone (val) {
      if (!/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
        return false;
      } else {
        return true;
      }
    },
    // 登录
    login() {
      var that = this;
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        const res = await this.$http.post('session', this.loginForm);
        console.log(res);
        if (res.status !== 200){
        }
        else if (res.data.errno === "4004"){
          this.error_1=true;
        }
        else if (res.data.errno === "4103"){
          this.error_2=true;
        }
        else{
          console.log('success');
          this.success=true;
          this.$router.push('/home');
        }
      });
    },
    goto (path) {
      this.$router.replace(path);
    },
  }
};
</script>

<style lang="less" scoped>
.login_container {
  background-color:#011438;
  height: 100%;
}

.login_box {
  width: 470px;
  height: 300px;
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

  // 领工云
  // .avatar_box{
  //   height: 10px;
  //   width: 130px;
  //   margin-left: 30%;
  //   margin-top:10px;
  //   img{
  //     width:120%;
  //     height: 150;
  //   }
  // }
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
