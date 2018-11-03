import React from 'react';
import { Dimensions, Image, Button, Text, View, StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements'
import { LinearGradient } from 'expo';

export default class Search extends React.Component {

    static navigationOptions = {
        header: null,
    }

    constructor() {
        super();
        this.state = {
            searchTerm: 'Search Results',
        }

        this.searchText = this.searchText.bind(this);
    }

    searchText(text) {
        this.setState({searchTerm: text});
        console.log(this.state.searchTerm);
    }

    componentDidMount() {

    }

    render() {
        const { navigate } = this.props.navigation;

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
                <Text style={styles.text}>Entertain Me!</Text>
                <SearchBar
                    containerStyle={styles.search}
                    round
                    lightTheme
                    clearIcon={{ color: 'grey' }}
                    searchIcon={true}
                    onChangeText={(text) => this.searchText({text})}
                    placeholder='What are you interested in?'
                />
                <View style={styles.button}>
                    <Button
                        title="Search"
                        color="red"
                        onPress={() => {
                            this.props.navigation.navigate('SearchResults', {
                                term: this.state.searchTerm,
                            });
                        }}
                    />
                </View>
            </View>
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
    search: {
        backgroundColor: 'transparent',
        width: '80%',
        borderColor: '#323232',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent'
    },
    button: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
