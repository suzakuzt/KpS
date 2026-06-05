const elements = {
  appShell: document.getElementById("app-shell"),
  authScreen: document.getElementById("auth-screen"),
  authForm: document.getElementById("auth-form"),
  authPassword: document.getElementById("auth-password"),
  authTitle: document.getElementById("auth-title"),
  authFieldLabel: document.getElementById("auth-field-label"),
  authSubmitButton: document.getElementById("auth-submit"),
  authLinuxdoSection: document.getElementById("auth-linuxdo-section"),
  authLinuxdoButton: document.getElementById("auth-linuxdo-button"),
  authError: document.getElementById("auth-error"),
  model: document.getElementById("model"),
  serverKeyBadge: document.getElementById("server-key-badge"),
  accountButton: document.getElementById("account-button"),
  adminUsageButton: document.getElementById("admin-usage-button"),
  logoutButton: document.getElementById("logout-button"),
  clearCacheButton: document.getElementById("clear-cache-button"),
  chatMain: document.querySelector(".chat-main"),
  requestProgressShell: document.getElementById("request-progress-shell"),
  requestProgressBar: document.getElementById("request-progress-bar"),
  resultCanvasGrid: document.getElementById("result-canvas-grid"),
  resultsGrid: document.getElementById("results-grid"),
  messagesScroll: document.getElementById("messages-scroll"),
  messagesList: document.getElementById("messages-list"),
  templatesView: document.getElementById("templates-view"),
  galleryView: document.getElementById("gallery-view"),
  templateSearch: document.getElementById("template-search"),
  templateCategoryList: document.getElementById("template-category-list"),
  templateGrid: document.getElementById("template-grid"),
  templatePagination: document.getElementById("template-pagination"),
  publicGalleryGrid: document.getElementById("public-gallery-grid"),
  galleryLoadMore: document.getElementById("gallery-load-more"),
  refreshGalleryButton: document.getElementById("refresh-gallery-button"),
  shuffleInspirationButton: document.getElementById("shuffle-inspiration-button"),
  inspirationGrid: document.getElementById("inspiration-grid"),
  viewGalleryShortcut: document.getElementById("view-gallery-shortcut"),
  historyList: document.getElementById("history-list"),
  historyToggleButton: document.getElementById("history-toggle-button"),
  newChatButton: document.getElementById("new-chat-button"),
  errorBox: document.getElementById("error-box"),
  tabButtons: Array.from(document.querySelectorAll(".tab-button")),
  viewButtons: Array.from(document.querySelectorAll(".view-button")),
  viewPanels: Array.from(document.querySelectorAll("[data-view-panel]")),
  optimizeButtons: Array.from(document.querySelectorAll("[data-optimize-target]")),
  modePanels: Array.from(document.querySelectorAll("[data-mode-panel]")),
  countOptions: Array.from(document.querySelectorAll("[data-count-target]")),
  parameterSelects: Array.from(document.querySelectorAll(".setting-field select")),
  generateForm: document.getElementById("generate-form"),
  editForm: document.getElementById("edit-form"),
  generatePrompt: document.getElementById("generate-prompt"),
  editPrompt: document.getElementById("edit-prompt"),
  generatePromptCount: document.getElementById("generate-prompt-count"),
  editPromptCount: document.getElementById("edit-prompt-count"),
  generateSubmitButton: document.getElementById("generate-submit"),
  editSubmitButton: document.getElementById("edit-submit"),
  imagePreviewStrip: document.getElementById("image-preview-strip"),
  maskPreviewStrip: document.getElementById("mask-preview-strip"),
  editImages: document.getElementById("edit-images"),
  editMask: document.getElementById("edit-mask"),
  previewModal: document.getElementById("preview-modal"),
  previewClose: document.getElementById("preview-close"),
  previewImage: document.getElementById("preview-image"),
  previewCaption: document.getElementById("preview-caption"),
  previewDownload: document.getElementById("preview-download"),
  previewPrev: document.getElementById("preview-prev"),
  previewNext: document.getElementById("preview-next"),
  previewCopyPrompt: document.getElementById("preview-copy-prompt"),
  previewShare: document.getElementById("preview-share"),
  adminUsageModal: document.getElementById("admin-usage-modal"),
  adminUsageClose: document.getElementById("admin-usage-close"),
  adminUsageRefresh: document.getElementById("admin-usage-refresh"),
  adminUsageContent: document.getElementById("admin-usage-content"),
  accountModal: document.getElementById("account-modal"),
  accountClose: document.getElementById("account-close"),
  accountRefresh: document.getElementById("account-refresh"),
  accountContent: document.getElementById("account-content"),
};

const state = {
  activeMode: "generate",
  activeView: "chat",
  authEnabled: false,
  authenticated: false,
  authMode: "password",
  loginType: "",
  authPromptPromise: null,
  authPromptResolve: null,
  creditsRemaining: null,
  account: null,
  accountOverview: null,
  accountLoading: false,
  isAdmin: false,
  permissions: [],
  adminUsage: null,
  adminUsageLoading: false,
  galleryEnabled: false,
  defaultModel: "gpt-image-2",
  currentImages: [],
  currentResultMode: "generate",
  uploadPreviewUrls: {
    imagePreviewStrip: [],
    maskPreviewStrip: [],
  },
  uploadSourceFiles: {
    images: [],
    mask: [],
  },
  uploadRestoreFallback: {
    images: false,
    mask: false,
  },
  activePreview: null,
  requestInFlight: false,
  activeImageJob: null,
  progressValue: 0,
  progressTimer: null,
  localDbPromise: null,
  localHydrating: false,
  localPersistTimer: null,
  activeSessionId: "",
  currentSessionTitle: "",
  sessions: [],
  messages: [],
  templates: [],
  templateCategories: [],
  activeTemplateCategory: "全部",
  templatePage: 1,
  templatePageSize: 24,
  templateTotal: 0,
  templateTotalPages: 1,
  templateHasMore: false,
  templateLoading: false,
  templateError: "",
  templateSearchTimer: 0,
  templateRequestToken: 0,
  templateCacheKey: "",
  templateLoadedAt: 0,
  galleryItems: [],
  galleryPageItemIds: [],
  galleryNextCursor: "",
  galleryHasMore: true,
  galleryLoading: false,
  galleryError: "",
  pendingLibraryAutoScrollView: "",
  libraryAutoScrollFrame: 0,
  libraryAutoScrollView: "",
  libraryAutoScrollStartedAt: 0,
  libraryAutoScrollLastAt: 0,
  libraryAutoScrollToken: 0,
  inspirationItems: [],
  inspirationLoading: false,
  inspirationLastIds: [],
  recentGalleryItemIds: [],
  historyExpanded: false,
  requestStatusText: "",
  publicAssetBaseUrl: "",
};

const LOCAL_DB_NAME = "image-tool-cache";
const LOCAL_DB_VERSION = 1;
const LOCAL_DB_STORE = "workspace";
const LOCAL_DB_KEY = "current";
const LOCAL_DB_SESSIONS_KEY = "sessions";
const LOCAL_DB_SESSION_PREFIX = "session:";
const CLIENT_INSTANCE_STORAGE_KEY = "image_tool_client_id";
const CLIENT_INSTANCE_HEADER = "X-Image-Tool-Client-Id";
const MAX_LOCAL_SESSIONS = 50;
const INSPIRATION_SAMPLE_COUNT = 6;
const GALLERY_PAGE_SIZE = 20;
const LIBRARY_EAGER_IMAGE_COUNT = 8;
const TEMPLATE_LIBRARY_REFRESH_INTERVAL_MS = 5 * 60 * 1000;
const ACTIVE_IMAGE_JOB_MAX_AGE_MS = 2 * 60 * 60 * 1000;
const LIBRARY_INITIAL_IMAGE_MAX_COUNT = 16;
const LIBRARY_INITIAL_VIEWPORT_BUFFER_PX = 160;
const LIBRARY_AUTO_SCROLL_SPEED = 0.055;
const LIBRARY_AUTO_SCROLL_MAX_MS = 45000;
const LIBRARY_AUTO_SCROLL_READY_TIMEOUT_MS = 8000;
const publicAssetPreconnects = new Set();
const INSPIRATION_PLACEHOLDERS = [
  {
    id: "placeholder-portrait",
    title: "头像写真",
    prompt: "自然光头像写真，高清细节，干净背景，柔和肤色，专业摄影构图",
    tags: ["自然光", "高清"],
    tone: "cyan",
  },
  {
    id: "placeholder-product",
    title: "产品海报",
    prompt: "高级商业产品海报，精致布光，品牌感构图，干净背景，视觉焦点明确",
    tags: ["商业摄影", "品牌感"],
    tone: "violet",
  },
  {
    id: "placeholder-anime",
    title: "动漫角色",
    prompt: "精致二次元角色设定，细节丰富，干净线稿，电影感光影，完整角色立绘",
    tags: ["角色设定", "二次元"],
    tone: "rose",
  },
  {
    id: "placeholder-commerce",
    title: "电商商品图",
    prompt: "电商商品主图优化，白底高清产品图，真实材质，清晰轮廓，适合线上展示",
    tags: ["白底图", "主图优化"],
    tone: "amber",
  },
  {
    id: "placeholder-interior",
    title: "室内空间",
    prompt: "现代家居室内空间，柔和自然光，设计感陈设，舒适氛围，高级空间摄影",
    tags: ["现代家居", "设计感"],
    tone: "green",
  },
  {
    id: "placeholder-landscape",
    title: "风景壁纸",
    prompt: "电影感风景壁纸，山海湖泊，壮阔自然光，高分辨率，细腻云层与水面反射",
    tags: ["电影感", "高分辨率"],
    tone: "blue",
  },
];
initializeCustomSelects();
initialize().catch((error) => {
  console.error("初始化失败", error);
  showApp();
  showError(error.message || "初始化失败");
});

elements.tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    switchMode(button.dataset.mode);
  });
});

elements.viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    switchView(button.dataset.view);
  });
});

elements.generateForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearError();

  if (state.requestInFlight) {
    return;
  }

  if (!await ensureAuthenticatedForAction()) {
    return;
  }

  const formData = new FormData(elements.generateForm);
  const payload = {
    ...getSharedSettings(),
    prompt: String(formData.get("prompt") || "").trim(),
    size: String(formData.get("size") || "").trim(),
    quality: String(formData.get("quality") || "").trim(),
    outputFormat: String(formData.get("outputFormat") || "").trim(),
    n: String(formData.get("n") || "1").trim(),
    shareToGallery: formData.get("shareToGallery") === "true",
  };
  let sharedGalleryCount = 0;
  let galleryError = "";

  await runRequest("文生图请求发送中", "文生图完成", async () => {
    const userMessage = addConversationMessage({
      role: "user",
      mode: "generate",
      prompt: payload.prompt,
    });
    void scheduleSessionTitleSummary(payload.prompt, "generate");
    const pendingMessage = addConversationMessage({
      role: "assistant",
      mode: "generate",
      status: "pending",
      prompt: "正在生成图片...",
      relatedMessageId: userMessage.id,
    });
    const data = await submitAndPollImageJob({
      endpoint: "/api/generate/job",
      requestOptions: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
      mode: "generate",
      prompt: payload.prompt,
      pendingMessageId: pendingMessage.id,
      expectedCount: payload.n,
    });
    syncCreditsFromPayload(data);
    sharedGalleryCount = Array.isArray(data.galleryItems) ? data.galleryItems.length : 0;
    galleryError = data.galleryError || "";
    if (data.galleryError) {
      showError(`图片已生成，但保存或分享失败：${data.galleryError}`);
    } else if (data.generationError) {
      showError(data.generationError);
    }
  });
  if (payload.shareToGallery && sharedGalleryCount > 0 && !galleryError) {
    setRequestStatus("已分享至画廊");
  }
});

elements.generateForm.addEventListener("input", scheduleLocalWorkspaceSave);
elements.generateForm.addEventListener("change", scheduleLocalWorkspaceSave);

elements.editForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearError();

  if (state.requestInFlight) {
    return;
  }

  if (!await ensureAuthenticatedForAction()) {
    return;
  }

  const formData = new FormData(elements.editForm);
  if (!elements.editImages.files.length && state.uploadRestoreFallback.images) {
    for (const file of getUploadFiles("images")) {
      formData.append("images", file, file.name);
    }
  }
  if (!elements.editMask.files.length && state.uploadRestoreFallback.mask) {
    for (const file of getUploadFiles("mask").slice(0, 1)) {
      formData.append("mask", file, file.name);
    }
  }
  formData.append("model", getSharedSettings().model);
  formData.set("shareToGallery", formData.get("shareToGallery") === "true" ? "true" : "false");
  const shouldShareToGallery = formData.get("shareToGallery") === "true";
  let sharedGalleryCount = 0;
  let galleryError = "";

  await runRequest("图片编辑请求发送中", "图片编辑完成", async () => {
    const prompt = String(formData.get("prompt") || "").trim();
    const attachments = await filesToStoredImages(getUploadFiles("images"));
    const userMessage = addConversationMessage({
      role: "user",
      mode: "edit",
      prompt,
      attachments,
      maskCount: getUploadFiles("mask").length,
    });
    void scheduleSessionTitleSummary(prompt, "edit");
    const pendingMessage = addConversationMessage({
      role: "assistant",
      mode: "edit",
      status: "pending",
      prompt: "正在编辑图片...",
      relatedMessageId: userMessage.id,
    });
    const data = await submitAndPollImageJob({
      endpoint: "/api/edit/job",
      requestOptions: {
        method: "POST",
        body: formData,
      },
      mode: "edit",
      prompt,
      pendingMessageId: pendingMessage.id,
      expectedCount: formData.get("n"),
    });
    syncCreditsFromPayload(data);
    sharedGalleryCount = Array.isArray(data.galleryItems) ? data.galleryItems.length : 0;
    galleryError = data.galleryError || "";
    if (data.galleryError) {
      showError(`图片已编辑，但保存或分享失败：${data.galleryError}`);
    } else if (data.generationError) {
      showError(data.generationError);
    }
  });
  if (shouldShareToGallery && sharedGalleryCount > 0 && !galleryError) {
    setRequestStatus("已分享至画廊");
  }
});

elements.editForm.addEventListener("input", scheduleLocalWorkspaceSave);
elements.editForm.addEventListener("change", scheduleLocalWorkspaceSave);

elements.model.addEventListener("input", scheduleLocalWorkspaceSave);
elements.model.addEventListener("change", scheduleLocalWorkspaceSave);

elements.optimizeButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const mode = button.dataset.optimizeTarget;
    const promptField = getPromptField(mode);

    if (!promptField) {
      return;
    }

    const prompt = promptField.value.trim();
    if (!prompt) {
      showError("请先输入提示词");
      promptField.focus();
      return;
    }

    clearError();

    if (state.requestInFlight) {
      return;
    }

    if (!await ensureAuthenticatedForAction("输入访问 Key 后即可优化提示词")) {
      return;
    }

    await runRequest("提示词优化中", "提示词已优化", async () => {
      const response = await fetchApi("/api/optimize-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          mode,
        }),
      });
      const data = await parseResponse(response);
      promptField.value = data.optimizedPrompt || prompt;
      promptField.focus();
      promptField.setSelectionRange(promptField.value.length, promptField.value.length);
      autoResizeTextarea(promptField);
      updatePromptCounters();
      scheduleLocalWorkspaceSave();
    });
  });
});

elements.countOptions.forEach((button) => {
  button.addEventListener("click", () => {
    const form = button.dataset.countTarget === "edit" ? elements.editForm : elements.generateForm;
    const input = form.querySelector('input[name="n"]');
    const value = button.dataset.count || "1";
    input.value = value;
    syncCountButtons(form);
    scheduleLocalWorkspaceSave();
  });
});

document.querySelectorAll(".count-input").forEach((input) => {
  input.addEventListener("input", () => {
    syncCountButtons(input.form);
    scheduleLocalWorkspaceSave();
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".custom-select")) {
    closeCustomSelects();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCustomSelects();
  }
});

window.addEventListener("resize", updateOpenCustomSelectPositions);
document.addEventListener("scroll", updateOpenCustomSelectPositions, true);

[elements.generatePrompt, elements.editPrompt].forEach((textarea) => {
  textarea.addEventListener("input", () => {
    autoResizeTextarea(textarea);
    updatePromptCounters();
  });
  textarea.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      if (!state.requestInFlight) {
        textarea.form.requestSubmit();
      }
    }
  });
});

elements.editImages.addEventListener("change", () => {
  state.uploadSourceFiles.images = Array.from(elements.editImages.files || []);
  state.uploadRestoreFallback.images = false;
  renderFilePreview(elements.editImages.files, elements.imagePreviewStrip, "参考图", "imagePreviewStrip");
  scheduleLocalWorkspaceSave();
});

elements.editMask.addEventListener("change", () => {
  state.uploadSourceFiles.mask = Array.from(elements.editMask.files || []);
  state.uploadRestoreFallback.mask = false;
  renderFilePreview(elements.editMask.files, elements.maskPreviewStrip, "蒙版", "maskPreviewStrip");
  scheduleLocalWorkspaceSave();
});

elements.previewClose.addEventListener("click", closePreviewModal);
elements.previewModal.addEventListener("click", (event) => {
  if (event.target === elements.previewModal) {
    closePreviewModal();
  }
});
elements.previewDownload.addEventListener("click", () => {
  const item = getActivePreviewItem();
  if (!item || item.allowDownload === false) {
    return;
  }
  downloadImage(item.src, item.fileName);
});
elements.previewPrev.addEventListener("click", () => {
  movePreview(-1);
});
elements.previewNext.addEventListener("click", () => {
  movePreview(1);
});
elements.previewCopyPrompt.addEventListener("click", async () => {
  const item = getActivePreviewItem();
  if (!item?.prompt) {
    return;
  }

  try {
    await navigator.clipboard.writeText(item.prompt);
    setRequestStatus("已复制提示词");
  } catch (_error) {
    showError("复制提示词失败");
  }
});
elements.previewShare.addEventListener("click", () => {
  const item = getActivePreviewItem();
  if (!item?.image || item.image.galleryItemId) {
    return;
  }

  void shareImageToGallery({
    image: item.image,
    prompt: item.prompt || "",
    mode: item.mode || state.currentResultMode || state.activeMode,
    button: elements.previewShare,
    onSuccess: (galleryItem) => {
      item.image.galleryItemId = galleryItem.id;
      item.image.galleryUrl = galleryItem.imageUrl || "";
      markImageSharedToGallery(item.image, galleryItem);
      syncSharedGalleryItems([galleryItem], { markRecent: true, render: true });
      renderCurrentResultViews();
      renderConversation();
      updatePreviewModal();
      scheduleLocalWorkspaceSave(0);
    },
  });
});
elements.authForm.addEventListener("submit", handleAuthSubmit);
elements.authLinuxdoButton?.addEventListener("click", handleLinuxdoLogin);
elements.logoutButton.addEventListener("click", handleProfileButtonClick);
elements.accountButton?.addEventListener("click", () => {
  void openAccountModal();
});
elements.accountClose?.addEventListener("click", closeAccountModal);
elements.accountModal?.addEventListener("click", (event) => {
  if (event.target === elements.accountModal) {
    closeAccountModal();
  }
});
elements.accountRefresh?.addEventListener("click", () => {
  void loadAccountOverview();
});
elements.accountContent?.addEventListener("submit", (event) => {
  if (event.target?.classList?.contains("account-redeem-form")) {
    void handleAccountRedeem(event);
  }
});
elements.accountContent?.addEventListener("click", (event) => {
  const revealButton = event.target.closest?.("[data-reveal-account-key]");
  if (revealButton) {
    void revealAccountKey(revealButton.dataset.revealAccountKey);
  }
});
elements.adminUsageButton?.addEventListener("click", () => {
  void openAdminUsageModal();
});
elements.adminUsageClose?.addEventListener("click", closeAdminUsageModal);
elements.adminUsageModal?.addEventListener("click", (event) => {
  if (event.target === elements.adminUsageModal) {
    closeAdminUsageModal();
  }
});
elements.adminUsageRefresh?.addEventListener("click", () => {
  void loadAdminUsage();
});
elements.clearCacheButton.addEventListener("click", handleClearLocalCache);
elements.newChatButton.addEventListener("click", handleNewChat);
elements.historyToggleButton?.addEventListener("click", () => {
  setHistoryExpanded(!state.historyExpanded);
});
elements.refreshGalleryButton.addEventListener("click", () => {
  void loadGallery({ force: true });
});
elements.shuffleInspirationButton.addEventListener("click", () => {
  void refreshGalleryInspiration({ shuffle: true });
});
elements.viewGalleryShortcut.addEventListener("click", () => {
  switchView("gallery");
});
elements.galleryView?.addEventListener("scroll", () => {
  if (state.activeView !== "gallery" || state.galleryLoading || !state.galleryHasMore) {
    return;
  }

  const remaining = elements.galleryView.scrollHeight - elements.galleryView.scrollTop - elements.galleryView.clientHeight;
  if (remaining < 420) {
    void loadGallery({ append: true, silent: true });
  }
});
bindLibraryAutoScrollStopEvents(elements.galleryView);
bindLibraryAutoScrollStopEvents(elements.templatesView);
elements.templateSearch.addEventListener("input", () => {
  state.templatePage = 1;
  scheduleTemplateLibraryLoad();
});
document.addEventListener("keydown", (event) => {
  if (isLibraryScrollKey(event.key)) {
    stopLibraryAutoScroll();
  }
  if (event.key === "Escape") {
    closePreviewModal();
    closeAdminUsageModal();
  }
});
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    flushLocalWorkspaceSave();
  }
});
window.addEventListener("pagehide", flushLocalWorkspaceSave);

window.addEventListener("beforeunload", () => {
  revokePreviewUrls("imagePreviewStrip");
  revokePreviewUrls("maskPreviewStrip");
  flushLocalWorkspaceSave();
});

async function initialize() {
  hideAuthScreen();
  showApp();
  consumeAuthCallbackParams();

  try {
    const authStatus = await getAuthStatus();
    applyAuthStatus(authStatus);
  } catch (error) {
    console.warn("登录状态检查失败", error);
  }

  try {
    await loadConfig();
  } catch (error) {
    if (error.authRequired) {
      state.authenticated = false;
      renderAccessBadge();
    } else {
      throw error;
    }
  }

  try {
    await hydrateLocalWorkspace();
  } catch (error) {
    console.warn("本地缓存恢复失败", error);
  }
  await loadTemplateLibrary();
  void loadGallery({ silent: true });
  showApp();
  renderAccessBadge();
  if (state.authenticated) {
    resumeActiveImageJob();
  }
}

