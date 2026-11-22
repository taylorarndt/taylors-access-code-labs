#import <Sparkle/Sparkle.h>
#include <node_api.h>

// Electron calls the addon from its AppKit main thread. Keep one controller for
// the lifetime of the application so automatic checks survive plugin reloads.
static SPUStandardUpdaterController *controller;

static napi_value check(napi_env env, napi_callback_info info) {
    [controller checkForUpdates:nil];
    return NULL;
}

NAPI_MODULE_INIT() {
    if (!controller) {
        controller = [[SPUStandardUpdaterController alloc] initWithStartingUpdater:NO
                                                                    updaterDelegate:nil
                                                                 userDriverDelegate:nil];
        NSError *error = nil;
        if (![controller.updater startUpdater:&error]) {
            controller = nil;
            napi_throw_error(env, NULL, error.localizedDescription.UTF8String);
            return NULL;
        }
    }

    napi_value callback;
    napi_create_function(env, "check", NAPI_AUTO_LENGTH, check, NULL, &callback);
    return callback;
}
