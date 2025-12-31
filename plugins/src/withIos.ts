import { type ConfigPlugin, withInfoPlist } from '@expo/config-plugins'

export type TorchIOSProps = {
  /**
   * Custom message for iOS camera usage description.
   * This will be shown when the app requests camera access.
   */
  cameraUsageDescription?: string
}

const DEFAULT_IOS_USAGE_DESCRIPTION =
  'This app needs access to camera to control the flashlight/torch functionality.'

/**
 * Add iOS camera usage description to Info.plist.
 * This is required for apps that access the camera/torch on iOS.
 */
export const withIosConfiguration: ConfigPlugin<TorchIOSProps> = (
  config,
  props = {}
) => {
  return withInfoPlist(config, (infoPlist) => {
    // Set NSCameraUsageDescription for camera access
    infoPlist.modResults.NSCameraUsageDescription =
      props.cameraUsageDescription ?? DEFAULT_IOS_USAGE_DESCRIPTION

    // Log configuration for debugging
    console.log(
      '✅ [react-native-torch] iOS camera usage description configured'
    )

    return infoPlist
  })
}