function getClientInstanceId() {
  try {
    const existingId = window.localStorage?.getItem(CLIENT_INSTANCE_STORAGE_KEY);
    if (existingId) {
      return existingId;
    }
    const nextId = `client-${window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`}`;
    window.localStorage?.setItem(CLIENT_INSTANCE_STORAGE_KEY, nextId);
    return nextId;
  } catch (_error) {
    return `client-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

function withClientInstanceHeaders(headers = {}) {
  const nextHeaders = new Headers(headers || {});
  nextHeaders.set(CLIENT_INSTANCE_HEADER, getClientInstanceId());
  return nextHeaders;
}

function withClientInstanceRequest(requestOptions = {}) {
  return {
    ...requestOptions,
    headers: withClientInstanceHeaders(requestOptions.headers),
  };
}

function fetchApi(input, requestOptions = {}) {
  return fetch(input, withClientInstanceRequest(requestOptions));
}

async function loadConfig() {
  const response = await fetchApi("/api/config");
  const config = await parseResponse(response);
  state.defaultModel = config.defaultModel || "gpt-image-2";
  state.galleryEnabled = Boolean(config.galleryEnabled);
  state.publicAssetBaseUrl = normalizePublicAssetBaseUrl(config.publicAssetBaseUrl);
  ensurePublicAssetPreconnect(state.publicAssetBaseUrl);
  elements.model.value = state.defaultModel;
  elements.serverKeyBadge.textContent = config.hasServerKey ? "已检测到服务端密钥" : "未检测到服务端密钥";
  elements.serverKeyBadge.classList.toggle("badge-success", Boolean(config.hasServerKey));
  elements.serverKeyBadge.classList.toggle("badge-muted", !config.hasServerKey);
  renderAccessBadge(config);
}

async function hydrateLocalWorkspace() {
  if (!window.indexedDB) {
    renderEmptyResultsState();
    return;
  }

  state.localHydrating = true;

  try {
    resetWorkspaceUi();

    const workspace = await initializeLocalSessions();
    if (!workspace) {
      switchMode("generate");
      renderHistory();
      return;
    }

    if (workspace.model) {
      elements.model.value = workspace.model;
    }

    applyFormState(elements.generateForm, workspace.forms?.generate);
    applyFormState(elements.editForm, workspace.forms?.edit);

    const restoredMode = workspace.activeMode === "edit" ? "edit" : "generate";
    state.currentResultMode = workspace.resultMode === "edit" ? "edit" : restoredMode;
    state.activeImageJob = normalizeStoredImageJob(workspace.activeJob);
    state.currentSessionTitle = String(workspace.title || "").trim();
    switchMode(restoredMode);

    const imageFiles = deserializeFiles(workspace.uploads?.images);
    const maskFiles = deserializeFiles(workspace.uploads?.mask).slice(0, 1);

    state.uploadSourceFiles.images = imageFiles;
    state.uploadSourceFiles.mask = maskFiles;
    state.uploadRestoreFallback.images = !restoreFilesToInput(elements.editImages, imageFiles);
    state.uploadRestoreFallback.mask = !restoreFilesToInput(elements.editMask, maskFiles);

    renderFilePreview(getUploadFiles("images"), elements.imagePreviewStrip, "参考图", "imagePreviewStrip");
    renderFilePreview(getUploadFiles("mask"), elements.maskPreviewStrip, "蒙版", "maskPreviewStrip");
    syncAllCountButtons();
    autoResizeAllTextareas();

    const images = normalizeStoredImages(workspace.results);
    state.messages = normalizeStoredMessages(workspace.messages);
    if (images.length) {
      renderResults(images, { append: false, skipConversation: true });
    } else {
      renderEmptyResultsState();
    }
    renderConversation();
  } finally {
    state.localHydrating = false;
  }
}

async function saveLocalWorkspace() {
  if (!window.indexedDB) {
    return;
  }

  const workspace = await buildLocalWorkspaceSnapshot();
  if (!workspace) {
    return;
  }

  await saveWorkspaceSession(workspace);
}

function scheduleLocalWorkspaceSave(delayMs = 260) {
  if (state.localHydrating) {
    return;
  }

  clearScheduledLocalWorkspaceSave();
  state.localPersistTimer = window.setTimeout(() => {
    state.localPersistTimer = null;
    void saveLocalWorkspace().catch((error) => {
      console.warn("本地缓存保存失败", error);
    });
  }, delayMs);
}

function clearScheduledLocalWorkspaceSave() {
  if (state.localPersistTimer) {
    clearTimeout(state.localPersistTimer);
    state.localPersistTimer = null;
  }
}

function flushLocalWorkspaceSave() {
  if (state.localHydrating) {
    return;
  }

  clearScheduledLocalWorkspaceSave();
  void saveLocalWorkspace().catch((error) => {
    console.warn("本地缓存保存失败", error);
  });
}

async function buildLocalWorkspaceSnapshot(options = {}) {
  const existingSession = state.sessions.find((session) => session.id === state.activeSessionId);
  const createdAt = existingSession?.createdAt || Date.now();
  const updatedAt = options.preserveUpdatedAt && existingSession?.updatedAt
    ? existingSession.updatedAt
    : Date.now();

  return {
    version: LOCAL_DB_VERSION,
    sessionId: state.activeSessionId || createSessionId(),
    title: state.currentSessionTitle,
    createdAt,
    updatedAt,
    activeMode: state.activeMode,
    resultMode: state.currentResultMode,
    activeJob: normalizeStoredImageJob(state.activeImageJob),
    model: elements.model.value.trim() || state.defaultModel,
    forms: {
      generate: getFormValues(elements.generateForm),
      edit: getFormValues(elements.editForm),
    },
    uploads: {
      images: await serializeFiles(getUploadFiles("images")),
      mask: await serializeFiles(getUploadFiles("mask")),
    },
    results: normalizeStoredImages(state.currentImages),
    messages: normalizeStoredMessages(state.messages),
  };
}

function createSessionId() {
  if (window.crypto?.randomUUID) {
    return `session-${window.crypto.randomUUID()}`;
  }
  return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getSessionKey(sessionId) {
  return `${LOCAL_DB_SESSION_PREFIX}${sessionId}`;
}

function getLatestPromptFromMessages(messages) {
  const normalizedMessages = normalizeStoredMessages(messages);
  const sourcePromptMessage = [...normalizedMessages]
    .reverse()
    .find((message) => message.sourcePrompt);
  if (sourcePromptMessage) {
    return sourcePromptMessage.sourcePrompt;
  }

  return [...normalizedMessages]
    .reverse()
    .find((message) => message.role === "user" && message.prompt)
    ?.prompt || "";
}

function getFirstImageFromWorkspace(workspace) {
  return normalizeStoredImages(workspace?.results)[0]?.dataUrl
    || normalizeStoredMessages(workspace?.messages).flatMap((message) => message.images || [])[0]?.dataUrl
    || "";
}

function getWorkspacePromptSummary(workspace) {
  const promptFromMessages = getLatestPromptFromMessages(workspace?.messages);
  if (promptFromMessages) {
    return promptFromMessages;
  }

  const activeFormPrompt = workspace?.forms?.[workspace?.activeMode]?.prompt;
  const generatePrompt = workspace?.forms?.generate?.prompt;
  const editPrompt = workspace?.forms?.edit?.prompt;
  return String(activeFormPrompt || generatePrompt || editPrompt || "").trim();
}

function getWorkspaceImageCount(workspace) {
  const resultImages = normalizeStoredImages(workspace?.results);
  if (resultImages.length) {
    return resultImages.length;
  }

  const messageImages = normalizeStoredMessages(workspace?.messages).flatMap((message) => message.images || []);
  return mergeResultImages(messageImages, []).length;
}

function getWorkspaceActivityTime(workspace) {
  const timestamps = [
    Number(workspace?.updatedAt) || 0,
    Number(workspace?.createdAt) || 0,
    ...normalizeStoredMessages(workspace?.messages).map((message) => Number(message.createdAt) || 0),
  ];
  return Math.max(...timestamps) || Date.now();
}

function formatHistoryTime(timestamp) {
  const time = parseTimestampMs(timestamp);
  if (!time) {
    return "刚刚";
  }

  const date = new Date(time);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;

  if (time >= todayStart) {
    return `今天 ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  }
  if (time >= yesterdayStart) {
    return "昨天";
  }
  if (date.getFullYear() === now.getFullYear()) {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}

function parseTimestampMs(value) {
  if (value instanceof Date) {
    const time = value.getTime();
    return Number.isFinite(time) ? time : 0;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0 ? value : 0;
  }

  const text = String(value || "").trim();
  if (!text) {
    return 0;
  }

  const numeric = Number(text);
  if (Number.isFinite(numeric) && numeric > 0) {
    return numeric;
  }

  const parsed = Date.parse(text);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getHistoryStatusLabel(workspace, imageCount) {
  const messages = normalizeStoredMessages(workspace?.messages);
  const pendingMessage = [...messages].reverse().find((message) => message.status === "pending");
  if (pendingMessage) {
    return pendingMessage.mode === "edit" ? "编辑中" : "生成中";
  }

  if (imageCount > 0) {
    return workspace?.resultMode === "edit" ? "编辑完成" : "生成完成";
  }

  return "编辑中";
}

function getHistoryDetail(session, imageCount, updatedAt) {
  if (imageCount > 0) {
    return `${imageCount} 张图片 · ${formatHistoryTime(updatedAt)}`;
  }

  return "草稿 · 未生成";
}

function getHistoryTitle(value, fallback) {
  const title = normalizeSessionTitleText(value);
  if (title && title.length <= 14) {
    return title;
  }
  return fallback;
}

function normalizeSessionTitleText(value) {
  return String(value || "")
    .replace(/^(标题|会话标题|创作标题|title|name|summary)\s*[:：]\s*/i, "")
    .replace(/[“”"']/g, "")
    .replace(/[{}[\]<>`*_#|\\/]/g, " ")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/[，。！？、；：,.!?;:()（）【】《》]/g, " ")
    .replace(/\b(prompt|model|size|quality|json|negative|seed|style|ratio|width|height)\b/gi, " ")
    .replace(/\s+/g, "")
    .trim();
}

function buildFallbackSessionTitle(prompt, mode = "generate") {
  const text = normalizeSessionTitleText(prompt);
  if (!text) {
    return mode === "edit" ? "图片编辑" : "图片创作";
  }

  const keywords = [
    ["猫", "猫咪", "喵", "cat"],
    ["狗", "金毛", "狗狗", "dog"],
    ["头像", "写真", "portrait"],
    ["产品", "商品", "海报", "product"],
    ["动漫", "角色", "anime"],
    ["室内", "家居", "空间", "interior"],
    ["风景", "山海", "湖泊", "landscape"],
    ["城市", "赛博", "霓虹", "city"],
  ];

  for (const group of keywords) {
    if (group.some((keyword) => text.toLowerCase().includes(keyword.toLowerCase()))) {
      return `${group[0]}创作`;
    }
  }

  return mode === "edit" ? "图片编辑" : "图片创作";
}

async function scheduleSessionTitleSummary(prompt, mode) {
  const sessionId = state.activeSessionId;
  const normalizedPrompt = String(prompt || "").trim();
  if (!normalizedPrompt) {
    return;
  }

  try {
    const response = await fetchApi("/api/summarize-title", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: normalizedPrompt, mode }),
    });
    const data = await parseResponse(response);
    const title = normalizeSessionTitleText(data.title) || buildFallbackSessionTitle(normalizedPrompt, mode);
    if (sessionId !== state.activeSessionId) {
      return;
    }

    state.currentSessionTitle = title;
    await persistCurrentSessionTitle();
  } catch (_error) {
    if (sessionId !== state.activeSessionId) {
      return;
    }

    state.currentSessionTitle = buildFallbackSessionTitle(normalizedPrompt, mode);
    await persistCurrentSessionTitle();
  }
}

async function persistCurrentSessionTitle() {
  try {
    await saveWorkspaceSession(await buildLocalWorkspaceSnapshot({ preserveUpdatedAt: true }), { renderHistory: false });
  } catch (error) {
    console.warn("标题保存失败", error);
  }
  renderHistory();
}

function buildSessionSummary(workspace) {
  const normalized = normalizeStoredWorkspace(workspace);
  const sessionId = normalized?.sessionId || createSessionId();
  const updatedAt = getWorkspaceActivityTime(normalized);
  const imageCount = getWorkspaceImageCount(normalized);
  const promptSummary = getWorkspacePromptSummary(normalized);
  const fallbackTitle = sessionId === state.activeSessionId ? "当前创作" : "未命名创作";
  const sessionTitle = String(normalized?.title || "").trim();
  const preferredTitle = normalizeSessionTitleText(sessionTitle)
    || (promptSummary ? buildFallbackSessionTitle(promptSummary, normalized?.resultMode) : fallbackTitle);
  const detail = getHistoryDetail(normalized, imageCount, updatedAt);

  return {
    id: sessionId,
    title: getHistoryTitle(preferredTitle, fallbackTitle),
    detail,
    meta: detail,
    imageCount,
    timeLabel: formatHistoryTime(updatedAt),
    status: getHistoryStatusLabel(normalized, imageCount),
    thumbnail: getFirstImageFromWorkspace(normalized),
    createdAt: normalized?.createdAt || Date.now(),
    updatedAt,
  };
}

function normalizeSessionSummaries(sessions) {
  const seen = new Set();
  return (Array.isArray(sessions) ? sessions : [])
    .map((session) => {
      if (!session || typeof session !== "object") {
        return null;
      }

      const id = String(session.id || "").trim();
      if (!id || seen.has(id)) {
        return null;
      }
      seen.add(id);

      const updatedAt = Number(session.updatedAt) || Date.now();
      const imageCount = Math.max(0, Number(session.imageCount) || (session.thumbnail ? 1 : 0));
      const detail = getHistoryDetail(session, imageCount, updatedAt);

      return {
        id,
        title: getHistoryTitle(session.title, "未命名创作"),
        detail,
        meta: detail,
        imageCount,
        timeLabel: String(session.timeLabel || formatHistoryTime(updatedAt)).trim(),
        status: String(session.status || (imageCount > 0 ? "生成完成" : "编辑中")).trim(),
        thumbnail: String(session.thumbnail || "").trim(),
        createdAt: Number(session.createdAt) || Date.now(),
        updatedAt,
      };
    })
    .filter(Boolean)
    .sort((left, right) => right.updatedAt - left.updatedAt)
    .slice(0, MAX_LOCAL_SESSIONS);
}

async function hydrateStoredSessionSummaries(sessions) {
  const hydratedSessions = [];

  for (const session of sessions) {
    const workspace = await readWorkspaceSession(session.id);
    hydratedSessions.push(workspace ? buildSessionSummary({ ...workspace, sessionId: workspace.sessionId || session.id }) : session);
  }

  return normalizeSessionSummaries(hydratedSessions);
}

async function initializeLocalSessions() {
  const storedSessions = normalizeSessionSummaries(await readLocalValue(LOCAL_DB_SESSIONS_KEY));
  const legacyWorkspace = await readLocalWorkspace();
  let sessions = storedSessions.length ? await hydrateStoredSessionSummaries(storedSessions) : storedSessions;
  let activeWorkspace = null;

  if (sessions.length) {
    const firstSession = sessions[0];
    activeWorkspace = await readWorkspaceSession(firstSession.id);
    state.activeSessionId = firstSession.id;
  } else if (legacyWorkspace) {
    const sessionId = legacyWorkspace.sessionId || createSessionId();
    activeWorkspace = { ...legacyWorkspace, sessionId };
    state.activeSessionId = sessionId;
    sessions = [buildSessionSummary(activeWorkspace)];
    state.sessions = sessions;
    await saveWorkspaceSession(activeWorkspace);
    return normalizeStoredWorkspace(activeWorkspace);
  } else {
    state.activeSessionId = createSessionId();
    sessions = [buildSessionSummary({ sessionId: state.activeSessionId, createdAt: Date.now(), updatedAt: Date.now() })];
    await writeLocalValue(LOCAL_DB_SESSIONS_KEY, sessions);
  }

  state.sessions = normalizeSessionSummaries(sessions);
  if (storedSessions.length) {
    await writeLocalValue(LOCAL_DB_SESSIONS_KEY, state.sessions);
  }
  return normalizeStoredWorkspace(activeWorkspace);
}

async function readWorkspaceSession(sessionId) {
  const workspace = await readLocalValue(getSessionKey(sessionId));
  return normalizeStoredWorkspace(workspace);
}

async function saveWorkspaceSession(workspace, options = {}) {
  const normalized = normalizeStoredWorkspace(workspace);
  if (!normalized) {
    return;
  }

  const sessionId = normalized.sessionId || state.activeSessionId || createSessionId();
  const nextWorkspace = { ...normalized, sessionId };
  const summary = buildSessionSummary(nextWorkspace);
  state.activeSessionId = sessionId;
  state.sessions = normalizeSessionSummaries([
    summary,
    ...state.sessions.filter((session) => session.id !== sessionId),
  ]);

  await writeLocalValue(getSessionKey(sessionId), nextWorkspace);
  await writeLocalValue(LOCAL_DB_SESSIONS_KEY, state.sessions);
  await writeLocalValue(LOCAL_DB_KEY, nextWorkspace);
  if (options.renderHistory !== false) {
    renderHistory();
  }
}

async function readLocalWorkspace() {
  return readLocalValue(LOCAL_DB_KEY);
}

async function readLocalValue(key) {
  const db = await openLocalWorkspaceDb();
  if (!db) {
    return null;
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(LOCAL_DB_STORE, "readonly");
    const store = transaction.objectStore(LOCAL_DB_STORE);
    const request = store.get(key);

    request.onsuccess = () => {
      resolve(request.result || null);
    };
    request.onerror = () => {
      reject(request.error || new Error("读取本地缓存失败"));
    };
    transaction.onerror = () => {
      reject(transaction.error || request.error || new Error("读取本地缓存失败"));
    };
  });
}

async function writeLocalValue(key, value) {
  const db = await openLocalWorkspaceDb();
  if (!db) {
    return null;
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(LOCAL_DB_STORE, "readwrite");
    const store = transaction.objectStore(LOCAL_DB_STORE);
    const request = store.put(value, key);

    request.onerror = () => {
      reject(request.error || new Error("保存本地缓存失败"));
    };
    transaction.oncomplete = () => {
      resolve();
    };
    transaction.onerror = () => {
      reject(transaction.error || request.error || new Error("保存本地缓存失败"));
    };
    transaction.onabort = () => {
      reject(transaction.error || request.error || new Error("保存本地缓存失败"));
    };
  });
}

async function deleteLocalValue(key) {
  const db = await openLocalWorkspaceDb();
  if (!db) {
    return null;
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(LOCAL_DB_STORE, "readwrite");
    const store = transaction.objectStore(LOCAL_DB_STORE);
    const request = store.delete(key);

    request.onerror = () => {
      reject(request.error || new Error("删除本地记录失败"));
    };
    transaction.oncomplete = () => {
      resolve();
    };
    transaction.onerror = () => {
      reject(transaction.error || request.error || new Error("删除本地记录失败"));
    };
    transaction.onabort = () => {
      reject(transaction.error || request.error || new Error("删除本地记录失败"));
    };
  });
}

async function deleteLocalWorkspace() {
  const db = await openLocalWorkspaceDb();
  if (!db) {
    return null;
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(LOCAL_DB_STORE, "readwrite");
    const store = transaction.objectStore(LOCAL_DB_STORE);
    const request = store.clear();

    request.onerror = () => {
      reject(request.error || new Error("清空本地缓存失败"));
    };
    transaction.oncomplete = () => {
      resolve();
    };
    transaction.onerror = () => {
      reject(transaction.error || request.error || new Error("清空本地缓存失败"));
    };
    transaction.onabort = () => {
      reject(transaction.error || request.error || new Error("清空本地缓存失败"));
    };
  });
}

async function openLocalWorkspaceDb() {
  if (!window.indexedDB) {
    return null;
  }

  if (!state.localDbPromise) {
    state.localDbPromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(LOCAL_DB_NAME, LOCAL_DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(LOCAL_DB_STORE)) {
          db.createObjectStore(LOCAL_DB_STORE);
        }
      };

      request.onsuccess = () => {
        const db = request.result;
        db.onversionchange = () => {
          db.close();
          state.localDbPromise = null;
        };
        resolve(db);
      };

      request.onerror = () => {
        reject(request.error || new Error("打开本地缓存失败"));
      };
    }).catch((error) => {
      state.localDbPromise = null;
      throw error;
    });
  }

  return state.localDbPromise;
}

function resetWorkspaceUi() {
  elements.generateForm.reset();
  elements.editForm.reset();
  elements.model.value = state.defaultModel;
  elements.editImages.value = "";
  elements.editMask.value = "";
  state.uploadSourceFiles.images = [];
  state.uploadSourceFiles.mask = [];
  state.uploadRestoreFallback.images = false;
  state.uploadRestoreFallback.mask = false;
  revokePreviewUrls("imagePreviewStrip");
  revokePreviewUrls("maskPreviewStrip");
  elements.imagePreviewStrip.innerHTML = "";
  elements.maskPreviewStrip.innerHTML = "";
  closePreviewModal();
  state.currentImages = [];
  state.currentResultMode = "generate";
  state.currentSessionTitle = "";
  state.activeImageJob = null;
  state.messages = [];
  syncAllCountButtons();
  syncCustomSelects();
  autoResizeAllTextareas();
  renderEmptyResultsState();
  renderConversation();
}

function collectLocalGalleryImages() {
  const messageImages = state.messages.flatMap((message) => message.images || []);
  return mergeResultImages(state.currentImages, messageImages).slice(0, 12);
}

function renderCanvasWelcomeState() {
  elements.resultCanvasGrid.dataset.state = "empty";
  delete elements.resultCanvasGrid.dataset.count;
  elements.resultCanvasGrid.setAttribute("aria-busy", "false");
  elements.resultCanvasGrid.innerHTML = `
    <div class="canvas-empty">
      <span class="canvas-badge">准备生成</span>
      <h2>今天你想创造什么？</h2>
      <p>输入描述，生成结果会显示在这里</p>
    </div>
  `;
  updateWorkspacePresentation();
}

function renderCanvasLoadingState(statusText = "正在生成") {
  elements.resultCanvasGrid.dataset.state = "loading";
  delete elements.resultCanvasGrid.dataset.count;
  elements.resultCanvasGrid.setAttribute("aria-busy", "true");
  elements.resultCanvasGrid.innerHTML = `
    <div class="canvas-loading" role="status" aria-live="polite">
      <div class="loading-preview" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span class="canvas-badge">${escapeHtml(statusText)}</span>
      <p>生成中</p>
    </div>
  `;
  updateWorkspacePresentation();
}

function setRequestStatus(text) {
  state.requestStatusText = String(text || "").trim();
  const requestStatus = document.getElementById("request-status");
  if (requestStatus) {
    requestStatus.textContent = state.requestStatusText;
  }
}

function renderResultCanvas(images = state.currentImages) {
  const normalizedImages = normalizeStoredImages(images);
  if (!normalizedImages.length) {
    renderCanvasWelcomeState();
    return;
  }

  elements.resultCanvasGrid.dataset.state = "results";
  elements.resultCanvasGrid.dataset.count = String(Math.min(normalizedImages.length, 8));
  elements.resultCanvasGrid.setAttribute("aria-busy", "false");
  elements.resultCanvasGrid.innerHTML = normalizedImages
    .map((image, index) => renderResultTile(image, index, { variant: "canvas" }))
    .join("");
  bindResultGridActions(elements.resultCanvasGrid, normalizedImages);
  updateWorkspacePresentation();
}

function renderLocalGalleryRail(images = collectLocalGalleryImages()) {
  const normalizedImages = normalizeStoredImages(images);
  elements.resultsGrid.dataset.state = normalizedImages.length ? "results" : "empty";
  delete elements.resultsGrid.dataset.count;

  if (!normalizedImages.length) {
    elements.resultsGrid.innerHTML = `
      <div class="empty-state compact-empty mini-empty result-empty">
        <p>暂无本地图片</p>
        <small>生成结果会在这里同步显示</small>
      </div>
    `;
    return;
  }

  elements.resultsGrid.dataset.count = String(Math.min(normalizedImages.length, 8));
  elements.resultsGrid.innerHTML = normalizedImages
    .map((image, index) => renderResultTile(image, index, { variant: "rail" }))
    .join("");
  bindResultGridActions(elements.resultsGrid, normalizedImages);
}

function renderCurrentResultViews() {
  if (state.currentImages.length) {
    renderResultCanvas(state.currentImages);
  } else {
    renderCanvasWelcomeState();
  }
  renderLocalGalleryRail();
  renderInspirationGrid();
}

function renderEmptyResultsState() {
  state.currentImages = [];
  state.currentResultMode = "generate";
  renderCanvasWelcomeState();
  renderLocalGalleryRail();
}

function updateWorkspacePresentation() {
  const canvasState = elements.resultCanvasGrid?.dataset.state || "empty";
  const hasResults = state.currentImages.length > 0 && canvasState === "results";
  const isLoading = state.requestInFlight || canvasState === "loading";
  const changed =
    Boolean(elements.chatMain && elements.chatMain.classList.contains("has-results")) !== hasResults
    || Boolean(elements.chatMain && elements.chatMain.classList.contains("is-loading")) !== isLoading;

  elements.chatMain?.classList.toggle("has-results", hasResults);
  elements.chatMain?.classList.toggle("is-loading", isLoading);
  elements.appShell?.classList.toggle("has-results", hasResults);
  elements.appShell?.classList.toggle("is-loading", isLoading);

  if (!state.requestInFlight) {
    setRequestStatus(getReadyRequestStatus(state.activeMode));
  }
  if (changed) {
    autoResizeAllTextareas();
  }
}

function getFormValues(form) {
  return Array.from(form.elements).reduce((values, field) => {
    if (!field.name || field.disabled) {
      return values;
    }

    if (field.type === "file" || field.type === "submit" || field.type === "button" || field.type === "reset") {
      return values;
    }

    if (field.type === "checkbox") {
      values[field.name] = field.checked;
      return values;
    }

    if (field.type === "radio") {
      if (field.checked) {
        values[field.name] = field.value;
      }
      return values;
    }

    values[field.name] = field.value;
    return values;
  }, {});
}

function applyFormState(form, values) {
  if (!values || typeof values !== "object") {
    syncCustomSelects();
    return;
  }

  Array.from(form.elements).forEach((field) => {
    if (!field.name || !Object.prototype.hasOwnProperty.call(values, field.name)) {
      return;
    }

    const value = values[field.name];

    if (field.type === "checkbox") {
      field.checked = value === true || String(value).trim().toLowerCase() === "true" || String(value).trim() === "1";
      return;
    }

    if (field.type === "radio") {
      field.checked = String(field.value) === String(value);
      return;
    }

    field.value = String(value);
  });
  syncCustomSelects();
}

async function serializeFiles(fileList) {
  return Promise.all(
    Array.from(fileList || []).map(async (file) => ({
      name: file.name || "image.png",
      type: file.type || "application/octet-stream",
      lastModified: file.lastModified || Date.now(),
      blob: file.slice(0, file.size, file.type || "application/octet-stream"),
    }))
  );
}

function deserializeFiles(records) {
  if (!Array.isArray(records)) {
    return [];
  }

  return records
    .map((record) => {
      if (!record || !record.blob) {
        return null;
      }

      try {
        return new File([record.blob], record.name || "image.png", {
          type: record.type || record.blob.type || "application/octet-stream",
          lastModified: record.lastModified || Date.now(),
        });
      } catch (_error) {
        return null;
      }
    })
    .filter(Boolean);
}

function restoreFilesToInput(input, files) {
  input.value = "";

  const normalizedFiles = Array.from(files || []).filter(Boolean);
  if (!normalizedFiles.length || typeof DataTransfer === "undefined") {
    return false;
  }

  try {
    const transfer = new DataTransfer();
    normalizedFiles.forEach((file) => {
      transfer.items.add(file);
    });
    input.files = transfer.files;
    return input.files && input.files.length === normalizedFiles.length;
  } catch (_error) {
    return false;
  }
}

function getUploadFiles(fieldName) {
  const input = fieldName === "mask" ? elements.editMask : elements.editImages;
  const currentFiles = Array.from(input.files || []);

  if (currentFiles.length || !state.uploadRestoreFallback[fieldName]) {
    return currentFiles;
  }

  return state.uploadSourceFiles[fieldName] || [];
}

function normalizeStoredWorkspace(workspace) {
  if (!workspace || typeof workspace !== "object") {
    return null;
  }

  const createdAt = Number(workspace.createdAt) || Number(workspace.updatedAt) || Date.now();

  return {
    version: Number(workspace.version) || LOCAL_DB_VERSION,
    sessionId: String(workspace.sessionId || state.activeSessionId || "").trim(),
    title: String(workspace.title || "").trim(),
    createdAt,
    updatedAt: Number(workspace.updatedAt) || Date.now(),
    activeMode: workspace.activeMode === "edit" ? "edit" : "generate",
    resultMode: workspace.resultMode === "edit" ? "edit" : "generate",
    activeJob: normalizeStoredImageJob(workspace.activeJob),
    model: String(workspace.model || "").trim(),
    forms: {
      generate: normalizeStoredFormValues(workspace.forms?.generate),
      edit: normalizeStoredFormValues(workspace.forms?.edit),
    },
    uploads: {
      images: Array.isArray(workspace.uploads?.images) ? workspace.uploads.images : [],
      mask: Array.isArray(workspace.uploads?.mask) ? workspace.uploads.mask : [],
    },
    results: normalizeStoredImages(workspace.results),
    messages: normalizeStoredMessages(workspace.messages),
  };
}

