import 'whatwg-fetch'
//Used for Cypress to stub XMLHTTPRequest.
//Won't get used if window.fetch already exist in production

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
  return fetch(`http://localhost:3000/api/v1/search.json?query=${name}`)
    .then((response) => {
      return response.json()
    })
    .then(transformRubyGemsResponse)
}
