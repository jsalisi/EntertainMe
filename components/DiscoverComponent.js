import React from 'react';
import {Button, Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select'
import {THE_MOVIE_DB_API_KEY} from 'react-native-dotenv';
import FlatlistComponent from "./FlatlistComponent";

const initialQueryString = `https://api.themoviedb.org/3/discover/`;

const screenHeight = (Dimensions.get('window').height);
const screenWidth = (Dimensions.get('window').width);

export default class DiscoverComponent extends React.Component {
    constructor(props) {
        super(props);
        this.movieGenres = props.movieGenres;
        this.tvGenres = props.tvGenres;
        this.navigation = props.navigation;
        this.movieRatings = [
            {id: 'G', name: 'G'},
            {id: 'PG', name: 'PG'},
            {id: 'PG-13', name: 'PG-13'},
            {id: 'R', name: 'R'},
            {id: 'NC-17', name: 'NC-17'},
        ];
        this.tvRatings = [
            {id: 'TV-Y', name: 'TV-Y'},
            {id: 'C', name: 'C'},
            {id: 'TV-Y7', name: 'TV-Y7'},
            {id: 'TV-G', name: 'TV-G'},
            {id: 'TV-PG', name: 'TV-PG'},
            {id: 'TV-14', name: 'TV-14'},
            {id: 'TV-MA', name: 'TV-MA'}
        ];
        this.state = {
            selectedMovieGenres: [],
            selectedTvGenres: [],
            selectedMovieRatings: [],
            selectedTVRatings: [],
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

    onSelectedMovieRatingItemsChange = (selectedRatings) => {
        this.setState({
            selectedMovieRatings: selectedRatings
        })
    };

    onSelectedTVRatingItemsChange = (selectedRatings) => {
        this.setState({
            selectedTVRatings: selectedRatings
        })
    };

    _fetchFiltersResults = () => {
        let movieQuery = `${initialQueryString}movie?api_key=${THE_MOVIE_DB_API_KEY}&with_genres=${this.state.selectedMovieGenres.join(',')}&certification_country=US&certification=${this.state.selectedMovieRatings.join(',')}`;
        let tvQuery = `${initialQueryString}tv?api_key=${THE_MOVIE_DB_API_KEY}&with_genres=${this.state.selectedTvGenres.join(',')}&certification_country=US&&certification=${this.state.selectedTVRatings.join(',')}`;
        console.log(movieQuery);
        Promise.all([
            this._fetchResults(movieQuery),
            this._fetchResults(tvQuery)
        ]).then((res) => {
            this.setState({
                movieResults: res[0],
                tvResults: res[1]
            })
        })
    };

    _fetchResults = (query) => {
        return new Promise((resolve) => {
            fetch(query)
                .then((response) => response.json())
                .then((response) => {
                    resolve(response.results)
                })
        })
    };

    render() {
        return (
            <View style={StyleSheet.absoluteFill}>
                <ScrollView>
                    <View style={styles.viewSelectContainer}>
                        <View style={styles.viewSelectStyle}>
                            <View>
                                <SectionedMultiSelect
                                    items={[{id: 0, name: 'Movie Genres', children: this.movieGenres}]}
                                    uniqueKey='id'
                                    subKey='children'
                                    selectText="Movie genres"
                                    expandDropDowns={true}
                                    showDropDowns={false}
                                    readOnlyHeadings={true}
                                    showRemoveAll={true}
                                    onSelectedItemsChange={this.onSelectedMovieItemsChange}
                                    selectedItems={this.state.selectedMovieGenres}
                                    colors={{primary: 'lightgray'}}
                                    styles={{confirmText: {color: 'black'}, selectToggleText: {fontWeight: 'bold'}}}
                                    onConfirm={() => console.log(this.state.selectedMovieGenres)}
                                />
                            </View>
                        </View>
                        <View style={styles.viewSelectStyle}>
                            <SectionedMultiSelect
                                items={[{id: 0, name: 'TV Genres', children: this.tvGenres}]}
                                uniqueKey='id'
                                subKey='children'
                                selectText="TV genres"
                                expandDropDowns={true}
                                showDropDowns={false}
                                showRemoveAll={true}
                                readOnlyHeadings={true}
                                onSelectedItemsChange={this.onSelectedTVItemsChange}
                                selectedItems={this.state.selectedTvGenres}
                                colors={{primary: 'lightgray'}}
                                styles={{confirmText: {color: 'black'}, selectToggleText: {fontWeight: 'bold'}}}
                                onConfirm={() => console.log(this.state.selectedTvGenres)}
                            />
                        </View>
                    </View>
                    <View style={styles.viewSelectContainer}>

                        <View style={styles.viewSelectStyle}>
                            <SectionedMultiSelect
                                items={[{id: 0, name: 'Rating', children: this.movieRatings}]}
                                uniqueKey='id'
                                subKey='children'
                                selectText="Movie ratings"
                                expandDropDowns={true}
                                showDropDowns={false}
                                showRemoveAll={true}
                                readOnlyHeadings={true}
                                onSelectedItemsChange={this.onSelectedMovieRatingItemsChange}
                                selectedItems={this.state.selectedMovieRatings}
                                colors={{primary: 'lightgray'}}
                                styles={{confirmText: {color: 'black'}, selectToggleText: {fontWeight: 'bold'}}}
                                onConfirm={() => console.log(this.state.selectedMovieRatings)}
                            />
                        </View>
                        <View style={styles.viewSelectStyle}>
                            <SectionedMultiSelect
                                items={[{id: 0, name: 'Rating', children: this.tvRatings}]}
                                uniqueKey='id'
                                subKey='children'
                                selectText="TV ratings"
                                expandDropDowns={true}
                                showDropDowns={false}
                                showRemoveAll={true}
                                readOnlyHeadings={true}
                                onSelectedItemsChange={this.onSelectedTVRatingItemsChange}
                                selectedItems={this.state.selectedTVRatings}
                                colors={{primary: 'lightgray'}}
                                styles={{confirmText: {color: 'black'}, selectToggleText: {fontWeight: 'bold'}}}
                                onConfirm={() => console.log(this.state.selectedTVRatings)}
                            />
                        </View>
                    </View>
                    <View style={styles.button}>
                        <Button
                            onPress={this._fetchFiltersResults}
                            title='Search'
                            color='red'
                        />
                    </View>
                    {this.state.movieResults.length > 0 &&
                    (this.state.selectedMovieGenres.length > 0 || this.state.selectedMovieRatings.length > 0)
                        ?
                        <FlatlistComponent
                            type={'Movies'}
                            listItems={this.state.movieResults}
                            navigation={this.props.navigation}
                            movieGenres={this.movieGenres}/>
                        : <View/>}

                    {this.state.tvResults.length > 0 ?
                        <FlatlistComponent
                            type={'TV Shows'}
                            listItems={this.state.tvResults}
                            navigation={this.props.navigation}
                            tvGenres={this.tvGenres}/>
                        : <View/>}
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    viewSelectStyle: {
        width: '45%',
        marginHorizontal: '1.75%',
        marginBottom: '2.5%',
        backgroundColor: 'white'
    },
    viewSelectContainer: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    button: {
        maxHeight: '40%',
        width: '95%',
        marginLeft: '2.5%'
    }
})