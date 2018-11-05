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

        }
    }

    _keyExtractor = (item, index) => item.Name;
    _keyExtractorDatabase = (item, index) => index.toString();

    _renderBookList = ({ item }) => {
        /* rgba(230,183,64,1) */
        return (
            <TouchableHighlight onPress={() => this.props.navigation.navigate('Details', {
                title: item.volumeInfo.title,
            })}>
                <View>
                    <Image style={styles.box} source={{ uri: item.volumeInfo.imageLinks.thumbnail }} backgroundColor={'transparent'} />
                </View>
            </TouchableHighlight>
        );
    }

    _renderMovieList = ({item}) => {
        /* rgba(200,61,50,1) */
        return (
            <TouchableHighlight onPress={() => this.props.navigation.navigate('Details', {
                title: item.original_title,
            })}>
                <View>
                    <Image style={styles.box} source={{ uri: "http://image.tmdb.org/t/p/w185" + item.poster_path }} backgroundColor={'transparent'}/>
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
                    <Image style={styles.box} source={{ uri: "http://image.tmdb.org/t/p/w185" + item.poster_path }} backgroundColor={'transparent'} />
                    {/* <Text style={styles.text}>{item.Name}</Text> */}
                </View>
            </TouchableHighlight>
        );
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

    render() {
        const { navigation } = this.props;
        const Books = navigation.getParam('BookList');
        const Movies = navigation.getParam('MovieList');
        const Shows = navigation.getParam('ShowList');

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
                    data={Books}
                    renderItem={this._renderBookList}
                />
                <Text style={styles.title}>Movies</Text>
                <FlatList
                    keyExtractor={this._keyExtractorDatabase}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    data={Movies}
                    renderItem={this._renderMovieList}
                />
                <Text style={styles.title}>TV Shows</Text>
                <FlatList
                    keyExtractor={this._keyExtractorDatabase}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    data={Shows}
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
        height: (screenWidth * 0.27) * (36 / 24),
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'left',
        padding: screenWidth * 0.01,
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
