import React, {Component} from 'react'
import {connect} from "react-redux";
import {userLogoutAction} from "../redux/Authentication/Action";
import {Image, View} from "react-native";
import {ComponentStyle} from "../styles/componentStyle";
import {Icon} from "react-native-elements";

class Logout extends Component {
    static navigationOptions = {

        // this should be conected to datastore
        drawerLabel: 'Logout',
        drawerIcon: ({ tintColor }) => (
            <Icon
                containerStyle={{transform: [{ rotate: '180deg'}]}}
                name='sign-out'
                type='font-awesome'
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
