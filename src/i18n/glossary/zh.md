# MineSkin Translation Glossary — Simplified Chinese (zh)

> Per-language terminology reference derived from the English source of truth (`src/i18n/locales/en.json`).
> Use it when translating or reviewing `zh` strings. Every concept maps to one canonical Simplified Chinese term used everywhere it appears.

## Universal rules (all locales)

**Do-not-translate — verbatim, Latin script:** `MineSkin` · `MineSkin PRO` · `PRO` · `Minecraft` · `iOS` · `Android` · `App Store` · `Google Play` · `GitHub` · `Discord` · `PNG` · `Star` (the GitHub action/count — see Community & project). Also keep `PNG`, dimension strings (`64x64`, `64x32`, `128x128`) and `Hex` in Latin. **Keyboard key names stay verbatim in Latin too** (`Ctrl`, `Cmd`, `Shift`, `Z`, `Y` … — as they appear inside `{{shortcuts}}` hints), with a normal space on both sides when embedded in a Chinese run.

**Interpolation placeholders — never translate, reorder, or respell** (replaced at runtime in `src/i18n/DictionaryContext.tsx`):

| Placeholder | Meaning |
|---|---|
| `{{link}}` | An inline link element (GitHub repo, Discord, usage guide, policy, author, etc.) |
| `{{shortcuts}}` | Keyboard shortcut hint (e.g. Ctrl+Z / Ctrl+Y) |
| `{{language}}` | A language name, injected into the language-detection prompt |
| `{{date}}` | The promo end date |
| `{{count}}` | A number (e.g. the maximum reference-image count) — keep Western digits, add a Chinese measure word after it (`{{count}} 张参考图`) |

Never change `languageSwitcher.*` endonyms. Keep files at key parity with `en.json` and valid 2-space JSON.

## Voice & register

Second person: use the polite 您 consistently for the user; reserve 你 only inside casual encouraging microcopy IF a unified voice is chosen — but pick ONE. The current file is inconsistent: most sections use 您 (tutorial, onboarding, library, detailPanel), while feedback ("感谢你的反馈") and recorder ("你的短片/你的截图") switch to 你. Recommendation: standardize on 您 app-wide for a friendly-but-respectful tone that matches Chinese UI convention; if a warmer casual voice is preferred, convert everything to 你 — do not mix within the product. Tone: friendly, concise, encouraging (Minecraft-creator audience) — short verb-first labels for buttons/toolbars (保存 / 撤销 / 分享), full sentences only in dialogs/tips. Avoid stiff machine-translation phrasing; prefer community-familiar gaming terms. Punctuation: use full-width Chinese punctuation （），。、？！ and full-width quotes “ ”; never mix half-width ,.?! into Chinese runs; no space between Chinese characters and punctuation. Latin brand names, version strings and hex codes stay half-width; a normal space around embedded Latin/numbers (e.g. "在 App Store 下载", "128x128 皮肤") reads best. Numbers stay Western digits. Never translate or reorder interpolation placeholders {{link}}, {{shortcuts}}, {{language}}, {{date}} — keep them verbatim and let surrounding Chinese wrap naturally. Keep brand/platform names verbatim in Latin: MineSkin, MineSkin PRO, PRO, Minecraft, iOS, Android, App Store, Google Play, GitHub, Discord, PNG; "Java Edition" renders as "Java 版" (keep "Java" Latin).

## Canonical terms

`*(italic)*` = acceptable alternative.

### Modes

| English | zh | Notes |
|---|---|---|
| **Editor** <br><sub>Pixel-drawing mode</sub> | 编辑器 | Current common.editor=编辑器. Matches. |
| **Preview** <br><sub>View-only 3D mode; also "Previewer"</sub> | 预览 <br>*(预览器 (Previewer))* | Current common.preview=预览 and metadata previewer=预览器. Matches; use 预览器 for the noun 'Previewer'. |
| **Editing** <br><sub>State label while editing</sub> | 编辑中 | Current common.editing=编辑中. Matches (state label). |
| **Draw Mode** <br><sub>Touch mode where gestures paint</sub> | 绘画模式 | Current toolbar.touchDrawMode=绘画模式. Matches. |
| **View Mode** <br><sub>Touch mode where gestures rotate/zoom</sub> | 查看模式 | Current toolbar.touchViewMode=查看模式. Matches. |

### Domain

| English | zh | Notes |
|---|---|---|
| **Skin** <br><sub>The Minecraft character texture</sub> | 皮肤 | Current uses 皮肤 throughout. Matches; standard community term. |
| **Body** <br><sub>Base/inner skin layer (partFilter.baseLayer); replaced "Base"</sub> | 本体 | partFilter.baseLayer=本体. Clearly distinguishes the character's underlying body from its wearable outer layer; compact next to the body-silhouette grid. Keep 图层 as the generic noun for "layer" (e.g. 切换整个图层). partFilter.baseLayerShort reuses 本体 verbatim. |
| **Armor** <br><sub>Outer skin layer: helmet/jacket/sleeves/pants (partFilter.overlayLayer); replaced "Overlay"</sub> | 盔甲 | partFilter.overlayLayer=盔甲. This is the familiar Minecraft term for the wearable outer layer. partFilter.overlayLayerShort reuses 盔甲 verbatim. |
| **Toggle whole layer** <br><sub>Eye-icon tooltip: show/hide every part of one layer (partFilter.toggleWholeLayer)</sub> | 切换整个图层 | Follows the existing partFilter toggle pattern 切换＋对象 (切换头部, 切换夹克…); 图层 is the generic noun for a texture layer. Short visible label (partFilter.toggleWholeLayerShort, EN "Toggle all") = 切换全部 — the button sits under a specific layer's part grid, so the layer stays implicit; keeps the 切换＋对象 pattern at 4 characters. |
| **Slim mode** <br><sub>Slim (3px) arm model, aka Alex</sub> | 纤细模式 <br>*(纤细 (Alex 模型))* | Current detailPanel.slimMode=纤细模式. Matches; 纤细 is the community term for the Alex 3px arm model. |
| **Resolution** <br><sub>Texture resolution 64x64 / 128x128</sub> | 分辨率 | Current detailPanel.changeResolution=更改分辨率. Matches. |
| **Java Edition** <br><sub>Minecraft: Java Edition (product name)</sub> | Java 版 | Current doubleResWarning renders 'Minecraft（Java版）'. Matches; keep 'Java' Latin. Prefer a space: 'Java 版'. |
| **Template** <br><sub>Starter skin template</sub> | 模板 | Current library.templates=模板, importDialog.templateFailed uses 模板. Matches. |

