import React, { Component } from 'react';
import styled from 'styled-components';

import FlipProvider from './components/FlipProvider';
import ItemList from './components/ItemList';
import ItemDetails from './components/ItemDetails';

class App extends Component {
  state = {
    items: [
      {
        id: 'item_1',
        title: 'Flip with the new React Context API!',
        text: 'Market metrics growth hacking product management gamification backing creative prototype return on investment. Ownership prototype venture termsheet strategy startup network effects. Iteration long tail ownership virality buzz burn rate release entrepreneur direct mailing seed round business-to-consumer network effects. Hypotheses assets virality android angel investor partnership innovator seed round marketing non-disclosure agreement creative twitter.',
        image: 'https://source.unsplash.com/N-X3TCHj5Jk/800x600',
      },
      {
        id: 'item_2',
        title: 'I think it is pretty neat :)',
        text: 'Mass market launch party growth hacking traction social proof incubator iPhone alpha angel investor non-disclosure agreement channels graphical user interface seed money innovator. MVP virality low hanging fruit network effects. Paradigm shift beta partner network channels A/B testing return on investment pitch rockstar churn rate iPhone growth hacking responsive web design business-to-consumer prototype.',
        image: 'https://source.unsplash.com/B3xZzHI88Ik/800x600',
      },
      {
        id: 'item_3',
        title: 'I turned myself into a Flip, Morty!',
        text: 'Incubator iteration rockstar alpha social proof stock stealth. Stock iPhone ecosystem monetization churn rate strategy ownership. First mover advantage graphical user interface beta equity infrastructure focus. Hypotheses success innovator vesting period crowdsource rockstar angel investor long tail social proof. Startup investor disruptive prototype interaction design founders equity direct mailing customer paradigm shift series A financing first mover advantage. Leverage facebook first mover advantage pivot entrepreneur disruptive research & development release growth hacking user experience creative freemium funding marketing. ',
        image: 'https://source.unsplash.com/sKn-Yy4BRtY/800x600',
      },
      {
        id: 'item_4',
        title: 'Wubba lubba dub dub!',
        text: 'Accelerator hackathon ownership stealth responsive web design scrum project customer network effects metrics termsheet burn rate growth hacking influencer. Metrics first mover advantage handshake stealth disruptive value proposition founders niche market incubator beta user experience launch party venture market. Focus vesting period release partnership business model canvas user experience.',
        image: 'https://source.unsplash.com/Cegipir4rcI/800x600',
      },
    ],
    activeItemIndex: null,
  };

  selectItem = index => {
    this.setState({ activeItemIndex: index });
  };

  deSelectItem = index => {
    this.setState({ activeItemIndex: null });
  };

  render() {
    const { activeItemIndex, items } = this.state;

    return (
      <Wrapper>
        <FlipProvider>
          {activeItemIndex !== null ? (
            <ItemDetails
              item={items[activeItemIndex]}
              onBack={this.deSelectItem}
            />
          ) : (
            <ItemList items={items} onItemSelect={this.selectItem} />
          )}
        </FlipProvider>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  max-width: 900px;
  margin: 60px auto;
`;

export default App;
