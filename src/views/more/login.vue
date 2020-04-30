<template>
  <transition-view>
    <div class="full_header">
      <title-back title="登录" />
    </div>
    <div class="full_main">
      <div class="container">
        <wapper-scroll>
          <loading
            class="loading"
            :is-loading="loginLoading" />
          <form class="loginBox">
            <div class="inputItem">
              <input v-model="phone" placeholder="手机号,网易邮箱" type="text" name="phone" autocomplete="off">
            </div>
            <div class="inputItem">
              <input v-model="password" placeholder="密码" type="password" name="password" autocomplete="off">
            </div>
            <div class="inputItem">
              <span class="button" @click="login">登录</span>
            </div>
          </form>
        </wapper-scroll>
      </div>
    </div>
  </transition-view>
</template>
<script>
export default {
  data() {
    return {
      phone: '',
      password: '',
      loginLoading: false
    }
  },
  created() {

  },
  methods: {
    //登录
    async login() {
      const regP = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
      const regM = /^[a-zA-Z0-9_-]+@163.com$/
      if (!regP.test(this.phone) && !regM.test(this.phone)) {
        return this.toast({
          title: '请输入正确的账号'
        })
      }
      let url = ''
      let params = {}
      if (regP.test(this.phone)) {
        url = '/login/cellphone'
        params = {
          phone: this.phone,
          password: this.password,
          timestamp: +new Date()
        }
      } else {
        url = '/login'
        params = {
          email: this.phone,
          password: this.password,
          timestamp: +new Date()
        }
      }

      try {
        const res = await this.$http({
          url,
          params
        })
        if (res.data.code !== 200) {
          return
        }
        this.loginLoading = true
        const userId = res.data.account.id
        localStorage.setItem('userId', userId)
        this.toast({
          title: '登录成功',
          cancell: () => {
            this.loginLoading = false
            this.$router.replace('/my')   
          }
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.container{
  .loginBox{
    padding:20px ;
    .inputItem{
      margin-bottom: 20px;
      input{
        padding: 0 10px;
        width: 100%;
        height: 40px;
        border: 1px solid #f0f0f0
      }
      .button{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        border: none;
        background: #d44439;
        color: #fff;
        height: 40px;
      }
    }
  }
}
</style>
