import React, { Component } from 'react';
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Animated,
    Easing
} from 'react-native';
var Dimensions = require('Dimensions');
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;

export default class Loading extends Component {
    constructor(props) {
        super(props);
        this.close = this.close.bind(this);
    }

    close() {
        console.log("onRequestClose ---- ")
    }
    render() {
        const { showLoading, opacity, backgroundColor } = this.props
        return (
            <Modal onRequestClose={() => this.close()} visible={showLoading} transparent={false}>
                <View style={[styles.loadingView, { opacity: opacity || 0.3, backgroundColor: backgroundColor || '#F5F5F5' }]}></View>
                <View style={styles.loadingImageView}>
                    <View style={styles.loadingImage}>
                        {
                            this.props.closeLoading ?
                                <TouchableOpacity onPress={this.props.closeLoading}>
                                    <Image style={styles.loadingImage} source={require('@image/loading.gif')} />
                                </TouchableOpacity>
                                :
                                <Image style={styles.loadingImage} source={require('@image/loading.gif')} />
                        }
                    </View>
                </View>

            </Modal>
        );
    }
}
const styles = StyleSheet.create({
    loadingView: {
        flex: 1,
        height: currentHeight,
        width: currentWidth,
        position: 'absolute',
    },
    loadingImage: {
        width: 120,
        height: 100,
    },
    loadingImageView: {
        position: 'absolute',
        width: currentWidth,
        height: currentHeight,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

Loading.propTypes = {
    showLoading: React.PropTypes.bool,
    opacity: React.PropTypes.number,
    backgroundColor: React.PropTypes.string,
    closeLoading: React.PropTypes.func
}