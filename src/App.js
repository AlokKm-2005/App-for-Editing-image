import React, { useState, useCallback, useRef, useEffect } from 'react';
import './App.css';
import DarkModeToggle from './components/DarkModeToggle';
import ImageCropper from './components/ImageCropper';
import EditorPanel from './components/EditorPanel';
import EmojiPicker from 'emoji-picker-react';


function getCroppedImg(imageSrc, crop, rotation = 0) {
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });

  const getRadianAngle = (degree) => (degree * Math.PI) / 180;

  return new Promise(async (resolve, reject) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    
    canvas.width = crop.width;
    canvas.height = crop.height;

    
    ctx.save();
    ctx.translate(-crop.x, -crop.y);

    
    if (rotation !== 0) {
      ctx.translate(crop.x + crop.width / 2, crop.y + crop.height / 2);
      ctx.rotate(getRadianAngle(rotation));
      ctx.translate(-(crop.x + crop.width / 2), -(crop.y + crop.height / 2));
    }

    ctx.drawImage(image, 0, 0);
    ctx.restore();

    canvas.toBlob((blob) => {
      if (!blob) return reject('Canvas is empty');
      const url = URL.createObjectURL(blob);
      resolve({ url, canvas });
    }, 'image/jpeg');
  });
}

function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [grayscale, setGrayscale] = useState(false);
  const [text, setText] = useState('Edit me!');
  const [textPosition, setTextPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [textColor, setTextColor] = useState('#f43f5e'); 
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const canvasRef = useRef();

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const cropImage = async () => {
    if (!croppedAreaPixels) {
      alert('Please adjust the crop area first.');
      return;
    }
    try {
      const { url, canvas } = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      setCroppedImage({ url, canvas });
    } catch (err) {
      console.error(err);
      alert('Failed to crop image.');
    }
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => {
    if (isDragging) {
      const rect = canvasRef.current.getBoundingClientRect();
      setTextPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const downloadFinalImage = () => {
    if (!croppedImage || !canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = 'final_image.jpg';
    link.href = canvasRef.current.toDataURL('image/jpeg');
    link.click();
  };

  useEffect(() => {
    if (!croppedImage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new window.Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (grayscale) {
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < imgData.data.length; i += 4) {
          const avg = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
          imgData.data[i] = imgData.data[i + 1] = imgData.data[i + 2] = avg;
        }
        ctx.putImageData(imgData, 0, 0);
      } else {
        ctx.drawImage(img, 0, 0);
      }

      ctx.font = '32px Poppins';
      ctx.fillStyle = textColor;
      ctx.fillText(text, textPosition.x, textPosition.y);
    };
    img.src = croppedImage.url;
  }, [croppedImage, grayscale, text, textPosition, textColor]);

  
  useEffect(() => {
    if (croppedImage) {
      setHistory((prev) => [...prev, {
        croppedImage,
        grayscale,
        text,
        textPosition,
        textColor,
      }]);
      setFuture([]); 
    }
    
  }, [croppedImage, grayscale, text, textPosition, textColor]);

  
  const handleUndo = () => {
    if (history.length <= 1) return;
    const prevHistory = [...history];
    const lastState = prevHistory.pop();
    setFuture((f) => [lastState, ...f]);
    const prevState = prevHistory[prevHistory.length - 1];
    setHistory(prevHistory);
    if (prevState) {
      setCroppedImage(prevState.croppedImage);
      setGrayscale(prevState.grayscale);
      setText(prevState.text);
      setTextPosition(prevState.textPosition);
      setTextColor(prevState.textColor);
    }
  };

  
  const handleRedo = () => {
    if (future.length === 0) return;
    const [nextState, ...rest] = future;
    setFuture(rest);
    setHistory((h) => [...h, nextState]);
    setCroppedImage(nextState.croppedImage);
    setGrayscale(nextState.grayscale);
    setText(nextState.text);
    setTextPosition(nextState.textPosition);
    setTextColor(nextState.textColor);
  };

  return (
    <div className="app-bg">
      <header className="header">
        <h1>Image Editing Tool</h1>
        <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      </header>
      <main className="min-h-screen p-6">
        <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-6" />

        {imageSrc && (
          <ImageCropper
            imageSrc={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            setCrop={setCrop}
            setZoom={setZoom}
            setRotation={setRotation}
            onCropComplete={onCropComplete}
            croppedAreaPixels={croppedAreaPixels}
            cropImage={cropImage}
          />
        )}

        {croppedImage && (
          <EditorPanel
            text={text}
            setText={setText}
            grayscale={grayscale}
            setGrayscale={setGrayscale}
            textColor={textColor}
            setTextColor={setTextColor}
            handleUndo={handleUndo}
            handleRedo={handleRedo}
            history={history}
            future={future}
            canvasRef={canvasRef}
            handleMouseDown={handleMouseDown}
            handleMouseUp={handleMouseUp}
            handleMouseMove={handleMouseMove}
            downloadFinalImage={downloadFinalImage}
            croppedImage={croppedImage}
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
            darkMode={darkMode}
          />
        )}
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type your text here"
            style={{ marginRight: 8, padding: 8, fontSize: 16 }}
          />
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            {showEmojiPicker ? 'Close Emoji Picker' : 'Add Emoji'}
          </button>
          {showEmojiPicker && (
            <div style={{ position: 'absolute', zIndex: 100 }}>
              <EmojiPicker
                onEmojiClick={(emojiData) => setText(text + emojiData.emoji)}
                theme={darkMode ? 'dark' : 'light'}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;