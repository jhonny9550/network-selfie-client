import React, { useCallback, useState } from "react";

export type DragAndDropProps = {
  handleDrop: (file: File) => void;
  handleClick: () => void;
};

const DragAndDrop: React.FC<DragAndDropProps> = (props) => {
  const [file, setFile] = useState<File | null>(null);

  const handleDrop: React.DragEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      setFile(file);
      props.handleDrop && props.handleDrop(file);
    },
    [props.handleDrop]
  );

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.preventDefault();
    },
    []
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="p-10 border border-dotted border-black rounded-lg"
      onClick={props.handleClick}
    >
      <p>Drag and drop a file here</p>
    </div>
  );
};

export default DragAndDrop;
