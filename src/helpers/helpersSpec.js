import {
  transformRubyGemsResponse,
  combineResultsWithSavedGems,
  fetchGems
} from './helpers'
import fetchMock from 'fetch-mock'

describe('helpers', () => {
  describe('fetchGems', () => {
    it('makes a request to search RubyGems.org', () => {
      const response = [{
        "gem_uri":"https://rails.gem",
        "name": "rails",
        "info": "This is rails",
        "other_information": 'foobar'
        }, {
        "gem_uri":"https://sprockets.gem",
        "name": "sprockets",
        "info": "This is sprockets",
        "other_information": 'foobar'
        },
      ]

      fetchMock
        .mock('http://localhost:3000/api/v1/search.json?query=rails', {
          body: response,
        })

      const searchResult = [{
        "id":"https://rails.gem",
        "name": "rails",
        "description": "This is rails",
        }, {
        "id":"https://sprockets.gem",
        "name": "sprockets",
        "description": "This is sprockets",
        },
      ]

      return fetchGems('rails').then((result) => {
        expect(result).toEqual(searchResult)
      })
    })
  })

  describe('combineResultsWithSavedGems', () => {
    it('merges a savedGems list with the search results', () => {
      const savedGems = {
        "https://rails.gem": {
          "id":"https://rails.gem",
          "name": "rails",
          "description": "This is rails",
        },
      }

      const searchResult = [{
        "id":"https://rails.gem",
        "name": "rails",
        "description": "This is rails",
        }, {
        "id":"https://sprockets.gem",
        "name": "sprockets",
        "description": "This is sprockets",
        },
      ]

      const expected = [{
          id: "https://rails.gem",
          name: "rails",
          description: "This is rails",
          isSaved: true
        }, {
          id:"https://sprockets.gem",
          name: "sprockets",
          description: "This is sprockets",
          isSaved: false
        },
      ]

      const result = combineResultsWithSavedGems(searchResult, savedGems)
      expect(result).toEqual(expected)
    })
  })

  describe('transformRubyGemsResponse', () => {
    it('takes a rubygems.com response and picks out the fields we need', () => {
      const response = [{
        "gem_uri":"https://rails.gem",
        "name": "rails",
        "info": "This is rails",
        "other_information": 'foobar'
        }, {
        "gem_uri":"https://sprockets.gem",
        "name": "sprockets",
        "info": "This is sprockets",
        "other_information": 'foobar'
        },
      ]

      const expected = [{
        "id":"https://rails.gem",
        "name": "rails",
        "description": "This is rails",
        }, {
        "id":"https://sprockets.gem",
        "name": "sprockets",
        "description": "This is sprockets",
        },
      ]

      const result = transformRubyGemsResponse(response)
      expect(result).toEqual(expected)
    })
  })
})
