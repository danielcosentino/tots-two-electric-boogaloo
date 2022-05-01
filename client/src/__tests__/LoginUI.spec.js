import React from "react"; 
import renderer from 'react-test-renderer'; 
import Login from '../pages/Login'

it('Login screen UI test', () => {
    const rendered = renderer.create(<Login />).toJSON();
    expect(rendered).toBeTruthy();
});