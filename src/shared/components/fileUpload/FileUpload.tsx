"use client";
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import Image from "next/image";

export default function FileUpload({
  onFilesBase64,
}: {
  onFilesBase64?: (base64: string[]) => void;
}) {
  const [previews, setPreviews] = useState<string[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: async (acceptedFiles) => {
      const urls = acceptedFiles.map((file) => URL.createObjectURL(file));
      setPreviews(urls);

      if (onFilesBase64) {
        const base64Files = await Promise.all(
          acceptedFiles.map(
            (file) =>
              new Promise<{ file: File; base64: string }>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () =>
                  resolve({ file, base64: reader.result as string });
                reader.onerror = (error) => reject(error);
              }),
          ),
        );
        const onlyBase64 = base64Files.map((file) => file.base64);

        onFilesBase64(onlyBase64);
      }
    },
  });

  const base64Loader = ({ src }: { src: string }) => {
    return src;
  };

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
              unoptimized
              width={100}
              height={100}
              quality={70}
              key={i}
              src={src}
              loader={base64Loader}
              alt={`preview-${i}`}
              className="w-16 h-16 rounded object-cover"
            />
          ))}
        </div>
      )}
    </div>
  );
}
