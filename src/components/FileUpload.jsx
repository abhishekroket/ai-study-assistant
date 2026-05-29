import { useDropzone } from "react-dropzone";

import { FiPlus } from "react-icons/fi";

function FileUpload({
  setUploadedFile,
}) {

  const onDrop = (
    acceptedFiles
  ) => {

    const file =
      acceptedFiles[0];

    if (!file) return;

    // ONLY ONE PDF
    if (
      file.type !==
      "application/pdf"
    ) {

      alert(
        "Only PDF file allowed"
      );

      return;
    }

    // SAVE PDF
    setUploadedFile(file);

    alert(
      `${file.name} uploaded`
    );
  };

  const {
    getRootProps,
    getInputProps,
  } = useDropzone({

    onDrop,

    multiple: false,

    accept: {
      "application/pdf": [
        ".pdf",
      ],
    },

  });

  return (

    <div
      {...getRootProps()}
      className="text-xl text-gray-400 hover:text-white cursor-pointer"
    >

      <input
        {...getInputProps()}
      />

      <FiPlus />

    </div>
  );
}

export default FileUpload;