import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Text, View, FlatList, StyleSheet, TouchableHighlight, Image } from 'react-native';
import { ListItem } from 'react-native-elements'
import { LinearGradient } from 'expo';
import { TASTE_API_KEY, THE_MOVIE_DB_API_KEY } from 'react-native-dotenv'

const movieReq = `https://tastedive.com/api/similar?k=${TASTE_API_KEY}&type=movie&q=`;
const showReq = `https://tastedive.com/api/similar?k=${TASTE_API_KEY}&type=show&q=`;
const bookReq = `https://tastedive.com/api/similar?k=${TASTE_API_KEY}&type=book&q=`;

const screenWidth = (Dimensions.get('window').width);
const screenHeight = (Dimensions.get('window').height);

const dummyData = [
    { url: 'url', key: 'item1' },
    { url: 'url', key: 'item2' },
    { url: 'url', key: 'item3' },
    { url: 'url', key: 'item4' },
    { url: 'url', key: 'item5' },
    { url: 'url', key: 'item6' },
    { url: 'url', key: 'item7' },
    { url: 'url', key: 'item8' },
    { url: 'url', key: 'item9' },
    { url: 'url', key: 'item10' },
    { url: 'url', key: 'item11' },
    { url: 'url', key: 'item12' },
]

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

    _renderList = ({item}) => {
        return (
            <TouchableHighlight>
                <Image style={styles.img} source={{ uri: item.url }} />
            </TouchableHighlight>
        );
    }

    fetchContent(searchTerm) {
        let movieSearch = movieReq + searchTerm;
        fetch(movieSearch)
            .then((response) => response.json())
            .then((response) => {
                console.log(JSON.stringify(response.Similar.Results));
                this.setState({
                    movieList: response.Similar.Results
                })
            })

        let showSearch = showReq + searchTerm;
        fetch(showSearch)
            .then((response) => response.json())
            .then((response) => {
                console.log(JSON.stringify(response.Similar.Results));
                this.setState({
                    showList: response.Similar.Results
                })
            })

        let bookSearch = bookReq + searchTerm;
        fetch(bookSearch)
            .then((response) => response.json())
            .then((response) => {
                console.log(JSON.stringify(response.Similar.Results));
                this.setState({
                    bookList: response.Similar.Results
                })
            })
    }

    componentDidMount() {
        this.fetchContent(this.props.navigation.getParam('term').text);
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
                <Text style={{ marginTop: 15, color: 'white'}}>Books</Text>
                <FlatList
                    horizontal={true}
                    data={dummyData}
                    renderItem={this._renderList}
                />
                <Text style={{ color: 'white' }}>Movies</Text>
                <FlatList
                    horizontal={true}
                    data={dummyData}
                    renderItem={this._renderList}
                />
                <Text style={{ color: 'white' }}>TV Shows</Text>
                <FlatList
                    horizontal={true}
                    data={dummyData}
                    renderItem={this._renderList}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#323232',
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
    },
    img: {
        width: screenWidth * 0.35,
        height: screenHeight * 0.35,
        margin: screenWidth * 0.02,
        marginBottom: 0,
        backgroundColor: 'gray'
    }
});
