<template>
  <transition name="fade" mode="out-in">
  <div class="loader" v-if="showLoader && !showError" :key="'loader'">
    <half-circle-spinner
      :animation-duration="1000"
      :size="60"
      color="#0747a6"
    />
  </div>
  <div v-else-if="showError" :key="'error'" class="mt-2">
    <div class="container">
      <div class="alert alert-danger alert-dismissible" role="alert">
        <h4 class="alert-heading">Error!</h4>
        <p style="font-size: 17px;">Try again later or check the Settings</p>
        <hr>
        <p class="mb-0" style="font-size: 18px;">{{ showError }}</p>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="clearError">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
  </div>
  <div class="container issue-form mt-2" v-else :key="'form'">
    <div class="row">
      <div class="col">
        <div class="row">
          <div class="col">
            <h4>Create issue</h4>
          </div>
          <div class="col-1 p-0 mr-1 text-center">
            <i class="fa fa-cogs"></i>
          </div>
        </div>
        <form>
          <div class="form-group">
            <label for="summaryInput">Summary<b class="required">*</b></label>
            <input type="text" class="form-control" id="summaryInput" aria-describedby="summaryInput" placeholder="Enter summary" v-model="issue.summary">
          </div>
          <div class="form-group">
            <label for="descriptionTextarea">Description</label>
            <quill-editor ref="textEditor"
                          id="descriptionTextarea"
                          v-model="issue.description"
                          :options="editorOption">
            </quill-editor>
          </div>
          <div class="row">
            <div class="col">
              <div class="form-group">
                <label for="issueProject">Project<b class="required">*</b></label>
                <select class="form-control" id="issueProject" v-model="issue.project">
                  <option :value="null">Choose</option>
                  <option v-for="option in projects" :value="option.id">{{ option.name }}</option>
                </select>
              </div>
            </div>
            <div class="col">
              <div class="form-group">
                <label for="issueType">Type<b class="required">*</b></label>
                <select class="form-control" id="issueType" v-model="issue.type" :disabled="!issue.project">
                  <option :value="null">Choose</option>
                  <option v-for="option in issueTypes" :value="option.id">{{ option.name }}</option>
                </select>
              </div>
            </div>
          </div>
          <button type="button" class="btn btn-success btn-block mt-2 mb-1"
                  @click="createIssue"
                  :disabled="!issue.summary || !issue.type || !issue.project">Create</button>
        </form>
      </div>
    </div>
  </div>
  </transition>
</template>

<script>
  import { HalfCircleSpinner } from 'epic-spinners'
  import { last } from '../../../utils';
  import axios from 'axios';
  import { quillEditor } from 'vue-quill-editor'
  import { mapState } from 'vuex';
  import { find } from 'lodash';

  // CSS
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  export default {
      components: {
          HalfCircleSpinner,
          quillEditor
      },
      data() {
        return {
            showLoader: true,
            showError: null,
            projects: [],
            issue: {
                summary: null,
                description: null,
                type: null,
                project: null
            },
            editorOption: {
              modules: {
                  toolbar: [
                      ['bold', 'italic'],
                      ['link', 'blockquote', 'code-block', 'image'],
                      [{ list: 'ordered' }, { list: 'bullet' }]
                  ]
              },
              placeholder: 'Enter description',
              theme: 'snow'
          }
        }
      },
      computed: {
          issueTypes: {
              get () {
                  if (!this.issue.project) return [];

                  return find(this.projects, ['id', this.issue.project])['types'];
              }
          },
          ...mapState(['settings'])
      },
      mounted() {
          setTimeout(() => {
              if (chrome) {
                  chrome.tabs.query({active: true, lastFocusedWindow: true}, this.fetchInformation);
              } else {
                  global.browser.tabs.query({active: true, currentWindow: true})
                      .then(this.fetchInformation)
              }
          }, 300);
      },
      methods: {
          fetchInformation(tabs) {
              let location = new URL(tabs[0].url);
              let apiUrl = this.settings.zammad.url;
              let ticketId = last(location.hash.split('/'));

              axios.get(`${apiUrl}/api/v1/tickets/${ticketId}`, {
                      headers: {
                        Authorization: `Bearer ${this.settings.zammad.token}`
                      }
                  })
                  .then(response => {
                      this.issue.summary = '[Ticket #' + response.data.number + '] ' + response.data.title.trim();

                      this.fetchCreateIssueMeta();
                  })
                  .catch(error => this.logError(error));
          },
          fetchCreateIssueMeta() {
              axios.get(`${this.settings.atlassian.url}/rest/api/3/issue/createmeta`, {
                  auth: {
                      username: this.settings.atlassian.user,
                      password: this.settings.atlassian.token
                  }
              })
                  .then(response => {
                      this.projects = response.data.projects.map(project => {
                          return {
                              id: project.id,
                              name: project.key,
                              types: project.issuetypes
                          }
                      });

                      this.hideLoader();
                  })
                  .catch(error => this.logError(error));
          },
          createIssue() {
              this.showLoader = true;

              let postData = {
                  fields: {
                      project:
                          {
                              id: this.issue.project
                          },
                      summary: this.issue.summary,
                      description: this.issue.description,
                      issuetype: {
                          id: this.issue.type
                      }
                  }
              };

              axios.post(`${this.settings.atlassian.url}/rest/api/3/issue`, postData, {
                  auth: {
                      username: this.settings.atlassian.user,
                      password: this.settings.atlassian.token
                  }
              })
                  .then(response => {
                      // console.log(response.data);

                      this.hideLoader();
                  })
                  .catch(error => this.logError(error));
          },
          remberIssueForm() {

          },
          hideLoader(delay = 800) {
              setTimeout(() => {
                  this.showLoader = false;
              }, delay)
          },
          logError(error) {
              this.showError = error.message;
              console.error(error);
          },
          clearError() {
              this.showError = null;
              this.showLoader = false;
          }
      }
  }
</script>

<style lang="scss" scoped>
  .loader {
    position: absolute;
    top: 218px;
    right: 170px;
  }

  .issue-form {
    max-height: 400px;
  }

  .required {
    color: red;
  }

  p {
    font-size: 20px;
  }

  #descriptionTextarea {}
</style>

<style>
  .ql-container {
    height: 130px !important;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
