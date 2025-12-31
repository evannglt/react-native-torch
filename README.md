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

## 📦 Installation

### Using npm

```bash
npm install react-native-torch
```

### Using yarn

```bash
yarn add react-native-torch
```

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

## 🚀 Quick Start

```typescript
import React, { useState, useEffect } from 'react';
import { View, Button, Alert } from 'react-native';
import { RNTorchModule, TorchErrorCode } from 'react-native-torch';

const TorchExample = () => {
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    checkTorchAvailability();
  }, []);

  const checkTorchAvailability = async () => {
    try {
      const available = await RNTorchModule.isTorchAvailable();
      setIsAvailable(available);
    } catch (error) {
      console.warn('Error checking torch availability:', error);
    }
  };

  const toggleTorch = async () => {
    try {
      // Request permission if needed
      const hasPermission = await RNTorchModule.requestCameraPermission(
        'Camera Permission Required',
        'This app needs camera access to control the flashlight.'
      );

      if (!hasPermission) {
        Alert.alert('Permission denied', 'Camera permission is required for flashlight functionality.');
        return;
      }

      // Toggle torch state
      const newState = !isTorchOn;
      await RNTorchModule.switchState(newState);
      setIsTorchOn(newState);

    } catch (error) {
      if (error.code === TorchErrorCode.TORCH_NOT_AVAILABLE) {
        Alert.alert('Error', 'Flashlight not available on this device');
      } else if (error.code === TorchErrorCode.PERMISSION_DENIED) {
        Alert.alert('Error', 'Camera permission denied');
      } else {
        Alert.alert('Error', `Failed to control flashlight: ${error.message}`);
      }
    }
  };

  if (!isAvailable) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button title="Flashlight not available" disabled />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title={isTorchOn ? 'Turn Off Flashlight' : 'Turn On Flashlight'}
        onPress={toggleTorch}
      />
    </View>
  );
};

export default TorchExample;
```

## 📖 API Reference

### `RNTorchModule`

The main module providing torch functionality.

#### Methods

##### `switchState(enabled: boolean): Promise<void>`

Switch the torch on or off.

- **Parameters:**
  - `enabled`: `boolean` - `true` to turn on, `false` to turn off
- **Returns:** `Promise<void>`
- **Throws:** `TorchError` with specific error codes

```typescript
// Turn on torch
await RNTorchModule.switchState(true);

// Turn off torch
await RNTorchModule.switchState(false);
```

##### `isTorchAvailable(): Promise<boolean>`

Check if torch is available on the device.

- **Returns:** `Promise<boolean>` - `true` if available

```typescript
const isAvailable = await RNTorchModule.isTorchAvailable();
console.log('Torch available:', isAvailable);
```

##### `getTorchState(): Promise<boolean>`

Get the current torch state.

- **Returns:** `Promise<boolean>` - `true` if torch is on

```typescript
const isOn = await RNTorchModule.getTorchState();
console.log('Torch is currently:', isOn ? 'on' : 'off');
```

##### `requestCameraPermission(title: string, message: string): Promise<boolean>`

Request camera permission with custom dialog (Android) or check permission status (iOS).

- **Parameters:**
  - `title`: `string` - Dialog title (Android only)
  - `message`: `string` - Permission explanation (Android only)
- **Returns:** `Promise<boolean>` - `true` if permission granted

```typescript
const hasPermission = await RNTorchModule.requestCameraPermission(
  'Camera Permission',
  'We need camera access for flashlight functionality'
);
```

### Convenience Functions

#### `toggleTorch(enabled: boolean, requestPermission?: boolean): Promise<boolean>`

Safely toggle torch with automatic availability and permission checks.

```typescript
import { toggleTorch } from 'react-native-torch';

const success = await toggleTorch(true);
if (success) {
  console.log('Torch turned on successfully');
}
```

#### `turnOnTorch(requestPermission?: boolean): Promise<boolean>`

Turn on torch with safety checks.

```typescript
import { turnOnTorch } from 'react-native-torch';

const success = await turnOnTorch();
```

