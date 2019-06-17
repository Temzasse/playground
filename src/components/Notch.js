import React from 'react';
import { View, SafeAreaView, AsyncStorage, StyleSheet } from 'react-native';

const MAX_RENDERS = 3;
const STORAGE_ID = '@notch/status';
const NotchContext = React.createContext({ hasNotch: false });

class NotchProvider extends React.Component {
  state = {
    isReady: false,
    notchChecked: false,
    hasNotch: false,
    renderCount: 0,
  };

  async componentDidMount() {
    const hasNotch = await AsyncStorage.getItem(STORAGE_ID);
    // eslint-disable-next-line
    this.setState({ isReady: true, notchChecked: hasNotch, hasNotch });
  }

  // TODO: handle orientation?
  handleLayout = ({ nativeEvent }) => {
    const {
      layout: { y },
    } = nativeEvent;

    // Has notch
    if (y > 0) {
      this.setState({ hasNotch: true, notchChecked: true });
      AsyncStorage.setItem(STORAGE_ID, 'true');
    } else {
      // HACK: Re-render for X times since sometimes the y value is zero
      // even though the device has a notch
      this.setState(prev => ({ renderCount: prev.renderCount + 1 }));
    }
  };

  render() {
    const { renderCount, notchChecked, hasNotch, isReady } = this.state;

    if (!isReady) return null;

    const context = { hasNotch };

    return (
      <NotchContext.Provider value={context}>
        {!hasNotch && !notchChecked && renderCount < MAX_RENDERS ? (
          <SafeAreaView
            style={[StyleSheet.absoluteFill, { opacity: 0 }]}
            pointerEvents="box-none"
          >
            <View onLayout={this.handleLayout} key={renderCount} />
          </SafeAreaView>
        ) : (
          this.props.children
        )}
      </NotchContext.Provider>
    );
  }
}

export { NotchProvider, NotchContext };
