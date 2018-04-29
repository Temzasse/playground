import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withSheltr } from './Sheltr';

class GalleryItem extends Component {
  static propTypes = {
    foo: PropTypes.object,
  };

  componentDidMount() {
    this.props.sheltr.transition();
  }

  componentWillUnmount() {
    this.props.sheltr.read(this.props.image.id);
  }

  render() {
    const { image } = this.props;

    return (
      <Wrapper onClick={this.props.history.goBack}>
        <Img src={image.src} id={image.id} />
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 32px;
`;

const Img = styled.img`
  max-width: 100%;
  max-height: 90vh;
  height: auto;
`;

export default withSheltr(GalleryItem);
