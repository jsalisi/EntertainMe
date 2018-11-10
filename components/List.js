import React from 'react';
import {Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {LinearGradient} from 'expo';
import {GOOGLE_BOOKS_API_KEY, TASTE_API_KEY, THE_MOVIE_DB_API_KEY} from 'react-native-dotenv'
import Search from './Search';

const bookReq = `https://tastedive.com/api/similar?k=${TASTE_API_KEY}&type=books&q=book:`;
const movieReq = `https://tastedive.com/api/similar?k=${TASTE_API_KEY}&type=movies&q=movie:`;
const showReq = `https://tastedive.com/api/similar?k=${TASTE_API_KEY}&type=shows&q=`;

const bookRequest = `https://www.googleapis.com/books/v1/volumes?key=${GOOGLE_BOOKS_API_KEY}&q=`
const movieRequest = `https://api.themoviedb.org/3/search/movie?api_key=${THE_MOVIE_DB_API_KEY}&query=`;
const showRequest = `https://api.themoviedb.org/3/search/tv?api_key=${THE_MOVIE_DB_API_KEY}&query=`;

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
        }
    }

    _keyExtractor = (item, index) => item.Name;
    _keyExtractorDatabase = (item, index) => index.toString();

    _renderBookList = ({item}) => {
        return (
            <TouchableHighlight onPress={() => this.props.navigation.navigate('Details', {
                title: item.volumeInfo.title,
                averageRating: item.volumeInfo.averageRating,
                categories: item.volumeInfo.categories,
                description: item.volumeInfo.description,
                images: item.volumeInfo.imageLinks,
                preview: item.volumeInfo.previewLink,
                subtitle: item.volumeInfo.subtitle,
                authors: item.volumeInfo.authors
            })}>
                <View>
                    <Image style={styles.box} source={{uri: item.volumeInfo.imageLinks.thumbnail}}
                           backgroundColor={'transparent'}/>
                </View>
            </TouchableHighlight>
        );
    }

    _renderMovieList = ({item}) => {
        return (
            <TouchableHighlight onPress={() => this.props.navigation.navigate('Details', {
                title: item.original_title,
            })}>
                <View>
                    <Image style={styles.box} source={{uri: "http://image.tmdb.org/t/p/w185" + item.poster_path}}
                           backgroundColor={'transparent'}/>
                    {/* <Text style={styles.text}>{item.Name}</Text> */}
                </View>
            </TouchableHighlight>
        );
    }

    _renderShowList = ({item}) => {
        /* rgba(153,175,93,1) */
        return (
            <TouchableHighlight onPress={() => this.props.navigation.navigate('Details', {
                title: item.original_name,
            })}>
                <View>
                    <Image style={styles.box} source={{uri: "http://image.tmdb.org/t/p/w185" + item.poster_path}}
                           backgroundColor={'transparent'}/>
                    {/* <Text style={styles.text}>{item.Name}</Text> */}
                </View>
            </TouchableHighlight>
        );
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
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    }
});
