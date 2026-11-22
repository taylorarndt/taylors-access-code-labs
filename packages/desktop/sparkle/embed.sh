#!/usr/bin/env bash
set -euo pipefail
app=$1
distribution=$2
: "${SPARKLE_PUBLIC_KEY:?Missing Labs update verification key}"
frameworks="$app/Contents/Frameworks"
ditto "$distribution/Sparkle.framework" "$frameworks/Sparkle.framework"
# This desktop app is unsandboxed and does not use Sparkle's optional XPC services.
rm -r "$frameworks/Sparkle.framework/Versions/B/XPCServices"
headers="$(node -p 'require("path").resolve(process.execPath, "../../include/node")')"
clang -arch arm64 -mmacosx-version-min=13.0 -fobjc-arc -bundle -undefined dynamic_lookup -I "$headers" -F "$frameworks" \
  -framework Foundation -framework Sparkle -Wl,-rpath,@loader_path/../Frameworks \
  "$(dirname "$0")/updater.m" -o "$app/Contents/Resources/labs-sparkle.node"
plist="$app/Contents/Info.plist"
plutil -insert SUPublicEDKey -string "$SPARKLE_PUBLIC_KEY" "$plist"
plutil -insert SUFeedURL -string 'https://github.com/taylorarndt/taylors-access-code-labs/releases/download/labs-mac-feed/appcast.xml' "$plist"
plutil -insert SUEnableAutomaticChecks -bool YES "$plist"
plutil -insert SURequireSignedFeed -bool YES "$plist"
plutil -insert SUVerifyUpdateBeforeExtraction -bool YES "$plist"
