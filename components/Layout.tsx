"use client"
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import MailList from './MailList';

const Layout = () => {
    return (
        <Provider store={store}>
            <MailList />
        </Provider>
    );
};

export default Layout;