import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
    FlatList, Image,
    StyleSheet, Text,
    View
} from 'react-native'
import {
    List, ListItem
} from 'react-native-elements'

export default class AppList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedApp: this.props.selectedApp
        };
        // set state
        this.didSelectApp = this.didSelectApp.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    didSelectApp(app) {
        this.props.onPress(app);
    }


    //                     {/*<ListItem rightIcon={{name: 'chevron-right'}}  key={index} title={item} onPress={() =>{this.didPress(item,index)}}/>*/}

    renderItem(obj) {
        obj = obj.item;
        let nameKey = this.props.nameKey;
        let imageKey = this.props.imageKey;
        let name = obj[nameKey];
        let image = obj[imageKey];

        let appPicture = obj[imageKey];
        if (name === this.state.selectedApp) {
            return (
                <ListItem

                    leftIcon={
                        <Image source={{uri:`data:image/jpg;base64,${image}`}}/>
                    }
                    rightIcon={{type: "Navigation", name: "check"}}
                    title={name}
                    onPress={() => {
                        this.setState({selectedApp: name});
                        this.didSelectApp(name)
                    }}/>
            )
        } else {
            return (
                <ListItem
                        leftIcon={
                            <Image source={{uri:`data:image/jpg;base64,${image}`}}/>
                        }
                        rightIcon={{name: "chevron-right"}}
                        title={name}
                          onPress={() => {
                              this.setState({selectedApp: name});
                              this.didSelectApp(name)
                          }}/>
            )
        }


    }

    render() {
        return (
            <FlatList
                scrollEnabled={true}
                extraData={this.props.data}
                data={this.props.data}
                renderItem={(obj) => {
                    return this.renderItem(obj);
                }}/>
        );
    }

    /** UPDATING **/
    /** The following are called when there are changed to the props**/

}

AppList
    .propTypes = {
    didPress: PropTypes.func,
    data: PropTypes.array
};
AppList
    .defaultProps = {
    onPress: null,
    nameKey: "app_id",
    imageKey: "image",
    data: null,
    selectedApp: null
};