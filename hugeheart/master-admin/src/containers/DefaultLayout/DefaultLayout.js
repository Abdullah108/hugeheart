import React, { Component, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Container } from "reactstrap";

// sidebar nav config
import navigation from "../../_nav";
import { AppRoutes } from "../../config";
import { ApiHelper } from "../../helpers/ApiHelper";
import FullPageLoader from "./../Loader/FullPageLoader";
// routes config
import routes from "../../routes";
import Loader from "../Loader/Loader";
import {
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from "@coreui/react";
import ApiRoutes from "../../config/ApiRoutes";
import { logger } from "../../helpers";

const DefaultFooter = React.lazy(() => import("./DefaultFooter"));
const DefaultHeader = React.lazy(() => import("./DefaultHeader"));

class DefaultLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isAuthenticated: true,
      userDetails: {},
      priceData: {},
    };
  }

  componentDidMount() {
    this.checkAuthentication();
  }

  componentDidUpdate({ location }) {
    const { pathname } = location;
    if (pathname !== this.props.location.pathname) {
      this.setState({
        isAuthenticated: true,
      });
      this.checkAuthentication();
    }
  }

  signOut(e) {
    e.preventDefault();
    localStorage.removeItem("token");
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
          userDetails: res.data.data,
        });
      } else {
        localStorage.removeItem("token");
        this.props.history.push(AppRoutes.LOGIN);
      }
    } catch (error) {
      localStorage.removeItem("token");
      this.props.history.push(AppRoutes.LOGIN);
    }
  };
  /**
   *
   */
  sidebarOptions = () => {
    const { userDetails } = this.state;
    const { userRole } = userDetails;
    logger(userRole);
    const navItems = [];
    navigation.items.forEach((nav) => {
      logger(nav.role);
      if (nav.role.indexOf(userRole) > -1) {
        navItems.push(nav);
      }
    });

    return {
      items: navItems,
    };
  };
  /**
   *
   */
  onPriceData = (data) => {
    this.setState({
      priceData: data,
    });
  };
  /**
   *
   */
  render() {
    const { isLoading, userDetails, priceData } = this.state;
    return (
      <div className="app">
        {isLoading ? <FullPageLoader /> : null}
        <AppHeader fixed>
          <Suspense fallback={""}>
            <DefaultHeader
              history={this.props.history}
              onLogout={(e) => this.signOut(e)}
              userDetails={userDetails}
              priceData={this.onPriceData}
            />
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
              <AppSidebarNav
                navConfig={this.sidebarOptions()}
                {...this.props}
                isOpen
              />
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes} />
            <Container fluid>
              <Suspense fallback={<Loader />}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={(props) => (
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
