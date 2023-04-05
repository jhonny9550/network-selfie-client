import { useCallback, useEffect, useRef, useState } from "react";
import Button from "./components/Button";

// Set your host
const API_URL = "http://127.0.0.1:3000/photo"; // Works in the same computer
// const API_URL = "http://192.168.86.27:3000/photo"; // Put your server host IP and it works in the local network

function App() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleOnInputChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      const files = e.target.files;
      if (files && files.length !== 0) {
        setFile(files[0]);
        setSuccess(false);
        setError("");
      }
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

  const handleOnCapture = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const context = canvas.getContext("2d");
    context?.scale(-1, 1);
    context?.drawImage(video, 0, 0, canvas.width * -1, canvas.height);
    canvas.toBlob(setFile);
  }, [canvasRef.current, videoRef.current]);

  const startVideo = useCallback(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });
  }, [videoRef.current]);

  const handleReset = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      context?.clearRect(0, 0, canvas.width * -1, canvas.height);
      context?.scale(-1, 1);
    }
    setFile(null);
    setSuccess(false);
    setError("");
    startVideo();
  }, [canvasRef.current, startVideo]);

  useEffect(() => {
    startVideo();
  }, [startVideo]);

  const renderUploadButton = !success && !error && !!file;

  return (
    <main className="app">
      <div className="container flex flex-col gap-6 items-center justify-center h-full py-10 px-8">
        <div className="text-center">
          <h1 className="text-3xl text-indigo-500 font-semibold">
            Network Selfie
          </h1>
          <p>Take a selfie and upload it</p>
        </div>

        <div className="flex flex-col items-center gap-10">
          <form className="text-center" onSubmit={handleSubmit}>
            <input
              accept="image/*"
              hidden
              type="file"
              ref={fileInputRef}
              onChange={handleOnInputChange}
              capture
            />
            <video
              className="rounded-lg border-4 border-solid border-gray-700 -scale-x-100"
              ref={videoRef}
              autoPlay
              hidden={!!file}
            ></video>
            <canvas ref={canvasRef} width={648} height={488} hidden></canvas>
            {file && (
              <img
                src={URL.createObjectURL(file)}
                alt="a preview of your selfie"
                className="mt-4 border-4 border-solid border-gray-700 sm:max-w-[648px]"
              />
            )}
            {error && (
              <p className="bg-red-400 text-white py-2 px-6 rounded-md mt-4">
                {error}
              </p>
            )}
            {success && (
              <p className="bg-green-400 text-white py-2 px-6 rounded-md mt-4">
                Your image was uploaded and stored correctly!
              </p>
            )}
            <div className="flex items-center justify-center mt-4 gap-4">
              {file ? (
                <Button type="button" onClick={handleReset}>
                  Take another
                </Button>
              ) : (
                <Button type="button" onClick={handleOnCapture}>
                  Capture
                </Button>
              )}
              {renderUploadButton && (
                <Button type="submit" loading={loading} disabled={!file}>
                  Upload
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default App;
