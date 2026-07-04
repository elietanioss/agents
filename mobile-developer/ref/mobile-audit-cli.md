# Mobile Audit CLI — Automated Testing & Verification

## Overview
The mobile-audit runnable provides automated QA verification across iOS and Android platforms. It scans for common issues, performance problems, accessibility gaps, and platform-specific violations.

**Source:** `antigravity-kit-main\.agent\skills\mobile-design\scripts\mobile_audit.py`
**Status:** Production-ready; part of the automated verification suite

---

## What mobile_audit.py Checks

### Platform-Specific Issues
| Category | iOS Checks | Android Checks |
|----------|-----------|-----------------|
| **Layout** | Safe area violations | Notch/punch-hole handling |
| | Status bar height (20pt) | System gesture zones |
| | Bottom bar (tabbar, home indicator) | Navigation bar (48dp minimum) |
| **Touch** | 44pt minimum tap target | 48dp minimum tap target |
| | Double-tap for zoom | Back gesture interference |
| **Performance** | Jank (60fps threshold) | Jank (60fps threshold) |
| | Memory: <100MB background | Memory: <150MB background |
| | Battery: CPU <15% idle | Battery: CPU <10% idle |
| **Fonts** | Dynamic Type scaling | Scalable font units (sp) |
| | Minimum readable size (11pt body) | Minimum readable size (14sp body) |
| **Colors** | Contrast ratio ≥4.5:1 WCAG AA | Contrast ratio ≥4.5:1 WCAG AA |
| | Light/dark mode swatches | Light/dark mode swatches |

### Accessibility (WCAG 2.1 AA)
- VoiceOver/TalkBack navigation completeness
- Touch target sizes (44pt iOS, 48dp Android)
- Color contrast (4.5:1 for body text)
- Focus visibility
- Keyboard navigation support
- Image alt text presence

### Performance Baselines
- **iOS:** 60fps sustained, <100MB background memory, <15% CPU idle
- **Android:** 60fps sustained, <150MB background memory, <10% CPU idle
- **Both:** Cold start <2s, warm start <1s, app suspend <500ms

---

## Installation & Usage

### Install
```bash
pip install git+https://github.com/HKUDS/antigravity-kit-main.git#subdirectory=.agent/skills/mobile-design/scripts
```

Or copy directly:
```bash
cp antigravity-kit-main/.agent/skills/mobile-design/scripts/mobile_audit.py ~/.claude/agents/mobile-developer/ref/scripts/
```

### Run Audit
```bash
python mobile_audit.py --target-app /path/to/app.ipa  # iOS
python mobile_audit.py --target-app /path/to/app.apk  # Android
```

### Output
Produces JSON findings file:
```json
{
  "platform": "ios",
  "findings": [
    {
      "category": "layout",
      "severity": "critical",
      "description": "Safe area not respected",
      "file": "src/screens/HomeScreen.tsx",
      "line": 42,
      "remediation": "Add insets from useSafeAreaInsets() hook"
    }
  ],
  "summary": {
    "critical": 2,
    "important": 5,
    "suggestion": 8
  }
}
```

---

## Common Findings & Remediation

### Layout Issues

**Finding:** Safe area violation (iOS)
```
❌ View extends into notch/home indicator zone
✅ Use useSafeAreaInsets() to add padding
```

**React Native example:**
```jsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function HomeScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      {/* Content */}
    </View>
  );
}
```

**Finding:** Notch/punch-hole not handled (Android)
```
❌ App draws content under system UI cutouts
✅ Use WindowInsets API or setEnabledEdgeToEdge(false)
```

**Flutter example:**
```dart
MaterialApp(
  home: Scaffold(
    body: SafeArea(child: MyWidget()),
  ),
)
```

### Touch Target Issues

**Finding:** Buttons < 44pt (iOS) or < 48dp (Android)
```
❌ <TouchableOpacity style={{ width: 30, height: 30 }}>
✅ <TouchableOpacity style={{ width: 44, height: 44 }} hitSlop={10}>
```

**Note:** hitSlop extends the touch area without visual change; use for nested/stacked buttons.

### Performance Issues

**Finding:** Sustained jank (< 60fps on profile)
```
❌ Rendering <FlatList renderItem={() => expensiveComputation()} />
✅ Memoize: const renderItem = useCallback(...)
```

**Finding:** Memory > baseline
```
❌ Large images stored in state across app lifetime
✅ Use native image cache (CachedImage, ImagePickerIOS)
```

### Accessibility Issues

**Finding:** Missing alt text
```
❌ <Image source={require('./logo.png')} />
✅ <Image source={require('./logo.png')} accessibilityLabel="Company logo" />
```

**Finding:** Insufficient contrast
```
❌ Gray text (#999) on light background fails 4.5:1 check
✅ Use #333 or darker for body text
```

---

## Workflow: Audit + Fix + Verify

### Step 1: Run baseline audit
```bash
python mobile_audit.py --target-app ./android/app/build/outputs/apk/release/app-release.apk > audit-report.json
```

### Step 2: Review findings (categorized by severity)
```bash
jq '.findings[] | select(.severity == "critical")' audit-report.json
```

### Step 3: Fix findings
- **Critical:** Blocking deployment (layout, memory, crash)
- **Important:** Fix before release (accessibility, jank, slow startup)
- **Suggestion:** Nice-to-have (optimization, polish)

### Step 4: Re-audit
```bash
python mobile_audit.py --target-app ./dist/app.apk > audit-report-post-fix.json
jq '.summary' audit-report.json audit-report-post-fix.json  # Compare
```

### Step 5: Report to stakeholders
- Severity distribution pie chart
- Top 5 findings blocking release
- Estimated fix time per category

---

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Mobile Audit

on: [pull_request, push]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build APK
        run: ./gradlew assembleRelease
      
      - name: Run audit
        run: python mobile_audit.py --target-app app/build/outputs/apk/release/app-release.apk > audit.json
      
      - name: Check critical findings
        run: |
          CRITICAL=$(jq '.summary.critical' audit.json)
          if [ "$CRITICAL" -gt 0 ]; then
            echo "❌ $CRITICAL critical issues found"
            jq '.findings[] | select(.severity == "critical")' audit.json
            exit 1
          fi
```

---

## Limitations

- **Source-code only:** Scans APK/IPA; some issues require source access (e.g., specific line numbers)
- **Emulator/simulator recommended:** Performance benchmarks most accurate on device-equivalent virtual devices
- **Dynamic content:** Audit scans default state; some issues appear only at runtime (e.g., memory leak under load)
- **Third-party libraries:** May miss issues in vendored code (check changelog separately)

---

## Integration Checklist

- [ ] Python 3.10+ installed
- [ ] pip dependencies installed (APK/IPA parser libraries)
- [ ] Baseline audit run and stored (`audit-baseline.json`)
- [ ] CI/CD integration (GitHub Actions / GitLab CI / other)
- [ ] Post-fix audit run and compared
- [ ] Findings logged in project tracker (Jira/Linear/GitHub Issues)

---

## References

- **Android:** https://developer.android.com/training/best-practices/quality
- **iOS:** https://developer.apple.com/design/human-interface-guidelines/
- **WCAG 2.1 AA:** https://www.w3.org/WAI/WCAG21/quickref/
- **React Native Safe Area:** https://react-native-safe-area-context.dev/
- **Flutter SafeArea:** https://api.flutter.dev/flutter/widgets/SafeArea-class.html

---

**Last updated:** 2026-07-03 | **Source:** antigravity-kit-main
