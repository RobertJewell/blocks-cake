import { useUploadFiles } from "@better-upload/client";
import { UploadDropzone } from "./upload-dropzone";

// 1. Define the props expected by a form field
interface ImageDropzoneProps {
  value?: string[]; // The current images (URLs)
  onChange?: (urls: string[]) => void; // How we tell the form about updates
  onBlur?: () => void;
  name?: string;
}

export function ImageDropzone({
  value = [],
  onChange,
  ...props
}: ImageDropzoneProps) {
  // 2. Configure the upload hook
  const { control } = useUploadFiles({
    route: "images",

    // 3. This is the glue: When upload finishes, update the form
    onUploadComplete: (res) => {
      // 'res' is an array of uploaded file objects.
      // We map them to get just the URLs (or keys) your DB needs.
      const newUrls = res.files.map(
        (file) =>
          `https://pub-39814712f705425ebdcd406e6d0a9361.r2.dev/${file.objectInfo.key}`,
      );

      // Update form state (appending to existing or replacing, depending on your needs)
      // Here we assume we are appending newly uploaded files to existing ones:
      onChange?.([...value, ...newUrls]);
    },
    onUploadFail: (err) => {
      console.error("Upload failed", err);
    },
  });

  // 4. (Optional) Render Preview if images exist
  // If you want to show the uploaded images and allow removal:
  if (value && value.length > 0) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {value.map((url, index) => (
          <div
            key={url}
            className="relative group aspect-square bg-gray-100 rounded-md overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />

            <button
              type="button"
              onClick={() => {
                // Logic to remove single image from array
                const newValue = value.filter((_, i) => i !== index);
                onChange?.(newValue);
              }}
              className="absolute top-1 right-1 bg-red-500 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Remove
            </button>
          </div>
        ))}
        {/* Allow adding more if under limit? */}
        {value.length < 4 && (
          <div className="aspect-square flex items-center justify-center border-2 border-dashed rounded-md">
            {/* You might need a smaller dropzone or button here to append */}
            <span className="text-xs text-gray-500">Upload Limit Reached</span>
          </div>
        )}
      </div>
    );
  }

  // 5. Render Dropzone (Empty State)
  return (
    <UploadDropzone
      control={control}
      accept="image/*"
      description={{
        maxFiles: 4,
        maxFileSize: "5MB",
        fileTypes: "JPEG, PNG, GIF",
      }}
    />
  );
}
