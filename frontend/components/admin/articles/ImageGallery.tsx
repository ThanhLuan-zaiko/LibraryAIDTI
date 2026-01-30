import React, { useRef, useState } from 'react';
import { HiCloudUpload, HiTrash, HiStar, HiPlus, HiCheck, HiExclamationCircle } from 'react-icons/hi';
import { FaSpinner } from 'react-icons/fa';
import { getImageUrl } from '@/utils/image';
import ConfirmModal from '@/components/common/ConfirmModal';

interface ImageItem {
    local_id?: string;         // For stable referencing in Markdown
    image_url?: string;        // For existing images from server
    image_data?: string;       // For new images (base64)
    description?: string;
    is_primary?: boolean;
    file?: File;              // Keep file object reference
}

interface ImageGalleryProps {
    images: ImageItem[];
    onImagesChange: (images: ImageItem[]) => void;
    onImageInsert?: (url: string, description?: string, index?: number) => boolean;
    onImageRemove?: (image: ImageItem) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onImagesChange, onImageInsert, onImageRemove }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = React.useState(false);
    const [processing, setProcessing] = React.useState(false);
    const [progress, setProgress] = React.useState({ current: 0, total: 0 });
    const [showInserted, setShowInserted] = useState(false);
    const [insertError, setInsertError] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        if (imageFiles.length === 0) return;

        // Validation: Limit total images to 30
        if (images.length + imageFiles.length > 30) {
            setShowLimitModal(true);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setProcessing(true);
        setProgress({ current: 0, total: imageFiles.length });
        const currentImages = [...images];

        // Convert all files to base64
        for (let i = 0; i < imageFiles.length; i++) {
            const file = imageFiles[i];
            setProgress(prev => ({ ...prev, current: i + 1 }));
            try {
                const base64 = await convertFileToBase64(file);
                const newImage: ImageItem = {
                    local_id: `image-${Date.now()}-${i}`,
                    image_data: base64,
                    is_primary: currentImages.length === 0 && i === 0,
                    file: file,
                };
                currentImages.push(newImage);
            } catch (error) {
                console.error('Failed to process image', error);
            }
        }

        onImagesChange(currentImages);
        if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
        setProcessing(false);
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (!files || files.length === 0) return;

        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        if (imageFiles.length === 0) return;

        // Validation: Limit total images to 30
        if (images.length + imageFiles.length > 30) {
            setShowLimitModal(true);
            return;
        }

        setProcessing(true);
        setProgress({ current: 0, total: imageFiles.length });
        const currentImages = [...images];

        // Convert all image files to base64
        for (let i = 0; i < imageFiles.length; i++) {
            const file = imageFiles[i];
            setProgress(prev => ({ ...prev, current: i + 1 }));
            try {
                const base64 = await convertFileToBase64(file);
                const newImage: ImageItem = {
                    local_id: `image-${Date.now()}-${i}`,
                    image_data: base64,
                    is_primary: currentImages.length === 0 && i === 0,
                    file: file,
                };
                currentImages.push(newImage);
            } catch (error) {
                console.error('Failed to process image', error);
            }
        }

        onImagesChange(currentImages);
        setProcessing(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleRemoveImage = (index: number) => {
        const removedImage = images[index];
        const newImages = images.filter((_, i) => i !== index);
        // If removed image was primary, make first image primary
        if (removedImage.is_primary && newImages.length > 0) {
            newImages[0].is_primary = true;
        }

        // Notify parent about removal for content cleanup
        if (onImageRemove) {
            onImageRemove(removedImage);
        }

        onImagesChange(newImages);
    };

    const handleSetPrimary = (index: number) => {
        const newImages = images.map((img, i) => ({
            ...img,
            is_primary: i === index,
        }));
        onImagesChange(newImages);
    };

    const handleDescriptionChange = (index: number, description: string) => {
        const newImages = [...images];
        newImages[index] = { ...newImages[index], description };
        onImagesChange(newImages);
    };

    const progressPercentage = (progress.current / progress.total) * 100;

    return (
        <div className="space-y-3">
            {/* Upload Button with Drag and Drop */}
            <div
                onClick={() => !processing && fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative aspect-video rounded-xl overflow-hidden border-2 border-dashed transition-all duration-300 cursor-pointer group ${isDragging
                    ? 'border-blue-500 bg-blue-50/50 scale-[1.02] ring-4 ring-blue-500/10'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-slate-50'
                    } ${processing ? 'cursor-not-allowed opacity-80' : ''}`}
            >
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    {processing ? (
                        <div className="w-full max-w-xs space-y-4 animate-in fade-in zoom-in duration-300">
                            <div className="relative h-3 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                <div
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 ease-out flex items-center justify-end pr-1"
                                    style={{ width: `${progressPercentage}%` }}
                                >
                                    <div className="w-1 h-1 bg-white/50 rounded-full animate-ping"></div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-sm font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                    {Math.round(progressPercentage)}%
                                </span>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                                    Đang xử lý ({progress.current}/{progress.total})
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={`p-4 rounded-2xl transition-all duration-300 ${isDragging ? 'bg-blue-100 text-blue-600 scale-110' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500'}`}>
                                <HiCloudUpload className="w-8 h-8" />
                            </div>
                            <div className="mt-4 space-y-1">
                                <p className="text-sm font-bold text-gray-700">
                                    {isDragging ? 'Thả ảnh để tải lên' : 'Tải ảnh lên bài viết'}
                                </p>
                                <p className="text-xs text-gray-400 font-medium">
                                    Nhấn để chọn hoặc kéo thả nhiều ảnh cùng lúc
                                </p>
                            </div>
                            <div className="mt-4 px-3 py-1 bg-slate-100 rounded-full border border-gray-200">
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">
                                    PNG, JPG tối đa 20MB | Đề xuất tối đa 30 ảnh
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                disabled={processing}
            />

            {/* Image Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {images
                        .map((img, originalIndex) => ({ img, originalIndex }))
                        .sort((a, b) => (a.img.is_primary === b.img.is_primary ? 0 : a.img.is_primary ? -1 : 1))
                        .map(({ img: image, originalIndex }, visualIndex) => {
                            const imageUrl = image.image_data || image.image_url || '';
                            const itemKey = `image-${imageUrl || originalIndex}`;

                            return (
                                <div
                                    key={itemKey}
                                    className="flex flex-col space-y-2 group"
                                >
                                    <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-gray-100 group-hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md">
                                        <img
                                            src={getImageUrl(imageUrl)}
                                            alt={`Image ${visualIndex + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />

                                        {/* Primary Badge */}
                                        {image.is_primary && (
                                            <div className="absolute top-2 left-2 bg-yellow-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-lg border border-white/20">
                                                <HiStar className="w-3 h-3" />
                                                <span className="uppercase tracking-tighter">Chính</span>
                                            </div>
                                        )}

                                        {/* Order Badge */}
                                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10 shadow-sm transition-all group-hover:bg-blue-600">
                                            #{visualIndex + 1}
                                        </div>

                                        {/* Hover Actions */}
                                        <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center space-x-3">
                                            {!image.is_primary && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleSetPrimary(originalIndex); }}
                                                    className="bg-white text-yellow-500 p-2.5 rounded-xl shadow-xl hover:bg-yellow-500 hover:text-white transition-all transform hover:scale-110 active:scale-95"
                                                    title="Đặt làm ảnh chính"
                                                >
                                                    <HiStar className="w-5 h-5" />
                                                </button>
                                            )}
                                            {onImageInsert && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const success = onImageInsert(image.local_id || imageUrl, image.description, visualIndex + 1);
                                                        if (success) {
                                                            setShowInserted(true);
                                                            setInsertError(false);
                                                            setTimeout(() => setShowInserted(false), 2000);
                                                        } else {
                                                            setInsertError(true);
                                                            setShowInserted(true);
                                                            setTimeout(() => setShowInserted(false), 3000);
                                                        }
                                                    }}
                                                    className="bg-white text-blue-600 p-2.5 rounded-xl shadow-xl hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110 active:scale-95"
                                                    title="Chèn vào nội dung"
                                                >
                                                    <HiPlus className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleRemoveImage(originalIndex); }}
                                                className="bg-white text-red-500 p-2.5 rounded-xl shadow-xl hover:bg-red-500 hover:text-white transition-all transform hover:scale-110 active:scale-95"
                                                title="Xóa ảnh"
                                            >
                                                <HiTrash className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <input
                                        type="text"
                                        placeholder="Thêm mô tả cho ảnh này..."
                                        value={image.description || ''}
                                        onChange={(e) => handleDescriptionChange(originalIndex, e.target.value)}
                                        className="text-[11px] px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10 outline-none bg-white transition-all font-semibold placeholder:text-gray-300 shadow-sm"
                                    />
                                </div>
                            );
                        })}
                </div>
            )}

            {/* Insertion Toast */}
            <div className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[100] transition-all duration-500 ${showInserted ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
                {insertError ? (
                    <div className="bg-red-900/90 backdrop-blur-xl border border-red-500/20 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                            <HiExclamationCircle className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-red-400">Không thể chèn</p>
                            <p className="text-[10px] text-red-200/60 font-medium">Nội dung đang ở chế độ xem thử</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-indigo-950/90 backdrop-blur-xl border border-indigo-500/20 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                            <HiCheck className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-blue-400">Thành công</p>
                            <p className="text-[10px] text-blue-200/60 font-medium">Ảnh đã được chèn vào nội dung bài viết</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Shared Confirm Modal for Limit Warning */}
            <ConfirmModal
                isOpen={showLimitModal}
                title="Giới hạn hình ảnh"
                message={`Một bài viết chỉ được chứa tối đa 30 hình ảnh. Hiện tại bài viết đã có ${images.length} ảnh.`}
                confirmText="Đã hiểu"
                showCancel={false}
                type="warning"
                onConfirm={() => setShowLimitModal(false)}
                onCancel={() => setShowLimitModal(false)}
            />
        </div>
    );
};

export default ImageGallery;
