import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import {
  SEARCH_GEMS,
  CLEAR_SEARCH_RESULTS,
  REMOVE_SAVED_GEM,
  SAVE_GEM
} from './actions'

const initialState = {
  searchResults: [],
  savedGems: {}
}

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case SEARCH_GEMS: {
      const {payload} = action
      return {...state, searchResults: payload}
    }
    case CLEAR_SEARCH_RESULTS: {
      return {
        ...state,
        searchResults: []
      }
    }
    case REMOVE_SAVED_GEM: {
      const {savedGems} = state
      const {payload} = action
      delete savedGems[payload.key]
      const copy = {
        ...savedGems
      }
      window.localStorage.removeItem('savedGems', JSON.stringify(savedGems))

      return {
        ...state,
        savedGems: copy,
      }
    }
    case SAVE_GEM: {
      const {savedGems} = state
      const {payload} = action
      const copy = {
        [payload.id]: {...payload},
        ...savedGems
      }
      window.localStorage.setItem('savedGems', JSON.stringify(savedGems))

      return {
        ...state,
        savedGems: copy,
      }
    }
    default:
      return state
  }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default createStore(
  reducer,
  initialState,
  composeEnhancers(applyMiddleware(thunk))
)
