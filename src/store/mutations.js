import * as types from './mutation-types'

export default {
  [types.UPDATE_SETTINGS](state, payload) {
      state.settings = payload;
  },
  [types.UPDATE_ISSUE_FORM](state, payload) {
    state.issueForm = payload;
  }
}
