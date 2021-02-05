import axios from 'axios'
import { records } from '../utils/localForageInstance'
export const state = () => ({
  data: [],
})

export const mutations = {
  setRecords(state, records) {
    state.data = records
  },
}

const isOnline = false
// const isOnline = navigator.onLine
const subRecordsKey = 'submissonRecords'
const tempRecordsKey = 'tempSavedRecords'

export const actions = {
  async getRecords({ commit }) {
    let data = []
    if (isOnline) {
      try {
        const res = await axios.get()
        await records.setItem(subRecordsKey, data)
        data = res.data
      } catch (e) {
        return new Error('Cannot get records')
      }
    } else {
      try {
        const submitted = await records.getItem(subRecordsKey)
        const temp = await records.getItem(tempRecordsKey)
        if (submitted) data = [...submitted]
        if (temp) data = [...data, ...temp]
      } catch (err) {
        return new Error(err)
      }
    }
    commit('setRecords', data)
  },

  async addRecords(state, { records }) {
    try {
      if (isOnline) {
        await axios.post('')
      }
    } catch (err) {
      throw new Error('Records not added, please try again')
    }
  },

  async addRecord(state, record) {
    if (isOnline) {
      try {
        const res = await axios.post('', { record })
        return res
      } catch (err) {
        return new Error('Record not added, please try again')
      }
    } else {
      // save to local storage

      try {
        const oldRecords = await records.getItem(tempRecordsKey)
        const res = await records.setItem(
          tempRecordsKey,
          oldRecords ? [...oldRecords, record] : [record]
        )

        return res
      } catch (err) {
        return new Error('Record not added, please try again')
      }
    }
  },

  async editRecord(context, record) {
    const oldRecords = await records.getItem(tempRecordsKey)
    const mapped = oldRecords.map((item) => {
      if (item.id === record.id) return record
      else return item
    })
    const res = await records.setItem(tempRecordsKey, mapped)
    return res
  },
}