function normalizeStoredImageJob(job) {
  if (!job || typeof job !== "object") {
    return null;
  }

  const jobId = String(job.jobId || job.id || "").trim();
  if (!/^[a-z0-9:_-]{8,96}$/i.test(jobId)) {
    return null;
  }

  const createdAt = Number(job.createdAt) || Date.now();
  return {
    jobId,
    mode: job.mode === "edit" ? "edit" : "generate",
    prompt: String(job.prompt || "").trim(),
    pendingMessageId: String(job.pendingMessageId || "").trim(),
    expectedCount: normalizeRequestedImageCount(job.expectedCount),
    createdAt,
    updatedAt: Number(job.updatedAt) || createdAt,
  };
}

function isStoredImageJobExpired(job) {
  return !job?.createdAt || Date.now() - Number(job.createdAt) > ACTIVE_IMAGE_JOB_MAX_AGE_MS;
}

function normalizeStoredFormValues(values) {
  if (!values || typeof values !== "object") {
    return {};
  }

  return Object.entries(values).reduce((accumulator, [key, value]) => {
    if (value === undefined || value === null) {
      return accumulator;
    }

    accumulator[key] = typeof value === "boolean" ? value : String(value);
    return accumulator;
  }, {});
}

function normalizeStoredImages(images) {
  if (!Array.isArray(images)) {
    return [];
  }

  return images
    .map((image) => {
      const dataUrl = String(image?.dataUrl || "").trim();
      if (!dataUrl) {
        return null;
      }

      return {
        resultId: String(image?.resultId || "").trim(),
        dataUrl,
        revisedPrompt: String(image?.revisedPrompt || "").trim(),
        remoteUrl: String(image?.remoteUrl || "").trim(),
        objectKey: String(image?.objectKey || "").trim(),
        storedUrl: String(image?.storedUrl || "").trim(),
        fileExtension: String(image?.fileExtension || "").trim(),
        galleryItemId: String(image?.galleryItemId || "").trim(),
        galleryUrl: String(image?.galleryUrl || "").trim(),
        displayObjectKey: String(image?.displayObjectKey || "").trim(),
        displayUrl: String(image?.displayUrl || "").trim(),
        displayMimeType: String(image?.displayMimeType || "").trim(),
        displayWidth: normalizeNonNegativeNumber(image?.displayWidth),
        displayHeight: normalizeNonNegativeNumber(image?.displayHeight),
        displaySize: normalizeNonNegativeNumber(image?.displaySize),
        originalWidth: normalizeNonNegativeNumber(image?.originalWidth),
        originalHeight: normalizeNonNegativeNumber(image?.originalHeight),
        originalMimeType: String(image?.originalMimeType || "").trim(),
        originalSize: normalizeNonNegativeNumber(image?.originalSize),
        thumbnailObjectKey: String(image?.thumbnailObjectKey || "").trim(),
        thumbnailUrl: String(image?.thumbnailUrl || "").trim(),
      };
    })
    .filter(Boolean);
}

function normalizeStoredMessages(messages) {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .map((message) => {
      if (!message || typeof message !== "object") {
        return null;
      }

      const role = message.role === "assistant" ? "assistant" : "user";
      const images = normalizeStoredImages(message.images);
      const attachments = normalizeStoredImages(message.attachments);

      return {
        id: String(message.id || `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`),
        role,
        mode: message.mode === "edit" ? "edit" : "generate",
        prompt: String(message.prompt || "").trim(),
        status: message.status === "pending" ? "pending" : "done",
        createdAt: Number(message.createdAt) || Date.now(),
        images,
        attachments,
        maskCount: Number(message.maskCount) || 0,
        relatedMessageId: String(message.relatedMessageId || ""),
        sourcePrompt: String(message.sourcePrompt || "").trim(),
      };
    })
    .filter(Boolean);
}

async function getAuthStatus() {
  const response = await fetchApi("/api/auth/status");
  return parseResponse(response);
}

function consumeAuthCallbackParams() {
  try {
    const url = new URL(window.location.href);
    const authError = url.searchParams.get("auth_error");
    const authSuccess = url.searchParams.get("auth");
    if (authError) {
      showError(authError);
    } else if (authSuccess === "linuxdo") {
      setRequestStatus("Linux.do 登录成功");
    }
    if (authError || authSuccess) {
      url.searchParams.delete("auth_error");
      url.searchParams.delete("auth");
      window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    }
  } catch (_error) {
    // Ignore URL cleanup failures.
  }
}

function applyAuthStatus(authStatus = {}) {
  state.authEnabled = Boolean(authStatus.authEnabled);
  state.authenticated = Boolean(authStatus.authenticated);
  state.authMode = authStatus.authMode === "hybrid"
    ? "hybrid"
    : (authStatus.authMode === "unkey" ? "unkey" : (authStatus.authMode === "none" ? "none" : "password"));
  state.loginType = String(authStatus.loginType || "").trim();
  state.account = authStatus.account || null;
  state.isAdmin = Boolean(authStatus.isAdmin);
  state.permissions = Array.isArray(authStatus.permissions) ? authStatus.permissions : [];
  syncCreditsFromPayload(authStatus);
  renderAuthFormMode();
  renderAccessBadge();
  renderAdminControls();
  renderAccountControls();
  renderProfileButton();
}

function syncCreditsFromPayload(payload = {}) {
  const value = payload.creditsRemaining ?? payload.credits;
  if (value === null) {
    state.creditsRemaining = null;
    renderAccessBadge();
    return;
  }
  const parsed = Number.parseInt(value, 10);
  if (Number.isFinite(parsed)) {
    state.creditsRemaining = parsed;
    renderAccessBadge();
  }
}

function renderAccessBadge(config = {}) {
  if (!elements.serverKeyBadge) {
    return;
  }

  if (state.authEnabled && !state.authenticated) {
    elements.serverKeyBadge.textContent = state.authMode === "unkey" ? "未登录 · 输入 Key 后生成" : "未登录";
    elements.serverKeyBadge.classList.toggle("badge-success", false);
    elements.serverKeyBadge.classList.toggle("badge-muted", true);
    return;
  }

  if (state.authMode === "unkey") {
    const credits = state.creditsRemaining;
    if (state.isAdmin) {
      elements.serverKeyBadge.textContent = "管理员 · 免费生成";
      elements.serverKeyBadge.classList.toggle("badge-success", true);
      elements.serverKeyBadge.classList.toggle("badge-muted", false);
      return;
    }
    elements.serverKeyBadge.textContent = credits === null || credits === undefined
      ? "额度无限"
      : `剩余额度 ${credits}`;
    elements.serverKeyBadge.classList.toggle("badge-success", true);
    elements.serverKeyBadge.classList.toggle("badge-muted", false);
    return;
  }

  if (Object.prototype.hasOwnProperty.call(config, "hasServerKey")) {
    elements.serverKeyBadge.textContent = config.hasServerKey ? "已检测到服务端密钥" : "未检测到服务端密钥";
    elements.serverKeyBadge.classList.toggle("badge-success", Boolean(config.hasServerKey));
    elements.serverKeyBadge.classList.toggle("badge-muted", !config.hasServerKey);
  }
}

function renderAdminControls() {
  elements.adminUsageButton?.classList.toggle("is-hidden", !state.isAdmin);
}

function renderAuthFormMode() {
  const isUnkey = state.authMode === "unkey";
  if (elements.authTitle) {
    elements.authTitle.textContent = isUnkey ? "请输入访问 Key" : "请输入访问密码";
  }
  if (elements.authFieldLabel) {
    elements.authFieldLabel.textContent = isUnkey ? "访问 Key" : "密码";
  }
  if (elements.authPassword) {
    elements.authPassword.placeholder = isUnkey ? "请输入访问 Key" : "请输入密码";
  }
}

function getAuthPromptMessage() {
  if (!state.authEnabled) {
    return "";
  }
  return state.authMode === "unkey" ? "输入访问 Key 后即可开始生成" : "请输入密码后继续";
}

function getExpiredAuthMessage() {
  return state.authMode === "unkey" ? "访问 Key 已失效，请重新输入" : "登录已过期，请重新输入密码";
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  clearAuthError();

  const accessKey = elements.authPassword.value.trim();
  if (!accessKey) {
    showAuthError(state.authMode === "unkey" ? "请输入访问 Key" : "请输入密码");
    elements.authPassword.focus();
    return;
  }

  setAuthUiDisabled(true);

  try {
    const response = await fetchApi("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: accessKey,
        accessKey,
      }),
    });
    const data = await parseResponse(response, { allowAuthError: true });
    if (!data.authenticated) {
      throw new Error("登录失败");
    }
    applyAuthStatus(data);

    elements.authPassword.value = "";
    try {
      await loadConfig();
    } catch (error) {
      if (error.authRequired) {
        throw new Error(state.authMode === "unkey" ? "访问 Key 校验失败，请重试" : "登录状态未建立，请重试");
      }
      throw error;
    }

    if (!state.templates.length) {
      await loadTemplateLibrary();
    }
    void loadGallery({ silent: true, force: true });
    showApp();
    renderAccessBadge();
    resumeActiveImageJob();
    resolvePendingAuthPrompt(true);
  } catch (error) {
    if (error.authRequired) {
      state.authenticated = false;
      showAuthScreen(getExpiredAuthMessage());
      return;
    }
    showAuthError(error.message || (state.authMode === "unkey" ? "访问 Key 无效" : "密码错误"));
    elements.authPassword.focus();
  } finally {
    setAuthUiDisabled(false);
  }
}

async function handleLogout() {
  try {
    await fetchApi("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (_error) {
    // Ignore logout failures and reset locally.
  }

  state.authenticated = false;
  state.isAdmin = false;
  state.permissions = [];
  state.adminUsage = null;
  renderAdminControls();
  renderAccessBadge();
  elements.authPassword.value = "";
  clearAuthError();
  hideAuthScreen();
  showApp();
  resolvePendingAuthPrompt(false);
}

async function handleClearLocalCache() {
  if (state.requestInFlight) {
    return;
  }

  const confirmed = window.confirm("确认清空当前浏览器保存的生成记录、图片和表单状态吗？这不会影响服务器上的数据。");
  if (!confirmed) {
    return;
  }

  clearScheduledLocalWorkspaceSave();
  state.localHydrating = true;

  try {
    await deleteLocalWorkspace();
    state.activeSessionId = createSessionId();
    state.sessions = [];
    resetWorkspaceUi();
    switchMode("generate");
    setRequestStatus("本地缓存已清空");
    clearError();
  } catch (error) {
    showError(error.message || "清空本地缓存失败");
  } finally {
    state.localHydrating = false;
  }
}

async function handleNewChat() {
  if (state.requestInFlight) {
    return;
  }

  clearScheduledLocalWorkspaceSave();
  state.localHydrating = true;

  try {
    const currentWorkspace = await buildLocalWorkspaceSnapshot();
    await saveWorkspaceSession(currentWorkspace);
    state.activeSessionId = createSessionId();
    resetWorkspaceUi();
    switchMode("generate");
    clearError();
    setRequestStatus("已新建创作");
    await saveLocalWorkspace();
  } catch (error) {
    showError(error.message || "新建创作失败");
  } finally {
    state.localHydrating = false;
  }
}

async function handleHistorySelect(sessionId) {
  if (state.requestInFlight || !sessionId || sessionId === state.activeSessionId) {
    return;
  }

  const targetSessionId = sessionId;
  clearScheduledLocalWorkspaceSave();
  setActiveHistoryItem(targetSessionId);
  state.localHydrating = true;

  try {
    await saveWorkspaceSession(await buildLocalWorkspaceSnapshot({ preserveUpdatedAt: true }), { renderHistory: false });
    const workspace = await readWorkspaceSession(targetSessionId);
    if (!workspace) {
      throw new Error("会话不存在");
    }

    state.activeSessionId = targetSessionId;
    await restoreWorkspaceSessionUi(workspace, { emptyStatus: "已切换创作" });
    await writeLocalValue(LOCAL_DB_KEY, { ...workspace, sessionId: targetSessionId });
  } catch (error) {
    renderHistory();
    showError(error.message || "切换创作失败");
  } finally {
    state.localHydrating = false;
  }
  resumeActiveImageJob();
}

async function restoreWorkspaceSessionUi(workspace, options = {}) {
  resetWorkspaceUi();
  state.currentSessionTitle = String(workspace.title || "").trim();

  if (workspace.model) {
    elements.model.value = workspace.model;
  }
  applyFormState(elements.generateForm, workspace.forms?.generate);
  applyFormState(elements.editForm, workspace.forms?.edit);

  const restoredMode = workspace.activeMode === "edit" ? "edit" : "generate";
  state.currentResultMode = workspace.resultMode === "edit" ? "edit" : restoredMode;
  switchMode(restoredMode);

  const imageFiles = deserializeFiles(workspace.uploads?.images);
  const maskFiles = deserializeFiles(workspace.uploads?.mask).slice(0, 1);
  state.uploadSourceFiles.images = imageFiles;
  state.uploadSourceFiles.mask = maskFiles;
  state.uploadRestoreFallback.images = !restoreFilesToInput(elements.editImages, imageFiles);
  state.uploadRestoreFallback.mask = !restoreFilesToInput(elements.editMask, maskFiles);
  renderFilePreview(getUploadFiles("images"), elements.imagePreviewStrip, "参考图", "imagePreviewStrip");
  renderFilePreview(getUploadFiles("mask"), elements.maskPreviewStrip, "蒙版", "maskPreviewStrip");

  state.messages = normalizeStoredMessages(workspace.messages);
  state.activeImageJob = normalizeStoredImageJob(workspace.activeJob);
  const images = normalizeStoredImages(workspace.results);
  if (images.length) {
    renderResults(images, { append: false, skipConversation: true });
  } else {
    renderEmptyResultsState();
  }
  renderConversation();
  clearError();
  setRequestStatus(images.length ? getReadyRequestStatus(restoredMode) : (options.emptyStatus || "已切换创作"));
}

async function handleHistoryDelete(sessionId) {
  if (state.requestInFlight || !sessionId) {
    return;
  }

  const targetSession = state.sessions.find((session) => session.id === sessionId)
    || (sessionId === state.activeSessionId ? buildSessionSummary(await buildLocalWorkspaceSnapshot({ preserveUpdatedAt: true })) : null);
  const title = targetSession?.title || "这个创作记录";
  const confirmed = window.confirm(`确认删除“${title}”吗？这只会删除当前浏览器里的本地记录。`);
  if (!confirmed) {
    return;
  }

  const deletingActiveSession = sessionId === state.activeSessionId;
  clearScheduledLocalWorkspaceSave();
  state.localHydrating = true;

  try {
    await deleteLocalValue(getSessionKey(sessionId));
    state.sessions = normalizeSessionSummaries(state.sessions.filter((session) => session.id !== sessionId));
    await writeLocalValue(LOCAL_DB_SESSIONS_KEY, state.sessions);

    if (!deletingActiveSession) {
      renderHistory();
      setRequestStatus("已删除创作记录");
      return;
    }

    const nextSession = state.sessions[0];
    if (nextSession) {
      const workspace = await readWorkspaceSession(nextSession.id);
      if (!workspace) {
        throw new Error("下一个创作记录不存在");
      }
      state.activeSessionId = nextSession.id;
      await restoreWorkspaceSessionUi(workspace, { emptyStatus: "已删除创作记录" });
      await writeLocalValue(LOCAL_DB_KEY, { ...workspace, sessionId: nextSession.id });
      setRequestStatus("已删除创作记录");
      return;
    }

    state.activeSessionId = createSessionId();
    resetWorkspaceUi();
    switchMode("generate");
    clearError();
    setRequestStatus("已删除创作记录");
    await saveLocalWorkspace();
  } catch (error) {
    showError(error.message || "删除创作记录失败");
    renderHistory();
  } finally {
    state.localHydrating = false;
  }
}

function showApp() {
  elements.authScreen.classList.add("is-hidden");
  elements.appShell.classList.remove("is-hidden");
  updateHistorySidebarPresentation();
  clearAuthError();
  clearError();
}

function showAuthScreen(message) {
  elements.appShell.classList.remove("is-hidden");
  elements.authScreen.classList.remove("is-hidden");
  renderAuthFormMode();
  clearError();
  if (message) {
    showAuthError(message);
  } else {
    clearAuthError();
  }
  elements.authPassword.focus();
}

function hideAuthScreen() {
  elements.authScreen.classList.add("is-hidden");
  clearAuthError();
}

async function ensureAuthenticatedForAction(message = "") {
  if (!state.authEnabled || state.authenticated) {
    return true;
  }

  showAuthScreen(message || getAuthPromptMessage());
  if (state.authPromptPromise) {
    return false;
  }
  state.authPromptPromise = new Promise((resolve) => {
    state.authPromptResolve = resolve;
  });
  return state.authPromptPromise;
}

function resolvePendingAuthPrompt(value) {
  const resolve = state.authPromptResolve;
  state.authPromptPromise = null;
  state.authPromptResolve = null;
  if (typeof resolve === "function") {
    resolve(Boolean(value));
  }
}

function showAuthError(message) {
  elements.authError.textContent = message;
  elements.authError.classList.remove("is-hidden");
}

function clearAuthError() {
  elements.authError.textContent = "";
  elements.authError.classList.add("is-hidden");
}

function setAuthUiDisabled(disabled) {
  elements.authPassword.disabled = disabled;
  elements.authSubmitButton.disabled = disabled;
  elements.logoutButton.disabled = disabled;
}

function switchMode(mode) {
  state.activeMode = mode;
  if (state.activeView !== "chat") {
    state.activeView = "chat";
    elements.viewButtons.forEach((button) => {
      button.classList.remove("is-active");
    });
    elements.viewPanels.forEach((panel) => {
      panel.classList.toggle("is-hidden", panel.dataset.viewPanel !== "chat");
    });
  }
  elements.tabButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === mode);
  });
  elements.modePanels.forEach((panel) => {
    panel.classList.toggle("is-hidden", state.activeView !== "chat" || panel.dataset.modePanel !== mode);
  });
  if (!state.requestInFlight) {
    setRequestStatus(getReadyRequestStatus(mode));
  }
  autoResizeAllTextareas();
  scheduleLocalWorkspaceSave();
}

function switchView(view) {
  const normalizedView = view === "templates" || view === "gallery" ? view : "chat";
  const previousView = state.activeView;
  state.activeView = normalizedView;
  if (normalizedView !== previousView) {
    stopLibraryAutoScroll();
  }
  elements.tabButtons.forEach((button) => {
    button.classList.toggle("is-active", normalizedView === "chat" && button.dataset.mode === state.activeMode);
  });
  elements.viewButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === normalizedView);
  });
  elements.viewPanels.forEach((panel) => {
    panel.classList.toggle("is-hidden", panel.dataset.viewPanel !== normalizedView);
  });

  const isChat = normalizedView === "chat";
  elements.modePanels.forEach((panel) => {
    panel.classList.toggle("is-hidden", !isChat || panel.dataset.modePanel !== state.activeMode);
  });

  if (normalizedView === "gallery") {
    if (previousView !== "gallery") {
      state.pendingLibraryAutoScrollView = "gallery";
    }
    void loadGallery();
    if (previousView !== "gallery") {
      scheduleLibraryAutoScroll("gallery");
    }
  }
  if (normalizedView === "templates") {
    ensureTemplateLibraryLoaded();
  }
}

function getSharedSettings() {
  return {
    model: elements.model.value.trim(),
  };
}

function getPromptField(mode) {
  if (mode === "edit") {
    return elements.editPrompt;
  }
  if (mode === "generate") {
    return elements.generatePrompt;
  }
  return null;
}

function initializeCustomSelects() {
  elements.parameterSelects.forEach((select) => {
    if (select.dataset.customSelectReady === "true") {
      return;
    }

    select.dataset.customSelectReady = "true";
    select.classList.add("native-parameter-select");
    select.setAttribute("aria-hidden", "true");
    select.tabIndex = -1;

    const dropdown = document.createElement("div");
    dropdown.className = "custom-select";
    dropdown.dataset.selectName = select.name || "";

    const button = document.createElement("button");
    button.className = "custom-select-trigger";
    button.type = "button";
    button.setAttribute("aria-haspopup", "listbox");
    button.setAttribute("aria-expanded", "false");
    button.innerHTML = `
      <span class="custom-select-value"></span>
      <span class="custom-select-icon" aria-hidden="true"></span>
    `;

    const menu = document.createElement("div");
    menu.className = "custom-select-menu";
    menu.setAttribute("role", "listbox");

    Array.from(select.options).forEach((option) => {
      const item = document.createElement("button");
      item.className = "custom-select-option";
      item.type = "button";
      item.dataset.value = option.value;
      item.setAttribute("role", "option");
      item.tabIndex = -1;
      item.disabled = option.disabled;
      item.textContent = option.textContent;
      item.addEventListener("click", () => {
        if (option.disabled) {
          return;
        }
        select.value = option.value;
        select.dispatchEvent(new Event("change", { bubbles: true }));
        syncCustomSelect(select);
        closeCustomSelects();
        scheduleLocalWorkspaceSave();
      });
      menu.appendChild(item);
    });

    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const shouldOpen = !dropdown.classList.contains("is-open");
      closeCustomSelects(dropdown);
      setCustomSelectOpen(dropdown, shouldOpen);
    });

    select.addEventListener("change", () => {
      syncCustomSelect(select);
    });

    dropdown.append(button, menu);
    select.insertAdjacentElement("afterend", dropdown);
    syncCustomSelect(select);
  });
}

function closeCustomSelects(exceptDropdown = null) {
  document.querySelectorAll(".custom-select.is-open").forEach((dropdown) => {
    if (dropdown !== exceptDropdown) {
      setCustomSelectOpen(dropdown, false);
    }
  });
}

function setCustomSelectOpen(dropdown, open) {
  if (open) {
    positionCustomSelectMenu(dropdown);
  } else {
    dropdown.classList.remove("is-dropup");
    dropdown.querySelector(".custom-select-menu")?.style.removeProperty("max-height");
  }
  dropdown.classList.toggle("is-open", open);
  dropdown.querySelector(".custom-select-trigger")?.setAttribute("aria-expanded", open ? "true" : "false");
  dropdown.querySelectorAll(".custom-select-option").forEach((option) => {
    option.tabIndex = open && !option.disabled ? 0 : -1;
  });
}

function updateOpenCustomSelectPositions() {
  document.querySelectorAll(".custom-select.is-open").forEach(positionCustomSelectMenu);
}

function positionCustomSelectMenu(dropdown) {
  const menu = dropdown.querySelector(".custom-select-menu");
  if (!menu) {
    return;
  }

  dropdown.classList.remove("is-dropup");
  menu.style.removeProperty("max-height");

  const triggerRect = dropdown.getBoundingClientRect();
  const clipRect = getCustomSelectClipRect(dropdown);
  const menuHeight = Math.min(menu.scrollHeight || menu.getBoundingClientRect().height || 0, 314);
  const gap = 8;
  const availableBelow = clipRect.bottom - triggerRect.bottom - gap;
  const availableAbove = triggerRect.top - clipRect.top - gap;
  const shouldOpenUp = availableBelow < menuHeight && availableAbove > availableBelow;
  const availableSpace = shouldOpenUp ? availableAbove : availableBelow;
  const maxHeight = Math.max(96, Math.min(menuHeight || 314, availableSpace));

  dropdown.classList.toggle("is-dropup", shouldOpenUp);
  menu.style.maxHeight = `${Math.floor(maxHeight)}px`;
}

function getCustomSelectClipRect(dropdown) {
  const clipRect = {
    top: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
    left: 0,
  };

  let node = dropdown.parentElement;
  while (node && node !== document.body) {
    const style = window.getComputedStyle(node);
    const overflow = `${style.overflow} ${style.overflowX} ${style.overflowY}`;
    if (/(auto|scroll|hidden|clip)/.test(overflow)) {
      const rect = node.getBoundingClientRect();
      clipRect.top = Math.max(clipRect.top, rect.top);
      clipRect.right = Math.min(clipRect.right, rect.right);
      clipRect.bottom = Math.min(clipRect.bottom, rect.bottom);
      clipRect.left = Math.max(clipRect.left, rect.left);
    }
    node = node.parentElement;
  }

  return clipRect;
}

function syncCustomSelects() {
  elements.parameterSelects.forEach(syncCustomSelect);
}

function syncCustomSelect(select) {
  const dropdown = select.nextElementSibling?.classList?.contains("custom-select")
    ? select.nextElementSibling
    : null;
  if (!dropdown) {
    return;
  }

  const selectedOption = select.selectedOptions?.[0] || select.options[select.selectedIndex] || select.options[0];
  const valueLabel = dropdown.querySelector(".custom-select-value");
  if (valueLabel) {
    valueLabel.textContent = selectedOption?.textContent || "";
  }

  dropdown.querySelectorAll(".custom-select-option").forEach((option) => {
    const selected = option.dataset.value === select.value;
    option.classList.toggle("is-selected", selected);
    option.setAttribute("aria-selected", selected ? "true" : "false");
  });
}

async function runRequest(statusText, successText, task) {
  startRequest(statusText);

  try {
    await task();
    await finishRequest(successText);
  } catch (error) {
    if (error.authRequired) {
      markPendingMessagesFailed(getExpiredAuthMessage());
      clearError();
      resetRequestUi();
      state.authenticated = false;
      showAuthScreen(getExpiredAuthMessage());
      return;
    }
    markPendingMessagesFailed(formatRequestError(error));
    showError(formatRequestError(error));
    await failRequest();
  }
}

