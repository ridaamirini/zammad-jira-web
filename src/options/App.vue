<template>
  <div class="container">
      <div class="form-group">
        <label for="zammadUrl">Zammad - URL</label>
        <input type="text"
               class="form-control"
               id="zammadUrl"
               placeholder="https://helpdesk.example.net"
               :value="settings.zammad.url"
               @input="updateSettings('zammad.url', $event.target.value)"
        />
      </div>
      <div class="form-group">
        <label for="zammadToken">Zammad - API Token</label>
        <input type="text"
               class="form-control"
               id="zammadToken"
               placeholder="Enter API Token"
               :value="settings.zammad.token"
               @input="updateSettings('zammad.token', $event.target.value)"
        />
      </div>
      <hr>
      <div class="form-group">
        <label for="atlassianUrl">Atlassian - Jira Cloud URL</label>
        <input type="text"
               class="form-control"
               id="atlassianUrl"
               placeholder="https://xxxxxx.atlassian.net"
               :value="settings.atlassian.url"
               @input="updateSettings('atlassian.url', $event.target.value)"
        />
      </div>
      <div class="form-group">
        <label for="atlassianEmail">Atlassian - User</label>
        <input type="text"
               class="form-control"
               id="atlassianEmail"
               placeholder="me@example.com"
               :value="settings.atlassian.user"
               @input="updateSettings('atlassian.user', $event.target.value)"
        />
      </div>
      <div class="form-group">
        <label for="atlassianToken">Atlassian - API Token</label>
        <input type="text"
               class="form-control"
               id="atlassianToken"
               aria-describedby="atlassianTokenHelp"
               placeholder="Enter API Token"
               :value="settings.atlassian.token"
               @input="updateSettings('atlassian.token', $event.target.value)"
        />
        <small id="atlassianTokenHelp" class="form-text text-muted"><a href="https://confluence.atlassian.com/cloud/api-tokens-938839638.html">Learn more</a></small>
      </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import * as types from './../store/mutation-types';

  export default {
    name: 'App',
    computed: mapState(['settings']),
    methods: {
        updateSettings(pathkey, value) {
            let path = pathkey.split('.');
            let settings = {...this.settings};

            settings[path[0]][path[1]] = value;

            this.$store.commit(types.UPDATE_SETTINGS, settings);
        }
    }
  }
</script>

<style>
.btn {
  background-image: none !important;
}
</style>
