import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Text, View, FlatList, StyleSheet, TouchableHighlight, Image, Button } from 'react-native';
import { LinearGradient } from 'expo';

const screenWidth = (Dimensions.get('window').width);
const screenHeight = (Dimensions.get('window').height);

export default class Details extends React.Component {

    static navigationOptions = ({ navigation }) => {
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
                <View style={styles.button}>
                    <Button
                        title="More Like This"
                        color="red"
                        onPress={() => {

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
    button: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
