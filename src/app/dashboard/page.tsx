"use client";
import FileUploadModel from '../../components/modals/file_upload_modal/file_upload_modal';
export default function Page() {
    let fun = () => {
        console.log('Se ha subido un archivo');
    }
    return <>
        <h1>Hello, Next.js!</h1>
        <FileUploadModel actionName={"Menu entrada de material"} buttonName={"Entrada de manterial"} onFileUpload={fun} ></FileUploadModel>
    </>
}
