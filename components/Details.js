import React from 'react';
import {Button, Dimensions, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {LinearGradient} from 'expo';

import Search from "./Search";
import FlatlistComponent from "./FlatlistComponent";

const screenWidth = (Dimensions.get('window').width);
const screenHeight = (Dimensions.get('window').height);

export default class Details extends Search {

    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam('title'),
            headerStyle: {
                backgroundColor: 'black',
            },
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
            title: 'Search Results',
            averageRating: '',
            categories: '',
            description: '',
            images: '',
            subtitle: '',
            authors: '',
            bookList: [],
            movieList: [],
            showList: []
        }
    }

    componentDidMount() {
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
            bookList: this.props.navigation.getParam('bookList')
        })
    }

    render() {
        const {navigate} = this.props.navigation;
        // if (this.state.images['thumbnail'])
        return (
            <LinearGradient colors={['#000000', '#323232']} style={StyleSheet.absoluteFill}>
                <ScrollView >
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
                                <Text
                                    style={styles.detailsText}> {this.state.averageRating > 0 ? this.state.averageRating : 'none'} </Text>
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
                            color: 'white',
                            fontFamily: 'Roboto',
                            fontSize: 15,
                            fontWeight: 'normal',
                            fontStyle: 'italic'
                        }}> {this.state.subtitle} </Text>
                    </View>
                    <Text style={styles.detailsText}>{this.state.description}</Text>
                    <View style={styles.button}>
                        <Button
                            title="More Like This"
                            color="red"
                            onPress={() => {
                                this.props.navigation.navigate('SearchResults', {
                                    term: this.state.title
                                });
                            }}
                        />
                    </View>
                    <FlatlistComponent type={'Similar Books'} listItems={this.state.bookList}
                                       navigation={this.props.navigation}/>
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
    button: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: -30
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
        fontWeight: 'normal'
    },
    detailsTextHeader: {
        color: 'white',
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
        marginBottom: 20
    }
});
