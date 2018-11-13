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
  <div v-else-if="isCreated && !showLoader && !showError" :key="'success'" class="mt-2">
    <div class="container">
      <div class="alert alert-success" role="alert">
        Issue <b>{{ responseIssue.key }}</b> was successfully created!
      </div>
      <a :href="responseIssue.link" target="_blank" class="btn btn-primary btn-lg btn-block">Open Issue</a>
      <button type="button" class="btn btn-secondary btn-lg btn-block" @click="closePopUp()">Close</button>
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
            <i class="fa fa-cogs btn-settings" @click="openOptionsPage"></i>
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
  import {isNumeric, last} from '../../../utils';
  import axios from 'axios';
  import { quillEditor } from 'vue-quill-editor'
  import { mapState } from 'vuex';
  import { find } from 'lodash';
  import * as types from './../../../store/mutation-types';
  import TurndownService from 'turndown';

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
            isCreated: false,
            responseIssue: {
                key: null,
                link: '#',
            },
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
          ...mapState(['settings', 'issueForm'])
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

              if (!ticketId || !isNumeric(ticketId)) return;

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


                      this.reselectLastParams();
                      this.hideLoader();
                  })
                  .catch(error => this.logError(error));
          },
          createIssue() {
              this.showLoader = true;

              const turndownService = new TurndownService();
              let markdown = turndownService.turndown(this.issue.description);

              let postData = {
                  fields: {
                      project: {
                              id: this.issue.project
                      },
                      summary: this.issue.summary,
                      description: {
                          version: 1,
                          type: "doc",
                          content: [
                              {
                                  type: "paragraph",
                                  content: [
                                      {
                                          type: "text",
                                          text: markdown
                                      }
                                  ]
                              }
                          ]
                      },
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
                      this.isCreated = true;
                      this.responseIssue = {
                          key: response.data.key,
                          link: `${this.settings.atlassian.url}/browse/${response.data.key}`
                      };

                      this.rememberIssueForm();
                      this.hideLoader();
                  })
                  .catch(error => this.logError(error));
          },
          rememberIssueForm() {
              this.$store.commit(types.UPDATE_ISSUE_FORM, {
                  type: this.issue.type,
                  project: this.issue.project
              });
          },
          reselectLastParams() {
              // Set last params
              if (this.issueForm && this.issueForm.project && this.projects.length !== 0) {
                  let projectIndex = this.projects.map(project => project.id)
                                                  .indexOf(this.issueForm.project);

                  if (projectIndex !== -1) {
                      let project = this.projects[projectIndex];
                      this.issue.project = this.issueForm.project;

                      if (project.types
                          .map(issuetype => issuetype.id)
                          .indexOf(this.issueForm.type) !== -1)
                          this.issue.type = this.issueForm.type;
                  }
              }
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
          },
          closePopUp() {
              window.close();
          },
          openOptionsPage() {
              if (chrome) {
                  chrome.runtime.openOptionsPage();
              }
          }
      }
  }
</script>

<style lang="scss" scoped>
  .btn-settings {
    cursor: pointer;
  }

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
