import '../../spec/support/enzyme'
import 'jsdom-global/register'
import { mount } from 'enzyme'
import React from 'React'
import sinon from 'sinon'
import jasmineEnzyme from 'jasmine-enzyme'
import SearchModal from './SearchModal'

describe('SearchModal', () => {
  beforeEach(() => {
    window.requestAnimationFrame = function(callback) {
      setTimeout(callback, 0)
    }

    window.cancelAnimationFrame = () => {}
  })

  describe('render', () => {
    it('renders with a start searching message', () => {
      const handle = '.search-modal'
      const expectedMsg = 'Start searching!'

      const component = mount(<SearchModal/>)
      expect(component.find('.search__input')).toExist()
      expect(component.find(handle)).toHaveText(expectedMsg)
    })

    it('renders with a No results yet! when a search returns no results', () => {
      const handle = '.search-modal'
      const expectedMsg = 'No results yet!'
      const component = mount(<SearchModal results={[]}/>)
      const input = component.find('input')
      input.instance().value = 'foobar'
      input.simulate('change')

      expect(component.find(handle)).toHaveText(expectedMsg)
    })

    it('renders a list of results', () => {
      const fakeResults = [
        {id: 'foo', name: 'ruby', description: 'ruby one', isSaved: false},
        {id: 'bar', name: 'spar', description: 'spar one', isSaved: false}
      ]

      const component = mount(<SearchModal results={fakeResults}/>)
      expect(component).toContainMatchingElements(2, '.search__result')
    })

    it('renders a list of results and add elipsis to lines that are too long', () => {
      const description = `Ruby on Rails is a full-stack
        web framework optimized for programmer happiness and
        sustainable productivity. It encourages beautiful code
        by favoring convention over configuration`

      const fakeResults = [
        {id: 'foo', name: 'ruby', description, isSaved: false},
      ]

      const component = mount(<SearchModal results={fakeResults}/>)
      expect(component).toIncludeText('…')
    })

    it('renders a list of results with checked boxes', () => {
      const handle = '.search-modal__result__check'
      const fakeResultsWithFirstOneTrue = [
        {id: 'foo', name: 'ruby', description: 'ruby one', isSaved: true},
        {id: 'bar', name: 'spar', description: 'spar one', isSaved: false}
      ]

      const component = mount(<SearchModal results={fakeResultsWithFirstOneTrue}/>)
      expect(component.find(handle).at(0).prop('checked')).toBe(true)
      expect(component.find(handle).at(1).prop('checked')).toBe(false)
    })
  })

  describe('behavior', () => {
    it('fires onSearch when typing 2 or more chars', () => {
      const handle = '.search-modal'
      const expectedMsg = 'Start searching...'

      const spy = sinon.spy()
      const component = mount(<SearchModal onSearch={spy}/>)
      const input = component.find('input')
      input.instance().value = 'fo'
      input.simulate('change')

      expect(spy.calledWith('fo')).toBe(true)
    })

    it('does not fires onSearch when typing less than 2 chars', () => {
      const handle = '.search-modal'
      const expectedMsg = 'Start searching...'

      const spy = sinon.spy()
      const component = mount(<SearchModal onSearch={spy}/>)
      const input = component.find('input')
      input.instance().value = 'f'
      input.simulate('change')

      expect(spy.called).toBe(false)
    })

    it('fires onEscape when clicking outside the modal', () => {
      const handle = '.outside'
      const spy = sinon.spy()

      const component = mount(<SearchModal onEscape={spy}/>)

      document.dispatchEvent(new Event('mousedown'))
      expect(spy.called).toBe(true)
    })

    it('does not fire onEscape when clicking inside the modal', () => {
      const handle = '.outside'
      const spy = sinon.spy()

      const component = mount(<SearchModal onEscape={spy}/>)
      component.getDOMNode().dispatchEvent(new Event('mousedown'))
      expect(spy.called).toBe(false)
    })

    it('fires onResultClick when a result item is clicked', () => {
      const handle = '.search__result'
      const spy = sinon.spy()

      const fakeResults = [
        {id: 'foo', name: 'ruby', description: 'ruby one', isSaved: false},
        {id: 'bar', name: 'spar', description: 'spar one', isSaved: false}
      ]

      const component = mount(<SearchModal results={fakeResults} onResultClick={spy}/>)
      component.find(handle).at(0).simulate('click')
      expect(spy.calledWith(fakeResults[0])).toBe(true)
    })
  })
})

