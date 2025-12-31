# React Native Torch - Expo Plugin

An Expo config plugin for [react-native-torch](../README.md) that automatically configures the necessary permissions and usage descriptions for torch/flashlight functionality on both iOS and Android platforms.

## 🚀 Quick Start

### Installation

The plugin is included with the main `react-native-torch` package, no separate installation needed:

```bash
npm install react-native-torch
```

### Basic Usage

Add the plugin to your `app.config.js` or `app.json`:

```javascript
export default {
  expo: {
    plugins: ["react-native-torch"]
  }
}
```

## 📋 Configuration Options

### Advanced Configuration

```javascript
export default {
  expo: {
    plugins: [
      [
        "react-native-torch",
        {
          // Custom camera usage description for iOS (required)
          cameraUsageDescription: "This app uses the camera to control the device flashlight for enhanced user experience.",
          
          // Whether camera feature is required (affects app store compatibility)
          requireCamera: false,
          
          // Whether camera flash is required
          requireCameraFlash: false,
          
          // Enable specific permissions (both true by default)
          enableCameraPermission: true,
          enableFlashlightPermission: true
        }
      ]
    ]
  }
}
```

### Configuration Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `cameraUsageDescription` | `string` | `"This app needs access to camera to control the flashlight/torch functionality."` | iOS camera usage description shown in permission dialog |
| `enableCameraPermission` | `boolean` | `true` | Whether to add CAMERA permission to Android manifest |
| `enableFlashlightPermission` | `boolean` | `true` | Whether to add FLASHLIGHT permission to Android manifest |
| `requireCamera` | `boolean` | `false` | Whether camera hardware is required for app to function |
| `requireCameraFlash` | `boolean` | `false` | Whether camera flash hardware is required for app to function |

## 🎯 What This Plugin Does

### iOS Configuration

- Adds `NSCameraUsageDescription` to `Info.plist` with your custom message
- Required for apps that access camera/torch functionality

### Android Configuration

- Adds `android.permission.CAMERA` permission to AndroidManifest.xml
- Adds `android.permission.FLASHLIGHT` permission to AndroidManifest.xml
- Configures hardware feature requirements:
  - `android.hardware.camera` (optional by default)
  - `android.hardware.camera.flash` (optional by default)

## 📱 Platform Support

### iOS
- Automatically handles permission requests through system dialogs
- Uses `NSCameraUsageDescription` for permission explanation
- Compatible with iOS 11.0+

### Android
- Adds required permissions to manifest
- Supports custom permission dialogs in the library
- Compatible with Android API Level 23+

## 🔧 Common Use Cases

### App Store Optimization

If you want your app to be installable on devices without camera/flash:

```javascript
{
  "plugins": [
    [
      "react-native-torch",
      {
        "requireCamera": false,
        "requireCameraFlash": false
      }
    ]
  ]
}
```

### Enhanced Privacy Description

Provide a detailed explanation for iOS users:

```javascript
{
  "plugins": [
    [
      "react-native-torch",
      {
        "cameraUsageDescription": "Our app provides a convenient flashlight feature that uses your device's camera flash. We don't take photos or record videos - this permission is solely for controlling the flashlight functionality."
      }
    ]
  ]
}
```

### Security-Focused App

For apps that require specific hardware:

```javascript
{
  "plugins": [
    [
      "react-native-torch",
      {
        "requireCamera": true,
        "requireCameraFlash": true,
        "cameraUsageDescription": "This security app requires camera access for emergency flashlight functionality."
      }
    ]
  ]
}
```

## 🚨 Important Notes

### Permission Requirements

- **iOS**: Camera permission is automatically requested when torch is first used
- **Android**: Camera permission must be granted before using torch functionality
- The library handles permission requests, but the plugin ensures proper manifest setup

### Hardware Requirements

Setting `requireCamera` or `requireCameraFlash` to `true` will:
- Prevent installation on devices without the required hardware
- May reduce your app's potential audience
- Use `false` (default) for better compatibility

### App Store Guidelines

- Provide clear, honest descriptions in `cameraUsageDescription`
- Explain specifically why camera access is needed for flashlight functionality
- Avoid generic messages that might confuse users

## 🔍 Troubleshooting

### Plugin Not Working

1. Ensure you're using Expo SDK 49+
2. Run `expo prebuild` to regenerate native projects
3. Clean and rebuild your app

### Permission Issues

1. Check that the plugin is properly configured in `app.config.js`
2. Verify the generated `Info.plist` (iOS) and `AndroidManifest.xml` (Android)
3. Ensure you're testing on a physical device (emulators may not have torch)

### Build Errors

1. Run `npx expo install --fix` to resolve dependency conflicts
2. Clear Expo cache: `npx expo start --clear`
3. Check that all peer dependencies are properly installed

## 📚 Related Documentation

- [React Native Torch Main Documentation](../README.md)
- [Expo Config Plugins Documentation](https://docs.expo.dev/guides/config-plugins/)
- [React Native Permissions](https://reactnative.dev/docs/permissions)

## 🤝 Contributing

Issues and pull requests are welcome! Please see the main [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](../LICENSE) for details.