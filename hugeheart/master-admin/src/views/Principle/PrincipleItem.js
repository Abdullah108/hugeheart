import React from "react";
import { Card } from "react-bootstrap";
import { AppConfig } from "../../config";
const PrincipleItem = ({ faq: f }) => (
  <Card className="faq-card">
    <Card.Body
      style={{
        marginTop: 0
      }}
    >
      {f.type || "N/A"}
      {f.answer || "N/A"}
      <a
        className={"float-right"}
        href={`${AppConfig.SERVER_FILES_ENDPOINT}/uploads/principle/${f.documents}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className={"fa fa-file-text-o"}></i>&nbsp; View Attachment
      </a>
    </Card.Body>
  </Card>
);

export default PrincipleItem;
