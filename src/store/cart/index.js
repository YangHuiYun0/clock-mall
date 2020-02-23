const state = {
    //初始化地名
    checkoutList : window.localStorage.getItem('checkoutrtList') || [],

};
const actions = {

};

const mutations = {
    //修改的方法
    CHECKOUT_INFO(state,payload){
        state.checkoutList = payload.checkoutList;
    }
};

//暴露接口
export default {
    namespaced:true,
    state,
    actions,
    mutations,
}