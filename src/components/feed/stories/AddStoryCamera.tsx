import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Image, Type, Smile, Brush, Check, ArrowLeft } from 'lucide-react';
import { useStore } from '@/store/useStore';
import Button from '@/components/shared/Button';
import IconButton from '@/components/shared/IconButton';

enum StoryCreationStep {
  CAMERA,
  EDIT,
  PREVIEW
}

enum EditingTool {
  NONE,
  TEXT,
  DRAW,
  STICKER
}

interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  fontSize: string;
}

const AddStoryCamera: React.FC = () => {
  const { closeAddStoryModal, addNewStory } = useStore();
  const [step, setStep] = useState<StoryCreationStep>(StoryCreationStep.CAMERA);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<EditingTool>(EditingTool.NONE);
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [currentColor, setCurrentColor] = useState('#ffffff');
  const [isUploading, setIsUploading] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize camera
  useEffect(() => {
    if (step === StoryCreationStep.CAMERA) {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error('Error accessing camera:', err);
        }
      };
      
      startCamera();
      
      return () => {
        // Stop camera when component unmounts or step changes
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, [step]);
  
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageDataUrl);
        setStep(StoryCreationStep.EDIT);
      }
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string);
        setStep(StoryCreationStep.EDIT);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const addTextOverlay = () => {
    if (currentText.trim()) {
      const newOverlay: TextOverlay = {
        id: Date.now().toString(),
        text: currentText,
        x: 50, // center position
        y: 50,
        color: currentColor,
        fontSize: '24px'
      };
      
      setTextOverlays([...textOverlays, newOverlay]);
      setCurrentText('');
      setActiveTool(EditingTool.NONE);
    }
  };
  
  const handleSubmit = async () => {
    if (capturedImage) {
      setIsUploading(true);
      
      try {
        // In a real app, you would upload to S3 here
        // For now, we'll just use the data URL
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload delay
        
        addNewStory(capturedImage);
        closeAddStoryModal();
      } catch (error) {
        console.error('Error uploading story:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };
  
  const renderCameraView = () => (
    <div className="relative h-full">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="w-full h-full object-cover"
      />
      
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="absolute bottom-6 inset-x-0 flex justify-center space-x-6 items-center">
        <IconButton
          icon={<Image size={24} />}
          onClick={() => fileInputRef.current?.click()}
          className="bg-black/30 text-white"
          size="lg"
        />
        
        <IconButton
          icon={<Camera size={32} />}
          onClick={captureImage}
          className="bg-white text-black"
          size="lg"
        />
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />
    </div>
  );
  
  const renderEditView = () => (
    <div className="relative h-full">
      <div className="absolute top-4 left-4 z-10">
        <IconButton
          icon={<ArrowLeft size={24} />}
          onClick={() => setStep(StoryCreationStep.CAMERA)}
          className="text-white"
        />
      </div>
      
      <div className="absolute top-4 right-4 z-10">
        <IconButton
          icon={<Check size={24} />}
          onClick={() => setStep(StoryCreationStep.PREVIEW)}
          className="text-white"
        />
      </div>
      
      {capturedImage && (
        <div className="relative w-full h-full">
          <img 
            src={capturedImage} 
            alt="Captured" 
            className="w-full h-full object-cover" 
          />
          
          {/* Text overlays */}
          {textOverlays.map((overlay) => (
            <div
              key={overlay.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move"
              style={{
                left: `${overlay.x}%`,
                top: `${overlay.y}%`,
                color: overlay.color,
                fontSize: overlay.fontSize,
                textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
              }}
            >
              {overlay.text}
            </div>
          ))}
          
          {/* Text input when text tool is active */}
          {activeTool === EditingTool.TEXT && (
            <div className="absolute bottom-20 inset-x-0 px-4">
              <input
                type="text"
                value={currentText}
                onChange={(e) => setCurrentText(e.target.value)}
                placeholder="Type something..."
                className="w-full p-3 bg-black/50 text-white rounded-lg focus:outline-none"
                autoFocus
              />
              
              <div className="flex justify-center mt-3 space-x-2">
                {['#ffffff', '#EF4443', '#3b82f6', '#10b981', '#f59e0b'].map(color => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full ${color === currentColor ? 'ring-2 ring-white' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setCurrentColor(color)}
                  />
                ))}
              </div>
              
              <div className="flex justify-end mt-3">
                <Button 
                  onClick={addTextOverlay}
                  variant="primary"
                >
                  Add Text
                </Button>
              </div>
            </div>
          )}
          
          {/* Editing tools */}
          <div className="absolute bottom-6 inset-x-0 flex justify-center space-x-6">
            <IconButton
              icon={<Type size={24} />}
              onClick={() => setActiveTool(EditingTool.TEXT)}
              className={`${activeTool === EditingTool.TEXT ? 'bg-white text-black' : 'bg-black/30 text-white'}`}
              size="lg"
            />
            <IconButton
              icon={<Brush size={24} />}
              onClick={() => setActiveTool(EditingTool.DRAW)}
              className={`${activeTool === EditingTool.DRAW ? 'bg-white text-black' : 'bg-black/30 text-white'}`}
              size="lg"
            />
            <IconButton
              icon={<Smile size={24} />}
              onClick={() => setActiveTool(EditingTool.STICKER)}
              className={`${activeTool === EditingTool.STICKER ? 'bg-white text-black' : 'bg-black/30 text-white'}`}
              size="lg"
            />
          </div>
        </div>
      )}
    </div>
  );
  
  const renderPreviewView = () => (
    <div className="relative h-full">
      <div className="absolute top-4 left-4 z-10">
        <IconButton
          icon={<ArrowLeft size={24} />}
          onClick={() => setStep(StoryCreationStep.EDIT)}
          className="text-white"
        />
      </div>
      
      {capturedImage && (
        <div className="relative w-full h-full">
          <img 
            src={capturedImage} 
            alt="Preview" 
            className="w-full h-full object-cover" 
          />
          
          {/* Text overlays */}
          {textOverlays.map((overlay) => (
            <div
              key={overlay.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${overlay.x}%`,
                top: `${overlay.y}%`,
                color: overlay.color,
                fontSize: overlay.fontSize,
                textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
              }}
            >
              {overlay.text}
            </div>
          ))}
          
          <div className="absolute bottom-6 inset-x-0 px-4">
            <Button
              onClick={handleSubmit}
              variant="primary"
              className="w-full"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Share Story'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
  
  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="absolute top-4 right-4 z-10">
        <IconButton
          icon={<X size={24} />}
          onClick={closeAddStoryModal}
          className="text-white"
          variant="ghost"
          size="md"
        />
      </div>
      
      <div className="h-full">
        {step === StoryCreationStep.CAMERA && renderCameraView()}
        {step === StoryCreationStep.EDIT && renderEditView()}
        {step === StoryCreationStep.PREVIEW && renderPreviewView()}
      </div>
    </div>
  );
};

export default AddStoryCamera; 