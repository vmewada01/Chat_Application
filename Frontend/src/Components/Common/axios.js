import axios from "axios";
import { RequestHeader } from "./RequestHeader";

class HttpService {
  static Instance() {
    let ax = new axios.create({
      baseURL: "https://v-chat-app-kpbs.onrender.com",
      timeout: 30000,
      headers: RequestHeader(),
    });

    ax.interceptors.request.use((config) => {
      let token = localStorage.getItem("APS-TOKEN");
      if (token) {
        config.headers.Authorization = "Bearer " + token;
      }
      return config;
    });

    ax.interceptors.response.use(function (response) {
      return response;
    });

    return ax;
  }
}

//https://gist.github.com/alfonmga/96474f6adb6ed8dee8bc8bf8627c0ae1
export default HttpService.Instance();
