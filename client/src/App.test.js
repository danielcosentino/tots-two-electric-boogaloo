import { render, screen } from '@testing-library/react';
import App from './App';
import React from 'react'; 
import Enzyme, { shallow, mount } from 'enzyme'; 
import { BrowserRouter, Route, Link } from 'react-router-dom';
//import Adapter from 'enzyme-adapter-react-16'
import renderer from 'react-test-renderer';
import { create } from "react-test-renderer";

import Login from './pages/Login'
import Register from './pages/Register'

/*test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});*/
const Adapter = require('@wojtekmaj/enzyme-adapter-react-17');
Enzyme.configure({ adapter: new Adapter() })

describe('Test Case For App', () => {
    it("renders App component without crashing", () => {
        shallow(<App />);
    });
    /*it("renders App component header without crashing", () => {
        const wrapper = shallow(<App />);
        const header = (<h1 className="has-text-centered title is-1">TOP OF THE SCHEDULE</h1>);
        expect(wrapper.contains(header)).toEqual(true);
    });
    test('Login route', () => {
        const wrapper = render(
          <MemoryRouter>
            <Login/>
         </MemoryRouter>
        );   
        const linkElements = wrapper.queryAllByText('LOGIN');
        expect(linkElements).toHaveLength(1);
    });
    test('Validate Email Form field', () => {
        const wrapper = shallow(
          <MemoryRouter>
            <Login/>
         </MemoryRouter>
        );
        console.log(wrapper.find('Email'));
        wrapper.find('#email').simulate('change', { target: { name: 'email', value: 'admin' } });
    })
    test('Validate Password Form field', () => {
        const wrapper = shallow(
          <MemoryRouter>
            <Login/>
         </MemoryRouter>
        );
        console.log(wrapper.find('Password'));
        wrapper.find('#password').simulate('change', { target: { name: 'password', value: 'admin' } });
    })
    test('Validate Name Register field', () => {
        const wrapper = shallow(
          <MemoryRouter>
            <Register/>
         </MemoryRouter>
        );
        console.log(wrapper.find('Name'));
        wrapper.find('#name').simulate('change', { target: { name: 'name', value: 'admin' } });
    })
    test('Validate Email Register field', () => {
        const wrapper = shallow(
          <MemoryRouter>
            <Register/>
         </MemoryRouter>
        );
        console.log(wrapper.find('Email'));
        wrapper.find('#email').simulate('change', { target: { name: 'email', value: 'admin' } });
    })
    test('Validate Password Register field', () => {
        const wrapper = shallow(
          <MemoryRouter>
            <Register/>
         </MemoryRouter>
        );
        console.log(wrapper.find('Password'));
        wrapper.find('#password').simulate('change', { target: { name: 'password', value: 'admin' } });
    })
    test('Validate Password Confirm field', () => {
        const wrapper = shallow(
          <MemoryRouter>
            <Register/>
         </MemoryRouter>
        );
        console.log(wrapper.find('Confirm Password'));
        wrapper.find('#confirm_password').simulate('change', { target: { name: 'confirm_password', value: 'admin' } });
    })*/

});

describe('Test Case For Login', () => {
    //let wrapper;
    /*it("login email", function() {
      wrapper = mount(<BrowserRouter><Login /></BrowserRouter>);
      wrapper.find('input[id: "loginEmail"]').simulate("change", {
        target: { id: "loginEmail", value: "tots4331@gmail.com" }
      });
      expect(wrapper.state("loginEmail")).toEqual("tots4331@gmail.com");
    });
  
    it("password", function() {
      wrapper = mount(<BrowserRouter><Login /></BrowserRouter>);
      wrapper.find('input[type="text"]').simulate("change", {
        target: { id: "loginPassword", value: "123456" }
      });
      expect(wrapper.state("loginPassword")).toEqual("123456");
    });
  
    it("login check with right data", () => {
      wrapper = mount(<BrowserRouter><Login /></BrowserRouter>);
      wrapper
        .find('input[type="text"]')
        .at(0)
        .simulate("change", { target: { id: "loginEmail", value: "tots4331@gmail.com" } });
      wrapper
        .find('input[type="password"]')
        .at(0)
        .simulate("change", { target: { id: "loginPassword", value: "123456" } });
      wrapper.find("button").simulate("click");
      expect(wrapper.state("loggedIn")).toBe(true);
    });*/
    it('Login screen UI test', () => {
      const rendered = renderer.create(<Login />).toJSON();
      expect(rendered).toBeTruthy();
  });
});

describe('Test Case For Register', () => {
  //let wrapper;
  /*it("name", function() {
    wrapper = mount(<BrowserRouter><Register /></BrowserRouter>);
    wrapper.find('input[type="text"]').simulate("change", {
      target: { id: "registerName", value: "tater" }
    });
    expect(wrapper.state("registerName")).toEqual("tater");
  });

  it("register email", function() {
    wrapper = mount(<BrowserRouter><Register /></BrowserRouter>);
    wrapper.find('input[type="text"]').simulate("change", {
      target: { id: "registerEmail", value: "tots4331@gmail.com" }
    });
    expect(wrapper.state("registerEmail")).toEqual("tots4331@gmail.com");
  });

  it("register password", function() {
    wrapper = mount(<BrowserRouter><Register /></BrowserRouter>);
    wrapper.find('input[type="text"]').simulate("change", {
      target: { id: "registerPassword", value: "123456" }
    });
    expect(wrapper.state("registerPassword")).toEqual("123456");
  });

  it("confirm password", function() {
    wrapper = mount(<BrowserRouter><Register /></BrowserRouter>);
    wrapper.find('input[type="text"]').simulate("change", {
      target: { id: "registerConfirmPassword", value: "123456" }
    });

    expect(wrapper.state("registerConfirmPassword")).toEqual("123456");
  });

  it("register check data", () => {
    wrapper = shallow(<Register />);
  
      wrapper.find('input[id="registerName"]').simulate('change', {
        target: {
          id: "registerName", value: "tater",
        },
      });
      expect(wrapper.find('input[id="registerName"]').prop('value')).toEqual(
        "tater"
      );
      wrapper.find('input[id="registerEmail"]').simulate('change', {
        target: {
          id: "registerEmail", value: "tots4331@gmail.com",
        },
      });
      expect(wrapper.find('input[id="registerEmail"]').prop('value')).toEqual(
        "tots4331@gmail.com"
      );
      wrapper.find('input[id="registerPassword"]').simulate('change', {
        target: {
          id: "registerPassword", value: "123456",
        },
      });
      expect(wrapper.find('input[id="registerPassword"]').prop('value')).toEqual(
        "123456"
      );
      wrapper.find('input[id="registerConfirmPassword"]').simulate('change', {
        target: {
          id: "registerConfirmPassword", value: "123456",
        },
      });
      expect(wrapper.find('input[id="registerConfirmPassword"]').prop('value')).toEqual(
        "123456"
      );*/
    //wrapper = mount(<BrowserRouter><Register /></BrowserRouter>);
  });

