import type { HybridObject } from 'react-native-nitro-modules'

/**
 * A HybridObject for controlling the device's torch (flashlight) functionality.
 *
 * This module provides cross-platform access to the device's torch/flashlight,
 * with proper permission handling and error management.
 *
 * @example
 * ```typescript
 * import { RNTorchModule } from 'react-native-torch';
 *
 * // Check if torch is available
 * const isAvailable = await RNTorchModule.isTorchAvailable();
 * if (isAvailable) {
 *   // Turn on the torch
 *   await RNTorchModule.switchState(true);
 *
 *   // Turn off the torch
 *   await RNTorchModule.switchState(false);
 * }
 * ```
 */
export interface RNTorch extends HybridObject<{
  ios: 'swift'
  android: 'kotlin'
}> {
  /**
   * Switch the torch (flashlight) on or off.
   *
   * On iOS, this requires camera access permissions which are handled automatically
   * by the system when first accessed.
   *
   * On Android, this requires CAMERA and FLASHLIGHT permissions. Use requestCameraPermission()
   * to handle permission requests properly.
   *
   * @param enabled - true to turn on the torch, false to turn it off
   * @throws {Error} TorchError.DEVICE_NOT_AVAILABLE - Camera device is not available
   * @throws {Error} TorchError.TORCH_NOT_AVAILABLE - Torch is not available on this device
   * @throws {Error} TorchError.PERMISSION_DENIED - Camera permission denied
   * @throws {Error} TorchError.CONFIGURATION_FAILED - Failed to configure torch
   * @returns Promise that resolves when the torch state has been changed
   *
   * @example
   * ```typescript
   * try {
   *   await RNTorchModule.switchState(true);
   *   console.log('Torch turned on successfully');
   * } catch (error) {
   *   console.error('Failed to control torch:', error.message);
   * }
   * ```
   */
  switchState(enabled: boolean): Promise<void>

  /**
   * Request camera permission with a custom dialog.
   *
   * On iOS, this checks the current camera permission status and requests access
   * if not already granted. The title and message parameters are ignored on iOS
   * as the system handles the permission dialog.
   *
   * On Android, this shows a custom permission dialog if the user has previously
   * denied permission and shouldShowRequestPermissionRationale returns true.
   *
   * @param title - Title for the permission dialog (Android only, ignored on iOS)
   * @param message - Message explaining why camera permission is needed (Android only, ignored on iOS)
   * @returns Promise that resolves to true if permission is granted, false if denied
   *
   * @example
   * ```typescript
   * const hasPermission = await RNTorchModule.requestCameraPermission(
   *   'Camera Permission Required',
   *   'This app needs camera access to control the flashlight.'
   * );
   *
   * if (hasPermission) {
   *   await RNTorchModule.switchState(true);
   * } else {
   *   console.log('Camera permission denied');
   * }
   * ```
   */
  requestCameraPermission(title: string, message: string): Promise<boolean>

  /**
   * Check if the torch/flashlight is available on the current device.
   *
   * This method checks for the presence of a camera with flash capability.
   * It's recommended to call this before attempting to use torch functionality.
   *
   * @returns Promise that resolves to true if torch is available, false otherwise
   *
   * @example
   * ```typescript
   * const isAvailable = await RNTorchModule.isTorchAvailable();
   * if (!isAvailable) {
   *   console.log('Torch not available on this device');
   *   return;
   * }
   *
   * // Safe to use torch functions
   * await RNTorchModule.switchState(true);
   * ```
   */
  isTorchAvailable(): Promise<boolean>

  /**
   * Get the current torch state.
   *
   * This method returns the current state of the torch without modifying it.
   * Useful for maintaining UI state consistency.
   *
   * @returns Promise that resolves to true if torch is currently on, false otherwise
   *
   * @example
   * ```typescript
   * const isOn = await RNTorchModule.getTorchState();
   * console.log(`Torch is currently ${isOn ? 'on' : 'off'}`);
   * ```
   */
  getTorchState(): Promise<boolean>
}

/**
 * Error codes that can be thrown by the RNTorch module.
 * These provide structured error handling for different failure scenarios.
 */
export enum TorchErrorCode {
  /** Camera device is not available or accessible */
  DEVICE_NOT_AVAILABLE = 'DEVICE_NOT_AVAILABLE',

  /** Torch/flashlight is not available on this device */
  TORCH_NOT_AVAILABLE = 'TORCH_NOT_AVAILABLE',

  /** Camera permission has been denied */
  PERMISSION_DENIED = 'PERMISSION_DENIED',

  /** Failed to configure the torch (hardware error) */
  CONFIGURATION_FAILED = 'CONFIGURATION_FAILED',

  /** The torch is currently in use by another application */
  TORCH_IN_USE = 'TORCH_IN_USE',

  /** Platform not supported */
  PLATFORM_NOT_SUPPORTED = 'PLATFORM_NOT_SUPPORTED',
}

/**
 * Structured error class for torch-related errors.
 * Provides additional context and error codes for better error handling.
 */
export interface TorchError extends Error {
  /** The specific error code indicating the type of failure */
  code: TorchErrorCode

  /** Human-readable error message */
  message: string

  /** Additional context or underlying error details */
  details?: string
}
