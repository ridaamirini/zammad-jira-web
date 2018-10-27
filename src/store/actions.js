import * as types from './mutation-types'

export const setSettings = ({commit}, payload) => {
    commit(types.UPDATE_SETTINGS, payload);
};