function startRequest(statusText) {
  state.requestInFlight = true;
  state.progressValue = 8;
  setRequestStatus(statusText);
  elements.requestProgressShell.classList.remove("is-hidden");
  elements.requestProgressShell.setAttribute("aria-hidden", "false");
  setProgressValue(state.progressValue);
  setPendingUiState(true);
  stopProgressTimer();

  if (/(生成|文生图|编辑)/.test(statusText)) {
    renderCanvasLoadingState(statusText.includes("编辑") ? "正在编辑" : "正在生成");
  }

  state.progressTimer = setInterval(() => {
    const nextValue = Math.min(92, state.progressValue + Math.floor(Math.random() * 6) + 1);
    setProgressValue(nextValue);
  }, 280);
}

async function finishRequest(statusText) {
  stopProgressTimer();
  setProgressValue(100);
  setRequestStatus(statusText);
  await wait(380);
  resetRequestUi();
}

async function failRequest() {
  stopProgressTimer();
  setProgressValue(Math.max(state.progressValue, 100));
  setRequestStatus("请求失败");
  await wait(260);
  resetRequestUi();
}

function resetRequestUi() {
  state.requestInFlight = false;
  setPendingUiState(false);
  elements.requestProgressShell.classList.add("is-hidden");
  elements.requestProgressShell.setAttribute("aria-hidden", "true");
  setProgressValue(0);
  setRequestStatus(getReadyRequestStatus(state.activeMode));
  renderCurrentResultViews();
}

function getReadyRequestStatus(mode) {
  if (state.currentImages.length) {
    const action = (state.currentResultMode || mode) === "edit" ? "编辑完成" : "生成完成";
    return `${action} · ${state.currentImages.length} 张图片`;
  }
  return mode === "edit" ? "准备编辑" : "准备生成";
}

function setPendingUiState(disabled) {
  elements.generateSubmitButton.disabled = disabled;
  elements.editSubmitButton.disabled = disabled;
  elements.clearCacheButton.disabled = disabled;
  elements.newChatButton.disabled = disabled;
  elements.optimizeButtons.forEach((button) => {
    button.disabled = disabled;
  });
}

function stopProgressTimer() {
  if (state.progressTimer) {
    clearInterval(state.progressTimer);
    state.progressTimer = null;
  }
}

function setProgressValue(value) {
  state.progressValue = value;
  elements.requestProgressBar.style.width = `${value}%`;
}

async function loadTemplateLibrary(options = {}) {
  const nextPage = Math.max(1, Number.parseInt(options.page ?? state.templatePage, 10) || 1);
  const requestCacheKey = getTemplateLibraryCacheKey(nextPage);
  const preserveExisting = Boolean(options.silent) && hasCurrentTemplateLibraryCache(nextPage);
  const requestToken = state.templateRequestToken + 1;
  state.templateRequestToken = requestToken;
  state.templatePage = nextPage;
  state.templateError = "";
  if (!preserveExisting) {
    state.templateLoading = true;
    renderTemplateLibrary();
  }

  try {
    const params = new URLSearchParams({
      limit: String(state.templatePageSize),
      page: String(nextPage),
    });
    const category = String(state.activeTemplateCategory || "全部").trim();
    const keyword = getTemplateSearchKeyword();
    if (category && category !== "全部") {
      params.set("category", category);
    }
    if (keyword) {
      params.set("search", keyword);
    }

    const response = await fetchApi(`/api/templates?${params.toString()}`, { cache: "no-store" });
    const data = await parseResponse(response);
    if (requestToken !== state.templateRequestToken) {
      return;
    }
    state.templates = normalizeTemplates(data.templates);
    state.templateTotal = normalizeNonNegativeNumber(data.total);
    state.templatePageSize = normalizeNonNegativeNumber(data.limit) || state.templatePageSize;
    state.templatePage = normalizePositivePage(data.page, nextPage);
    state.templateTotalPages = Math.max(1, normalizeNonNegativeNumber(data.totalPages) || Math.ceil(state.templateTotal / state.templatePageSize) || 1);
    state.templateHasMore = Boolean(data.hasMore);
    state.templateCacheKey = requestCacheKey;
    state.templateLoadedAt = Date.now();
    const categories = Array.isArray(data.categories) && data.categories.length
      ? data.categories
      : ["全部", ...Array.from(new Set(state.templates.map((template) => template.category).filter(Boolean)))];
    state.templateCategories = uniqueStringList(categories).includes("全部")
      ? uniqueStringList(categories)
      : ["全部", ...uniqueStringList(categories)];
    if (!state.templateCategories.includes(state.activeTemplateCategory)) {
      state.activeTemplateCategory = "全部";
    }
    renderInspirationGrid();
    renderTemplateLibrary();
  } catch (error) {
    if (requestToken !== state.templateRequestToken) {
      return;
    }
    if (preserveExisting) {
      console.warn("Template library background refresh failed", error);
      state.templateError = "";
      return;
    }
    state.templates = [];
    state.templateTotal = 0;
    state.templateTotalPages = 1;
    state.templateHasMore = false;
    state.templateCacheKey = "";
    state.templateLoadedAt = 0;
    state.templateError = "模板库暂时无法加载。";
    renderInspirationGrid();
    renderTemplateLibrary(state.templateError);
  } finally {
    if (requestToken !== state.templateRequestToken) {
      return;
    }
    if (!preserveExisting) {
      state.templateLoading = false;
      renderTemplateLibrary(state.templateError);
    }
  }
}

function ensureTemplateLibraryLoaded() {
  const page = state.templatePage || 1;
  if (state.templateLoading) {
    renderTemplateLibrary(state.templateError);
    return;
  }

  if (!hasCurrentTemplateLibraryCache(page)) {
    void loadTemplateLibrary({ page });
    return;
  }

  renderTemplateLibrary(state.templateError);
  if (Date.now() - state.templateLoadedAt > TEMPLATE_LIBRARY_REFRESH_INTERVAL_MS) {
    void loadTemplateLibrary({ page, silent: true });
  }
}

function hasCurrentTemplateLibraryCache(page = state.templatePage) {
  return Boolean(
    state.templates.length
    && state.templateCacheKey
    && state.templateCacheKey === getTemplateLibraryCacheKey(page)
    && !state.templateError,
  );
}

function getTemplateLibraryCacheKey(page = state.templatePage) {
  const params = new URLSearchParams({
    limit: String(state.templatePageSize),
    page: String(Math.max(1, Number.parseInt(page, 10) || 1)),
  });
  const category = String(state.activeTemplateCategory || "全部").trim();
  const keyword = getTemplateSearchKeyword();
  if (category && category !== "全部") {
    params.set("category", category);
  }
  if (keyword) {
    params.set("search", keyword);
  }
  return params.toString();
}

function scheduleTemplateLibraryLoad() {
  window.clearTimeout(state.templateSearchTimer);
  state.templateSearchTimer = window.setTimeout(() => {
    void loadTemplateLibrary({ page: 1 });
  }, 300);
}

function getTemplateSearchKeyword() {
  return String(elements.templateSearch?.value || "").trim();
}

function normalizePositivePage(value, fallback = 1) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeTemplates(templates) {
  return (Array.isArray(templates) ? templates : [])
    .map((template, index) => {
      const imageObjectKey = String(template.imageObjectKey || "").trim();
      const imageUrl = buildTemplateImageUrl(template, imageObjectKey);
      const thumbnailObjectKey = String(template.thumbnailObjectKey || "").trim();
      const thumbnailUrl = buildTemplateImageUrl({ imageUrl: template.thumbnailUrl }, thumbnailObjectKey);

      return {
        id: String(template.id || `template-${index}`),
        title: String(template.title || "未命名模板").trim(),
        category: String(template.category || "未分类").trim(),
        prompt: String(template.prompt || "").trim(),
        imageUrl,
        imageObjectKey,
        imageMimeType: String(template.imageMimeType || "").trim(),
        imageWidth: normalizeNonNegativeNumber(template.imageWidth),
        imageHeight: normalizeNonNegativeNumber(template.imageHeight),
        imageSize: normalizeNonNegativeNumber(template.imageSize),
        thumbnailUrl,
        thumbnailObjectKey,
        thumbnailMimeType: String(template.thumbnailMimeType || "").trim(),
        thumbnailWidth: normalizeNonNegativeNumber(template.thumbnailWidth),
        thumbnailHeight: normalizeNonNegativeNumber(template.thumbnailHeight),
        thumbnailSize: normalizeNonNegativeNumber(template.thumbnailSize),
        sourceUrl: String(template.sourceUrl || "").trim(),
        sourceImageUrl: String(template.sourceImageUrl || "").trim(),
        license: String(template.license || "CC BY 4.0").trim(),
        status: String(template.status || "active").trim(),
        sortOrder: Number.parseInt(template.sortOrder, 10) || index,
      };
    })
    .filter((template) => template.prompt && template.status !== "deleted" && template.status !== "hidden")
    .sort((left, right) => left.sortOrder - right.sortOrder || left.title.localeCompare(right.title, "zh-Hans-CN"));
}

function buildTemplateImageUrl(template, imageObjectKey) {
  return buildPublicAssetUrl(imageObjectKey, template?.imageUrl);
}

function buildPublicAssetUrl(objectKey, fallbackUrl = "") {
  const normalizedKey = normalizeGalleryObjectKey(objectKey);
  if (normalizedKey && state.publicAssetBaseUrl) {
    return `${state.publicAssetBaseUrl}/${normalizedKey.split("/").map(encodeURIComponent).join("/")}`;
  }

  const imageUrl = String(fallbackUrl || "").trim();
  if (imageUrl) {
    return imageUrl;
  }

  return normalizedKey ? `/api/gallery/object?key=${encodeURIComponent(normalizedKey)}` : "";
}

function normalizePublicAssetBaseUrl(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

function ensurePublicAssetPreconnect(baseUrl) {
  if (!baseUrl || publicAssetPreconnects.has(baseUrl)) {
    return;
  }

  let origin = "";
  try {
    origin = new URL(baseUrl, window.location.origin).origin;
  } catch (_error) {
    return;
  }

  if (!origin || origin === window.location.origin || publicAssetPreconnects.has(origin)) {
    return;
  }

  publicAssetPreconnects.add(baseUrl);
  publicAssetPreconnects.add(origin);
  ["preconnect", "dns-prefetch"].forEach((rel) => {
    const link = document.createElement("link");
    link.rel = rel;
    link.href = origin;
    if (rel === "preconnect") {
      link.crossOrigin = "anonymous";
    }
    document.head.appendChild(link);
  });
}

function renderTemplateLibrary(emptyMessage = "") {
  renderTemplateCategories();

  const templates = state.templates;

  if (state.templateLoading) {
    elements.templateGrid.innerHTML = renderTemplateSkeletons();
    renderTemplatePagination();
    return;
  }

  if (!templates.length) {
    elements.templateGrid.innerHTML = `<div class="empty-state compact-empty"><p>${escapeHtml(emptyMessage || "没有匹配的模板。")}</p></div>`;
    renderTemplatePagination();
    return;
  }

  elements.templateGrid.innerHTML = templates
    .map((template, index) => renderTemplateCard(template, index))
    .join("");

  bindTemplateActions(templates);
  bindTemplateImageLoadStates();
  renderTemplatePagination();
}

function renderTemplateSkeletons() {
  return Array.from({ length: Math.min(state.templatePageSize, 12) }, (_item, index) => `
    <article class="gallery-card-skeleton template-card-skeleton" style="--i:${index}">
      <span></span>
      <i></i>
      <b></b>
    </article>
  `).join("");
}

function renderTemplatePagination() {
  if (!elements.templatePagination) {
    return;
  }
  if (state.templateLoading) {
    elements.templatePagination.innerHTML = `<span class="template-page-summary">正在加载模板...</span>`;
    return;
  }

  const total = state.templateTotal;
  const current = Math.min(state.templateTotalPages, Math.max(1, state.templatePage));
  const totalPages = Math.max(1, state.templateTotalPages);
  const pageButtons = buildTemplatePageNumbers(current, totalPages)
    .map((page) => page === "gap"
      ? `<span class="template-page-gap">...</span>`
      : `<button class="secondary-button template-page-button ${page === current ? "is-active" : ""}" type="button" data-template-page="${page}" ${page === current ? "disabled" : ""}>${page}</button>`)
    .join("");

  elements.templatePagination.innerHTML = `
    <span class="template-page-summary">第 ${current} / ${totalPages} 页 · 共 ${total} 个模板</span>
    <div class="template-page-actions">
      <button class="secondary-button template-page-button" type="button" data-template-page="${current - 1}" ${current <= 1 ? "disabled" : ""}>上一页</button>
      ${pageButtons}
      <button class="secondary-button template-page-button" type="button" data-template-page="${current + 1}" ${current >= totalPages ? "disabled" : ""}>下一页</button>
    </div>
  `;

  Array.from(elements.templatePagination.querySelectorAll("[data-template-page]")).forEach((button) => {
    button.addEventListener("click", () => {
      const page = normalizePositivePage(button.dataset.templatePage, state.templatePage);
      if (page === state.templatePage || page < 1 || page > state.templateTotalPages) {
        return;
      }
      stopLibraryAutoScroll();
      elements.templatesView?.scrollTo({ top: 0, behavior: "smooth" });
      void loadTemplateLibrary({ page });
    });
  });
}

function buildTemplatePageNumbers(current, totalPages) {
  const pages = new Set([1, totalPages, current - 1, current, current + 1]);
  const ordered = [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((left, right) => left - right);
  const result = [];
  ordered.forEach((page, index) => {
    if (index > 0 && page - ordered[index - 1] > 1) {
      result.push("gap");
    }
    result.push(page);
  });
  return result;
}

function renderTemplateCategories() {
  elements.templateCategoryList.innerHTML = state.templateCategories
    .map((category) => `
      <button class="chip-button ${category === state.activeTemplateCategory ? "is-active" : ""}" type="button" data-template-category="${escapeHtml(category)}">
        ${escapeHtml(category)}
      </button>
    `)
    .join("");

  Array.from(elements.templateCategoryList.querySelectorAll("[data-template-category]")).forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTemplateCategory = button.dataset.templateCategory || "全部";
      state.templatePage = 1;
      void loadTemplateLibrary({ page: 1 });
    });
  });
}

function renderTemplateCard(template, index) {
  const previewSrc = template.thumbnailUrl || template.imageUrl;
  const dimensions = getTemplateImageDimensions(template);
  const dimensionAttrs = dimensions.width && dimensions.height
    ? ` width="${dimensions.width}" height="${dimensions.height}"`
    : "";
  const loadingAttrs = getLibraryImageLoadingAttributes(index);
  const image = previewSrc
    ? `<img class="template-image library-image" src="${escapeHtml(previewSrc)}" alt="${escapeHtml(template.title)}"${loadingAttrs}${dimensionAttrs} />`
    : `<div class="template-image"></div>`;
  const source = template.sourceUrl
    ? `<a href="${escapeHtml(template.sourceUrl)}" target="_blank" rel="noreferrer">来源</a>`
    : "";

  return `
    <article class="template-card">
      ${image}
      <h3>${escapeHtml(template.title)}</h3>
      <p>${escapeHtml(template.prompt)}</p>
      <div class="message-meta">
        <small>${escapeHtml(template.category)}</small>
        <small>${escapeHtml(template.license)}</small>
        ${source}
      </div>
      <div class="card-actions">
        <button class="download-button js-use-template" type="button" data-template-index="${index}">使用</button>
        <button class="secondary-button js-preview-template" type="button" data-template-index="${index}">预览</button>
      </div>
    </article>
  `;
}

function getTemplateImageDimensions(template) {
  const width = normalizeNonNegativeNumber(template?.thumbnailWidth || template?.imageWidth);
  const height = normalizeNonNegativeNumber(template?.thumbnailHeight || template?.imageHeight);
  if (!width || !height) {
    return { width: 0, height: 0 };
  }

  return { width, height };
}

function getLibraryImageLoadingAttributes(index) {
  const isEager = index < LIBRARY_EAGER_IMAGE_COUNT;
  return isEager
    ? ' loading="eager" decoding="async" fetchpriority="high"'
    : ' loading="lazy" decoding="async"';
}

function renderInspirationGrid(options = {}) {
  if (!elements.inspirationGrid) {
    return;
  }

  const shownItems = pickGalleryInspirationItems(buildGalleryInspirationItems(), options);
  elements.inspirationGrid.innerHTML = shownItems
    .map((item, index) => renderInspirationCard(item, index))
    .join("");

  Array.from(elements.inspirationGrid.querySelectorAll(".js-use-inspiration")).forEach((button) => {
    button.addEventListener("click", () => {
      const item = shownItems[Number(button.dataset.inspirationIndex)];
      if (!item) {
        return;
      }

      if (!item.prompt && item.previewSrc) {
        openPreviewModal({
          src: item.previewSrc,
          caption: item.title || "画廊灵感",
          fileName: `${item.id || "gallery-inspiration"}.png`,
          prompt: item.prompt || "",
          allowDownload: false,
        });
        return;
      }

      const promptField = getPromptField(state.activeMode) || elements.generatePrompt;
      promptField.value = item.prompt;
      autoResizeTextarea(promptField);
      updatePromptCounters();
      switchView("chat");
      promptField.focus();
      setRequestStatus(item.placeholder ? "已套用默认灵感" : "已套用画廊灵感");
      scheduleLocalWorkspaceSave();
    });
  });
}

async function refreshGalleryInspiration(options = {}) {
  if (state.galleryEnabled) {
    state.inspirationLoading = true;
    try {
      const excludeKeys = options.shuffle ? state.inspirationLastIds.slice(0, 24) : [];
      const params = new URLSearchParams({
        limit: String(INSPIRATION_SAMPLE_COUNT),
      });
      if (excludeKeys.length) {
        params.set("exclude", excludeKeys.join(","));
      }
      const response = await fetchApi(`/api/gallery/inspiration?${params.toString()}`);
      const data = await parseResponse(response);
      state.inspirationItems = mergeGalleryItems(data.items).slice(0, INSPIRATION_SAMPLE_COUNT);
    } catch (error) {
      if (!options.silent) {
        showError(formatRequestError(error));
      }
    } finally {
      state.inspirationLoading = false;
    }
  }

  renderInspirationGrid(options);
}

function renderInspirationCard(item, index) {
  const tags = item.tags.slice(0, 2).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
  const media = item.previewSrc
    ? `<img src="${escapeHtml(item.previewSrc)}" alt="${escapeHtml(item.title)}" loading="lazy" />`
    : `<span class="inspiration-placeholder-art" aria-hidden="true"></span>`;

  return `
    <button class="inspiration-tile${item.placeholder ? " is-placeholder" : ""} js-use-inspiration" type="button" data-inspiration-index="${index}" aria-label="${item.placeholder ? "套用默认灵感" : "套用画廊灵感"}">
      <span class="inspiration-thumb" data-tone="${escapeHtml(item.tone || "blue")}">
        ${media}
      </span>
      <span class="inspiration-card-copy">
        <span class="inspiration-tags">${tags}</span>
      </span>
    </button>
  `;
}

function buildGalleryInspirationItems() {
  const publicItems = buildPublicGalleryInspirationItems(state.inspirationItems.length ? state.inspirationItems : state.galleryItems);
  const items = publicItems.length ? publicItems : [];
  const seen = new Set();

  return items.filter((item) => {
    if (!isUsableInspirationItem(item)) {
      return false;
    }

    const keys = getInspirationDedupKeys(item);
    if (!keys.length || keys.some((key) => seen.has(key))) {
      return false;
    }

    keys.forEach((key) => seen.add(key));
    return true;
  });
}

function buildPublicGalleryInspirationItems(items) {
  return normalizeGalleryItems(items)
    .filter((item) => item.visibility === "public" && item.status === "completed")
    .map((item) => {
    const prompt = item.prompt || item.revisedPrompt || "";
    const modeTag = item.mode === "edit" ? "图片编辑" : "文生图";
    return {
      id: `public:${item.id || item.displayObjectKey || item.objectKey || item.imageUrl}`,
      sourceId: item.id || item.displayObjectKey || item.objectKey || item.imageUrl,
      sourceIds: getGalleryRecentKeys(item),
      sourceType: "public",
      createdAt: item.createdAt,
      title: getInspirationTitle(prompt, item.mode === "edit" ? "图片编辑" : "画廊作品"),
      prompt,
      previewSrc: getGalleryThumbnailUrl(item),
      tags: buildInspirationTags(prompt, [modeTag, "公开画廊"]),
      placeholder: false,
      tone: "blue",
    };
  });
}

function buildLocalGalleryInspirationItems() {
  const items = [];
  const fallbackPrompt = elements.generatePrompt.value.trim() || elements.editPrompt.value.trim();

  state.currentImages.forEach((image, index) => {
    const prompt = findPromptForImage(image) || fallbackPrompt;
    items.push(buildLocalInspirationItem(image, prompt, `current:${index}`));
  });

  state.messages.forEach((message, messageIndex) => {
    normalizeStoredImages(message.images).forEach((image, imageIndex) => {
      const prompt = message.sourcePrompt || findPreviousUserPrompt(messageIndex) || message.prompt || fallbackPrompt;
      items.push(buildLocalInspirationItem(image, prompt, `message:${message.id || messageIndex}:${imageIndex}`));
    });
  });

  return items;
}

function buildLocalInspirationItem(image, prompt, fallbackId) {
  const previewSrc = image.dataUrl || image.galleryUrl || image.remoteUrl || image.storedUrl || "";
  return {
    id: `local:${getStoredImageIdentity(image) || fallbackId}`,
    sourceIds: getLocalInspirationRecentKeys(image),
    sourceType: "local",
    title: getInspirationTitle(prompt, "本地作品"),
    prompt,
    previewSrc,
    tags: buildInspirationTags(prompt, ["AI 生成", "本地作品"]),
    placeholder: false,
    tone: "cyan",
  };
}

function pickGalleryInspirationItems(items, options = {}) {
  const shuffled = shuffleArray(items);
  const previousIds = new Set(state.inspirationLastIds);
  const recentIds = new Set(state.recentGalleryItemIds);
  const recentItems = shuffled.filter((item) => isRecentInspirationItem(item, recentIds));
  const newestPublicItems = options.shuffle
    ? getNewestPublicInspirationItems(items, recentItems)
    : [];
  const priorityItems = uniqueInspirationItems([...recentItems, ...newestPublicItems]);
  const priorityIds = getInspirationKeySet(priorityItems);
  const regularItems = shuffled.filter((item) => !hasInspirationKeyOverlap(item, priorityIds));
  const weightedPool = options.shuffle
    ? [
        ...priorityItems,
        ...regularItems.filter((item) => !hasInspirationKeyOverlap(item, previousIds)),
        ...regularItems.filter((item) => hasInspirationKeyOverlap(item, previousIds)),
      ]
    : shuffled;
  const pool = options.shuffle && !priorityItems.length && items.length > INSPIRATION_SAMPLE_COUNT
    ? [
      ...weightedPool.filter((item) => !hasInspirationKeyOverlap(item, previousIds)),
      ...weightedPool.filter((item) => hasInspirationKeyOverlap(item, previousIds)),
    ]
    : weightedPool;
  const selected = pool.slice(0, INSPIRATION_SAMPLE_COUNT);
  const needed = INSPIRATION_SAMPLE_COUNT - selected.length;
  const placeholders = needed > 0 ? buildPlaceholderInspirationItems(needed) : [];
  const result = [...selected, ...placeholders];

  state.inspirationLastIds = uniqueStringList(selected.flatMap(getInspirationDedupKeys)).slice(0, 80);
  return result;
}

function isRecentInspirationItem(item, recentIds) {
  return getInspirationRecentKeys(item).some((key) => recentIds.has(key));
}

function getNewestPublicInspirationItems(items, excludedItems = []) {
  const excludedIds = getInspirationKeySet(excludedItems);
  return [...items]
    .filter((item) => item.sourceType === "public" && !hasInspirationKeyOverlap(item, excludedIds))
    .sort((left, right) => getInspirationTimestamp(right) - getInspirationTimestamp(left))
    .slice(0, 2);
}

function getInspirationTimestamp(item) {
  return new Date(item?.createdAt || 0).getTime() || 0;
}

function uniqueInspirationItems(items) {
  const seen = new Set();
  return items.filter((item) => {
    const keys = getInspirationDedupKeys(item);
    if (!keys.length || keys.some((key) => seen.has(key))) {
      return false;
    }

    keys.forEach((key) => seen.add(key));
    return true;
  });
}

function syncSharedGalleryItems(items, options = {}) {
  const normalizedItems = mergeGalleryItems(items);
  if (!normalizedItems.length) {
    return [];
  }

  addGalleryPageItems(normalizedItems, { prepend: true });
  state.inspirationItems = normalizeGalleryItems([
    ...normalizedItems,
    ...state.inspirationItems,
  ]).slice(0, INSPIRATION_SAMPLE_COUNT);
  if (options.markRecent) {
    const recentKeys = normalizedItems.flatMap(getGalleryRecentKeys);
    state.recentGalleryItemIds = [
      ...recentKeys,
      ...state.recentGalleryItemIds.filter((id) => !recentKeys.includes(id)),
    ].slice(0, 12);
  }

  if (options.render !== false && state.activeView === "gallery") {
    renderPublicGallery();
  }
  if (options.renderInspiration !== false) {
    renderInspirationGrid({ shuffle: true });
  }

  return normalizedItems;
}

function buildPlaceholderInspirationItems(count) {
  return INSPIRATION_PLACEHOLDERS.slice(0, count).map((item) => ({
    ...item,
    previewSrc: "",
    placeholder: true,
  }));
}

function isUsableInspirationItem(item) {
  if (!item || item.placeholder) {
    return false;
  }

  const imageSrc = String(item.previewSrc || "").trim();
  if (!isDisplayableInspirationImage(imageSrc)) {
    return false;
  }

  const text = normalizeInspirationText([item.title, item.prompt].join(" "));
  return Boolean(text && !isBlockedGalleryInspiration(text));
}

function isDisplayableInspirationImage(src) {
  const value = String(src || "").trim();
  return /^data:image\//i.test(value)
    || /^https?:\/\//i.test(value)
    || value.startsWith("/api/gallery/object")
    || value.startsWith("/uploads/")
    || value.startsWith("/public/");
}

