import { NitroModules } from 'react-native-nitro-modules'
import type { RNTorch, TorchError, TorchErrorCode } from './specs/RNTorch.nitro'

/**
 * React Native Torch Module
 *
 * A high-performance Nitro-powered module for controlling device torch/flashlight functionality
 * with comprehensive permission handling and error management.
 *
 * @example Basic usage:
 * ```typescript
 * import RNTorchModule from 'react-native-torch';
 *
 * // Check availability first
 * const isAvailable = await RNTorchModule.isTorchAvailable();
 * if (isAvailable) {
 *   // Turn on torch
 *   await RNTorchModule.switchState(true);
 * }
 * ```
 *
 * @example With error handling:
 * ```typescript
 * import RNTorchModule, { TorchErrorCode } from 'react-native-torch';
 *
 * try {
 *   await RNTorchModule.switchState(true);
 * } catch (error) {
 *   if (error.code === TorchErrorCode.PERMISSION_DENIED) {
 *     // Handle permission denied
 *   } else if (error.code === TorchErrorCode.TORCH_NOT_AVAILABLE) {
 *     // Handle device without torch
 *   }
 * }
 * ```
 */
export const RNTorchModule = NitroModules.createHybridObject<RNTorch>('RNTorch')

/**
 * Convenience function to safely toggle torch state with automatic availability check.
 *
 * @param enabled - Whether to turn the torch on (true) or off (false)
 * @param options - Optional configuration options
 * @returns Promise<boolean> - true if operation succeeded, false if torch unavailable
 *
 * @example
 * ```typescript
 * import { toggleTorch } from 'react-native-torch';
 *
 * const success = await toggleTorch(true);
 * if (!success) {
 *   console.log('Torch not available or permission denied');
 * }
 * ```
 */
export async function toggleTorch(
  enabled: boolean,
  options?: { intensity?: number; shouldRequestPermission?: boolean }
): Promise<boolean> {
  try {
    // Check if torch is available
    const isAvailable = await RNTorchModule.isTorchAvailable()
    if (!isAvailable) {
      return false
    }

    // Request permission if needed (mainly for Android)
    if (options?.shouldRequestPermission ?? true) {
      const hasPermission = await RNTorchModule.requestCameraPermission(
        'Camera Permission Required',
        'This app needs camera access to control the flashlight.'
      )
      if (!hasPermission) {
        return false
      }
    }

    // Switch torch state
    await RNTorchModule.switchState(enabled, options?.intensity)
    return true
  } catch (error) {
    console.warn('[react-native-torch] Failed to toggle torch:', error)
    return false
  }
}

/**
 * Convenience function to set the torch intensity.
 *
 * @param intensity - The intensity level (0.0 to 1.0)
 * @param shouldRequestPermission - Whether to request permission if needed (default: true)
 * @returns Promise<boolean> - true if torch was turned on successfully
 *
 * @example
 * ```typescript
 * import { setTorchIntensity } from 'react-native-torch';
 *
 * const success = await setTorchIntensity(0.5);
 * console.log(success ? 'Torch intensity set' : 'Failed to set torch intensity');
 * ```
 */
export async function setTorchIntensity(
  intensity: number,
  shouldRequestPermission: boolean = true
): Promise<boolean> {
  return toggleTorch(true, { intensity, shouldRequestPermission })
}

/**
 * Convenience function to get the current torch intensity level.
 *
 * @returns Promise<number> - The current torch intensity level (0.0 to 1.0)
 *
 * @example
 * ```typescript
 * import { getTorchIntensity } from 'react-native-torch';
 *
 * const intensity = await getTorchIntensity();
 * console.log(`Current torch intensity: ${intensity}`);
 * ```
 */
export async function getTorchIntensity(): Promise<number> {
  return RNTorchModule.getIntensity()
}

/**
 * Convenience function to turn on the torch with automatic checks.
 *
 * @param shouldRequestPermission - Whether to request permission if needed (default: true)
 * @returns Promise<boolean> - true if torch was turned on successfully
 *
 * @example
 * ```typescript
 * import { turnOnTorch } from 'react-native-torch';
 *
 * const success = await turnOnTorch();
 * console.log(success ? 'Torch is on' : 'Failed to turn on torch');
 * ```
 */
export async function turnOnTorch(
  shouldRequestPermission: boolean = true
): Promise<boolean> {
  return toggleTorch(true, { shouldRequestPermission })
}

/**
 * Convenience function to turn off the torch with automatic checks.
 *
 * @returns Promise<boolean> - true if torch was turned off successfully
 *
 * @example
 * ```typescript
 * import { turnOffTorch } from 'react-native-torch';
 *
 * const success = await turnOffTorch();
 * console.log(success ? 'Torch is off' : 'Failed to turn off torch');
 * ```
 */
export async function turnOffTorch(): Promise<boolean> {
  return toggleTorch(false, { shouldRequestPermission: false }) // No permission check needed for turning off
}

/**
 * Check if the device supports torch/flashlight functionality.
 *
 * @returns Promise<boolean> - true if torch is supported and available
 *
 * @example
 * ```typescript
 * import { isTorchSupported } from 'react-native-torch';
 *
 * if (await isTorchSupported()) {
 *   // Show torch controls in UI
 * }
 * ```
 */
export async function isTorchSupported(): Promise<boolean> {
  try {
    return await RNTorchModule.isTorchAvailable()
  } catch (error) {
    console.warn('[react-native-torch] Error checking torch support:', error)
    return false
  }
}

/**
 * Request camera permission with custom dialog text.
 *
 * @param title - Title for permission dialog (Android only)
 * @param message - Message explaining why permission is needed (Android only)
 * @returns Promise<boolean> - true if permission granted
 *
 * @example
 * ```typescript
 * import { requestPermission } from 'react-native-torch';
 *
 * const granted = await requestPermission(
 *   'Flashlight Access',
 *   'We need camera permission to control your flashlight.'
 * );
 * ```
 */
export async function requestPermission(
  title: string = 'Camera Permission Required',
  message: string = 'This app needs camera access to control the flashlight.'
): Promise<boolean> {
  try {
    return await RNTorchModule.requestCameraPermission(title, message)
  } catch (error) {
    console.warn('[react-native-torch] Error requesting permission:', error)
    return false
  }
}

/**
 * Get the current state of the torch.
 *
 * @returns Promise<boolean> - true if torch is currently on
 *
 * @example
 * ```typescript
 * import { getTorchState } from 'react-native-torch';
 *
 * const isOn = await getTorchState();
 * console.log(`Torch is ${isOn ? 'on' : 'off'}`);
 * ```
 */
export async function getTorchState(): Promise<boolean> {
  try {
    return await RNTorchModule.getTorchState()
  } catch (error) {
    console.warn('[react-native-torch] Error getting torch state:', error)
    return false
  }
}

/**
 * Utility function to create a torch error with proper typing.
 *
 * @param code - The error code
 * @param message - The error message
 * @param details - Additional error details
 * @returns TorchError object
 *
 * @internal
 */
export function createTorchError(
  code: TorchErrorCode,
  message: string,
  details?: string
): TorchError {
  const error = new Error(message) as TorchError
  error.code = code
  error.details = details
  return error
}

// Export types for use by consumers
export type { RNTorch, TorchError } from './specs/RNTorch.nitro'

// Re-export error codes for convenience
export { TorchErrorCode } from './specs/RNTorch.nitro'

// Default export for convenience (keeping legacy Torch name for backward compatibility)
export default RNTorchModule
