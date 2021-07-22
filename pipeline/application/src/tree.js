import * as libapp from './libapp.js'

// get flat list of nodes from given json tree
export function getElements(json) {
  const els = []
  traverse(json, els)
  return els
}

const ignore = () => {}

const elHandlers = {
  _declaration: ignore,
}

// traverse a tree of elements, adding them to an array
//. refactor, add comments
function traverse(el, els, parentTag = '', parentKey = '', parents = []) {
  if (libapp.isObject(el)) {
    let obj = { tag: parentTag, parents }
    // iterate over key-value pairs
    for (const [key, value] of Object.entries(el)) {
      if (key === '_declaration') {
        // ignore, eg { _attributes: { version: '1.0', encoding: 'UTF-8' }
      } else if (key === '_instruction') {
        // ignore, eg { 'xml-stylesheet': 'type="text/xsl" href="/styles/Devices.xsl"' }
      } else if (key === '_attributes') {
        // eg value = { id: 'd1', name: 'M12346', uuid: 'M80104K162N' }
        obj = { ...obj, ...value, parents }
      } else if (key === '_text') {
        // eg value = 'Mill w/Smooth-G'
        obj = { ...obj, value, parents }
      } else if (key === 'Agent') {
        //. ignore Agent info for now
      } else {
        // recurse
        const newparents = [...parents, obj] // push obj onto parents path list
        traverse(value, els, key, '', newparents)
      }
    }
    // get prop, eg 'DataItem(event,availability)'
    if (obj.tag === 'DataItem') {
      obj.prop =
        obj.parents.slice(4).map(getPathStep).join('/') + '/' + getPathStep(obj)
      // ditch leading '/' and double '//'
      if (obj.prop.startsWith('/')) obj.prop = obj.prop.slice(1)
      obj.prop = obj.prop.replaceAll('//', '/')
      // get device, eg 'Device(a234)'
      obj.device = getPathStep(obj.parents[3])
    }
    // obj.path = obj.device + '/' + obj.prop
    delete obj.parents
    els.push(obj)
  } else if (Array.isArray(el)) {
    for (const subel of el) {
      // recurse
      traverse(subel, els, parentTag, parentKey, parents)
    }
  } else {
    console.log('>>what is this?', { el })
  }
}

// ignore these element types - don't add much info to the path
const ignoreTags = new Set(
  'AssetCounts,Devices,DataItems,Components,Filters,Specifications'.split(',')
)

// ignore these DataItem attributes - not necessary to identify an element,
// or are redundant.
const ignoreAttributes = new Set(
  'category,type,subType,_key,tag,parents,id,units,nativeUnits'.split(',')
)

// get path step string for the given object.
// eg if it has tag='DataItem', get params like it's a fn,
// eg return 'DataItem(event,asset_changed,discrete=true)'
function getPathStep(obj) {
  let params = []
  if (!obj) return ''
  if (ignoreTags.has(obj.tag)) return ''
  switch (obj.tag) {
    case 'Device':
      params = [obj.uuid] // standard says name may be optional in future versions, so use uuid
      break
    case 'DataItem':
      params = [obj.category, obj.type]
      if (obj.subType) params.push(obj.subType)
      for (const key of Object.keys(obj)) {
        if (!ignoreAttributes.has(key)) {
          params.push(key + '=' + obj[key])
        }
      }
      break
    case 'Specification':
    case 'Composition':
      params = [obj.type]
      if (obj.subType) params.push(obj.subType)
      break
    default:
      // don't give param if it's like "Systems(systems)" - indicates just one in a document
      if ((obj.name || '').toLowerCase() !== (obj.tag || '').toLowerCase()) {
        // params = [obj.id] //. or obj.name ?? sometimes one is nicer than the other
        params = [obj.name || obj.id || '']
      }
      break
  }
  const paramsStr =
    params.length > 0 && params[0].length > 0
      ? '(' + params.map(param => param.toLowerCase()).join(',') + ')'
      : ''
  const step = `${obj.tag}${paramsStr}`
  return step
}
