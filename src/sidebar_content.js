import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from 'react-virtualized-select';
import createFilterOptions from 'react-select-fast-filter-options';
import MaterialTitlePanel from "./material_title_panel";
import DropdownMenu from './DropdownMenu';
import FavoritesDropdown from './FavoritesDropdown';
import DifficultySearchBox from './DifficultySearchBox';
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
    backgroundColor: "white"
  }
};

class SidebarContent extends Component { 

  constructor(props) {
    super(props);

    this.state = {
      props: props,
      categories: props.categories,
      categorySelected: ''
    }

    this.onDifficultyChange = this.onDifficultyChange.bind(this);
    this.onCategoryChange = this.onCategoryChange.bind(this);
    this.onLoadAllPress = this.onLoadAllPress.bind(this);
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

  onDifficultyChange(event) {
    const reg = /^[0-9\b]+$/;
    if(event.target.value === '' || reg.test(event.target.value)) {
      this.state.props.difficultySearchListener(event.target.value)
    } else {
      this.state.props.difficultySearchListener('')
    }
  }

  onLoadAllPress(event) {
    this.state.props.fetchAllCards(2500);
  }

  render() {
    const style = this.state.props.style
    ? { ...styles.sidebar, ...this.state.props.style }
    : styles.sidebar;

    const options = this.state.categories;
    const filterOptions = createFilterOptions({ options });

    const difficultyDDOptions = ["=", ">", "<"];
    const favoritesDDOptions = ["View All", "View Only Favorites", "View All But Favorites"];
    const links = [];    

    links.push(
      <div key="1" className="cat" style = {styles.sidebarLink}>
        Category
      </div>
    );

    links.push(
      <Select
        key="2"
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
      <div key = "4">
        <span>
          <DropdownMenu key="5" 
            className="difficultyDD" 
            options = {difficultyDDOptions} 
            listener = {this.state.props.difficultyChangeListener}
          />
        </span>
        <span>
         <DifficultySearchBox key="6"
            className="difficultySB"
            searchChange = {this.onDifficultyChange}
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
      <div key="10" className="favorites">
        <FavoritesDropdown key="11" 
          className="favoritesDD" 
          options = {favoritesDDOptions} 
          listener = {this.state.props.favoritesListener}
        />
      </div>
    );

    links.push(
      <div key = "11" className= "loadAll" style = {styles.sidebarLink}>
        Load All Cards
      </div>
    );

    links.push(
      <div key = "12" className = "loadAllText">
        By default, up to 2500 clues are loaded. If there are any additional
        clues, press the button below to load them (note that this slow down
        your browser and will take a while).        
      </div>
    );

    links.push(
      <div key = "13" className = "loadAllButton">
        <button className = "loadButton" onClick = {this.onLoadAllPress}> Load </button>
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