
/**
 ** @note this is different than getCalendarTimeFilter because this puts the data in a form the server will understand
 *
 * @param endDate The last date of the viewing period
 * @param aggregation The type of data aggregation, viewing by day,week,month,year
 * @param backwards if backwards than get the previous time frame, else get forward
 * @returns {{startDate: string, endDate: string, jsStartDate: Date, jsEndDate: *}}
 */
export const getBatchTimeFilter = (endDate, aggregation,backwards=true) => {
    //

    aggregation = aggregation.toLowerCase();

    let timeNow = new Date();
    let startDate = new Date();
    let direction = backwards ? 1 : -1;


    const hour = 60 * 60 * 1000;
    const day = 24 * hour;
    switch (aggregation) {
        case "hour": // This might be a pain later but hour will return a day behind
            startDate.setTime(endDate.getTime() - (direction * (day - hour)));
            break;
        case "day":
            startDate.setTime(endDate.getTime() - (6 * direction) * day);
            break;
        case "week":
            startDate.setTime(endDate.getFullYear(),endDate.getMonth()-(1 * direction));
            break;
        case"month":
            startDate = new Date(endDate.getFullYear()-(1*direction)), endDate.getMonth()+(1*direction);
            break;
        default:
            throw new Error("Error unrecognized time aggregration : " + aggregation);

    }

    if(backwards) {
        return {
            startDate: startDate.toString(),
            endDate: endDate.toString(),
            jsStartDate: startDate,
            jsEndDate: endDate,

        }
    }else{
        return {
            endDate: startDate.toString(),
            startDate: endDate.toString(),
            jsEndDate: startDate,
            jsStartDate: endDate,

        }
    }

};
/**
 * @note this is different than get time filter, due to it setting the filter based on how the api
 * for react-native-calendars works
 *
 * @param endDate The last date of the viewing period
 * @param aggregation The type of data aggregation, viewing by day,week,month,year
 * @param backwards if backwards than we get the previous time frame, else get forward
 * @returns {{startDate: string, endDate: string, jsStartDate: Date, jsEndDate: *}}
 */
export const getCalendarTimeFilter = (endDate,aggregation,backwards=true) =>{

    aggregation = aggregation.toLowerCase();

    let timeNow = new Date();
    let startDate = new Date();
    let direction = backwards ? 1 : -1;


    const hour = 60 * 60 * 1000;
    const day = 24 * hour;
    switch (aggregation) {
        case "hour": // This might be a pain later but hour will return a day behind
            startDate.setTime(endDate.getTime() - (direction * day));
            break;
        case "day":
            startDate.setTime(endDate.getTime() - ( direction *7) * day);
            break;
        case "week":
            startDate.setTime(endDate.getTime() - ((28 * direction) * day));
            break;
        case"month":
            startDate = new Date(endDate.getFullYear()-1 * direction, endDate.getMonth()+1 * direction);
            break;
        default:
            throw new Error("Error unrecognized time aggregration : " + aggregation);

    }

    if(backwards) {
        return {
            startDate: startDate.toString(),
            endDate: endDate.toString(),
            jsStartDate: startDate,
            jsEndDate: endDate,

        }
    }else{
        return {
            endDate: startDate.toString(),
            startDate: endDate.toString(),
            jsEndDate: startDate,
            jsStartDate: endDate,

        }
    }
};

/**
** If you pass in month it will return last months start date and end date as a range
*
* @param endDate The last date of the viewing period
* @param aggregation The type of data aggregation, viewing by day,week,month,year
* @returns {{startDate: string, endDate: string, jsStartDate: Date, jsEndDate: *}}
*/
export const getTimeFilter = (endDate, aggregation) => {
    //

    aggregation = aggregation.toLowerCase();

    let timeNow = new Date();
    let startDate = new Date();


    const hour = 60 * 60 * 1000;
    const day = 24 * hour;
    switch (aggregation) {
        case "hour": // This might be a pain later but hour will return a day behind
            startDate.setTime(endDate.getTime()  - hour);
            break;
        case "day":
            startDate.setTime(endDate.getTime() - day);
            break;
        case "week":
            startDate.setTime(endDate.getTime() - 7 * day);
            break;
        case"month":
            startDate.setTime(endDate.getTime() - 7 * 4 * day);
            break;
        default:
            throw new Error("Error unrecognized time aggregration : " + aggregation);

    }

    return {
        startDate: startDate.toString(),
        endDate: endDate.toString(),
        jsStartDate: startDate,
        jsEndDate: endDate,

    }

};

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// returns dd/mm/yyyy
export const formatDate = (d) => {
    let day,month;
    day = d.getDate(); month = d.getMonth();
    if(day < 10){
        day = "0" + day;
    }

    return `${months[month]} ${day}`;

}
export const dateToReactCalendar = (tf, addMonth) => {
    // expects '2012-03-92'
    let year = tf.getFullYear();
    let month = tf.getMonth() + addMonth;
    if (tf.getMonth() + addMonth < 10) {
        month = "0" + (tf.getMonth() + addMonth);
    }
    let day = tf.getDate();
    if (tf.getDate() < 10) {
        day = "0" + tf.getDate();
    }
    return `${year}-${month}-${day}`;

}

export const formatNumber = (num,decimalPlaces=1000) => {
    let divider = 1;
    if(num < 0){num *= -1;}
    let size = "";
    if (num > 1000) {
        divider = 1000;
        size = "k"
    }
    if (num > 1000000) {
        divider = 1000000;
        size = "m";
    }
    num /= divider;

    if (divider === 1) {
        num = Math.round(num);
    } else {
        // Round to 3 decimal places
        num = Math.round(num * decimalPlaces) / decimalPlaces;

    }
    let toReturn = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return toReturn + size;

};
export const formatToDecimal = (num,decimalPlaces) =>{
    return (Math.round(num * decimalPlaces) / decimalPlaces).toString();
}