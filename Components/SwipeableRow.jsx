import { Ionicons } from '@expo/vector-icons';
import React, { Component } from 'react';
import { Animated, StyleSheet, I18nManager } from 'react-native';

import { RectButton } from 'react-native-gesture-handler';

import Swipeable from 'react-native-gesture-handler/Swipeable';

export default class SwipeableRow extends Component {
     renderRightActions = (_progress, dragX) => {
    return (
      <RectButton style={styles.rightAction} onPress={this.close}>
        <Ionicons name="trash-outline" size={24} color="white" style={{ marginRight: 10 }} />
      </RectButton>
    );
  };

   swipeableRow;

   updateRef = (ref) => {
    this.swipeableRow = ref;
  };
   close = () => {
    this.swipeableRow?.close();
    this.props.onDelete();
  };

  render() {
    const { children } = this.props;
    return (
      <Swipeable ref={this.updateRef} friction={2} leftThreshold={80} enableTrackpadTwoFingerGesture rightThreshold={40} renderRightActions={this.renderRightActions}>
        {children}
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  rightAction: {
    alignItems: 'center',
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    backgroundColor: '#dd2c00',
    flex: 1,
    justifyContent: 'flex-end',
  },
});
