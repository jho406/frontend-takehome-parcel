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
    const {
      results,
      onSearch,
      onResultClick,
    } = this.props

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
        results={results}
        onSearch={onSearch}
        onResultClick={onResultClick}
        onEscape={this.clearAndDeactivate}
      /> : null}
    </div>
  }
}