### Body (base)

| English | zh | Notes |
|---|---|---|
| **Head** <br><sub>Base head part</sub> | 头部 | Current partFilter.head=头部. Matches. |
| **Body** <br><sub>Torso; source uses both "Body" and "Torso"</sub> | 身体 | Current partFilter.body=身体. Matches; distinct from Torso=躯干 (good). |
| **Torso** <br><sub>Torso (partFilter.torso)</sub> | 躯干 | Current partFilter.torso=躯干. Matches; correctly distinguished from Body=身体. |
| **Left Arm** | 左臂 | Current partFilter.leftArm=左臂. Matches. |
| **Right Arm** | 右臂 | Current partFilter.rightArm=右臂. Matches. |
| **Left Leg** | 左腿 | Current partFilter.leftLeg=左腿. Matches. |
| **Right Leg** | 右腿 | Current partFilter.rightLeg=右腿. Matches. |

### Body (overlay)

| English | zh | Notes |
|---|---|---|
| **Helmet** <br><sub>Head overlay</sub> | 头盔 <br>*(帽子层)* | Current partFilter.helmet=头盔. Matches (head overlay). |
| **Jacket** <br><sub>Body overlay</sub> | 夹克 <br>*(外套)* | Current partFilter.jacket=夹克. Matches (body overlay). |
| **Left Sleeve** <br><sub>Left arm overlay</sub> | 左袖 <br>*(左袖子)* | Current partFilter.leftSleeve=左袖. Matches. |
| **Right Sleeve** <br><sub>Right arm overlay</sub> | 右袖 <br>*(右袖子)* | Current partFilter.rightSleeve=右袖. Matches. |
| **Left Pants** <br><sub>Left leg overlay</sub> | 左裤腿 | Current partFilter.leftPants=左裤腿. Matches. |
| **Right Pants** <br><sub>Right leg overlay</sub> | 右裤腿 | Current partFilter.rightPants=右裤腿. Matches. |

### Tools

| English | zh | Notes |
|---|---|---|
| **Color picker** <br><sub>Tool to pick a color</sub> | 颜色选择器 <br>*(取色器)* | Current toolbar.colorPicker & colorPicker.colorPickerTab=颜色选择器. Matches. |
| **Pen tool** <br><sub>Primary per-pixel draw tool</sub> | 铅笔工具 <br>*(画笔工具)* | INCONSISTENCY: toolbar.penTool=画笔工具 but tutorial.penToolTitle=绘画工具 — two different renderings. Also 画笔工具 collides with Brush=画笔. Recommend 铅笔工具 (pencil = the standard per-pixel tool in pixel editors) to disambiguate from Brush; at minimum unify penTool and tutorial to one term. |
| **Bulk paint** <br><sub>Fill/flood paint tool</sub> | 批量绘画 <br>*(填充 / 油漆桶)* | Current toolbar.bulkPaint=批量绘画. Matches. Since it is a fill/flood tool, 填充 is more literal — keep 批量绘画 for consistency unless retranslating. |
| **Eraser** <br><sub>Erase pixels</sub> | 橡皮擦 | Current toolbar.eraser=橡皮擦. Matches. |
| **Shading** <br><sub>Variation/shading tool (key: variation)</sub> | 阴影 <br>*(变化)* | INCONSISTENCY: toolbar.variation (Shading)=阴影, but detailPanel.variationToolIntensity=变化工具强度. Same tool, two names. Recommend 阴影 for the tool label; rename the intensity slider to 阴影工具强度. |
| **Dither** <br><sub>Dither brush</sub> | 抖动 | Current toolbar.dither=抖动. Matches. |
| **Symmetry** <br><sub>Mirror painting</sub> | 对称 <br>*(镜像)* | Current toolbar.symmetry=对称, disableSymmetry=关闭对称. Matches. |
| **Brush** <br><sub>Brush / Brushes</sub> | 画笔 <br>*(笔刷)* | Current toolbar.brush & brushes both=画笔. Matches. Note collision with Pen tool=画笔工具 (see term 27) — if Pen tool becomes 铅笔工具, keep Brush=画笔 or use 笔刷. |
| **Grid** <br><sub>Pixel grid overlay (also an environment name)</sub> | 网格 | Current toolbar.grid=网格 AND environmentGrid=网格. 网格 fits the UI grid overlay; matches. |
| **Look at Cursor** <br><sub>Camera-follow-cursor toggle</sub> | 跟随光标 | Current toolbar.lookAtCursor=跟随光标. Matches. |

### Brush params

| English | zh | Notes |
|---|---|---|
| **Opacity** | 不透明度 | Current toolbar.opacity & colorPicker.opacity=不透明度. Matches. |
| **Intensity** | 强度 | Current toolbar.intensity=强度. Matches. |
| **Radius** | 半径 | Current toolbar.radius=半径. Matches. |
| **Size** | 大小 <br>*(尺寸)* | Current toolbar.size=大小. Matches. |
| **Shape** | 形状 | Current toolbar.shape=形状. Matches. |
| **Square** | 方形 <br>*(正方形)* | Current toolbar.square=方形. Matches. |
| **Circle** | 圆形 | Current toolbar.circle=圆形. Matches. |

### Color

| English | zh | Notes |
|---|---|---|
| **Palette** <br><sub>Saved/used colors</sub> | 调色板 | Current colorPicker.paletteTab=调色板. Matches. |
| **Hue** | 色相 | Current colorPicker.hue=色相. Matches. |
| **Saturation** | 饱和度 | Current colorPicker.saturation=饱和度. Matches. |
| **Lightness** | 亮度 | Current colorPicker.lightness=亮度. Matches. Distinguish from Value=明度 (HSV). |
| **Value** <br><sub>HSV value component</sub> | 明度 | Current saturationValueSelector uses 明度. Matches; correctly distinct from Lightness=亮度. |
| **Hex Code** | 十六进制代码 <br>*(十六进制)* | Current colorPicker.hexCode=十六进制代码. Matches. |
| **Swatch** <br><sub>One color chip in the palette strip</sub> | 色块 | Not a visible string today, but the term to use if a swatch label is ever added; 调色板 stays the container (Palette), 色块 the individual chip. |

### Reference images

