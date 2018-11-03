import React from 'react';
import { Image, Button, Text, View, StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements'

export default class Search extends React.Component {

    static navigationOptions = {
        title: 'Search',
    }

    constructor() {
        super();
        this.state = {
            searchTerm: '',
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
                <Text style={styles.text}>Entertain</Text>
                <Text style={styles.text}>Me!</Text>
                <SearchBar
                    containerStyle={styles.search}
                    round
                    lightTheme
                    clearIcon={{ color: 'grey' }}
                    searchIcon={true}
                    onChangeText={(text) => this.searchText({text})}
                    onClear={(text) => console.log({text})}
                    placeholder='Search'
                />
                <Button
                    title="Search"
                    onPress={() => {
                        navigate('Results', {
                            term: this.state.searchTerm,
                        });
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#323232',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 50,
        fontWeight: 'bold',
        color: 'white'
    },
    search: {
        backgroundColor: '#323232',
        width: '80%',
        borderColor: '#323232',
        borderBottomColor: '#323232',
        borderTopColor: '#323232'
    },
});
