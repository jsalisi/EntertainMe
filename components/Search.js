import React from 'react';
import { Dimensions, Image, Button, Text, View, StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements'
import { LinearGradient } from 'expo';
import { TASTE_API_KEY, THE_MOVIE_DB_API_KEY, GOOGLE_BOOKS_API_KEY } from 'react-native-dotenv'

const bookReq = `https://tastedive.com/api/similar?k=${TASTE_API_KEY}&type=books&q=book:`;
const movieReq = `https://tastedive.com/api/similar?k=${TASTE_API_KEY}&type=movies&q=movie:`;
const showReq = `https://tastedive.com/api/similar?k=${TASTE_API_KEY}&type=shows&q=`;

const bookRequest = `https://www.googleapis.com/books/v1/volumes?key=${GOOGLE_BOOKS_API_KEY}&q=`
const movieRequest = `https://api.themoviedb.org/3/search/movie?api_key=${THE_MOVIE_DB_API_KEY}&query=`;
const showRequest = `https://api.themoviedb.org/3/search/tv?api_key=${THE_MOVIE_DB_API_KEY}&query=`;

export default class Search extends React.Component {

    static navigationOptions = {
        header: null,
    }

    constructor() {
        super();
        this.state = {
            searchTerm: 'Search Results',
            movieList: [],
            showList: [],
            bookList: [],
        }

        this.searchText = this.searchText.bind(this);
    }

    searchText(text) {
        this.setState({searchTerm: text});
    }

    getRecommendations = (searchTerm) => {
        return new Promise((resolve, reject) => {
            let tasteDiveSearch = bookReq + encodeURIComponent(searchTerm).replace(/%20/g, '+');

            this.getSearchContent(searchTerm, 'book')
                .then((bookArray) => {
                    let tempArray = [JSON.parse(JSON.stringify(bookArray[0]))];
                    
                    fetch(tasteDiveSearch)
                        .then((response) => response.json())
                        .then((tasteDiveObject) => {
                            for (i=0; i<tasteDiveObject.Similar.Results.length; i++) {
                                this.getSearchContent(tasteDiveObject.Similar.Results[i].Name, 'book')
                                    .then((response) => {
                                        tempArray.push(response.items[i])
                                    })
                                    .catch((error) => {console.log(error)})
                            }
                            resolve(tempArray)
                        });
                });
        });
    }

    getSearchContent = (searchTerm, type) => {
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

    fetchContent = (searchTerm) => {
        Promise.all([
            this.getRecommendations(searchTerm),
            this.getSearchContent(searchTerm, 'movie'),
            this.getSearchContent(searchTerm, 'show'),
        ]).then((res) => {
            this.setState({
                bookList: res[0],
                movieList: res[1],
                showList: res[2],
            });
        });
    }

    navToSearchResults = () => {
        this.props.navigation.navigate('SearchResults', {
            term: this.state.searchTerm
        });
    }

    render() {
        const { navigate } = this.props.navigation;

        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={['#000000', '#323232']}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        height: (Dimensions.get('window').height),
                        width: (Dimensions.get('window').width),
                    }}
                />
                <Text style={styles.text}>Entertain Me!</Text>
                <SearchBar
                    containerStyle={styles.search}
                    round
                    lightTheme
                    inputStyle={{color: 'black'}}
                    clearIcon={{ color: 'grey' }}
                    searchIcon={true}
                    onChangeText={(text) => this.searchText(text)}
                    placeholder='What are you interested in?'
                    onSubmitEditing={() => {
                        this.navToSearchResults()
                    }}
                />
                <View style={styles.button}>
                    <Button
                        title="Search"
                        color="red"
                        onPress={() => {
                            this.navToSearchResults()
                        }}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#323232',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        height: 100,
        fontSize: 50,
        fontWeight: 'bold',
        color: 'white'
    },
    search: {
        backgroundColor: 'transparent',
        width: '80%',
        borderColor: '#323232',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent'
    },
    button: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
