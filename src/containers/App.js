import React, { Component } from 'react';
import axios from 'axios';
import Sidebar from 'react-sidebar';
import Pagination from 'react-paginate';
import SidebarContent from './sidebar_content';
import SearchBox from '../components/SearchBox';
import MaterialTitlePanel from './material_title_panel';
import CardList from '../components/CardList';
import './App.css';


const styles = {
  contentHeaderMenuLink: {
    textDecoration: "none",
    color: "white",
    padding: 8
  },
  content: {
    padding: "16px"
  }
};


const mql = window.matchMedia(`(min-width: 1200px)`);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allCards: [],
      filteredCards: [],
      allCategories: [],
      docked: mql.matches,
      searchfield: '',
      categoryindex: -1,
      difficulty: 0,
      difficultyfield: '',
      dateStart: '',
      dateEnd: '', 
      favorites: new Set(),
      favoritesMode: 0,
      open: false,
      activePage: 1,
      itemsPerPage: 10,
      useFiltered: 0
    };

    // DiffFilteredCards represents the filtered cards for filters that aren't queried in the
    // API call.
    this.diffFilteredCards = [];
    this.timeout = 0;

    this.fetchCategories = this.fetchCategories.bind(this);
    this.fetchAllCards = this.fetchAllCards.bind(this);
    this.fetchCards = this.fetchCards.bind(this);
    this.fetchInitialCards = this.fetchInitialCards.bind(this);
    this.queryChanged = this.queryChanged.bind(this);
    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.onSetOpen = this.onSetOpen.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onCategoryChange = this.onCategoryChange.bind(this);
    this.onDifficultyChange = this.onDifficultyChange.bind(this);
    this.onDifficultySearchChange = this.onDifficultySearchChange.bind(this);
    this.onStartDateChange = this.onStartDateChange.bind(this);
    this.onEndDateChange = this.onEndDateChange.bind(this);
    this.onFavoritesDDChange = this.onFavoritesDDChange.bind(this);
    this.addToFavorites = this.addToFavorites.bind(this);
  }

  fetchCategories(currOffset) {
    try {
      axios.get('https://cors-anywhere.herokuapp.com/http://jservice.io/api/categories?offset=' + currOffset + 
                '&count=100')
          .then((response) =>  {
            let category = response.data; 
            if (currOffset <= 900) {
              // Adds all the JSON data to the allCategories array in state.
              for (let i = 0; i < category.length; i++) { 
                // While it's better practice to use setState here, I directly accessed/pushed on
                // the state's allCategories here to prevent excessive re-rendering.
                this.state.allCategories.push({
                  label: category[i].title, 
                  value: category[i].id.toString()
                });
              }
              // Recursively calls fetchCategories to call the API for the next set of 100.
              this.fetchCategories(currOffset+100);
            } 
      });
    } catch (error) {
      console.log(error);
    }
  }

  fetchAllCards(offset) {
    try {
      let cards = [];
      axios.get('https://cors-anywhere.herokuapp.com/http://jservice.io/api/clues?offset=' + offset)
        .then((response) => {
          let data = response.data;
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              if (data[i].category !== undefined) {
                // Since italics can't get processed, remove them.
                let removedTags = data[i].answer.replace('<i>','').replace('</i>','');
                // Pushes a clue card object onto the temporary cards array
                cards.push(
                  {
                    listener: this.addToFavorites,
                    key: data[i].id,
                    id: data[i].id,
                    clue: data[i].question,
                    category: data[i].category.title,
                    difficulty: data[i].value,
                    answer: removedTags,
                    airDate: data[i].airdate
                  }
                );
              }
            }
            // Recursively calls to keep going
            this.fetchAllCards(offset+100)
            // Retrieves current cards in state, then sets state, combining the new ones on.
            let currCards = this.state.allCards;
            this.setState({
                allCards: currCards.concat(cards)
            });
          }
      });
    } catch (error) {
      console.log(error);
    }
  }

  fetchInitialCards(offset) {
    try {
      let cards = [];
      axios.get('https://cors-anywhere.herokuapp.com/http://jservice.io/api/clues?offset=' + offset)
        .then((response) => {
          let data = response.data;
          // Only renders 2500 cards, 25 api calls.
          if (offset <= 2400) {
            for (let i = 0; i < data.length; i++) {
              if (data[i].category !== undefined) {
                // Since italics can't get processed, remove them.
                let removedTags = data[i].answer.replace('<i>','').replace('</i>','');
                // Push card object onto array
                cards.push(
                  {
                    listener: this.addToFavorites,
                    key: data[i].id,
                    id: data[i].id,
                    clue: data[i].question,
                    category: data[i].category.title,
                    difficulty: data[i].value,
                    answer: removedTags,
                    airDate: data[i].airdate
                  }
                );
              }
            }
            // Recursively calls to keep going 
            this.fetchInitialCards(offset+100)
            // Retrieves current cards in state, then sets state, combining the new ones on.
            let currCards = this.state.allCards;
            this.setState({
                allCards: currCards.concat(cards)
            });
          }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async fetchCards(query) {
    try {
      let cards = [];
      // Only difference between this and regular fetchcards is that this has parameters in
      // API call, and doesn't get called recursively (only happens once).
      axios.get('https://cors-anywhere.herokuapp.com/http://jservice.io/api/clues', query)
        .then((response) => {
          let data = response.data;
          for (let i = 0; i < data.length; i++) {
            let removedTags = data[i].answer.replace('<i>','').replace('</i>','');
            cards.push(
              {
                listener: this.addToFavorites,
                key: data[i].id,
                id: data[i].id,
                clue: data[i].question,
                category: data[i].category.title,
                difficulty: data[i].value,
                answer: removedTags,
                airDate: data[i].airdate
              } 
            );
          }
          this.setState({
            filteredCards: [...cards],
          });
        });
    } catch (error) {
      console.log(error);
    }
  }

  queryChanged() {
    // In order to allow time for state to adjust (needed due to async/sync features in JS),
    // timeout is set to 50 ms.
    setTimeout(
      function() {
          // Resets the filtered cards since the query has changed.
          this.diffFilteredCards = [];
          // Rebuilding a query.
          let query = {
            params: {}
          };
          // Handles if a category is selected
          if (this.state.categoryindex !== -1) {
            query.params.category = this.state.categoryindex.toString();
          }
          // Handles if a start date is specified. 
          let dateStart = this.state.dateStart;
          let dateEnd = this.state.dateEnd;
          // API seems to work best for dates when both are specified.
          if (dateStart !== '' && dateEnd !== '') {
            var s = new Date(parseInt(dateStart.substring(0, 4)),
                             parseInt(dateStart.substring(5, 7)-1),
                             parseInt(dateStart.substring(8, 10)-1),
                             20,
                             0,
                             0);
            query.params.min_date = s;
            var e = new Date(parseInt(dateEnd.substring(0, 4)),
                             parseInt(dateEnd.substring(5, 7)-1),
                             parseInt(dateEnd.substring(8, 10)),
                             19,
                             59,
                             0);
            query.params.max_date = e;
          }
          // Handles if there's a valid difficulty selection.
          if (this.state.difficulty === 0 && this.state.difficultyfield !== '') {
            query.params.value = this.state.difficultyfield;
          }
          // Checks if there were queries specified. If so, indicate in the state that 
          // the filtered array should be used later on in render. Otherwise, use
          // allCards array in state.
          if (Object.keys(query.params).length !== 0) {
            this.setState({
              useFiltered: 1
            });
            this.fetchCards(query);
          } else {
            this.setState({
              useFiltered: 0
            });
          }
      }
      .bind(this),
      50
    );

  }

  componentDidMount() {
    document.title = 'Jeopardy Clue Finder'
    // mql listener allows sidebar to be responsive.
    mql.addListener(this.mediaQueryChanged);
    this.fetchCategories(0);
    this.fetchInitialCards(0);
  }

  componentWillUnmount() {
    mql.removeListener(this.mediaQueryChanged);
  }

  onSetOpen(open) {
    this.setState({ open });
  }

  mediaQueryChanged() {
    this.setState({
      docked: mql.matches,
      open: false
    });
  }

  toggleOpen(ev) {
    this.setState({open: !this.state.open});

    if (ev) {
      ev.preventDefault();
    }
  }

  // Handles the searchbar being changed. Receives input until the user stops typing for a 
  // full second to prevent excessive re-rendering.
  onSearchChange = (event) => {
    event.persist();
    this.event = event;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.setState({
        searchfield: this.event.target.value
      });
    }, 1000);
  }

  // Handles a change in category. Just updates state and updates query to call the api.
  onCategoryChange = (event) => {
    this.setState({
      categoryindex: event
    });
    this.queryChanged();
  }

  // Handles a change in difficulty. Sets state, update query.
  onDifficultyChange = (event) => {
    if (event === -1) {
      this.setState({
        difficulty: -1
      })
      this.queryChanged();
    } else {
      event.persist();
      this.setState({
        difficulty: parseInt(event.target.value)
      });
      this.queryChanged();
    }
  }

  // Handles a change in difficulty search. Sets state, update query.
  onDifficultySearchChange = (event) => {
    this.setState({
      difficultyfield: event
    });
    this.queryChanged();
  }

  // Handles a change in start date. Sets state, update query.
  onStartDateChange = (event) => {
    event.persist();
    this.setState({
      dateStart: event.target.value
    });
    this.queryChanged();
  }

  // Handles a change in end date. Sets state, update query.
  onEndDateChange = (event) => {
    event.persist();
    this.setState({
      dateEnd: event.target.value
    });
    this.queryChanged();
  }

  // Handles a change in difficulty dropdown. Sets state.
  onFavoritesDDChange = (event) => {
    let mode = 0;
    if (event === "View Only Favorites") {
      mode = 1;
    } else if (event === "View All But Favorites") {
      mode = 2;
    }
    this.setState({
      favoritesMode: mode
    });
  }

  // Changing the page for pagination. Triggers when another page is selected.
  changePage(data) {
    let selected = data.selected + 1;

    this.setState({
      activePage: selected
    });
  }

  // When a card is clicked, adds to the favorites array in state.
  addToFavorites = (id) => {
    let favs = this.state.favorites;
    if (favs.has(id)) {
      favs.delete(id);
    } else {
      favs.add(id);
    }
    this.setState({
      favorites: favs
    });
  }

  render() { 
    // Stores the listeners and other information into an object to be passed to the sidebar
    // as props.
    const sidebarContentProps = {
      categoryChangeListener: this.onCategoryChange,
      difficultyChangeListener: this.onDifficultyChange,
      difficultySearchListener: this.onDifficultySearchChange,
      startDateListener: this.onStartDateChange,
      endDateListener: this.onEndDateChange,  
      favoritesListener: this.onFavoritesDDChange,
      categories: this.state.allCategories,
      fetchAllCards: this.fetchAllCards,
      queryChanged: this.queryChanged
    };
    const sidebar = <SidebarContent {...sidebarContentProps}/>;

    const contentHeader = (
      <span>
        {!this.state.docked && (
          <a
            onClick={this.toggleOpen}
            href="/"
            style={styles.contentHeaderMenuLink}
          >
            =
          </a>
        )}
        <span className="title"> 
          Jeopardy Clue Finder 
        </span>
        <span className="inner"> 
          <SearchBox className="search" searchChange = {this.onSearchChange} text = "Search clue name"/> 
        </span>
      </span>
    );

    const sidebarProps = {
      sidebar,
      docked: this.state.docked,
      open: this.state.open,
      onSetOpen: this.onSetOpen,
    };

    // Calculates necessary information for pagination.
    var indexOfLast = this.state.activePage * this.state.itemsPerPage;
    var indexOfFirst = indexOfLast - this.state.itemsPerPage;
    var pages;    

    var listOfCards = (this.state.useFiltered === 0) ? this.state.allCards : this.state.filteredCards;
    var cardRef = listOfCards;

    // Filters if there's something in the search field.
    if (this.state.searchfield !== '') {
      cardRef = listOfCards.filter(item => item.clue.toLowerCase().includes(this.state.searchfield.toLowerCase())); 
    }

    // Filters if either '>' or '<' is selected in difficulty.
    // Doing three separate filters is technically faster, as doing them in one would 
    // guarantee that three filters are done for every card, as opposed to one filter done for
    // every, another done for some of those many, and a third done for the remaining of the many.
    if (this.state.difficultyfield !== '' && this.state.difficulty >= 1) {
      if (this.diffFilteredCards.length === 0) {
        let difficulty = parseInt(this.state.difficultyfield);
        if (this.state.difficulty === 1) {
          this.diffFilteredCards = cardRef.filter(item => item.difficulty > difficulty);
        } else if (this.state.difficulty === 2) {
          this.diffFilteredCards = cardRef.filter(item => item.difficulty < difficulty);
        }
      }
      cardRef = this.diffFilteredCards;
    } else {
      this.diffFilteredCards = [];
    }

    // Checks whether favorites mode is on.
    if (this.state.favoritesMode === 1) {
      cardRef = cardRef.filter(item => this.state.favorites.has(item.id));
    } else if (this.state.favoritesMode === 2) {
      cardRef = cardRef.filter(item => !this.state.favorites.has(item.id));
    }
    // Now that the intended filtered cards are known, the first page is slice off
    // to be displayed.
    let cardsToRender = cardRef.slice(indexOfFirst, indexOfLast);
    pages = Math.max(Math.trunc(cardRef.length / this.state.itemsPerPage), 1);

    return (
      <Sidebar {...sidebarProps}>
        <MaterialTitlePanel title={contentHeader} className = "title-panel">
          <div style={styles.content} className = "panel-heading">    
            <CardList cards={cardsToRender} favorited = {this.state.favorites} />
          </div>
          <div className = "panel-body">
            <div id = "react-paginate">
              <Pagination
                previousLabel = {'<'}
                nextLabel = {'>'}
                breakLabel = {'...'}
                breakClassName={'break-me'}
                pageCount={pages}
                marginPageDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange = {this.changePage.bind(this)}
                containerClassName={'pagination'}
                subContainerClassName = {'pages pagination'}
                activeClassName={'active'}
              />
            </div>
          </div>
        </MaterialTitlePanel>
      </Sidebar>
    );
  }
}

export default App;
