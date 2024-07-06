import { describe, test, expect } from 'vitest';
import TabMenu from './tab-menu';
import React from 'react';

// describe('tabMenu', () => {
//   test('should render correctly', () => {
//     expect(tabMenu({ menuItems: new Map() })).toMatchSnapshot();
//   });
// });
describe('tabMenu', () => {
  test('should render correctly', () => {
    const menuItems = new Map([
      [
        {
          jobHistory: 0,
          0: 'jobHistory',
          initial: 1,
          1: 'initial',
          contributions: 2,
          2: 'contributions',
          hobbies: 3,
          3: 'hobbies',
        },
        [
          {
            id: 0,
            title: 'jobHistory',
            component: <div>jobHistory</div>,
          },
          {
            id: 1,
            title: 'initial',
            component: <div>initial</div>,
          },
          {
            id: 2,
            title: 'contributions',
            component: <div>contributions</div>,
          },
          {
            id: 3,
            title: 'hobbies',
            component: <div>hobbies</div>,
          },
        ],
      ],
    ]);
    expect(<TabMenu menuItems={menuItems} initial='initial' />).toMatchSnapshot();
  });
});


