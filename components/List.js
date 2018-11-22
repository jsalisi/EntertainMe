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

    _keyExtractor = (item, index) => item.Name;
    _keyExtractorDatabase = (item, index) => index.toString();

    componentDidMount() {
        this.fetchContent(this.props.navigation.getParam('term'));
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.navigation.state.params.term != this.props.navigation.getParam("term")) {
            Promise.all(this.fetchContent(this.props.navigation.getParam("term"))).then(() => {
                console.log(this.state.movieList[0]);
                this.forceUpdate();
            })
        }
    }

    render() {
        return (
            <LinearGradient colors={['#000000', '#323232']}>
                <ScrollView>
                    <FlatlistComponent type={'Books'} listItems={this.state.bookList}
                                       navigation={this.props.navigation}/>
                    <FlatlistComponent type={'Movies'} listItems={this.state.movieList}
                                       navigation={this.props.navigation} movieGenres={this.state.movieGenres}/>
                    <FlatlistComponent type={'TV Shows'} listItems={this.state.showList}
                                       navigation={this.props.navigation} tvGenres={this.state.tvGenres}/>
                </ScrollView>
            </LinearGradient>
        )
    }
}
