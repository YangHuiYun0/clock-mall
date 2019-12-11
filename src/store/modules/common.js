export default {
  namespaced: true,
  state: {
    // 页面文档可视高度(随窗口改变大小)
    documentClientHeight: 0
  },
  mutations: {
    // 更新页面文档可视高度
    updateDocumentClientHeight(state, height) {
      state.documentClientHeight = height;
    }
  }
};
