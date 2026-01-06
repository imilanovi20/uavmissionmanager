// FileInputField.types.ts


// FileInputField.tsx
import React, { useState } from 'react';
import {
  StyledFileInputContainer,
  StyledFileInput,
  StyledDropZone,
  StyledIcon,
  StyledMainText,
  StyledSubText,
  StyledFileName,
  StyledLabel
} from './FileInputField.styles';
import type { FileInputFieldProps } from './FileInputField.types';

const FileInputField = ({
  label,
  accept = "image/*",
  disabled = false,
  onChange,
  selectedFile
}: FileInputFieldProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const hasFile = !!selectedFile;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    const validFile = files.find(file => {
      if (accept === "image/*") return file.type.startsWith('image/');
      return true;
    });
    
    onChange(validFile || null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <StyledFileInputContainer>
      <StyledLabel>{label}</StyledLabel>
      
      <StyledDropZone
        isDragOver={isDragOver}
        hasFile={hasFile}
        disabled={disabled}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <StyledFileInput
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled}
        />
        
        <StyledIcon hasFile={hasFile}>
          {hasFile ? '✓' : '📷'}
        </StyledIcon>
        
        {hasFile ? (
          <>
            <StyledMainText>File selected</StyledMainText>
            <StyledFileName>{selectedFile?.name}</StyledFileName>
          </>
        ) : (
          <>
            <StyledMainText>Choose picture or drag here</StyledMainText>
            <StyledSubText>Supports: JPG, PNG, GIF</StyledSubText>
          </>
        )}
      </StyledDropZone>
    </StyledFileInputContainer>
  );
};

export default FileInputField;