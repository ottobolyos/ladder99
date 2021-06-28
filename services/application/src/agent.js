// agent
// class to represent an agent - handles probe, current, sample loop

import { Data } from './data.js'
import * as libapp from './libapp.js'

export class Agent {
  constructor({ db, endpoint, params }) {
    this.db = db
    this.endpoint = endpoint
    this.params = params
    //
    // this.idMap = {} // map from element id to integer _id for db tables
    this.fetchFrom = null
    //. these will be dynamic - optimize on the fly
    this.fetchInterval = params.fetchInterval
    this.fetchCount = params.fetchCount
  }

  // init agent
  async init() {
    //. read probe info incl device info?
    //. read dataitems.yaml to translate shdr id to canonical id?
    //. or do that with a path-to-canonicalId translator?
  }

  // start fetching and processing data
  async start() {
    let instanceId = null
    // get device structures and write to db
    //. will need to compare with existing graph structure in db and add/update as needed
    probe: do {
      // const data = await this.fetchData('probe')
      const data = await Data.getProbe(this.endpoint)
      // if (await unavailable(data)) break probe // waits some time
      instanceId = data.getInstanceId()
      await this.handleProbe(data) // update db

      process.exit(0)

      // get last known values of all dataitems, write to db
      current: do {
        // const data = await this.fetchData('current')
        const data = await Data.get(this.endpoint, 'current')
        // if (await unavailable(data)) break current // waits some time
        if (instanceIdChanged(data, instanceId)) break probe
        await this.handleCurrent(data) // update db

        // get sequence of dataitem values, write to db
        sample: do {
          // // const data = await this.fetchSample()
          // const data = await Data.get(this.endpoint, 'sample')
          // // if (await unavailable(data)) break sample // waits some time
          // if (instanceIdChanged(data, instanceId)) break probe
          // await this.handleSample(data)
          // console.log('.')
          // await libapp.sleep(this.fetchInterval)
        } while (true)
      } while (true)
    } while (true)
  }

  async handleProbe(data) {
    const probeGraph = data.getProbeGraph() // get probe data into graph structure
    // libapp.print(probeGraph)
    // const dbGraph = new Graph()
    // await dbGraph.read(this.db)
    //. now compare probe graph with db graph, update db as needed
    // await probeGraph.write(this.db)
    await probeGraph.synchTo(this.db)
  }

  async handleCurrent(data) {
    // get sequence info from header
    // const { firstSequence, nextSequence, lastSequence } =
    //   data.json.MTConnectStreams.Header
    // this.from = nextSequence
    const dataitems = data.getCurrentData()
    // const dataItems = getDataItems(data)
    // await db.writeDataItems(dataItems)
    // await db.writeGraphValues(graph)
    console.log(dataitems)
  }

  async handleSample(data) {
    // get sequence info from header
    // const header = json.MTConnectStreams.Header
    const header = data.getHeader()
    const { firstSequence, nextSequence, lastSequence } = header
    this.from = nextSequence

    const dataItems = data.getDataItems()
    await this.writeDataItems(dataItems)

    // //. if gap, fetch and write that also
    // const gap = false
    // if (gap) {
    //   const json = await fetchAgentData('sample', sequences.from, sequences.count)
    //   const dataItems = getDataItems(json)
    //   await writeDataItems(db, dataItems)
    // }
  }

  // gather up all items into array, then put all into one INSERT stmt, for speed.
  // otherwise pipeline couldn't keep up.
  // see https://stackoverflow.com/a/63167970/243392 etc
  async writeDataItems(dataItems) {
    //. write to db with arrays - that will translate to sql
    let rows = []
    for (const dataItem of dataItems) {
      let { dataItemId, timestamp, value } = dataItem
      const id = dataItemId
      const _id = this.idMap[id]
      if (_id) {
        value = value === undefined ? 'undefined' : value
        if (typeof value !== 'object') {
          const type = typeof value === 'string' ? 'text' : 'float'
          const row = `('${_id}', '${timestamp}', to_jsonb('${value}'::${type}))`
          rows.push(row)
        } else {
          //. handle arrays
          console.log(`**Handle arrays for '${id}'.`)
        }
      } else {
        console.log(`Unknown element id '${id}', value '${value}'.`)
      }
    }
    if (rows.length > 0) {
      const values = rows.join(',\n')
      const sql = `INSERT INTO history (_id, time, value) VALUES ${values};`
      console.log(sql)
      //. add try catch block - ignore error? or just print it?
      await this.db.query(sql)
    }
  }
}

//

// async function unavailable(data) {
//   if (!data.json) {
//     console.log(`No data available - will wait and try again...`)
//     await libapp.sleep(4000)
//     return true
//   }
//   return false
// }

function instanceIdChanged(data, instanceId) {
  if (data.getInstanceId() !== instanceId) {
    console.log(`InstanceId changed - falling back to probe...`)
    return true
  }
  return false
}
