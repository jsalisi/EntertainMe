import React from 'react';
import {Dimensions, Image, Keyboard, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {ButtonGroup, Header, SearchBar} from 'react-native-elements'
import {LinearGradient} from 'expo';
import * as Animatable from 'react-native-animatable';
import {GOOGLE_BOOKS_API_KEY, TASTE_API_KEY, THE_MOVIE_DB_API_KEY} from 'react-native-dotenv'
import FlatlistComponent from "./FlatlistComponent";
import DiscoverComponent from "./DiscoverComponent";

export const bookReq = `https://tastedive.com/api/similar?k=${TASTE_API_KEY}&type=books&info=true&limit=10&q=book:`;
export const movieReq = `https://tastedive.com/api/similar?k=${TASTE_API_KEY}&type=movie&info=true&limit=10&q=movie:`;
export const showReq = `https://tastedive.com/api/similar?k=${TASTE_API_KEY}&type=show&info=true&limit=10&q=show:`;

const bookRequest = `https://www.googleapis.com/books/v1/volumes?key=${GOOGLE_BOOKS_API_KEY}&maxResults=10&q=`;
const movieRequest = `https://api.themoviedb.org/3/search/movie?api_key=${THE_MOVIE_DB_API_KEY}&query=`;
const showRequest = `https://api.themoviedb.org/3/search/tv?api_key=${THE_MOVIE_DB_API_KEY}&query=`;

const screenHeight = (Dimensions.get('window').height);
const screenWidth = (Dimensions.get('window').width);

export default class Search extends React.Component {

    static navigationOptions = {
        header: null,
    }

    constructor(props) {
        super(props);
        this.state = {
            searchTerm: 'Search Results',
            movieList: [],
            showList: [],
            bookList: [],
            searchOpen: false,
            selectedIndex: 0
        };
        this.searchText = this.searchText.bind(this);
        this.updateIndex = this.updateIndex.bind(this);
    }

    static defaultProps = {
        selectedIndex: 0
    }

    componentDidMount() {
        this.menu.transition({marginTop: screenHeight}, {marginTop: screenHeight * 0.15}, 1250)
    }

    searchText(text) {
        this.setState({searchTerm: text});
    }

    updateIndex(selectedIndex) {
        this.setState({selectedIndex})
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
    handleSearchRef = ref => this.searchBar = ref;

    renderLeftComponent = () => {
        return (
            <Animatable.Text animation="pulse" iterationCount={"infinite"} direction="alternate" style={styles.text}>
                Entertain Me
                <Text style={styles.text_emphasis}>
                    !
                </Text>
            </Animatable.Text>
        );
    }

    renderRightComponent = () => {
        return (
            <TouchableWithoutFeedback onPress={() => {
                if (this.state.searchOpen === true) {
                    this.view.transitionTo({top: screenHeight * 0.05})
                    this.menu.transitionTo({marginTop: screenHeight * 0.15})
                    Keyboard.dismiss()
                    this.setState({
                        searchOpen: false
                    });
                } else {
                    this.view.transitionTo({top: screenHeight * 0.15})
                    this.menu.transitionTo({marginTop: screenHeight * 0.25})
                    this.searchBar.focus()
                    this.setState({
                        searchOpen: true
                    });
                }
            }}>
                <Image style={styles.button} source={require('../assets/search.png')}/>
            </TouchableWithoutFeedback>
        );
    }

    resolveFlatlist = (idx) => {
        if (idx === 0) {
            return (
                <ScrollView>
                    <FlatlistComponent type={'Most Popular Movies'}
                                       navigation={this.props.navigation}/>
                    <FlatlistComponent type={'Most Popular Shows'}
                                       navigation={this.props.navigation}/>
                </ScrollView>
            )
        } else if (idx === 1) {
                return (
                    <View style={{height: screenHeight, width: screenWidth}}>
                        <DiscoverComponent navigation={this.props.navigation}/>
                    </View>
                )
        }
    }

    render() {
        const {navigate} = this.props.navigation;
        const buttons = ["Popular", "Discover"];
        const {selectedIndex} = this.state;

        return (
            <LinearGradient colors={['#000000', '#323232']}
                            style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: 0,
                                height: (Dimensions.get('window').height*2),
                                width: (Dimensions.get('window').width),
                            }}
            >
                <View>
                    {/* <StatusBar hidden /> */}

                    <Animatable.View style={{marginTop: screenHeight * 0.15}} ref={this.handleListRef}>
                        <ButtonGroup
                            onPress={this.updateIndex}
                            textStyle={{color: 'white'}}
                            selectedIndex={selectedIndex}
                            buttons={buttons}
                            containerStyle={styles.menu}
                        />
                        {this.resolveFlatlist(selectedIndex)}
                    </Animatable.View>
                    <Animatable.View style={styles.searchBar} ref={this.handleViewRef}>
                        <SearchBar
                            ref={this.handleSearchRef}
                            containerStyle={styles.search}
                            round
                            lightTheme
                            inputStyle={{color: 'black'}}
                            clearIcon={{color: 'grey'}}
                            searchIcon={true}
                            icon={{type: 'font-awesome', name: 'search', color: 'red'}}
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
        backgroundColor: "transparent",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    header_item: {
        backgroundColor: "black",
        position: "absolute",
        top: 0,
        height: screenHeight * 0.15,
        width: screenWidth,
        borderBottomColor: "transparent"
    },
    searchBar: {
        flex: 1,
        position: "absolute",
        top: screenHeight * 0.05,
        width: screenWidth
    },
    text_emphasis: {
        fontSize: 30,
        fontWeight: "bold",
        color: "red"
    },
    text: {
        fontSize: 30,
        fontWeight: "bold",
        color: "white",
        textAlign: "center"
    },
    search: {
        backgroundColor: "transparent",
        left: screenWidth * 0.025,
        width: screenWidth * 0.95,
        borderColor: "#323232",
        borderBottomColor: "transparent",
        borderTopColor: "transparent",
        marginBottom: 10
    },
    menu: {
        marginLeft: screenWidth * 0.025,
        width: screenWidth * 0.95,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "black",
        marginBottom: screenHeight * 0.025
    },
    button: {
        width: 45,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "black"
    },
    cat_text: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
        textAlign: "left"
    },
    box: {
        width: screenWidth * 0.9,
        height: screenHeight * 0.25,
        margin: screenWidth * 0.01,
        marginTop: 0,
        backgroundColor: "gray",
        justifyContent: "flex-start",
        alignItems: "center",
        borderColor: "white"
    }
});
