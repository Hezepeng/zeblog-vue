const common = {
  state: {
    uploadProgress: 0
  },

  mutations: {
    SET_UPLOAD_PROGRESS: (state, progress) => {
      state.uploadProgress = progress
    }
  }
}

export default common
