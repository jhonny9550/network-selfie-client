import { useCallback, useRef, useState } from "react";
import Button from "./components/Button";
import DragAndDrop from "./components/DragAndDrop";

// Set your host
const API_URL = "http://192.168.86.27:3000/photo";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((file: File) => {
    setFile(file);
  }, []);

  const handleInputClick = useCallback(() => {
    fileInputRef.current?.click();
  }, [fileInputRef]);

  const handleOnInputChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      const files = e.target.files;
      if (files && files.length !== 0) {
        setFile(files[0]);
        setSuccess(false);
        setError("");
      }
    }, []);

  const handleReset = useCallback(() => {
    setFile(null);
    setSuccess(false);
    setError("");
  }, []);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();
      if (!file) return;
      setLoading(true);
      let formData = new FormData();
      formData.append("selfie", file);
      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setError("");
        setSuccess(true);
      } else {
        console.log(res);
        setError("There was an error uploading your selfie.");
        setSuccess(false);
      }
      setLoading(false);
    },
    [file]
  );

  return (
    <main className="app">
      <div className="container flex flex-col gap-6 items-center justify-center h-full py-10 px-8">
        <div className="text-center">
          <h1 className="text-3xl text-indigo-500 font-semibold">
            Network Selfie
          </h1>
          <p>Take a selfie and upload it</p>
        </div>

        <div className="flex flex-col items-center gap-10 sm:flex-row">
          <form className="text-center" onSubmit={handleSubmit}>
            <input
              accept="image/*"
              hidden
              type="file"
              ref={fileInputRef}
              onChange={handleOnInputChange}
            />
            <DragAndDrop
              handleDrop={handleDrop}
              handleClick={handleInputClick}
            />
            {error && <p className="text-red-400 mt-4">{error}</p>}
            {success && (
              <p className="bg-green-400 mt-4 text-white py-2 px-6 rounded-md">
                Your image was uploaded and stored correctly!
              </p>
            )}
            {success ? (
              <Button className="mt-4" type="button" onClick={handleReset}>
                Upload another image
              </Button>
            ) : (
              <Button
                className="mt-4"
                type="submit"
                loading={loading}
                disabled={!file}
              >
                Upload
              </Button>
            )}
          </form>
          {file && (
            <img
              src={URL.createObjectURL(file)}
              alt="a preview of your selfie"
              className="mt-4"
            />
          )}
        </div>
      </div>
    </main>
  );
}

export default App;
