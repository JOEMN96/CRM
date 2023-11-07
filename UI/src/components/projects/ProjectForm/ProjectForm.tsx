import { Button, Drawer, Select, notification } from "antd";
import { Formik, Form, FormikHelpers } from "formik";
import { Input } from "antd";
import styles from "./project.module.scss";
import { useEffect, useState } from "react";
import { api } from "@/utils/axios.instance";
import { useRouter } from "next/router";

export default function ProjectForm({ onClose, open }: ProjectForm) {
  let [projectOwners, setProjectOwners] = useState<IProjectOwners[]>([]);

  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };

  const onSearch = (value: string) => {
    console.log("search:", value);
  };

  const filterOption = (input: string, option?: { value: string }) => {
    return (option?.value ?? "").toLowerCase().includes(input.toLowerCase());
  };

  const getProjectOwners = async () => {
    let { data } = await api.get("/projects/getPossibleProjectOwners");
    setProjectOwners(data);
  };

  const addOwner = async (projectDetails: IProjectFormValues) => {
    try {
      await api.post("/projects/create", projectDetails);
      notification.open({ message: "Project added", type: "success" });
      refreshData();
    } catch {
      notification.open({ message: "Something went wrong unable to add project", type: "error" });
    }
    onClose();
  };

  useEffect(() => {
    getProjectOwners();
  }, []);

  return (
    <Drawer title="Create new project" placement="right" onClose={onClose} open={open}>
      <Formik
        initialValues={{
          name: "",
          description: "",
          owner: "",
        }}
        onSubmit={async (values: IProjectFormValues, { setSubmitting }: FormikHelpers<IProjectFormValues>) => {
          setTimeout(() => {
            if (!values.owner) {
              return notification.open({ message: "Owner field is required ", type: "error" });
            }
            addOwner(values);
            setSubmitting(false);
          }, 500);
        }}
      >
        {({ values, errors, handleChange, handleBlur, isSubmitting }) => (
          <Form className={styles.projectForm}>
            <Input
              placeholder="Project Name"
              name="name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              id="name"
              required
            />

            <Input
              placeholder="Description"
              name="description"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.description}
              id="description"
              required
            />

            <Select
              showSearch
              placeholder="Select a person"
              optionFilterProp="children"
              onChange={(value) => (values.owner = value)}
              onSearch={onSearch}
              filterOption={filterOption}
            >
              {projectOwners.map((projectOwner) => (
                <Select.Option value={projectOwner.name} key={projectOwner.name}>
                  {
                    <>
                      <span>{projectOwner.name}</span> - <b>{projectOwner.role}</b>
                    </>
                  }
                </Select.Option>
              ))}
            </Select>
            <div className="btn-right">
              <Button htmlType="submit" type="primary" loading={isSubmitting}>
                Create
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
}
