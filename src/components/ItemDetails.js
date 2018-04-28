import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css, keyframes } from 'styled-components';
import { withSheltr } from './Sheltr';

class ItemDetails extends Component {
  static propTypes = {
    onBack: PropTypes.func.isRequired,
    sheltr: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
  };

  onBack = () => {
    this.props.onBack();
  };

  componentDidMount() {
    this.props.sheltr.transition();
  }

  componentWillUnmount() {
    this.props.sheltr.read(this.props.item.id);
  }

  render() {
    const { item } = this.props;

    return (
      <Wrapper>
        <BackButton onClick={this.onBack}>Back</BackButton>
        <HeaderImage
          src={item.image}
          id={item.id}
          data-native-width="800"
          data-native-height="600"
        />
        <Content>
          <Heading>{item.title}</Heading>
          <Text>{item.text}</Text>
        </Content>
      </Wrapper>
    );
  }
}

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0px);
  }
`;

const fadeDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0px);
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`;

const BackButton = styled.div`
  z-index: 1;
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 8px 16px;
  background-color: slategray;
  border-radius: 99px;
  color: #fff;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  animation-name: ${fadeDown};
  animation-duration: 0.4s;
  animation-timing-function: ease;
  animation-delay: 0.8s;
  animation-fill-mode: forwards;
  box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.3);
`;

const HeaderImage = styled.img`
  z-index: 0;
  width: 100%;
  background: #eee;
`;

const Content = styled.div`
  padding: 24px 16px;
  opacity: 0;
  animation-name: ${fadeUp};
  animation-duration: 0.4s;
  animation-timing-function: ease;
  animation-delay: 0.5s;
  animation-fill-mode: forwards;
`;

const Heading = styled.h1`
  margin: 0px 0px 16px 0px;
  font-size: 32px;
  color: #222;
`;

const Text = styled.span`
  font-size: 16px;
  color: #444;
`;

export default withSheltr(ItemDetails);
