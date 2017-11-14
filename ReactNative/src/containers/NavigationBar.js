import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
    Text,
    StyleSheet,
    TouchableHighlight,
    View,
    Dimensions,
    Picker
} from 'react-native'
import {HEIGHT, PRIMARY_COLOR_300, WIDTH} from "../constants";
import {ComponentStyle} from "../styles/componentStyle";
import LoginButton from "../presentationViews/Other/LoginButton";
import * as constants from "../constants";
import {Icon, Button, CheckBox, ButtonGroup, Header, List, ListItem, SearchBar} from "react-native-elements";
import {connect} from "react-redux";
import {switchConfigPicker} from "../redux/Util/Action";
import {CalendarList} from "react-native-calendars";
import {Blink} from "../presentationViews/Layouts/BasicAnimations";
import {LoadWholeProfile, updateProfileView} from "../redux/Profile/Action";
import * as Util from "../utils/Util";
import AppList from "../presentationViews/CustomDataviews/AppList";
import {DataStatus} from "../redux/ReduxUtil";
import AppSelector from "../presentationViews/Other/AppSelector";
import {formatDate} from "../utils/Util";
import * as CONSTANTS from "../constants";
import {getBatchTimeFilter} from "../utils/Util";
import {getCalendarTimeFilter} from "../utils/Util";

/**
 * @description The NavigationBar is responsible for displaying important information
 * such as the Current time period which is being monitored, the app which is being monitored and
 * also allows the user to tap for a drawer view or select a different time period with a calendar view
 *
 */
class NavigationBar extends Component {


    constructor(props) {
        super(props);
        this.state = {
            shouldSendRequest: false,
            showAppList: false,
            meta: Object.assign({}, props.metadata),
            changed: false,
            filter: "",
        };
        this.showDrawer = this.showDrawer.bind(this);
        this.renderDropDrown = this.renderDropDrown.bind(this);
        this.renderCalendar = this.renderCalendar.bind(this);
        this.datePressed = this.datePressed.bind(this);
        this.getDateRange = this.getDateRange.bind(this);
        this.didChangeAggregation = this.didChangeAggregation.bind(this);
        this.reloadProfile = this.reloadProfile.bind(this);
        this.userDidChangeApp = this.userDidChangeApp.bind(this);
        this.dismissedCalendar = this.dismissedCalendar.bind(this);
        this.selectedApp = this.selectedApp.bind(this);
        this.renderPicker = this.renderPicker.bind(this);
        this.updateProfileVersion = this.updateProfileVersion.bind(this);
        this.getAppVersionsFor = this.getAppVersionsFor.bind(this);
        this.changeDate = this.changeDate.bind(this);

    }


    showDrawer() {
        if (this.props.navigation) {
            this.props.navigation.navigate('DrawerOpen');
        }
    }

    /**
     * @description Called when a user selects a new app to monitor
     * @param {String} app
     */
    selectedApp(app) {
        let oldApp = this.state.meta.app_id;
        let changed = app !== oldApp;
        let newMeta = Object.assign({}, this.state.meta);
        newMeta.app_id = app;
        this.setState({
            version: "default",
            showAppList: false,
            shouldSendRequest: true,
            changed: changed,
            meta: newMeta
        });
    }


    dismissedCalendar() {
        this.props.togglePicker();
        if (this.state.shouldSendRequest && this.state.changed) {
            this.reloadProfile();
        }
        this.setState({
            shouldSendRequest: !this.state.shouldSendRequest
        });
    }


    componentWillReceiveProps(props) {
        // we did get the data
        this.setState({meta: Object.assign({}, props.metadata)});

    }

    /**
     * This is called when we are sure that we need to reload the whole profile
     * @param meta
     */
    reloadProfile(meta = this.state.meta,auth = this.props.auth) {
        this.props.LoadWholeProfile(this.props.token, meta,auth.username,auth.password,auth.tenant);
    }

