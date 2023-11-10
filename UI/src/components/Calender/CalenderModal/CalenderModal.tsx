import React, { useState } from "react";
import { Button, Input, Modal, notification } from "antd";
import { IAddTime, ICalenderModal } from "../types";
import { Formik, Form, FormikHelpers } from "formik";
import styles from "./calenderModal.module.scss";

const { TextArea } = Input;

export default function ({ setopenModal, openModal }: ICalenderModal) {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setopenModal(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setopenModal(false);
  };

  return (
    <>
      <Modal className={styles.addProjectModal} title="Add Time" open={openModal} onCancel={handleCancel} footer={[]}>
        <div className="add-time">
          <Formik
            initialValues={{
              workDescription: "",
            }}
            onSubmit={async (values: IAddTime, { setSubmitting }: FormikHelpers<IAddTime>) => {
              setTimeout(() => {
                if (!values.workDescription) {
                  return notification.open({ message: "Owner field is required ", type: "error", duration: 3 });
                }

                handleOk();
                // addOwner(values);
              }, 500);
            }}
          >
            {({ values, errors, handleChange, handleBlur }) => (
              <Form className={styles.projectForm}>
                <TextArea
                  rows={4}
                  name="workDescription"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.workDescription}
                  id="workDescription"
                  required
                />

                <div className={styles.btnRight}>
                  <Button htmlType="submit" type="primary" loading={confirmLoading}>
                    Create
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
    </>
  );
}
