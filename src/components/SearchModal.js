import React from 'react'
import _ from 'lodash'
import Truncate from 'react-truncate'

const MIN_SEARCH_LENGTH = 3

export default class SearchModal extends React.Component {
  static defaultProps = {
    onEscape: () => {},
    onSearch: () => {},
    onResultClick: () => {},
    results: [],
  }

  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
    this.modalRef = React.createRef()
    this.handleOutsideClick = this.handleOutsideClick.bind(this)
    this.onSearch = _.debounce(
      this.props.onSearch,
      250,
      { maxWait: 1000, trailing: true }
    )
    this.handleSearch = this.handleSearch.bind(this)
    this.state = {currentSearchStr: ''}
  }

  componentDidMount(){
    this.inputRef.current.focus()
    document.addEventListener('mousedown', this.handleOutsideClick, false)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleOutsideClick, false)
  }

  handleOutsideClick(e) {
    const clickedOutsideModal = !this.modalRef.current.contains(e.target)

    if(clickedOutsideModal) {
      this.props.onEscape()
    }
  }

  handleSearch(e) {
    const currentSearchStr = e.target.value
    this.setState({currentSearchStr})

    if(currentSearchStr.length >= 2) {
      this.props.onSearch(currentSearchStr)
    }
  }

  render() {
    const results = this.props.results.slice(0, 11)
    const onResultClick = this.props.onResultClick
    const hasNoResults = results.length === 0 && this.state.currentSearchStr !== ''
    const hasNotSearched = results.length === 0 && this.state.currentSearchStr === ''

    const resultItems = results.map((gem) => {
      return (
        <div key={gem.id} onClick={() => onResultClick(gem)} className='search__result' href='#'>
            <input className='search__result__check' type='checkBox' checked={gem.isSaved} readOnly/>
            <span className='search__result__title'>
              {gem.name}
            </span>
            <p className='search__result__desc'>
              <Truncate lines={3}>
                {gem.description}
              </Truncate>
            </p>
        </div>
      )
    })

    return <div className='search-modal' ref={this.modalRef}>
      <form className="search">
        <input
          type="text"
          ref={this.inputRef}
          className="search__input"
          placeholder="Search Rubygems"
          onChange={this.handleSearch}
        />
      </form>
      <div>
        {hasNotSearched?
          <p>Start searching!</p> : null
        }

        {hasNoResults ?
          <p>No results yet!</p> : null
        }

        {resultItems}
      </div>
    </div>
  }
}
