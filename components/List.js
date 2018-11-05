import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Text, View, FlatList, StyleSheet, TouchableHighlight, Image } from 'react-native';
import { ListItem } from 'react-native-elements'
import { LinearGradient } from 'expo';
import { TASTE_API_KEY, THE_MOVIE_DB_API_KEY, GOOGLE_BOOKS_API_KEY } from 'react-native-dotenv'

const bookReq = `https://tastedive.com/api/similar?k=${TASTE_API_KEY}&type=books&q=book:`;
const movieReq = `https://tastedive.com/api/similar?k=${TASTE_API_KEY}&type=movies&q=movie:`;
const showReq = `https://tastedive.com/api/similar?k=${TASTE_API_KEY}&type=shows&q=`;

const bookRequest = `https://www.googleapis.com/books/v1/volumes?key=${GOOGLE_BOOKS_API_KEY}&q=`
const movieRequest = `https://api.themoviedb.org/3/search/movie?api_key=${THE_MOVIE_DB_API_KEY}&query=`;
const showRequest = `https://api.themoviedb.org/3/search/tv?api_key=${THE_MOVIE_DB_API_KEY}&query=`;

const screenWidth = (Dimensions.get('window').width);
const screenHeight = (Dimensions.get('window').height);

export default class List extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('term').text,
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

    _renderBookList = ({ item }) => {
        return (
            <TouchableHighlight>
                <View>
                    <Image style={styles.box} source={{ uri: item.volumeInfo.imageLinks.thumbnail }} backgroundColor={'rgba(230,183,64,1)'} />
                </View>
            </TouchableHighlight>
        );
    }
    
    _renderMovieList = ({item}) => {
        return (
            <TouchableHighlight>
                <View> 
                    <Image style={styles.box} source={{ uri: "http://image.tmdb.org/t/p/w185" + item.poster_path }} backgroundColor={'rgba(200,61,50,1)'}/>
                    {/* <Text style={styles.text}>{item.Name}</Text> */}
                </View>
            </TouchableHighlight>
        );
    }

    _renderShowList = ({item}) => {
        return (
            <TouchableHighlight>
                <View>
                    <Image style={styles.box} source={{ uri: "http://image.tmdb.org/t/p/w185" + item.poster_path }} backgroundColor={'rgba(153,175,93,1)'} />
                    {/* <Text style={styles.text}>{item.Name}</Text> */}
                </View>
            </TouchableHighlight>
        );
    }

    _getSearchContent = (searchTerm, type) => {
        return new Promise((resolve, reject) => {
            
            let urlType;
            if (type == 'book') {

                urlType = bookRequest
                let search = urlType + encodeURIComponent(searchTerm).replace(/%20/g, '+');
                fetch(search)
                    .then((response) => response.json())
                    .then((response) => {
                        resolve(response.items)
                    });

            } else {
                if (type == 'movie') {
                    urlType = movieRequest
                } else if (type == 'show') {
                    urlType = showRequest
                }

                let search = urlType + encodeURIComponent(searchTerm).replace(/%20/g, '+');
                fetch(search)
                    .then((response) => response.json())
                    .then((response) => {
                        resolve(response.results)
                    });
            }
            
        });
    }

    _getRecommendations(title) {
        return new Promise((resolve, reject) => {
            let movieSearch = movieReq + encodeURIComponent(title).replace(/%20/g, '+');
            fetch(movieSearch)
                .then((response) => response.json())
                .then((response) => {
                    for (i = 0; i < response.Similar.Results; i++) {
                        console.log(response.Similar.Results[i].Name);
                    }
                });
        });
    }

    fetchContent(searchTerm) {

        // let bookSearch = bookReq + encodeURIComponent(searchTerm).replace(/%20/g, '+');
        // console.log(bookSearch);
        // fetch(bookSearch)
        //     .then((response) => response.json())
        //     .then((response) => {
        //         this.setState({
        //             bookList: response.Similar.Results
        //         })
        //     })

        this._getSearchContent(searchTerm, 'book').then((res) => this.setState({ bookList: res}));
        this._getSearchContent(searchTerm, 'movie').then((res) => this.setState({ movieList: res}));
        this._getSearchContent(searchTerm, 'show').then((res) => this.setState({ showList: res}));
    }

    componentDidMount() {
        this.fetchContent(this.props.navigation.getParam('term').text);
        red = Math.floor(Math.random() * 255);
        green = Math.floor(Math.random() * 255);
        blue = Math.floor(Math.random() * 255);
    }

    render() {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={['#000000', '#323232']}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        height: screenHeight,
                        width: screenWidth,
                    }}
                />
                <Text style={styles.title} marginTop={screenHeight * 0.10}>Books</Text>
                <FlatList
                    keyExtractor={this._keyExtractorDatabase}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    data={this.state.bookList}
                    renderItem={this._renderBookList}
                />
                <Text style={styles.title}>Movies</Text>
                <FlatList
                    keyExtractor={this._keyExtractorDatabase}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    data={this.state.movieList}
                    renderItem={this._renderMovieList}
                />
                <Text style={styles.title}>TV Shows</Text>
                <FlatList
                    keyExtractor={this._keyExtractorDatabase}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    data={this.state.showList}
                    renderItem={this._renderShowList}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#323232',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
    },
    box: {
        width: screenWidth * 0.27,
        height: (screenWidth * 0.27)*(36 / 24),
        margin: screenWidth * 0.01,
        marginTop: 0,
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center'
    },
    img: {
        width: screenWidth * 0.27,
        height: (screenWidth * 0.27) * (36 / 24),
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'left',
        padding: screenWidth * 0.01,
        fontSize: screenHeight * 0.025
    },
    text: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center'
    }
});
