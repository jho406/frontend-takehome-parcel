import React from 'react'

export default class SavedGemsList extends React.Component {
  static defaultProps = {
    onRemoveClick: ()=>{},
    items: [],
  }

  render() {
    const onRemoveClick = this.props.onRemoveClick
    const hasEmptyItems = this.props.items.length === 0
    const savedSearchElements = this.props.items.map((gem) => {
      return (
        <div className='saved-gems__item' key={gem.id}>
          {gem.name}
          <a className='saved-gems__item__remove-link' onClick={() => {onRemoveClick(gem.id)}} href='#'>remove</a>
          <div className='saved-gems__item__description'>{gem.description}</div>
        </div>
      )
    })

    return (
      <div className="card saved-gems">
        <div>Saved searches</div>
        { hasEmptyItems ?
          <div className='saved-gems__empty-notice'>
            There are no items saved yet.
          </div> : null
        }
        {savedSearchElements}
      </div>
    )
  }
}
