# Stillwell simulator demo

An installed iOS demo app with a Stillwell icon, native four-tab navigation and the existing Render product in WKWebView. No Expo Go, Metro server, Apple Developer account or TestFlight setup is needed for this simulator build.

## Open for the pitch

Open Xcode's **Device Hub**, choose the running **iPhone 18 Pro**, and tap **Stillwell** on its home screen. The app is already installed under bundle ID `sg.stillwell.pitchdemo`.

To launch again from Terminal:

```sh
xcrun simctl launch booted sg.stillwell.pitchdemo
```

The app needs internet to load the Render deployment. Open it before joining the pitch; the free Render instance can take time to wake. A visible retry control handles loading failures. Keep the desktop demo and approved screenshot slides available as fallback.

Screen-share the Device Hub window, with its sidebar hidden and the phone sized to make the text readable. Keep private Q&A notes outside the shared window.

## Short walkthrough

1. **Today**: introduce Maya and the purpose of the app.
2. **Companion** → **Log how I'm feeling** → **Review & save** → scroll → **Save observation**.
3. **My health** → **Add a record** → **Try sample report extraction**. Show the values beside their original quotes, then **Confirm & save record**.
4. **My visit**: type the concern, dismiss the keyboard using its checkmark, and scroll to the appointment brief.
5. **Download text** opens the native iOS share sheet. Dismiss it without choosing a recipient during the pitch.

The walkthrough was checked in **Prepared demo** mode, which is visibly labelled. These are scripted AI examples; saving, editing and generating the brief operate on the app's local fictional profile. Live AI uses the existing Render backend and its demo access code; no new real-provider inference was tested for this app build. Select and test the intended mode before presenting.

Test activity has added one headache observation, one sample report and a visit concern to the simulator's fictional profile. Use **MT → Reset demo** only if you want a clean rehearsal. This affects the app's local sample data; its storage is separate from desktop Safari/Chrome.

## Rebuild

From the repository root:

```sh
bash ios-demo/build.sh --install
```

Uses the installed Swift compiler and iOS Simulator SDK. Generated files are in `ios-demo/build/` and ignored by Git. An explicit device can be selected using `STILLWELL_SIMULATOR=<UDID>`. Only the simulator is supported by this script.

## Boundaries

- Native app shell and tab bar; existing web-based feature screens. This is not a React Native rewrite.
- White / cherry blossom pink / plum, portrait orientation and light appearance are intentional pitch requirements.
- The app-only CSS and wording changes do not alter the deployed desktop website.
- No App Store distribution, physical-device testing, account system, clinical integration or production health-data security is claimed.
- Original uploaded PDFs/images and live extraction have not been newly rehearsed in this container. Use the checked sample path for a prepared demonstration.
- No private keys, AI keys or demo access codes are bundled.

Platform reference: [Apple WKWebView](https://developer.apple.com/documentation/webkit/wkwebview).
