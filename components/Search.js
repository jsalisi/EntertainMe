import React from 'react';
import {Button, Dimensions, StyleSheet, Text, View} from 'react-native';
import {SearchBar, ButtonGroup} from 'react-native-elements'
import {LinearGradient} from 'expo';
import * as Animatable from 'react-native-animatable';
import {GOOGLE_BOOKS_API_KEY, TASTE_API_KEY, THE_MOVIE_DB_API_KEY} from 'react-native-dotenv'

export const bookReq = `https://tastedive.com/api/similar?k=${TASTE_API_KEY}&type=books&info=true&limit=7&q=book:`;
export const movieReq = `https://tastedive.com/api/similar?k=${TASTE_API_KEY}&type=movies&info=true&limit=7&q=movie:`;
export const showReq = `https://tastedive.com/api/similar?k=${TASTE_API_KEY}&type=shows&info=true&limit=7&q=`;

const bookRequest = `https://www.googleapis.com/books/v1/volumes?key=${GOOGLE_BOOKS_API_KEY}&maxResults=3&q=`;
const movieRequest = `https://api.themoviedb.org/3/search/movie?api_key=${THE_MOVIE_DB_API_KEY}&query=`;
const showRequest = `https://api.themoviedb.org/3/search/tv?api_key=${THE_MOVIE_DB_API_KEY}&query=`;

const movieGenreRequest = `https://api.themoviedb.org/3/genre/movie/list?api_key=${THE_MOVIE_DB_API_KEY}`;
const tvGenreRequest = `https://api.themoviedb.org/3/genre/tv/list?api_key=${THE_MOVIE_DB_API_KEY}`;

const screenHeight = (Dimensions.get('window').height);
const screenWidth = (Dimensions.get('window').width);

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
            movieGenres: [],
            tvGenres: [],
            selectedIndex: 2
        }
        this.updateIndex = this.updateIndex.bind(this)
        this.searchText = this.searchText.bind(this);
    }
    

    componentWillMount() {
        Promise.all([
            this.getSearchContent(null, 'movieGenres'),
            this.getSearchContent(null, 'tvGenres'),
        ]).then((res) => {
            this.setState({
                movieGenres: res[0],
                tvGenres: res[1]
            });
        });
    }

    searchText(text) {
        this.setState({searchTerm: text});
    }

    updateIndex (selectedIndex) {
        this.setState({selectedIndex})
      }

    getRecommendations = (searchTerm, mediaType) => {
        return new Promise((resolve, reject) => {
            let tasteDiveSearch = bookReq + encodeURIComponent(searchTerm).replace(/%20/g, '+');

            this.getSearchContent(searchTerm, mediaType)
                .then((searchResultArray) => {
                    fetch(tasteDiveSearch)
                        .then((response) => response.json())
                        .then((tasteDiveObject) => {
                            this._processSearchResult(tasteDiveObject, JSON.parse(JSON.stringify(searchResultArray)), mediaType)
                                .then((res) => {
                                    resolve(res);
                                }).catch((e) => console.log(e));
                        });
                });
        });
    }

    _processSearchResult = (tasteDiveObject, temp, mediaType) => {
        return new Promise(async (resolve, reject) => {
            let tempArray = [];
            for (index = 0; index < 3; index++) {
                if (temp[index] != undefined) {
                    tempArray.push(JSON.parse(JSON.stringify(temp[index])));
                } else {
                    tempArray.push({})
                }
            }
            // let tempArray = [
            //     JSON.parse(JSON.stringify(temp[0])),
            //     JSON.parse(JSON.stringify(temp[1])),
            //     JSON.parse(JSON.stringify(temp[2]))
            // ];
            const promises = tasteDiveObject.Similar.Results.map((res) => {
                this.getSearchContent(res.Name, mediaType)
                    .then((response) => {
                        tempArray.push(response[0])
                    })
                    .catch((error) => {
                        reject(error)
                    })
            });

            await Promise.all(promises);
            resolve(tempArray)
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
            } else if (type === 'movieGenres') {
                fetch(movieGenreRequest)
                    .then((response) => response.json())
                    .then((response) => resolve(response.genres))
            } else if (type === 'tvGenres') {
                fetch(tvGenreRequest)
                    .then((response) => response.json())
                    .then((response) => resolve(response.genres))
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
            this.getSearchContent(searchTerm, 'book'),
            this.getSearchContent(searchTerm, 'movie'),
            this.getSearchContent(searchTerm, 'show'),
        ]).then((res) => {
            this.setState({
                bookList: res[0],
                movieList: res[1],
                showList: res[2]
            });
        });
    }

    navToSearchResults = () => {
        this.props.navigation.navigate('SearchResults', {
            term: this.state.searchTerm
        });
    }

    navToBrowseResults = () => {
        this.props.navigation.navigate('Browse');
    }

    handleViewRef = ref => this.view = ref;

    render() {
        const {navigate} = this.props.navigation;
        const buttons = ['Search by title', 'Search by keyword']
        const { selectedIndex } = this.state

        return (
            <View style={styles.container}>
                <StatusBar hidden />
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
                <Animatable.View style={styles.items} ref={this.handleViewRef}>
                    <Animatable.Text animation="pulse" iterationCount={"infinite"} direction="alternate" style={styles.text}>Entertain Me!</Animatable.Text>
                    <SearchBar
                        containerStyle={styles.search}
                        round
                        lightTheme
                        inputStyle={{color: 'black'}}
                        clearIcon={{color: 'grey'}}
                        searchIcon={true}
                        onChangeText={(text) => this.searchText(text)}
                        placeholder='What are you interested in?'
                        onFocus={() => this.view.transitionTo({ top: screenHeight * 0.10 })}
                        onEndEditing={() => this.view.transitionTo({ top: screenHeight * 0.35 })}
                        onSubmitEditing={() => {
                            this.navToSearchResults()
                        }}
                    />
                    <ButtonGroup
                        textStyle={{color: 'white'}}
                        selectedIndex={selectedIndex}
                        buttons={buttons}
                        containerStyle={styles.menu}
                        onPress={() => {
                                this.navToSearchResults()
                            }}
                    />
                    <ButtonGroup
                        textStyle={{color: 'white'}}
                        selectedIndex={selectedIndex}
                        buttons={['Browse']}
                        containerStyle={styles.button}
                        onPress={() => {
                                this.navToBrowseResults()
                            }}
                    />
                    {/* <View style={styles.button}>
                        <Button
                            title="Search"
                            color="red"
                            onPress={() => {
                                this.navToSearchResults()
                            }}
                        />
                    </View> */}
                </Animatable.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 2,
        backgroundColor: '#323232',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    items: {
        flex: 1,
        position: 'absolute',
        top: screenHeight * 0.35,
        width: screenWidth
    },
    text: {
        fontSize: 50,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 10
    },
    search: {
        backgroundColor: 'transparent',
        left: screenWidth * 0.10,
        width: screenWidth * 0.80,
        borderColor: '#323232',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        marginBottom: 10
    },
    menu: { 
        left: screenWidth * 0.10,
        width: screenWidth * 0.76,
        alignItems:  'center',
        justifyContent: 'center',
        backgroundColor: 'black'
    },
    button: {
        left: screenWidth * 0.10,
        width: screenWidth * 0.76,
        alignItems:  'center',
        justifyContent: 'center',
        backgroundColor: 'black'
    }
});
