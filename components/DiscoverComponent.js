import React from 'react';
import {Button, StyleSheet, View, Dimensions} from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import SectionedMultiSelect from 'react-native-sectioned-multi-select'
import {THE_MOVIE_DB_API_KEY} from 'react-native-dotenv';

const initialQueryString = `https://api.themoviedb.org/3/discover/`;

const screenHeight = (Dimensions.get('window').height);
const screenWidth = (Dimensions.get('window').width);

const items = [
    {  
      name: "Fruits",
      id: 0,
      children: [{
          name: "Apple",
          id: 10,
        },{
          name: "Strawberry",
          id: 17,
        },{
          name: "Pineapple",
          id: 13,
        },{
          name: "Banana",
          id: 14,
        },{
          name: "Watermelon",
          id: 15,
        },{
          name: "Kiwi fruit",
          id: 16,
        }]
    },
    {
      name: "Gems",
      id: 1,
      children: [{
          name: "Quartz",
          id: 20,
        },{
          name: "Zircon",
          id: 21,
        },{
          name: "Sapphire",
          id: 22,
        },{
          name: "Topaz",
          id: 23,
        }]
    },
    {
      name: "Plants",
      id: 2,
      children: [{
          name: "Mother In Law\'s Tongue",
          id: 30,
        },{
          name: "Yucca",
          id: 31,
        },{
          name: "Monsteria",
          id: 32,
        },{
          name: "Palm",
          id: 33,
        }]
    },
  ]

export default class DiscoverComponent extends React.Component {
    constructor(props) {
        super(props);
        this.movieGenres = props.movieGenres;
        this.tvGenres = props.tvGenres;
        this.state = {
            selectedMovieGenres: [],
            selectedTvGenres: [],
            movieResults: [],
            tvResults: []
        };
    }

    onSelectedMovieItemsChange = (selectedMovieGenres) => {
        this.setState({
            selectedMovieGenres: selectedMovieGenres
        })
    };

    onSelectedTVItemsChange = (selectedTvGenres) => {
        this.setState({
            selectedTvGenres: selectedTvGenres
        })
    };

    _fetchFiltersResults = () => {
        let movieQuery = `${initialQueryString}movie?api_key=${THE_MOVIE_DB_API_KEY}&with_genres=${this.state.selectedMovieGenres.join(',')}`;
        let tvQuery = `${initialQueryString}tv?api_key=${THE_MOVIE_DB_API_KEY}&with_genres=${this.state.selectedTvGenres.join(',')}`;
        this._fetchAllResults(movieQuery);
        this._fetchAllResults(tvQuery);
    };

    _fetchAllResults = (query) => {
        fetch(query)
            .then((response) => response.json())
            .then((response) => {
                this.setState({
                    movieResults: response
                });
            });

        fetch(query)
            .then((response) => response.json())
            .then((response) => {
                this.setState({
                    tvResults: response
                });
            });
    };


    render() {
        return (
            <View style={StyleSheet.absoluteFill}>
                <View style={styles.viewSelectStyle}>
                    <View>
                    <SectionedMultiSelect
                        items={[{id: 0, name: 'Movie Genres', children: this.movieGenres}]} 
                        uniqueKey='id'
                        subKey='children'
                        selectText="Pick some movie genres"
                        expandDropDowns={true}
                        showDropDowns={false}
                        readOnlyHeadings={true}
                        onSelectedItemsChange={this.onSelectedMovieItemsChange}
                        selectedItems={this.state.selectedMovieGenres}
                        colors={{primary: 'lightgray'}}
                        styles={{ confirmText: { color: 'black' }, selectToggleText: { fontWeight: 'bold' } }}
                        onConfirm={() => console.log(this.state.selectedMovieGenres)}
                        />
                    </View>
                </View>
                <View style={styles.viewSelectStyle}>
                    <SectionedMultiSelect
                        items={[{id: 0, name: 'TV Genres', children: this.tvGenres}]} 
                        uniqueKey='id'
                        subKey='children'
                        selectText="Pick some TV genres"
                        expandDropDowns={true}
                        showDropDowns={false}
                        readOnlyHeadings={true}
                        onSelectedItemsChange={this.onSelectedTVItemsChange}
                        selectedItems={this.state.selectedTvGenres}
                        colors={{primary: 'lightgray'}}
                        styles={{ confirmText: { color: 'black' }, selectToggleText: { fontWeight: 'bold' } }}
                        onConfirm={() => console.log(this.state.selectedTvGenres)}
                        />
                </View>
                <View style={styles.button}>
                <Button
                    onPress={this._fetchFiltersResults}
                    title='Search'
                    color='#841584'
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    viewSelectStyle: {
        maxHeight: '40%', 
        width: '95%', 
        marginLeft:'2.5%', 
        marginBottom: '2.5%', 
        backgroundColor: 'white'
    },
    button:{
        maxHeight: '40%', 
        width: '95%', 
        marginLeft:'2.5%'
    }
})