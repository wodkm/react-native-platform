import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
var Dimensions = require('Dimensions');
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;

export default class Line extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <View style={styles.line}></View>
    );
  }
}
var styles = StyleSheet.create({
  line: {
    width: currentWidth,
    height: 1,
    backgroundColor: '#EBE6E6',
    marginLeft: 10
  }
});