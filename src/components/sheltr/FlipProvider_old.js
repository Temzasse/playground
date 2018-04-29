import React, { Component } from 'react';
import PropTypes from 'prop-types';

const FlipContext = React.createContext();

export function withFlip(Component) {
  return function FlippedComponent(props) {
    return (
      <FlipContext.Consumer>
        {context => <Component {...props} flip={context} />}
      </FlipContext.Consumer>
    );
  };
}

const initialState = {
  isPlaying: false,
  measurements: null,
  sharedId: null,
  first: null,
  last: null,
};

class SharedElement extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    delay: PropTypes.number,
  };

  static defaultProps = {
    delay: 200,
    duration: 500,
    easing: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
  };

  state = initialState;

  clear = () => this.setState({ ...initialState });

  setShared = sharedId => this.setState({ sharedId });

  // Inverse happens here
  getStyles = id => {
    const { measurements, isPlaying, sharedId } = this.state;
    const { easing, duration } = this.props;

    if (!measurements || id !== sharedId) return {};

    const { translateX, translateY, scaleX, scaleY } = measurements;
    const translate = `translate3d(${translateX}px, ${translateY}px, 0px)`;
    const scale = `scale(${scaleX}, ${scaleY})`;
    const transform = `${translate} ${scale}`;

    return isPlaying
      ? {
          transition: `all ${duration}ms ${easing}`,
          transformOrigin: 'top left',
          transform: 'none',
        }
      : {
          transition: 'none',
          transformOrigin: 'top left',
          transform: `${transform}`,
        };
  };

  setStyles = id => {
    console.log(this.state);
  };

  readFirst = id => {
    const el = document.getElementById(id);
    const dim = el.getBoundingClientRect();

    this.clear();
    this.setShared(id);
    this.setState(
      { first: { x: dim.x, y: dim.y, width: dim.width, height: dim.height } },
      this.measure
    );
  };

  readLast = id => {
    const el = document.getElementById(id);
    const dim = el.getBoundingClientRect();

    this.setState(
      { last: { x: dim.x, y: dim.y, width: dim.width, height: dim.height } },
      this.measure
    );
  };

  measure = () => {
    const { first, last } = this.state;
    if (!first || !last) return;

    const scaleX = first.width / last.width;
    const scaleY = first.height / last.height;
    const translateX = first.x - last.x;
    const translateY = first.y - last.y;

    this.setState({ measurements: { translateX, translateY, scaleX, scaleY } });
  };

  play = () => {
    const { isPlaying, last, first } = this.state;

    // Only fire play once since it's called in componentDidUpdate
    if (!isPlaying && last && first) {
      setTimeout(() => {
        this.setState({ isPlaying: true });
      }, this.props.delay);
    }
  };

  render() {
    const context = {
      readFirst: this.readFirst,
      readLast: this.readLast,
      play: this.play,
      state: this.state,
      getStyles: this.getStyles,
    };

    return (
      <FlipContext.Provider value={context}>
        {this.props.children}
      </FlipContext.Provider>
    );
  }
}

export default SharedElement;
