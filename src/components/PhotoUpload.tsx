import { useCallback, useRef, useState } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const BUCKET = "photos";

interface PhotoUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

export default function PhotoUpload({
  label,
  value,
  onChange,
}: PhotoUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Please choose an image file.");
        return;
      }
      setError("");
      setUploading(true);

      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        setError(uploadError.message);
        setUploading(false);
        return;
      }

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
      onChange(data.publicUrl);
      setUploading(false);
    },
    [onChange],
  );

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 min-h-30 cursor-pointer transition-colors ${
          dragging
            ? "border-teal-500 bg-teal-50"
            : "border-gray-200 hover:border-teal-300 bg-gray-50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleSelect}
        />

        {value ? (
          <div className="relative">
            <img
              src={value}
              alt={label}
              className="w-24 h-24 rounded-xl object-cover border border-gray-200"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : uploading ? (
          <>
            <Loader2 className="w-6 h-6 text-teal-500 animate-spin" />
            <p className="text-xs text-gray-500">Uploading...</p>
          </>
        ) : (
          <>
            <UploadCloud className="w-6 h-6 text-gray-400" />
            <p className="text-xs text-gray-500 text-center">
              Drag & drop an image, or{" "}
              <span className="text-teal-600 font-medium">browse</span>
            </p>
          </>
        )}
      </div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
