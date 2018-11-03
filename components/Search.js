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
            img: ''
        }
    }

    componentDidMount() {

    }

    render() {
        const { navigate } = this.props.navigation;

        return (
            <View style={styles.container}>
                <Text style={styles.text}>Entertain</Text>
                <Text style={styles.text}>Me!</Text>
                <Button
                    title="Search"
                    onPress={() => {
                        navigate('Results', {
                            page: 'Home',
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
    }
});
