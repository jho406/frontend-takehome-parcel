import '../../spec/support/enzyme'
import { mount } from 'enzyme'
import React from 'React'
import SearchInput from './SearchInput'
import SearchModal from './SearchModal'

describe('SearchInput', () => {
  describe('render', () => {
    it('renders with a Search Rubygems placeholder', () => {
      const handle = '.search__input--faux'
      const expectedMsg = 'Search Rubygems'

      const component = mount(<SearchInput/>)
      expect(component.find(handle).props().placeholder).toEqual(expectedMsg)
    })
  })

  describe('behavior', () => {
    it('shows the search modal on focus', () => {
      const handle = '.search__input--faux'
      const component = mount(<SearchInput/>)

      expect(component.find(SearchModal).exists()).toBe(false)
      component.find(handle).simulate('focus')
      expect(component.find(SearchModal).exists()).toBe(true)
    })

    it('it dismisses the search modal on out of focus', () => {
      const handle = '.search__input--faux'
      const component = mount(<SearchInput/>)

      component.find(handle).simulate('focus')
      expect(component.find('.search-modal').exists()).toBe(true)

      document.dispatchEvent(new Event('mousedown'))
      component.update()
      expect(component.find('.search-modal').exists()).toBe(false)
    })
  })
})
