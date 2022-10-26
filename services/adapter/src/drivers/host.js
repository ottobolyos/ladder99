// host driver
// fetches data from host system, writes to cache.
// see setups/common/modules/host folder.

import si from 'systeminformation' // see https://github.com/sebhildebrandt/systeminformation

import * as lib from '../common/lib.js' // for lib.round

const defaultPollInterval = 5000 // ms

export class AdapterDriver {
  //
  start({ device, cache, module }) {
    //
    console.log(`Host start driver...`)
    this.device = device
    this.cache = cache
    this.module = module
    this.inputs = module?.inputs?.inputs || {}

    // get queries from inputs.yaml and start polling data
    const itemKeys = Object.keys(this.inputs) // eg ['cpuTemperature', 'currentLoad', 'mem', 'fsSize']
    for (let itemKey of itemKeys) {
      const item = this.inputs[itemKey] // eg { main: { name, decimals }}
      const subitemString = Object.keys(item).join(',') // eg 'main'
      const query = { [itemKey]: subitemString } // eg { cpuTemperature: 'main' }
      // query data
      this.poll(query)
      // start polling data also, unless interval is null
      if (item._interval !== null) {
        const pollInterval = item.pollInterval ?? defaultPollInterval
        setInterval(this.poll.bind(this, query), pollInterval)
      }
    }

    // write to cache
    this.setValue('avail', 'AVAILABLE')
    this.setValue('cond', 'NORMAL')
  }

  async poll(query) {
    // get data from systeminformation
    // eg if query is { cpuTemperature: 'main' }
    // data will be { cpuTemperature: { main: 50.5 }}
    // other examples:
    // { currentLoad: {
    //     currentLoad: 0.01,
    //     currentLoadUser: 0.01,
    //     currentLoadSystem: 0
    //   } }
    // { mem: { total: 16777216, free: 16777216, used: 0 } }
    // fsSize returns an array -
    // { fsSize: [
    //   {
    //      fs: 'C:\\',
    //      size: 16777216,
    //      used: 0,
    //      use: 0,
    //      available: 16777216
    //   }
    // ] }
    const data = await si.get(query)

    // extract data and write all values to cache
    const itemKey = Object.keys(data)[0] // eg 'cpuTemperature'
    const itemData = data[itemKey] // eg { main: 50.5 }, or [ { fs: 'C:\\', size: 16777216, used: 0, use: 0, available: 16777216 } ]
    // fsSize returns an array, so handle specially
    if (itemKey === 'fsSize') {
      platform = process.platform
    } else {
      const subitemKeys = Object.keys(itemData) // eg ['main']
      for (let subitemKey of subitemKeys) {
        const subitemData = itemData[subitemKey] // eg 50.5
        const inputOptions = this.inputs[itemKey][subitemKey] // eg { name, decimals }
        const name = inputOptions.name // eg 'temp'
        const decimals = inputOptions.decimals // eg 1
        const value = lib.round(subitemData, decimals) // eg 50.5
        this.setValue(name, value)
      }
    }
  }

  // set a cache value
  setValue(key, value) {
    console.log('setValue', key, value)
    this.cache.set(`${this.device.id}-${key}`, value)
  }
}
