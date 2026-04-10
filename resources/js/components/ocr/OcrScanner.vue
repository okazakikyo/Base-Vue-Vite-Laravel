<template>
    <div class="ocr-scanner">
        <div class="ocr-scanner__header">
            <h2 class="ocr-scanner__title">OCR Scanner</h2>
            <p class="ocr-scanner__subtitle">Upload an image or use camera to extract text</p>
        </div>

        <div class="ocr-scanner__tabs">
            <button
                v-for="tab in tabs"
                :key="tab.id"
                class="ocr-scanner__tab"
                :class="{ 'ocr-scanner__tab--active': activeTab === tab.id }"
                @click="activeTab = tab.id"
            >
                {{ tab.label }}
            </button>
        </div>

        <div class="ocr-scanner__content">
            <!-- Upload Tab -->
            <div v-if="activeTab === 'upload'" class="ocr-scanner__upload">
                <div
                    class="ocr-scanner__dropzone"
                    :class="{ 'ocr-scanner__dropzone--dragover': isDragging }"
                    @dragover.prevent="handleDragOver"
                    @dragleave="handleDragLeave"
                    @drop.prevent="handleDrop"
                >
                    <input
                        ref="fileInputRef"
                        type="file"
                        accept="image/*"
                        class="ocr-scanner__file-input"
                        @change="handleFileSelect"
                    />
                    <div class="ocr-scanner__dropzone-content">
                        <svg class="ocr-scanner__dropzone-icon" viewBox="0 0 24 24" fill="none">
                            <path d="M19.5 14.25V11.625C19.5 9.761 17.989 8.25 16.125 8.25H14.625C14.211 8.25 13.875 7.914 13.875 7.5V6C13.875 4.136 12.364 2.625 10.5 2.625H8.25M19.5 14.25H4.5M19.5 14.25L16.5 17.25M4.5 14.25L7.5 17.25M4.5 14.25V6C4.5 4.136 6.011 2.625 7.875 2.625H10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <p class="ocr-scanner__dropzone-text">
                            Drop your image here or <span class="ocr-scanner__dropzone-link">browse</span>
                        </p>
                        <p class="ocr-scanner__dropzone-hint">
                            Supports JPG, PNG, WebP up to 10MB
                        </p>
                    </div>
                </div>
                <div v-if="selectedFile" class="ocr-scanner__preview">
                    <img :src="imagePreview" alt="Selected image" class="ocr-scanner__preview-image" />
                    <div class="ocr-scanner__preview-actions">
                        <button class="ocr-scanner__button ocr-scanner__button--secondary" @click="clearImage">
                            Remove
                        </button>
                        <button class="ocr-scanner__button ocr-scanner__button--primary" @click="processImage">
                            Extract Text
                        </button>
                    </div>
                </div>
            </div>

            <!-- Camera Tab -->
            <div v-if="activeTab === 'camera'" class="ocr-scanner__camera">
                <div v-if="!isCameraActive" class="ocr-scanner__camera-setup">
                    <p class="ocr-scanner__camera-text">Click to start camera</p>
                    <button class="ocr-scanner__button ocr-scanner__button--primary" @click="startCamera">
                        Start Camera
                    </button>
                </div>
                <div v-else class="ocr-scanner__camera-active">
                    <video
                        ref="videoRef"
                        class="ocr-scanner__camera-video"
                        autoplay
                        playsinline
                    ></video>
                    <div class="ocr-scanner__camera-controls">
                        <button class="ocr-scanner__button ocr-scanner__button--secondary" @click="stopCamera">
                            Stop Camera
                        </button>
                        <button class="ocr-scanner__button ocr-scanner__button--primary" @click="captureImage">
                            Capture & Extract
                        </button>
                    </div>
                </div>
                <div v-if="capturedImage" class="ocr-scanner__preview">
                    <img :src="capturedImage" alt="Captured image" class="ocr-scanner__preview-image" />
                    <div class="ocr-scanner__preview-actions">
                        <button class="ocr-scanner__button ocr-scanner__button--secondary" @click="retakePhoto">
                            Retake
                        </button>
                        <button class="ocr-scanner__button ocr-scanner__button--primary" @click="processCapturedImage">
                            Extract Text
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Processing State -->
        <div v-if="isProcessing" class="ocr-scanner__processing">
            <div class="ocr-scanner__processing-spinner"></div>
            <p class="ocr-scanner__processing-text">
                Processing image... {{ progress }}%
            </p>
        </div>

        <!-- Results -->
        <div v-if="extractedText" class="ocr-scanner__results">
            <div class="ocr-scanner__results-header">
                <h3 class="ocr-scanner__results-title">Extracted Text</h3>
                <div class="ocr-scanner__results-actions">
                    <button class="ocr-scanner__button ocr-scanner__button--secondary" @click="copyText">
                        Copy Text
                    </button>
                    <button class="ocr-scanner__button ocr-scanner__button--secondary" @click="clearAll">
                        Clear All
                    </button>
                </div>
            </div>
            <textarea
                v-model="extractedText"
                class="ocr-scanner__results-textarea"
                rows="10"
                placeholder="Extracted text will appear here..."
            ></textarea>
            <div class="ocr-scanner__results-stats">
                <span class="ocr-scanner__results-stat">
                    Characters: {{ extractedText.length }}
                </span>
                <span class="ocr-scanner__results-stat">
                    Words: {{ wordCount }}
                </span>
                <span class="ocr-scanner__results-stat">
                    Language: {{ selectedLanguage }}
                </span>
            </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="ocr-scanner__error">
            <p class="ocr-scanner__error-text">{{ errorMessage }}</p>
            <button class="ocr-scanner__button ocr-scanner__button--secondary" @click="errorMessage = ''">
                Dismiss
            </button>
        </div>

        <!-- Language Selection -->
        <div class="ocr-scanner__language">
            <label for="language-select" class="ocr-scanner__language-label">OCR Language:</label>
            <select
                id="language-select"
                v-model="selectedLanguage"
                class="ocr-scanner__language-select"
                :disabled="isProcessing"
            >
                <option value="eng">English</option>
                <option value="vie">Vietnamese</option>
                <option value="fra">French</option>
                <option value="spa">Spanish</option>
                <option value="deu">German</option>
                <option value="chi_sim">Chinese Simplified</option>
                <option value="jpn">Japanese</option>
                <option value="kor">Korean</option>
            </select>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import Tesseract from 'tesseract.js';

