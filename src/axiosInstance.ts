import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://vkapp1.dnk174.ru/'
})

export default instance