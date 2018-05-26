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

  // Put `isTransitioning` inside React compoennt state so that changes made
  // to it cause a re-render.
  state = {
    // TODO: not sure what this can be used for...
    isTransitioning: false,
  };

  getSharedId = () => this.sharedId;

  getSharedElements = () => {
    return [
      ...document.querySelectorAll(`[data-sheltr-id="${this.sharedId}"]`),
    ];
  };

  getActiveElement = () => {
    const els = this.getSharedElements();
    const [el] = els.filter(({ dataset }) => !dataset.sheltrRead);
    return el;
  };

  clearState = () => {
    this.sharedId = null;
    this.first = null;
    this.last = null;
  };

  unmarkSharedElements = () => {
    this.getSharedElements().forEach(el => {
      el.removeAttribute('data-sheltr-read');
    });
  };

  readFirst = id => {
    this.clearState();
    this.sharedId = id;

    const el = this.getActiveElement();
    const { x, y, width, height } = el.getBoundingClientRect();

    this.unmarkSharedElements(); // remove `data-sheltr-read` from others first
    el.setAttribute('data-sheltr-read', 'true'); // then mark el as read

    this.first = { x, y, width, height };
  };

  readLast = () => {
    const el = this.getActiveElement();
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
    this.invert(el);
  };

  invert = el => {
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

      this.play(el);
    });
  };

  play = el => {
    const { easing, duration, delay } = this.props;

    // Play
    this.setState({ isTransitioning: true });

    // Wait for the next frame so we know all the style changes have
    // taken hold: https://aerotwist.com/blog/flip-your-animations/
    requestAnimationFrame(() => {
      el.style.transition = `transform ${duration}ms ${easing} ${delay}ms`;
      el.style.transform = 'none';

      // Remove temp properties after animation is finished
      el.addEventListener('transitionend', () => {
        // Remove tmp width and height
        el.style.removeProperty('width');
        el.style.removeProperty('height');

        // Cleanup transition related styles
        el.style.willChange = 'unset';
        el.style.transition = 'none';

        this.setState({ isTransitioning: false });
        this.clearState();
      });
    });
  };

  // NOTE: "first" should always be read before calling transition
  transition = () => {
    if (!this.sharedId || this.state.isTransitioning) return; // bail
    this.readLast();
  };

  render() {
    const context = {
      read: this.readFirst,
      transition: this.transition,
      getSharedId: this.getSharedId,
      state: this.state,
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
    children: PropTypes.func.isRequired,
    sharedId: PropTypes.string.isRequired,
    startOnUnmount: PropTypes.bool,
    startOnClick: PropTypes.bool,
  };

  static defaultProps = {
    startOnClick: true,
    transitionStyles: {},
  };

  componentDidMount() {
    this.props.sheltr.transition();
  }

  shouldComponentUpdate() {
    // Optimize rendering
    return this.props.sharedId === this.props.sheltr.getSharedId();
  }

  componentWillUnmount() {
    if (this.props.startOnUnmount) {
      this.props.sheltr.read(this.props.sharedId);

      if (this.props.completeOnUnmount) {
        this.props.sheltr.transition();
      }
    }
  }

  handleClick = () => {
    this.props.sheltr.read(this.props.sharedId);
  };

  render() {
    const { sheltr, sharedId, startOnUnmount } = this.props;

    // Set transition styles if shared element is under transition
    // and determine params for children func.
    const baseParams = {
      ...sheltr.state, // pass state if someone wants to do something with it
      'data-sheltr-id': sharedId,
    };

    const params = startOnUnmount
      ? baseParams // no need for click handler
      : { ...baseParams, onClick: this.handleClick };

    return this.props.children(params);
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
