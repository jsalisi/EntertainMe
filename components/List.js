import React from 'react';
import {ScrollView} from 'react-native';
import {LinearGradient} from 'expo';
import Search from './Search';
import FlatlistComponent from './FlatlistComponent';

export default class List extends Search {

    static navigationOptions = ({navigation}) => {
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
            movieList: [],
            showList: [],
            bookList: [],
            movieGenres: [],
            tvGenres: []
        }
    }

    componentDidMount() {
        if (this.props.navigation.getParam('discover')) {
            this.setState({
                movieList: this.props.navigation.getParam('movielist'),
                showList: this.props.navigation.getParam('showList'),
            })
        } else {
            this.fetchContent(this.props.navigation.getParam('term'));
        }
    }

    render() {
        return (
            <LinearGradient colors={['#000000', '#323232']}>
                <ScrollView>
                    <FlatlistComponent
                        type={'Books'}
                        listItems={this.state.bookList}
                        navigation={this.props.navigation}/>
                    <FlatlistComponent
                        type={'Movies'}
                        listItems={this.state.movieList}
                        navigation={this.props.navigation}
                        movieGenres={this.state.movieGenres}/>
                    <FlatlistComponent
                        type={'TV Shows'}
                        listItems={this.state.showList}
                        navigation={this.props.navigation} tvGenres={this.state.tvGenres}/>
                </ScrollView>
            </LinearGradient>
        )
    }
}
