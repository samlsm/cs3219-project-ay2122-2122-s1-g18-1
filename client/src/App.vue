<template>
  <div>
    <!-- Nav bar -->
    <nav class="nav-bar justify-content-between flex-nowrap flex-row">
      <b-container fluid>
        <b-row>
          <b-col cols="10">
            <h3 class="fw-bold mt-3 mb-3 ms-5">SHReK Tech</h3>
          </b-col>
          <b-col cols="2" v-if="enableLogout">
            <AccountManagement class="mt-3 mb-3" />
          </b-col>
        </b-row>
      </b-container>
    </nav>

    <!-- Router view -->
    <div class="container mt-5">
      <router-view />
    </div>
  </div>
</template>

<script>
import AccountManagement from '@/components/AccountManagement'
export default {
  name: 'App',
  components: { AccountManagement },
  computed: {
    enableLogout () {
      return this.$route.name === 'home'
    }
  }
}
</script>
