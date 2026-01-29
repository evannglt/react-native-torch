# React Native Torch

[![npm version](https://badge.fury.io/js/react-native-torch.svg)](https://badge.fury.io/js/react-native-torch)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

A modern, high-performance React Native library for controlling device torch/flashlight functionality. Built with Nitro Modules for optimal performance and comprehensive TypeScript support.

## ✨ Features

- 🚀 **High Performance**: Built with Nitro Modules for native-level performance
- 📱 **Cross Platform**: Works on both iOS and Android
- 🔒 **Permission Handling**: Comprehensive camera permission management
- 🎯 **TypeScript**: Full TypeScript support with detailed type definitions
- 📋 **Expo Compatible**: Includes Expo config plugin for automatic setup
- 🛡️ **Error Handling**: Structured error handling with specific error codes
- ⚡ **Modern API**: Promise-based API with async/await support
- 🔧 **Easy Setup**: Automatic linking with React Native autolinking

## 📋 Requirements

- React Native 0.70+
- iOS 11.0+
- Android API Level 23+
- Camera permission (handled automatically)

### iOS Setup

For iOS, you need to add camera usage description to your `Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>This app needs camera access to control the flashlight.</string>
```

### Android Setup

The required permissions are automatically added, but ensure your `android/app/src/main/AndroidManifest.xml` includes:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.FLASHLIGHT" />
```

### Expo Setup (Automatic)

If you're using Expo, add the plugin to your `app.config.js`:

```javascript
export default {
  expo: {
    plugins: [
      [
        "react-native-torch",
        {
          cameraUsageDescription: "This app needs camera access for flashlight functionality"
        }
      ]
    ]
  }
}
```

## 🛠️ Platform-Specific Notes

### iOS

- Requires iOS 11.0+
- Uses `AVCaptureDevice` for torch control
- Camera permission handled automatically by system
- `NSCameraUsageDescription` required in Info.plist

### Android

- Requires API Level 23+
- Uses Camera2 API for modern devices
- Manual permission handling with custom dialogs
- Both `CAMERA` and `FLASHLIGHT` permissions required

## 🔍 Troubleshooting

### Common Issues

#### "Camera permission denied"
- Ensure you've added the proper usage descriptions
- Check if user manually disabled camera permission in settings
- Use `requestCameraPermission()` before torch operations

#### "Torch not available"
- Device may not have a flashlight
- Camera may be in use by another application
- Check `isTorchAvailable()` before using torch functions

#### "Configuration failed"
- Hardware-level error
- Try restarting the app or device
- May occur on older/emulated devices

### Debug Mode

Enable detailed logging in development:

```typescript
import { RNTorchModule } from 'react-native-torch';

// Enable development logging
if (__DEV__) {
  console.log('Torch module loaded:', RNTorchModule);
}
```

## 📝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the plugin: `npm run build-plugin`
4. Generate specs: `npm run specs`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Nitro Modules](https://github.com/mrousavy/nitro) for optimal performance
- Inspired by the original [react-native-torch](https://github.com/ludo/react-native-torch) library
- Thanks to the React Native community for continuous support

## 📞 Support

- 🐛 [Report Issues](https://github.com/evannglt/react-native-torch/issues)
- 💬 [Discussions](https://github.com/evannglt/react-native-torch/discussions)
- 📧 [Contact](mailto:evann.guillot@yahoo.com)

---

Made with ❤️ by [evannglt](https://github.com/evannglt)
