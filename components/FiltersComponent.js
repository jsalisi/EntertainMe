import React from 'react';
import {View} from 'react-native';
import MultiSelect from 'react-native-multiple-select';

export default class FiltersComponent extends React.Component {
    constructor(props) {
        super(props);
        this.movieGenres = props.movieGenres;
        this.state = {
            selectedMovieGenres: []
        };
    }

    onSelectedItemsChange = (selectedMovieGenres) => {
        this.setState({selectedMovieGenres})
    };

    render() {
        const {selectedMovieGenres } = this.state;
        return (
            <View>
                <MultiSelect
                    items={this.movieGenres}
                    uniqueKey="id"
                    onSelectedItemsChange={this.onSelectedItemsChange}
                    selectedItems={selectedMovieGenres}
                    selectText="Pick some movie genres"
                    searchInputPlaceholderText="Search Items..."
                    onChangeInput={(text) => console.log(text)}
                    altFontFamily="ProximaNova-Light"
                    tagRemoveIconColor="#CCC"
                    tagBorderColor="#CCC"
                    tagTextColor="#CCC"
                    selectedItemTextColor="#CCC"
                    selectedItemIconColor="#CCC"
                    itemTextColor="#000"
                    displayKey="name"
                    searchInputStyle={{color: '#CCC'}}
                    submitButtonColor="#CCC"
                    submitButtonText="Done"
                />
            </View>
        )
    }
}