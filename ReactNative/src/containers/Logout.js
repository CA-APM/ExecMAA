import React, {Component} from 'react'
import {connect} from "react-redux";
import {userLogoutAction} from "../redux/Authentication/Action";
import {Image, View} from "react-native";
import {componentStyle} from "../styles/componentStyle";

class Logout extends Component {
    static navigationOptions = {

        // this should be conected to datastore
        drawerLabel: 'Logout',
        drawerIcon: ({ tintColor }) => (
            <Image
                source={require('../../res/chats-icon.jpg')}
                style={[componentStyle.drawerIcon, {tintColor: tintColor}]}
            />
        ),
    };
    // If this were to fail it would be baaad
    componentDidMount(){
        this.props.logout();
    }
    render() {
        return (
            <View>
            </View>
        );
    }
}



const mapDispatchToActions = (dispatch) => ({
    logout : () => dispatch(userLogoutAction())
});



export default connect(null,mapDispatchToActions)(Logout);