| English | zh | Notes |
|---|---|---|
| **Reference image** <br><sub>Imported photo/artwork users tap to sample colors from</sub> | 参考图 <br>*(参考图片)* | toolbar.reference & reference.title=参考图. 参考图 is the established Chinese art/design term (shorter than 参考图片, fits toolbar and panel titles). Keep it singular in Chinese even when English says "Reference images". Compounds: 添加参考图 (add), 移除参考图 (remove). |
| **Pick a color (from an image)** <br><sub>Eyedropper sampling off a reference</sub> | 取色 | reference.emptyState / pickFromImage use 从中取色 / 松开即可取色. 取色 is the community verb for eyedropper sampling; keeps 颜色选择器 (Color picker) free for the HSV tool and matches its alternative 取色器. Avoid 吸取颜色 for consistency. |
| **Zoom** <br><sub>Scaling the reference image in/out to sample colors precisely</sub> | 缩放 | The noun/concept; used only in compounds today (reference.resetZoom=重置缩放, pairing with Reset=重置). Do not use 变焦 (camera lens) or 放大倍数. |
| **Zoom in / Zoom out** <br><sub>+ and − icon buttons overlaid on the reference image (aria-labels/tooltips)</sub> | 放大 / 缩小 | reference.zoomIn=放大, reference.zoomOut=缩小. Standard Chinese UI pair for image zoom controls; keep them as bare 2-character verbs on these icon buttons — do not expand to 放大图片 / 缩小图片. |
| **Pan** <br><sub>Dragging a zoomed-in reference image to move it under the viewport (reference.pickFromImageZoomed, panHintTouch/panHintMouse)</sub> | 平移 | The canonical verb for moving the image itself, paired with 拖动 (drag) as the gesture: 拖动平移 / 拖动可平移图片. Do not use 移动 here — 移动 is reserved for camera 移动速度 and reads as generic motion; 平移 is the established Chinese imaging term for panning. |
| **Tap / Click** <br><sub>The single-contact gesture that samples a color; touch and mouse variants of the same hint pill</sub> | 轻点 / 点击 | 轻点 for touch (panHintTouch, and the aria-label 轻点即可取色 which is read on touch-capable canvases), 点击 for mouse (panHintMouse). Never swap them: 点击 implies a mouse button in Chinese UI convention, 轻点 is the standard touch rendering. Both chain with the locked verb 取色 (pick a color). |
| **Hint pill separator** <br><sub>The `·` between the two halves of the reference pan hints</sub> | ` · ` | Keep the Latin middle dot with a half-width space on each side (拖动平移 · 轻点取色). It is a separator between two label fragments, not sentence punctuation, so the full-width-punctuation rule does not apply; do not substitute 、or ，. Keep each half at 4 characters so the pill stays inside 70% of the panel width. |

### Actions

| English | zh | Notes |
|---|---|---|
| **Undo** | 撤销 | Current toolbar.undo=撤销. Matches. |
| **Redo** | 重做 | Current toolbar.redo=重做. Matches. |
| **Save** | 保存 | Current common.save=保存. Matches. |
| **Cancel** | 取消 | Current common.cancel=取消. Matches. |
| **Reset** | 重置 | Current common.reset=重置. Matches. |
| **Upload** | 上传 | Current common.upload=上传. Matches. |
| **Download** | 下载 | Current common.download context & library.exportSkin=下载. Matches. |
| **Import** | 导入 | Current importDialog.import=导入. Matches. |
| **Export** <br><sub>Used for "export skin"</sub> | 导出 | Current saveImage.cannotExport uses 导出, BUT library.exportSkin label=下载 (uses Download for the export action). Recommend 导出 for the export concept; note the library button intentionally says 下载 — acceptable if it truly downloads a file. |
| **Screenshot** | 截图 | Current toolbar.screenshot & feedback.addScreenshot=截图. Matches. |
| **Record clip** <br><sub>Record a shareable video</sub> | 录制片段 <br>*(录制短片)* | Current toolbar.recordClip=录制片段. Matches; note recorder.previewTitle uses 短片 for the resulting 'clip' — consistent enough. |
| **Share** | 分享 | Current recorder.share=分享视频, shareImage=分享图片. Matches. |
| **Discard** | 放弃 <br>*(丢弃)* | Current recorder.discard=放弃. Matches. |
| **Copy** <br><sub>Copy-to-clipboard button (home.copyEmail)</sub> | 复制 | Bare 2-character verb on the tiny button. Confirmation state (home.copiedEmail) = 已复制 — the 已＋verb pattern for "done" states. Full aria-label spells out the object: 复制邮箱地址 (home.copyEmailLabel). |

### Community & project

| English | zh | Notes |
|---|---|---|
| **Open source** <br><sub>home.openSourceHeading</sub> | 开源 | 开源项目 for "is open source" as a noun phrase (MineSkin 是开源项目。) — more idiomatic in Chinese than a bare predicate 是开源的. |
| **Star** <br><sub>GitHub star action; button label (home.githubStar)</sub> | Star | Keep verbatim in Latin. Chinese developers say and search "Star" (点个 Star / Star 数); the official GitHub zh-CN rendering 星标 is not what the community uses. Verb form in prose: 点个 Star. Never 收藏 or 加星. |
| **Stargazers** <br><sub>Star-count link, accessible label (home.githubStargazers)</sub> | GitHub 上的 Star 数 | Chinese has no natural noun for "stargazers"; describe it as the count instead. Keep the space around the Latin `Star`. |

### Support & mobile apps (home page)

| English | zh | Notes |
|---|---|---|
| **Free everywhere** <br><sub>home.supportHeading1 — first half of the support heading</sub> | 全平台免费 | The apps are now free too, so the heading covers web + iOS + Android at once. Never re-narrow it to 网页端免费 (the old wording, when only the web was free). Pairs with the colored second half; keep both halves at 4–6 characters so they read as one punchy sentence pair. |
| **Kept going by you** <br><sub>home.supportHeading2 — colored second half</sub> | 因您而延续 | Credits the user for the project continuing, without implying a purchase. Do not use 靠您养活 / 由您赞助 (too transactional) or 由移动应用驱动 (the old wording, now wrong — the apps no longer fund the project). |
| **Tip** <br><sub>One-time tip to the developer (home.supportDescription, home.supportTipText)</sub> | 打赏 | Locked term for the voluntary payment: 一次性打赏 for "a one-time tip". This is the ONLY thing the Support section asks for now — never describe downloading the app as a way to 支持项目. Avoid 捐赠 (charity register) and 小费 (restaurant tipping). |
| **No cost, no catch** <br><sub>home.supportDescription</sub> | 没有任何费用和附加条件 | Fixed rendering; 附加条件 carries "no catch" (no strings attached). Do not shorten to 没有套路. |
| **Take MineSkin with you** <br><sub>home.appHeading — h2 of the mobile-apps section</sub> | 把 MineSkin 带在身边 | Inviting, not a command to buy; the section is purely "the apps exist and are free". Keep MineSkin Latin with a space on each side. |
| **The full editor** <br><sub>home.appDescription (replaces the removed home.supportAppText)</sub> | 完整编辑器 | Nothing is held back on mobile. Sibling of the banner term 完整版应用 (the full app) — use 完整编辑器 when the sentence names the editor itself. |
| **Free to download** <br><sub>home.appDescription</sub> | 免费下载 | Bare verb phrase in prose. The banner CTA button keeps its own rendering 免费获取 (Get it free); do not swap the two. |
| **No ads, no account needed** <br><sub>home.appDescription</sub> | 无广告，无需账号 | Parallel 无＋noun pairs keep the rhythm of the English. Use 账号 (not 帐号/账户) for a user account. |

