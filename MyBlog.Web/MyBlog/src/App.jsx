import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Layout from './components/Other/Layout';
import Feed from './components/Posts/Feed';
import PostFull from './components/Posts/PostFull';
import NewPost from './components/Posts/NewPost';
import EditPost from './components/Posts/EditPost';
import Users from './components/User/Users';
import Profile from './components/User/Profile';
import SignIn from './components/User/SignIn';
import SignUp from './components/User/SignUp';
import EditProfile from './components/User/EditProfile';
import ChangePassword from './components/User/ChangePassword';
import Blocking from './components/User/Blocking';
import Categories from './components/Category/Categories';
import AuthHelper from './Utils/authHelper';
import Page404 from './components/Other/404';

export default class App extends Component {
  render () {
    return (
        <Layout>
            <Switch>
                <Route path='/feed' component={Feed} />
                <Route exact path='/' render={() => (<Redirect to='/feed' />)} />
                <Route path='/post' component={PostFull} />
                {AuthHelper.getRole() !== 'Guest' && <Route path='/newPost' component={NewPost} />}
                {AuthHelper.getRole() !== 'Guest' && <Route path='/editPost' component={EditPost} />}

                {(AuthHelper.getRole() === 'Admin' || AuthHelper.getRole() === 'Account manager') && <Route path='/users' component={Users} />}
                <Route path='/user' component={Profile} />
                <Route path='/signUp' component={SignUp} />
                {AuthHelper.getRole() === 'Guest' && <Route path='/signIn' component={SignIn} />}
                {AuthHelper.getRole() !== 'Guest' && <Route path='/editProfile' component={EditProfile} />}
                {AuthHelper.getRole() !== 'Guest' && <Route path='/changePassword' component={ChangePassword} />}
                {(AuthHelper.getRole() === 'Admin' || AuthHelper.getRole() === 'Account manager') && <Route path='/blocking' component={Blocking} />}
                {AuthHelper.getRole() === 'Admin' && <Route path='/categories' component={Categories} />}
                <Route path="*" component={Page404}/>
            </Switch>
        </Layout>
    );
  }
}
