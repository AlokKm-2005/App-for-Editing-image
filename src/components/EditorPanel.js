import React from 'react';
import EmojiPicker from 'emoji-picker-react';

const EditorPanel = ({
  text,
  setText,
  grayscale,
  setGrayscale,
  textColor,
  setTextColor,
  handleUndo,
  handleRedo,
  history,
  future,
  canvasRef,
  handleMouseDown,
  handleMouseUp,
  handleMouseMove,
  downloadFinalImage,
  croppedImage,
  showEmojiPicker,
  setShowEmojiPicker,
  darkMode,
}) => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full px-4 py-2 rounded-lg text-black"
      />
      <button
        onClick={() => setGrayscale(!grayscale)}
        className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition"
      >
        {grayscale ? 'Remove Grayscale' : 'Apply Grayscale'}
      </button>
      <input
        type="color"
        value={textColor}
        onChange={e => setTextColor(e.target.value)}
        className="w-12 h-12 p-0 border-2 border-pink-400 rounded-lg cursor-pointer ml-2"
      />
    </div>
    <div className="flex gap-4 mb-2">
      <button
        onClick={handleUndo}
        disabled={history.length <= 1}
        className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
      >
        ⬅️ Undo
      </button>
      <button
        onClick={handleRedo}
        disabled={future.length === 0}
        className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
      >
        Redo ➡️
      </button>
    </div>
    <canvas
      ref={canvasRef}
      className="w-full border-2 border-white rounded-xl cursor-move"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    />
    <button
      onClick={downloadFinalImage}
      className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-lg block mx-auto transition"
    >
      Download Final Image
    </button>
    {croppedImage?.url && (
      <img
        src={croppedImage.url}
        alt="Cropped Preview"
        className="w-full max-w-md mx-auto rounded-lg border-2 border-pink-400"
        style={{ marginTop: '1rem' }}
      />
    )}
    <div className="relative">
      <button
        onClick={() => setShowEmojiPicker((v) => !v)}
        className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition"
      >
        😊 Add Emoji
      </button>
      {showEmojiPicker && (
        <div className="absolute z-50 mt-2">
          <EmojiPicker
            theme={darkMode ? 'dark' : 'light'}
            onEmojiClick={(emojiData) => {
              setText(text + emojiData.emoji);
              setShowEmojiPicker(false);
            }}
          />
        </div>
      )}
    </div>
  </div>
);

export default EditorPanel;