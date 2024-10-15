import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import { UploadedImage } from '../types';

interface ImageUploaderProps {
  onUpload: (images: UploadedImage[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedImage[]>([]);
  const [game, setGame] = useState('Magic: The Gathering');
  const [expansion, setExpansion] = useState('');
  const [condition, setCondition] = useState('NM');
  const [language, setLanguage] = useState('English');
  const [printingType, setPrintingType] = useState('Normal');
  const [languageDetection, setLanguageDetection] = useState(false);
  const [scanCardBacks, setScanCardBacks] = useState(false);
  const [enableKeybinds, setEnableKeybinds] = useState(true);
  const [comment, setComment] = useState('');
  const [remarks, setRemarks] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages: UploadedImage[] = acceptedFiles.map((file) => ({
      id: uuidv4(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      confidence: Math.floor(Math.random() * 30) + 70, // Simulated confidence score
    }));
    setUploadedFiles((prevFiles) => [...prevFiles, ...newImages]);
    onUpload(newImages);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
  });

  const handleClearFiles = () => {
    setUploadedFiles([]);
  };

  const handleDeleteSelected = () => {
    // Implement delete selected functionality
  };

  return (
    <div className="text-white">
      <div className="mb-4">
        <label className="block mb-2">Select Game (Required)</label>
        <select
          value={game}
          onChange={(e) => setGame(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded text-white"
        >
          <option value="Magic: The Gathering">Magic: The Gathering</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Select Expansion (Optional)</label>
        <select
          value={expansion}
          onChange={(e) => setExpansion(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded text-white"
        >
          <option value="">Select expansion</option>
          {/* Add more expansion options here */}
        </select>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-2">Condition</label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded text-white"
          >
            <option value="NM">NM</option>
            {/* Add more condition options here */}
          </select>
        </div>
        <div>
          <label className="block mb-2">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded text-white"
          >
            <option value="English">English</option>
            {/* Add more language options here */}
          </select>
        </div>
        <div>
          <label className="block mb-2">Printing Type</label>
          <select
            value={printingType}
            onChange={(e) => setPrintingType(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded text-white"
          >
            <option value="Normal">Normal</option>
            {/* Add more printing type options here */}
          </select>
        </div>
      </div>
      <div
        {...getRootProps()}
        className={`p-4 border-2 border-dashed rounded-lg mb-4 ${
          isDragActive ? 'border-blue-500 bg-blue-900' : 'border-gray-600'
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-center">Drag & drop files here, or click to select files</p>
        <p className="text-center text-sm text-gray-400">(Max 500 files)</p>
        <p className="text-center text-sm text-gray-400">(Only *.jpeg and *.png images will be accepted)</p>
      </div>
      <div className="flex justify-between mb-4">
        <button
          onClick={handleClearFiles}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Clear Files
        </button>
        <div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
            Manual Entry
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
            Bulk Update
          </button>
          <button
            onClick={handleDeleteSelected}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete Selected
          </button>
        </div>
      </div>
      <div className="mb-4">
        <h3 className="font-bold mb-2">Uploaded Files</h3>
        <div className="max-h-60 overflow-y-auto bg-gray-700 rounded p-2">
          {uploadedFiles.length === 0 ? (
            <p className="text-gray-400">No files uploaded yet</p>
          ) : (
            <ul>
              {uploadedFiles.map((file) => (
                <li key={file.id} className="flex justify-between items-center py-2 border-b border-gray-600">
                  <div>
                    <p>{file.name}</p>
                    <p className="text-sm text-gray-400">
                      Details: 1 x {condition},{language.slice(0, 2)},{printingType}
                    </p>
                    <p className="text-sm text-gray-400">
                      Confidence: {file.confidence}%
                    </p>
                  </div>
                  <button className="text-red-500">&times;</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Comment</label>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded text-white"
          />
        </div>
        <div>
          <label className="block mb-2">Remarks</label>
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded text-white"
          />
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="inline-flex items-center mr-4">
            <input
              type="checkbox"
              className="form-checkbox bg-gray-700"
              checked={languageDetection}
              onChange={(e) => setLanguageDetection(e.target.checked)}
            />
            <span className="ml-2">Language Detection (Latin Characters)</span>
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="checkbox"
              className="form-checkbox bg-gray-700"
              checked={scanCardBacks}
              onChange={(e) => setScanCardBacks(e.target.checked)}
            />
            <span className="ml-2">Scan Card Backs</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox bg-gray-700"
              checked={enableKeybinds}
              onChange={(e) => setEnableKeybinds(e.target.checked)}
            />
            <span className="ml-2">Enable Keybinds</span>
          </label>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Edit Keybinds
        </button>
      </div>
      <button className="w-full bg-blue-500 text-white px-4 py-2 rounded">
        Recover Auto Save
      </button>
    </div>
  );
};

export default ImageUploader;