### Banners

| English | zh | Notes |
|---|---|---|
| **Now free** <br><sub>Badge on the permanent free-app banner (freeAppBanner.badge)</sub> | 现已免费 | The 现已＋adjective pattern marks a state that has changed and now holds indefinitely — deliberately contrasted with the limited-time promo badge (promoBanner.badge = 限时). Never use 限时 or 免费限时 here: this banner announces that MineSkin PRO is free for good, not a sale. |
| **The full app** <br><sub>"Download the full app free" (freeAppBanner.description)</sub> | 完整版应用 | Stresses that nothing is held back behind a purchase (no 精简版/试用版). |
| **Get it free** <br><sub>Banner CTA (promoBanner.cta, freeAppBanner.cta)</sub> | 免费获取 | One rendering shared by both banners; keep them identical so the CTA reads the same wherever it appears. |
| **Dismiss** <br><sub>Banner close button (promoBanner.dismiss, freeAppBanner.dismiss)</sub> | 关闭 | Same as common.close; do not use 忽略 or 不再显示. |

### Animation

| English | zh | Notes |
|---|---|---|
| **Idle animation** | 待机动画 | Current toolbar.idleAnimation=待机动画. Matches. |
| **Walking animation** | 行走动画 | Current toolbar.walkingAnimation=行走动画. Matches. |
| **No Animation** | 无动画 | Current toolbar.noAnimation=无动画. Matches. |

### Posing

