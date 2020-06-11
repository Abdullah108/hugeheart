import React, { Component } from "react";
import { Card, CardBody, Col, Row, CardHeader } from "reactstrap";
import { logger, ApiHelper } from "../../helpers";
import TasksList from "./TasksList";
class Tasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: []
    };
  }

  /**
   *
   */
  componentDidMount() {
    this.getTasks();
  }
  /**
   *
   */
  getTasks = async () => {
    let data = [];
    this.setState({
      isLoading: true
    });
    try {
      const { isError, data: response } = await new ApiHelper().FetchFromServer(
        "brand",
        "get-task",
        "GET",
        true
      );
      data = isError ? [] : response.data;
    } catch (error) {
      logger(error);
    }
    this.setState({
      isLoading: false,
      data
    });
  };
  /**
   *
   */
  render() {
    const { isLoading, data } = this.state;
    logger(isLoading, data);
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card>
              <CardHeader>
                <h4>
                  <i className="fa fa-tasks" /> Assigned tasks
                </h4>
              </CardHeader>
              <CardBody>
                <TasksList
                  isLoading={isLoading}
                  data={data}
                  refreshList={this.getTasks}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Tasks;
