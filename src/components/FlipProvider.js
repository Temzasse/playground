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

class SharedElement extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    delay: PropTypes.number,
    easing: PropTypes.string,
  };

  static defaultProps = {
    delay: 200,
    duration: 500,
    easing: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
  };

  sharedId = null;
  first = null;
  last = null;
  measurements = null;

  clear = () => {
    this.sharedId = null;
    this.first = null;
    this.last = null;
    this.measurements = null;
  };

  // Inverse happens here
  setStyles = () => {
    const { easing, duration, delay } = this.props;
    const { translateX, translateY, scaleX, scaleY } = this.measurements;
    const el = document.getElementById(this.sharedId);

    const translate = `translate3d(${translateX}px, ${translateY}px, 0px)`;
    const scale = `scale(${scaleX}, ${scaleY})`;
    const transform = `${translate} ${scale}`;

    requestAnimationFrame(() => {
      el.style.willChange = 'transform';
      el.style.transition = 'none';
      el.style.transformOrigin = 'top left';
      el.style.transform = `${transform}`;

      requestAnimationFrame(() => {
        el.style.transition = `all ${duration}ms ${easing} ${delay}ms`;
        el.style.transform = 'none';
      });
    });
  };

  readFirst = id => {
    const el = document.getElementById(id);
    const { x, y, width, height } = el.getBoundingClientRect();

    this.clear();
    this.sharedId = id;
    this.first = { x, y, width, height };
  };

  readLast = id => {
    const el = document.getElementById(id);
    const { x, y, width, height } = el.getBoundingClientRect();

    this.last = { x, y, width, height };
    this.measure();
  };

  measure = () => {
    const scaleX = this.first.width / this.last.width;
    const scaleY = this.first.height / this.last.height;
    const translateX = this.first.x - this.last.x;
    const translateY = this.first.y - this.last.y;
    this.measurements = { translateX, translateY, scaleX, scaleY };
  };

  flip = () => {
    if (this.sharedId) this.readLast(this.sharedId);
    if (this.first && this.last) this.setStyles();
  }

  render() {
    const context = {
      read: this.readFirst,
      state: this.state,
      flip: this.flip,
    };

    return (
      <FlipContext.Provider value={context}>
        {this.props.children}
      </FlipContext.Provider>
    );
  }
}

export default SharedElement;
