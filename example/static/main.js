const iframeWidth = 360
// WARNING! This url must be where your web_auth_page serves.
const iframeSrc = 'http://127.0.0.1:8081'

const app = new Vue({
  el: '#app',
  template: `
    <div id="app" class="container-fluid pt-3">
      <div class="row">
        <div class="col">
          <div class="card">
            <div class="card-header d-flex">
              <h2>Your Awesome Dapp</h2>
              <button class="btn btn-primary ml-2" @click.prevent="onToggleIFrame">Toggle Web Auth</button>
            </div>
            <div class="card-body">
              <form>

                <div class="form-group row">
                  <label class="col-sm-2 col-form-label">Ping</label>
                  <div class="col-sm-10">
                    <button class="btn btn-primary mt-2" @click.prevent="onPing">Ping</button>
                  </div>
                </div>

                <div class="form-group row">
                  <label class="col-sm-2 col-form-label">Sign In</label>
                  <div class="col-sm-10">
                    <label class="mt-2">Address:</label>
                    <input class="form-control" readonly :value="user.address">
                    <label class="mt-2">Nickname:</label>
                    <input class="form-control" readonly :value="user.nickname">
                    <label class="mt-2">Profile:</label>
                    <v-jsoneditor :options="{ mode: 'tree' }" v-model="user.profile" readonly></v-jsoneditor>
                    <button class="btn btn-primary mt-2" @click.prevent="onSignIn">Sign In</button>
                  </div>
                </div>

                <div class="form-group row">
                  <label class="col-sm-2 col-form-label">Build Transaction</label>
                  <div class="col-sm-10">
                    <label class="mt-2">Params:</label>
                    <v-jsoneditor cache="buildTransactionParams" v-model="buildTransactionParams"></v-jsoneditor>
                    <button class="btn btn-primary mt-2" @click.prevent="onBuildTransaction">Build</button>
                    <label class="mt-2 d-block">Signed Transaction:</label>
                    <v-jsoneditor v-model="buildTransactionResult"></v-jsoneditor>
                  </div>
                </div>

                <div class="form-group row">
                  <label class="col-sm-2 col-form-label">Sign Transaction</label>
                  <div class="col-sm-10">
                    <label class="mt-2">Unspents:</label>
                    <v-jsoneditor cache="signTransactionParams.unspents" v-model="signTransactionParams.unspents"></v-jsoneditor>
                    <label class="mt-2">Raw Transaction:</label>
                    <v-jsoneditor cache="signTransactionParams.rawTransaction" v-model="signTransactionParams.rawTransaction"></v-jsoneditor>
                    <button class="btn btn-primary mt-2" @click.prevent="onSignTransaction">Sign</button>
                    <label class="mt-2 d-block">Signed Transaction:</label>
                    <v-jsoneditor v-model="signTransactionResult"></v-jsoneditor>
                  </div>
                </div>

                <div class="form-group row">
                  <label class="col-sm-2 col-form-label">Push Transaction</label>
                  <div class="col-sm-10">
                    <label class="mt-2">Raw Transaction:</label>
                    <v-jsoneditor cache="pushTransactionParams.rawTransaction" v-model="pushTransactionParams.rawTransaction"></v-jsoneditor>
                    <button class="btn btn-primary mt-2" @click.prevent="onPushTransaction">Push</button>
                    <label class="mt-2 d-block">Pushed Transaction:</label>
                    <a :href="'https://explorer.nervos.org/transaction/' + pushTransactionResult" target="_blank">{{ pushTransactionResult }}</a>
                  </div>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>

      <iframe
        ref="iframe"
        :src="iframeSrc"
        style="position: fixed; height: 600px; width: 360px; border: none;"
        :style="animatedStyle"></iframe>
    </div>
  `,
  data () {
    return {
      iFrameShown: false,
      iframeSrc,
      tweenedStyle: {
        right: -iframeWidth,
        top: 0,
      },
      user: {
        address: '',
        nickname: '',
        profile: {}
      },
      buildTransactionParams: {
        tos: [
          { address: 'ckb1qyqvxlzmadlh0vvczqyye636723z6ngxwzqsyp2hup', value: '6100000000' },
        ],
      },
      buildTransactionResult: {},
      signTransactionParams: {
        unspents: [{"txId":"0xd86b1bd1799ca6a94eeac991bbb73e52dbf0acf008fc544d0467f3260040f388","address":"ckb1qyq07200n40rrp96shfenufzug9dlua8gweqpwcam5","vout":0,"value":"6100000000","lock":{"codeHash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8","hashType":"type","args":"0xff29ef9d5e3184ba85d399f122e20adff3a743b2"},"lockHash":"0x1bd82e2b7b998f1e33cdaf25bdfdab8994b919926e4c66c29d8ddeef503c9ace"},{"txId":"0xd86b1bd1799ca6a94eeac991bbb73e52dbf0acf008fc544d0467f3260040f388","address":"ckb1qyq07200n40rrp96shfenufzug9dlua8gweqpwcam5","vout":1,"value":"13899997907","lock":{"codeHash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8","hashType":"type","args":"0xff29ef9d5e3184ba85d399f122e20adff3a743b2"},"lockHash":"0x1bd82e2b7b998f1e33cdaf25bdfdab8994b919926e4c66c29d8ddeef503c9ace"}],
        rawTransaction: {"version":"0x0","cell_deps":[{"out_point":{"tx_hash":"0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c","index":"0x0"},"dep_type":"dep_group"}],"inputs":[{"previous_output":{"tx_hash":"0xd86b1bd1799ca6a94eeac991bbb73e52dbf0acf008fc544d0467f3260040f388","index":"0x0"},"since":"0x0"},{"previous_output":{"tx_hash":"0xd86b1bd1799ca6a94eeac991bbb73e52dbf0acf008fc544d0467f3260040f388","index":"0x1"},"since":"0x0"}],"outputs":[{"capacity":"0x16b969d00","lock":{"code_hash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8","hash_type":"type","args":"0xff29ef9d5e3184ba85d399f122e20adff3a743b2"},"type":null},{"capacity":"0x33c812061","lock":{"code_hash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8","hash_type":"type","args":"0xff29ef9d5e3184ba85d399f122e20adff3a743b2"},"type":null}],"outputs_data":["0x","0x"],"header_deps":[],"witnesses":[{"lock":"","inputType":"","outputType":""},{"lock":"","inputType":"","outputType":""}]},
      },
      signTransactionResult: {},
      pushTransactionParams: {
        rawTransaction: {}
      },
      pushTransactionResult: '0x456a6abfb2b2f5291e31cf001222766fb5c98cf65a0a8aecbad0660656bb087d'
    }
  },
  computed: {
    animatedStyle () {
      return {
        right: this.tweenedStyle.right + 'px',
        top: this.tweenedStyle.top + 'px',
      }
    }
  },
  mounted () {
    this.$options.webauth = new webauth.WebAuth({
      driver: 'iframe',
      loglevel: 'debug',
      options: {
        win: this.$refs.iframe.contentWindow,
        targetOrigin: iframeSrc,
      }
    })
  },
  methods: {
    showIFrame () {
      gsap.to(this.tweenedStyle, {
        duration: 0.5,
        right: 0,
        onComplete: () => {
          this.iFrameShown = true
        }
      })
    },
    hideIFrame () {
      gsap.to(this.tweenedStyle, {
        duration: 0.5,
        right: -iframeWidth,
        onComplete: () => {
          this.iFrameShown = false
        }
      })
    },
    onToggleIFrame () {
      if (this.iFrameShown) {
        this.hideIFrame()
      }
      else {
        this.showIFrame()
      }
    },
    async onPing () {
      await this.$options.webauth.ping()
    },
    async onSignIn () {
      this.showIFrame()

      const { address, nickname, profile } = await this.$options.webauth.signIn()
      this.user.address = address
      this.user.nickname = nickname
      this.user.profile = profile

      this.hideIFrame()
    },
    async onBuildTransaction () {
      this.showIFrame()

      try {
        const { signedTransaction } = await this.$options.webauth.buildTransaction(this.buildTransactionParams)
        this.buildTransactionResult = signedTransaction
      }
      catch (err) {
        debugger
        alert(err.message)
      }

      this.hideIFrame()
    },
    async onSignTransaction () {
      this.showIFrame()

      try {
        const { signedTransaction } = await this.$options.webauth.signTransaction({
          unspents: this.signTransactionParams.unspents,
          rawTransaction: this.signTransactionParams.rawTransaction,
        })
        this.signTransactionResult = signedTransaction
      }
      catch (err) {
        debugger
        alert(err.message)
      }

      this.hideIFrame()
    },
    async onPushTransaction () {
      try {
        const { txId } = await this.$options.webauth.pushTransaction({
          rawTransaction: this.pushTransactionParams.rawTransaction,
        })
        this.pushTransactionResult = txId
      }
      catch (err) {
        debugger
        alert(err.message)
      }
    }
  }
})
