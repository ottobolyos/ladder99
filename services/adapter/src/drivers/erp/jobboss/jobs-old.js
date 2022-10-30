// async getJob(jobbossId) {
//   // get the most recently started job for this workcenter/device.
//   // could also use where work_center='MARUMATSU', but not guaranteed unique.
//   // status is C=complete, S=started?, O=ongoing?
//   // make sure status is not complete, ie C.
//   const sql = `
//     select top 1
//       Job --, Est_Required_Qty, Act_Run_Qty
//     from
//       Job_Operation
//     where
//       WorkCenter_OID = '${jobbossId}'
//       and Status <> 'C'
//       and Actual_Start is not null
//     order by
//       Actual_Start desc
//   `
//   // pool error handler should catch any errors, but add try/catch in case not
//   let job
//   try {
//     const result = await this.pool.query(sql)
//     // 'Job' must match case of sql
//     // use NONE to indicate no job
//     job = result?.recordset[0]?.Job || 'NONE'
//   } catch (error) {
//     console.log(`JobBoss jobs ${device.name} error`, error.message)
//     console.log(`JobBoss jobs sql`, sql)
//   }
//   return job
// }

// // handle jobnum for this device
// handleJob(device, job) {
//   // initialize last job if not set
//   this.lastJobs[device.id] = this.lastJobs[device.id] ?? job

//   // if job changed, and not transitioning from NONE, record time completed.
//   // if a job changes TO NONE though, it will be recorded.
//   //. what about UNAVAILABLE? or do we ever get that?
//   //. could also query db for estqty,runqty here and update those?
//   // ie Est_Required_Qty, Act_Run_Qty
//   const oldJob = this.lastJobs[device.id]
//   if (job !== oldJob) {
//     console.log(`JobBoss jobs ${device.name} job ${oldJob} to ${job}`)
//     if (oldJob !== 'NONE') {
//       const now = new Date().toISOString()
//       // this key corresponds to path 'processes/job/process_time-complete'
//       this.cache.set(`${device.id}-jcomplete`, now)
//     }
//     this.lastJobs[device.id] = job // bug: had this inside the oldJob !== 'NONE' block, so didn't update
//   }
// }

//---------

// const job = await this.getJob(jobbossId)
// if (job === undefined) continue // skip this device

// // set cache value
// //. what if could attach some code to this cache key?
// // eg you'd have some code that would output shdr,
// // and some code that would set the jcomplete time on change.
// // note: this key corresponds to path 'processes/job/process_aggregate_id-order_number'
// this.setValue('job', job)

// get jobcount for today
//. should we reset this daily or keep a running total?
// running total would be more useful - handle arbitrary time ranges
//. uhh how do that from adapter though?
// i guess we'd need another meter to do a life count for jobs. yeah?
// umm, yeah we'd need to handle jobcounts DECREASING also.
// unlike for the partcount. except ignore them on datechange.

// this.handleJob(device, job)
