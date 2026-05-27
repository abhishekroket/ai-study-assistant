import { useDropzone } from "react-dropzone";
import { useState } from "react";
import mammoth from "mammoth";

function FileUpload({ setUploadedText }) {
  const [fileName, setFileName] =
    useState("");

  const onDrop = async (
    acceptedFiles
  ) => {
    const file = acceptedFiles[0];

    if (!file) return;

    setFileName(file.name);

    // TXT FILE
    if (
      file.type === "text/plain"
    ) {
      const text =
        await file.text();

      setUploadedText(text);
    }

    // DOCX FILE
    else if (
      file.name.endsWith(".docx")
    ) {
      const arrayBuffer =
        await file.arrayBuffer();

      const result =
        await mammoth.extractRawText({
          arrayBuffer,
        });

      setUploadedText(
        result.value
      );
    }

    else {
      alert(
        "Only .txt and .docx files supported"
      );
    }
  };

  const {
    getRootProps,
    getInputProps,
  } = useDropzone({
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed p-6 rounded-2xl mt-4 cursor-pointer bg-slate-800"
    >
      <input
        {...getInputProps()}
      />

      <p className="text-lg">
        Upload Notes (.txt/.docx)
      </p>

      {fileName && (
        <p className="mt-2 text-green-400">
          Uploaded: {fileName}
        </p>
      )}
    </div>
  );
}

export default FileUpload;