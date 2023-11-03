import Nav from "@/components/nav/nav";
import Projects from "@/components/projects/project";
import { api, setContext } from "@/utils/axios.instance";
import token from "@/utils/token";
import { GetServerSidePropsContext } from "next";
import { parseCookies } from "nookies";

const getProjects = async () => {
  try {
    const { data } = await api.get<Projects[]>("/projects/projectsByUser", {});
    console.log(data);

    return data;
  } catch (error) {
    // console.log(error);
  }
};

export default function Dashboard() {
  return (
    <main>
      <Nav />
      <Projects />
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Fetch data from external API
  setContext(context);
  const data = await api.get("projects/projectsByUser");

  // console.log(context.req?.cookies);
  return { props: {} };
}
