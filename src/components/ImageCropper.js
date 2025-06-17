import React from 'react';
import Cropper from 'react-easy-crop';
import Slider from '@mui/material/Slider';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';

const ImageCropper = ({
  imageSrc,
  crop,
  zoom,
  rotation,
  setCrop,
  setZoom,
  setRotation,
  onCropComplete,
  croppedAreaPixels,
  cropImage,
}) => (
  <>
    <div className="relative w-full h-[400px] bg-gray-200 rounded-lg overflow-hidden mb-6">
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        rotation={rotation}
        aspect={4 / 3}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onRotationChange={setRotation}
        onCropComplete={onCropComplete}
      />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      <div className="flex items-center gap-3">
        <ZoomOutIcon className="text-pink-400" />
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          onChange={(e, v) => setZoom(v)}
          sx={{
            color: '#f43f5e',
            '& .MuiSlider-thumb': { borderRadius: '8px' },
            '& .MuiSlider-rail': { opacity: 0.3 },
          }}
        />
        <ZoomInIcon className="text-pink-400" />
      </div>
      <div className="flex items-center gap-3">
        <RotateLeftIcon className="text-pink-400" />
        <Slider
          value={rotation}
          min={0}
          max={360}
          step={1}
          onChange={(e, v) => setRotation(v)}
          sx={{
            color: '#f43f5e',
            '& .MuiSlider-thumb': { borderRadius: '8px' },
            '& .MuiSlider-rail': { opacity: 0.3 },
          }}
        />
        <RotateRightIcon className="text-pink-400" />
      </div>
    </div>
    <button
      onClick={cropImage}
      className="mt-6 bg-pink-600 hover:bg-pink-700 text-white font-medium px-6 py-2 rounded-lg block mx-auto transition"
      disabled={!croppedAreaPixels}
    >
      Crop Image
    </button>
  </>
);

export default ImageCropper;