function isBlockedGalleryInspiration(normalizedText) {
  const blockedKeywords = [
    "失败",
    "错误",
    "error",
    "failed",
    "空图",
    "没有返回图片",
    "截图",
    "截圖",
    "screenshot",
    "screen capture",
    "screencapture",
    "屏幕截图",
    "网页截图",
    "網頁截圖",
  ];

  return blockedKeywords.some((keyword) => normalizedText.includes(normalizeInspirationText(keyword)));
}

function getInspirationItemKey(item) {
  return String(normalizeGalleryImageUrl(item?.previewSrc) || item?.id || "").trim();
}

function getInspirationDedupKeys(item) {
  return uniqueStringList([
    getInspirationItemKey(item),
    ...getInspirationRecentKeys(item),
  ]);
}

function getInspirationKeySet(items) {
  const keySet = new Set();
  (Array.isArray(items) ? items : []).forEach((item) => {
    getInspirationDedupKeys(item).forEach((key) => keySet.add(key));
  });
  return keySet;
}

function hasInspirationKeyOverlap(item, keySet) {
  return getInspirationDedupKeys(item).some((key) => keySet.has(key));
}

function getInspirationRecentKeys(item) {
  return uniqueStringList([
    item?.id,
    item?.sourceId,
    item?.previewSrc,
    normalizeGalleryImageUrl(item?.previewSrc),
    ...(Array.isArray(item?.sourceIds) ? item.sourceIds : []),
  ]);
}

function getGalleryRecentKeys(item) {
  return uniqueStringList([
    item?.id,
    item?.displayObjectKey,
    item?.objectKey,
    item?.displayUrl,
    item?.imageUrl,
    normalizeGalleryImageUrl(item?.displayUrl || item?.imageUrl),
    ...getGalleryItemIdentityKeys(item),
  ]);
}

function getLocalInspirationRecentKeys(image) {
  return uniqueStringList([
    image?.galleryItemId,
    image?.displayUrl,
    image?.galleryUrl,
    normalizeGalleryImageUrl(image?.displayUrl || image?.galleryUrl),
    image?.displayObjectKey,
    image?.objectKey,
    image?.storedUrl,
    image?.remoteUrl,
    getStoredImageIdentity(image),
  ]);
}

function uniqueStringList(values) {
  const seen = new Set();
  return values
    .map((value) => String(value || "").trim())
    .filter((value) => {
      if (!value || seen.has(value)) {
        return false;
      }

      seen.add(value);
      return true;
    });
}

function getInspirationTitle(prompt, fallback) {
  const text = String(prompt || "").replace(/\s+/g, " ").trim();
  if (!text) {
    return fallback;
  }

  return text.length > 18 ? `${text.slice(0, 18)}...` : text;
}

function buildInspirationTags(prompt, fallbackTags = []) {
  const text = normalizeInspirationText(prompt);
  const tags = [];
  const rules = [
    { tag: "人像", keywords: ["头像", "写真", "人像", "portrait", "face"] },
    { tag: "商业摄影", keywords: ["产品", "商品", "商业", "海报", "product", "brand"] },
    { tag: "二次元", keywords: ["动漫", "角色", "二次元", "anime", "character"] },
    { tag: "空间设计", keywords: ["室内", "家居", "空间", "interior", "home"] },
    { tag: "电影感", keywords: ["电影", "cinematic", "光影", "氛围"] },
    { tag: "风景", keywords: ["风景", "山", "海", "湖", "landscape", "wallpaper"] },
    { tag: "写实", keywords: ["写实", "照片", "photoreal", "realistic"] },
  ];

  rules.forEach((rule) => {
    if (tags.length >= 2) {
      return;
    }
    if (rule.keywords.some((keyword) => text.includes(normalizeInspirationText(keyword)))) {
      tags.push(rule.tag);
    }
  });

  fallbackTags.forEach((tag) => {
    if (tags.length < 2 && !tags.includes(tag)) {
      tags.push(tag);
    }
  });

  return tags.slice(0, 2);
}

function normalizeInspirationText(value) {
  return String(value || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\s\/\\·•—–_：:，,.;!?()[\]{}<>|]/g, "");
}

function shuffleArray(items) {
  return [...items]
    .map((item) => ({ item, sort: Math.random() }))
    .sort((left, right) => left.sort - right.sort)
    .map(({ item }) => item);
}

function bindTemplateActions(templates) {
  Array.from(elements.templateGrid.querySelectorAll(".js-use-template")).forEach((button) => {
    button.addEventListener("click", () => {
      const template = templates[Number(button.dataset.templateIndex)];
      if (!template) {
        return;
      }
      const promptField = getPromptField(state.activeMode) || elements.generatePrompt;
      promptField.value = template.prompt;
      autoResizeTextarea(promptField);
      updatePromptCounters();
      switchView("chat");
      promptField.focus();
      scheduleLocalWorkspaceSave();
    });
  });

  Array.from(elements.templateGrid.querySelectorAll(".js-preview-template")).forEach((button) => {
    button.addEventListener("click", () => {
      const template = templates[Number(button.dataset.templateIndex)];
      if (!template?.imageUrl) {
        return;
      }
      openPreviewModal({
        src: template.imageUrl,
        caption: template.title,
        fileName: `${template.id || "template"}.png`,
        prompt: template.prompt || "",
        allowDownload: false,
      });
    });
  });
}

async function loadGallery(options = {}) {
  if (!state.galleryEnabled) {
    if (!options.silent) {
      elements.publicGalleryGrid.innerHTML = `<div class="empty-state compact-empty"><p>画廊存储未配置。</p></div>`;
      renderGalleryLoadMore();
    }
    if (options.renderInspiration !== false) {
      renderInspirationGrid();
    }
    return;
  }
  const append = Boolean(options.append);
  if (state.galleryPageItemIds.length && !options.force && !append) {
    if (!options.silent) {
      renderPublicGallery();
    }
    if (options.renderInspiration !== false) {
      renderInspirationGrid();
    }
    return;
  }

  if (state.galleryLoading) {
    return;
  }

  if (options.force) {
    state.galleryPageItemIds = [];
    state.galleryNextCursor = "";
    state.galleryHasMore = true;
    state.galleryError = "";
  }

  if (append && !state.galleryHasMore) {
    return;
  }

  state.galleryLoading = true;
  state.galleryError = "";
  if (!options.silent || !state.galleryPageItemIds.length) {
    renderPublicGallery();
  } else {
    renderGalleryLoadMore();
  }

  try {
    const params = new URLSearchParams({
      limit: String(GALLERY_PAGE_SIZE),
      visibility: "public",
      status: "completed",
    });
    if (append && state.galleryNextCursor) {
      params.set("cursor", state.galleryNextCursor);
    }

    const response = await fetchApi(`/api/gallery?${params.toString()}`);
    const data = await parseResponse(response);
    const fetchedGalleryItems = mergeGalleryItems(data.items);
    if (options.force || !append) {
      state.galleryPageItemIds = [];
    }
    addGalleryPageItems(fetchedGalleryItems, { prepend: false });
    state.galleryNextCursor = String(data.nextCursor || "").trim();
    state.galleryHasMore = Boolean(data.hasMore);
    const galleryRecentKeys = new Set(state.galleryItems.flatMap(getGalleryRecentKeys));
    state.recentGalleryItemIds = state.recentGalleryItemIds.filter((id) =>
      galleryRecentKeys.has(id)
    );
    renderPublicGallery();
    if (options.renderInspiration !== false) {
      await refreshGalleryInspiration({ shuffle: true, silent: true });
    }
  } catch (error) {
    state.galleryError = formatRequestError(error);
    renderPublicGallery();
    if (options.renderInspiration !== false) {
      renderInspirationGrid();
    }
  } finally {
    state.galleryLoading = false;
    renderGalleryLoadMore();
  }
}

async function submitAndPollImageJob({ endpoint, requestOptions, mode, prompt, pendingMessageId, expectedCount }) {
  const data = await submitImageJobRequest(endpoint, requestOptions, {
    onUploadProgress: mode === "edit" ? updateEditUploadProgress : null,
  });
  syncCreditsFromPayload(data);
  const job = data.job || data;
  syncCreditsFromPayload(job);
  const jobId = job.jobId || job.id;
  if (!jobId) {
    return data;
  }

  const targetCount = normalizeRequestedImageCount(expectedCount);
  const activeJob = setActiveImageJob({
    jobId,
    mode,
    prompt,
    pendingMessageId,
    expectedCount: targetCount,
  });

  return pollImageJob(activeJob, { initialJob: job });
}

async function pollImageJob(activeJob, options = {}) {
  const normalizedJob = normalizeStoredImageJob(activeJob);
  if (!normalizedJob) {
    throw new Error("生成任务状态无效，请重新生成");
  }

  if (isStoredImageJobExpired(normalizedJob)) {
    clearActiveImageJob();
    failActiveImageJobMessage(normalizedJob, "生成任务已过期，请重新生成");
    throw new Error("生成任务已过期，请重新生成");
  }

  state.activeImageJob = normalizedJob;
  const jobId = normalizedJob.jobId;
  const mode = normalizedJob.mode;
  const prompt = normalizedJob.prompt;
  const pendingMessageId = ensureActiveJobPendingMessage(normalizedJob);
  const targetCount = normalizeRequestedImageCount(normalizedJob.expectedCount);
  let job = options.initialJob || await fetchImageJob(jobId);
  let lastSignature = "";
  let lastJob = job;
  const jobImageCache = new Map();

  while (true) {
    const isFinal = isImageJobFinal(job);
    const images = mergeJobImages(job.images, jobImageCache);
    const signature = buildImageJobRenderSignature(job, images);

    updateImageJobStatus(job, mode, images.length, targetCount);

    if (images.length && (signature !== lastSignature || isFinal)) {
      lastSignature = signature;
      renderResults(images, {
        append: true,
        mode,
        prompt,
        pendingMessageId,
        galleryItems: job.galleryItems || [],
        messageStatus: isFinal ? "done" : "pending",
        messagePrompt: isFinal
          ? (mode === "edit" ? "编辑完成" : "生成完成")
          : `已生成 ${images.length} / ${targetCount} 张图片`,
      });
      if (!isFinal) {
        updateImageJobProgress(images.length, targetCount);
      }
    }

    lastJob = {
      ...job,
      images,
    };
    if (isFinal) {
      break;
    }

    await wait(1800);
    const knownImages = Array.from(jobImageCache.keys()).join(",");
    job = await fetchImageJob(jobId, { knownImages });
  }

  const finalImages = normalizeStoredImages(lastJob.images);
  clearActiveImageJob();
  if (!finalImages.length && lastJob.error) {
    throw new Error(lastJob.error);
  }

  return {
    images: finalImages,
    galleryItems: lastJob.galleryItems || [],
    generationError: lastJob.generationError || (lastJob.status === "partial" ? lastJob.error : ""),
    galleryError: lastJob.galleryError || "",
    creditsRemaining: lastJob.creditsRemaining,
  };
}

async function fetchImageJob(jobId, options = {}) {
  try {
    const knownImages = String(options.knownImages || "").trim();
    const query = knownImages ? `?knownImages=${encodeURIComponent(knownImages)}` : "";
    const pollResponse = await fetchApi(`/api/jobs/${encodeURIComponent(jobId)}${query}`);
    const pollData = await parseResponse(pollResponse);
    syncCreditsFromPayload(pollData);
    const job = pollData.job || pollData;
    syncCreditsFromPayload(job);
    return job;
  } catch (error) {
    if (error.status === 404) {
      clearActiveImageJob();
    }
    throw error;
  }
}

function setActiveImageJob(job) {
  const normalized = normalizeStoredImageJob({
    ...job,
    createdAt: job.createdAt || Date.now(),
    updatedAt: Date.now(),
  });
  state.activeImageJob = normalized;
  scheduleLocalWorkspaceSave(0);
  return normalized;
}

function clearActiveImageJob(options = {}) {
  if (!state.activeImageJob) {
    return;
  }

  state.activeImageJob = null;
  if (options.persist !== false) {
    scheduleLocalWorkspaceSave(0);
  }
}

function resumeActiveImageJob() {
  if (state.requestInFlight || !state.authenticated) {
    return;
  }

  const activeJob = normalizeStoredImageJob(state.activeImageJob);
  if (!activeJob) {
    state.activeImageJob = null;
    return;
  }

  if (isStoredImageJobExpired(activeJob)) {
    clearActiveImageJob();
    failActiveImageJobMessage(activeJob, "生成任务已过期，请重新生成");
    return;
  }

  state.activeImageJob = activeJob;
  const statusText = activeJob.mode === "edit" ? "正在恢复编辑任务" : "正在恢复生成任务";
  const successText = activeJob.mode === "edit" ? "编辑完成" : "生成完成";
  void runRequest(statusText, successText, async () => {
    const data = await pollImageJob(activeJob);
    syncCreditsFromPayload(data);
    if (data.galleryError) {
      showError(`图片已生成，但保存或分享失败：${data.galleryError}`);
    } else if (data.generationError) {
      showError(data.generationError);
    }
  });
}

function ensureActiveJobPendingMessage(job) {
  const existingMessage = job.pendingMessageId
    ? state.messages.find((message) => message.id === job.pendingMessageId)
    : null;
  if (existingMessage) {
    return existingMessage.id;
  }

  const pendingMessage = [...state.messages]
    .reverse()
    .find((message) => message.role === "assistant" && message.status === "pending" && message.mode === job.mode);
  if (pendingMessage) {
    state.activeImageJob = normalizeStoredImageJob({
      ...job,
      pendingMessageId: pendingMessage.id,
      updatedAt: Date.now(),
    });
    scheduleLocalWorkspaceSave(0);
    return pendingMessage.id;
  }

  const message = addConversationMessage({
    role: "assistant",
    mode: job.mode,
    status: "pending",
    prompt: job.mode === "edit" ? "正在恢复编辑任务..." : "正在恢复生成任务...",
  });
  state.activeImageJob = normalizeStoredImageJob({
    ...job,
    pendingMessageId: message.id,
    updatedAt: Date.now(),
  });
  scheduleLocalWorkspaceSave(0);
  return message.id;
}

function failActiveImageJobMessage(job, message) {
  const pendingMessageId = job?.pendingMessageId || "";
  if (pendingMessageId) {
    updateConversationMessage(pendingMessageId, {
      status: "done",
      prompt: message,
    });
    return;
  }

  markPendingMessagesFailed(message);
}

function submitImageJobRequest(endpoint, requestOptions, options = {}) {
  const requestWithClient = withClientInstanceRequest(requestOptions || {});
  const body = requestWithClient.body;
  if (!(body instanceof FormData) || typeof XMLHttpRequest === "undefined" || typeof options.onUploadProgress !== "function") {
    return fetch(endpoint, requestWithClient).then((response) => parseResponse(response));
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(requestWithClient.method || "POST", endpoint);
    xhr.responseType = "text";
    requestWithClient.headers.forEach((value, key) => {
      xhr.setRequestHeader(key, value);
    });

    xhr.upload.addEventListener("progress", (event) => {
      if (!event.lengthComputable || !event.total) {
        return;
      }
      options.onUploadProgress(Math.round((event.loaded / event.total) * 100));
    });

    xhr.addEventListener("load", () => {
      parseXhrJsonResponse(xhr).then(resolve, reject);
    });
    xhr.addEventListener("error", () => {
      const error = new Error("上传参考图失败，请检查网络后重试");
      error.status = 0;
      reject(error);
    });
    xhr.addEventListener("abort", () => {
      const error = new Error("上传已取消");
      error.status = 0;
      reject(error);
    });

    xhr.send(body);
  });
}

async function parseXhrJsonResponse(xhr) {
  const text = String(xhr.responseText || "");
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch (_error) {
    data = {};
  }

  if (xhr.status < 200 || xhr.status >= 300) {
    const error = new Error(data.error || "请求失败");
    error.status = xhr.status;
    error.authRequired = xhr.status === 401;
    error.details = data.details || null;
    throw error;
  }
  return data;
}

function updateEditUploadProgress(percent) {
  const safePercent = Math.min(100, Math.max(0, Number(percent) || 0));
  stopProgressTimer();
  setProgressValue(Math.max(state.progressValue, Math.round(8 + safePercent * 0.34)));
  setRequestStatus(safePercent >= 100
    ? "参考图上传完成，正在创建任务"
    : `正在上传参考图 · ${safePercent}%`);
}

function updateImageJobStatus(job, mode, imageCount, targetCount) {
  if (imageCount) {
    return;
  }

  const status = String(job?.status || "");
  if (status === "queued") {
    const position = Number(job?.queuedPosition || job?.queue?.queuedPosition || 0);
    setProgressValue(Math.max(state.progressValue, 42));
    setRequestStatus(position > 1 ? `排队中 · 前面 ${position - 1} 个任务` : "排队中，等待开始");
    return;
  }

  if (status === "running") {
    setProgressValue(Math.max(state.progressValue, 52));
    setRequestStatus(mode === "edit" ? "正在编辑图片" : "正在生成图片");
    return;
  }

  if (targetCount) {
    setRequestStatus(mode === "edit" ? "编辑任务已提交" : "生成任务已提交");
  }
}

function mergeJobImages(rawImages, cache) {
  if (!Array.isArray(rawImages)) {
    return [];
  }

  return rawImages
    .map((image) => {
      const resultId = String(image?.resultId || "").trim();
      const cached = resultId ? cache.get(resultId) : null;
      const merged = {
        ...(cached || {}),
        ...(image || {}),
        dataUrl: String(image?.dataUrl || cached?.dataUrl || "").trim(),
        resultId: resultId || String(cached?.resultId || "").trim(),
      };
      const normalized = normalizeStoredImages([merged])[0];
      if (normalized?.resultId) {
        cache.set(normalized.resultId, normalized);
      }
      return normalized || null;
    })
    .filter(Boolean);
}

function updateImageJobProgress(generatedCount, targetCount) {
  stopProgressTimer();
  const safeTarget = Math.max(1, targetCount);
  const safeCount = Math.min(safeTarget, Math.max(1, generatedCount));
  if (safeCount >= safeTarget) {
    setProgressValue(Math.max(state.progressValue, 96));
    setRequestStatus("图片已生成，正在保存结果");
    return;
  }

  const nextProgress = Math.min(94, 52 + Math.round((safeCount / safeTarget) * 38));
  setProgressValue(Math.max(state.progressValue, nextProgress));
  setRequestStatus(`已生成 ${safeCount} / ${safeTarget} 张图片，继续等待剩余图片`);
}

function isImageJobFinal(job) {
  return ["succeeded", "partial", "failed"].includes(String(job?.status || ""));
}

function buildImageJobRenderSignature(job, normalizedImages) {
  const images = normalizedImages || normalizeStoredImages(job?.images);
  return [
    job?.status || "",
    images.length,
    images.map(getStoredImageIdentity).join("|"),
    (job?.galleryItems || []).map((item) => item?.id || item?.objectKey || "").join("|"),
  ].join("::");
}

async function recoverSharedGalleryResultsFromTimeout(options = {}) {
  if (!options.shareToGallery || !state.galleryEnabled || !isTimeoutLikeError(options.error)) {
    return [];
  }

  const expectedCount = normalizeRequestedImageCount(options.expectedCount);
  const deadline = Date.now() + 18000;
  while (Date.now() < deadline) {
    await loadGallery({ silent: true, force: true, renderInspiration: false });
    const matches = findRecentGalleryMatches({
      prompt: options.prompt,
      mode: options.mode,
      startedAt: options.startedAt,
      expectedCount,
    });
    if (matches.length) {
      syncSharedGalleryItems(matches, { markRecent: true, render: state.activeView === "gallery" });
      return matches;
    }

    await wait(1500);
  }

  return [];
}

function findRecentGalleryMatches({ prompt, mode, startedAt, expectedCount }) {
  const promptKey = normalizeGalleryRecoveryPrompt(prompt);
  if (!promptKey) {
    return [];
  }

  const startedAtMs = parseTimestampMs(startedAt) || Date.now();
  const minCreatedAt = startedAtMs - 10 * 60 * 1000;
  return state.galleryItems
    .filter((item) => {
      if (item.mode !== mode) {
        return false;
      }

      const createdAt = new Date(item.createdAt).getTime() || 0;
      return createdAt >= minCreatedAt
        && normalizeGalleryRecoveryPrompt(item.prompt) === promptKey;
    })
    .slice(0, expectedCount);
}

function galleryItemsToStoredImages(items) {
  return normalizeGalleryItems(items).map((item) => ({
    dataUrl: item.imageUrl,
    revisedPrompt: item.revisedPrompt || "",
    remoteUrl: item.remoteUrl || "",
    objectKey: item.objectKey || "",
    storedUrl: item.imageUrl,
    fileExtension: item.fileExtension || "",
    galleryItemId: item.id || "",
    galleryUrl: item.imageUrl,
    displayObjectKey: item.displayObjectKey || item.objectKey || "",
    displayUrl: item.displayUrl || item.imageUrl || "",
    displayMimeType: item.displayMimeType || item.mimeType || "",
    displayWidth: item.displayWidth || 0,
    displayHeight: item.displayHeight || 0,
    displaySize: item.displaySize || 0,
    originalWidth: item.originalWidth || 0,
    originalHeight: item.originalHeight || 0,
    originalMimeType: item.originalMimeType || "",
    originalSize: item.originalSize || 0,
    thumbnailObjectKey: item.thumbnailObjectKey || "",
    thumbnailUrl: item.thumbnailUrl || "",
  }));
}

function normalizeRequestedImageCount(value) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 1;
  }
  return Math.min(4, parsed);
}

function normalizeGalleryRecoveryPrompt(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function isTimeoutLikeError(error) {
  return error?.status === 504
    || /timeout|timed out|gateway timeout|超时/i.test(String(error?.message || ""));
}

function normalizeGalleryItems(items) {
  const seen = new Set();
  return (Array.isArray(items) ? items : [])
    .map((item) => {
      const rawDisplayUrl = String(item?.displayUrl || item?.display_url || item?.imageUrl || item?.image_url || "").trim();
      const displayObjectKey = normalizeGalleryObjectKey(item?.displayObjectKey)
        || normalizeGalleryObjectKey(item?.display_object_key)
        || normalizeGalleryObjectKey(item?.objectKey)
        || extractGalleryObjectKeyFromUrl(rawDisplayUrl);
      const objectKey = displayObjectKey;
      const imageUrl = buildPublicAssetUrl(displayObjectKey, rawDisplayUrl);
      const rawThumbnailUrl = String(item?.thumbnailUrl || item?.thumbnail_url || "").trim();
      const thumbnailObjectKey = normalizeGalleryObjectKey(item?.thumbnailObjectKey)
        || normalizeGalleryObjectKey(item?.thumbnail_object_key)
        || extractGalleryObjectKeyFromUrl(rawThumbnailUrl);
      const thumbnailUrl = buildPublicAssetUrl(thumbnailObjectKey, rawThumbnailUrl);
      const id = String(item?.id || "").trim();

      return {
        id,
        createdAt: String(item?.createdAt || "").trim(),
        title: normalizeSessionTitleText(item?.title || item?.metadata?.title || "") || "图片创作",
        prompt: String(item?.prompt || "").trim(),
        mode: item?.mode === "edit" ? "edit" : "generate",
        visibility: normalizeGalleryVisibility(item?.visibility),
        status: normalizeGalleryStatus(item?.status),
        imageUrl,
        displayUrl: imageUrl,
        displayObjectKey,
        objectKey,
        displayMimeType: String(item?.displayMimeType || item?.display_mime_type || item?.mimeType || "").trim(),
        displayWidth: normalizeNonNegativeNumber(item?.displayWidth ?? item?.display_width),
        displayHeight: normalizeNonNegativeNumber(item?.displayHeight ?? item?.display_height),
        displaySize: normalizeNonNegativeNumber(item?.displaySize ?? item?.display_size),
        originalWidth: normalizeNonNegativeNumber(item?.originalWidth ?? item?.original_width),
        originalHeight: normalizeNonNegativeNumber(item?.originalHeight ?? item?.original_height),
        originalMimeType: String(item?.originalMimeType || item?.original_mime_type || "").trim(),
        originalSize: normalizeNonNegativeNumber(item?.originalSize ?? item?.original_size),
        thumbnailUrl,
        thumbnailObjectKey,
        thumbnailMimeType: String(item?.thumbnailMimeType || item?.thumbnail_mime_type || "").trim(),
        thumbnailWidth: normalizeNonNegativeNumber(item?.thumbnailWidth ?? item?.thumbnail_width),
        thumbnailHeight: normalizeNonNegativeNumber(item?.thumbnailHeight ?? item?.thumbnail_height),
        thumbnailSize: normalizeNonNegativeNumber(item?.thumbnailSize ?? item?.thumbnail_size),
        mimeType: String(item?.mimeType || "").trim(),
        fileExtension: String(item?.fileExtension || "").trim(),
        revisedPrompt: String(item?.revisedPrompt || "").trim(),
        remoteUrl: String(item?.remoteUrl || "").trim(),
        metadata: item?.metadata && typeof item.metadata === "object" ? item.metadata : {},
      };
    })
    .filter((item) => item.id && item.imageUrl)
    .filter((item) => {
      const keys = getGalleryItemIdentityKeys(item);
      if (!keys.length || keys.some((key) => seen.has(key))) {
        return false;
      }

      keys.forEach((key) => seen.add(key));
      return true;
    })
    .sort((left, right) => {
      const rightTime = new Date(right.createdAt).getTime() || 0;
      const leftTime = new Date(left.createdAt).getTime() || 0;
      return rightTime - leftTime;
    });
}

function normalizeGalleryVisibility(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return normalized === "private" ? "private" : "public";
}

function normalizeGalleryStatus(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "pending" || normalized === "failed" || normalized === "deleted") {
    return normalized;
  }
  return "completed";
}

