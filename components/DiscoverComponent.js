import React from 'react';
import {Button, ScrollView, StyleSheet, View} from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import {THE_MOVIE_DB_API_KEY} from 'react-native-dotenv';

const initialQueryString = `https://api.themoviedb.org/3/discover/`;

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
                <View style={{maxHeight: '30%', width: '100%'}}>
                    <ScrollView>
                        <MultiSelect
                            hideTags
                            items={this.movieGenres}
                            uniqueKey="id"
                            onSelectedItemsChange={this.onSelectedMovieItemsChange}
                            selectedItems={this.state.selectedMovieGenres}
                            selectText="Pick some movie genres"
                            searchInputPlaceholderText="Search Genres..."
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
                            autoFocusInput={false}
                        />
                    </ScrollView>
                </View>
                <View style={{maxHeight: '30%', width: '100%'}}>
                    <ScrollView>
                        <MultiSelect
                            hideTags
                            items={this.tvGenres}
                            uniqueKey="id"
                            onSelectedItemsChange={this.onSelectedTVItemsChange}
                            selectedItems={this.state.selectedTvGenres}
                            selectText="Pick some TV genres"
                            searchInputPlaceholderText="Search Genres..."
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
                            autoFocusInput={false}
                        />
                    </ScrollView>
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
