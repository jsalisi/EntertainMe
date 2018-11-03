import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, FlatList, StyleSheet, TouchableHighlight, Image } from 'react-native';
import { ListItem } from 'react-native-elements'

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

    static navigationOptions = {
        title: 'Search Results',
    }

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    _renderList = ({item}) => {
        return (
            <TouchableHighlight>
                <Image style={styles.img} source={{ uri: item.url }} />
            </TouchableHighlight>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={{color: 'white'}}>Books</Text>
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