// Tabs
type Tab = 'upload' | 'camera';
const tabs = [
    { id: 'upload' as Tab, label: 'Upload Image' },
    { id: 'camera' as Tab, label: 'Camera' },
];
const activeTab = ref<Tab>('upload');

// File upload
const fileInputRef = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const imagePreview = ref<string>('');
const isDragging = ref(false);

// Camera
const videoRef = ref<HTMLVideoElement | null>(null);
const isCameraActive = ref(false);
const capturedImage = ref<string>('');
let mediaStream: MediaStream | null = null;

// OCR
const extractedText = ref('');
const isProcessing = ref(false);
const progress = ref(0);
const errorMessage = ref('');
const selectedLanguage = ref('eng');

// Computed
const wordCount = computed(() => {
    return extractedText.value.trim().split(/\s+/).filter(word => word.length > 0).length;
});

// File handling
const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        const file = target.files[0];
        setSelectedFile(file);
    }
};

const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    isDragging.value = true;
};

const handleDragLeave = () => {
    isDragging.value = false;
};

const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    isDragging.value = false;
    const files = event.dataTransfer?.files;
    if (files && files[0] && files[0].type.startsWith('image/')) {
        setSelectedFile(files[0]);
    } else {
        errorMessage.value = 'Please drop a valid image file';
    }
};

const setSelectedFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
        errorMessage.value = 'File size exceeds 10MB limit';
        return;
    }
    selectedFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
};

const clearImage = () => {
    selectedFile.value = null;
    imagePreview.value = '';
    if (fileInputRef.value) {
        fileInputRef.value.value = '';
    }
};

// Camera functions
const startCamera = async () => {
    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
            audio: false,
        });
        if (videoRef.value) {
            videoRef.value.srcObject = mediaStream;
            isCameraActive.value = true;
        }
    } catch (err) {
        errorMessage.value = 'Cannot access camera: ' + (err as Error).message;
    }
};

const stopCamera = () => {
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
    }
    isCameraActive.value = false;
    if (videoRef.value) {
        videoRef.value.srcObject = null;
    }
};

const captureImage = () => {
    if (!videoRef.value) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.value.videoWidth;
    canvas.height = videoRef.value.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.value, 0, 0);
    capturedImage.value = canvas.toDataURL('image/jpeg');
    stopCamera();
};

const retakePhoto = () => {
    capturedImage.value = '';
    startCamera();
};

const processCapturedImage = () => {
    if (!capturedImage.value) return;
    processImage(capturedImage.value);
};

// OCR processing
const processImage = async (imageSrc?: string) => {
    const image = (typeof imageSrc === 'string' ? imageSrc : null) || imagePreview.value;
    if (!image) return;

    isProcessing.value = true;
    progress.value = 0;
    extractedText.value = '';
    errorMessage.value = '';

    try {
        const result = await Tesseract.recognize(image, selectedLanguage.value, {
            logger: (m) => {
                if (m.status === 'recognizing text') {
                    progress.value = Math.round(m.progress * 100);
                }
            },
        });
        extractedText.value = result.data.text;
    } catch (err) {
        errorMessage.value = 'OCR failed: ' + err;
    } finally {
        isProcessing.value = false;
        progress.value = 0;
    }
};

// Utilities
const copyText = async () => {
    try {
        await navigator.clipboard.writeText(extractedText.value);
        // Optional: show toast
    } catch (err) {
        errorMessage.value = 'Failed to copy text' + err;
    }
};

const clearAll = () => {
    extractedText.value = '';
    selectedFile.value = null;
    imagePreview.value = '';
    capturedImage.value = '';
    errorMessage.value = '';
    stopCamera();
};

