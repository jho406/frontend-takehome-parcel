export const combineResultsWithSavedGems = (searchResults, savedGems) => {
  return searchResults.map((result) => {
    const id = result.id
    if (savedGems.hasOwnProperty(id)) {
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
