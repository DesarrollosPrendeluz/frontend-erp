"use client"
import DashboardItems from "@/components/navbar/dashboardItems/dashboardItems";
import Navbar from "@/components/navbar/navbar";
import useFetchData from "@/hooks/fetchData";
import { NextPage } from "next";

const Home: NextPage = () => {
  const { data, loading, error } = useFetchData('http://localhost:8080/store/default')
  console.log(error)
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <DashboardItems items={data} />
    </div>
  );
};

export default Home;
