import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import classnames from "classnames";
import LoadingButton from "../../components/LoadingButton";
const ModalContainer = ({
  isOpen,
  hideModal,
  size,
  children,
  headerText,
  footerButtons,
  ...props
}) => (
  <Modal
    centered
    size={size || "lg"}
    isOpen={isOpen}
    toggle={hideModal}
    {...props}
  >
    {headerText ? (
      <ModalHeader toggle={hideModal}>{headerText}</ModalHeader>
    ) : null}
    <ModalBody>{children}</ModalBody>
    {footerButtons && footerButtons.map ? (
      <ModalFooter>
        {footerButtons.map((button, index) => (
          <React.Fragment key={index}>
            {button.isLoading ? (
              <LoadingButton />
            ) : (
              <Button
                type={button.type || "button"}
                onClick={button.onClick}
                color={button.color || "primary"}
                className={classnames(
                  "btn-submit",
                  "btn-link",
                  button.className
                )}
              >
                {button.text}
              </Button>
            )}
          </React.Fragment>
        ))}
      </ModalFooter>
    ) : null}
  </Modal>
);

export default ModalContainer;
