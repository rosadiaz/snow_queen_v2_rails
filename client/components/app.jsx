import Alert from "react-bootstrap/Alert"
import Form from "react-bootstrap/Form"
import DrawingMap from "./map";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import PropTypes from "prop-types";
import React from "react";
import Row from "react-bootstrap/Row";

export default class App extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired, // this is passed from the Rails view
  };

  constructor(props) {
    super(props);
    this.state = { name: this.props.name };
  }

  updateName = (name) => {
    this.setState({ name });
  };

  render() {
    return (
      <Container>
        <Row>
          <Col sm="12">
            <Alert variant='primary'>Hello, {this.state.name}!</Alert>
          </Col>
          <Col sm="6">
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Say hello</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter name"
                  value={this.state.name}
                  onChange={(e) => this.updateName(e.target.value)}
                />
                <Form.Text className="text-muted">
                  Pretty cool right?!
                </Form.Text>
              </Form.Group>
            </Form>
          </Col>
          <Col sm="12">
            <DrawingMap isMarkerShown={true}/>
          </Col>
        </Row>
      </Container>
    );
  }
}
