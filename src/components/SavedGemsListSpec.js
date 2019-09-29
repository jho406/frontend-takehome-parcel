import '../../spec/support/enzyme'
import { mount } from 'enzyme'
import React from 'React'
import sinon from 'sinon'
import SavedGemsList from './SavedGemsList'

describe('SavedGemsList', () => {
  describe('render', () => {
    it('renders with a fallback empty message', () => {
      const handle = '.saved-gems__empty-notice'
      const expectedMsg = 'There are no items saved yet.'

      const component = mount(<SavedGemsList/>)
      expect(component.find(handle)).toHaveText(expectedMsg)
    })

    it('renders a list of gems when items are passed', () => {
      const handle = '.saved-gems__item'
      const items = [
        {id: 'foo', name: 'rails', description: 'rails'},
        {id: 'bar', name: 'sprok', description: 'sprok'}
      ]

      const component = mount(<SavedGemsList items={items}/>)

      expect(component).toContainMatchingElements(2, handle)
      expect(component.find(handle)).not.toHaveText('There are no items saved yet.')
      expect(component.find(handle).at(0)).toIncludeText('rails')
      expect(component.find(handle).at(1)).toIncludeText('sprok')
    })
  })

  describe('behavior', () => {
    it('fires onRemoveClick with an id when the remove link is clicked', () => {
      const handle = '.saved-gems__item__remove-link'
      const spy = sinon.spy()
      const items = [
        {id: 'foo', name: 'rails', description: 'rails'},
      ]

      let component = mount(<SavedGemsList items={items} onRemoveClick={spy}/>)
      component.find(handle).simulate('click')

      expect(spy.calledWith('foo')).toBe(true)
      expect(spy.callCount).toEqual(1)
    })
  })
})
