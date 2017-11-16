import React, {Component, PureComponent} from 'react'
import PropTypes from 'prop-types'
import {
    FlatList, Image,
    StyleSheet, Text, TouchableHighlight,
    View
} from 'react-native'
import {
    Icon,
    List, ListItem
} from 'react-native-elements'


// TODO Implement the pure component to make the FlatList faster
class CustomListItem extends React.PureComponent {
    /*
        {this.props.selected ?
                        <Icon name="chevron-right" type="Navigation" style={{alignSelf: "right"}}/> : undefined}

                        <Icon name="chevron-right" type="Navigation" style={{alignSelf: "right"}}/>

         */
    render() {
        const props = this.props;
        return (
            <View key={props.name}>
                <TouchableHighlight onPress={()=>{props.onPress(this.props.name)}}
                                    style={{flex: 1, flexDirection: "row"}}>

                    <View>
                        <Text>
                            {props.name}
                        </Text>
                        <Text>{"Chevron here"}</Text>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}

/**
 * @description displays a list of applications
 */
export default class AppList extends Component {

    constructor(props) {
        super(props);

        let m = (new Map(): Map<string, boolean>);
        m.set(this.props.selectedApp, true);
        this.state = {
            selected: m,
            selectedApp: this.props.selectedApp
        };
        // set state
        this.didSelectApp = this.didSelectApp.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    didSelectApp(app) {
        this.props.onPress(app);
        let nameKey = this.props.nameKey;
        let id = app[nameKey];

        this.setState((state) => {
            // copy the map rather than modifying state.
            const selected = new Map(state.selected);
            selected.set(id, !selected.get(id)); // toggle
            const selectedApp = app;
            return {selected, selectedApp};
        });

    }


    renderItem(obj) {
        obj = obj.item;
        let nameKey = this.props.nameKey;
        let imageKey = this.props.imageKey;
        let name = obj[nameKey];
        let image = obj[imageKey];


        // TODO change to use the new map selected
        if (name === this.state.selectedApp) {
            return (
                <ListItem

                    leftIcon={
                        <Image source={{uri: `data:image/jpg;base64,${image}`}}/>
                    }
                    rightIcon={{type: "Navigation", name: "check"}}
                    title={name}
                    onPress={() => {
                        this.didSelectApp(name)
                    }}/>
            )
        } else {
            return (
                <ListItem
                    leftIcon={
                        <Image source={{uri: `data:image/jpg;base64,${image}`}}/>
                    }
                    rightIcon={{name: "chevron-right"}}
                    title={name}
                    onPress={() => {
                        this.didSelectApp(name)
                    }}/>
            )
        }


    }

    render() {
        return (
            <FlatList
                scrollEnabled={true}
                extraData={this.state.selected}
                data={this.props.data}
                keyExtractor={(item, index) => item[this.props.nameKey]}
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