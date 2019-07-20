import React from 'react';
import styled from 'styled-components';
import { useBottomSheet } from './BottomSheet';

// #1D9A4C

const BottomSheetExample = () => {
  const { openBottomSheet, closeBottomSheet } = useBottomSheet();

  const open = React.useCallback(() => {
    openBottomSheet([
      {
        label: 'Share item',
        onClick: () => {
          console.log('> Share');
          closeBottomSheet();
        },
      },
      {
        label: 'Open item',
        onClick: () => {
          console.log('> Open');
          closeBottomSheet();
        },
      },
      {
        label: 'Save item',
        onClick: () => {
          console.log('> Save');
          closeBottomSheet();
        },
      },
      {
        label: 'Import items',
        onClick: () => {
          console.log('> Import');
          closeBottomSheet();
        },
      },
      {
        label: 'Some other action',
        onClick: () => {
          console.log('> Some');
          closeBottomSheet();
        },
      },
    ]);
  }, [closeBottomSheet, openBottomSheet]);

  return (
    <div>
      <Fab onClick={open}>&#8942;</Fab>
    </div>
  );
};

const Fab = styled.button`
  padding: 0;
  margin: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
  color: #fff;
  background-color: #007cff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 16px;
  right: 16px;
  border: none;

  &:active {
    background-color: #0069d7;
  }
`;

export default BottomSheetExample;
