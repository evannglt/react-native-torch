
import NitroModules
import AVFoundation
import UIKit

// MARK: - Torch Errors

public enum TorchBridgeError: LocalizedError {
    case deviceUnavailable
    case torchUnavailable
    case permissionDenied
    case configurationFailed(String)

    public var errorDescription: String? {
        switch self {
        case .deviceUnavailable:
            return "DEVICE_NOT_AVAILABLE"
        case .torchUnavailable:
            return "TORCH_NOT_AVAILABLE"
        case .permissionDenied:
            return "PERMISSION_DENIED"
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

    public func switchState(enabled: Bool) -> NitroModules.Promise<Void> {
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
                    try device.setTorchModeOn(level: 1.0)
                } else {
                    device.torchMode = .off
                }
            } catch {
                throw TorchBridgeError.configurationFailed(error.localizedDescription)
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
