<template>
  <b-row class="justify-content-center">
    <b-col cols="4">
      <h3 class="text-center mb-4">Reset Password</h3>
      <b-alert v-if="missingField" variant="warning" show="30">
        Please enter a new password.
      </b-alert>
      <b-alert v-if="internalError" variant="warning" show="30">
        Link to reset password is invalid/expired. Please try again.
      </b-alert>
      <b-button
        v-if="success"
        @click="landingPage"
        class="mt-4 mb-2 px-5"
        variant="dark"
      >
        Password successfully reset.
        Click to login
      </b-button>
      <form v-else @submit.prevent="handleResetForm">
        <div class="form-group">
          <input
              type="password"
              class="form-control"
              placeholder="New Password"
              v-model="user.newPassword"
              maxlength="10"
              required
          >
        </div>
        <div class="form-group justify-content-center d-flex">
          <b-button
              class="button px-5"
              @click="handleResetForm"
          >
            Reset
          </b-button>
        </div>
      </form>
    </b-col>
  </b-row>
</template>

<script>
import AXIOS from '../utils/axiosConfig'

export default {
  name: 'Reset',
  data () {
    return {
      user: {
        newPassword: '',
        userId: '',
        token: ''
      },
      missingField: false,
      internalError: false,
      success: false
    }
  },
  methods: {
    handleResetForm () {
      this.success = false
      this.internalError = false
      this.missingField = this.user.newPassword.trim() === ''
      this.user.userId = this.$route.params.id
      this.user.token = this.$route.params.token
      if (!this.missingField) {
        const apiURL = '/api/users/reset'
        AXIOS.put(apiURL, this.user)
          .then((res) => {
            if (res.status === 200) {
              this.user.newPassword = ''
              this.success = true
            } else {
              this.internalError = true
            }
          })
          .catch(() => {
            this.internalError = true
          })
      }
    },
    landingPage () {
      this.$router.push({
        name: 'landing'
      })
    }
  }
}
</script>
