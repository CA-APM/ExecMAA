import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
    StyleSheet, Text,
    View
} from 'react-native'
import {HEIGHT} from "../../constants";
import {Icon, SearchBar} from "react-native-elements";
import AppList from "../CustomDataviews/AppList";


export default class AppSelector extends Component {

    constructor(props) {
        super(props);
        // set state

        this.transform = this.transform.bind(this);
        this.state = {
            cacheData: this.transform(this.props.data,""),
            selectedApp: this.props.selectedApp,
        };
    }




    transform(data, filter) {
        if (filter !== "") {
            data = data.filter((val) => {
                return val.indexOf(filter) >= 0;
            });
        }
        data.sort((a, b,) => {
            if (a.toLowerCase() > b.toLowerCase()) {
                return 1;
            } else if (a.toLowerCase() < b.toLowerCase()) {
                return -1;
            } else {
                return 0;
            }
        });
        return data.map((ele) => {
            return {key: ele};
        });
    }

    render() {
        let selectedApp = this.state.selectedApp;
        let finalData = this.state.cacheData;

        return (


            <View style={{height: HEIGHT}}>
                <View style={{paddingTop:10,alignItems:"center",flexDirection: "row", height: HEIGHT / 8, backgroundColor: "#1429ff"}}>
                    <View style={{flex: 1}}>
                        <Icon

                            reverse
                            name='arrow-upward'
                            type='Navigation'
                            color='#517fa4'
                            onPress={() => {
                                console.log('didDismiss pressed');
                                this.props.onDismiss(this.state.selectedApp);
                            }}

                        />
                    </View>

                    <Text style={{ fontSize: 30}}>
                        {selectedApp}
                    </Text>
                    <View style={{flex: 1}}/>


                </View>


                <SearchBar
                    lightTheme
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    clearIcon={{color: '#86939e', name: 'clear'}}
                    onChangeText={(searchText) => {
                        this.setState({cacheData:this.transform(this.props.data,searchText)})
                    }}
                    placeHolder="Search Apps..."/>
                <AppList
                    data={finalData}
                    selectedApp={selectedApp}
                    onPress={(finalData) => {
                        this.setState({selectedApp: finalData});
                    }}
                />
            </View>
        )
    }
}
AppSelector.propTypes = {
    onPress: PropTypes.func,
    selectedApp: PropTypes.string,
    data: PropTypes.array
};
AppSelector.defaultProps = {
    onDismiss: null,
    data: null,
    selectedApp: "",
};