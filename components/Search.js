import React from 'react';
import {Dimensions, StyleSheet, Text, TouchableWithoutFeedback, Image, ScrollView, FlatList, View} from 'react-native';
import {SearchBar, Header} from 'react-native-elements'
import {LinearGradient} from 'expo';
import * as Animatable from 'react-native-animatable';
import {GOOGLE_BOOKS_API_KEY, TASTE_API_KEY, THE_MOVIE_DB_API_KEY} from 'react-native-dotenv'
// import DiscoverComponent from './DiscoverComponent';

export const bookReq = `https://tastedive.com/api/similar?k=${TASTE_API_KEY}&type=books&info=true&limit=10&q=book:`;
export const movieReq = `https://tastedive.com/api/similar?k=${TASTE_API_KEY}&type=movies&info=true&limit=10&q=movie:`;
export const showReq = `https://tastedive.com/api/similar?k=${TASTE_API_KEY}&type=shows&info=true&limit=10&q=`;

const bookRequest = `https://www.googleapis.com/books/v1/volumes?key=${GOOGLE_BOOKS_API_KEY}&maxResults=10&q=`;
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
            searchOpen: false
        }
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

    componentDidMount() {
        this.menu.transitionTo({ top: screenHeight * 0.15 })
    }

    searchText(text) {
        this.setState({searchTerm: text});
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

    navToDiscover = () => {
        this.props.navigation.navigate('Browse');
    }

    handleViewRef = ref => this.view = ref;
    handleListRef = ref => this.menu = ref;

    renderLeftComponent = () => {
        return(
            <Animatable.Text animation="pulse" iterationCount={"infinite"} direction="alternate" style={styles.text}>
                Entertain Me
                <Text style={styles.text_emphasis}>
                    !
                    </Text>
            </Animatable.Text>  
        );
    }

    renderRightComponent = () => {
        return(
            <TouchableWithoutFeedback onPress={() => {
                if (this.state.searchOpen === true) {
                    this.view.transitionTo({ top: screenHeight * 0.05 })
                    this.menu.transitionTo({ top: screenHeight * 0.15 })
                    this.setState({
                        searchOpen: false
                    });
                } else {
                    this.view.transitionTo({ top: screenHeight * 0.15 })
                    this.menu.transitionTo({ top: screenHeight * 0.25 })
                    this.setState({
                        searchOpen: true
                    });
                }
            }}>
                <Image style={styles.button} source={require('../assets/search.png')}/>
            </TouchableWithoutFeedback>
        );
    }

    render() {
        const {navigate} = this.props.navigation;

        return (
            <LinearGradient colors={['#000000', '#323232']}
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    height: (Dimensions.get('window').height),
                    width: (Dimensions.get('window').width),
                    }}
            >
            <View style={styles.container}>
                {/* <StatusBar hidden /> */}
                
                <Animatable.View style={StyleSheet.absoluteFill} style={{position: 'relative'}} ref={this.handleListRef}>
                <ScrollView>
                    <Text style={styles.cat_text}> Popular </Text>
                    <FlatList
                        horizontal={true}
                        contentContainerStyle={styles.row}
                        data={[{key: 'PLACEHOLDER 1'}, {key: 'PLACEHOLDER 2'}, {key: 'PLACEHOLDER 3'}]}
                        renderItem={({item}) => <View style={styles.box}><Text>{item.key}</Text></View>}/>  
                    <Text style={styles.cat_text}> New </Text>
                    <FlatList
                        horizontal={true}
                        contentContainerStyle={styles.row}
                        data={[{key: 'PLACEHOLDER 1'}, {key: 'PLACEHOLDER 2'}, {key: 'PLACEHOLDER 3'}]}
                        renderItem={({item}) => <View style={styles.box}><Text>{item.key}</Text></View>}/>  
                    <Text style={styles.cat_text}> Discover </Text>
                    <FlatList
                        horizontal={true}
                        contentContainerStyle={styles.row}
                        data={[{key: 'PLACEHOLDER 1'}, {key: 'PLACEHOLDER 2'}, {key: 'PLACEHOLDER 3'}]}
                        renderItem={({item}) => <View style={styles.box}><Text>{item.key}</Text></View>}/>     
                </ScrollView>
                </Animatable.View>

                <Animatable.View style={styles.searchBar} ref={this.handleViewRef}>
                    <SearchBar
                        containerStyle={styles.search}
                        round
                        lightTheme
                        inputStyle={{color: 'black'}}
                        clearIcon={{color: 'grey'}}
                        searchIcon={true}
                        icon={{ type: 'font-awesome', name: 'search', color: 'red' }}
                        onChangeText={(text) => this.searchText(text)}
                        placeholder='What are you interested in?'
                        onSubmitEditing={() => {
                                this.navToSearchResults()
                            }}
                    />
                </Animatable.View>
                <Header
                    outerContainerStyles={styles.header_item}
                    leftComponent={this.renderLeftComponent()}
                    rightComponent={this.renderRightComponent()}
                />          
            </View>
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 2,
        backgroundColor: 'transparent',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header_item: {
        backgroundColor:  'black',
        position: 'absolute',
        top: 0,
        height: screenHeight * 0.15,
        width: screenWidth,
        borderBottomColor: 'transparent'
    },
    searchBar: {
        flex: 1,
        position: 'absolute',
        top: screenHeight * 0.05,
        width: screenWidth
    },
    text_emphasis: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'red',
    },
    text: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center'
    },
    search: {
        backgroundColor: 'transparent',
        left: screenWidth * 0.025,
        width: screenWidth * 0.95,
        borderColor: '#323232',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        marginBottom: 10
    },
    button: {
        width: 45,
        alignItems:  'center',
        justifyContent: 'center',
        backgroundColor: 'black'
    },
    cat_text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'left',
    },
    row: {
        height: screenHeight * 0.30,
        justifyContent: 'flex-start',
    },
    box: {
        width: screenWidth * 0.35,
        height: '100%',
        margin: screenWidth * 0.01,
        marginTop: 0,
        backgroundColor: 'gray',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderColor: 'white'
    },
});
