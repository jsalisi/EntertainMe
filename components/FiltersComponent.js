import React from 'react';
import {Button, ScrollView, StyleSheet, View} from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import {THE_MOVIE_DB_API_KEY} from 'react-native-dotenv';

export default class FiltersComponent extends React.Component {
    constructor(props) {
        super(props);
        this.movieGenres = props.movieGenres;
        this.state = {
            selectedMovieGenres: []
        };
    }

    onSelectedItemsChange = (selectedMovieGenres) => {
        this.setState({selectedMovieGenres})
    };

    _fetchResults = () => {
        const initialQueryString = `https://api.themoviedb.org/3/discover/movie?api_key=${THE_MOVIE_DB_API_KEY}&`;
        let movieQuery = `${initialQueryString}with_genres=${this.state.selectedMovieGenres.join(',')}`;

        fetch(movieQuery)
            .then((response) => response.json())
            .then((response) => {
                console.log(response);
            });
    };

    render() {
        const {selectedMovieGenres} = this.state;
        return (
            <View style={StyleSheet.absoluteFill}>
                <ScrollView>
                    <MultiSelect
                        hideTags
                        items={this.movieGenres}
                        uniqueKey="id"
                        onSelectedItemsChange={this.onSelectedItemsChange}
                        selectedItems={selectedMovieGenres}
                        selectText="Pick some movie genres"
                        searchInputPlaceholderText="Search Genres..."
                        altFontFamily="ProximaNova-Light"
                        tagRemoveIconColor="#CCC"
                        tagBorderColor="#CCC"
                        tagTextColor="#CCC"
                        selectedItemTextColor="#CCC"
                        selectedItemIconColor="#CCC"
                        itemTextColor="#000"
                        displayKey="name"
                        searchInputStyle={{color: '#CCC'}}
                        submitButtonColor="#CCC"
                        submitButtonText="Done"
                    />
                    <Button
                        onPress={this._fetchResults}
                        title='Search'
                        color='#841584'
                    />
                </ScrollView>
            </View>
        )
    }
}