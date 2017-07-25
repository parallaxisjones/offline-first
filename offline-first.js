import _ from 'lodash'
import {fromJs} from 'immutable'

let projectOrderReducer = (order, value, key) => {
     /* value should be an array of edges */
     if(Array.isArray(value)) {
       value.forEach(edge => {
         order[key][_.lowerCase(edge.target.kind] = edge.target
       })
     }

     return order
}

let watcherReducer = (watchers = []) => watchers.reduce(
  (watching, dbResult) => watching[dbResult.id] = dbResult.source,{}
)

let formatOrderState = (orders = []) =>
  _.chain(orders)
  .groupBy(order => order.orderId)
  .reduce(projectOrderReducer, {})

let ensureResponseState = project => fromJs({
  id: project.id || null,
  watchers: watcherReducer(project.watchers || []),
  orders: formatOrderState(project.orders || [])
})


//define mutations to the state only
//getting happens in context, the reducer wil ALWAYS return the whole state
// ie, vm.state.project.get('id')
// ie, vm.state.project.getIn(['orders', id])
function ProjectPlanningReducer(state = Project, {type, payload}){
  switch(action.type) {
    case 'INIT_PROJECT':
      /* expect payload to be either a brand new project, or a rehydrated one*/
      let project = ensureResponseState(payload)
      return state.withMutations( s =>
        s
        .set('id', project.id)
        .set('watchers', project.watchers)
        .set('orders', project.orders)
      )
    case 'FOLLOW_PROJECT':
      let {watcherId = null, contact = {}} = payload;
      return state.setIn(['watchers', watcherId], contact)
    case 'UNFOLLOW_PROJECT':
      let watcherId = payload;
      return state.deleteIn(['watchers', watcherId], contact)
    case 'ADD_BOUNDARY':
      let {orderId = null, boundary = {}} = payload;
      return state.setIn(['orders', orderId, 'boundaries'], boundary)
    case 'REMOVE_BOUNDARY':
      let {boundaryId = '', orderId = ''}  = payload;
      return state.deleteIn(['orders', orderId, 'boundaries', boundaryId])
    case 'ADD_PRODUCT':
      let {orderId = null, product = {}} = payload;
      return state.setIn(['orders', orderId, 'products'], boundary)
    case 'REMOVE_PRODUCT':
      let {productId = null, orderId = {}} = payload;
      return state.setIn(['orders', orderId, 'products', productId]) 
    case 'DELETE_ORDER'
    default:
      return state
  }
}
