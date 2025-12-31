
import NitroModules
import AVFoundation
import UIKit

// MARK: - Torch Errors

public enum TorchBridgeError: LocalizedError {
    case deviceUnavailable
    case torchUnavailable
    case permissionDenied
    case invalidIntensity
    case configurationFailed(String)

    public var errorDescription: String? {
        switch self {
        case .deviceUnavailable:
            return "DEVICE_NOT_AVAILABLE"
        case .torchUnavailable:
            return "TORCH_NOT_AVAILABLE"
        case .permissionDenied:
            return "PERMISSION_DENIED"
        case .invalidIntensity:
            return "INVALID_INTENSITY: Must be between 0.0 and 1.0"
        case .configurationFailed(let message):
            return "CONFIGURATION_FAILED: \(message)"
        }
    }
}

// MARK: - RNTorch Hybrid Module

final class RNTorch: HybridRNTorchSpec {

    // MARK: Device Access

    private var device: AVCaptureDevice? {
        AVCaptureDevice.default(for: .video)
    }

    private var isTorchAvailableProperty: Bool {
        device?.hasTorch ?? false
    }

    private var isTorchOnProperty: Bool {
        device?.torchMode == .on
    }

    // MARK: Public Methods exposed to Nitro

    public func switchState(enabled: Bool, intensity: Double? = nil) -> NitroModules.Promise<Void> {
        NitroModules.Promise.async {
            guard let device = self.device else {
                throw TorchBridgeError.deviceUnavailable
            }
            guard device.hasTorch else {
                throw TorchBridgeError.torchUnavailable
            }

            do {
                try device.lockForConfiguration()
                defer { device.unlockForConfiguration() }

                if enabled {
                    let level: Float
                    if let intensity = intensity {
                        guard (0.0...1.0).contains(intensity) else {
                            throw TorchBridgeError.invalidIntensity
                        }
                        level = Float(intensity)
                    } else {
                        level = 1.0
                    }
                    try device.setTorchModeOn(level: level)
                } else {
                    device.torchMode = .off
                }
            } catch {
                throw TorchBridgeError.configurationFailed(error.localizedDescription)
            }
        }
    }

    public func getIntensity() -> NitroModules.Promise<Double> {
        NitroModules.Promise.async {
            guard let device = self.device else {
                throw TorchBridgeError.deviceUnavailable
            }
            guard device.hasTorch else {
                throw TorchBridgeError.torchUnavailable
            }

            // Only valid if torch is on
            if device.torchMode == .on {
                return Double(device.torchLevel)
            } else {
                return 0.0
            }
        }
    }

    public func isTorchAvailable() -> NitroModules.Promise<Bool> {
        NitroModules.Promise.async {
            self.isTorchAvailableProperty
        }
    }

    public func getTorchState() -> NitroModules.Promise<Bool> {
        NitroModules.Promise.async {
            self.isTorchOnProperty
        }
    }

    public func requestCameraPermission(title: String, message: String) -> NitroModules.Promise<Bool> {
        NitroModules.Promise.async {
            switch AVCaptureDevice.authorizationStatus(for: .video) {
            case .authorized:
                return true
            case .notDetermined:
                return await AVCaptureDevice.requestAccess(for: .video)
            default:
                return false
            }
        }
    }
}