function normalizeNonNegativeNumber(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function getGalleryItemIdentity(item) {
  return getGalleryItemIdentityKeys(item)[0] || "";
}

function getGalleryItemIdentityKeys(item) {
  const keys = [];
  const objectKey = normalizeGalleryObjectKey(item?.displayObjectKey)
    || normalizeGalleryObjectKey(item?.objectKey)
    || extractGalleryObjectKeyFromUrl(item?.imageUrl);
  if (objectKey) {
    keys.push(`object:${objectKey}`);
  }

  const imageUrl = normalizeGalleryImageUrl(item?.displayUrl || item?.imageUrl);
  if (imageUrl) {
    keys.push(`image:${imageUrl}`);
  }

  const id = String(item?.id || "").trim();
  if (id) {
    keys.push(`id:${id}`);
  }

  return keys;
}

function hasMatchingGalleryItem(items, targetItem) {
  const targetKeys = new Set(getGalleryItemIdentityKeys(targetItem));
  return items.some((item) => getGalleryItemIdentityKeys(item).some((key) => targetKeys.has(key)));
}

function normalizeGalleryObjectKey(value) {
  const rawValue = String(value || "").trim();
  if (!rawValue) {
    return "";
  }

  try {
    return decodeURIComponent(rawValue);
  } catch (_error) {
    return rawValue;
  }
}

function extractGalleryObjectKeyFromUrl(value) {
  const rawValue = String(value || "").trim();
  if (!rawValue) {
    return "";
  }

  try {
    const url = new URL(rawValue, window.location.origin);
    if (url.pathname === "/api/gallery/object") {
      return normalizeGalleryObjectKey(url.searchParams.get("key"));
    }
    const path = decodeURIComponent(url.pathname.replace(/^\/+/, ""));
    const markerIndex = path.indexOf("image-tool/");
    if (markerIndex !== -1) {
      return normalizeGalleryObjectKey(path.slice(markerIndex));
    }
  } catch (_error) {
    const match = rawValue.match(/[?&]key=([^&]+)/);
    if (match) {
      return normalizeGalleryObjectKey(match[1]);
    }
    const markerIndex = rawValue.indexOf("image-tool/");
    if (markerIndex !== -1) {
      return normalizeGalleryObjectKey(rawValue.slice(markerIndex));
    }
  }

  return "";
}

function normalizeGalleryImageUrl(value) {
  const rawValue = String(value || "").trim();
  if (!rawValue) {
    return "";
  }

  const objectKey = extractGalleryObjectKeyFromUrl(rawValue);
  if (objectKey) {
    return buildPublicAssetUrl(objectKey, rawValue);
  }

  return rawValue;
}

function mergeGalleryItems(items) {
  const normalizedItems = normalizeGalleryItems(items);
  state.galleryItems = normalizeGalleryItems([
    ...normalizedItems,
    ...state.galleryItems,
  ]);
  return normalizedItems;
}

function removeGalleryItems(items) {
  const normalizedItems = normalizeGalleryItems(items);
  const removeKeys = new Set(normalizedItems.flatMap(getGalleryItemIdentityKeys));
  if (!removeKeys.size) {
    return;
  }

  state.galleryItems = state.galleryItems.filter((item) => !getGalleryItemIdentityKeys(item).some((key) => removeKeys.has(key)));
  state.inspirationItems = state.inspirationItems.filter((item) => !getInspirationDedupKeys(item).some((key) => removeKeys.has(key)));
  const availablePageKeys = new Set(state.galleryItems.flatMap(getGalleryItemIdentityKeys));
  state.galleryPageItemIds = state.galleryPageItemIds.filter((key) => availablePageKeys.has(key));
  state.inspirationLastIds = state.inspirationLastIds.filter((key) => !removeKeys.has(key));
  state.recentGalleryItemIds = state.recentGalleryItemIds.filter((key) => !removeKeys.has(key));
}

function getGalleryPageKey(item) {
  return getGalleryItemIdentity(item) || item?.id || item?.displayObjectKey || item?.objectKey || item?.displayUrl || item?.imageUrl || "";
}

function addGalleryPageItems(items, options = {}) {
  const keys = (Array.isArray(items) ? items : []).map(getGalleryPageKey).filter(Boolean);
  const current = options.prepend
    ? [...keys, ...state.galleryPageItemIds]
    : [...state.galleryPageItemIds, ...keys];
  state.galleryPageItemIds = uniqueStringList(current);
}

function getGalleryPageItems() {
  if (!state.galleryPageItemIds.length) {
    return [];
  }

  const byKey = new Map();
  state.galleryItems.forEach((item) => {
    getGalleryItemIdentityKeys(item).forEach((key) => byKey.set(key, item));
  });
  return state.galleryPageItemIds
    .map((key) => byKey.get(key))
    .filter(Boolean);
}

function renderPublicGallery() {
  const pageItems = getGalleryPageItems();

  if (!pageItems.length && state.galleryError) {
    elements.publicGalleryGrid.innerHTML = `
      <div class="empty-state compact-empty gallery-state-card">
        <p>${escapeHtml(state.galleryError)}</p>
        <button class="secondary-button js-retry-gallery" type="button">重试</button>
      </div>
    `;
    bindGalleryRetryAction();
    renderGalleryLoadMore();
    return;
  }

  if (!pageItems.length && state.galleryLoading) {
    elements.publicGalleryGrid.innerHTML = renderGallerySkeletonCards(GALLERY_PAGE_SIZE);
    renderGalleryLoadMore();
    return;
  }

  if (!pageItems.length) {
    elements.publicGalleryGrid.innerHTML = `<div class="empty-state compact-empty"><p>画廊暂时还没有公开图片。</p></div>`;
    renderGalleryLoadMore();
    return;
  }

  elements.publicGalleryGrid.innerHTML = pageItems
    .map((item, index) => renderGalleryCard(item, index))
    .join("");

  bindGalleryCardActions(pageItems);
  bindGalleryImageLoadStates();
  renderGalleryLoadMore();
  if (state.pendingLibraryAutoScrollView === "gallery") {
    scheduleLibraryAutoScroll("gallery");
  }
}

function scheduleLibraryAutoScroll(view) {
  window.requestAnimationFrame(() => {
    window.setTimeout(() => {
      if (state.activeView === view) {
        void startLibraryAutoScroll(view);
      }
    }, 220);
  });
}

async function startLibraryAutoScroll(view) {
  const container = getLibraryScrollContainer(view);
  const grid = getLibraryGridElement(view);
  if (!container || !grid || state.activeView !== view) {
    return;
  }

  if (!getLibraryImageElements(view).length) {
    return;
  }

  stopLibraryAutoScroll();
  const token = state.libraryAutoScrollToken + 1;
  state.libraryAutoScrollToken = token;
  state.pendingLibraryAutoScrollView = "";
  state.libraryAutoScrollView = view;
  state.libraryAutoScrollStartedAt = 0;
  state.libraryAutoScrollLastAt = 0;

  const targetTop = Math.max(0, grid.offsetTop - 12);
  container.scrollTo({
    top: targetTop,
    behavior: "smooth",
  });
  prioritizeLibraryInitialImages(view);
  await wait(260);
  prioritizeLibraryInitialImages(view);
  const readyForScroll = await waitForLibraryInitialImages(view, token);
  if (
    state.activeView !== view
    || state.libraryAutoScrollView !== view
    || state.libraryAutoScrollToken !== token
  ) {
    return;
  }
  if (!readyForScroll) {
    stopLibraryAutoScroll();
    return;
  }
  state.libraryAutoScrollFrame = window.requestAnimationFrame(stepLibraryAutoScroll);
}

function stepLibraryAutoScroll(timestamp) {
  const view = state.libraryAutoScrollView;
  const container = getLibraryScrollContainer(view);
  if (!container || state.activeView !== view) {
    stopLibraryAutoScroll();
    return;
  }

  if (!state.libraryAutoScrollStartedAt) {
    state.libraryAutoScrollStartedAt = timestamp;
    state.libraryAutoScrollLastAt = timestamp;
  }

  const elapsed = timestamp - state.libraryAutoScrollStartedAt;
  const delta = Math.max(0, timestamp - state.libraryAutoScrollLastAt);
  state.libraryAutoScrollLastAt = timestamp;

  if (elapsed > LIBRARY_AUTO_SCROLL_MAX_MS) {
    stopLibraryAutoScroll();
    return;
  }

  const remaining = container.scrollHeight - container.scrollTop - container.clientHeight;
  if (view === "gallery" && remaining < 520 && state.galleryHasMore && !state.galleryLoading) {
    void loadGallery({ append: true, silent: true, renderInspiration: false });
  }

  if (remaining <= 2) {
    if (view === "gallery" && (state.galleryHasMore || state.galleryLoading)) {
      state.libraryAutoScrollFrame = window.requestAnimationFrame(stepLibraryAutoScroll);
      return;
    }

    stopLibraryAutoScroll();
    return;
  }

  container.scrollTop += Math.min(remaining, delta * LIBRARY_AUTO_SCROLL_SPEED);
  state.libraryAutoScrollFrame = window.requestAnimationFrame(stepLibraryAutoScroll);
}

function stopLibraryAutoScroll() {
  if (state.libraryAutoScrollFrame) {
    window.cancelAnimationFrame(state.libraryAutoScrollFrame);
  }
  state.libraryAutoScrollToken += 1;
  state.libraryAutoScrollFrame = 0;
  state.libraryAutoScrollView = "";
  state.libraryAutoScrollStartedAt = 0;
  state.libraryAutoScrollLastAt = 0;
}

function bindLibraryAutoScrollStopEvents(container) {
  if (!container) {
    return;
  }

  ["wheel", "touchstart", "pointerdown"].forEach((eventName) => {
    container.addEventListener(eventName, stopLibraryAutoScroll, { passive: true });
  });
}

function getLibraryScrollContainer(view) {
  if (view === "gallery") {
    return elements.galleryView;
  }
  if (view === "templates") {
    return elements.templatesView;
  }
  return null;
}

function getLibraryGridElement(view) {
  if (view === "gallery") {
    return elements.publicGalleryGrid;
  }
  if (view === "templates") {
    return elements.templateGrid;
  }
  return null;
}

function getLibraryImageSelector(view) {
  if (view === "gallery") {
    return ".gallery-image";
  }
  if (view === "templates") {
    return ".library-image";
  }
  return "";
}

function getLibraryImageElements(view) {
  const grid = getLibraryGridElement(view);
  const selector = getLibraryImageSelector(view);
  if (!grid || !selector) {
    return [];
  }

  return Array.from(grid.querySelectorAll(selector))
    .filter((image) => image instanceof HTMLImageElement && (image.currentSrc || image.src));
}

function getLibraryInitialImages(view) {
  const images = getLibraryImageElements(view);
  if (!images.length) {
    return [];
  }

  const container = getLibraryScrollContainer(view);
  const containerRect = container?.getBoundingClientRect();
  if (containerRect?.height) {
    const visibleTop = containerRect.top - LIBRARY_INITIAL_VIEWPORT_BUFFER_PX;
    const visibleBottom = containerRect.bottom + LIBRARY_INITIAL_VIEWPORT_BUFFER_PX;
    const visibleImages = images.filter((image) => {
      const rect = image.getBoundingClientRect();
      return rect.width > 0
        && rect.height > 0
        && rect.bottom >= visibleTop
        && rect.top <= visibleBottom;
    });
    if (visibleImages.length) {
      return visibleImages.slice(0, LIBRARY_INITIAL_IMAGE_MAX_COUNT);
    }
  }

  return images.slice(0, LIBRARY_EAGER_IMAGE_COUNT);
}

function prioritizeLibraryInitialImages(view) {
  getLibraryInitialImages(view).forEach((image) => {
    image.loading = "eager";
    if ("fetchPriority" in image) {
      image.fetchPriority = "high";
    }
  });
}

async function waitForLibraryInitialImages(view, token) {
  const images = getLibraryInitialImages(view);
  if (!images.length) {
    return false;
  }

  const ready = Promise.allSettled(images.map(waitForLibraryImageReady));
  const timeout = wait(LIBRARY_AUTO_SCROLL_READY_TIMEOUT_MS);
  await Promise.race([ready, timeout]);

  if (state.activeView !== view || state.libraryAutoScrollToken !== token) {
    return;
  }

  images.forEach((image) => {
    if (isLibraryImageReady(image)) {
      image.classList.add("is-loaded");
    }
  });
  return images.some((image) => isLibraryImageReady(image) || image.complete);
}

function waitForLibraryImageReady(image) {
  if (isLibraryImageReady(image)) {
    image.classList.add("is-loaded");
    return Promise.resolve();
  }

  if (image.complete && !image.naturalWidth) {
    image.classList.add("is-loaded");
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    let settled = false;
    const cleanup = () => {
      image.removeEventListener("load", handleLoad);
      image.removeEventListener("error", handleError);
    };
    const finish = () => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      image.classList.add("is-loaded");
      resolve();
    };
    const handleLoad = () => {
      if (typeof image.decode !== "function") {
        finish();
        return;
      }
      image.decode().catch(() => {}).finally(finish);
    };
    const handleError = finish;

    image.addEventListener("load", handleLoad, { once: true });
    image.addEventListener("error", handleError, { once: true });

    if (image.complete) {
      handleLoad();
    }
  });
}

function isLibraryImageReady(image) {
  return Boolean(image?.complete && image.naturalWidth > 0);
}

function isLibraryScrollKey(key) {
  return [
    "ArrowDown",
    "ArrowUp",
    "PageDown",
    "PageUp",
    "Home",
    "End",
    " ",
    "Spacebar",
  ].includes(key);
}

function renderGallerySkeletonCards(count) {
  return Array.from({ length: Math.min(8, count) }, () => `
    <article class="gallery-card gallery-card-skeleton" aria-hidden="true">
      <span></span>
      <i></i>
      <b></b>
    </article>
  `).join("");
}

function renderGalleryLoadMore() {
  if (!elements.galleryLoadMore) {
    return;
  }

  if (state.galleryLoading && state.galleryPageItemIds.length) {
    elements.galleryLoadMore.innerHTML = `<div class="gallery-inline-state">${renderGallerySkeletonCards(4)}</div>`;
    return;
  }

  if (state.galleryError && state.galleryPageItemIds.length) {
    elements.galleryLoadMore.innerHTML = `
      <div class="gallery-load-error">
        <span>${escapeHtml(state.galleryError)}</span>
        <button class="secondary-button js-retry-gallery" type="button">重试</button>
      </div>
    `;
    bindGalleryRetryAction();
    return;
  }

  elements.galleryLoadMore.innerHTML = state.galleryHasMore && state.galleryPageItemIds.length
    ? `<span class="gallery-more-hint">继续向下滚动加载更多</span>`
    : "";
}

function bindGalleryRetryAction() {
  document.querySelectorAll(".js-retry-gallery").forEach((button) => {
    button.addEventListener("click", () => {
      void loadGallery({ append: Boolean(state.galleryPageItemIds.length), silent: false });
    });
  });
}

function bindGalleryCardActions(pageItems) {
  Array.from(elements.publicGalleryGrid.querySelectorAll("[data-gallery-index]")).forEach((button) => {
    button.addEventListener("click", () => {
      const item = pageItems[Number(button.dataset.galleryIndex)];
      if (!item) {
        return;
      }

      if (button.classList.contains("js-preview-gallery")) {
        previewGalleryItem(item);
      } else if (button.classList.contains("js-copy-gallery-prompt")) {
        void copyGalleryPrompt(item);
      } else if (button.classList.contains("js-generate-gallery-prompt")) {
        useGalleryPromptForGeneration(item);
      } else if (button.classList.contains("js-edit-gallery-image")) {
        void useGalleryImageForEdit(item);
      } else if (button.classList.contains("js-delete-gallery-image")) {
        void deleteGalleryImage(item);
      }
    });
  });
}

function bindGalleryImageLoadStates() {
  elements.publicGalleryGrid.querySelectorAll(".gallery-image").forEach((image) => {
    bindLibraryImageLoadState(image);
  });
}

function bindTemplateImageLoadStates() {
  elements.templateGrid.querySelectorAll(".library-image").forEach((image) => {
    bindLibraryImageLoadState(image);
  });
}

function bindLibraryImageLoadState(image) {
    if (image.complete && image.naturalWidth > 0) {
      image.classList.add("is-loaded");
      return;
    }

    image.addEventListener("load", () => {
      image.classList.add("is-loaded");
    }, { once: true });
    image.addEventListener("error", () => {
      image.classList.add("is-loaded");
    }, { once: true });
}

function renderGalleryCard(item, index) {
  const created = item.createdAt ? new Date(item.createdAt).toLocaleString() : "";
  const modeLabel = item.mode === "edit" ? "图片编辑" : "文生图";
  const prompt = item.prompt || item.revisedPrompt || "";
  const thumbnailSrc = getGalleryThumbnailUrl(item);
  const dimensions = getGalleryImageDimensions(item);
  const dimensionAttrs = dimensions.width && dimensions.height
    ? ` width="${dimensions.width}" height="${dimensions.height}"`
    : "";
  const loadingAttrs = getLibraryImageLoadingAttributes(index);
  return `
    <article class="gallery-card gallery-visual-card">
      <button class="result-preview-button js-preview-gallery" type="button" data-gallery-index="${index}" aria-label="预览画廊图片">
        <img class="gallery-image" src="${escapeHtml(thumbnailSrc)}" alt="${escapeHtml(item.title || "画廊图片")}"${loadingAttrs}${dimensionAttrs} />
      </button>
      <div class="gallery-card-meta">
        <span>${escapeHtml(modeLabel)}</span>
        <small>${escapeHtml(created)}</small>
      </div>
      <div class="card-actions">
        <button class="secondary-button js-preview-gallery" type="button" data-gallery-index="${index}">预览</button>
        <button class="secondary-button js-copy-gallery-prompt" type="button" data-gallery-index="${index}" ${prompt ? "" : "disabled"}>复制提示词</button>
        <button class="download-button js-generate-gallery-prompt" type="button" data-gallery-index="${index}" ${prompt ? "" : "disabled"}>用提示词生成</button>
        <button class="secondary-button js-edit-gallery-image" type="button" data-gallery-index="${index}">基于此图再创作</button>
        ${state.isAdmin ? `<button class="secondary-button gallery-danger-action js-delete-gallery-image" type="button" data-gallery-index="${index}">删除</button>` : ""}
      </div>
    </article>
  `;
}

function getGalleryImageDimensions(item) {
  const width = normalizeNonNegativeNumber(item?.thumbnailWidth || item?.displayWidth);
  const height = normalizeNonNegativeNumber(item?.thumbnailHeight || item?.displayHeight);
  if (!width || !height) {
    return { width: 0, height: 0 };
  }

  return { width, height };
}

function previewGalleryItem(item) {
  openPreviewModal({
    src: getGalleryFullImageUrl(item),
    caption: "画廊图片",
    fileName: `gallery-${item.id || "image"}.${item.fileExtension || "png"}`,
    prompt: item.prompt || item.revisedPrompt || "",
    allowDownload: false,
  });
}

async function copyGalleryPrompt(item) {
  const prompt = item.prompt || item.revisedPrompt || "";
  if (!prompt) {
    showError("这张图片没有可复制的提示词");
    return;
  }

  try {
    await navigator.clipboard.writeText(prompt);
    setRequestStatus("已复制提示词");
  } catch (_error) {
    showError("复制提示词失败");
  }
}

function useGalleryPromptForGeneration(item) {
  const prompt = item.prompt || item.revisedPrompt || "";
  if (!prompt) {
    showError("这张图片没有可复用的提示词");
    return;
  }

  switchMode("generate");
  switchView("chat");
  elements.generatePrompt.value = prompt;
  autoResizeTextarea(elements.generatePrompt);
  updatePromptCounters();
  elements.generatePrompt.focus();
  setRequestStatus("已填入画廊提示词");
  scheduleLocalWorkspaceSave();
}

async function useGalleryImageForEdit(item) {
  const prompt = item.prompt || item.revisedPrompt || "";
  switchMode("edit");
  switchView("chat");
  if (prompt) {
    elements.editPrompt.value = prompt;
    autoResizeTextarea(elements.editPrompt);
    updatePromptCounters();
  }

  try {
    const file = await fetchGalleryItemAsFile(item);
    state.uploadSourceFiles.images = [file];
    state.uploadRestoreFallback.images = !restoreFilesToInput(elements.editImages, [file]);
    renderFilePreview(getUploadFiles("images"), elements.imagePreviewStrip, "参考图", "imagePreviewStrip");
    elements.editPrompt.focus();
    setRequestStatus("已添加参考图");
    scheduleLocalWorkspaceSave();
  } catch (error) {
    showError(error.message || "添加参考图失败");
  }
}

