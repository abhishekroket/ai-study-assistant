import { useDropzone } from "react-dropzone";

import mammoth from "mammoth";

function FileUpload({
  setUploadedText,
}) {

  const onDrop = async (
    acceptedFiles
  ) => {

    const file =
      acceptedFiles[0];

    if (!file) return;

    // TXT
    if (
      file.type ===
      "text/plain"
    ) {

      const text =
        await file.text();

      setUploadedText(text);
    }

    // DOCX
    else if (
      file.name.endsWith(
        ".docx"
      )
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
        "Only TXT and DOCX supported"
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
      className="cursor-pointer text-gray-400 hover:text-white transition text-2xl"
    >

      <input
        {...getInputProps()}
      />

      +

    </div>
  );
}

export default FileUpload;