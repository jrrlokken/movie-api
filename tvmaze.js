/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 * http://api.tvmaze.com/search/shows?q=search_query
 * http://api.tvmaze.com/shows/<show_id>/episodes
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async so it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */

async function searchShows(query) {
  let response = await axios.get(
    `https://api.tvmaze.com/search/shows?q=${query}`
  );
  let shows = response.data.map((result) => {
    let show = result.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image
        ? show.image.medium
        : "https://via.placeholder.com/300/6C757D/FFFFFF?text=Show+image+unavailable",
    };
  });
  return shows;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 mb-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src='${show.image}'>
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button type="button" class="btn btn-primary m-2" data-toggle="modal" data-target="#episodesModal">Episodes</button>
           </div>
         </div>
       </div>
      `
    );
    $showsList.append($item);
  }
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(event) {
  $("#shows-list").empty();
  // $("#shows-area").show();
  // $("#episodes-list").empty();
  // $("#episodes-area").hide();

  event.preventDefault();
  let query = $("#search-query").val();
  if (!query) return;

  let shows = await searchShows(query);
  populateShows(shows);
  $("#search-query").val("");
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  let response = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  let episodes = response.data.map((result) => {
    let episode = result;
    return {
      id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number,
    };
  });
  return episodes;
}

function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();

  for (let episode of episodes) {
    let $item = $(
      `<li>${episode.name} (Season ${episode.season} - Episode ${episode.number})</li>`
    );
    $episodesList.append($item);
    // $("#episodes-area").show();
  }
}

/* Handle click on show to display episodes */
$("#shows-list").on("click", "button", async function handleEpisodes() {
  let showId = $(this).parent().parent().attr("data-show-id");
  let episodes = await getEpisodes(showId);
  // $("#shows-list").hide();
  populateEpisodes(episodes);
});

/* Back button on episode list */
// $("#back-button").on("click", function () {
//   $("#episodes-area").hide();
//   $("#shows-list").show();
// });