#### `turnOffTorch(): Promise<boolean>`

Turn off torch safely.

```typescript
import { turnOffTorch } from 'react-native-torch';

const success = await turnOffTorch();
```

#### `isTorchSupported(): Promise<boolean>`

Check if device supports torch functionality.

```typescript
import { isTorchSupported } from 'react-native-torch';

if (await isTorchSupported()) {
  // Show torch controls
}
```

### Error Handling

The library provides structured error handling with specific error codes:

```typescript
import { RNTorchModule, TorchErrorCode } from 'react-native-torch';

try {
  await RNTorchModule.switchState(true);
} catch (error) {
  switch (error.code) {
    case TorchErrorCode.DEVICE_NOT_AVAILABLE:
      console.log('Camera device not available');
      break;
    case TorchErrorCode.TORCH_NOT_AVAILABLE:
      console.log('Device does not have a flashlight');
      break;
    case TorchErrorCode.PERMISSION_DENIED:
      console.log('Camera permission denied');
      break;
    case TorchErrorCode.CONFIGURATION_FAILED:
      console.log('Failed to configure torch');
      break;
    case TorchErrorCode.TORCH_IN_USE:
      console.log('Torch is currently in use by another app');
      break;
    default:
      console.log('Unknown error:', error.message);
  }
}
```

#### Error Codes

| Code | Description |
|------|-------------|
| `DEVICE_NOT_AVAILABLE` | Camera device is not available |
| `TORCH_NOT_AVAILABLE` | Device does not have torch capability |
| `PERMISSION_DENIED` | Camera permission denied |
| `CONFIGURATION_FAILED` | Failed to configure torch hardware |
| `TORCH_IN_USE` | Torch is being used by another application |
| `PLATFORM_NOT_SUPPORTED` | Platform not supported |

## 🎨 React Hooks

### Custom Hook Example

Create a reusable hook for torch functionality:

```typescript
import { useState, useEffect, useCallback } from 'react';
import { RNTorchModule, TorchErrorCode } from 'react-native-torch';

export const useTorch = () => {
  const [isOn, setIsOn] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAvailability();
    updateTorchState();
  }, []);

  const checkAvailability = async () => {
    try {
      const available = await RNTorchModule.isTorchAvailable();
      setIsAvailable(available);
    } catch (err) {
      setError('Failed to check torch availability');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTorchState = async () => {
    try {
      const state = await RNTorchModule.getTorchState();
      setIsOn(state);
    } catch (err) {
      // Ignore errors when getting state
    }
  };

  const toggle = useCallback(async () => {
    if (!isAvailable) return false;

    try {
      setError(null);
      
      // Request permission
      const hasPermission = await RNTorchModule.requestCameraPermission(
        'Camera Permission',
        'Camera access is needed for flashlight functionality'
      );

      if (!hasPermission) {
        setError('Camera permission denied');
        return false;
      }

      // Toggle state
      const newState = !isOn;
      await RNTorchModule.switchState(newState);
      setIsOn(newState);
      return true;

    } catch (err) {
      const errorMessage = err.code === TorchErrorCode.TORCH_NOT_AVAILABLE
        ? 'Flashlight not available on this device'
        : err.message || 'Failed to toggle flashlight';
      
      setError(errorMessage);
      return false;
    }
  }, [isOn, isAvailable]);

  const turnOn = useCallback(() => isOn ? Promise.resolve(true) : toggle(), [isOn, toggle]);
  const turnOff = useCallback(() => !isOn ? Promise.resolve(true) : toggle(), [isOn, toggle]);

  return {
    isOn,
    isAvailable,
    isLoading,
    error,
    toggle,
    turnOn,
    turnOff,
  };
};
```

## 🔧 Expo Plugin Configuration

### Basic Configuration

```javascript
// app.config.js
export default {
  expo: {
    plugins: ["react-native-torch"]
  }
}
```

### Advanced Configuration

```javascript
// app.config.js
export default {
  expo: {
    plugins: [
      [
        "react-native-torch",
        {
          // Custom camera usage description for iOS
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