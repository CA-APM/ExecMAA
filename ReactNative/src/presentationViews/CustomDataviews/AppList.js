import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
    FlatList,
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
            selectedApp : this.props.selectedApp
        }
        // set state
        this.renderItem = this.renderItem.bind(this);
    }




    //                     {/*<ListItem rightIcon={{name: 'chevron-right'}}  key={index} title={item} onPress={() =>{this.didPress(item,index)}}/>*/}

    renderItem(obj){
        let item = obj.item;
        if(item.key === this.state.selectedApp){
            return (
                <ListItem
                            leftIcon={{type:"Navigation",name:"check"}}
                        rightIcon={{name: "chevron-right"}} key={item.key} title={item.key}
                          onPress={() => {
                              this.setState({selectedApp:item.key});
                              this.props.onPress(item.key)
                          }}/>
            )
        }else {
            return (
                <ListItem rightIcon={{name: "chevron-right"}} key={item.key} title={item.key}
                          onPress={() => {
                              this.setState({selectedApp:item.key});
                              this.props.onPress(item.key)
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
AppList.propTypes = {
    didPress: PropTypes.func,
    data: PropTypes.array
};
AppList.defaultProps = {
    onPress: null,
    data: null,
    selectedApp :null
};