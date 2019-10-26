import React, { Component } from 'react';
import axios from 'axios';
import Sidebar from 'react-sidebar';
import Pagination from 'react-paginate';
import SidebarContent from './sidebar_content';
import SearchBox from './SearchBox';
import MaterialTitlePanel from './material_title_panel';
import CardList from './CardList';
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
      difficulty: -1,
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
    axios.get('https://cors-anywhere.herokuapp.com/http://jservice.io/api/categories?offset=' + currOffset + 
              '&count=100')
        .then((response) =>  {
          let category = response.data; 
          if (currOffset <= 18400) {
            for (let i = 0; i < category.length; i++) { 
              this.state.allCategories.push({
                label: category[i].title, 
                value: category[i].id.toString()
              });
            }
            this.fetchCategories(currOffset+100);
          } 
    });
  }

  fetchAllCards(offset) {
    let cards = [];
    axios.get('https://cors-anywhere.herokuapp.com/http://jservice.io/api/clues?offset=' + offset)
      .then((response) => {
        let data = response.data;
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].category !== undefined) {
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
          }
          this.fetchAllCards(offset+100)
          let currCards = this.state.allCards;
          this.setState({
              allCards: currCards.concat(cards)
          });
        }
    });
  }

  fetchInitialCards(offset) {
    let cards = [];
    axios.get('https://cors-anywhere.herokuapp.com/http://jservice.io/api/clues?offset=' + offset)
      .then((response) => {
        let data = response.data;
        if (offset <= 2400) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].category !== undefined) {
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
          }
          this.fetchInitialCards(offset+100)
          let currCards = this.state.allCards;
          this.setState({
              allCards: currCards.concat(cards)
          });
        }
    });
  }

  async fetchCards(query) {
    let cards = [];
    axios.get('http://jservice.io/api/clues', query)
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
  }

  queryChanged(catId, dateS, dateE, difficulty, difficultyfield) {
    setTimeout(
      function() {
          this.diffFilteredCards = [];
          let query = {
            params: {}
          };
          if (this.state.categoryindex !== -1) {
            query.params.category = this.state.categoryindex.toString();
      //      this.fetchCards(query);
          }
          let dateStart = this.state.dateStart;
          if (dateStart !== '') {
            var s = new Date(parseInt(dateStart.substring(0, 4)),
                             parseInt(dateStart.substring(5, 7)-1),
                             parseInt(dateStart.substring(8, 10)),
                             0,
                             0,
                             0);
            query.params.min_date = s;
          }
          let dateEnd = this.state.dateEnd;
          if (dateEnd !== '') {
            var e = new Date(parseInt(dateEnd.substring(0, 4)),
                             parseInt(dateEnd.substring(5, 7)-1),
                             parseInt(dateEnd.substring(8, 10)),
                             0,
                             0,
                             0);
            query.params.max_date = e;
          }
          if (this.state.difficulty === 0 && this.state.difficultyfield !== '') {
            query.params.value = this.state.difficultyfield;
          }
          // if (this.state.favoritesMode !== 0) {

          // }

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

  onCategoryChange = (event) => {
    this.setState({
      categoryindex: event
    });
    this.queryChanged();
  }

  onDifficultyChange = (event) => {
    let difficulty = 0;
    if (event === ">") {
      difficulty = 1;
    } else if (event === "<") {
      difficulty = 2;
    }
    this.setState({
      difficulty: difficulty
    });
    this.queryChanged();
  }

  onDifficultySearchChange = (event) => {
    this.setState({
      difficultyfield: event
    });
    this.queryChanged();
  }

  onStartDateChange = (event) => {
    event.persist();
    this.setState({
      dateStart: event.target.value
    });
    this.queryChanged();
  }

  onEndDateChange = (event) => {
    event.persist();
    this.setState({
      dateEnd: event.target.value
    });
    this.queryChanged();
  }

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

  changePage(data) {
    let selected = data.selected + 1;

    this.setState({
      activePage: selected
    });
  }

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
    const sidebarContentProps = {
      categoryChangeListener: this.onCategoryChange,
      difficultyChangeListener: this.onDifficultyChange,
      difficultySearchListener: this.onDifficultySearchChange,
      startDateListener: this.onStartDateChange,
      endDateListener: this.onEndDateChange,  
      favoritesListener: this.onFavoritesDDChange,
      categories: this.state.allCategories,
      fetchAllCards: this.fetchAllCards
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
        <span className="title"> Jeopardy Clue Finder </span>
        <span className="inner"> <SearchBox className="search" searchChange = {this.onSearchChange} text = "Search clue name"/> </span>
      </span>
    );

    const sidebarProps = {
      sidebar,
      docked: this.state.docked,
      open: this.state.open,
      onSetOpen: this.onSetOpen,
    };

    var indexOfLast = this.state.activePage * this.state.itemsPerPage;
    var indexOfFirst = indexOfLast - this.state.itemsPerPage;
    var pages;    

    var listOfCards = (this.state.useFiltered === 0) ? this.state.allCards : this.state.filteredCards;
    var cardRef = listOfCards;

    if (this.state.searchfield !== '') {
      cardRef = listOfCards.filter(item => item.clue.toLowerCase().includes(this.state.searchfield.toLowerCase())); 
    }

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
    } 
    if (this.state.favoritesMode === 1) {
      cardRef = cardRef.filter(item => this.state.favorites.has(item.id));
    } else if (this.state.favoritesMode === 2) {
      cardRef = cardRef.filter(item => !this.state.favorites.has(item.id));
    }
    let cardsToRender = cardRef.slice(indexOfFirst, indexOfLast);
    pages = Math.max(Math.trunc(cardRef.length / this.state.itemsPerPage), 1);

    return (
      <Sidebar {...sidebarProps}>
        <MaterialTitlePanel title={contentHeader}>
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
                pageRangeDisplayed={10}
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
