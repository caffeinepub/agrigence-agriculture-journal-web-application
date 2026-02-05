/**
 * Client-side image optimization utility
 * Resizes and compresses images before upload
 */

interface OptimizationResult {
  bytes: Uint8Array<ArrayBuffer>;
  originalSize: number;
  optimizedSize: number;
  width: number;
  height: number;
  format: string;
}

interface OptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  targetFormat?: 'webp' | 'jpeg' | 'png';
}

export async function optimizeImage(
  file: File,
  options: OptimizationOptions = {}
): Promise<OptimizationResult> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.85,
    targetFormat = 'webp',
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) {
        reject(new Error('Failed to read file'));
        return;
      }
      img.src = e.target.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));

    img.onload = () => {
      try {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          
          if (width > height) {
            width = Math.min(width, maxWidth);
            height = Math.round(width / aspectRatio);
          } else {
            height = Math.min(height, maxHeight);
            width = Math.round(height * aspectRatio);
          }
        }

        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Use better image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Try to convert to target format
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create blob'));
              return;
            }

            blob.arrayBuffer().then((arrayBuffer) => {
              const bytes = new Uint8Array(arrayBuffer) as Uint8Array<ArrayBuffer>;
              
              resolve({
                bytes,
                originalSize: file.size,
                optimizedSize: bytes.length,
                width,
                height,
                format: targetFormat,
              });
            }).catch(reject);
          },
          `image/${targetFormat}`,
          quality
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));

    reader.readAsDataURL(file);
  });
}

/**
 * Optimize image with fallback to original if optimization fails
 */
export async function optimizeImageWithFallback(
  file: File,
  options: OptimizationOptions = {}
): Promise<{ bytes: Uint8Array<ArrayBuffer>; wasOptimized: boolean; message?: string }> {
  try {
    const result = await optimizeImage(file, options);
    
    // Only use optimized version if it's actually smaller
    if (result.optimizedSize < result.originalSize) {
      return {
        bytes: result.bytes,
        wasOptimized: true,
      };
    } else {
      // Original is smaller, use it instead
      const arrayBuffer = await file.arrayBuffer();
      return {
        bytes: new Uint8Array(arrayBuffer) as Uint8Array<ArrayBuffer>,
        wasOptimized: false,
        message: 'Original file was already optimized',
      };
    }
  } catch (error) {
    // Fallback to original file
    const arrayBuffer = await file.arrayBuffer();
    return {
      bytes: new Uint8Array(arrayBuffer) as Uint8Array<ArrayBuffer>,
      wasOptimized: false,
      message: `Optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
