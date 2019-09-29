import '../../spec/support/enzyme'
import 'jsdom-global/register'
import { shallow, mount } from 'enzyme'
import React from 'React'
import sinon from 'sinon'
import jasmineEnzyme from 'jasmine-enzyme'
import SavedGemsList from './SavedGemsList'
import SearchInput from './SearchInput'
import App from './App'
import * as appHelpers from '../helpers/helpers'

const localStorageMock = new class {
  store = {};
  setItem = (key, val) => (this.store[key] = val)
  getItem = key => this.store[key]
  removeItem = key => { delete this.store[key] }
  clear = () => (this.store = {})
}()

describe('App', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    })
    jasmine.clock().install
  })

  afterEach(() => {
    localStorageMock.clear()
    jasmine.clock().uninstall();
  })

  describe('render', () => {
    it('renders with a contained SearchInput and SearchModal', () => {
      const component = mount(<App />)

      expect(component.find(SearchInput)).toExist()
      expect(component.find(SavedGemsList)).toExist()
    })

    it('passes a descending list to SavedGemList', () => {
      const component = shallow(<App />)
      component.setState({savedGems: [
        {
          id: 'foo',
          name: 'rails',
          description: 'rails',
          createdAt: 100,
        },
        {
          id: 'bar',
          name: 'spark',
          description: 'spark',
          createdAt: 200
        }
      ]})

      const listProps = component.find(SavedGemsList).props().items
      expect(listProps).toEqual([
        {
          id: 'bar',
          name: 'spark',
          description: 'spark',
          createdAt: 200
        },
        {
          id: 'foo',
          name: 'rails',
          description: 'rails',
          createdAt: 100,
        }
      ])
    })
  })

  describe('behavior', () => {
    it('rehydrates any saved gems from local store', () => {
      const payload = {
        id: 'foo',
        name: 'rails',
        description: 'rails',
      }

      localStorageMock.setItem('savedGems', JSON.stringify(
        {foo: payload}
      ))

      const component = mount(<App />)
      expect(component.state().savedGems).toEqual({foo: payload})
    })
  })

  describe('handleSearch', () => {
    it('fetches gems and sets search results', () => {
      const component = mount(<App />)
      const instance = component.instance()
      const results = [
        {id: 'foo', name: 'rails', description: 'rails'}
      ]

      spyOn(appHelpers, 'fetchGems').and.callFake(() => {
        return Promise.resolve(results)
      })

      return instance.handleSearch('rails').then(() => {
        expect(component.state().searchResults).toEqual(results)
      })
    })
  })

  describe('#saveGem', () => {
    it('saves and timestamps a gem payload',() => {
      const component = mount(<App />)
      const instance = component.instance()
      const baseTime = new Date(2019, 1, 1)

      jasmine.clock().mockDate(baseTime)

      const payload = {
        id: 'foo',
        name: 'rails',
        description: 'rails',
      }

      instance.saveGem(payload)
      const expected = {
        foo: {...payload, createdAt: 1548997200000}
      }

      expect(component.state().savedGems).toEqual(expected)
    })

    it('writes to local storage', () => {
      const component = mount(<App />)
      const instance = component.instance()
      const baseTime = new Date(2019, 1, 1)

      jasmine.clock().mockDate(baseTime)

      const payload = {
        id: 'foo',
        name: 'rails',
        description: 'rails',
      }

      instance.saveGem(payload)
      const expected = {
        foo: {...payload, createdAt: 1548997200000}
      }

      const savedResult = JSON.parse(localStorageMock.getItem('savedGems'))
      expect(savedResult).toEqual(expected)
    })
  })

  describe('#removeGem', () => {
    it('removes the gem from savedGems',() => {
      const component = mount(<App />)
      const instance = component.instance()
      const payload = {
        id: 'foo',
        name: 'rails',
        description: 'rails',
      }
      instance.saveGem(payload)

      instance.removeGem('foo')
      expect(component.state().savedGems).toEqual({})
    })

    it('removes the gem from localStorage',() => {
      const component = mount(<App />)
      const instance = component.instance()
      const payload = {
        id: 'foo',
        name: 'rails',
        description: 'rails',
      }

      instance.saveGem(payload)
      expect(
        localStorageMock.getItem('savedGems')
      ).not.toBeUndefined()

      instance.removeGem('foo')
      expect(
        localStorageMock.getItem('savedGems')
      ).toBeUndefined()
    })
  })

  describe('#toggleSaveGem', () => {
    it('adds the gem, then removes it when called a second time',() => {
      const component = mount(<App />)
      const instance = component.instance()
      const payload = {
        id: 'foo',
        name: 'rails',
        description: 'rails',
      }
      const savedGemsLength = () => {
        return Object.keys(component.state().savedGems).length
      }

      expect(savedGemsLength()).toEqual(0)

      instance.saveGem(payload)
      expect(savedGemsLength()).toEqual(1)

      instance.removeGem(payload.id)
      expect(savedGemsLength()).toEqual(0)
    })
  })

  describe('#clearSearchResults', () => {
    it('removes the gem from savedGems',() => {
      const component = mount(<App />)
      const instance = component.instance()
      const payload = {
        id: 'foo',
        name: 'rails',
        description: 'rails',
      }
      instance.setState({searchResults: [payload]})
      expect(component.state().searchResults).toEqual([payload])

      instance.clearSearchResults()
      expect(component.state().searchResults).toEqual([])
    })
  })
})


