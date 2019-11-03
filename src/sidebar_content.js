import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from 'react-virtualized-select';
import createFilterOptions from 'react-select-fast-filter-options';
import MaterialTitlePanel from "./material_title_panel";
import 'react-select/dist/react-select.css';
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css';
import './sidebar_content.css';

const styles = {
  sidebar: {
    width: 350,
    height: "100%"
  },
  sidebarLink: {
    display: "block",
    padding: "16px 0px",
    color: "#757575",
    textDecoration: "none",
    fontSize: "1.5rem"
  },
  divider: {
    margin: "8px 0",
    height: 1,
    backgroundColor: "#757575"
  },
  content: {
    padding: "16px",
    height: "100%",
    backgroundColor: "white",
    position: "absolute"
  }
};

class SidebarContent extends Component { 

  constructor(props) {
    super(props);

    this.timeout = 0;

    this.state = {
      props: props,
      categories: props.categories,
      difficulty: '',
      favorites: '',
      categorySelected: ''
    }

    this.difficultyOptions = []; 
    for (let i = 100; i <= 1000; i+=100) {
      if (i !== 700 && i !== 900) {
        this.difficultyOptions.push({
          label: i.toString(),
          value: i
        })
      }
    }

    this.onDifficultyChange = this.onDifficultyChange.bind(this);
    this.onCategoryChange = this.onCategoryChange.bind(this);
    this.onLoadAllPress = this.onLoadAllPress.bind(this);
    this.onFavoritesChange = this.onFavoritesChange.bind(this);
  }

  onCategoryChange(categorySelected) {
    this.setState({
      categorySelected
    });
    if (categorySelected === null) {
      this.state.props.categoryChangeListener(-1);
    } else {
      this.state.props.categoryChangeListener(categorySelected.value)
    }
  }

  onDifficultyChange(difficulty) {
    this.setState({
      difficulty
    });
    if (difficulty === null) {
      this.state.props.difficultySearchListener('');
    } else {
      this.state.props.difficultySearchListener(difficulty.value);
    }
  }

  onFavoritesChange(favorites) {
    this.setState({
      favorites
    });
    if (favorites === null) {
      this.state.props.favoritesListener('');
    } else {
      this.state.props.favoritesListener(favorites.value);
    }
  }

  onLoadAllPress(event) {
    this.state.props.fetchAllCards(2500);
  }

  onLoadAllQueryPress(event) {
    this.state.props.queryChanged(true);
  }

  render() {
    const style = this.state.props.style
    ? { ...styles.sidebar, ...this.state.props.style }
    : styles.sidebar;

    const options = this.state.categories;
    const filterOptions = createFilterOptions({ options });

    const favoritesOptions = [{ label: "View All", value: "View All" }, 
                              { label: "View Only Favorites", value: "View Only Favorites"}, 
                              { label: "View All But Favorites", value: "View All But Favorites"}];

    //const favoritesDDOptions = ["View All", "View Only Favorites", "View All But Favorites"];   

    const difficultyOptions = this.difficultyOptions;
    const diffFilterOptions = createFilterOptions({ difficultyOptions });
    const favoritesFilterOptions = createFilterOptions({ favoritesOptions });
    const links = [];    

    links.push(
      <div key="1" className="cat" style = {styles.sidebarLink}>
        Category
      </div>
    );

    links.push(
      <Select
        autosize = {false}
        key="2"
        className = "mt-4 col-md-8 col-offset-4"
        options={options} 
        name="categorySelected" 
        onChange = {this.onCategoryChange}
        searchable = {true}
        clearable = {true}
        value = {this.state.categorySelected}
        filterOptions = {filterOptions}
      />
    );

    links.push(
      <div key="3" className="diff" style = {styles.sidebarLink}>
        Difficulty
      </div>
    );

    links.push(
      <div key = "4" className = "difficultyOps">
        <span>
          <select className="difficultyDD" onChange={this.state.props.difficultyChangeListener}>
            <option value = {0}> = </option>
            <option value = {1}> &gt; </option>
            <option value = {2}> &lt; </option>
          </select>
        </span>
        <span>
          <Select
            styles={{
              width: `500px`
            }}
            autosize = {false}
            key = "6"
            options={difficultyOptions} 
            name="difficulty" 
            className = "difficulty"
            onChange = {this.onDifficultyChange}
            searchable = {true}
            clearable = {true}
            value = {this.state.difficulty} 
            filterOptions = {diffFilterOptions}
          />
        </span>
      </div>
    );

    links.push(
      <div key="7" className="date" style = {styles.sidebarLink}>
        Date
      </div>
    );

    links.push(
      <div key = "8" className="dateBounds">
        <span>
          <input 
            type="date" 
            className = "startDate" 
            id="startDate" 
            onChange={this.state.props.startDateListener} 
          />
        </span> 
        to
        <span>
          <input 
            type="date" 
            className = "endDate"
            id="endDate" 
            onChange={this.state.props.endDateListener} 
          />
        </span>
      </div>
    );

    links.push(
      <div key="9" className="fav" style = {styles.sidebarLink}>
        Favorites
      </div>
    );

    links.push(
      <Select
        autosize = {false}
        key="10"
        options={favoritesOptions} 
        name="favorites" 
        onChange = {this.onFavoritesChange}
        searchable = {true}
        clearable = {true}
        value = {this.state.favorites}
        filterOptions = {favoritesFilterOptions}
      />
    );

    links.push(
      <div key = "11" className= "loadAll" style = {styles.sidebarLink}>
        Load All Cards
      </div>
    );

    links.push(
      <div key = "12" className = "loadAllButton">
        <button className = "loadButton" onClick = {this.onLoadAllPress}> Load All</button>
      </div>
    );

    links.push(
      <div key = "13" className = "loadAllQueryButton">
        <button className = "loadQueryButton" onClick = {this.onLoadAllQueryPress}> Load All in Query </button>
      </div>
    );

    return (
      <MaterialTitlePanel title="Filter Results" style={style}>
        <div style={styles.content}>
          {links} 
        </div>
      </MaterialTitlePanel>
    );
  }
};

SidebarContent.propTypes = {
  style: PropTypes.object
};

export default SidebarContent;