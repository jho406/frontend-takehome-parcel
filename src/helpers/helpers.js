import 'whatwg-fetch'
//On e2e, the above is used for Cypress to stub XMLHTTPRequest.
//On dev and production, window.fetch is used.

const BASE_URL = 'http://localhost:3000'

export const combineResultsWithSavedGems = (searchResults, savedGems) => {
  return searchResults.map((result) => {
    const id = result.id
    if ({}.hasOwnProperty.call(savedGems, id)) {
      return {...result, isSaved: true}
    } else {
      return {...result, isSaved: false}
    }
  })
}

export const transformRubyGemsResponse = (data) => {
  return data.map((gem) => {
    return {
      id: gem['gem_uri'],
      name: gem['name'],
      description: gem['info']
    }
  })
}

export const fetchGems = (name) => {
  return fetch(`${BASE_URL}/api/v1/search.json?query=${name}`)
    .then((response) => {
      return response.json()
    })
    .then(transformRubyGemsResponse)
}
