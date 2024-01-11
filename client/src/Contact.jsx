import React from "react";
import { Alert, Container } from "react-bootstrap";

export default function Contact(props) {
  return (
    <Container className="d-flex justify-content-center">
      <Alert variant="danger" className="text-center w-75">
        <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
        <p>Contact the administrator.</p>
      </Alert>
    </Container>
  );
}
