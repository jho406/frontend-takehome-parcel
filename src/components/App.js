import React from "react"
import logo from '../images/logo.png'
import SearchInput from './SearchInput'
import SavedGemsList from './SavedGemsList'
import {
  combineResultsWithSavedGems,
  fetchGems
} from '../helpers/helpers'
import {connect} from 'react-redux'
import {
  CLEAR_SEARCH_RESULTS,
  REMOVE_SAVED_GEM,
  SAVE_GEM,
  SEARCH_GEMS
} from '../actions.js'

const searchGems = (search_str) => {
  return function(dispatch) {
    return fetchGems(search_str)
    .then((searchResults) => {
      dispatch({
        type: SEARCH_GEMS,
        payload: searchResults
      })
    })
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const savedGems = JSON.parse(window.localStorage.getItem('savedGems') || '{}')
    this.setState({savedGems})
  }

  handleSearch = (search_str) => {
    this.props.dispatch(searchGems(search_str))
  }

  toggleSaveGem = (payload) => {
    const {savedGems} = this.props
    if ({}.hasOwnProperty.call(savedGems, payload.id)) {
      this.removeGem(payload.id)
    } else {
      this.saveGem(payload)
    }
  }

  saveGem = (payload) => {
    this.props.dispatch({
      type: SAVE_GEM,
      payload
    })
  }

  removeGem = (key) => {
    this.props.dispatch({
      type: REMOVE_SAVED_GEM,
      payload: {key}
    })
  }

  clearSearchResults = () => {
    this.props.dispatch({
      type: CLEAR_SEARCH_RESULTS
    })
  }

  render() {
    const {savedGems, searchResults} = this.props
    const searchResultsWithSelection = combineResultsWithSavedGems(searchResults, savedGems)
    const savedItems = Object.values(savedGems).sort((a, b) => {
      return b.createdAt - a.createdAt
    })

    return (
      <div className="container">
        <div className="card card--header">
          <img className="logo" src={logo} />
          <SearchInput
            results={searchResultsWithSelection}
            onResultClick={this.toggleSaveGem}
            onSearch={this.handleSearch}
            onClear={this.clearSearchResults}/>
        </div>
        <SavedGemsList onRemoveClick={this.removeGem} items={savedItems} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps)(App)
