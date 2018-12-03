import React from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {LinearGradient} from 'expo';
import Star from "react-native-star-view";
import {THE_MOVIE_DB_API_KEY} from 'react-native-dotenv'

import Search, {bookReq} from "./Search";
import FlatlistComponent from "./FlatlistComponent";

export default class Details extends Search {

    static navigationOptions = ({navigation}, headerStyle = {
        backgroundColor: 'black',
    }) => {
        return {
            title: navigation.getParam('title'),
            headerStyle: headerStyle,
            headerTextStyle: {
                color: 'white',
            },
            headerTintColor: 'white'
        }
    }

    constructor() {
        super();
        this.state = {
            first: '',
            second: '',
            third: '',
            fourth: '',
            title: '',
            averageRating: '',
            categories: '',
            description: '',
            images: '',
            subtitle: '',
            authors: '',
            type: '',
            listItems: []
        }
    }

    componentDidMount() {
        this.getSimilarTitles(this.props.navigation.getParam('id'), this.props.navigation.getParam('title'));
        this.setState({
            first: this.props.navigation.getParam('first'),
            second: this.props.navigation.getParam('second'),
            third: this.props.navigation.getParam('third'),
            fourth: this.props.navigation.getParam('fourth'),
            title: this.props.navigation.getParam('title'),
            averageRating: this.props.navigation.getParam('averageRating'),
            categories: this.props.navigation.getParam('categories'),
            description: this.props.navigation.getParam('description'),
            images: this.props.navigation.getParam('images'),
            subtitle: this.props.navigation.getParam('subtitle'),
            publishedDate: this.props.navigation.getParam('publishedDate'),
            authors: this.props.navigation.getParam('authors'),
            type: this.props.navigation.getParam('type')
        });
    }

    getSimilarTitles = (id, searchTerm) => {
        let req = '';
        let type = this.props.navigation.getParam('type');

        if (type === 'Books') {
            let tasteDiveSearch = bookReq + encodeURIComponent(searchTerm).replace(/%20/g, '+');
            fetch(tasteDiveSearch)
                .then((response) => response.json())
                .then((response) => {
                    this.setState({
                        listItems: response['Similar']['Results']
                    });
                });
        } else {
            let query = `https://api.themoviedb.org/3/${type === 'Show' ? 'tv' : type.toLowerCase()}/${id}/recommendations?api_key=${THE_MOVIE_DB_API_KEY}&page=1`;
            fetch(query)
                .then((response) => response.json())
                .then((response) => {
                    console.log(query);
                    this.setState({
                        listItems: response['results']
                    });
                });
        }
    };

    render() {
        return (
            <LinearGradient colors={['#000000', '#323232']} style={StyleSheet.absoluteFill}>
                <ScrollView>
                    <View style={styles.section1Container}>
                        <Image source={{uri: this.state.images['thumbnail']}}
                               style={{width: 170, height: 250, marginBottom: 14}}/>
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start'
                        }}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                                padding: 10
                            }}>
                                <Text style={styles.detailsTextHeader}> {this.state.first}: {'\n'}</Text>
                                <Text style={styles.detailsText}> {this.state.authors} </Text>
                            </View>
                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                                padding: 10
                            }}>
                                <Text style={styles.detailsTextHeader}> {this.state.second}: {'\n'}</Text>
                                <Text style={styles.detailsText}> {this.state.publishedDate} </Text>
                            </View>
                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                                padding: 10
                            }}>
                                <Text style={styles.detailsTextHeader}> {this.state.third}: {'\n'}</Text>
                                <Star
                                    score={this.state.averageRating > 0 ? this.state.averageRating / 2 : 0}
                                    style={{
                                        width: 100,
                                        height: 20,
                                        marginTop: 10
                                    }}/>
                            </View>
                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                                padding: 10
                            }}>
                                <Text style={styles.detailsTextHeader}> {this.state.fourth}: {'\n'}</Text>
                                <Text
                                    style={styles.detailsText}> {this.state.categories && this.state.categories.length > 0 ? this.state.categories : 'none'} </Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.subtitle}>
                        <Text style={{
                            color: 'red',
                            fontFamily: 'Roboto',
                            fontSize: 15,
                            fontWeight: 'normal',
                            fontStyle: 'italic'
                        }}> {this.state.subtitle} </Text>
                    </View>
                    <View style={{paddingHorizontal: 10}}><Text
                        style={styles.detailsText}>{this.state.description}</Text></View>
                    <View style={{
                        borderBottomWidth: 2,
                        borderBottomColor: 'red',
                        marginTop: 10,
                        marginBottom: -5,
                        marginHorizontal: 10
                    }}/>
                    <View style={styles.recommendations}>
                        {console.log(this.state.listItems)}
                        <FlatlistComponent type={`Similar ${this.props.navigation.getParam('type')}s`}
                                        listItems={this.state.listItems}
                                        navigation={this.props.navigation} fromTasteDive={true}/>
                    </View>
                </ScrollView>
            </LinearGradient>
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
    section1Container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    detailsRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10
    },
    detailsText: {
        color: 'white',
        fontFamily: 'Roboto',
        fontSize: 15,
        fontWeight: 'normal',
    },
    detailsTextHeader: {
        color: 'red',
        fontFamily: 'Roboto',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: -10
    },
    subtitle: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
        marginTop: 7
    },
    recommendations: {
        marginBottom: 10,
    }
});
