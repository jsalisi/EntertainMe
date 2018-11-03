import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import Search from "./components/Search"

const RootStack = createStackNavigator (
    {
        Search: {
            screen: Search
        }
    },
    {
        initialRouteName: 'Search',
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#000000',
            },
            headerTitleStyle: {
                color: 'white',
                alignItems: 'center'
            }
        }
    },
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
