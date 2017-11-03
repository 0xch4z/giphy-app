const API_KEY = '2GHWX9XpvxXgO8OUWi1pgsSpVB8SgFx6'
const BASE_URL = 'https://api.giphy.com/v1/gifs/search'

const topics = [
  'Curb Your Enthusiasm',
  'The Office',
  'Silicon Valley',
  'Portlandia',
  'Narcos',
  'Keye and Peele',
  'Cats',
  'Monkeys',
].map(t => ({ tag: t }))

function makeQuery(term) {
  return `${BASE_URL}?q=${term}&api_key=${API_KEY}&limit=10&rating=pg`
}

function makeGifCardFragment({ rating, images, title }) {
  return `
    <div class="col s12 m6 l4">
      <div class="card">
        <div class="card-image">
          <img
            class="gif"
            src="${images.original_still.url}"
            still="${images.original_still.url}"
            animated="${images.original.url}"
            state="still"
          />
          <span class="rating">${rating}</span>
        </div>
        <div class="card-content">
          <strong>${title || 'No name ):'}</strong>
        </div>
      </div>
    </div>
  `
}

function test(term) {
  $.getJSON(makeQuery(term), (res) => {
    console.log(res.data)
  })
}

function renderChips() {
  $('#chips').material_chip({
    data: topics
  })
}

function addTopic(topic) {
  topics.push({ tag: topic })
  renderChips()
}

function fetchGifs(term) {
  $.getJSON(makeQuery(term), (res) => {
    const { data } = res
    // make gif elements
    let markup = '';
    for (const result of data) {
      markup += makeGifCardFragment(result)
    }
    // append to gifs
    $('#gifs').children().eq(0).html(markup)
  })
}

$('#search').submit((e) => {
  e.preventDefault()
  const term = $('#term').val()
  addTopic(term)  
  fetchGifs(term)
})

$('#gifs').on('click', '.gif', function() {
  const state = $(this).attr('state')
  const stillImg = $(this).attr('still')
  const animatedImg = $(this).attr('animated')
  if (state === 'still') {
    $(this).attr('src', animatedImg)
    $(this).attr('state', 'animated')
  } else {
    $(this).attr('src', stillImg)
    $(this).attr('state', 'still')
  }
})

$('#chips').on('chip.select', function(e, chip) {
  fetchGifs(chip.tag)
})

renderChips()
fetchGifs('Curb Your Enthusiasm')
