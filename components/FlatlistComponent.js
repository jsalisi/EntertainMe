import React from 'react';
import {Dimensions, FlatList, Image, StyleSheet, Text, TouchableHighlight, View} from "react-native";

const screenHeight = (Dimensions.get('window').height);
const screenWidth = (Dimensions.get('window').width);

export default class FlatlistComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        console.log(this.state.listItems);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            type: nextProps.type,
            listItems: nextProps.listItems,
            navigation: nextProps.navigation,
            movieGenres: nextProps.movieGenres,
            tvGenres: nextProps.tvGenres
        })

        console.log(this.state.movieGenres);
    }

    _keyExtractor = (item, index) => item.Name;
    _keyExtractorDatabase = (item, index) => index.toString();

    renderFlatList = (listTitle, data, renderFunction) => {
        return (
            <View style={styles.row}>
                <Text style={styles.title} marginTop={screenHeight * 0.10}>{listTitle}</Text>
                <FlatList
                    keyExtractor={this._keyExtractorDatabase}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    data={data}
                    renderItem={renderFunction}
                />
            </View>
        );
    }

    renderBookList = ({item}) => {
        try {
            return (
                <TouchableHighlight onPress={() => this.state.navigation.navigate('Details', {
                    first: 'Author',
                    second: 'Published Date',
                    third: 'Average Rating',
                    fourth: 'Categories',
                    title: item.volumeInfo.title,
                    averageRating: item.volumeInfo.averageRating,
                    categories: item.volumeInfo.categories,
                    description: item.volumeInfo.description,
                    images: item.volumeInfo.imageLinks,
                    preview: item.volumeInfo.previewLink,
                    subtitle: item.volumeInfo.subtitle,
                    publishedDate: item.volumeInfo.publishedDate,
                    authors: item.volumeInfo.authors,
                    listItems: this.state.listItems,
                    type: 'book'
                })}>
                    <View>
                        <Image style={styles.box} source={{uri: item.volumeInfo.imageLinks.thumbnail}}
                               backgroundColor={'transparent'}/>
                    </View>
                </TouchableHighlight>
            );
        } catch (err) {
            return (
                <TouchableHighlight onPress={() => {
                }}>
                    <View>
                        <Image style={styles.box} backgroundColor={'transparent'}/>
                        <Text style={styles.text}>Image Unavailable</Text>
                    </View>
                </TouchableHighlight>
            );
        }

    }

    _getGenre = (type, genre_id) => {
        let genre = '';
        let allGenres = type === 'movie' ? this.state.movieGenres : this.state.tvGenres;

        for (var j = 0; j < allGenres.length; j++) {
            if (allGenres[j]['id'] === genre_id) {
                genre = allGenres[j]['name'];
            }
        }
        return genre
    };

    _renderMovieList = ({item}) => {
        let genres = [];
        for (var i = 0; i < item.genre_ids.length; i++) {
            genres.push(this._getGenre('movie', item.genre_ids[i]))
        }
        try {
            return (
                <TouchableHighlight onPress={() => this.state.navigation.navigate('Details', {
                    first: 'Popularity',
                    second: 'Release Date',
                    third: 'Average Rating',
                    fourth: 'Genres',
                    title: item.title,
                    averageRating: item.vote_average,
                    categories: genres.join(', '),
                    description: item.overview,
                    images: {thumbnail: "http://image.tmdb.org/t/p/w185" + item.poster_path},
                    subtitle: item.original_title,
                    publishedDate: item.release_date,
                    authors: item.popularity + '%'
                })}>
                    <View>
                        <Image style={styles.box} source={{uri: "http://image.tmdb.org/t/p/w185" + item.poster_path}}
                               backgroundColor={'transparent'}/>
                        {/* <Text style={styles.text}>{item.Name}</Text> */}
                    </View>
                </TouchableHighlight>
            );
        } catch (err) {
            return (
                <TouchableHighlight onPress={() => this.state.navigation.navigate('Details', {
                    title: item.title,
                })}>
                    <View>
                        <Image style={styles.box} backgroundColor={'transparent'}/>
                        <Text style={styles.text}>Image Unavailable</Text>
                    </View>
                </TouchableHighlight>
            );
        }
    }

    _renderShowList = ({item}) => {
        let genres = [];
        for (var i = 0; i < item.genre_ids.length; i++) {
            genres.push(this._getGenre('tv', item.genre_ids[i]))
        }
        try {
            return (
                <TouchableHighlight onPress={() => this.state.navigation.navigate('Details', {
                    first: 'Origin Country / Language',
                    second: 'First Air Date',
                    third: 'Average Rating',
                    fourth: 'Genres',
                    title: item.name,
                    averageRating: item.vote_average,
                    categories: genres.join(',  '),
                    description: item.overview,
                    images: {thumbnail: "http://image.tmdb.org/t/p/w185" + item.poster_path},
                    subtitle: item.original_name,
                    publishedDate: item.first_air_date,
                    authors: item.origin_country + ',  ' + item.original_language
                })}>
                    <View>
                        <Image style={styles.box} source={{uri: "http://image.tmdb.org/t/p/w185" + item.poster_path}}
                               backgroundColor={'transparent'}/>
                        {/* <Text style={styles.text}>{item.Name}</Text> */}
                    </View>
                </TouchableHighlight>
            );
        } catch (err) {
            return (
                <TouchableHighlight onPress={() => this.props.navigation.navigate('Details', {
                    title: item.name,
                })}>
                    <View>
                        <Image style={styles.box} backgroundColor={'transparent'}/>
                        <Text style={styles.text}>Image Unavailable</Text>
                    </View>
                </TouchableHighlight>
            );
        }
    }

    render() {
        if (this.state.type === 'Books' || this.state.type === 'Similar Books') {
            return (
                <View>
                    {this.renderFlatList(this.state.type, this.state.listItems, this.renderBookList)}
                </View>
            )
        } else if (this.state.type === 'Movies') {
            return (
                <View>
                    {this.renderFlatList(this.state.type, this.state.listItems, this._renderMovieList)}
                </View>
            )
        } else {
            return (
                <View>
                    {this.renderFlatList(this.state.type, this.state.listItems, this._renderShowList)}
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    row: {
        height: screenHeight * 0.35,
        justifyContent: 'flex-start',
    },
    box: {
        width: screenWidth * 0.35,
        height: '100%',
        margin: screenWidth * 0.01,
        marginTop: 0,
        backgroundColor: 'gray',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    title: {
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'left',
        fontSize: screenHeight * 0.025,
        padding: 10,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    }
});
