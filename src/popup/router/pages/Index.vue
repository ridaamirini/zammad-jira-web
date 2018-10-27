<template>
  <transition name="fade">
  <div class="loader" v-if="showLoader" :key="'loader'">
    <half-circle-spinner
      :animation-duration="1000"
      :size="60"
      color="#0747a6"
    />
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
            <label for="summaryInput">Summary</label>
            <input type="text" class="form-control" id="summaryInput" aria-describedby="summaryInput" placeholder="Enter summary" v-model="issue.title">
          </div>
          <div class="form-group">
            <label for="descriptionTextarea">Description</label>
            <quill-editor ref="textEditor"
                          id="descriptionTextarea"
                          v-model="issue.description"
                          :options="editorOption">
            </quill-editor>
          </div>
          <button type="submit" class="btn btn-success btn-block mt-2 mb-1">Create</button>
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

  // CSS
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  const browser = require('webextension-polyfill');

  export default {
      components: {
          HalfCircleSpinner,
          quillEditor
      },
      data() {
        return {
            showLoader: true,
            issue: {
                title: null,
                description: null
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
      mounted() {
          if (chrome) {
              chrome.tabs.query({active: true, lastFocusedWindow: true}, this.fetchInformation);
          } else {
              browser.tabs.query({active: true, currentWindow: true})
                   .then(this.fetchInformation)
          }
      },
      methods: {
          fetchInformation(tabs) {
              let location = new URL(tabs[0].url);
              let apiUrl = `${location.protocol}//${location.host}`;
              let ticketId = last(location.hash.split('/'));

              axios.get(`${apiUrl}/api/v1/tickets/${ticketId}`, {
                      headers: {
                        Authorization: `Bearer ${token}`
                      }
                  })
                  .then(response => {
                      this.issue.title = '[Ticket #' + response.data.number + '] ' + response.data.title.trim();

                      this.hideLoader();
                  })
                  .catch(error => console.error(error));
          },
          hideLoader(delay = 800) {
              setTimeout(() => {
                  this.showLoader = false;
              }, delay)
          }
      }
  }
</script>

<style lang="scss" scoped>
  .loader {
    position: absolute;
    top: 170px;
    right: 170px;
  }

  .issue-form {
    max-height: 400px;
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
