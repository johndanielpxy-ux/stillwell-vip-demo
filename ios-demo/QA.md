# Simulator demo verification — 30 September 2026

## Requirement trace

User: “i would just want it to look like an ios app on ios simulator, we dont have to worry about expo go and all that yet”. Implemented a UIKit/WKWebView simulator bundle with its own icon, native tab bar and app-only mobile styling. Existing Stillwell feature logic, API endpoints and deployed desktop UI are unchanged. White/pink/plum, fictional data and Prepared/Live labels are preserved.

## Evidence and checks

- Swift build, ad-hoc signing, simulator installation and launch succeeded on the booted iPhone 18 Pro / iOS 27.0. Home screen showed the pink leaf Stillwell icon; tapped it to open the app. No Safari address bar or Expo runtime.
- Visually inspected Today, Companion, records, extraction review, observation review, My visit, keyboard and native share sheet through Device Hub.
- Tapped **Log how I'm feeling**, reviewed Headache / intensity 3 / sleep 6, and saved. Saw **Saved to your journal** and later **13 observations across 12 journal days** in the brief.
- Tapped **Add a record → Try sample report extraction**, inspected the date and source quote, scrolled and confirmed save. Prepared-sample/no-live-extraction disclosure remained visible.
- Typed “I want to discuss how headaches affect my day.” into My visit using the simulator keyboard. The focused textarea remained visible above the keyboard. Dismissed keyboard and saw the same concern in the brief.
- **Download text** opened the native share sheet for `stillwell-visit-brief`, Text Document, 2 KB. No recipient selected and no external message sent.
- Reinstalled/relaunched without uninstalling: dismissed introduction, saved journal activity and sample record remained in the app's persistent store. App returned to Today.
- Existing test suite: 26/26 passed. These include mocked provider/server checks and are not live-provider proof. Bridge JavaScript syntax and plist lint passed; whitespace checks clean.
- Screen recording of the initial interaction pass: `../../pitch-2026-09-30/evidence/ios-app/initial-flow.mov`. Final clean opening screen: `../../pitch-2026-09-30/evidence/ios-app/today-final.png`. Tool-session screenshots also capture the review and native share sheet.

## Defects found and repaired

1. Initial readiness was checked once at navigation completion; a late-rendering product could leave the loading view visible. Added a DOM readiness message and mutation observer, with explicit user retry still available. Subsequent launches showed the product.
2. WebKit's date input exceeded the sheet width. Applied zero minimum width, constrained controls and a `minmax(0, 1fr)` form track. The extraction date subsequently rendered fully within the sheet.
3. Browser-specific storage wording did not fit the installed app. Replaced three exact UI strings only. User notes, source quotations and document text are not globally rewritten.
4. Native export required explicit handling. Blob text export now opens UIActivityViewController; the share sheet was observed. Print CSS also restores unrestricted page height, but the final printer/PDF destination was not exercised.

## Review gates and remaining limits

- Preserve approved content: only files under `ios-demo/` added. Server, existing app modules, deck and pitch script untouched.
- Palette hierarchy: white primary surfaces, pink accents, plum text/actions observed on the running app. Portrait/light mode intentional for the pitch; no dark-mode support claimed.
- Claim parity: prepared examples stay labelled, no fabricated clinical integration, no suggestion that this is a complete native rewrite or App Store release.
- Cold review: opening screen explains the product; main destinations are labelled in the tab bar; reviewed values are shown before saving. The prototype contains long review forms requiring scrolling.
- Runtime scope: manual simulator journey, not device certification, accessibility certification or measured 60 fps profiling. No physical-device or Zoom audience-view test. App requires internet/Render availability. Real PDF/image uploads and Live AI have not been freshly exercised in the container. Print handoff is implemented but not end-to-end verified.
- Build toolchain emitted a sysroot warning, but compilation, installation and launch succeeded. No claim that this manual build script supports physical-device signing or distribution.

Status: simulator presentation build verified for the prepared sample journey, with the limits above. John still needs one timed presentation rehearsal.
