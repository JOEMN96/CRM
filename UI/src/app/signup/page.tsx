"use client";
import styles from "./signin.module.css";
import { Button, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { AiOutlineMail } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { Formik, Form } from "formik";
import axiosInstance from "../utils/axios.instance";
import { useState } from "react";
import { token } from "../utils/token";

export default function Test() {
  const [errors, seterrors] = useState<Ierrors>({});

  console.log(token);

  const signIn = async (postData: IValues) => {
    try {
      const { data, status } = await axiosInstance.post("auth/local/signup", postData);
      console.log(status, data);
    } catch (error: any) {
      console.log(error);

      if (error.response.data.statusCode && error.response.data.statusCode === 409) {
        seterrors({ ...errors, Taken: "Email already taken" });
      }

      if (error.response.data.statusCode && error.response.data.statusCode == 400) {
        seterrors({ ...errors, validationErrors: error.response.data.message });
      }

      // Clear server errors shown in DOM
      setTimeout(() => {
        seterrors({});
      }, 5000);
    }
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.logo}>
        <img src="/logo.svg" alt="" />
      </div>
      <Formik
        initialValues={{ email: "", password: "", name: "" }}
        validate={(values: IValues) => {
          const errors: any = {};
          if (!values.email) {
            errors.email = "Email is required";
          } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            errors.email = "Invalid email address";
          } else if (!values.name) {
            errors.name = "Name is required";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            setSubmitting(true);
            signIn(values);
            setSubmitting(false);
          }, 400);
        }}
      >
        {({ values, errors, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            <Input
              placeholder="Username"
              name="name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              prefix={<UserOutlined className="site-form-item-icon" />}
              status={errors.name && "error"}
            />
            {errors.name && <p className={styles.error}>{errors.name}</p>}

            <Input
              placeholder="Email"
              type="email"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              prefix={<AiOutlineMail className="site-form-item-icon" />}
              status={errors.email && "error"}
            />
            {errors.email && <p className={styles.error}>{errors.email}</p>}
            <Input
              placeholder="Password"
              type="password"
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              prefix={<RiLockPasswordLine className="site-form-item-icon" />}
              status={errors.password && "error"}
            />
            {errors.password && <p className={styles.error}>{errors.password}</p>}

            <div className={styles.submitWrapper}>
              <Button htmlType="submit" type="primary" loading={isSubmitting}>
                Sign Up
              </Button>
            </div>
          </Form>
        )}
      </Formik>
      <div className="serverErrors">
        {errors.validationErrors?.length ? errors.validationErrors.map((error: string) => <p key={error}> {error}</p>) : ""}
        {errors.Taken?.length ? <p> {errors.Taken} </p> : ""}
      </div>
    </section>
  );
}
