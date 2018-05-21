# React Sheltr

## Installation

  npm install react-sheltr

NOTE: this is not a npm package yet...

## Table of Contents

* [What is it?](#what-is-it-)
* [Usage](#usage)
* [Examples](#examples)
* [TODO](#todo)

## What is it?

React Sheltr makes it easier to implement Shared Element Transitions, which is where
the name comes from: Sh El Tr -> Sheltr 😉

What is a shared element transition you ask?

Shared element transition simply means a transition between two views where some
element common for both views is used to bridge the transition.
In practice there are two different elements that are transformed to seem like
one element that morphs from one element to the other.

More more...

**Inspiration:**

- https://aerotwist.com/blog/flip-your-animations/
- https://css-tricks.com/native-like-animations-for-page-transitions-on-the-web/
- https://github.com/joshwcomeau/react-flip-move

## Usage

### The simple way

First add sheltr provider somewhere up in the view hierarchy tree just like you
would add your redux Provider or styled-components ThemeProvider.

```javascript
import Sheltr from 'react-sheltr';

<Sheltr>
  {/* other components go here */}
</Sheltr>
```

Then you can use `SharedElement` *render-prop* / *children as a function*
component to define your shared elements.

Here we have two related image components: one that starts the FLIP process when
it is clicked and one when it unmounts.

```javascript
import { SharedElement } from 'react-sheltr';

// Component A
<SharedElement sharedId={idThatIsSameForAandB} readOnClick>
  {sheltrProps => (
    <ImageA {...sheltrProps}>
      {/* stuff */}
    </ImageA>
  )}
</SharedElement>

// Component B
<SharedElement sharedId={idThatIsSameForAandB} readOnUnmount>
  {sheltrProps => (
    <ImageB {...sheltrProps}>
      {/* stuff */}
    </ImageB>
  )}
</SharedElement>
```

In some cases you might need to apply the individual `sheltrProps`, `id` and `onClick`, to two separate components.

```javascript
<SharedElement sharedId={youProvideThisId} readOnClick>
  {({ id, onClick }) => (
    <Wrapper onClick={onClick}>
      <Image id={id} />
    </Wrapper>
  )}
</SharedElement>
```

### The HOC way

If you don't fancy the *render prop* pattern you can use `withSheltr`
Higher Order Component to gain access to the underlying API and manually handle things
that `ShareElement` would do for you.

```javascript
// ComponentA
import { withSheltr } from 'react-sheltr';

class ComponentA extends Component {
  componentDidMount() {
    this.props.sheltr.transition();
  }

  handleClick = id => {
    this.props.sheltr.read(id);
  };

  render() {
    return (
      <Wrapper>
        {this.props.items.map(item => {
          return (
            <Item onClick={() => this.handleClick(item.id)}>
              <Thumbnail src={item.image} id={item.id} />
              {/* other things... */}
            </Item>
          );
        })}
      </Wrapper>
    );
  }
}

export default withSheltr(ComponentA);
```

```javascript
// ComponentB
import { withSheltr } from 'react-sheltr';

class ComponentB extends Component {
  componentDidMount() {
    this.props.sheltr.transition();
  }

  componentWillUnmount() {
    this.props.sheltr.read(this.props.image.id);
  }

  render() {
    return (
      <Wrapper>
        <Img src={this.props.image.src} id={this.props.image.id} />
        {/* other things... */}
      </Wrapper>
    );
  }
}

export default withSheltr(ComponentB);
```

## Examples

To see more real-world-like examples that use `react-router` and `styled-components`
check the **examples** folder for two quite common use cases for shared element transitions:

- List view with thumbnail images that morph into the header of the clicked item's detail view.
- Simple mosaic image gallery

## TODO

- [ ] Fix image gallery item jumping if page has scrollable content
