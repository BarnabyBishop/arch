React = require('react');

var Home = React.createClass({
	render: function() {
		var images = [];
		for (var i = 0; i < URLS.length; i++) {
			images.push(<img className='image' src={URLS[i]} />);
		}
		var styles = { textAlign:'center' }
		return (
			<div style={styles}>
				{images}
			</div>
		);
	}
});

module.exports = Home;
