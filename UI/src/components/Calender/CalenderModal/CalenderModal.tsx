import React, { useState } from "react";
import { Button, Input, Modal, notification } from "antd";
import { IAddTime, ICalenderModal } from "../types";
import { Formik, Form, FormikHelpers } from "formik";
import styles from "./calenderModal.module.scss";
import { api } from "@/utils/axios.instance";
import { useRouter } from "next/router";

const { TextArea } = Input;

export default function ({ setopenModal, openModal, date, selectedEvent }: ICalenderModal) {
  const router = useRouter();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOk = async (formData: IAddTime) => {
    setConfirmLoading(true);
    try {
      const res = await api.post("calender/add", { project: 1, ...formData, date });
      console.log(res);

      if (!res) {
        notification.open({ message: "Server error", type: "error" });
      } else if (res.status === 201) {
        notification.open({ message: "Entry created", type: "success" });
      } else if (res.status === 206) {
        router.replace(router.asPath);
        notification.open({ message: "Entry updated", type: "info" });
      }
    } catch (error) {
      console.log(error);
    }

    setConfirmLoading(false);
    setopenModal(false);
  };

  const handleCancel = () => {
    setopenModal(false);
  };

  return (
    <>
      <Modal className={styles.addProjectModal} title="Add Time" open={openModal} onCancel={handleCancel} footer={[]}>
        <div className="add-time">
          <Formik
            initialValues={{
              workDescription: selectedEvent,
            }}
            onSubmit={async (values: IAddTime, { setSubmitting }: FormikHelpers<IAddTime>) => {
              setTimeout(() => {
                handleOk(values);
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
                  value={selectedEvent}
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
