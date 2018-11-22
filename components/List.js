import React from 'react';
import {Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {LinearGradient} from 'expo';
import Search from './Search';

const screenWidth = (Dimensions.get('window').width);
const screenHeight = (Dimensions.get('window').height);

export default class List extends Search {

    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam('term'),
            headerStyle: {
                backgroundColor: 'black',
            },
            headerTextStyle: {
                color: 'white',
            },
            headerTintColor: 'white'
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            movieList: [],
            showList: [],
            bookList: [],
            movieGenres: []
        }

    }

    _keyExtractor = (item, index) => item.Name;
    _keyExtractorDatabase = (item, index) => index.toString();

    _renderBookList = ({item}) => {
        try {
            return (
                <TouchableHighlight onPress={() => this.props.navigation.navigate('Details', {
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
                    authors: item.volumeInfo.authors
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

    _renderMovieList = ({item}) => {
        let genres = [];
        for (var i = 0; i < item.genre_ids.length; i++) {
            for (var j = 0; j < this.state.movieGenres.length; j++) {
                if (this.state.movieGenres[j]['id'] === item.genre_ids[i]) {
                    genres.push(this.state.movieGenres[j]['name']);
                }
            }
        }
        try {
            return (
                <TouchableHighlight onPress={() => this.props.navigation.navigate('Details', {
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
                <TouchableHighlight onPress={() => this.props.navigation.navigate('Details', {
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
        /* rgba(153,175,93,1) */
        try {
            return (
                <TouchableHighlight onPress={() => this.props.navigation.navigate('Details', {
                    title: item.name,
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

    componentDidMount() {
        this.fetchContent(this.props.navigation.getParam('term'));
    }

    render() {
        return (
            <LinearGradient colors={['#000000', '#323232']}>
                <ScrollView>
                    {this.renderFlatList('Books', this.state.bookList, this._renderBookList)}
                    {this.renderFlatList('Movies', this.state.movieList, this._renderMovieList)}
                    {this.renderFlatList('TV Shows', this.state.showList, this._renderShowList)}
                </ScrollView>
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#323232'
    },
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
    img: {
        width: screenWidth * 0.27,
        height: '100%',
        justifyContent: 'center',
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
