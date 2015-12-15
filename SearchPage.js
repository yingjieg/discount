'use strict';

var React = require('react-native');
var SearchResults = require('./SearchResults');

var {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableHighlight,
    ActivityIndicatorIOS,
    Image,
    Component
} = React;

var styles = StyleSheet.create({
    description: {
        marginBottom: 20,
        fontSize: 18,
        textAlign: 'center',
        color: '#656565'
    },
    container: {
        padding: 30,
        marginTop: 65,
        alignItems: 'center'
    },
    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch'
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },
    button: {
        height: 36,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    searchInput: {
        height: 36,
        padding: 4,
        marginRight: 5,
        flex: 4,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#48BBEC',
        borderRadius: 8,
        color: '#48BBEC'
    },
    image: {
        width: 217,
        height: 138
    }
});

function urlForQueryAndPage(key, value, pageNumber) {
  var data = {
      ak: '94471816E4D1d8f6ea295e30d161e98c',
      geotable_id: '127633'
  };

  data[key] = value;
 
  var querystring = Object.keys(data)
    .map(key => key + '=' + encodeURIComponent(data[key]))
    .join('&');

  console.log(querystring);
 
  return querystring;
};

class SearchPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchString: 'kerry',
            isLoading: false,
            message: ''
        };
    }
    onSearchTextChanged(event) {
        console.log('onSearchTextChanged');
        this.setState({
            searchString: event.nativeEvent.text
        });
        console.log(this.state.searchString);
    }
    _executeQuery(query) {
        console.log('http://api.map.baidu.com/geosearch/v3/local?' + query);
        this.setState({
            isLoading: true
        });

        fetch('http://api.map.baidu.com/geosearch/v3/local?' + query)
            .then(response => response.json())
            .then(json => this._handleResponse(json))
            .catch(error => 
                this.setState({
                isLoading: false,
                message: 'Something bad happened ' + error
            }));
    }

    _handleResponse(response) {
        this.setState({ isLoading: false , message: '' });
        console.log("=============" + response.status);
        if (response.status === 0) {
            console.log('Properties found: ' + response.size);
            this.props.navigator.push({
                title: 'Results',
                component: SearchResults,
                passProps: {listings: response.contents}
            });
        } else {
            this.setState({ message: 'Location not recognized; please try again.'});
        }
    }

    onSearchPressed() {
        var query = urlForQueryAndPage('q', this.state.searchString, 1);
        this._executeQuery(query);
    }

    onLocationPressed() {
      navigator.geolocation.getCurrentPosition(
        location => {
          var search = location.coords.latitude + ',' + location.coords.longitude;
          this.setState({ searchString: search });
          var query = urlForQueryAndPage('location', search, 1);
          console.log('***************************');
          console.log(query);
          this._executeQuery(query);
        },
        error => {
          this.setState({
            message: 'There was a problem with obtaining your location: ' + error
          });
        });
    }

    render() {
        var spinner = this.state.isLoading ?
            (<ActivityIndicatorIOS hidden='true' size='large'/>) : (<View/>);

        console.log('SearchPage.render');
        return (
            <View style={styles.container}>
                <Text style={styles.description}>
                    Search for discount!
                </Text>
                <Text style={styles.description}>
                    Search by name, or search near your location.
                </Text>
                <View style={styles.flowRight}>
                      <TextInput
                          style={styles.searchInput}
                          value={this.state.searchString}
                          onChange={this.onSearchTextChanged.bind(this)}
                          placeholder='Search via name'/>
                      <TouchableHighlight style={styles.button}
                          underlayColor='#99d9f4' onPress={this.onSearchPressed.bind(this)}>
                        <Text style={styles.buttonText}>Go</Text>

                      </TouchableHighlight>
                </View>
                <TouchableHighlight style={styles.button}
                    underlayColor='#99d9f4' onPress={this.onLocationPressed.bind(this)}>
                    <Text style={styles.buttonText}>Near By</Text>
                </TouchableHighlight>
                <Image source={require('./images/house.png')} style={styles.image}/>
                {spinner}
                <Text style={styles.description}>{this.state.message}</Text>
            </View>
        );
    }
}

module.exports = SearchPage;
