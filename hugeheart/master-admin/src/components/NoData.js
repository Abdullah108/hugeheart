import React from "react";
import { Card } from "react-bootstrap";
const NoData = ({ message }) => (
  <Card className="faq-card">
    <Card.Body
      style={{
        marginTop: 0
      }}
      className={"text-center"}
    >
      {message || "No data found."}
    </Card.Body>
  </Card>
);

export default NoData;