async function deleteGalleryImage(item) {
  if (!state.isAdmin) {
    showError("需要管理员权限");
    return;
  }
  const id = String(item?.id || "").trim();
  if (!id) {
    showError("这张图片缺少画廊记录，暂时无法删除");
    return;
  }

  if (!window.confirm("确定彻底删除这张画廊图片吗？数据库记录和对象存储文件都会删除。")) {
    return;
  }

  try {
    const response = await fetchApi(`/api/admin/gallery/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const data = await parseResponse(response);
    removeGalleryItems([data.item || item]);
    renderPublicGallery();
    renderInspirationGrid({ shuffle: true });
    setRequestStatus("已从画廊删除");
  } catch (error) {
    showError(formatRequestError(error));
  }
}

async function fetchGalleryItemAsFile(item) {
  const imageUrl = getGalleryFetchImageUrl(item);
  if (!imageUrl) {
    throw new Error("这张图片没有可用地址");
  }

  const response = await fetch(imageUrl, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("读取画廊图片失败");
  }

  const blob = await response.blob();
  const extension = normalizeFileExtension(item.fileExtension || blob.type.split("/").pop() || "png");
  return new File([blob], `gallery-${item.id || Date.now()}.${extension}`, {
    type: blob.type || item.mimeType || `image/${extension === "jpg" ? "jpeg" : extension}`,
    lastModified: Date.now(),
  });
}

function getGalleryFullImageUrl(item) {
  const objectKey = normalizeGalleryObjectKey(item?.displayObjectKey)
    || normalizeGalleryObjectKey(item?.objectKey);
  const displayUrl = String(item?.displayUrl || item?.imageUrl || "").trim();
  return objectKey
    ? buildPublicAssetUrl(objectKey, displayUrl)
    : displayUrl;
}

function getGalleryThumbnailUrl(item) {
  const thumbnailUrl = String(item?.thumbnailUrl || "").trim();
  if (thumbnailUrl) {
    return thumbnailUrl;
  }
  return String(item?.displayUrl || item?.imageUrl || "").trim();
}

function getGalleryFetchImageUrl(item) {
  const objectKey = normalizeGalleryObjectKey(item?.displayObjectKey)
    || normalizeGalleryObjectKey(item?.objectKey);
  return objectKey
    ? `/api/gallery/blob?key=${encodeURIComponent(objectKey)}`
    : String(item?.displayUrl || item?.imageUrl || "").trim();
}

function renderResults(images, options = {}) {
  const nextImages = normalizeStoredImages(images);
  const append = options.append !== false;
  const previousImages = state.currentImages;
  applyGalleryItemsToImages(nextImages, options.galleryItems);

  if (!nextImages.length) {
    if (options.pendingMessageId) {
      updateConversationMessage(options.pendingMessageId, {
        status: "done",
        prompt: "本次请求没有返回图片。",
      });
    }

    if (append && previousImages.length) {
      state.currentImages = previousImages;
      setRequestStatus("本次请求没有返回图片，已保留当前结果");
      renderCurrentResultViews();
      scheduleLocalWorkspaceSave();
      return;
    }

    renderEmptyResultsState();
    scheduleLocalWorkspaceSave();
    return;
  }

  state.currentImages = nextImages;
  state.currentResultMode = options.mode === "edit" || options.mode === "generate"
    ? options.mode
    : state.currentResultMode;
  if (Array.isArray(options.galleryItems) && options.galleryItems.length) {
    syncSharedGalleryItems(options.galleryItems, { markRecent: true, render: state.activeView === "gallery" });
  }

  if (!options.skipConversation) {
    const messageStatus = options.messageStatus || "done";
    const messagePrompt = options.messagePrompt || (options.mode === "edit" ? "编辑完成" : "生成完成");
    if (options.pendingMessageId) {
      updateConversationMessage(options.pendingMessageId, {
        status: messageStatus,
        prompt: messagePrompt,
        images: nextImages,
        sourcePrompt: options.prompt || "",
      });
    } else {
      addConversationMessage({
        role: "assistant",
        mode: options.mode || state.activeMode,
        status: messageStatus,
        prompt: messagePrompt,
        images: nextImages,
        sourcePrompt: options.prompt || "",
      });
    }
  }

  renderCurrentResultViews();

  scheduleLocalWorkspaceSave(0);
}

function renderResultTile(image, index, options = {}) {
  const variant = options.variant || "canvas";
  const previewClass = options.previewClass || "js-preview-result";
  const downloadClass = options.downloadClass || "js-download-result";
  const previewAttribute = options.previewAttribute || "data-preview-index";
  const downloadAttribute = options.downloadAttribute || "data-download-index";
  const caption = options.caption || (variant === "rail" ? `本地图片 ${index + 1}` : `结果图 ${index + 1}`);
  const revisedPrompt = renderRevisedPromptDetails(image.revisedPrompt);
  const remoteUrl = image.remoteUrl
    ? `<p class="meta-text"><a href="${escapeHtml(image.remoteUrl)}" target="_blank" rel="noreferrer">查看远端地址</a></p>`
    : "";
  const shareStatus = image.galleryItemId
    ? `<p class="meta-text">已分享到画廊</p>`
    : "";
  const notes = [revisedPrompt, remoteUrl, shareStatus].filter(Boolean).join("");

  if (variant === "rail") {
    return `
      <article class="result-tile result-tile--rail">
        <button class="result-preview-button ${previewClass}" type="button" ${previewAttribute}="${index}" data-preview-caption="${escapeHtml(caption)}" aria-label="预览${escapeHtml(caption)}">
          <img class="result-image" src="${image.dataUrl}" alt="${escapeHtml(caption)}" loading="lazy" />
          <span class="result-rail-caption">${escapeHtml(caption)}</span>
        </button>
        <button class="result-rail-delete js-delete-result" type="button" data-delete-index="${index}" aria-label="删除${escapeHtml(caption)}">×</button>
      </article>
    `;
  }

  return `
    <article class="result-tile result-tile--canvas">
      <div class="result-media-frame">
        <button class="result-preview-button ${previewClass}" type="button" ${previewAttribute}="${index}" data-preview-caption="${escapeHtml(caption)}" aria-label="预览${escapeHtml(caption)}">
          <img class="result-image" src="${image.dataUrl}" alt="${escapeHtml(caption)}" loading="lazy" />
        </button>
      </div>
      <div class="result-actions">
        <button class="secondary-button ${previewClass}" type="button" ${previewAttribute}="${index}">预览</button>
        <button class="download-button ${downloadClass}" type="button" ${downloadAttribute}="${index}">下载</button>
        <button class="secondary-button js-share-result" type="button" data-share-index="${index}" ${image.galleryItemId ? "disabled" : ""}>分享</button>
        <button class="secondary-button js-regenerate-result" type="button" data-regenerate-index="${index}">重新生成</button>
        <button class="secondary-button result-danger-action js-delete-result" type="button" data-delete-index="${index}">删除</button>
      </div>
      ${notes ? `<div class="result-meta"><div class="result-notes">${notes}</div></div>` : ""}
    </article>
  `;
}

function renderRevisedPromptDetails(revisedPrompt) {
  const text = String(revisedPrompt || "").trim();
  if (!text) {
    return "";
  }

  return `
    <details class="revised-prompt">
      <summary><span>优化后的提示词</span><small>查看</small></summary>
      <p>${escapeHtml(text)}</p>
    </details>
  `;
}

function bindResultGridActions(container, images) {
  if (!container) {
    return;
  }

  const previewItems = buildImagePreviewItems(images, {
    captionPrefix: "结果图",
    promptGetter: (image) => findPromptForImage(image),
    mode: state.currentResultMode,
  });

  Array.from(container.querySelectorAll(".js-preview-result")).forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.previewIndex);
      const image = images[index];
      if (!image) {
        return;
      }
      openPreviewModal({ items: previewItems, index });
    });
  });

  Array.from(container.querySelectorAll(".js-download-result")).forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.downloadIndex);
      const image = images[index];
      if (!image) {
        return;
      }
      downloadImage(image.dataUrl, buildDownloadName(index, image));
    });
  });

  Array.from(container.querySelectorAll(".js-share-result")).forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.shareIndex);
      void shareLocalResult(index, button);
    });
  });

  Array.from(container.querySelectorAll(".js-regenerate-result")).forEach((button) => {
    button.addEventListener("click", () => {
      regenerateResult(Number(button.dataset.regenerateIndex));
    });
  });

  Array.from(container.querySelectorAll(".js-delete-result")).forEach((button) => {
    button.addEventListener("click", () => {
      const image = images[Number(button.dataset.deleteIndex)];
      deleteSessionImage(image);
    });
  });
}

function regenerateResult(index) {
  if (state.requestInFlight) {
    return;
  }

  const image = state.currentImages[index];
  if (!image) {
    return;
  }

  const mode = state.currentResultMode === "edit" ? "edit" : "generate";
  const prompt = findPromptForImage(image) || getPromptField(mode)?.value.trim() || "";

  switchMode(mode);

  const promptField = getPromptField(mode);
  if (!promptField) {
    return;
  }
  if (prompt) {
    promptField.value = prompt;
    autoResizeTextarea(promptField);
    updatePromptCounters();
    scheduleLocalWorkspaceSave();
  }

  if (!promptField.value.trim()) {
    showError("没有可用于重新生成的提示词");
    promptField.focus();
    return;
  }

  promptField.form.requestSubmit();
}

function regenerateMessageResult(messageIndex, imageIndex) {
  if (state.requestInFlight) {
    return;
  }

  const message = state.messages[messageIndex];
  const image = message?.images?.[imageIndex];
  if (!message || !image) {
    return;
  }

  const mode = message.mode === "edit" ? "edit" : "generate";
  const prompt = message.sourcePrompt || findPreviousUserPrompt(messageIndex) || findPromptForImage(image);
  switchMode(mode);

  const promptField = getPromptField(mode);
  if (!promptField) {
    return;
  }

  if (prompt) {
    promptField.value = prompt;
    autoResizeTextarea(promptField);
    updatePromptCounters();
    scheduleLocalWorkspaceSave();
  }

  if (!promptField.value.trim()) {
    showError("没有可用于重新生成的提示词");
    promptField.focus();
    return;
  }

  promptField.form.requestSubmit();
}

function bindConversationActions() {
  Array.from(elements.messagesList.querySelectorAll(".js-preview-message-result")).forEach((button) => {
    button.addEventListener("click", () => {
      const messageIndex = Number(button.dataset.messageIndex);
      const imageIndex = Number(button.dataset.messageImageIndex);
      const image = state.messages[messageIndex]?.images?.[imageIndex];
      if (!image) {
        return;
      }
      const message = state.messages[messageIndex];
      openPreviewModal({
        items: buildImagePreviewItems(message.images, {
          captionPrefix: "对话图片",
          prompt: message.sourcePrompt || findPreviousUserPrompt(messageIndex),
          mode: message.mode,
        }),
        index: imageIndex,
      });
    });
  });

  Array.from(elements.messagesList.querySelectorAll(".js-download-message-result")).forEach((button) => {
    button.addEventListener("click", () => {
      const messageIndex = Number(button.dataset.messageIndex);
      const imageIndex = Number(button.dataset.messageImageIndex);
      const image = state.messages[messageIndex]?.images?.[imageIndex];
      if (!image) {
        return;
      }
      downloadImage(image.dataUrl, buildDownloadName(imageIndex, image));
    });
  });

  Array.from(elements.messagesList.querySelectorAll(".js-preview-message-attachment")).forEach((button) => {
    button.addEventListener("click", () => {
      const messageIndex = Number(button.dataset.messageIndex);
      const imageIndex = Number(button.dataset.messageImageIndex);
      const image = state.messages[messageIndex]?.attachments?.[imageIndex];
      if (!image) {
        return;
      }
      openPreviewModal({
        src: image.dataUrl,
        caption: `参考图 ${imageIndex + 1}`,
        fileName: buildDownloadName(imageIndex, image),
      });
    });
  });

  Array.from(elements.messagesList.querySelectorAll(".js-share-message-result")).forEach((button) => {
    button.addEventListener("click", () => {
      const messageIndex = Number(button.dataset.messageIndex);
      const imageIndex = Number(button.dataset.messageImageIndex);
      void shareMessageResult(messageIndex, imageIndex, button);
    });
  });

  Array.from(elements.messagesList.querySelectorAll(".js-delete-message-result")).forEach((button) => {
    button.addEventListener("click", () => {
      const messageIndex = Number(button.dataset.messageIndex);
      const imageIndex = Number(button.dataset.messageImageIndex);
      deleteMessageResult(messageIndex, imageIndex);
    });
  });

  Array.from(elements.messagesList.querySelectorAll(".js-regenerate-message-result")).forEach((button) => {
    button.addEventListener("click", () => {
      regenerateMessageResult(Number(button.dataset.messageIndex), Number(button.dataset.messageImageIndex));
    });
  });
}

function mergeResultImages(newImages, existingImages) {
  const seen = new Set();
  return [...newImages, ...existingImages].filter((image) => {
    const key = image.dataUrl || image.remoteUrl;
    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function applyGalleryItemsToImages(images, galleryItems) {
  if (!Array.isArray(images) || !Array.isArray(galleryItems)) {
    return;
  }

  images.forEach((image, index) => {
    const galleryItem = galleryItems[index];
    if (!galleryItem?.id) {
      return;
    }

    image.galleryItemId = galleryItem.id;
    image.galleryUrl = galleryItem.imageUrl || "";
    image.displayObjectKey = galleryItem.displayObjectKey || galleryItem.objectKey || "";
    image.displayUrl = galleryItem.displayUrl || galleryItem.imageUrl || "";
    image.displayMimeType = galleryItem.displayMimeType || galleryItem.mimeType || "";
    image.displayWidth = galleryItem.displayWidth || 0;
    image.displayHeight = galleryItem.displayHeight || 0;
    image.displaySize = galleryItem.displaySize || 0;
    image.originalWidth = galleryItem.originalWidth || image.originalWidth || 0;
    image.originalHeight = galleryItem.originalHeight || image.originalHeight || 0;
    image.originalMimeType = galleryItem.originalMimeType || image.originalMimeType || "";
    image.originalSize = galleryItem.originalSize || image.originalSize || 0;
    image.thumbnailObjectKey = galleryItem.thumbnailObjectKey || "";
    image.thumbnailUrl = galleryItem.thumbnailUrl || "";
  });
}

async function shareLocalResult(index, button) {
  const image = state.currentImages[index];
  if (!image || image.galleryItemId) {
    return;
  }

  await shareImageToGallery({
    image,
    prompt: findPromptForImage(image) || elements.generatePrompt.value.trim(),
    mode: state.activeMode,
    button,
    onSuccess: (item) => {
      markImageSharedToGallery(image, item);
      renderResults(state.currentImages, { append: false, skipConversation: true });
      syncSharedGalleryItems([item], { markRecent: true });
      scheduleLocalWorkspaceSave(0);
    },
  });
}

async function shareMessageResult(messageIndex, imageIndex, button) {
  const message = state.messages[messageIndex];
  const image = message?.images?.[imageIndex];
  if (!message || !image || image.galleryItemId) {
    return;
  }

  await shareImageToGallery({
    image,
    prompt: message.sourcePrompt || findPreviousUserPrompt(messageIndex) || "",
    mode: message.mode,
    button,
    onSuccess: (item) => {
      markImageSharedToGallery(image, item);
      updateConversationMessage(message.id, { images: message.images });
      renderResults(state.currentImages, { append: false, skipConversation: true });
      syncSharedGalleryItems([item], { markRecent: true });
    },
  });
}

function getStoredImageIdentity(image) {
  return String(
    image?.resultId ||
      image?.dataUrl ||
      image?.remoteUrl ||
      image?.storedUrl ||
      image?.displayUrl ||
      image?.displayObjectKey ||
      image?.objectKey ||
      image?.galleryItemId ||
      ""
  ).trim();
}

function isSameStoredImage(left, right) {
  const leftIdentity = getStoredImageIdentity(left);
  const rightIdentity = getStoredImageIdentity(right);
  return Boolean(leftIdentity && rightIdentity && leftIdentity === rightIdentity);
}

function markImageSharedToGallery(targetImage, galleryItem) {
  if (!targetImage || !galleryItem?.id) {
    return;
  }

  const applyShare = (image) => {
    image.galleryItemId = galleryItem.id;
    image.galleryUrl = galleryItem.imageUrl || "";
    image.displayObjectKey = galleryItem.displayObjectKey || galleryItem.objectKey || "";
    image.displayUrl = galleryItem.displayUrl || galleryItem.imageUrl || "";
    image.displayMimeType = galleryItem.displayMimeType || galleryItem.mimeType || "";
    image.displayWidth = galleryItem.displayWidth || 0;
    image.displayHeight = galleryItem.displayHeight || 0;
    image.displaySize = galleryItem.displaySize || 0;
    image.originalWidth = galleryItem.originalWidth || image.originalWidth || 0;
    image.originalHeight = galleryItem.originalHeight || image.originalHeight || 0;
    image.originalMimeType = galleryItem.originalMimeType || image.originalMimeType || "";
    image.originalSize = galleryItem.originalSize || image.originalSize || 0;
    image.thumbnailObjectKey = galleryItem.thumbnailObjectKey || "";
    image.thumbnailUrl = galleryItem.thumbnailUrl || "";
  };

  state.currentImages.forEach((image) => {
    if (isSameStoredImage(image, targetImage)) {
      applyShare(image);
    }
  });

  state.messages.forEach((message) => {
    normalizeStoredImages(message.images).forEach((_image, index) => {
      const sourceImage = message.images?.[index];
      if (sourceImage && isSameStoredImage(sourceImage, targetImage)) {
        applyShare(sourceImage);
      }
    });
  });
}

function deleteSessionImage(image, options = {}) {
  if (state.requestInFlight) {
    return;
  }

  const targetImage = normalizeStoredImages([image])[0];
  if (!targetImage) {
    return;
  }

  if (options.confirm !== false) {
    const confirmed = window.confirm("确认删除这张图片吗？这只会删除当前浏览器里的本地记录。");
    if (!confirmed) {
      return;
    }
  }

  let changed = false;
  const nextCurrentImages = state.currentImages.filter((candidate) => !isSameStoredImage(candidate, targetImage));
  if (nextCurrentImages.length !== state.currentImages.length) {
    changed = true;
    state.currentImages = nextCurrentImages;
  }

  state.messages = state.messages.map((message) => {
    const images = normalizeStoredImages(message.images);
    const nextImages = images.filter((candidate) => !isSameStoredImage(candidate, targetImage));
    if (nextImages.length === images.length) {
      return message;
    }

    changed = true;
    return {
      ...message,
      images: nextImages,
    };
  });

  if (!changed) {
    return;
  }

  renderCurrentResultViews();
  renderConversation();
  clearError();
  setRequestStatus("已删除图片");
  scheduleLocalWorkspaceSave(0);
}

function deleteMessageResult(messageIndex, imageIndex) {
  const image = state.messages[messageIndex]?.images?.[imageIndex];
  deleteSessionImage(image);
}

async function shareImageToGallery({ image, prompt, mode, button, onSuccess }) {
  if (!state.galleryEnabled) {
    showError("画廊存储未配置，无法分享。");
    return;
  }

  clearError();
  const previousText = button?.textContent;
  if (button) {
    button.disabled = true;
    button.textContent = "分享中";
  }

  try {
    const response = await fetchApi("/api/gallery/share", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image,
        prompt,
        mode,
        metadata: {
          model: elements.model.value.trim() || state.defaultModel,
          title: state.currentSessionTitle || "",
        },
      }),
    });
    const data = await parseResponse(response);
    onSuccess?.(data.item);
    setRequestStatus("已分享到画廊");
  } catch (error) {
    showError(formatRequestError(error));
    if (button) {
      button.disabled = false;
      button.textContent = previousText || "分享";
    }
  }
}

function findPromptForImage(image) {
  const message = [...state.messages].reverse().find((item) => item.images?.some((candidate) => candidate.dataUrl === image.dataUrl));
  if (!message) {
    return "";
  }
  return message.sourcePrompt || "";
}

function findPreviousUserPrompt(messageIndex) {
  for (let index = messageIndex - 1; index >= 0; index -= 1) {
    const message = state.messages[index];
    if (message?.role === "user" && message.prompt) {
      return message.prompt;
    }
  }
  return "";
}

function addConversationMessage(message) {
  const normalized = normalizeStoredMessages([{
    id: `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: Date.now(),
    status: "done",
    ...message,
  }])[0];

  state.messages.push(normalized);
  renderConversation();
  scheduleLocalWorkspaceSave(0);
  return normalized;
}

function updateConversationMessage(id, patch) {
  const index = state.messages.findIndex((message) => message.id === id);
  if (index === -1) {
    return;
  }

  state.messages[index] = normalizeStoredMessages([{
    ...state.messages[index],
    ...patch,
  }])[0];
  renderConversation();
  scheduleLocalWorkspaceSave(0);
}

function markPendingMessagesFailed(message) {
  let changed = false;
  state.messages = state.messages.map((item) => {
    if (item.status !== "pending") {
      return item;
    }
    changed = true;
    return {
      ...item,
      status: "done",
      prompt: message || "请求失败",
    };
  });

  if (changed) {
    renderConversation();
    scheduleLocalWorkspaceSave(0);
  }
}

function renderConversation() {
  if (!state.messages.length) {
    elements.messagesList.innerHTML = `
      <div class="conversation-empty">
        <p>生成结果和对话记录会显示在这里。</p>
        <small>先写 Prompt，再用右侧灵感或下方参数把方向收紧。</small>
      </div>
    `;
    renderHistory();
    return;
  }

  elements.messagesList.innerHTML = state.messages
    .map((message, messageIndex) => renderConversationMessage(message, messageIndex))
    .join("");
  bindConversationActions();
  scrollMessagesToBottom();
  renderHistory();
}

function renderConversationMessage(message, messageIndex) {
  const roleLabel = message.role === "user" ? "你" : "AI";
  const modeLabel = message.mode === "edit" ? "编辑" : "生成";
  const pending = message.status === "pending" ? `<span class="typing-dot">处理中</span>` : "";
  const attachments = message.attachments?.length
    ? `<div class="message-attachments">${message.attachments.map((image, index) => `
        <button class="attachment-thumb js-preview-message-attachment" type="button" data-message-index="${messageIndex}" data-message-image-index="${index}">
          <img src="${image.dataUrl}" alt="参考图 ${index + 1}" />
        </button>
      `).join("")}</div>`
    : "";
  const maskText = message.maskCount ? `<p class="message-note">已附加蒙版 ${message.maskCount} 张</p>` : "";
  const images = message.images?.length
    ? renderMessageResultGroup(message, messageIndex)
    : "";

  return `
    <article class="chat-message chat-message-${message.role}">
      <div class="message-avatar">${roleLabel}</div>
      <div class="message-bubble">
        <div class="message-meta">
          <span>${roleLabel}</span>
          <small>${modeLabel}</small>
          ${pending}
        </div>
        ${message.prompt ? `<p class="message-prompt">${escapeHtml(message.prompt)}</p>` : ""}
        ${attachments}
        ${maskText}
        ${images}
      </div>
    </article>
  `;
}

function renderMessageResultGroup(message, messageIndex) {
  const images = normalizeStoredImages(message.images);
  const count = images.length;
  const visibleImages = images.slice(0, Math.min(4, count));
  const hiddenCount = Math.max(0, count - visibleImages.length);
  const status = `${message.mode === "edit" ? "编辑完成" : "生成完成"} · ${count} 张图片`;

  return `
    <div class="message-result-group">
      <div class="message-result-header">
        <span>${escapeHtml(status)}</span>
      </div>
      <div class="message-images" data-count="${Math.min(count, 4)}">
        ${visibleImages.map((image, index) => renderMessageResultTile(image, messageIndex, index, index === visibleImages.length - 1 ? hiddenCount : 0)).join("")}
      </div>
    </div>
  `;
}

function renderMessageResultTile(image, messageIndex, imageIndex, hiddenCount = 0) {
  const revisedPrompt = renderRevisedPromptDetails(image.revisedPrompt);
  const remoteUrl = image.remoteUrl
    ? `<p class="meta-text"><a href="${escapeHtml(image.remoteUrl)}" target="_blank" rel="noreferrer">查看远端地址</a></p>`
    : "";
  const shareStatus = image.galleryItemId ? `<p class="meta-text">已分享到画廊</p>` : "";

  return `
    <article class="result-tile message-result-card">
      <button class="result-preview-button js-preview-message-result" type="button" data-message-index="${messageIndex}" data-message-image-index="${imageIndex}" aria-label="预览对话图片 ${imageIndex + 1}">
        <img class="result-image" src="${image.dataUrl}" alt="对话图片 ${imageIndex + 1}" />
        ${hiddenCount > 0 ? `<span class="message-more-overlay">+${hiddenCount}</span>` : ""}
      </button>
      <div class="result-meta">
        ${revisedPrompt}
        ${remoteUrl}
        ${shareStatus}
        <div class="result-actions">
          <button class="secondary-button js-preview-message-result" type="button" data-message-index="${messageIndex}" data-message-image-index="${imageIndex}">预览</button>
          <button class="download-button js-download-message-result" type="button" data-message-index="${messageIndex}" data-message-image-index="${imageIndex}">下载</button>
          <button class="secondary-button js-share-message-result" type="button" data-message-index="${messageIndex}" data-message-image-index="${imageIndex}" ${image.galleryItemId ? "disabled" : ""}>分享</button>
          <button class="secondary-button js-regenerate-message-result" type="button" data-message-index="${messageIndex}" data-message-image-index="${imageIndex}">重新生成</button>
          <button class="secondary-button result-danger-action js-delete-message-result" type="button" data-message-index="${messageIndex}" data-message-image-index="${imageIndex}">删除</button>
        </div>
      </div>
    </article>
  `;
}

function renderHistory() {
  const currentSummary = buildSessionSummary({
    sessionId: state.activeSessionId,
    title: state.currentSessionTitle,
    createdAt: state.sessions.find((session) => session.id === state.activeSessionId)?.createdAt || Date.now(),
    updatedAt: state.sessions.find((session) => session.id === state.activeSessionId)?.updatedAt || Date.now(),
    activeMode: state.activeMode,
    resultMode: state.currentResultMode,
    forms: {
      generate: getFormValues(elements.generateForm),
      edit: getFormValues(elements.editForm),
    },
    results: state.currentImages,
    messages: state.messages,
  });
  const rows = normalizeSessionSummaries([
    currentSummary,
    ...state.sessions.filter((session) => session.id !== state.activeSessionId),
  ]);
  const visibleRows = rows;

  if (!rows.length) {
    elements.historyList.innerHTML = `
      <div class="history-empty">
        <span>暂无创作记录</span>
        <small>开始生成后会自动保存在本地</small>
      </div>
    `;
    return;
  }

  elements.historyList.innerHTML = visibleRows
    .map((item) => `
      <div class="history-item${item.id === state.activeSessionId ? " is-active" : ""}" data-session-id="${escapeHtml(item.id)}">
        <button class="history-select-button" type="button" data-session-id="${escapeHtml(item.id)}" ${item.id === state.activeSessionId ? 'aria-current="true"' : ""}>
          <span class="history-thumb${item.thumbnail ? "" : " history-thumb-placeholder"}">
            ${item.thumbnail ? `<img src="${escapeHtml(item.thumbnail)}" alt="" loading="lazy" />` : ""}
          </span>
          <span class="history-copy">
            <span class="history-title">${escapeHtml(item.title)}</span>
            <span class="history-detail">${escapeHtml(item.detail)}</span>
            <span class="history-status">状态：${escapeHtml(item.status)}</span>
          </span>
        </button>
        <button class="history-delete-button" type="button" data-delete-session-id="${escapeHtml(item.id)}" aria-label="删除${escapeHtml(item.title)}">×</button>
      </div>
    `)
    .join("");

  elements.historyList.querySelectorAll(".history-select-button[data-session-id]").forEach((button) => {
    button.addEventListener("click", () => {
      void handleHistorySelect(button.dataset.sessionId);
    });
  });

  elements.historyList.querySelectorAll("[data-delete-session-id]").forEach((button) => {
    button.addEventListener("click", () => {
      void handleHistoryDelete(button.dataset.deleteSessionId);
    });
  });
  updateHistorySidebarPresentation();
}

function setHistoryExpanded(expanded) {
  state.historyExpanded = Boolean(expanded);
  renderHistory();
}

function updateHistorySidebarPresentation() {
  elements.appShell?.classList.toggle("is-history-expanded", state.historyExpanded);
  elements.appShell?.classList.toggle("is-history-collapsed", !state.historyExpanded);
  if (elements.historyToggleButton) {
    elements.historyToggleButton.setAttribute("aria-expanded", state.historyExpanded ? "true" : "false");
    elements.historyToggleButton.setAttribute("aria-label", state.historyExpanded ? "收起创作记录" : "展开创作记录");
  }
}

function setActiveHistoryItem(sessionId) {
  elements.historyList.querySelectorAll(".history-item").forEach((item) => {
    const isActive = item.dataset.sessionId === sessionId;
    const selectButton = item.querySelector(".history-select-button");
    item.classList.toggle("is-active", isActive);
    if (isActive) {
      selectButton?.setAttribute("aria-current", "true");
    } else {
      selectButton?.removeAttribute("aria-current");
    }
  });
}

function scrollMessagesToBottom() {
  window.requestAnimationFrame(() => {
    elements.messagesScroll.scrollTop = elements.messagesScroll.scrollHeight;
  });
}

function syncAllCountButtons() {
  syncCountButtons(elements.generateForm);
  syncCountButtons(elements.editForm);
}

function syncCountButtons(form) {
  if (!form) {
    return;
  }

  const input = form.querySelector('input[name="n"]');
  const mode = form === elements.editForm ? "edit" : "generate";
  const normalizedValue = String(Math.min(4, Math.max(1, Number(input.value) || 1)));
  input.value = normalizedValue;

  elements.countOptions
    .filter((button) => button.dataset.countTarget === mode)
    .forEach((button) => {
      button.classList.toggle("is-active", button.dataset.count === normalizedValue);
    });
}

function autoResizeAllTextareas() {
  autoResizeTextarea(elements.generatePrompt);
  autoResizeTextarea(elements.editPrompt);
  updatePromptCounters();
}

function autoResizeTextarea(textarea) {
  if (!textarea) {
    return;
  }

  const isCompactWorkspace = elements.chatMain?.classList.contains("has-results") || elements.chatMain?.classList.contains("is-loading");
  const maxHeight = isCompactWorkspace ? 96 : 220;
  textarea.style.height = "auto";
  textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
}

function updatePromptCounters() {
  if (elements.generatePromptCount) {
    elements.generatePromptCount.textContent = String(elements.generatePrompt.value.length);
  }
  if (elements.editPromptCount) {
    elements.editPromptCount.textContent = String(elements.editPrompt.value.length);
  }
}

async function filesToStoredImages(files) {
  const normalizedFiles = Array.from(files || []);
  return Promise.all(normalizedFiles.map(async (file) => ({
    dataUrl: await fileToDataUrl(file),
    revisedPrompt: "",
    remoteUrl: "",
    fileExtension: normalizeFileExtension(file.name.split(".").pop() || "png"),
  })));
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("读取图片失败"));
    reader.readAsDataURL(file);
  });
}

