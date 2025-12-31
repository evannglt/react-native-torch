#include <jni.h>
#include "RNTorchOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::torch::initialize(vm);
}
