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
    duration: 400,
    easing: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
  };

  sharedId = null;
  first = null;
  last = null;

  clearState = () => {
    this.sharedId = null;
    this.first = null;
    this.last = null;
  };

  readFirst = id => {
    this.clearState();

    const el = document.getElementById(id);
    const { x, y, width, height } = el.getBoundingClientRect();

    this.sharedId = id;
    this.first = { x, y, width, height };
  };

  readLast = () => {
    const el = document.getElementById(this.sharedId);
    const { x, y, width, height } = el.getBoundingClientRect();

    /* NOTE:
     * If image is not loaded `getBoundingClientRect` returns `height: 0`
     * at least with Safari after some quick testing.
     * So we need to calculate height from the width and aspect ratio
     * of the element if the user has provided the known
     * native width / height of the image.
     */
    let h = height;
    const { sheltrWidth, sheltrHeight } = el.dataset;

    if (!height && width && sheltrWidth && sheltrHeight) {
      const aspectRatio = sheltrWidth / sheltrHeight;
      h = width / aspectRatio;
    }

    this.last = { x, y, width, height: h };
  };

  invert = () => {
    const el = document.getElementById(this.sharedId);

    // Calculate scale and translate for inversion
    const scaleX = this.first.width / this.last.width;
    const scaleY = this.first.height / this.last.height;
    const translateX = this.first.x - this.last.x;
    const translateY = this.first.y - this.last.y;
    const translate = `translate3d(${translateX}px, ${translateY}px, 0px)`;
    const scale = `scale(${scaleX}, ${scaleY})`;
    const transform = `${translate} ${scale}`;

    // Invert
    requestAnimationFrame(() => {
      el.style.willChange = 'transform';
      el.style.transition = 'none';
      el.style.transformOrigin = 'top left';
      el.style.transform = `${transform}`;

      // Set fixed width / height for more robust animation on Safari
      if (this.last.width > 0 && this.last.height > 0) {
        el.style.width = `${this.last.width}px`;
        el.style.height = `${this.last.height}px`;
      }

      this.play();
    });
  };

  play = () => {
    const el = document.getElementById(this.sharedId);
    const { easing, duration, delay } = this.props;

    // Play
    // Wait for the next frame so we know all the style changes have
    // taken hold: https://aerotwist.com/blog/flip-your-animations/
    requestAnimationFrame(() => {
      el.style.transition = `transform ${duration}ms ${easing} ${delay}ms`;
      el.style.transform = 'none';

      // Remove temp properties after animation is finished
      el.addEventListener('transitionend', () => {
        el.style.removeProperty('width');
        el.style.removeProperty('height');
      })

      this.clearState();
    });
  };

  // "First" should always be read before calling `transition`
  transition = () => {
    if (this.first && this.sharedId) {
      this.readLast();
      this.invert(); // this will call `play` to start the animation
    }
  };

  render() {
    const context = {
      read: this.readFirst,
      transition: this.transition,
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
    children: PropTypes.func.isRequired,
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

// HOC for more manual usage
export function withSheltr(Component) {
  return function SheltrComponent(props) {
    return (
      <SheltrContext.Consumer>
        {context => <Component {...props} sheltr={context} />}
      </SheltrContext.Consumer>
    );
  };
}

// Helper component to wrap shared elements
export const SharedElement = withSheltr(SharedElementComp);

// Main provider component
export default Sheltr;
