import styles from "./signin.module.scss";
import { Button, Input } from "antd";
import { AiOutlineMail } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { Formik, Form } from "formik";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/axios.instance";
import useUser from "@/utils/useUser";
import Link from "next/link";

export default function SignIn() {
  const [errors, seterrors] = useState<IServerErrors>({});
  const router = useRouter();

  if (useUser()) {
    router.push("/dashboard");
  }

  const signIn = async (postData: ISignUp) => {
    try {
      const { status } = await api.post("auth/local/signin", postData);

      if (status === 200) {
        router.push("/dashboard");
      }
    } catch (error: any) {
      if (error?.response?.data?.isArray) {
        seterrors({ ...errors, validationErrors: error.response.data });
      }

      if (error?.response?.data?.statusCode && error?.response?.data?.statusCode !== 200) {
        seterrors({ ...errors, message: error.response.data.message });
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
        initialValues={{ email: "", password: "" }}
        validate={(values: ISignUp) => {
          const errors: any = {};
          if (!values.email) {
            errors.email = "Email is required";
          } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            errors.email = "Invalid email address";
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
              placeholder="Email"
              type="email"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              prefix={<AiOutlineMail className="site-form-item-icon" />}
              status={errors.email && "error"}
              autoComplete="username"
            />
            {errors.email && <p className={styles.error}>{errors.email}</p>}
            <Input
              placeholder="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              prefix={<RiLockPasswordLine className="site-form-item-icon" />}
              status={errors.password && "error"}
            />
            {errors.password && <p className={styles.error}>{errors.password}</p>}

            <div className={styles.submitWrapper}>
              <Button htmlType="submit" type="primary" loading={isSubmitting}>
                Sign In
              </Button>
            </div>
            <Link href="/auth/signup">Don't have account ?</Link>
          </Form>
        )}
      </Formik>
      <div className="serverErrors">
        {errors.validationErrors?.length ? errors.validationErrors.map((error: string) => <p key={error}> {error}</p>) : ""}
        {errors.message?.length ? <p> {errors.message} </p> : ""}
      </div>
    </section>
  );
}
