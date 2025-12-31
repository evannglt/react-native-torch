import { type ConfigPlugin, withAndroidManifest } from '@expo/config-plugins'

export type TorchAndroidProps = {
  /**
   * Whether to add the camera permission to Android manifest.
   * @default true
   */
  enableCameraPermission?: boolean

  /**
   * Whether to add the flashlight permission to Android manifest.
   * @default true
   */
  enableFlashlightPermission?: boolean

  /**
   * Whether the camera feature is required for the app to function.
   * If false, the app can still be installed on devices without camera.
   * @default false
   */
  requireCamera?: boolean

  /**
   * Whether the camera flash feature is required for the app to function.
   * If false, the app can still be installed on devices without camera flash.
   * @default false
   */
  requireCameraFlash?: boolean
}

const DEFAULT_ANDROID_OPTIONS: Required<TorchAndroidProps> = {
  enableCameraPermission: true,
  enableFlashlightPermission: true,
  requireCamera: false,
  requireCameraFlash: false,
}

/**
 * Add Android camera and flashlight permissions to AndroidManifest.xml.
 * Also configures hardware feature requirements.
 */
export const withAndroidConfiguration: ConfigPlugin<TorchAndroidProps> = (
  config,
  props = {}
) => {
  const androidOptions = { ...DEFAULT_ANDROID_OPTIONS, ...props }
  const {
    enableCameraPermission,
    enableFlashlightPermission,
    requireCamera,
    requireCameraFlash,
  } = androidOptions

  return withAndroidManifest(config, (manifest) => {
    const androidManifest = manifest.modResults

    // Get or create uses-permission array
    if (!androidManifest.manifest['uses-permission']) {
      androidManifest.manifest['uses-permission'] = []
    }

    // Get or create uses-feature array
    if (!androidManifest.manifest['uses-feature']) {
      androidManifest.manifest['uses-feature'] = []
    }

    const usesPermissions = androidManifest.manifest['uses-permission']
    const usesFeatures = androidManifest.manifest['uses-feature']

    // Add camera permission if enabled
    if (enableCameraPermission) {
      const cameraPermissionExists = usesPermissions.some(
        (permission) =>
          permission.$['android:name'] === 'android.permission.CAMERA'
      )

      if (!cameraPermissionExists) {
        usesPermissions.push({
          $: {
            'android:name': 'android.permission.CAMERA',
          },
        })
        console.log('✅ [react-native-torch] Added CAMERA permission')
      }
    }

    // Add flashlight permission if enabled
    if (enableFlashlightPermission) {
      const flashlightPermissionExists = usesPermissions.some(
        (permission) =>
          permission.$['android:name'] === 'android.permission.FLASHLIGHT'
      )

      if (!flashlightPermissionExists) {
        usesPermissions.push({
          $: {
            'android:name': 'android.permission.FLASHLIGHT',
          },
        })
        console.log('✅ [react-native-torch] Added FLASHLIGHT permission')
      }
    }

    // Add camera hardware feature requirement
    const cameraFeatureExists = usesFeatures.some(
      (feature) => feature.$['android:name'] === 'android.hardware.camera'
    )

    if (!cameraFeatureExists) {
      usesFeatures.push({
        $: {
          'android:name': 'android.hardware.camera',
          'android:required': requireCamera ? 'true' : 'false',
        },
      })
      console.log(
        `✅ [react-native-torch] Added camera hardware feature (required: ${requireCamera})`
      )
    }

    // Add camera flash hardware feature requirement
    const flashFeatureExists = usesFeatures.some(
      (feature) => feature.$['android:name'] === 'android.hardware.camera.flash'
    )

    if (!flashFeatureExists) {
      usesFeatures.push({
        $: {
          'android:name': 'android.hardware.camera.flash',
          'android:required': requireCameraFlash ? 'true' : 'false',
        },
      })
      console.log(
        `✅ [react-native-torch] Added camera flash hardware feature (required: ${requireCameraFlash})`
      )
    }

    return manifest
  })
}
