import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import Search from "./components/Search"
import List from "./components/List"
import Browse from "./components/Browse"
import Details from "./components/Details"

const RootStack = createStackNavigator (
    {
        Search: {
            screen: Search
        },
        SearchResults: {
            screen: List
        },
        Browse: {
            screen: Browse
        },
        Details: {
            screen: Details
        }
    },
    {
        initialRouteName: 'Search',
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
