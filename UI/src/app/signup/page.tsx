"use client";
import styles from "./signin.module.css";
import { Button, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { AiOutlineMail } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { Formik, Form } from "formik";

export default function Test() {
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
            alert(JSON.stringify(values, null, 2));
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

            <Button htmlType="submit" type="primary" loading={isSubmitting}>
              Sign Up
            </Button>
          </Form>
        )}
      </Formik>
    </section>
  );
}
