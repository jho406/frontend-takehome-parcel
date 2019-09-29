import '../../spec/support/enzyme'
import { mount } from 'enzyme'
import React from 'React'
import sinon from 'sinon'
import SavedGemsList from './SavedGemsList'

describe('SavedGemsList', () => {
  describe('render', () => {
    it('renders an empty message when no items are passed', () => {
      const handle = '.saved-gems__empty-notice'
      const expectedMsg = 'There are no items saved yet.'
      const items = [
        {id: 'foo', name: 'rails', description: 'rails'}
      ]

      let wrapper = mount(<SavedGemsList/>)
      expect(wrapper.find(handle)).toHaveText(expectedMsg)

      wrapper = mount(<SavedGemsList items={items}/>)
      expect(wrapper.find(handle)).not.toHaveText(expectedMsg)
    })

    it('renders a list of gems when items are passed', () => {
      const handle = '.saved-gems__item'
      const items = [
        {id: 'foo', name: 'rails', description: 'rails'},
        {id: 'bar', name: 'sprok', description: 'sprok'}
      ]

      const wrapper = mount(<SavedGemsList items={items}/>)

      expect(wrapper).toContainMatchingElements(2, handle)
      expect(wrapper.find(handle).at(0)).toIncludeText('rails')
      expect(wrapper.find(handle).at(1)).toIncludeText('sprok')
    })
  })

  describe('behavior', () => {
    it('fires onRemoveClick with an id when the remove link is clicked', () => {
      const handle = '.saved-gems__item__remove-link'
      const spy = sinon.spy()
      const items = [
        {id: 'foo', name: 'rails', description: 'rails'},
      ]

      let wrapper = mount(<SavedGemsList items={items} onRemoveClick={spy}/>)
      wrapper.find(handle).simulate('click')

      expect(spy.calledWith('foo')).toBe(true)
      expect(spy.callCount).toEqual(1)
    })
  })
})
