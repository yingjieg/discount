'use strict';

var React = require('react-native');
var SearchPage = require('./SearchPage');
var Base = require('./Base');

var styles = React.StyleSheet.create({
    text: {
        color: 'black',
        backgroundColor: 'white',
        fontSize: 30,
        margin: 80
    },
    container: {
        flex: 1
    }
});



class MsDiscountApp extends React.Component {
    render() {
      return (
        <React.NavigatorIOS
            style={styles.container}
            initialRoute={{
                title: 'Morgan Stanley Discount',
                //component: SearchPage,
                component: Base
            }}
        />
      ); 
    }
}


React.AppRegistry.registerComponent('msdiscount', function() {
    return MsDiscountApp;
});