| English | zh | Notes |
|---|---|---|
| **Pose** <br><sub>Noun: the character's limb arrangement</sub> | 姿势 <br>*(姿态)* | Standard Chinese term for a figure's pose in 3D/animation tools and everyday speech. 姿态 is the more technical/formal alternative (rigging, transforms); 姿势 reads naturally to the Minecraft-creator audience. Keep it distinct from 动画 (Animation) — a pose is a static arrangement, not a playing clip. |
| **Pose** <br><sub>Verb: to drag a limb (mouse) or drag its gizmo after tapping its handle (touch) into position; "Pose Limbs" toggle (toolbar.poseMode)</sub> | 摆姿势 <br>*(肢体摆姿)* | toolbar.poseMode=摆姿势. 摆 is the natural verb that pairs with 姿势 ("to strike/arrange a pose"); verb-first and only 3 characters, which fits the narrow vertical toolbar rail under a small icon. Confined to the toggle label — the hints now describe the concrete drag actions instead, so the old resultative 摆出姿势 no longer appears in toolbar.poseModeHint. Do NOT use 摆动 or 姿势模式 — 摆动 is now locked to Swing (see below) and the X模式 pattern is reserved for the touch modes 绘画模式 / 查看模式. |
| **Reset Pose** <br><sub>Button returning every limb to rest (toolbar.resetPose)</sub> | 重置姿势 | Reuses the canonical Reset=重置 plus Pose=姿势; keeps the 重置＋对象 pattern and stays at 4 characters for a compact button. Scope is the **joints only** — it never moves the figure through the scene (that is **Reset Position**, the button stacked directly under it). Since the posing rework these two buttons are the **only** way to reset anything: the double-click/double-tap reset is gone from the code, so no pose hint may describe a gesture-based reset. |
| **Position** <br><sub>Where the whole figure sits in the scene and which way it faces — the model-level transform produced by dragging/turning the centre ring, as opposed to its **Pose**</sub> | 位置 | The model-level counterpart of 姿势: 姿势 is how the limbs are arranged, 位置 is where the whole figure stands. Keep the two words apart in every string — never write 姿势 for a whole-model displacement or 位置 for a joint. Do not use 方位 (bearing/orientation, reads as compass direction) or 坐标 (raw numeric coordinates). |
| **Reset Position** <br><sub>Button putting the whole model back at the scene origin facing forward (toolbar.resetPosition); sits directly under **Reset Pose** in the pose panel</sub> | 重置模型位置 | Keeps the 重置＋对象 pattern, but deliberately spells out 模型 rather than shipping the minimal 重置位置: the two buttons are stacked full-width, and 重置姿势 / 重置位置 differ by only two rhyming characters, so the reader has to parse them instead of recognising them. 模型 states the scope on sight — this one moves the whole figure, not a joint — and simultaneously spaces out the 置…置 repetition that makes bare 重置位置 read awkwardly. It fits: the button is full-width in a ~200px+ panel at 13px next to a 16px icon. Chain with the locked **Model's center** = 模型中心 (same 模型 for the 3D figure). Do not use 复位 / 归位 alone (too terse to read as an explicit reset) or 重置位置和朝向 (the English label does not spell the facing out either). |
| **Recenter** — RETIRED <br><sub>Was: double-click/double-tap the centre handle to send the whole skin back to the scene origin</sub> | ~~回到原位~~ | RETIRED — the double-click/double-tap reset no longer exists anywhere in the code, and the clause is gone from all four pose hints. Resetting is now only the **Reset Position** button (重置模型位置) in the same panel. Do not reintroduce 回到原位 into toolbar.poseModeHint / …HintTouch. Kept here so the term is not silently revived, and because it was NOT 回到中心 for a reason (see **Reset Position**). |
| **Face forward again** — RETIRED <br><sub>Was: double-click/double-tap the centre ring in **Twist** to undo the whole model's turn</sub> | ~~重新面朝正前方~~ | RETIRED with the double-click/double-tap reset — the clause is gone from toolbar.poseTwistHint / …HintTouch, and undoing the whole model's turn is now only the **Reset Position** button (重置模型位置). Do not reintroduce it into the hints. |
| **Limb** <br><sub>An arm, leg or the head as a draggable, rotatable part</sub> | 肢体 | Collective term for arms/legs (and, loosely, the head) as movable parts — distinct from 部位 (body *part* in partFilter, a paint/visibility target) and from the specific part names 左臂 / 右腿 / 头部. "one limb" = 单个肢体. |
| **Double-click** — RETIRED from the pose hints <br><sub>Was the mouse reset gesture in toolbar.poseModeHint / poseTwistHint</sub> | 双击 | The gesture no longer exists in posing (the reset it triggered was removed), so 双击 currently appears in no string. Keep the rendering reserved: if a double-click is ever surfaced again it is 双击 for mouse only, pairing with 点击 (click, tutorial/dropzone) and 拖动 (drag an object, distinct from 拖放 = drag & drop in importDialog.dropzoneText); the touch equivalent stays 轻点两下, never 双击 (see Double-tap). |
| **Handle** <br><sub>The small grabbable marker on a limb (and at the model's center). **Touch only:** it is tapped to **select** that limb and bring up its gizmo. On mouse nothing is selected first — pressing anywhere on a limb starts the drag immediately (toolbar.poseModeHintTouch / poseTwistHintTouch)</sub> | 手柄 | 手柄 is the established Chinese term for a manipulator handle in 3D tools. It survives **only in the touch hints**, where a press can merely select (any drag there belongs to the camera): 轻点肢体的手柄即可调出轴向箭头. The mouse hints must not mention it at all — the English says just "Drag a limb", one action, no handle and no selection step. Do NOT shape-name it 圆环 — 圆环 is locked to the **Twist ring** gizmo, and the old "ring at the limb's free end that you drag to aim" no longer exists. Besides the touch hints, 手柄 appears only in the **model's center** phrase for **Move** (touch). Do not use 把手 (a physical door handle) or 控制点 (reads as a curve control point). |
| **Gizmo** <br><sub>The manipulator on a limb: three **axis arrows** in **Move**, three **twist rings** in **Twist**. On touch it appears after the limb's handle is tapped; on mouse it is simply what a drag is snapped to</sub> | — <br>*(轴向箭头 / 扭转圆环)* | Deliberately has no Chinese rendering: the English hints never say "gizmo" either, they name the concrete parts. Always write the specific gizmo (轴向箭头 or 扭转圆环) rather than inventing 控制器 / 操纵器 — those read as engine jargon in a ~208px tooltip. The verb for making it appear, 调出 (轻点肢体的手柄即可调出轴向箭头), belongs to the **touch hints only** — it implies "summon", which is exactly the tap-to-select step; the mouse hints have no such step, so they name the 箭头 / 圆环 straight inside the drag clause. |
| **Twist ring** <br><sub>The **Twist** gizmo: three rings around a limb's **joint**; dragging one turns the limb about that axis (toolbar.poseTwistHint / …HintTouch)</sub> | 扭转圆环 <br>*(圆环)* | Built from the locked **Twist** = 扭转 plus 圆环 for the shape the user sees, exactly parallel to **Axis arrow** = 轴向箭头 in **Move**. The touch hint introduces it in full (调出扭转圆环) and then refers back with the bare 圆环 (再拖动圆环让…) to keep the tooltip short; the mouse hint, which has no introduction step, uses the bare 圆环 from the start (绕开始拖动时最近的圆环转动). The rings sit at the 关节 (joint), not at the limb's free end — the reverse of the axis arrows, and the opposite of the pre-rework ring, so never describe them as 肢体末端的圆环. Do not use 旋转环 (uses the banned generic 旋转) or 转盘 (a dial). |
| **Model's center (handle location)** — TOUCH HINTS ONLY <br><sub>Where the skin-wide handle sits — at the model's centre of mass, attached to no body part (toolbar.poseModeHintTouch / poseTwistHintTouch)</sub> | 模型中心 | The handle no longer rides on the chest: it floats at the figure's centre of mass and is not part of any limb, so it must be named by position, not by anatomy. 模型 is the neutral word for the 3D figure (the thing the 皮肤 is worn on) and never claims a partFilter part. Deliberately NOT 胸口 (the old, now-wrong location — never reuse it here) and NOT 重心 (physics/balance register, reads as a simulation property rather than a spot on screen). 中心点 is over-precise for a tooltip; keep the bare 模型中心. **Follow the English on which noun it takes**, because the two tools show different center gizmos: **Move** ⇒ 模型中心的手柄 ("the handle at the model's center"), **Twist** ⇒ 模型中心的圆环 ("the ring at the model's center"). Never write 圆环 in the Move hint or 手柄 in the Twist one. The **mouse** hints no longer use this phrase at all — see the row below. |
| **The torso (whole-skin drag target on mouse)** <br><sub>What the mouse hints tell you to drag to move/turn the whole skin: "Drag the torso" (toolbar.poseModeHint / poseTwistHint)</sub> | 躯干 | Follow the English: the mouse hints name the body part you press on, not the floating centre handle, because on mouse a press anywhere on the torso starts the whole-skin drag immediately — there is nothing to select and no handle to mention. Use the partFilter rendering **Torso** = 躯干 verbatim (拖动躯干即可移动整个皮肤 / 拖动躯干即可让整个皮肤原地转动) so the word matches the part list the user already knows. This does NOT reopen 躯干 for the touch hints: those still say 模型中心的手柄 / 模型中心的圆环, exactly as their English does. Do not write 身体 here (locked to the partFilter part **Body**) or 胸口. |
| **The whole skin (moved by the torso / center handle)** <br><sub>Dragging the torso (mouse) or the model's center handle (touch) carries the entire figure with it — translating it through the scene with **Move**, turning it on the spot with **Twist**</sub> | 整个皮肤 <br>*(移动 / 原地转动)* | The English deliberately says "the whole skin", not "the body": nothing is rotated from the waist any more, the whole character is displaced. So use the locked **Skin** = 皮肤 with the plain quantifier 整个 — 可移动整个皮肤 / 让整个皮肤原地转动. Do NOT keep the old 整个身体: 身体 is the locked rendering of the partFilter part **Body**, and now that the handle is attached to nothing, naming a body part would wrongly suggest a part-level rotation. Also avoid 全身 (medical/full-body-scan register) and 整个角色 (unlocked term for the character). Pair it with the verb that states the motion: **Move** ⇒ 移动 — the locked **Move (tool)** verb, now literally correct because the handle translates the figure; never 一起倾斜 (the old lean-from-the-waist wording, no longer what happens); **Twist** ⇒ 原地转动 — reuse the 原地 of the **Twist** row (in place, the figure does not go anywhere) with 转动, not 扭转, because the whole figure turns as one rather than winding about itself, exactly as the English switches from "spin around its own axis" to "turns". Do not use 旋转 (the generic rotate the pose hints keep unused) or 转身 (implies a character turning to face away). |
| **Joint** <br><sub>The pivot the limb turns about (shoulder, hip, neck); where the three **twist rings** sit</sub> | 关节 | The anatomical/rigging term, immediately understood for shoulder/hip/neck. Strictly the pivot *point*, never the moving part itself — the movable arm/leg/head is 肢体 (Limb). It anchors the **Twist** gizmo, opposite the limb's free end where the 轴向箭头 appear. Do not use 关节点 or 枢轴. |
| **Aim (verb)** — RETIRED <br><sub>Was: drag the ring so the limb's end follows the pointer</sub> | ~~调整指向~~ | RETIRED by the posing rework — nothing follows the pointer freely any more, every drag is constrained to one gizmo axis. Do not reintroduce 调整指向 into the pose hints; describe the constrained motion instead (沿这条轴移动 / 绕该轴转动). Kept here so the term is not silently revived. |
| **Swing (verb)** — RETIRED <br><sub>Was: drag the limb's body itself to rotate it *freely*, in any direction</sub> | ~~摆动~~ | RETIRED by the posing rework — no drag is free any more, every one is constrained to a single gizmo axis. Note this is no longer about *what* you grab: on mouse you do drag the limb directly again (the press just hands the drag to the nearest arrow/ring). 摆动 stays unused, but keep it reserved (do not repurpose it for **Pose** = 摆姿势 or for **Twist** = 扭转), and do not revive it now that 拖动肢体 is back in the mouse hints — the motion it named (free swinging) is still gone. |
| **Axis** <br><sub>One of the three gizmo axes a drag is constrained to — the limb's end slides along it in **Move**, the limb turns about it in **Twist**</sub> | 轴 | The bare 轴 is the standard Chinese term in 3D tools (X 轴 / Y 轴 / Z 轴). In the **touch** hints it always carries a measure word or demonstrative — 沿这条轴移动 (Move) / 绕该轴转动 (Twist) — which reads far more naturally than the noun alone. The **mouse** hints do not name the axis at all: with no selection step there is no "that axis" to point back to, so the drag is described against the gizmo part itself (沿…箭头移动 / 绕…圆环转动). The prepositions are fixed either way: 沿 for sliding along, 绕 for turning around. Do not use 坐标轴 (schoolbook geometry register, too heavy for a tooltip) or 轴线 (a drawn construction line). 轴 always means one of the three gizmo axes here; never use it for a limb's own long axis. |
| **Axis arrow** <br><sub>The **Move** gizmo: three arrows at a limb's free end, each dragging that end along one axis only. Shown after the handle is tapped on touch; on mouse they are simply what a drag snaps to (toolbar.poseModeHint / …HintTouch)</sub> | 轴向箭头 | 轴向 (axis-aligned / along an axis) + 箭头 names both what constrains it and what the user sees, and it is the term Chinese 3D tools use for a translate gizmo's arrow shafts. Its **Twist** counterpart is 扭转圆环 — arrows sit at the limb's free end and slide it, rings sit at the 关节 and turn it. Follow the English on counting: the hints just say "axis arrows", so use the bare 轴向箭头 (add 三个 only if the source spells the count out); the full form 轴向箭头手柄 is available for aria-labels only. The touch hint introduces the full 轴向箭头 and refers back with the bare 箭头 (再拖动箭头让…); the mouse hint uses the bare 箭头 throughout, since it never introduces the gizmo. Avoid 方向箭头 (reads as a mere directional indicator) and 移动轴 (names the axis, not the grabbable arrow). |
| **Collision / stop where limbs meet** <br><sub>Stated behaviour, not a toggle: a limb stops moving once it reaches another body part. NOT currently surfaced — the reworked pose hints dropped the clause; keep the wording ready in case it returns</sub> | 碰到其他部位就会停下 <br>*(碰撞)* | Describe the behaviour with a verb phrase rather than naming the feature — the noun 碰撞 (collision) is engine jargon and would read as a setting the user must find. 碰到 is the everyday verb for making contact; 停下 keeps the light register of the surrounding hint (do not use 停止 or the stiffer 被阻挡). Chain the locked terms: 肢体 (Limb) as subject, 部位 (body part, as in partFilter) as object — 其他部位 is enough, do not expand to 其他身体部位 in these already-long tooltips. Reserve 碰撞 for any future technical/settings copy about the system itself. |
| **Move (tool)** <br><sub>Pose-panel tool tile: drag a limb (mouse) or tap its handle then drag an **axis arrow** (touch) to slide the limb's end along one axis (toolbar.poseMove)</sub> | 移动 | The tool name, not the gesture: it names what dragging an 轴向箭头 does to the limb's free end, and at 2 characters it fits the ~120px tile under its icon. CONFLICT RESOLVED: the **Pan** row bans 移动 for the reference image ("reserved for camera 移动速度"), but that ban is about not blurring 平移 (image pan) with generic motion; here 移动 *is* the concept being named, in a different surface (pose panel tile vs. reference hint), and nothing in posing competes for the word. The ban stands unchanged for Pan — never write 移动 where 平移 is meant — and 移动速度 stays the camera slider. Do not expand to 移动肢体 (the panel is already limb-scoped) and do not reuse 调整指向 as the tile label — that names one gesture inside the tool, so the tile would under-describe the axis arrows. |
| **Twist (tool/verb)** <br><sub>Pose-panel tool tile: drag a limb (mouse) or tap its handle then drag a **twist ring** at its joint (touch) to turn it about that axis (toolbar.poseTwist / poseTwistHint / …HintTouch)</sub> | 扭转 | 扭转 is the everyday Chinese verb for twisting a jointed thing about itself (扭转手腕 / 扭转身体), so it reads as an anatomical turn rather than a transform, and it stays 2 characters for the tile. Lexically distinct from every neighbouring term: 平移 (Pan — the reference image), 旋转 (the generic "rotate", deliberately still unused in the pose hints), and 动画 (a playing clip). **Scope note:** the tile name is 扭转, but the *motion* the hints describe is now axis-constrained, so the sentence verb is 转动, not 扭转 — 再拖动圆环让肢体绕该轴转动 (touch) / 绕开始拖动时最近的圆环转动 (mouse). Keep 扭转 for the tool and for the gizmo compound 扭转圆环 only. The old prose form 原地扭转 is retired for limbs (it expressed "around its own axis", which is no longer what happens); 原地 survives only in the whole-skin clause 让整个皮肤原地转动. Do not use 自转 (astronomy), 拧 / 拧转 (twisting a physical knob) or 翻转 (a flip/mirror). |
| **Double-tap** — RETIRED from the pose hints <br><sub>Was the touch reset gesture on a limb's **handle** (toolbar.poseModeHintTouch / poseTwistHintTouch)</sub> | 轻点两下 | The limb reset it triggered was removed from the code, so 轻点两下 appears in no string today; resetting is now only the **Reset Pose** / **Reset Position** buttons. Keep the rendering reserved for any future double-tap: built on the locked touch verb 轻点 (tap, reference.panHintTouch), never 双击 on touch (双击 implies a mouse button in Chinese UI convention), 两下 not 两次 for the lighter gesture register, and unsplit — 轻点两下手柄, never 轻点手柄两下. |
| **Tap for the gizmo, then drag** <br><sub>The two-step sentence shape — **touch hints only** (toolbar.poseModeHintTouch / poseTwistHintTouch)</sub> | 轻点…即可调出…，再拖动… | On touch a press can only *select* (any drag on the model belongs to the camera), so both touch hints keep two steps in one sentence: 轻点肢体的手柄即可调出轴向箭头，再拖动箭头让该端沿这条轴移动. Use 再 (not 然后) for the second step — one character, and it already carries the sequence. **Never apply this shape to the mouse hints:** a mouse press on a limb begins the drag straight away, so poseModeHint / poseTwistHint are a single action (拖动肢体，…), with no 点击…即可调出… step at all. |
| **…you start nearest** <br><sub>Which arrow/ring a mouse drag is handed to — the one nearest where the press landed (toolbar.poseModeHint / poseTwistHint)</sub> | 开始拖动时最近的… | Fixed rendering for the mouse hints: 沿开始拖动时最近的箭头移动 / 绕开始拖动时最近的圆环转动. 开始拖动时 is the moment of the press, which is what decides the axis — do not shorten to a bare 最近的箭头 (reads as nearest to the camera or to the limb) and do not invent 起拖点 / 按下点 (jargon, and heavier than the phrase they replace). No 您 in these hints: the English "you" is generic, and Chinese UI tooltips drop the pronoun. |
| **Put the gizmo away** <br><sub>GUIDE ONLY — press `Esc` or click empty space to dismiss the arrows/rings brought up by a tap (usage guide, Posing → Mouse and Touch)</sub> | 收起箭头和圆环 | Follows the **Gizmo** row: there is still no Chinese noun for "gizmo", so name the concrete parts — 按 `Esc` 或点击空白处，即可收起箭头和圆环. 收起 (put/fold away) is the natural counterpart of the touch verb 调出 (summon) and implies the gizmo can come back; do not use 隐藏 (reads as a visibility setting, next to 可见性设置) or 关闭 (reserved for turning a mode off, e.g. 关闭对称 / 关闭摆姿势). Keep `Esc` verbatim in Latin inside backticks, with a normal space on both sides. 点击空白处 for the mouse click — 点击 (click) not 轻点 (tap, touch only), and 空白处 not 空白 alone (空白 is locked to the **Empty** environment). |
| **Hover lights up the arrow/ring** <br><sub>GUIDE ONLY — on mouse, hovering a limb highlights the arrow or ring the drag would use</sub> | …会亮起 | Use the intransitive 亮起 with the gizmo part as subject (此次拖动将会使用的箭头或圆环会亮起) rather than a transitive 高亮显示, which reads as an editor feature. Do not use 高亮 (jargon) or 发光 (a glow effect). |
| **The torso's handle drives the whole model** <br><sub>GUIDE ONLY — the torso has no joint of its own, so its handle transforms the entire figure (usage guide, Posing → The Torso)</sub> | 躯干的手柄控制的是整个模型 | Extends the mouse-hint row **The torso (whole-skin drag target on mouse)**: keep 躯干 (partFilter **Torso**) for the thing you grab and 关节 (Joint) for what it lacks — 躯干本身没有关节. In the guide the two motions keep the locked whole-skin verbs: 箭头让整个皮肤在场景中移动 (Move) / 圆环让它原地转动 (Twist). Never write 平移 here — 平移 stays locked to the reference-image **Pan**. |
| **Move and turn sliders** <br><sub>GUIDE ONLY — the Settings → Preferences sliders the torso handle writes to: detailPanel.moveLeftRight / moveForwardBack / moveUpDown and turnLeftRight</sub> | 移动、转动滑块 | Refer to them collectively as 移动、转动滑块 (with the full-width enumeration comma), never invent a new group name — the guide's Settings section already calls the first three 位置滑块 in the 3D-environment note, and each individual label (左右移动 / 前后移动 / 上下移动 / 左右转动) stays exactly as it appears in detailPanel. Say the handle and the sliders 写入的数值完全相同 rather than 同步/绑定 (implementation register). |
| **Ignore the move offsets (built environments)** <br><sub>GUIDE ONLY — a 3D environment stands the model on its own ground, so the torso's arrows disappear there; turning still works</sub> | 3D 环境…忽略移动偏移量 | Reuse the guide's existing wording for the same behaviour in Settings (启用 3D 环境时，这三个位置滑块会被锁定) — the world is 3D 环境 (locked **Environment** = 环境), with a normal space around the Latin `3D`. 移动偏移量 for the offsets; 箭头会消失 for the arrows going away (not 被禁用, which suggests a greyed-out control the user could re-enable). |
| **Mutually exclusive (posing vs. animation)** <br><sub>GUIDE ONLY — starting an animation switches posing off, and switching posing on stops the animation (usage guide, Posing → Posing and Animations)</sub> | 两者互斥 | 互斥 is the compact, standard rendering and needs no expansion to 互相排斥. Chain the locked terms 摆姿势 (Pose, verb) and 动画 (Animation) with the plain verbs the app uses: 开始播放动画会关闭摆姿势，开启摆姿势则会停止动画. Do not use 冲突 (reads as a bug) or 不能同时使用 (wordier, and vaguer about which one yields). |
| **Saved with the skin** <br><sub>GUIDE ONLY — the pose persists with the skin and returns on reload</sub> | 随皮肤一起保存 | Chain the locked **Skin** = 皮肤; 重新加载后依然存在 for "comes back when you reload". Avoid 持久化 (engineering register) and 自动保存 (implies a separate autosave feature). |
| **Outside pose mode** <br><sub>GUIDE ONLY — positioning dialled in via the Settings sliders rather than the pose panel; the two resets are independent (usage guide, Posing → Resetting)</sub> | 在**摆姿势**之外 | Refer back to the toggle label 摆姿势 (toolbar.poseMode) and add 之外 — do NOT write 摆姿势模式之外 or 姿势模式: the X模式 pattern stays reserved for the touch modes 绘画模式 / 查看模式 (see the **Pose** verb row). For the independence itself use 两者分别重置 (they reset separately), not 互不影响 alone, which states the consequence without naming the two buttons' scopes. |
| **Around any of its axes** <br><sub>What **Twist** actually does: three rings sit at the joint, so the limb turns about any of three axes — NOT a roll about its own length (changelog 2026-08-27, release notes, toolbar.poseTwistHint)</sub> | 绕任意一条轴转动 <br>*(绕三条轴中的任意一条转动)* | Fixed rendering for consumer copy. Use the bare 绕任意一条轴转动 where space is tight (release notes) and the explicit 绕三条轴中的任意一条转动 where the English spells the count out ("any of its three axes", changelog). The verb is 转动, never 扭转 — per the **Twist (tool/verb)** row, 扭转 is reserved for the tile label and the compound 扭转圆环. **BANNED: 绕自身的轴 / 绕自身的长轴 / 绕自己的轴** — they say "about its own long axis", i.e. a roll, which is exactly the behaviour the three 扭转圆环 replaced; this error shipped once in the zh changelog and release notes and was corrected. The retired 原地扭转 (see **Twist**) is banned for the same reason. In the in-app hints the axis is already singular-by-selection (绕该轴转动 / 绕开始拖动时最近的圆环转动) — do not import 任意一条 there. |

### Camera

| English | zh | Notes |
|---|---|---|
| **Field Of View** <br><sub>FOV</sub> | 视野 <br>*(视场角 / FOV)* | Current detailPanel.fieldOfView=视野. Matches. |
| **Movement Speed** | 移动速度 | Current detailPanel.movementSpeed=移动速度. Matches. |
| **Damping** <br><sub>Camera inertia damping</sub> | 阻尼 | Current detailPanel.damping=阻尼. Matches (camera inertia). |
| **Camera** <br><sub>The physical device camera (native permission prompt, native.cameraUsageDescription) — NOT the 3D viewport camera above</sub> | 相机 | Use 相机 only for the hardware camera; the 3D viewport camera has no standalone label (it appears via 视野 / 移动速度 / 阻尼). Avoid 摄像头 (webcam register) and 照相机 (dated). Platform-neutral: never add iOS/Android to the permission text. |
| **Take a photo** <br><sub>Capture a photo with the device camera to use as a reference image</sub> | 拍摄照片 <br>*(拍照)* | native.cameraUsageDescription=拍摄照片作为参考图，以便从中取色。 Prefer the full 拍摄照片 in permission/purpose sentences; bare 拍照 is acceptable only on a short button label. Chain with the locked terms 参考图 (Reference image) and 取色 (Pick a color). |

### Light

| English | zh | Notes |
|---|---|---|
| **Main Light** <br><sub>Key/directional light</sub> | 主灯光 <br>*(主光源)* | Current detailPanel.mainLight=主灯光. Matches. |
| **Ambient Light** <br><sub>Overall Brightness (Ambient Light)</sub> | 环境光 | Current overallBrightness=整体亮度（环境光） embeds 环境光. Matches. |
| **Surface Brightness** | 表面亮度 | Current detailPanel.surfaceBrightness=表面亮度. Matches. |
| **Shine/Glossiness** <br><sub>Specular</sub> | 光泽度 <br>*(高光)* | Current detailPanel.shineGlossiness=光泽度. Matches (specular). |
| **Overall Brightness** | 整体亮度 | Current overallBrightness=整体亮度（环境光）. Matches. |

### Environment

| English | zh | Notes |
|---|---|---|
| **Environment** <br><sub>3D world/atmosphere</sub> | 环境 <br>*(场景)* | Current detailPanel.environment=环境. Matches. |
| **Grassland Day** <br><sub>Environment name</sub> | 草地白天 <br>*(草原白天)* | Current environmentGrassland=草地白天. Matches. |
| **Arena** <br><sub>Sci-fi arena environment (NOT "sand")</sub> | 竞技场 <br>*(斗技场)* | Current environmentScifi=竞技场. Matches; correctly the sci-fi arena, NOT 'sand'. |
| **Empty** <br><sub>No environment</sub> | 空白 <br>*(无)* | Current environmentEmpty & library.newEmpty=空白. Matches (no environment). |

### Library

| English | zh | Notes |
|---|---|---|
| **Library** <br><sub>Saved skins collection</sub> | 皮肤库 <br>*(素材库)* | Current library.title=皮肤库. Matches (saved skins collection). |
| **New Skin** | 新皮肤 | Current library.newSkin & defaultName=新皮肤. Matches. |
| **Templates** | 模板 | Current library.templates=模板. Matches; align with singular Template=模板. |
| **Changelog** | 更新日志 | Current changelog.title=更新日志. Matches. |
| **Settings** | 设置 | Current common.settings=设置. Matches. |
| **Appearance** <br><sub>Theme selector label (System/Light/Dark)</sub> | 外观 | theme.label=外观. Standard Chinese UI term for the color-theme picker; matches register of languageSwitcher.language=语言. |

## Consistency watch-list

Terms with known drift in the current file — keep these locked to the recommended form:

- **Pen tool** → `铅笔工具`: INCONSISTENCY: toolbar.penTool=画笔工具 but tutorial.penToolTitle=绘画工具 — two different renderings. Also 画笔工具 collides with Brush=画笔. Recommend 铅笔工具 (pencil = the standard per-pixel tool in pixel editors) to disambiguate from Brush; at minimum unify penTool and tutorial to one term.
- **Shading** → `阴影`: INCONSISTENCY: toolbar.variation (Shading)=阴影, but detailPanel.variationToolIntensity=变化工具强度. Same tool, two names. Recommend 阴影 for the tool label; rename the intensity slider to 阴影工具强度.
- **Brush** → `画笔`: Current toolbar.brush & brushes both=画笔. Matches. Note collision with Pen tool=画笔工具 (see term 27) — if Pen tool becomes 铅笔工具, keep Brush=画笔 or use 笔刷.

---

_Generated from the terminology workflow (English canonical + native Simplified Chinese localizer pass)._
