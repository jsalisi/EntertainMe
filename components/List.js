import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Text, View, FlatList, StyleSheet, TouchableHighlight, Image } from 'react-native';
import { ListItem } from 'react-native-elements'
import { LinearGradient } from 'expo';

const MOVIE_API_KEY = process.env.THE_MOVIE_DB_API_KEY;
const TASTE_API_KEY = process.env.TASTE_DIVE_API_KEY;

const movieReq = `https://tastedive.com/api/similar?k=${TASTE_API_KEY}&type=movie&q=`;
const showReq = `https://tastedive.com/api/similar?k=${TASTE_API_KEY}&type=show&q=`;
const bookReq = `https://tastedive.com/api/similar?k=${TASTE_API_KEY}&type=book&q=`

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
        let search = movieReq + searchTerm;
        fetch(search)
            .then((response) => response.json())
            .then((response) => {
                console.log(TASTE_API_KEY);
                console.log(JSON.stringify(response));
                this.setState({
                    movieList: response.Similar.Results
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
                        height: (Dimensions.get('window').height),
                        width: (Dimensions.get('window').width),
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
        width: 150,
        height: 150,
        margin: 4,
        marginBottom: 0,
        backgroundColor: 'gray'
    }
});
