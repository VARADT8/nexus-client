"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";
import { useAnimate } from "framer-motion";
import {
  useRecoilState,
} from 'recoil';
import { predictedState } from "@/lib/utils";
import { getFile } from "@/lib/utils";


const UploadImagePage = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<any>(null);
  const [file, setFile] = useRecoilState(getFile);
  const [predictedClass, setPredictedClass] = useRecoilState(predictedState);

  function handleDragEnter(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function handleDrop(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }

  function handleDragLeave(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function handleDragOver(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function handleChange(e: any) {
    e.preventDefault();
    console.log("File has been added");
    if (e.target.files && e.target.files[0]) {
      console.log(e.target.files[0]);
      setFile(e.target.files[0]);
    }
    // console.log(file.name);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    console.log(formData.get("file"));
  }

  function openFileExplorer() {
    inputRef.current.value = "";
    inputRef.current.click();
  }

  const [scope, animate] = useAnimate();
  const [isPredict, setIsPredict] = useState(false)
  const router = useRouter();

  const handlePredict = async () => {
    if (!file) return;
    setIsPredict(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const endpoint = name === "scoliosis" ? "/predict2" : "/predict";
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const predictedClassId = data.class_id;
      if (predictedClassId === undefined) {
        throw new Error("Prediction failed: Missing class_id from server.");
      }

      console.log("Predicted class ID:", predictedClassId);
      setPredictedClass(predictedClassId);

      // Navigate with predictedClass in URL as fallback
      router.push(`/pages/final/result?predictedClass=${encodeURIComponent(predictedClassId)}`);
    } catch (error: any) {
      console.error("Error making prediction request: ", error);
      setIsPredict(false);
      alert(`Error: ${error.message || "Could not connect to prediction server."}`);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-sky-50 via-white to-sky-100 flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 md:p-16 w-full max-w-3xl border border-white flex flex-col items-center transition-all duration-500">

        {!file ? (
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-3">
              Upload X-Ray Image
            </h1>
            <p className="text-slate-500 font-medium">Drag and drop your file here, or click to browse</p>
          </div>
        ) : (
          <div className="mb-10 text-center">
            <h1 className={`text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-3`}>
              {isPredict ? "Predict Result" : "Analyzing Result..."}
            </h1>
            <p className="text-slate-500 font-medium">Please wait while the AI processes your image</p>
          </div>
        )}
        <div
          ref={scope}
          className="grid grid-cols-1 grid-rows-1 place-items-center justify-center"
        >
          {/* First Div */}
          <div
            id="target_1"
            onDragEnter={handleDragEnter}
            onSubmit={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            className="relative grid grid-flow-row row-start-1 col-start-1 w-[350px] h-[323px] border-dashed border-sky-300 bg-sky-50/30 border-2 shadow-sm rounded-xl mb-8 overflow-hidden hover:bg-sky-50 transition-colors duration-300"
          >
            <input
              placeholder="fileInput"
              className="hidden"
              ref={inputRef}
              type="file"
              // multiple={true}
              onChange={handleChange}
              accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf"
            />
            <div className="absolute inset-0">
              {file ? (
                <Image
                  src={URL.createObjectURL(file)}
                  fill
                  objectFit="cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  alt="Drop Image here"
                  className="absolute w-full h-full z-10 object-cover"
                />
              ) : (
                <Image
                  src="/images/picture_7.png"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  alt="Drop Image here"
                  className="absolute w-full h-full z-10 object-cover opacity-30"
                />
              )}
            </div>
            <div className="z-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {file ? (
                ""
              ) : (
                <button
                  className={`bg-sky-600 text-white px-8 py-2 rounded-md hover:bg-sky-700 transform duration-300 ${dragActive ? "opacity-100" : "opacity-80"
                    }`}
                  onClick={openFileExplorer}
                  type="button"
                >
                  Upload X-Ray
                </button>
              )}
            </div>
          </div>
          {/* Second Div */}
          <div
            id="target_2"
            className="grid grid-flow-row border  w-[350px] h-[323px] z-0 mb-8 row-start-1 col-start-1"
          >
            <div id="tg_1" className="border-2 opacity-0 p-8 w-full h-40">
              <h1 className="mt-6 ml-14 ">Predicted class: {predictedClass}</h1>
              <h1 className="ml-16 ">Get well soon !!!</h1>
            </div>
            <div id="tg_2" className="opacity-0 border-2 p-10  h-40">
              <input
                placeholder="fileInput"
                className="hidden"
                ref={inputRef}
                type="file"
                // multiple={true}
                onChange={handleChange}
                accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf"
              />
              <h1 className="mb-3 ml-14 ">Upload Next X-ray</h1>
              <button
                className={`ml-12 bg-sky-600 text-white px-8 py-2 rounded-md hover:bg-sky-700 transform duration-300 ${dragActive ? "opacity-100" : "opacity-80"
                  }`}
                onClick={openFileExplorer}
                type="button"
              >
                Upload X-Ray
              </button>
            </div>
          </div>
          <div className="flex justify-center gap-8">
            <div>
              {!file ? (
                <button
                  // onClick={handleReport}
                  className={`rounded-full px-6 py-2 font-medium transition-all duration-300 ${name === "scoliosis"
                    ? "bg-sky-600 text-white shadow-md hover:bg-sky-700"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-sky-300 hover:text-sky-600 shadow-sm"
                    }`}
                  type="button"
                >
                  Scoliosis
                </button>
              ) : (
                <button
                  onClick={handlePredict}
                  className="bg-sky-600 rounded-full text-white font-medium px-8 py-2 hover:bg-sky-700 hover:shadow-md transition-all duration-300"
                  type="button"
                >
                  Predict
                </button>
              )}
            </div>
            <div>
              {!file ? (
                <button
                  className={`rounded-full px-6 py-2 font-medium transition-all duration-300 ${name === "osteoarthritis"
                    ? "bg-sky-600 text-white shadow-md hover:bg-sky-700"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-sky-300 hover:text-sky-600 shadow-sm"
                    }`}
                  type="button"
                >
                  Osteoarthritis
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SuspendedUploadImagePage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <UploadImagePage />
  </Suspense>
);
export default SuspendedUploadImagePage;