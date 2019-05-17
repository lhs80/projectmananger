import {
  requirementList,
  addRequirement,
  requirementDetail,
  cancelOrUpdateRequire,
  adminRequireList,
  adminConfirmRequire
} from '@/api/activity'

const state = {
  list: {
    demandId: '',
    demandCode: '',
    projectName: '',
    buildArea: '',
    province: '',
    city: '',
    area: '',
    address: '',
    expectedDate: '',
    contactName: '',
    contactPhone: '',
    joinName: '',
    joinPhone: '',
    remark: '',
    userId: '',
    status: '',
    createTime: '',
    confirmTime: '',
    projectCode: '',
    deptName: '',
  }
};
const mutations = {
  SET_STATE(state, data) {
    state.list = data;
  }
};
const actions = {
  QUERY_LIST({commit}, params) {
    return new Promise((resolve, reject) => {
      requirementList(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  ADD_REQUIRE({commit}, params) {
    return new Promise((resolve, reject) => {
      addRequirement(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  REQUIRE_DETAIL({commit}, params) {
    return new Promise((resolve, reject) => {
      requirementDetail(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  UPDATE_CANCEL_REQUIRE({commit}, params) {
    return new Promise((resolve, reject) => {
      cancelOrUpdateRequire(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  QUERY_ADMIN_LIST({commit}, params) {
    return new Promise((resolve, reject) => {
      adminRequireList(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  CONFIRM_REQUIRE({commit}, params) {
    return new Promise((resolve, reject) => {
      adminConfirmRequire(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
};

const getters = {
  GET_LIST: (state) => {
    return state.list
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
