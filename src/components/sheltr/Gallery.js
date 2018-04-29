import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { withSheltr } from './Sheltr';

const propTypes = {
  images: PropTypes.array.isRequired,
};

class Gallery extends Component {
  componentDidMount() {
    this.props.sheltr.transition();
  }

  handleClick = id => {
    this.props.sheltr.read(id);
  };

  render() {
    const { images, match } = this.props;

    return (
      <Wrapper>
        {images.map(col => (
          <Column key={col.id}>
            {col.images.map(img => (
              <ImgWrapper
                key={img.id}
                to={`${match.url}/${img.id}`}
                onClick={() => this.handleClick(img.id)}
              >
                <Img key={img.id} id={img.id} src={img.src} />
              </ImgWrapper>
            ))}
          </Column>
        ))}
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0 4px;
`;

const Column = styled.div`
  flex: 33.33%;
  max-width: 33.33%;
  padding: 0 4px;

  @media screen and (max-width: 800px) {
    flex: 50%;
    max-width: 50%;
  }

  @media screen and (max-width: 600px) {
    flex: 100%;
    max-width: 100%;
  }
`;

const ImgWrapper = styled(Link)`
  display: block;
  margin-top: 8px;
`;

const Img = styled.img`
  width: 100%;
  height: auto;
  background-color: #eee;
`;

Gallery.propTypes = propTypes;

export default withSheltr(Gallery);
