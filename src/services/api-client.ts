import axios from "axios";

export default axios.create({
  baseURL: "https://api.rawg.io/api",
  params: {
    key: "1f30715bacdf4202b0f8afd1c99aceab",
  },
})