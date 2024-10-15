import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import { UploadedImage, RecognizedCard } from '../types';
import { recognizeCardName } from '../services/googleVisionApi';
import { getCardVersions } from '../services/scryfallApi';
import { TrashIcon, Loader, AlertCircle } from 'lucide-react';

interface CardUploaderProps {
  onUpload: (recognizedCards: RecognizedCard[]) => void;
  preSelectedSet?: string;
}

const CardUploader: React.FC<CardUploaderProps> = ({ onUpload, preSelectedSet }) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [recognizedCards, setRecognizedCards] = useState<RecognizedCard[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsProcessing(true);
    setErrors([]);

    const newImages: UploadedImage[] = acceptedFiles.map((file) => ({
      id: uuidv4(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));

    setUploadedImages((prevImages) => [...prevImages, ...newImages]);

    const newRecognizedCards: RecognizedCard[] = [];
    const newErrors: string[] = [];

    for (const image of newImages) {
      try {
        const recognizedName = await recognizeCardName(image.file);
        if (recognizedName) {
          const versions = await getCardVersions(recognizedName);
          const newCard: RecognizedCard = {
            name: recognizedName,
            versions,
            selectedVersion: versions.length > 0 ? versions[0] : null,
            uploadedImage: image,
          };
          newRecognizedCards.push(newCard);
        } else {
          newErrors.push(`Failed to recognize card from image: ${image.name}`);
        }
      } catch (error) {
        console.error('Error processing image:', error);
        newErrors.push(`Error processing image: ${image.name}`);
      }
    }

    setRecognizedCards((prevCards) => [...prevCards, ...newRecognizedCards]);
    onUpload([...recognizedCards, ...newRecognizedCards]);
    setErrors(newErrors);
    setIsProcessing(false);
  }, [onUpload, recognizedCards]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    multiple: true,
  });

  const handleClearFiles = () => {
    setUploadedImages([]);
    setRecognizedCards([]);
    setErrors([]);
    onUpload([]);
  };

  return (
    <div className="text-white">
      <div
        {...getRootProps()}
        className={`p-6 border-2 border-dashed rounded-lg mb-4 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-100 bg-opacity-10' : 'border-gray-600 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-lg mb-2">Drag & drop files here, or click to select files</p>
        <p className="text-sm text-gray-400">(Max 500 files)</p>
        <p className="text-sm text-gray-400">(Only *.jpeg and *.png images will be accepted)</p>
      </div>

      <div className="flex justify-between mb-4">
        <button
          onClick={handleClearFiles}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Clear Files
        </button>
        <div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded mr-2">
            Manual Entry
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded mr-2">
            Bulk Update
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded flex items-center">
            <TrashIcon size={16} className="mr-2" />
            Delete Selected
          </button>
        </div>
      </div>

      {isProcessing && (
        <div className="text-center mb-4 flex items-center justify-center">
          <Loader className="animate-spin mr-2" size={20} />
          <p>Processing images...</p>
        </div>
      )}

      {errors.length > 0 && (
        <div className="bg-red-600 text-white p-4 rounded mb-4">
          <div className="flex items-center mb-2">
            <AlertCircle size={20} className="mr-2" />
            <h3 className="font-bold">Errors occurred during processing:</h3>
          </div>
          <ul className="list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {uploadedImages.length > 0 && (
        <div className="mb-4">
          <h3 className="font-bold mb-2">Uploaded Files</h3>
          <div className="max-h-60 overflow-y-auto bg-gray-800 rounded p-2">
            {uploadedImages.map((image) => (
              <div key={image.id} className="flex justify-between items-center py-2 border-b border-gray-700">
                <div className="flex items-center">
                  <img src={image.preview} alt={image.name} className="w-16 h-16 object-cover mr-4 rounded" />
                  <div>
                    <p>{image.name}</p>
                    <p className="text-sm text-gray-400">
                      Details: 1 x NM, EN, Normal
                    </p>
                  </div>
                </div>
                <button className="text-red-500">&times;</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardUploader;