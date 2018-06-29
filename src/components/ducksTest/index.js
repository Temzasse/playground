import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import userDucks from '../user/user.ducks';
import settingsDucks from '../settings/settings.ducks';

class DucksTest extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
  };

  render() {
    const { isAuthenticated } = this.props;

    return (
      <Wrapper>
        {isAuthenticated ? (
          <Fragment>
            <h1>You are authenticated!</h1>
            <button onClick={this.props.logout}>Logout</button>
          </Fragment>
        ) : (
          <Fragment>
            <h1>You are NOT authenticated!</h1>
            <button onClick={this.props.login}>Login</button>
            <button onClick={() => this.props.testThunk('test')}>
              Test thunk
            </button>
          </Fragment>
        )}
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  padding: 32px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export default connect(
  state => ({
    isAuthenticated: userDucks.selectors.getIsAuthenticated(state),
  }),
  {
    testThunk: settingsDucks.actions.testThunk,
    login: userDucks.actions.login,
    logout: userDucks.actions.logout,
  }
)(DucksTest);
