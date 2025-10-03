"use client";
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import Image from "next/image";

export default function FileUpload({
  onFiles,
}: {
  onFiles: (files: File[]) => void;
}) {
  const [previews, setPreviews] = useState<string[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    multiple: true,
    onDrop: (acceptedFiles) => {
      onFiles(acceptedFiles);

      const urls = acceptedFiles.map((file) => URL.createObjectURL(file));
      setPreviews(urls);
    },
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-bb-green p-4 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100"
    >
      <input {...getInputProps()} />
      <p className="text-gray-600 text-sm">
        Arraste ou clique para adicionar imagens
      </p>

      {previews.length > 0 && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {previews.map((src, i) => (
            <Image
              width={100}
              height={100}
              quality={70}
              key={i}
              src={src}
              alt={`preview-${i}`}
              className="w-16 h-16 rounded object-cover"
            />
          ))}
        </div>
      )}
    </div>
  );
}
