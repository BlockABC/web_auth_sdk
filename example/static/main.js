webauth.consola.level = 'debug'
const driver = new webauth.IFrameDriver({
  targetOrigin: ''
})

const app = new Vue({
  el: '#app',
  template: `
    <div id="app" class="container-fluid">
      <div class="row">
        <div class="col">
          <div class="card">
            <div class="card-header">
              <h2>Your Awesome Dapp</h2>
            </div>
            <div class="card-body">
              <form>
                <div class="form-group row">
                  <div class="col-sm-10 offset-sm-2">
                    <label>Address:</label>
                    <input class="form-control" readonly :value="user.address">
                    <label>Profile:</label>
                    <v-jsoneditor :options="{ mode: 'tree' }" v-model="profile" readonly></v-jsoneditor>
                    <button class="btn btn-primary" @click.prevent="onSignIn">Sign In</button>
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-sm-2 col-form-label">Sign Transaction</label>
                  <div class="col-sm-10">
                    <v-jsoneditor cache="signTransactionParams" v-model="signTransactionParams"></v-jsoneditor>
                    <button class="btn btn-primary">Sign</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <iframe ref="iframe" src="http://127.0.0.1:3000"></iframe>
    </div>
  `,
  data () {
    return {
      user: {
        address: '',
        profile: {}
      },
      signTransactionParams: {}
    }
  },
  mounted () {
    // this.$options.sdk = new SDK({
    //   win: this.$refs.iframe.contentWindow,
    //   target: 'http://127.0.0.1:3000'
    // })
  },
  methods: {
    async onSignIn () {
      const user = await this.$options.sdk.signIn()
    }
  }
})
