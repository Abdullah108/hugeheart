import React, { Component, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Container } from "reactstrap";

// sidebar nav config
import navigation from "../../_nav";
import { AppRoutes, TokenKey } from "../../config";
import { ApiHelper } from "../../helpers/ApiHelper";
// routes config
import routes from "../../routes";

import {
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav
} from "@coreui/react";
import ApiRoutes from "../../config/ApiRoutes";
import FullPageLoader from "../Loader/FullPageLoader";

const DefaultFooter = React.lazy(() => import("./DefaultFooter"));
const DefaultHeader = React.lazy(() => import("./DefaultHeader"));

class DefaultLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isAuthenticated: true,
      userDetails: {},
      priceData: {}
    };
  }

  componentDidMount() {
    this.checkAuthentication();
  }

  componentDidUpdate({ location }) {
    const { pathname } = location;
    if (pathname !== this.props.location.pathname) {
      this.setState({
        isAuthenticated: true
      });
      this.checkAuthentication();
    }
  }

  signOut(e) {
    e.preventDefault();
    localStorage.removeItem(TokenKey);
    this.props.history.push(AppRoutes.LOGIN);
  }

  checkAuthentication = async () => {
    try {
      const res = await new ApiHelper().FetchFromServer(
        ApiRoutes.GET_USER_DETAILS.service,
        ApiRoutes.GET_USER_DETAILS.url,
        ApiRoutes.GET_USER_DETAILS.method,
        ApiRoutes.GET_USER_DETAILS.authenticate
      );
      if (!res.isError && res.data && res.data.data) {
        this.setState({
          isAuthenticated: true,
          isLoading: false,
          userDetails: res.data.data
        });
      } else {
        localStorage.removeItem(TokenKey);
        this.props.history.push(AppRoutes.LOGIN);
      }
    } catch (error) {
      localStorage.removeItem(TokenKey);
      this.props.history.push(AppRoutes.LOGIN);
    }
  };
  /**
   *
   */
  onPriceData = data => {
    this.setState({
      priceData: data
    });
  };
  render() {
    const { userDetails, priceData } = this.state;
    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense fallback={""}>
            <DefaultHeader
              history={this.props.history}
              onLogout={e => this.signOut(e)}
              userDetails={this.state.userDetails}
              priceData={this.onPriceData}
            />
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
              <AppSidebarNav navConfig={navigation} {...this.props} isOpen />
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes} />
            <Container fluid>
              <Suspense fallback={<FullPageLoader />}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (
                          <route.component
                            {...props}
                            userDetails={userDetails}
                            priceData={priceData}
                          />
                        )}
                      />
                    ) : null;
                  })}
                  <Redirect from={AppRoutes.MAIN} to={AppRoutes.HOME} />
                </Switch>
              </Suspense>
            </Container>
          </main>
        </div>
        <AppFooter>
          <Suspense fallback={""}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

export default DefaultLayout;
