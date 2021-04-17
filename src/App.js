import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {
  Navbar,
  Register,
  Login,
  PrivateRoute,
  Alerts,
  NotFound,
  Reviews,
  CreateReview
} from './components';
import {
  Home,
  BootcampPage,
  ManageReviewsPage,
  ManageAccountPage,
  UpdatePasswordPage,
  ManageBootcampsPage,
  AddEditBootcampPage
} from './pages';
import { BootcampsProvider } from './context/bootcampsContext';
import { AuthProvider } from './context/authContext';
import AlertState from './context/alert/AlertState';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BootcampsProvider>
        <AlertState>
          <Router>
            <Navbar />
            <Alerts />
            {/* <Sidebar />*/}
            <Switch>
              <Route exact path='/'>
                <Home />
              </Route>
              <Route path='/login' component={Login} />
              <Route path='/register' component={Register} />
              <PrivateRoute
                path='/managereviews'
                component={ManageReviewsPage}
              />
              <PrivateRoute
                path='/manageaccount'
                component={ManageAccountPage}
              />
              <PrivateRoute
                path='/updatepassword'
                component={UpdatePasswordPage}
              />
              <PrivateRoute
                path='/managebootcamps'
                component={ManageBootcampsPage}
              />
              <PrivateRoute
                path='/addbootcamp'
                component={AddEditBootcampPage}
              />
              <PrivateRoute
                path='/editbootcamp'
                component={AddEditBootcampPage}
              />
              <Route exact path='/createreview/:id' component={CreateReview} />
              <Route exact path='/bootcamps/:id/reviews' component={Reviews} />
              <Route exact path='/bootcamps/:id' component={BootcampPage} />

              <Route>
                <NotFound />
              </Route>
              {/* 
            <Route path='/bootcamps/:id'>
              <BootcampPage />
            </Route>
            <Route exact path='/about'>
              <About />
            </Route>
            <Route exact path='/cart'>
              <Cart />
            </Route>
            <Route exact path='/products'>
              <Products />
            </Route>
            <Route exact path='/products/:id' children={<SingleProduct />} />
            <PrivateRoute exact path='/checkout'>
              <Checkout />
            </PrivateRoute>
            <Route path='*'>
              <Error />
            </Route> */}
            </Switch>
            {/*<Footer /> */}
          </Router>
        </AlertState>
      </BootcampsProvider>
    </AuthProvider>
  );
}

export default App;
