const getters = {
  name: state => state.user.name,
  email: state => state.user.email,
  globalConfig: state => state.user.globalConfig
};
export default getters;
