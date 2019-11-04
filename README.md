# Jeopardy Clue Finder

## Description
**Jeopardy Clue Finder** is a web application that allows users to view Jeopardy trivia questions and filter by category, difficulty, date range, and clue name. In addition, users can add clues to a favorites collection, which will be temporarily saved until the page is refreshed. 

## Getting Started
The application is live on [GitHub Pages](https://mwang2700.github.io/jeopardy-clue-finder/). If the limit on API calls (see 'Why Limit API Calls') has been reached there, the application is also live on [Heroku](https://radiant-peak-34358.herokuapp.com/).
Clues will immediately begin loading and displaying.

## Functionality
Initially, 2500 clues will be gradually loaded in when the pages is loaded, summing to 25 api calls to the [API](http://jservice.io/). These clues are unfiltered and will continue to load in (but not display) up to the 2,500 amount even if a filter option is selected. 

### Clue Cards
The main panel contains the clues displayed. The clue cards are rendered in a 'flippy' component, which allows the display to flip when hovered over. The front side shows the category name, difficulty (point value), and clue name/description. The backside shows the answer to the question. If the user clicks on the backside of the card (after it fully flips) while hovering over it, that clue will be added into their temporary favorites. This temporary favorites collection is reset when the user leaves or refreshes the page.
Note that some information in the API is missing on certain cards. This information isn't processed out in this application (in order to accurately represent the amount of clues for certain filters), so the user may see incompleted clue cards being rendered.

### Filters
The search bar on the top allows users to filter by string of characters contained in the clue itself. For example, if I type in 'Atlanta' into the search bar, all clues that contain the word 'Atlanta' will show.

The category selection allows users to filter by category name. Each different category selection completes a new api call, adding on to the total number of api calls. These categories start loading in initially when the page is opened, but only 1000 out of the total 18500 categories will be loaded in, amounting to 10 api calls (see [Why Limit API Calls](#Why-Limit-API-Calls "Goto Why-Limit-API-Calls")).

The difficulty filter functionality contains two options. The first is the quantifier that specifies whether the user would like to search by difficulties less than the amount, equal to the amount, or greater than the amount. The second allows users to select among the set possible jeopardy point values. Note that, for example, 'greater than or equal to' filtering can be done by doing 'greater than' the number below it.

The date filter allows the user to specify a date range for which the airdate of the clues displayed should fall under. The jservice api seems to work best when both dates are specified, so the user is required to enter both start and end dates for the filter to enable.

The favorites filter allows the user to filter between viewing all cards, viewing only cards that are favorited, and viewing only cards that aren't favorited. As said earlier, favorites are cleared when the user leaves/refreshes the page.

Any filter that features an API call (so using any filter except '=' in difficulty, the clue name search, or the favorites filter) will only display up to 100 cards for results. Categories typically don't have more than 10 cards within them, so this doesn't affect too much. This is done to limit api calls (see 'Why Limit API Calls').

### Load All Button
The load all button allows all of the non-filtered cards to be loaded. This affects cards displayed when no sidebar filters are selected, or when only the difficulty filter is used with '=', since any other filter combinations causes a new api call to be made. This is only added to show that the option is possible, since getting all of the cards takes a long time and also doesn't work in the GitHub Pages version (see the 'Why Limit API Calls' section).

### Sidebar
The sidebar is responsive dependent on active screen width. Once the width goes below a certain value, the sidebar will retract and can be toggled through a hamburger icon. Otherwise, the sidebar will remain docked on the left hand side. The card width is dependent on the initial screen width when the page is loaded.

## Why Limit API Calls

Due to the fact that jservice is http and GitHub Pages uses https, a service called [CORS Anywhere](https://cors-anywhere.herokuapp.com/) was used. Unfortunately, there's a limitation on the amount of API calls that can be made hourly with CORS Anywhere. In the scope of this being a challenge, I decided not to host CORS Anywhere on my own server, as the only user would be the person judging this. Since I didn't host it on my own server, this restriction becomes a problem if the user wants to view all cards using the View All button. As a result, in reality, the site can only be used a limited number of times in an hour. 

I chose to stick with CORS Anywhere regardless since I felt that it could be reasonably extrapolated that the rest of the data could be loaded in similarly to how it was in this application (just scaled up). I didn't want users to have to enable loading unsafe scripts in their browser just to view any clue. 

## Components Used

* React.js
* react-select
* react-select-fast-filter-options
* react-virtualized-select
* react-flippy
* react-js-pagination
* react-sidebar
* axios
* CORS Anywhere

The jeopardy clue information is retrieved from jservice.io and Jeopardy (NBC). The jeopardy logo used is also from Jeopardy (NBC)
