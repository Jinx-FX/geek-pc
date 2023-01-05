import { makeAutoObservable } from "mobx"
import { http } from '@/utils'

class ChannelStore {
  channelList = []
  constructor() {
    makeAutoObservable(this)
  }
  loadchannelList = async () => {
    const res = await http.get('/channels')
    this.channelList = res.data.channels
  }
}

export default ChannelStore