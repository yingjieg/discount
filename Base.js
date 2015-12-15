'use strict';

var React = require('react-native');
var SearchPage = require('./SearchPage');
var SearchResults = require('./SearchResults');

var {
    Image,
    ListView,
    Component,
    TouchableHighlight,
    StyleSheet,
    Text,
    View,
} = React;

var icons = [
	require('./Thumbnails/food.png'),
	require('./Thumbnails/hotel.png'),
	require('./Thumbnails/life.png'),
	require('./Thumbnails/heart.png'),
	require('./Thumbnails/liking.png'),
	require('./Thumbnails/party.png')
];

var titles = [
	'Food',
	'Hotel',
	'Life',
	'Heart',
	'Near By',
	'Search'
];

class ListViewGridLayoutExample extends Component {
	constructor(props) {
		super(props);
		var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		this.state = {
            dataSource: dataSource.cloneWithRows(this._genRows({}))
        };

        this._pressData = {};
	}
/*
	static defaultProps = {
		title: '<ListView> - Grid Layout',
		description: 'Flexbox grid layout.'
	}

	static propTypes = {
		title: React.PropTypes.string.isRequired,
		description: React.PropTypes.string.isRequired
	}
*/
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

	render() {
		return (
			<ListView
				contentContainerStyle={styles.list}
				dataSource={this.state.dataSource}
				renderRow={this._renderRow.bind(this)}
			/>
		);
	}

	_pressRow(rowID: number, rowData: string) {
		console.log("+++++++++++++++++++++++++");
		console.log(this._pressData);
		var queryStr = '';
		//this._pressData[rowID] = !this._pressData[rowID];
		//this.setState({
		//	dataSource: this.state.dataSource.cloneWithRows(this._genRows(this._pressData))
		//});

		if (rowData === 'Search') {
			this.props.navigator.push({
		    	title: "Search",
		    	component: SearchPage,
		    	//passProps: {property: property}
			});
		} else if (rowData === 'Food') {
			queryStr = urlForQueryAndPage('tags', 'food');
			this._executeQuery(queryStr);
		} else if (rowData === 'Hotel') {
			queryStr = urlForQueryAndPage('tags', 'hotel');
			this._executeQuery(queryStr);
		} else if (rowData === 'Life') {
			queryStr = urlForQueryAndPage('tags', 'life');
			this._executeQuery(queryStr);
		}
	}

	_renderRow(rowData: string, sectionID: number, rowID: number) {
		var imgSource = icons[rowID];

		return (
			<TouchableHighlight onPress={() => this._pressRow(rowID, rowData)} underlayColor="transparent">
				<View>
					<View style={styles.row}>
						<Image style={styles.thumb} source={imgSource} />
						<Text style={styles.text}>
							{rowData}
						</Text>
					</View>
				</View>
			</TouchableHighlight>
		);
	}

	_genRows(pressData: {[key: number]: boolean}): Array<string> {
		var dataBlob = [];
		for (var ii = 0; ii < 6; ii++) {
			var pressedText = pressData[ii] ? '(X)' : '';
			//dataBlob.push('Cell ' + ii + pressedText);
			dataBlob.push(titles[ii]);
		}
		return dataBlob;
	}
}

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


var styles = StyleSheet.create({
  list: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  row: {
    justifyContent: 'center',
    padding: 5,
    margin: 3,
    width: 100,
    height: 100,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#CCC'
  },
  thumb: {
    width: 64,
    height: 64
  },
  text: {
    flex: 1,
    marginTop: 5,
    fontWeight: 'bold'
  },
});

module.exports = ListViewGridLayoutExample;