    /**
     * @description This function takes the currently selected date range from the state
     * and fills an array with the properly formatted date times.
     */
    getDateRange(employees) {
        const formatter = function (date) {
            return Util.dateToReactCalendar(date, 1);

        };

        let toReturn = {};
        let end = new Date(this.state.meta.timeFilter.jsEndDate);

        let theColor = '#00AAFF';
        let start = new Date(this.state.meta.timeFilter.jsStartDate);
        let realStart = new Date(start);

        const day = 24 * 60 * 60 * 1000;

        var copy;

        switch (this.state.meta.aggregation) {
            case "hour":
                break;
            case "day":
                //
                copy = new Date(start);
                for (let i = 0; i < 7; i++) {
                    copy.setTime(copy.getTime() + day);
                    if (copy.getTime() > end.getTime()) {
                        break;
                    }
                    toReturn[formatter(copy)] = [{color: theColor}]
                }
                break;
            case    "week" :
                copy = new Date(start);
                for (let i = 0; i < 28; i++) {
                    copy.setTime(copy.getTime() + day);
                    if (copy.getTime() > end.getTime()) {
                        break;
                    }
                    toReturn[formatter(copy)] = [{color: theColor}]
                }
                break;
            case    "month" :
                // this will be a lot of comp

                copy = new Date(start);
                for (let i = 0; i < 365; i++) {
                    copy.setTime(copy.getTime() + day);
                    if (copy.getTime() > end.getTime()) {
                        break;
                    }
                    toReturn[formatter(copy)] = [{color: theColor}]
                }
                break;
            default:
                break;

        }

        toReturn[formatter(realStart)] = [{startingDay: true, color: theColor, textColor: 'gray'}];
        toReturn[formatter(end)] = [{endingDay: true, color: theColor, textColor: 'gray'}];

        return toReturn;
    }
    /**
     * @description This is called when a user changes the aggregation
     *
     * @param {String} update - The new type of aggregation
     */
    didChangeAggregation(update) {

        let end = this.state.meta.timeFilter.jsEndDate;
        let filter = Util.getCalendarTimeFilter(end, update);
        console.log(`Button Pressed. Update = ${update}\nNew filter : ${JSON.stringify(filter)}`);
        let newProfile = Object.assign({}, this.state.meta, {timeFilter: filter}, {aggregation: update.toLowerCase()});
        this.setState({meta: newProfile, changed: true});
    }

    /**
     * @description Called when the users selects a different time zone from within the calendar
     *
     * @param {Object} filter - The date filter
     * @param {Date} filter.jsStartDate
     * @param {Date} filter.jsEndDate
     * @param {String} filter.startDate
     * @param {String} filter.endDate
     * @param {(null|function)} cb - optional callback
     */
    changeDate(filter, cb) {
        let newProfile = Object.assign({}, this.state.meta, {timeFilter: filter});
        this.setState({meta: newProfile, changed: true}, cb);

    }

    datePressed(dateObject) {
        // get the current aggregation type
        let aggregation = this.state.meta.aggregation;
        let timeNow = new Date();
        let end = new Date(dateObject.year, dateObject.month - 1, dateObject.day, timeNow.getHours(), timeNow.getMinutes());
        let filter = Util.getCalendarTimeFilter(end, aggregation);
        this.changeDate(filter);
    }

    updateProfileVersion(ver) {
        let oldVersion = this.state.meta.version;
        if (ver !== oldVersion) {
            let newMeta = Object.assign({}, this.state.meta);
            newMeta.version = ver;
            this.setState({
                showAppList: false,
                shouldSendRequest: true,
                changed: true,
                meta: newMeta
            });
        }
    }

    getAppVersionsFor(app, data) {
        let choseAllApps = app === "All";
        let notLoaded = data.metadata.status !== DataStatus.success;
        data = data.data;
        if (!(choseAllApps || notLoaded)) {
            let toReturn = [];
            let items = data[app];
            toReturn = toReturn.concat(items["iOS"]);
            toReturn = toReturn.concat(items["Android"]);
            return toReturn;
        } else {
            return [];
        }
    }

