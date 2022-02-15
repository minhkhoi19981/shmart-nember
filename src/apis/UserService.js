class UserService {
  constructor() {
    if (!UserService.instance) {
      UserService.instance = this;
    }
    return UserService.instance;
  }

  _setToken = (token) => {
    localStorage.setItem("token", token);
  };

  _getToken = () => {
    return localStorage.getItem("token");
  };

  _setID = (id) => {
    localStorage.setItem("ID", id);
  };

  _getID = () => {
    return localStorage.getItem("ID");
  };
  _setData = (data) => {
    localStorage.setItem("dataST", data);
  };

  _getData = () => {
    return localStorage.getItem("dataST");
  };
}
const instance = new UserService();
Object.freeze(instance);
export default instance;
