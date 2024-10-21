import axios from 'axios'

export const getMusicList = async () => {
  const { data } = await axios.get('http://110.42.251.190:9898/personalized/newsong?limit=10')
  return data
}
