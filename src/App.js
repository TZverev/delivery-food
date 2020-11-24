import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Header from './layout/header.js';
import Footer from './layout/footer.js';
import Promo from './pages/main-page/promo.js';
import Restorants from './pages/main-page/restorants.js';
import RestorantPage from './pages/restorant-page/restorant-page.js';
import Account from './pages/account/account-page'

const routes = [
    {
        path: '/restorant/:id',
        component: RestorantPage
    },
    {
        path: '/account',
        component: Account
    },
]

function RouteWithSubRoutes(route) {
    return (
        <Route
            path={route.path}
            render={props => (
                <route.component {...props} routes={route.routes} />
            )}
        />
    );
}
export default function App() {
    return (
        <Router>
            <Header />
            <Switch>
                <Route exact path='/'>
                    <main>
                        <Promo />
                        <Restorants />
                    </main>
                </Route>
                {routes.map((route, i) => (
                    <RouteWithSubRoutes key={i} {...route} />
                ))}
            </Switch>
            <Footer />
        </Router>
    )
}