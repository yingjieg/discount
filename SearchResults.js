'use strict';

var React = require('react-native');
var PropertyView = require('./PropertyView');

var {
    StyleSheet,
    Image,
    View,
    TouchableHighlight,
    ListView,
    Text,
    Component
} = React;

var styles = StyleSheet.create({
  thumb: {
    width: 80,
    height: 80,
    marginRight: 10
  },
  textContainer: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#48BBEC'
  },
  title: {
    fontSize: 15,
    color: '#656565'
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10
  }
});

class SearchResults extends Component {
    constructor(props) {
        super(props);
        var dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.guid !== r2.guid
        });
        this.state = {
            dataSource: dataSource.cloneWithRows(this.props.listings)
        };
    }

    _executeQuery(property) {
        this.setState({
            isLoading: true
        });

        fetch('http://localhost:3000/api/discounts/' + property.obj_id)
            .then(response => response.json())
            .then(json => this._handleResponse(json))
            .catch(error => 
                this.setState({
                isLoading: false,
                message: 'Something bad happened ' + error
            }));
    }

    _handleResponse(data) {
        this.setState({ isLoading: false , message: '' });
        console.log(data);
            //console.log('Properties found: ' + response.size);
        this.props.navigator.push({
            title: 'Results',
            component: PropertyView,
            passProps: {property: property}
        });
    }

    rowPressed(propertyGuid) {
  		var property = this.props.listings.filter(prop => prop.obj_id === propertyGuid)[0];
  		console.log("----------------");
  		console.log(property);
  		console.log("+++++++++++++++++");
  		//this._executeQuery(property);
  		//http://localhost:3000/api/discounts/565db6aa3278da2404c18dd8
  		this.props.navigator.push({
		    title: "Property",
		    component: PropertyView,
		    passProps: {property: property}
		});
	}

    renderRow(rowData, sectionID, rowID) {
        //var price = rowData.price_formatted.split(' ')[0];
 		var url = 'http://localhost:3000/images/' + rowData.obj_id + '/' + rowData.image;
		  return (
		    <TouchableHighlight onPress={() => this.rowPressed(rowData.obj_id)}
		        underlayColor='#dddddd'>
		      <View>
		        <View style={styles.rowContainer}>
		          <Image style={styles.thumb} source={{ uri: url }} />
		          <View  style={styles.textContainer}>
		            <Text style={styles.price} numberOfLines={1}>{rowData.title}</Text>
                	<Text style={styles.title}>{rowData.address}</Text>
		          </View>
		        </View>
		        <View style={styles.separator}/>
		      </View>
		    </TouchableHighlight>
		  );
    }

    render() {
        return (
            <ListView
        		dataSource={this.state.dataSource}
        		renderRow={this.renderRow.bind(this)}/>
        );
    }
}

module.exports = SearchResults;