function renderFilePreview(fileList, container, label, bucketKey) {
  revokePreviewUrls(bucketKey);

  const files = Array.from(fileList || []);
  const fieldName = getUploadFieldNameFromBucketKey(bucketKey);
  if (!files.length) {
    container.innerHTML = "";
    return;
  }

  const previews = files.map((file, index) => {
    const objectUrl = URL.createObjectURL(file);
    state.uploadPreviewUrls[bucketKey].push(objectUrl);

    return `
      <div class="preview-item">
        <button
          class="upload-preview-button js-preview-upload"
          type="button"
          data-preview-src="${objectUrl}"
          data-preview-caption="${escapeHtml(`${label} ${index + 1} · ${file.name}`)}"
          data-preview-file-name="${escapeHtml(file.name)}"
        >
          <img src="${objectUrl}" alt="${escapeHtml(file.name)}" />
        </button>
        ${fieldName ? `
          <button
            class="upload-remove-button js-remove-upload"
            type="button"
            data-upload-field="${fieldName}"
            data-upload-index="${index}"
            aria-label="移除${escapeHtml(label)}"
            title="移除"
          >×</button>
        ` : ""}
        <span>${escapeHtml(label)} · ${escapeHtml(file.name)}</span>
      </div>
    `;
  });

  container.innerHTML = previews.join("");
  Array.from(container.querySelectorAll(".js-preview-upload")).forEach((button) => {
    button.addEventListener("click", () => {
      openPreviewModal({
        src: button.dataset.previewSrc,
        caption: button.dataset.previewCaption,
        fileName: button.dataset.previewFileName || `${label}.png`,
      });
    });
  });
  Array.from(container.querySelectorAll(".js-remove-upload")).forEach((button) => {
    button.addEventListener("click", () => {
      removeUploadFile(button.dataset.uploadField, Number(button.dataset.uploadIndex));
    });
  });
}

function revokePreviewUrls(bucketKey) {
  for (const objectUrl of state.uploadPreviewUrls[bucketKey]) {
    URL.revokeObjectURL(objectUrl);
  }
  state.uploadPreviewUrls[bucketKey] = [];
}

function getUploadFieldNameFromBucketKey(bucketKey) {
  if (bucketKey === "imagePreviewStrip") {
    return "images";
  }
  if (bucketKey === "maskPreviewStrip") {
    return "mask";
  }
  return "";
}

function getUploadPreviewConfig(fieldName) {
  if (fieldName === "images") {
    return {
      input: elements.editImages,
      container: elements.imagePreviewStrip,
      label: "参考图",
      bucketKey: "imagePreviewStrip",
    };
  }
  if (fieldName === "mask") {
    return {
      input: elements.editMask,
      container: elements.maskPreviewStrip,
      label: "蒙版",
      bucketKey: "maskPreviewStrip",
    };
  }
  return null;
}

function removeUploadFile(fieldName, index) {
  const config = getUploadPreviewConfig(fieldName);
  if (!config || !Number.isInteger(index) || index < 0) {
    return;
  }

  const files = getUploadFiles(fieldName);
  if (index >= files.length) {
    return;
  }

  const nextFiles = files.filter((_file, fileIndex) => fileIndex !== index);
  state.uploadSourceFiles[fieldName] = nextFiles;
  state.uploadRestoreFallback[fieldName] = nextFiles.length
    ? !restoreFilesToInput(config.input, nextFiles)
    : false;
  if (!nextFiles.length) {
    config.input.value = "";
  }

  renderFilePreview(getUploadFiles(fieldName), config.container, config.label, config.bucketKey);
  scheduleLocalWorkspaceSave();
}

function buildImagePreviewItems(images, options = {}) {
  const normalizedImages = (Array.isArray(images) ? images : [])
    .map((image) => {
      const normalized = normalizeStoredImages([image])[0];
      return normalized ? { normalized, source: image } : null;
    })
    .filter(Boolean);

  return normalizedImages.map(({ normalized, source }, index) => ({
    src: normalized.dataUrl,
    caption: `${options.captionPrefix || "图片"} ${index + 1}`,
    fileName: buildDownloadName(index, normalized),
    prompt: options.promptGetter ? options.promptGetter(source, index) : (options.prompt || ""),
    image: source,
    mode: options.mode || state.currentResultMode || state.activeMode,
  }));
}

function normalizePreviewItems(preview) {
  const rawItems = Array.isArray(preview?.items) && preview.items.length ? preview.items : [preview];
  return rawItems
    .map((item, index) => {
      const src = String(item?.src || item?.image?.dataUrl || "").trim();
      if (!src) {
        return null;
      }

      return {
        src,
        caption: String(item.caption || `图片 ${index + 1}`).trim(),
        fileName: String(item.fileName || `image-tool-${Date.now()}-${index + 1}.png`).trim(),
        prompt: String(item.prompt || "").trim(),
        image: item.image || null,
        mode: item.mode === "edit" ? "edit" : "generate",
        allowDownload: item.allowDownload !== false,
      };
    })
    .filter(Boolean);
}

async function openAdminUsageModal() {
  if (!state.isAdmin) {
    return;
  }
  elements.adminUsageModal?.classList.remove("is-hidden");
  elements.adminUsageModal?.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  await loadAdminUsage();
}

function closeAdminUsageModal() {
  if (!elements.adminUsageModal || elements.adminUsageModal.classList.contains("is-hidden")) {
    return;
  }
  elements.adminUsageModal.classList.add("is-hidden");
  elements.adminUsageModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

async function loadAdminUsage() {
  if (!state.isAdmin || state.adminUsageLoading) {
    return;
  }
  state.adminUsageLoading = true;
  renderAdminUsageLoading();
  try {
  const response = await fetchApi("/api/admin/usage", { cache: "no-store" });
    state.adminUsage = await parseResponse(response);
    renderAdminUsage(state.adminUsage);
  } catch (error) {
    if (elements.adminUsageContent) {
      elements.adminUsageContent.innerHTML = `<div class="empty-state compact-empty">${escapeHtml(formatRequestError(error))}</div>`;
    }
  } finally {
    state.adminUsageLoading = false;
  }
}

function renderAdminUsageLoading() {
  if (!elements.adminUsageContent) {
    return;
  }
  elements.adminUsageContent.innerHTML = `
    <div class="admin-usage-grid">
      ${Array.from({ length: 4 }, () => `<div class="gallery-card-skeleton admin-usage-skeleton"><span></span><i></i><b></b></div>`).join("")}
    </div>
  `;
}

function renderAdminUsage(overview = {}) {
  if (!elements.adminUsageContent) {
    return;
  }
  const today = overview.usage?.today || {};
  const sevenDays = overview.usage?.sevenDays || {};
  const queue = overview.queue || {};
  const jobs = queue.jobs || {};
  const gallery = overview.gallery || {};
  const keyRows = Array.isArray(overview.usage?.byKey) ? overview.usage.byKey : [];
  const recentEvents = Array.isArray(overview.usage?.recentEvents) ? overview.usage.recentEvents : [];
  const unkey = overview.keys || {};

  elements.adminUsageContent.innerHTML = `
    <div class="admin-usage-grid">
      ${renderAdminMetricCard("今日生成", today.completedImages, `${today.totalEvents || 0} 次任务`)}
      ${renderAdminMetricCard("近 7 天", sevenDays.completedImages, `${sevenDays.billedCredits || 0} 点计费`)}
      ${renderAdminMetricCard("队列", queue.pending || 0, `${queue.running || 0} 个运行中`)}
      ${renderAdminMetricCard("公开画廊", gallery.publicCompleted || 0, `${gallery.total || 0} 条总记录`)}
    </div>
    <section class="admin-usage-section">
      <h3>Key 用量</h3>
      <div class="admin-usage-table">
        ${keyRows.length ? keyRows.map(renderAdminKeyUsageRow).join("") : `<p class="meta-text">暂无用量记录</p>`}
      </div>
    </section>
    <section class="admin-usage-section">
      <h3>任务状态</h3>
      <div class="admin-usage-inline">
        <span>排队 ${queue.pending || 0}</span>
        <span>运行 ${queue.running || 0}</span>
        <span>成功 ${jobs.succeeded || 0}</span>
        <span>部分成功 ${jobs.partial || 0}</span>
        <span>失败 ${jobs.failed || 0}</span>
      </div>
    </section>
    <section class="admin-usage-section">
      <h3>Unkey Keys</h3>
      ${unkey.available
        ? `<div class="admin-usage-table">${(unkey.items || []).map(renderAdminUnkeyRow).join("") || `<p class="meta-text">暂无 Key</p>`}</div>`
        : `<p class="meta-text">Key 列表暂不可用：${escapeHtml(unkey.error || "读取失败")}</p>`}
    </section>
    <section class="admin-usage-section">
      <h3>最近任务</h3>
      <div class="admin-usage-table">
        ${recentEvents.length ? recentEvents.map(renderAdminUsageEventRow).join("") : `<p class="meta-text">暂无任务</p>`}
      </div>
    </section>
  `;
}

function renderAdminMetricCard(label, value, detail) {
  return `
    <article class="admin-metric-card">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(formatAdminNumber(value))}</strong>
      <small>${escapeHtml(detail || "")}</small>
    </article>
  `;
}

function renderAdminKeyUsageRow(item) {
  return `
    <div class="admin-usage-row">
      <span>${escapeHtml(item.isAdmin ? "管理员" : "普通 Key")}</span>
      <strong>${escapeHtml(item.keyHash || "unknown")}</strong>
      <small>${escapeHtml(`${item.completedImages || 0} 张 · ${item.billedCredits || 0} 点 · ${formatHistoryTime(item.lastSeenAt)}`)}</small>
    </div>
  `;
}

function renderAdminUnkeyRow(item) {
  const credits = item.creditsRemaining === null || item.creditsRemaining === undefined ? "不限" : `${item.creditsRemaining}`;
  return `
    <div class="admin-usage-row">
      <span>${escapeHtml(item.isAdmin ? "管理员" : (item.enabled ? "启用" : "停用"))}</span>
      <strong>${escapeHtml(item.name || item.keyId || "未命名 Key")}</strong>
      <small>${escapeHtml(`剩余额度 ${credits}`)}</small>
    </div>
  `;
}

function renderAdminUsageEventRow(item) {
  const statusLabel = {
    started: "进行中",
    queued: "排队",
    running: "运行",
    succeeded: "成功",
    partial: "部分成功",
    failed: "失败",
  }[item.status] || item.status || "未知";
  return `
    <div class="admin-usage-row">
      <span>${escapeHtml(statusLabel)}</span>
      <strong>${escapeHtml(item.mode === "edit" ? "编辑" : "生成")} · ${escapeHtml(item.keyHash || "unknown")}</strong>
      <small>${escapeHtml(`${item.completedCount || 0}/${item.requestedCount || 0} 张 · ${item.billedCredits || 0} 点 · ${formatHistoryTime(item.startedAt)}`)}</small>
    </div>
  `;
}

function formatAdminNumber(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed.toLocaleString() : "0";
}

function renderAccountControls() {
  elements.accountButton?.classList.toggle("is-hidden", !(state.authenticated && state.loginType === "linuxdo"));
}

function renderAuthFormMode() {
  const isHybrid = state.authMode === "hybrid";
  const isUnkey = state.authMode === "unkey" || isHybrid;
  elements.authLinuxdoSection?.classList.toggle("is-hidden", !isHybrid);
  if (elements.authTitle) {
    elements.authTitle.textContent = isHybrid ? "登录账户" : (isUnkey ? "请输入访问 Key" : "请输入访问密码");
  }
  if (elements.authFieldLabel) {
    elements.authFieldLabel.textContent = isUnkey ? "访问 Key" : "密码";
  }
  if (elements.authPassword) {
    elements.authPassword.placeholder = isUnkey ? "请输入访问 Key" : "请输入密码";
  }
}

function renderAccessBadge(config = {}) {
  if (!elements.serverKeyBadge) {
    return;
  }

  if (state.authEnabled && !state.authenticated) {
    elements.serverKeyBadge.textContent = state.authMode === "hybrid" ? "未登录 · Linux.do / Key" : (state.authMode === "unkey" ? "未登录 · 输入 Key 后生成" : "未登录");
    elements.serverKeyBadge.classList.toggle("badge-success", false);
    elements.serverKeyBadge.classList.toggle("badge-muted", true);
    return;
  }

  if (state.authMode === "hybrid" && state.loginType === "linuxdo") {
    const credits = state.creditsRemaining;
    elements.serverKeyBadge.textContent = credits === null || credits === undefined ? "账户额度不限" : `账户额度 ${credits}`;
    elements.serverKeyBadge.classList.toggle("badge-success", true);
    elements.serverKeyBadge.classList.toggle("badge-muted", false);
    return;
  }

  if (state.authMode === "unkey" || (state.authMode === "hybrid" && state.loginType === "unkey")) {
    const credits = state.creditsRemaining;
    if (state.isAdmin) {
      elements.serverKeyBadge.textContent = "管理员 · 免费生成";
      elements.serverKeyBadge.classList.toggle("badge-success", true);
      elements.serverKeyBadge.classList.toggle("badge-muted", false);
      return;
    }
    elements.serverKeyBadge.textContent = credits === null || credits === undefined ? "额度无限" : `剩余额度 ${credits}`;
    elements.serverKeyBadge.classList.toggle("badge-success", true);
    elements.serverKeyBadge.classList.toggle("badge-muted", false);
    return;
  }

  if (Object.prototype.hasOwnProperty.call(config, "hasServerKey")) {
    elements.serverKeyBadge.textContent = config.hasServerKey ? "已检测到服务端密钥" : "未检测到服务端密钥";
    elements.serverKeyBadge.classList.toggle("badge-success", Boolean(config.hasServerKey));
    elements.serverKeyBadge.classList.toggle("badge-muted", !config.hasServerKey);
  }
}

function getAuthPromptMessage() {
  if (!state.authEnabled) {
    return "";
  }
  if (state.authMode === "hybrid") {
    return "请使用 Linux.do 登录，或输入访问 Key 后继续";
  }
  return state.authMode === "unkey" ? "输入访问 Key 后即可开始生成" : "请输入密码后继续";
}

function getExpiredAuthMessage() {
  if (state.authMode === "hybrid") {
    return "登录状态已失效，请重新登录";
  }
  return state.authMode === "unkey" ? "访问 Key 已失效，请重新输入" : "登录已过期，请重新输入密码";
}

function setAuthUiDisabled(disabled) {
  elements.authPassword.disabled = disabled;
  elements.authSubmitButton.disabled = disabled;
  elements.authLinuxdoButton.disabled = disabled;
  elements.logoutButton.disabled = disabled;
}

function renderProfileButton() {
  if (!elements.logoutButton) {
    return;
  }
  const label = state.authenticated ? "退出登录" : "登录";
  elements.logoutButton.textContent = label;
  elements.logoutButton.setAttribute("aria-label", label);
  elements.logoutButton.title = label;
  elements.logoutButton.classList.toggle("is-authenticated", Boolean(state.authenticated));
}

function handleProfileButtonClick() {
  if (!state.authenticated) {
    if (state.authEnabled) {
      showAuthScreen(getAuthPromptMessage());
    }
    return;
  }
  void handleLogout();
}

function handleLinuxdoLogin() {
  clearAuthError();
  window.location.href = "/api/auth/linuxdo/start";
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  clearAuthError();

  const accessKey = elements.authPassword.value.trim();
  if (!accessKey) {
    showAuthError(state.authMode === "password" ? "请输入密码" : "请输入访问 Key");
    elements.authPassword.focus();
    return;
  }

  setAuthUiDisabled(true);

  try {
    const response = await fetchApi("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: accessKey,
        accessKey,
      }),
    });
    const data = await parseResponse(response, { allowAuthError: true });
    if (!data.authenticated) {
      throw new Error("登录失败");
    }
    applyAuthStatus(data);

    elements.authPassword.value = "";
    await loadConfig();
    if (!state.templates.length) {
      await loadTemplateLibrary();
    }
    void loadGallery({ silent: true, force: true });
    showApp();
    renderAccessBadge();
    resumeActiveImageJob();
    resolvePendingAuthPrompt(true);
  } catch (error) {
    if (error.authRequired) {
      state.authenticated = false;
      showAuthScreen(getExpiredAuthMessage());
      return;
    }
    showAuthError(error.message || (state.authMode === "password" ? "密码错误" : "访问 Key 无效"));
    elements.authPassword.focus();
  } finally {
    setAuthUiDisabled(false);
  }
}

async function handleLogout() {
  try {
    await fetchApi("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (_error) {
    // Ignore logout failures and reset locally.
  }

  state.authenticated = false;
  state.loginType = "";
  state.account = null;
  state.accountOverview = null;
  state.isAdmin = false;
  state.permissions = [];
  state.adminUsage = null;
  renderAdminControls();
  renderAccountControls();
  renderAccessBadge();
  closeAccountModal();
  elements.authPassword.value = "";
  clearAuthError();
  hideAuthScreen();
  showApp();
  renderProfileButton();
  resolvePendingAuthPrompt(false);
}

async function openAccountModal() {
  if (state.loginType !== "linuxdo") {
    return;
  }
  elements.accountModal?.classList.remove("is-hidden");
  elements.accountModal?.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  await loadAccountOverview();
}

function closeAccountModal() {
  if (!elements.accountModal || elements.accountModal.classList.contains("is-hidden")) {
    return;
  }
  elements.accountModal.classList.add("is-hidden");
  elements.accountModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

async function loadAccountOverview() {
  if (state.accountLoading || state.loginType !== "linuxdo") {
    return;
  }
  state.accountLoading = true;
  renderAccountLoading();
  try {
    const response = await fetchApi("/api/account", { cache: "no-store" });
    const overview = await parseResponse(response);
    state.accountOverview = overview;
    state.account = overview.account || state.account;
    syncCreditsFromPayload(overview);
    renderAccountOverview(overview);
  } catch (error) {
    if (elements.accountContent) {
      elements.accountContent.innerHTML = `<div class="empty-state compact-empty">${escapeHtml(formatRequestError(error))}</div>`;
    }
  } finally {
    state.accountLoading = false;
  }
}

function renderAccountLoading() {
  if (!elements.accountContent) {
    return;
  }
  elements.accountContent.innerHTML = `
    <div class="admin-usage-grid">
      ${Array.from({ length: 2 }, () => `<div class="gallery-card-skeleton admin-usage-skeleton"><span></span><i></i><b></b></div>`).join("")}
    </div>
  `;
}

function renderAccountOverview(overview = {}) {
  if (!elements.accountContent) {
    return;
  }
  const account = overview.account || {};
  const keys = Array.isArray(overview.keys) ? overview.keys : [];
  const balance = overview.creditsRemaining ?? overview.credits ?? account.balance ?? 0;
  elements.accountContent.innerHTML = `
    <div class="admin-usage-grid">
      ${renderAdminMetricCard("当前额度", balance, "可生成图片数")}
      ${renderAdminMetricCard("已兑换 Key", keys.length, "含首登赠送")}
    </div>
    <section class="admin-usage-section">
      <div class="account-profile">
        ${account.avatarUrl ? `<img class="account-avatar" src="${escapeHtml(account.avatarUrl)}" alt="" />` : `<span class="account-avatar"></span>`}
        <div>
          <h3>${escapeHtml(account.displayName || account.username || "Linux.do 用户")}</h3>
          <p class="meta-text">${escapeHtml(account.username ? `@${account.username}` : account.providerUserId || "")}</p>
        </div>
      </div>
    </section>
    <section class="admin-usage-section">
      <h3>充值 Key</h3>
      <form class="account-redeem-form">
        <input name="accessKey" type="password" autocomplete="off" placeholder="输入有额度的访问 Key" />
        <button class="primary-button preview-nav-button" type="submit">充值</button>
      </form>
    </section>
    <section class="admin-usage-section">
      <h3>我的 Key</h3>
      <div class="admin-usage-table">
        ${keys.length ? keys.map(renderAccountKeyRow).join("") : `<p class="meta-text">暂无 Key</p>`}
      </div>
    </section>
  `;
}

function renderAccountKeyRow(item) {
  return `
    <div class="admin-usage-row" data-account-key-row="${escapeHtml(item.id)}">
      <span>${escapeHtml(formatAccountKeySource(item.source))}</span>
      <strong>${escapeHtml(item.maskedKey || item.keyId || "已兑换 Key")}</strong>
      <small>
        ${escapeHtml(`${item.creditsRedeemed || 0} 额度 · ${formatHistoryTime(item.redeemedAt || item.createdAt)}`)}
        ${item.canReveal ? `<button class="text-button" type="button" data-reveal-account-key="${escapeHtml(item.id)}">查看</button>` : ""}
      </small>
      <div class="account-key-secret is-hidden" data-account-key-secret="${escapeHtml(item.id)}"></div>
    </div>
  `;
}

function formatAccountKeySource(source) {
  return source === "starter" ? "首登赠送" : "充值";
}

async function handleAccountRedeem(event) {
  event.preventDefault();
  const form = event.target;
  const input = form.querySelector('input[name="accessKey"]');
  const accessKey = input?.value?.trim() || "";
  if (!accessKey) {
    showError("请输入要充值的访问 Key");
    input?.focus();
    return;
  }
  const button = form.querySelector("button[type='submit']");
  if (button) {
    button.disabled = true;
  }
  try {
    const response = await fetchApi("/api/account/redeem-key", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessKey }),
    });
    const overview = await parseResponse(response);
    state.accountOverview = overview;
    state.account = overview.account || state.account;
    syncCreditsFromPayload(overview);
    renderAccountOverview(overview);
    setRequestStatus(`已充值 ${overview.redeemedCredits || 0} 额度`);
  } catch (error) {
    showError(formatRequestError(error));
  } finally {
    if (button) {
      button.disabled = false;
    }
  }
}

async function revealAccountKey(id) {
  const keyId = String(id || "").trim();
  if (!keyId) {
    return;
  }
  try {
    const response = await fetchApi(`/api/account/keys/${encodeURIComponent(keyId)}/reveal`, { cache: "no-store" });
    const data = await parseResponse(response);
    const escapedKeyId = window.CSS?.escape ? CSS.escape(keyId) : keyId.replace(/"/g, '\\"');
    const target = elements.accountContent?.querySelector(`[data-account-key-secret="${escapedKeyId}"]`);
    if (target) {
      target.textContent = data.key || "";
      target.classList.remove("is-hidden");
    }
    if (data.key && navigator.clipboard) {
      await navigator.clipboard.writeText(data.key).catch(() => {});
    }
  } catch (error) {
    showError(formatRequestError(error));
  }
}

function getActivePreviewItem() {
  if (!state.activePreview?.items?.length) {
    return null;
  }

  return state.activePreview.items[state.activePreview.index] || null;
}

function updatePreviewModal() {
  const item = getActivePreviewItem();
  if (!item) {
    return;
  }

  const total = state.activePreview.items.length;
  const positionText = total > 1 ? ` · ${state.activePreview.index + 1}/${total}` : "";
  elements.previewImage.src = item.src;
  elements.previewCaption.textContent = `${item.caption || ""}${positionText}`;
  elements.previewPrev.disabled = total <= 1;
  elements.previewNext.disabled = total <= 1;
  elements.previewCopyPrompt.disabled = !item.prompt;
  elements.previewShare.disabled = !state.galleryEnabled || !item.image || Boolean(item.image.galleryItemId);
  elements.previewShare.textContent = item.image?.galleryItemId ? "已分享" : "分享";
  elements.previewDownload.classList.toggle("is-hidden", item.allowDownload === false);
}

function movePreview(direction) {
  if (!state.activePreview?.items?.length) {
    return;
  }

  const total = state.activePreview.items.length;
  state.activePreview.index = (state.activePreview.index + direction + total) % total;
  updatePreviewModal();
}

function openPreviewModal(preview) {
  const items = normalizePreviewItems(preview);
  if (!items.length) {
    return;
  }

  state.activePreview = {
    items,
    index: Math.min(items.length - 1, Math.max(0, Number(preview?.index) || 0)),
  };
  updatePreviewModal();
  elements.previewModal.classList.remove("is-hidden");
  elements.previewModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closePreviewModal() {
  state.activePreview = null;
  elements.previewImage.src = "";
  elements.previewCaption.textContent = "";
  elements.previewModal.classList.add("is-hidden");
  elements.previewModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function buildDownloadName(index, image) {
  const extension = normalizeFileExtension(image.fileExtension || extensionFromDataUrl(image.dataUrl) || "png");
  return `image-tool-${Date.now()}-${index + 1}.${extension}`;
}

function normalizeFileExtension(extension) {
  const normalized = String(extension || "").trim().toLowerCase();
  if (normalized === "jpg") {
    return "jpeg";
  }
  if (normalized === "jpeg" || normalized === "png" || normalized === "webp") {
    return normalized;
  }
  return "png";
}

function extensionFromDataUrl(dataUrl) {
  const match = String(dataUrl || "").match(/^data:(image\/[a-z0-9.+-]+);/i);
  if (!match) {
    return "png";
  }
  const mimeType = match[1].toLowerCase();
  if (mimeType.includes("jpeg") || mimeType.includes("jpg")) {
    return "jpeg";
  }
  if (mimeType.includes("webp")) {
    return "webp";
  }
  return "png";
}

function showError(message) {
  elements.errorBox.textContent = message;
  elements.errorBox.classList.remove("is-hidden");
}

function clearError() {
  elements.errorBox.textContent = "";
  elements.errorBox.classList.add("is-hidden");
}

async function parseResponse(response, options = {}) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || "请求失败");
    error.status = response.status;
    error.authRequired = response.status === 401 && !options.allowAuthError;
    error.details = data.details || null;
    throw error;
  }
  return data;
}

function formatRequestError(error) {
  const message = error?.message || "请求失败";
  const statusText = error?.status ? `HTTP ${error.status}` : "";
  const requestId = getErrorRequestId(error?.details);
  const suffix = [statusText, requestId ? `request_id: ${requestId}` : ""].filter(Boolean).join("，");

  return suffix ? `${message}（${suffix}）` : message;
}

function getErrorRequestId(details) {
  if (!details || typeof details !== "object") {
    return "";
  }

  return String(
    details.request_id ||
      details.requestId ||
      details.error?.request_id ||
      details.error?.requestId ||
      ""
  ).trim();
}

function downloadImage(dataUrl, fileName) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = fileName;
  link.click();
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
