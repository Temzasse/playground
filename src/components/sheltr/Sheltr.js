import React, { Component } from 'react';
import PropTypes from 'prop-types';

const SheltrContext = React.createContext();

// Shared Element Transition --> Sh El Tr --> Sheltr
class Sheltr extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    delay: PropTypes.number,
    easing: PropTypes.string,
  };

  static defaultProps = {
    delay: 0,
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

  setStyles = () => {
    const { easing, duration, delay } = this.props;
    const el = document.getElementById(this.sharedId);

    const { translateX, translateY, scaleX, scaleY } = this.measurements;
    const translate = `translate3d(${translateX}px, ${translateY}px, 0px)`;
    const scale = `scale(${scaleX}, ${scaleY})`;
    const transform = `${translate} ${scale}`;

    // Invert
    requestAnimationFrame(() => {
      el.style.willChange = 'transform';
      el.style.transition = 'none';
      el.style.transformOrigin = 'top left';
      el.style.transform = `${transform}`;

      // Set fixed width / height for more robust animation
      if (this.last.width > 0 && this.last.height > 0) {
        el.style.width = `${this.last.width}px`;
        el.style.height = `${this.last.height}px`;
      }

      // Play
      requestAnimationFrame(() => {
        el.style.transition = `transform ${duration}ms ${easing} ${delay}ms`;
        el.style.transform = 'none';

        // Add some extra time to take lagginess into account.
        // TODO: use `transitionend` instead?
        setTimeout(() => {
          el.style.removeProperty('width');
          el.style.removeProperty('height');
        }, delay + 1000);

        this.clear();
      });
    });
  };

  measure = () => {
    const scaleX = this.first.width / this.last.width;
    const scaleY = this.first.height / this.last.height;
    const translateX = this.first.x - this.last.x;
    const translateY = this.first.y - this.last.y;
    this.measurements = { translateX, translateY, scaleX, scaleY };
  };

  readFirst = id => {
    const el = document.getElementById(id);
    const { x, y, width, height } = el.getBoundingClientRect();

    this.clear();
    this.sharedId = id;
    this.first = { x, y, width, height };
  };

  readLast = () => {
    const el = document.getElementById(this.sharedId);
    const { sheltrWidth, sheltrHeight } = el.dataset;
    const aspectRatio = sheltrWidth / sheltrHeight;

    /* NOTE: if image is not loaded `getBoundingClientRect` returns `height: 0`
     * at least with Safari after some quick testing.
     * So we need to calculate height from the width and aspect ratio
     * of the element if the user has provided the known
     * native width / height of the image.
     *
     * TODO: can width be zero and mess things up?
     */
    const { x, y, width, height } = el.getBoundingClientRect();
    const finalHeight = height || width / aspectRatio;

    this.last = { x, y, width, height: finalHeight };
    this.measure();
  };

  // NOTE: "First" is always read before `transition`
  transition = () => {
    if (this.first && this.sharedId) {
      this.readLast(); // Last
      this.setStyles(); // Invert & Play
    }
  };

  render() {
    const context = {
      read: this.readFirst,
      transition: this.transition,
      getSharedId: this.getSharedId,
    };

    return (
      <SheltrContext.Provider value={context}>
        {this.props.children}
      </SheltrContext.Provider>
    );
  }
}

class SharedElementComp extends Component {
  static propTypes = {
    readOnUnmount: PropTypes.bool,
    readOnClick: PropTypes.bool,
  };

  static defaultProps = {
    readOnUnmount: false,
    readOnClick: false,
  };

  componentDidMount() {
    this.props.sheltr.transition();
  }

  componentWillUnmount() {
    if (this.props.readOnUnmount) {
      this.props.sheltr.read(this.props.sharedId);
    }
  }

  handleClick = () => {
    if (this.props.readOnClick) {
      this.props.sheltr.read(this.props.sharedId);
    }
  };

  render() {
    if (this.props.readOnClick) {
      return this.props.children({
        id: this.props.sharedId,
        onClick: this.handleClick,
      });
    }

    return this.props.children({ id: this.props.sharedId });
  }
}

// Exported *****************************************************************

// HOC
export function withSheltr(Component) {
  return function SheltrComponent(props) {
    return (
      <SheltrContext.Consumer>
        {context => <Component {...props} sheltr={context} />}
      </SheltrContext.Consumer>
    );
  };
}

// Helper component
export const SharedElement = withSheltr(SharedElementComp);

// Main provider
export default Sheltr;
