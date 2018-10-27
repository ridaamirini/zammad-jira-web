import * as types from './mutation-types'

export default {
  [types.UPDATE_SETTINGS](state, payload) {
      state.settings = payload;
  }
}