    render() {

        //                {this.renderAppList()}

        let tf = this.props.metadata.timeFilter;
        let begin = formatDate(tf.jsStartDate);
        let end = formatDate(tf.jsEndDate);

        if (this.state.showAppList && this.props.util.profileList.metadata.status === DataStatus.success) {
            return <View>
                <AppSelector
                    nameKey={"app_id"}
                    imageKey={"appLogo"}
                    data={this.props.util.profileList.data}
                    selectedApp={this.state.meta.app_id}
                    onDismiss={(chosenApp) => {
                        this.selectedApp(chosenApp);
                    }
                    }/>
            </View>;
        } else {

            return (
                <View>
                    <View style={[{

                        height: CONSTANTS.moderateScale(HEIGHT / 8.0, 0),
                        backgroundColor: constants.PRIMARY_COLOR_800,
                    }, ComponentStyle.center]}>
                        <View style={{flex: 1.0, paddingTop: 15}}>
                            <Icon

                                raised
                                name='bars'
                                type='font-awesome'
                                color={constants.PRIMARY_COLOR_800}
                                containerStyle={{backgroundColor: constants.WHITE}}
                                onPress={() => this.showDrawer()}/>
                        </View>
                        <View style={{marginTop: 10}}>

                            <Text numberOfLines={1}
                                  style={ComponentStyle.header}>
                                {this.props.navigation.state.routeName}
                            </Text>


                        </View>


                        <View style={{flex: 1.0}}>

                            <View style={{alignItems: 'flex-end', paddingTop: 15}}>
                                <CheckBox
                                    containerStyle={{
                                        width: CONSTANTS.moderateScale(50),
                                        height: CONSTANTS.moderateScale(50)
                                    }}
                                    checkedIcon="chevron-down"
                                    uncheckedIcon="chevron-up"
                                    checked={this.props.util.showConfigPicker}
                                    checkedColor={constants.PRIMARY_COLOR_800}
                                    uncheckedColor={constants.PRIMARY_COLOR_800}

                                    onPress={() => {
                                        this.dismissedCalendar();
                                    }}/>
                            </View>
                        </View>
                    </View>
                    {this.props.util.showConfigPicker ? undefined :
                        <View style={{borderBottomWidth:CONSTANTS.scale(7),borderBottomColor:"#205796"}}>

                            <View style={{   height: CONSTANTS.scale(HEIGHT / 12.0), backgroundColor: "#ffffff"}}>
                                <TouchableHighlight
                                    onPress={() => {
                                        this.dismissedCalendar();
                                    }}
                                >
                                    <View
                                        id="dtShower"
                                        style={{

                                            marginTop: 5,
                                            backgroundColor: "#ffffff",
                                            height: CONSTANTS.scale(HEIGHT / 12.0),
                                            width: WIDTH
                                        }}>

                                        <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
                                            <Icon containerStyle={{width: 50}}
                                                  name="calendar"

                                                  color="#205796"
                                                  type="font-awesome"
                                                  onPress={() => {
                                                      this.dismissedCalendar()
                                                  }}
                                            />
                                            <View style={{paddingRight: 30}}>
                                                <Text
                                                    style={[ComponentStyle.description, {fontWeight: "bold"}]}>{`${begin}-${end}`}</Text>
                                                <Text style={[ComponentStyle.description, {
                                                    fontSize: 16,
                                                    textAlign: "left"
                                                }]}>{this.state.meta.app_id}</Text>
                                            </View>

                                            <Icon containerStyle={{flex: 1, alignItems: "flex-end"}}
                                                  name="navigate-before"
                                                  color="#205796"
                                                  size={CONSTANTS.scale(35)}
                                                  onPress={() => {

                                                      //set state
                                                      let tf = getBatchTimeFilter(this.state.meta.timeFilter.jsStartDate, this.state.meta.aggregation);
                                                      let newProfile = Object.assign({}, this.state.meta, {timeFilter: tf});
                                                      this.reloadProfile(newProfile);
                                                  }

                                                  }
                                            />
                                            <Icon containerStyle={{flex: 1, alignItems: "flex-end"}}
                                                  size={CONSTANTS.scale(35)}
                                                  name="navigate-next"
                                                  color="#205796"
                                                  onPress={() => {
                                                      let tf = getBatchTimeFilter(this.state.meta.timeFilter.jsEndDate, this.state.meta.aggregation, false);
                                                      let newProfile = Object.assign({}, this.state.meta, {timeFilter: tf});
                                                      this.reloadProfile(newProfile);

                                                  }
                                                  }
                                            />

                                        </View>
                                    </View>
                                </TouchableHighlight>

                            </View>
                        </View>
                    }

                    {this.renderDropDrown()}
                    {this.renderCalendar()}
                </View>

            );
        }

    }


