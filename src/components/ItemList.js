import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withFlip } from './FlipProvider';

class ItemList extends Component {
  static propTypes = {
    items: PropTypes.array,
  };

  static defaultProps = {
    items: [],
  };

  componentDidMount() {
    const { sharedId } = this.props.flip.state;
    if (!sharedId) return;
    this.props.flip.readLast(sharedId);
  }

  componentDidUpdate() {
    this.props.flip.play();
  }

  handleClick = (index, id) => {
    this.props.flip.readFirst(id);
    this.props.onItemSelect(index);
  };

  render() {
    const { items, flip } = this.props;

    return (
      <Wrapper>
        {items.map((item, index) => {
          const thumbStyle = { ...flip.getStyles(item.id) };

          return (
            <Item
              key={item.id}
              onClick={() => this.handleClick(index, item.id)}
            >
              <Thumbnail src={item.image} id={item.id} style={thumbStyle} />
              <ItemContent>
                <Title>{item.title}</Title>
                <Text>{item.text.substring(0, 40)}...</Text>
              </ItemContent>
            </Item>
          );
        })}
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Item = styled.div`
  display: flex;
  flex-direction: row;
  padding: 16px;
  border-bottom: 1px solid #eee;

  &:active {
    background-color: #f5f5f5;
  }
`;

const Thumbnail = styled.img`
  height: 80px;
`;

const ItemContent = styled.div`
  flex: 1;
  margin-left: 16px;
`;

const Title = styled.h2`
  margin: 0px 0px 8px 0px;
  font-size: 20px;
  color: #222;
`;

const Text = styled.span`
  font-size: 16px;
  color: #444;
`;

export default withFlip(ItemList);
