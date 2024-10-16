import { useState, useCallback, Dispatch, SetStateAction } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  preview: string;
}

// Custom hook for file uploader functionality
export const useFileUploader = (onUpload: (files: UploadedFile[]) => void) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const newImages = acceptedFiles.map((file) => ({
        id: uuidv4(),
        file,
        name: file.name,
        preview: URL.createObjectURL(file),
      }));
      onUpload(newImages);
    },
  });

  return {
    getRootProps,
    getInputProps,
    isDragActive,
  };
};

// Custom hook for fetching sets data
export const useFetchSets = <T>() => {
  const [sets, setSets] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<T[]>('/api/sets');
      setSets(response.data);
    } catch (error) {
      console.error('Failed to fetch sets:', error);
      setError('Failed to fetch sets');
    } finally {
      setLoading(false);
    }
  }, []);

  return { sets, fetchSets, loading, error };
};

// Utility function to clear files
export const handleClearFiles = (setFiles: Dispatch<SetStateAction<UploadedFile[]>>) => {
  setFiles([]);
};
