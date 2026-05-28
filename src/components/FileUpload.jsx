import { useDropzone } from "react-dropzone";
import { useState } from "react";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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

    // PDF FILE
    else if (
      file.type ===
      "application/pdf"
    ) {

      const arrayBuffer =
        await file.arrayBuffer();

      const pdf =
        await pdfjsLib.getDocument({
          data: arrayBuffer,
        }).promise;

      let text = "";

      for (
        let i = 1;
        i <= pdf.numPages;
        i++
      ) {

        const page =
          await pdf.getPage(i);

        const content =
          await page.getTextContent();

        const strings =
          content.items.map(
            (item) => item.str
          );

        text +=
          strings.join(" ") + "\n";
      }

      setUploadedText(text);
    }

    else {

      alert(
        "Only PDF, TXT and DOCX supported"
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
      className="border-2 border-dashed p-6 rounded-2xl mt-4 cursor-pointer bg-slate-800 hover:border-blue-500 transition"
    >

      <input
        {...getInputProps()}
      />

      <p className="text-lg text-center">

        📄 Upload Notes
        (.txt / .docx / .pdf)

      </p>

      {fileName && (

        <p className="mt-3 text-green-400 text-center">

          Uploaded: {fileName}

        </p>

      )}

    </div>
  );
}

export default FileUpload;