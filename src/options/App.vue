<template>
  <div class="container">
      <div class="form-group">
        <label for="zammadUrl">Zammad - URL</label>
        <input type="text" class="form-control" id="zammadUrl" placeholder="https://helpdesk.example.net" v-model="settings.zammad.url">
      </div>
      <div class="form-group">
        <label for="zammadToken">Zammad - API Token</label>
        <input type="text" class="form-control" id="zammadToken" placeholder="Enter API Token" v-model="settings.zammad.token">
      </div>
      <hr>
      <div class="form-group">
        <label for="atlassianUrl">Atlassian - Jira Cloud URL</label>
        <input type="text" class="form-control" id="atlassianUrl" placeholder="https://xxxxxx.atlassian.net" v-model="settings.atlassian.url">
      </div>
      <div class="form-group">
        <label for="atlassianEmail">Atlassian - User</label>
        <input type="text" class="form-control" id="atlassianEmail" placeholder="me@example.com" v-model="settings.atlassian.user">
      </div>
      <div class="form-group">
        <label for="atlassianToken">Atlassian - API Token</label>
        <input type="text" class="form-control" id="atlassianToken" aria-describedby="atlassianTokenHelp" placeholder="Enter API Token" v-model="settings.atlassian.token">
        <small id="atlassianTokenHelp" class="form-text text-muted"><a href="https://confluence.atlassian.com/cloud/api-tokens-938839638.html">Learn more</a></small>
      </div>
      <button type="button" class="btn btn-block btn-success mb-2" @click="saveForm"><i class="fa fa-save"></i> Save</button>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'App',
    computed: mapState(['settings']),
    methods: {
        saveForm() {
            console.log(this.$store.state.settings);
        }
    }
  }
</script>

<style>
.btn {
  background-image: none !important;
}
</style>