    /**
     * This renders the entire dropdown menu from the nav bar which includes the current app, the app pikcer
     * The calendar picker and a button list
     *
     * calls renderPicker(), renderCalendar()
     *
     * @returns {*}
     */
    renderDropDrown() {

        const buttonMap = {"hour": "Hour", "day": "Day", "week": "Week", "month": "Month"};
        const buttons = ["Hour", "Day", "Week", "Month"];

        if (!this.props.util.showConfigPicker) {
            return undefined;
        }
        return (
            <View style={{
                width: Dimensions.get('window').width,
                // height: HEIGHT / 11,
                flexDirection: 'column',

            }}>


                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}/>

                    <Button
                        raised
                        leftIcon={{name: 'bar-chart-o', type: 'font-awesome'}}
                        rightIcon={{name: 'hand-pointer-o', type: 'font-awesome'}}
                        buttonStyle={{marginTop: 5, backgroundColor: PRIMARY_COLOR_300}}
                        borderRadius={5}

                        disabled={this.props.util.profileList.metadata.status !== DataStatus.success}
                        title={this.state.meta.app_id}
                        onPress={() => (this.setState({showAppList: true}))}
                    />

                    <View style={{flex: 1}}/>
                </View>
                {this.renderPicker()}


                <View style={{
                    height: 70, width: WIDTH
                }}>
                    <ButtonGroup onPress={(index) => this.didChangeAggregation(buttons[index].toLowerCase())}
                                 selectedIndex={buttons.indexOf(buttonMap[this.state.meta.aggregation])}
                                 buttons={buttons}
                                 containerStyle={{height: 50, backgroundColor: "#FFAA00"}}/>
                </View>
            </View>
        );
    }


    /**
     * @description A picker that allows the user to chose from different versions of the app
     * if there are any
     *
     * @returns {*}
     */
    renderPicker() {
        let data = this.getAppVersionsFor(this.state.meta.app_id, this.props.util.appVersions);
        if (data.length) {
            data.unshift("default");
            return (
                <Picker

                    style={{height: 100}}
                    itemStyle={{height: 100}}
                    selectedValue={this.state.meta.version}
                    onValueChange={(ver) => this.updateProfileVersion(ver)}
                >
                    {
                        data.map((item) => {
                            return (<Picker.Item label={item} value={item}/>)
                        })
                    }

                </Picker>
            )
        } else {
            return undefined;
        }

    }



    renderCalendar() {
        if (this.props.util.showConfigPicker) {
            return (

                <View style={{borderTopWidth: 3, borderColor: '#7f7f7f', margin: 5}}>
                    <CalendarList

                        markedDates={
                            this.getDateRange()
                        }
                        markingType={'interactive'}
                        maxDate={(new Date()).toISOString().split('T')[0]}
                        onDayPress={(dateObject) => {
                            this.datePressed(dateObject);
                        }}


                    />

                </View>
            );
        } else {
            return undefined;
        }
    }


    userDidChangeApp(newApp) {
        this.setState({showAppList: false}, () => {
            console.log(`USer changed app to ${newApp}`);
            // do something
        });
    }


}


NavigationBar.propTypes = {
    navigation: PropTypes.object
};

const mapDispatchToActions = (dispatch) => ({
    togglePicker: () => {
        dispatch(switchConfigPicker())
    },
    LoadWholeProfile: (auth, meta,uname,pass,tenant) => {
        LoadWholeProfile(auth, meta, dispatch, false,uname,pass,tenant);
    },


});
export default connect((state) => ({
    util: state.util,
    metadata: state.profile.metadata,
    token: state.authentication.appToken,
    auth : state.authentication
}), mapDispatchToActions)(NavigationBar);


