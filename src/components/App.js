import React from "react"
import logo from '../images/logo.png'
import _ from 'lodash'
import SearchInput from './SearchInput'
import SavedGemsList from './SavedGemsList'
import {
  combineResultsWithSavedGems,
  fetchGems
} from '../helpers/helpers'

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      searchResults: [],
      savedGems: {},
    }

    this.saveGem = this.saveGem.bind(this)
    this.removeGem = this.removeGem.bind(this)
    this.toggleSaveGem = this.toggleSaveGem.bind(this)
    this.clearSearchResults = this.clearSearchResults.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
  }

  componentDidMount() {
    const savedGems = JSON.parse(window.localStorage.getItem('savedGems') || '{}')
    this.setState({savedGems})
  }

  handleSearch(search_str) {
    return fetchGems(search_str)
    .then((searchResults) => {
      this.setState({searchResults})
      return Promise.resolve({searchResults})
    })
  }

  toggleSaveGem(payload) {
    const {savedGems} = this.state
    if (savedGems.hasOwnProperty(payload.id)) {
      this.removeGem(payload.id)
    } else {
      this.saveGem(payload)
    }
  }

  saveGem(payload) {
    const {savedGems} = this.state
    savedGems[payload.id] = {...payload, createdAt: Date.now()}
    window.localStorage.setItem('savedGems', JSON.stringify(savedGems))

    this.setState({savedGems})
  }

  removeGem(key) {
    const {savedGems} = this.state
    delete savedGems[key]
    window.localStorage.removeItem('savedGems', JSON.stringify(savedGems))

    this.setState({savedGems})
  }

  clearSearchResults() {
    this.setState({searchResults: []})
  }

  render() {
    const {savedGems, searchResults} = this.state
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
