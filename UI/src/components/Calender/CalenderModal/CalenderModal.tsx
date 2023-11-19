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

  const projectId = Number(router.asPath.split("project/")[1]);

  const handleOk = async (formData: IAddTime) => {
    setConfirmLoading(true);
    try {
      const res = await api.post("calender/add", { project: projectId, ...formData, date });
      if (!res) {
        notification.open({ message: "Server error", type: "error" });
      } else if (res.status === 201) {
        notification.open({ message: "Entry created", type: "success" });
        router.replace(router.asPath);
      } else if (res.status === 206) {
        router.replace(router.asPath);
        notification.open({ message: "Entry updated", type: "info" });
      }
    } catch (error) {
      notification.open({ message: "Something went wrong", type: "error" });
    }

    setConfirmLoading(false);
    setopenModal(false);
  };

  const handleCancel = () => {
    setopenModal(false);
  };

  return (
    <>
      {openModal && (
        <Modal className={styles.addProjectModal} title="Add Time" open={openModal} onCancel={handleCancel} footer={[]}>
          <div className="add-time">
            <Formik
              initialValues={{
                workDescription: selectedEvent,
              }}
              onSubmit={async (values: IAddTime, { setSubmitting }: FormikHelpers<IAddTime>) => {
                setTimeout(() => {
                  handleOk(values);
                }, 500);
              }}
              enableReinitialize={true}
            >
              {({ handleChange, handleBlur, initialValues, setValues, setFieldValue, setFieldTouched, values }) => (
                <Form className={styles.projectForm}>
                  <TextArea
                    rows={4}
                    name="workDescription"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    defaultValue={initialValues.workDescription}
                    id="workDescription"
                    required
                  />

                  <div className={styles.btnRight}>
                    <Button htmlType="submit" type="primary" loading={confirmLoading}>
                      {selectedEvent.length ? "Update" : "Create"}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Modal>
      )}
    </>
  );
}
