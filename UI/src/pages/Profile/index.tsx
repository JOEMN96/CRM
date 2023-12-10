import { type ReactElement, useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { api, setContext } from "@/utils/axios.instance";
import { GetServerSidePropsContext } from "next";
import { PlusOutlined, InboxOutlined } from "@ant-design/icons";
import styles from "./profile.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Modal, Upload, message } from "antd";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import { updateProfilePicPath } from "@/store/slices/profileSlice";
import Link from "next/link";
import { useRouter } from "next/router";

interface IProfileProps {
  data: IDocs[];
}

interface IDocs {
  documentName: string;
  id: number;
  path: string;
  type: string;
  userId: number;
}

const { Dragger } = Upload;

const Profile = ({ data }: IProfileProps) => {
  const uploadedDocs = data.map((doc) => {
    return { name: doc.documentName, uid: doc.documentName, path: doc.path };
  });

  const router = useRouter();

  const profile = useSelector((state: RootState) => state.profile.profile);
  const baseURL = process.env.BASEURL as string;

  const dispatch = useDispatch();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1));
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => setFileList(newFileList);

  useEffect(() => {
    if (profile.profilePicFilePath) {
      setFileList([
        {
          uid: "-1",
          name: "Profile",
          status: "done",
          url: (baseURL + profile.profilePicFilePath) as string,
        },
      ]);
    }
  }, [profile.profilePicFilePath]);

  const profilePicCustomUpload = (options: any) => {
    const data = new FormData();
    data.append("profilePic", options.file);
    const config = {
      headers: {
        "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryqTqJIxvkWFYqvP5s",
      },
    };

    api
      .post(options.action, data, config)
      .then((res: any) => {
        dispatch(updateProfilePicPath(res.data.profilePicFilePath));
        options.onSuccess(res.data, options.file);
        message.success(`Profile picture updated successfully.`);
      })
      .catch((err: Error) => {
        message.success(`Error ! Unable to upload profile picture`);
      });
  };

  const DraggerProps: UploadProps = {
    name: "documents",
    multiple: true,
    action: process.env.BASEURL + "profile/upload/documents",
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    customRequest(options: any) {
      const data = new FormData();
      data.append("documents", options.file);
      const config = {
        headers: {
          "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryqTqJIxvkWFYqvP5s",
        },
      };

      api
        .post(options.action, data, config)
        .then((res: any) => {
          options.onSuccess(res.data, options.file);
          router.replace(router.asPath);
          message.success(`${options.file.name} file uploaded successfully.`);
        })
        .catch((err: Error) => {
          message.error(`${options.file.name} file upload failed.`);
        });
    },
    showUploadList: { showRemoveIcon: false },
    fileList: uploadedDocs,
    itemRender: (nodex: any, file: any) => {
      return (
        <div className={`${nodex.props.className} customlist`}>
          <Link target="_blank" href={baseURL + "profile/file?filePath=" + file.path}>
            {file.name}
          </Link>
        </div>
      );
    },
  };

  return (
    <div className={styles.profileWrapper}>
      <h2>Profile</h2>
      <Upload
        action={baseURL + "profile/upload/profilePic"}
        listType="picture-circle"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        customRequest={profilePicCustomUpload}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: "100%", height: "400px", objectFit: "contain" }} src={previewImage} />
      </Modal>

      <div className={styles.docs}>
        <h2>Documents</h2>
        <div className={styles.upload}>
          <Dragger {...DraggerProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">Supported file types - pdf | doc |docx</p>
          </Dragger>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  setContext(context);
  let res = await api.get("profile/documents");
  return {
    props: {
      data: res.data,
    },
  };
}

Profile.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
);

export default Profile;
