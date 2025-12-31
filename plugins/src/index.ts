import { type ConfigPlugin } from '@expo/config-plugins'
import { type TorchAndroidProps, withAndroidConfiguration } from './withAndroid'
import { type TorchIOSProps, withIosConfiguration } from './withIos'

/**
 * Configuration options for the react-native-torch Expo plugin.
 */
export type TorchPluginOptions = TorchIOSProps & TorchAndroidProps

/**
 * Expo config plugin for react-native-torch.
 *
 * This plugin automatically configures the necessary permissions and usage descriptions
 * for torch/flashlight functionality on both iOS and Android platforms.
 *
 * @example Basic usage:
 * ```json
 * {
 *   "plugins": ["react-native-torch"]
 * }
 * ```
 *
 * @example With custom configuration:
 * ```json
 * {
 *   "plugins": [
 *     [
 *       "react-native-torch",
 *       {
 *         "cameraUsageDescription": "We need camera access for the flashlight feature",
 *         "requireCameraFlash": true
 *       }
 *     ]
 *   ]
 * }
 * ```
 */
const withTorch: ConfigPlugin<TorchPluginOptions | undefined> = (
  config,
  props = {}
) => {
  // Apply Android configurations
  config = withAndroidConfiguration(config, props)

  // Apply iOS configurations
  config = withIosConfiguration(config, props)

  return config
}

export default withTorch

// Re-export types for convenience
export type { TorchAndroidProps, TorchIOSProps }
