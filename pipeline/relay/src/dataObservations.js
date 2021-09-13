// Observations
// read current and sample endpoints and write data to db
// called from agentReader

import { Data } from './data.js'
import * as treeObservations from './treeObservations.js'

export class Observations extends Data {
  constructor(type) {
    super()
    this.type = type // used by read method
  }

  // for read method, see base class Data

  async write(db, indexes) {
    // get flat list of observations from xml/json
    const observations = treeObservations.getElements(this.json)

    // build up an array of history records to write
    const records = []
    for (let obs of observations) {
      const node = indexes.objById[obs.dataItemId]
      if (node) {
        const { device_id, property_id } = node
        // obs.value is always string, due to the way the xml is stored, like <value>10</value>
        //. better to use dataitem category to convert to number?
        //  ie SAMPLES are numeric, EVENTS are strings
        const value = Number(obs.value) || JSON.stringify(obs.value)
        const record = {
          node_id: device_id,
          property_id,
          time: obs.timestamp,
          value,
        }
        records.push(record)
      } else {
        console.log(`Warning: objById index missing dataItem ${obs.dataItemId}`)
      }
    }

    // write all records to db
    return await db.addHistory(records)

    // this.from = nextSequence
  }

  //   // get sequence info from header
  //   // const header = json.MTConnectStreams.Header
  //   const header = data.getHeader()
  //   const { firstSequence, nextSequence, lastSequence } = header
  //   this.from = nextSequence
  //   const dataItems = data.getDataItems()
  //   await this.writeDataItems(dataItems)
  //   // //. if gap, fetch and write that also
  //   // const gap = false
  //   // if (gap) {
  //   //   const json = await fetchAgentData('sample', sequences.from, sequences.count)
  //   //   const dataItems = getDataItems(json)
  //   //   await writeDataItems(db, dataItems)
  //   // }
  // }
  // // gather up all items into array, then put all into one INSERT stmt, for speed.
  // // otherwise pipeline couldn't keep up.
  // // see https://stackoverflow.com/a/63167970/243392 etc
  // async writeDataItems(dataItems) {
  //   //. write to db with arrays - that will translate to sql
  //   let rows = []
  //   for (const dataItem of dataItems) {
  //     let { dataItemId, timestamp, value } = dataItem
  //     const id = dataItemId
  //     const _id = this.idMap[id]
  //     if (_id) {
  //       value = value === undefined ? 'undefined' : value
  //       if (typeof value !== 'object') {
  //         const type = typeof value === 'string' ? 'text' : 'float'
  //         const row = `('${_id}', '${timestamp}', to_jsonb('${value}'::${type}))`
  //         rows.push(row)
  //       } else {
  //         //. handle arrays
  //         console.log(`**Handle arrays for '${id}'.`)
  //       }
  //     } else {
  //       console.log(`Unknown element id '${id}', value '${value}'.`)
  //     }
  //   }
  //   if (rows.length > 0) {
  //     const values = rows.join(',\n')
  //     const sql = `INSERT INTO history (_id, time, value) VALUES ${values};`
  //     console.log(sql)
  //     //. add try catch block - ignore error? or just print it?
  //     await this.db.query(sql)
  //   }
  // }
  //   async fetchSample() {
  //     this.from = null
  //     this.count = this.fetchCount
  //     let data
  //     let errors
  //     do {
  //       const json = await this.endpoint.fetchData(
  //         'sample',
  //         this.from,
  //         this.count
  //       )
  //       data = new Data(json)
  //       // check for errors
  //       // eg <Error errorCode="OUT_OF_RANGE">'from' must be greater than 647331</Error>
  //       // if (json.MTConnectError) {
  //       errors = data.getErrors()
  //       if (errors) {
  //         console.log(data)
  //         const codes = errors.map(e => e.Error.errorCode)
  //         if (codes.includes('OUT_OF_RANGE')) {
  //           // we lost some data, so reset the index and get from start of buffer
  //           console.log(
  //             `Out of range error - some data was lost. Will reset index and get as much as possible from start of buffer.`
  //           )
  //           this.from = null
  //           //. adjust fetch count/speed
  //         }
  //       }
  //     } while (errors)
  //     return data
  //   }
}
