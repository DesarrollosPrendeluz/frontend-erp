"use client"
import FileUploadModel from "@/components/modals/file_upload_modal/file_upload_modal";
import FileUpload from "@/components/UploadExcel";
import axios from "axios";
import { headers } from "next/headers";

export default function Page() {
  return (<FileUpload />)
}
