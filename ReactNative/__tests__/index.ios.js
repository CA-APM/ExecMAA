import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {setTesting, isTesting} from "../projectTest/isTesting";
import App from "../index.ios";


it('set testing', () =>{
  setTesting(true);
  const toTest = isTesting();
  console.log(toTest);
  expect(1).toBe(1);
});

jest.mock('react-native-i18n', () => {
    return {};
});


test('Does something else', () => {
    const tree = renderer.create(
        <App/>
    ).toJSON().toMatchSnapshot();
});