// Cleanup
onUnmounted(() => {
    stopCamera();
});
</script>

<style scoped lang="scss">
.ocr-scanner {
    max-width: 800px;
    margin: 0 auto;
    padding: 24px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);

    &__header {
        margin-bottom: 24px;
        text-align: center;
    }

    &__title {
        margin: 0 0 8px;
        font-size: 28px;
        font-weight: 700;
        color: #1a1a1a;
    }

    &__subtitle {
        margin: 0;
        font-size: 16px;
        color: #6b7280;
    }

    &__tabs {
        display: flex;
        gap: 8px;
        margin-bottom: 24px;
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 8px;
    }

    &__tab {
        padding: 12px 24px;
        font-size: 16px;
        font-weight: 600;
        color: #6b7280;
        background: transparent;
        border: none;
        border-radius: 8px 8px 0 0;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
            color: #4b5563;
            background: #f9fafb;
        }

        &--active {
            color: #2563eb;
            background: #eff6ff;
            border-bottom: 2px solid #2563eb;
        }
    }

    &__content {
        margin-bottom: 32px;
    }

    &__upload,
    &__camera {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }

    &__dropzone {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 48px 24px;
        border: 2px dashed #d1d5db;
        border-radius: 12px;
        background: #f9fafb;
        transition: all 0.2s;
        cursor: pointer;

        &:hover {
            border-color: #2563eb;
            background: #eff6ff;
        }

        &--dragover {
            border-color: #2563eb;
            background: #dbeafe;
        }
    }

    &__file-input {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
    }

    &__dropzone-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        pointer-events: none;
    }

    &__dropzone-icon {
        width: 64px;
        height: 64px;
        color: #9ca3af;
    }

    &__dropzone-text {
        margin: 0;
        font-size: 18px;
        color: #4b5563;
    }

    &__dropzone-link {
        color: #2563eb;
        text-decoration: underline;
    }

    &__dropzone-hint {
        margin: 0;
        font-size: 14px;
        color: #6b7280;
    }

    &__preview {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
    }

    &__preview-image {
        max-width: 100%;
        max-height: 400px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    &__preview-actions {
        display: flex;
        gap: 12px;
    }

    &__camera-setup,
    &__camera-active {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
    }

    &__camera-text {
        margin: 0;
        font-size: 18px;
        color: #4b5563;
    }

    &__camera-video {
        width: 100%;
        max-height: 400px;
        border-radius: 12px;
        background: #000;
    }

    &__camera-controls {
        display: flex;
        gap: 12px;
    }

    &__button {
        padding: 12px 24px;
        font-size: 16px;
        font-weight: 600;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;

        &--primary {
            color: #fff;
            background: #2563eb;

            &:hover {
                background: #1d4ed8;
            }

            &:disabled {
                background: #93c5fd;
                cursor: not-allowed;
            }
        }

        &--secondary {
            color: #374151;
            background: #f3f4f6;
            border: 1px solid #d1d5db;

            &:hover {
                background: #e5e7eb;
            }
        }
    }

    &__processing {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        padding: 32px;
        margin-bottom: 24px;
        background: #f9fafb;
        border-radius: 12px;
    }

    &__processing-spinner {
        width: 48px;
        height: 48px;
        border: 4px solid #e5e7eb;
        border-top-color: #2563eb;
        border-radius: 50%;
        animation: spin 1s linear infinite;

        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    }

    &__processing-text {
        margin: 0;
        font-size: 18px;
        color: #4b5563;
    }

    &__results {
        margin-bottom: 24px;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        overflow: hidden;
    }

    &__results-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 24px;
        background: #f9fafb;
        border-bottom: 1px solid #e5e7eb;
    }

    &__results-title {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
        color: #1a1a1a;
    }

    &__results-actions {
        display: flex;
        gap: 12px;
    }

    &__results-textarea {
        width: 100%;
        padding: 20px 24px;
        font-size: 16px;
        line-height: 1.6;
        color: #1a1a1a;
        background: #fff;
        border: none;
        resize: vertical;
        outline: none;

        &:focus {
            box-shadow: inset 0 0 0 2px #2563eb;
        }
    }

    &__results-stats {
        display: flex;
        gap: 24px;
        padding: 16px 24px;
        background: #f9fafb;
        border-top: 1px solid #e5e7eb;
    }

    &__results-stat {
        font-size: 14px;
        color: #6b7280;
    }

    &__error {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 24px;
        margin-bottom: 24px;
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 8px;
        color: #991b1b;
    }

    &__error-text {
        margin: 0;
        font-size: 16px;
    }

    &__language {
        display: flex;
        align-items: center;
        gap: 12px;
        padding-top: 24px;
        border-top: 1px solid #e5e7eb;
    }

    &__language-label {
        font-size: 16px;
        font-weight: 600;
        color: #4b5563;
    }

    &__language-select {
        padding: 8px 16px;
        font-size: 16px;
        color: #1a1a1a;
        background: #fff;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        cursor: pointer;

        &:disabled {
            background: #f3f4f6;
            cursor: not-allowed;
        }
    }
}
</style>
