import React from 'react'
import SearchModal from './SearchModal'

export default class SearchInput extends React.Component {
  static defaultProps = {
    onSearch: () => {},
    onClear: () => {},
    onResultClick: () => {},
    results: [],
  }

  constructor(props) {
    super(props)
    this.state = {isActive: false}
  }

  activateSearch = () => {
    this.setState({isActive: true})
  }

  deactivateSearch = () => {
    this.setState({isActive: false})
  }

  clearAndDeactivate = () => {
    this.deactivateSearch()
    this.props.onClear()
  }

  render() {
    const {isActive} = this.state

    return <div className="search">
      <input
        type="text"
        className="search__input--faux"
        value=""
        placeholder="Search Rubygems"
        onFocus={this.activateSearch}
        readOnly
      />
      {isActive ? <SearchModal
        results={this.props.results}
        onSearch={this.props.onSearch}
        onResultClick={this.props.onResultClick}
        onEscape={this.clearAndDeactivate}
      /> : null}
    </div>
  }
}
