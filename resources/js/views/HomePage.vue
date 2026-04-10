<script lang="ts" setup>
import ImageComponent from "@/components/ImageComponent.vue";
import InputComponent from "@/components/InputComponent.vue";
import LazyLoadComponent from "@/components/LazyLoadComponent.vue";
import Pagination from "@/components/Pagination.vue";
import SelectBoxComponent from "@/components/SelectBoxComponent.vue";
import TextareaComponent from "@/components/TextareaComponent.vue";
import { ROUTE } from "@/shared/constants/routing";
import { useIsMobile } from "@/composables/useIsMobile";
import type { Pagination as PaginationType } from "@/shared/types";
import { formatDate } from "@/utils/useDate";
import { useToastMessage } from "@/utils/useToast";
import { computed, shallowRef } from "vue";

interface CategoryOption {
    category_id: number;
    title: string;
}

interface CatalogItem {
    badge: string;
    description: string;
    name: string;
    path: string;
    usedOnHome?: boolean;
}

interface FlowStep {
    description: string;
    path: string;
    title: string;
}

interface FeaturePageLink {
    description: string;
    label: string;
    routeName: string;
    summary: string;
}

const defaultPreviewImage = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1f3c88" />
      <stop offset="100%" stop-color="#5b8def" />
    </linearGradient>
  </defs>
  <rect width="1200" height="900" rx="48" fill="url(#bg)" />
  <circle cx="930" cy="210" r="130" fill="rgba(255,255,255,0.14)" />
  <circle cx="280" cy="720" r="170" fill="rgba(255,209,102,0.22)" />
  <rect x="120" y="148" width="470" height="604" rx="40" fill="rgba(255,255,255,0.14)" />
  <rect x="190" y="224" width="328" height="42" rx="21" fill="rgba(255,255,255,0.78)" />
  <rect x="190" y="302" width="240" height="24" rx="12" fill="rgba(255,255,255,0.45)" />
  <rect x="190" y="350" width="292" height="24" rx="12" fill="rgba(255,255,255,0.45)" />
  <rect x="190" y="398" width="216" height="24" rx="12" fill="rgba(255,255,255,0.45)" />
  <rect x="190" y="492" width="196" height="180" rx="28" fill="rgba(255,255,255,0.18)" />
  <rect x="432" y="492" width="86" height="180" rx="28" fill="rgba(255,255,255,0.18)" />
  <text x="660" y="300" fill="white" font-size="72" font-family="Arial, sans-serif" font-weight="700">
    Base Template
  </text>
  <text x="660" y="372" fill="rgba(255,255,255,0.72)" font-size="30" font-family="Arial, sans-serif">
    Components, stores, services and utils
  </text>
  <rect x="660" y="456" width="260" height="64" rx="32" fill="rgba(255,255,255,0.14)" />
  <text x="710" y="497" fill="white" font-size="28" font-family="Arial, sans-serif">
    Vue 3 + TS
  </text>
</svg>
`)}`;

const category = shallowRef<number | null>(1);
const description = shallowRef(
    "Trang Home moi se dong vai tro nhu mot catalog, giup team nhin nhanh cac thanh phan co san trong template.",
);
const imageUrl = shallowRef(defaultPreviewImage);
const currentPage = shallowRef(1);

const { isMobile } = useIsMobile();

const options: CategoryOption[] = [
    {
        category_id: 1,
        title: "Form component",
    },
    {
        category_id: 2,
        title: "Store va service",
    },
    {
        category_id: 3,
        title: "Utility va composable",
    },
];

const componentCatalog: CatalogItem[] = [
    {
        name: "InputComponent",
        badge: "Form",
        description:
            "Input co san vee-validate, password toggle, maxlength va expose validate().",
        path: "resources/js/components/InputComponent.vue",
        usedOnHome: true,
    },
    {
        name: "TextareaComponent",
        badge: "Form",
        description:
            "Textarea co dem ky tu, xu ly IME/composition va validate blur.",
        path: "resources/js/components/TextareaComponent.vue",
        usedOnHome: true,
    },
    {
        name: "SelectBoxComponent",
        badge: "Form",
        description:
            "Select custom co keyboard support, dropdown auto dinh huong va placeholder.",
        path: "resources/js/components/SelectBoxComponent.vue",
        usedOnHome: true,
    },
    {
        name: "ImageComponent",
        badge: "Media",
        description:
            "Hien thi anh va fallback placeholder khi khong co src hoac load loi.",
        path: "resources/js/components/ImageComponent.vue",
        usedOnHome: true,
    },
    {
        name: "LazyLoadComponent",
        badge: "Performance",
        description:
            "Lazy render slot bang IntersectionObserver, co placeholder va emit khi item vao viewport.",
        path: "resources/js/components/LazyLoadComponent.vue",
        usedOnHome: true,
    },
    {
        name: "Pagination",
        badge: "Navigation",
        description:
            "Pagination co emit update:page va hien thi current page / total pages.",
        path: "resources/js/components/Pagination.vue",
        usedOnHome: true,
    },
    {
        name: "ErrorMessage",
        badge: "Validation",
        description: "Component hien thi loi cua vee-validate cho field dang dung.",
        path: "resources/js/components/ErrorMessage.vue",
    },
    {
        name: "SuccessToast",
        badge: "Feedback",
        description: "Toast message co style rieng, duoc goi qua utility useToast.",
        path: "resources/js/components/toasts/SuccessToast.vue",
    },
];

const moduleCatalog: CatalogItem[] = [
    {
        name: "useAuthStore",
        badge: "Store",
        description:
            "Pinia store dang xu ly login mutation, luu token va user vao localStorage.",
        path: "resources/js/stores/auth.ts",
    },
    {
        name: "useCategoryStore",
        badge: "Store",
        description:
            "Pinia store danh cho danh muc, goi service va luu categories vao state.",
        path: "resources/js/stores/category.ts",
    },
    {
        name: "useErrorStore",
        badge: "Store",
        description: "Noi tap trung luu error response de cac man hinh co the tai su dung.",
        path: "resources/js/stores/error.ts",
    },
    {
        name: "Auth Service",
        badge: "Service",
        description: "Wrapper goi API POST /v1/login cho luong dang nhap.",
        path: "resources/js/services/app/Auth.ts",
    },
    {
        name: "Category Service",
        badge: "Service",
        description: "Wrapper goi API GET /v1/categories de lay danh sach danh muc.",
        path: "resources/js/services/app/Category.ts",
    },
    {
        name: "API Client",
        badge: "Service",
        description:
            "Axios client co interceptor set language, convert camel/snake case va push error vao store.",
        path: "resources/js/services/app/API.ts",
    },
];

const utilityCatalog: CatalogItem[] = [
    {
        name: "useFormHandler",
        badge: "Utility",
        description:
            "Scroll toi field dau tien dang loi sau khi submit form that bai.",
        path: "resources/js/utils/useFormHandler.ts",
    },
    {
        name: "useToast",
        badge: "Utility",
        description: "Trigger success toast thong qua vue3-toastify.",
        path: "resources/js/utils/useToast.ts",
    },
    {
        name: "useDate",
        badge: "Utility",
        description: "Format ngay gio bang date-fns voi pattern tuy chon.",
        path: "resources/js/utils/useDate.ts",
    },
    {
        name: "usePaging",
        badge: "Utility",
        description:
            "Lay thong tin page/per_page tu query route va tao paging params.",
        path: "resources/js/utils/usePaging.ts",
    },
    {
        name: "useConverter",
        badge: "Utility",
        description:
            "Convert key giua camelCase, snake_case va kebab-case cho payload/request.",
        path: "resources/js/utils/useConverter.ts",
    },
    {
        name: "commonFunction",
        badge: "Utility",
        description:
            "Language helper, limit text va cac ham check object rong duoc dung chung.",
        path: "resources/js/utils/commonFunction.ts",
    },
    {
        name: "useIsMobile",
        badge: "Composable",
        description:
            "Composable theo doi breakpoint mobile qua window.matchMedia va resize listener.",
        path: "resources/js/composables/useIsMobile.ts",
    },
];

const flowSteps: FlowStep[] = [
    {
        title: "Bootstrap app",
        description: "Khoi tao Vue app, Pinia, Vue Query, Router, i18n va Toastify.",
        path: "resources/js/app.ts",
    },
    {
        title: "Router va middleware",
        description:
            "Khai bao route Home/Login, xu ly redirect va auth middleware cho Home.",
        path: "resources/js/router.ts",
    },
    {
        title: "Store + service",
        description:
            "Store dung Vue Query mutation/goi service, service goi axios client chung.",
        path: "resources/js/stores/auth.ts -> resources/js/services/app/Auth.ts",
    },
    {
        title: "Shared helpers",
        description:
            "Utility xu ly form, toast, date, converter va responsive de tai su dung.",
        path: "resources/js/utils/* + resources/js/composables/useIsMobile.ts",
    },
];

const featurePages: FeaturePageLink[] = [
    {
        label: "Interview question list",
        summary: "Page danh sach cau hoi phong van theo tung role.",
        description:
            "Chon FE, BE, DevOps, QA va click tung cau hoi de mo dap an mau.",
        routeName: ROUTE.NAME.INTERVIEW_QUESTIONS,
    },
    {
        label: "Interview quiz",
        summary: "Page trắc nghiệm dung chung question bank.",
        description:
            "Lam quiz theo role, tinh diem va xem giai thich sau khi nop bai.",
        routeName: ROUTE.NAME.INTERVIEW_QUIZ,
    },
];

const selectedCategoryTitle = computed(() => {
    return (
        options.find((option) => option.category_id === category.value)?.title ??
        "Chua chon nhom"
    );
});

const descriptionPreview = computed(() => {
    const normalizedDescription = description.value.trim();

    if (!normalizedDescription) {
        return "Nhap noi dung vao textarea de thay preview cap nhat ngay tai day.";
    }

    return normalizedDescription;
});

const totalSourceItems = computed(() => {
    return (
        componentCatalog.length + moduleCatalog.length + utilityCatalog.length
    );
});

const usedOnHomeCount = computed(() => {
    return componentCatalog.filter((item) => item.usedOnHome).length;
});

const stats = computed(() => {
    return [
        {
            label: "Component source",
            value: componentCatalog.length,
        },
        {
            label: "Store va service",
            value: moduleCatalog.length,
        },
        {
            label: "Utility va composable",
            value: utilityCatalog.length,
        },
        {
            label: "Dang su dung tren Home",
            value: usedOnHomeCount.value,
        },
    ];
});

const demoPagination = computed<PaginationType>(() => {
    return {
        current_page: currentPage.value,
        per_page: 10,
        total: 48,
        total_pages: 5,
    };
});

const generatedAt = computed(() => formatDate(new Date(), "dd/MM/yyyy HH:mm"));

const handlePageUpdate = (page: number) => {
    currentPage.value = page;
};

const previewToast = () => {
    useToastMessage("Template toast dang hoat dong tot.");
};
</script>

<template>
    <section class="home-page">
        <header class="home-page__hero">
            <div class="home-page__hero-copy">
                <span class="home-page__eyebrow">Vue template catalog</span>
                <h1 class="home-page__title">Trang Home gio la ban do chuc nang cua template</h1>
                <p class="home-page__subtitle">
                    Thay vi mot form demo roi rac, Home duoc doi thanh trang tong hop
                    component, store, service, utility va source path dang co san trong
                    project de team vao la biet mo dau tu dau.
                </p>
            </div>

            <div class="home-page__hero-card">
                <span class="home-page__hero-label">Build info</span>
                <strong class="home-page__hero-value">
                    {{ totalSourceItems }} source item san sang tai su dung
                </strong>
                <div class="home-page__hero-meta">
                    <span>{{ isMobile ? "Mobile view" : "Desktop view" }}</span>
                    <span>{{ generatedAt }}</span>
                </div>
            </div>
        </header>

        <section class="home-page__stats">
            <article
                v-for="item in stats"
                :key="item.label"
                class="home-page__stat-card"
            >
                <span class="home-page__stat-label">{{ item.label }}</span>
                <strong class="home-page__stat-value">{{ item.value }}</strong>
            </article>
        </section>

        <section class="home-page__catalog-section">
            <div class="home-page__section-head">
                <div>
                    <p class="home-page__section-kicker">Feature pages</p>
                    <h2 class="home-page__section-title">
                        Trang chuc nang mau de dung ngay
                    </h2>
                    <p class="home-page__section-note">
                        Day la cac page minh vua bo sung de template co them khu vuc
                        luyen phong van va test nhanh.
                    </p>
                </div>
            </div>

            <div class="home-page__feature-grid">
                <RouterLink
                    v-for="page in featurePages"
                    :key="page.routeName"
                    class="home-page__feature-card"
                    :to="{ name: page.routeName }"
                >
                    <span class="home-page__catalog-badge">Page</span>
                    <h3 class="home-page__catalog-title">{{ page.label }}</h3>
                    <p class="home-page__catalog-description">{{ page.summary }}</p>
                    <p class="home-page__feature-description">{{ page.description }}</p>
                    <span class="home-page__feature-link">Mo page</span>
                </RouterLink>
            </div>
        </section>

        <section class="home-page__content-grid">
            <article class="home-page__panel home-page__panel--demo">
                <div class="home-page__section-head">
                    <div>
                        <p class="home-page__section-kicker">Live demo</p>
                        <h2 class="home-page__section-title">
                            Component dang duoc su dung ngay tren Home
                        </h2>
                    </div>

                    <button
                        type="button"
                        class="home-page__ghost-button"
                        @click="previewToast"
                    >
                        Xem toast demo
                    </button>
                </div>

                <div class="home-page__demo-grid">
                    <div class="home-page__field">
                        <label class="home-page__label">Nhom template</label>
                        <SelectBoxComponent
                            v-model="category"
                            :name="'category'"
                            :options="options"
                            :disabled="options.length === 0"
                            :placeholder="'Chon nhom'"
                            :value-key="'category_id'"
                            :label-key="'title'"
                        />
                    </div>

                    <div class="home-page__field">
                        <label class="home-page__label">Preview image</label>
                        <InputComponent
                            v-model="imageUrl"
                            :childClass="'form-control'"
                            :name="'imageUrl'"
                            :placeholder="'Nhap URL anh hoac de mac dinh'"
                            :type="'text'"
                            :value="imageUrl"
                        />
                    </div>

                    <div class="home-page__field home-page__field--full">
                        <label class="home-page__label">Mo ta page Home</label>
                        <TextareaComponent
                            v-model="description"
                            :name="'description'"
                            :placeholder="'Nhap mo ta de demo TextareaComponent'"
                            rows="5"
                            :maxlength="220"
                            :value="description"
                        />
                    </div>
                </div>

                <div class="home-page__preview-card">
                    <ImageComponent
                        class="home-page__preview-image"
                        :src="imageUrl"
                        alt="Template preview"
                        placeholder-text="Khong co preview image"
                    />

                    <div class="home-page__preview-body">
                        <span class="home-page__preview-badge">
                            {{ selectedCategoryTitle }}
                        </span>
                        <p class="home-page__preview-text">
                            {{ descriptionPreview }}
                        </p>

                        <div class="home-page__preview-meta">
                            <div class="home-page__meta-box">
                                <span class="home-page__meta-label">Ky tu</span>
                                <strong class="home-page__meta-value">
                                    {{ description.length }}
                                </strong>
                            </div>
                            <div class="home-page__meta-box">
                                <span class="home-page__meta-label">Pagination demo</span>
                                <strong class="home-page__meta-value">
                                    Page {{ currentPage }}
                                </strong>
                            </div>
                        </div>

                        <Pagination
                            :pagination="demoPagination"
                            @update:page="handlePageUpdate"
                        />
                    </div>
                </div>
            </article>

            <aside class="home-page__panel home-page__panel--flow">
                <div class="home-page__section-head">
                    <div>
                        <p class="home-page__section-kicker">Template flow</p>
                        <h2 class="home-page__section-title">
                            Duong di source de onboard nhanh
                        </h2>
                    </div>
                </div>

                <div class="home-page__flow-list">
                    <article
                        v-for="(step, index) in flowSteps"
                        :key="step.path"
                        class="home-page__flow-item"
                    >
                        <span class="home-page__flow-index">0{{ index + 1 }}</span>
                        <div class="home-page__flow-content">
                            <h3 class="home-page__flow-title">{{ step.title }}</h3>
                            <p class="home-page__flow-description">
                                {{ step.description }}
                            </p>
                            <code class="home-page__code">{{ step.path }}</code>
                        </div>
                    </article>
                </div>
            </aside>
        </section>

        <section class="home-page__catalog-section">
            <div class="home-page__section-head">
                <div>
                    <p class="home-page__section-kicker">Components</p>
                    <h2 class="home-page__section-title">Source component trong template</h2>
                    <p class="home-page__section-note">
                        Danh sach card ben duoi dang duoc render qua
                        <code class="home-page__inline-code">LazyLoadComponent</code>
                        de chi tai khi item gan vao viewport.
                    </p>
                </div>
            </div>

            <div class="home-page__catalog-grid">
                <LazyLoadComponent
                    v-for="item in componentCatalog"
                    :key="item.path"
                    class="home-page__lazy-wrapper"
                    :min-height="220"
                    :placeholder-text="`Dang tai ${item.name}`"
                >
                    <article class="home-page__catalog-card">
                        <div class="home-page__catalog-top">
                            <span class="home-page__catalog-badge">{{ item.badge }}</span>
                            <span
                                v-if="item.usedOnHome"
                                class="home-page__catalog-usage"
                            >
                                Dang dung o Home
                            </span>
                        </div>
                        <h3 class="home-page__catalog-title">{{ item.name }}</h3>
                        <p class="home-page__catalog-description">{{ item.description }}</p>
                        <code class="home-page__code">{{ item.path }}</code>
                    </article>

                    <template #placeholder>
                        <div class="home-page__catalog-card home-page__catalog-card--placeholder">
                            <span class="home-page__skeleton home-page__skeleton--badge" />
                            <span class="home-page__skeleton home-page__skeleton--title" />
                            <span class="home-page__skeleton home-page__skeleton--line" />
                            <span class="home-page__skeleton home-page__skeleton--line" />
                            <span class="home-page__skeleton home-page__skeleton--code" />
                        </div>
                    </template>
                </LazyLoadComponent>
            </div>
        </section>

        <section class="home-page__catalog-section">
            <div class="home-page__section-head">
                <div>
                    <p class="home-page__section-kicker">Stores + services</p>
                    <h2 class="home-page__section-title">
                        Module xu ly data va API dang co san
                    </h2>
                </div>
            </div>

            <div class="home-page__catalog-grid">
                <LazyLoadComponent
                    v-for="item in moduleCatalog"
                    :key="item.path"
                    class="home-page__lazy-wrapper"
                    :min-height="220"
                    :placeholder-text="`Dang tai ${item.name}`"
                >
                    <article class="home-page__catalog-card">
                        <div class="home-page__catalog-top">
                            <span class="home-page__catalog-badge">{{ item.badge }}</span>
                        </div>
                        <h3 class="home-page__catalog-title">{{ item.name }}</h3>
                        <p class="home-page__catalog-description">{{ item.description }}</p>
                        <code class="home-page__code">{{ item.path }}</code>
                    </article>

                    <template #placeholder>
                        <div class="home-page__catalog-card home-page__catalog-card--placeholder">
                            <span class="home-page__skeleton home-page__skeleton--badge" />
                            <span class="home-page__skeleton home-page__skeleton--title" />
                            <span class="home-page__skeleton home-page__skeleton--line" />
                            <span class="home-page__skeleton home-page__skeleton--line" />
                            <span class="home-page__skeleton home-page__skeleton--code" />
                        </div>
                    </template>
                </LazyLoadComponent>
            </div>
        </section>

        <section class="home-page__catalog-section">
            <div class="home-page__section-head">
                <div>
                    <p class="home-page__section-kicker">Utilities</p>
                    <h2 class="home-page__section-title">
                        Helper source va composable dang co san
                    </h2>
                </div>
            </div>

            <div class="home-page__catalog-grid">
                <LazyLoadComponent
                    v-for="item in utilityCatalog"
                    :key="item.path"
                    class="home-page__lazy-wrapper"
                    :min-height="220"
                    :placeholder-text="`Dang tai ${item.name}`"
                >
                    <article class="home-page__catalog-card">
                        <div class="home-page__catalog-top">
                            <span class="home-page__catalog-badge">{{ item.badge }}</span>
                        </div>
                        <h3 class="home-page__catalog-title">{{ item.name }}</h3>
                        <p class="home-page__catalog-description">{{ item.description }}</p>
                        <code class="home-page__code">{{ item.path }}</code>
                    </article>

                    <template #placeholder>
                        <div class="home-page__catalog-card home-page__catalog-card--placeholder">
                            <span class="home-page__skeleton home-page__skeleton--badge" />
                            <span class="home-page__skeleton home-page__skeleton--title" />
                            <span class="home-page__skeleton home-page__skeleton--line" />
                            <span class="home-page__skeleton home-page__skeleton--line" />
                            <span class="home-page__skeleton home-page__skeleton--code" />
                        </div>
                    </template>
                </LazyLoadComponent>
            </div>
        </section>
    </section>
</template>

<style scoped lang="scss">
.home-page {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: min(1200px, 100%);
    margin: 0 auto;
    padding: 32px 20px 56px;

    &__hero,
    &__panel,
    &__stat-card,
    &__catalog-card {
        border: 1px solid rgba(193, 205, 221, 0.82);
        background: rgba(255, 255, 255, 0.94);
        box-shadow: 0 18px 45px rgba(21, 33, 56, 0.08);
        backdrop-filter: blur(10px);
    }

    &__hero {
        display: grid;
        grid-template-columns: minmax(0, 1.2fr) minmax(260px, 0.8fr);
        gap: 24px;
        padding: 30px;
        border-radius: 28px;
        background:
            radial-gradient(circle at top right, rgba(74, 108, 247, 0.16), transparent 28%),
            linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(243, 247, 252, 0.92));
    }

    &__hero-copy {
        max-width: 720px;
    }

    &__eyebrow,
    &__section-kicker,
    &__stat-label,
    &__hero-label,
    &__meta-label {
        display: inline-flex;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-size: 12px;
        font-weight: 700;
        color: #60708a;
    }

    &__title {
        margin: 14px 0 10px;
        font-size: clamp(2rem, 3vw, 3.3rem);
        line-height: 1.05;
        font-weight: 700;
        color: #162033;
    }

    &__subtitle {
        margin: 0;
        max-width: 660px;
        font-size: 1rem;
        line-height: 1.8;
        color: #556176;
    }

    &__hero-card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 18px;
        padding: 22px;
        border-radius: 24px;
        background: rgba(22, 32, 51, 0.96);
        color: #f4f7fb;
    }

    &__hero-value {
        font-size: 1.25rem;
        line-height: 1.45;
    }

    &__hero-meta {
        display: flex;
        flex-direction: column;
        gap: 8px;
        color: rgba(244, 247, 251, 0.76);
        font-size: 0.92rem;
    }

    &__stats {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 18px;
    }

    &__stat-card {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 20px;
        border-radius: 22px;
    }

    &__stat-value {
        font-size: 2rem;
        line-height: 1;
        font-weight: 700;
        color: #162033;
    }

    &__content-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
        gap: 24px;
        align-items: start;
    }

    &__panel {
        display: flex;
        flex-direction: column;
        gap: 22px;
        padding: 24px;
        border-radius: 26px;
    }

    &__panel--flow {
        position: sticky;
        top: 24px;
    }

    &__section-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
    }

    &__section-title {
        margin: 6px 0 0;
        font-size: 1.5rem;
        line-height: 1.25;
        font-weight: 700;
        color: #162033;
    }

    &__section-note {
        margin: 10px 0 0;
        max-width: 720px;
        font-size: 0.95rem;
        line-height: 1.7;
        color: #60708a;
    }

    &__inline-code {
        display: inline-flex;
        align-items: center;
        min-height: 28px;
        padding: 0 10px;
        margin-inline: 4px;
        border-radius: 999px;
        background: rgba(53, 95, 229, 0.08);
        color: #355fe5;
        font-size: 0.84rem;
    }

    &__ghost-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 44px;
        padding: 0 16px;
        border: 1px solid rgba(74, 108, 247, 0.18);
        border-radius: 999px;
        background: rgba(74, 108, 247, 0.08);
        color: #2f56c8;
        font-size: 0.92rem;
        font-weight: 700;
        transition:
            transform 0.2s ease,
            background-color 0.2s ease;

        &:hover {
            transform: translateY(-1px);
            background: rgba(74, 108, 247, 0.12);
        }
    }

    &__demo-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
    }

    &__field {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    &__field--full {
        grid-column: 1 / -1;
    }

    &__label {
        font-size: 0.95rem;
        font-weight: 700;
        color: #23304a;
    }

    &__preview-card {
        display: grid;
        grid-template-columns: minmax(280px, 0.9fr) minmax(0, 1.1fr);
        gap: 20px;
        padding: 20px;
        border-radius: 24px;
        background: linear-gradient(135deg, #f8fbff 0%, #edf3fb 100%);
    }

    &__preview-image {
        min-height: 260px;
        aspect-ratio: 4 / 3;
        border-radius: 22px;
    }

    &__preview-body {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    &__preview-badge,
    &__catalog-badge,
    &__catalog-usage {
        display: inline-flex;
        align-items: center;
        width: fit-content;
        min-height: 32px;
        padding: 0 12px;
        border-radius: 999px;
        font-size: 0.83rem;
        font-weight: 700;
    }

    &__preview-badge,
    &__catalog-badge {
        background: rgba(53, 95, 229, 0.1);
        color: #355fe5;
    }

    &__catalog-usage {
        background: rgba(23, 161, 97, 0.12);
        color: #1e8a59;
    }

    &__preview-text,
    &__catalog-description,
    &__flow-description {
        margin: 0;
        font-size: 0.98rem;
        line-height: 1.75;
        color: #556176;
    }

    &__preview-meta {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
    }

    &__meta-box {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 14px 16px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.74);
    }

    &__meta-value,
    &__catalog-title,
    &__flow-title {
        color: #162033;
    }

    &__meta-value {
        font-size: 1rem;
        font-weight: 700;
    }

    &__flow-list {
        display: flex;
        flex-direction: column;
        gap: 18px;
    }

    &__flow-item {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        gap: 14px;
        align-items: start;
        padding: 16px;
        border-radius: 20px;
        background: #f5f8fc;
    }

    &__flow-index {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #162033;
        color: #fff;
        font-size: 0.9rem;
        font-weight: 700;
    }

    &__flow-content {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    &__flow-title,
    &__catalog-title {
        margin: 0;
        font-size: 1.05rem;
        font-weight: 700;
        line-height: 1.4;
    }

    &__catalog-section {
        display: flex;
        flex-direction: column;
        gap: 18px;
    }

    &__feature-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
    }

    &__feature-card {
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 22px;
        border: 1px solid rgba(193, 205, 221, 0.82);
        border-radius: 22px;
        background: rgba(255, 255, 255, 0.94);
        box-shadow: 0 18px 45px rgba(21, 33, 56, 0.08);
        transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;

        &:hover {
            transform: translateY(-1px);
            border-color: rgba(53, 95, 229, 0.22);
            box-shadow: 0 22px 46px rgba(53, 95, 229, 0.1);
        }
    }

    &__feature-description {
        margin: 0;
        font-size: 0.94rem;
        line-height: 1.7;
        color: #60708a;
    }

    &__feature-link {
        display: inline-flex;
        align-items: center;
        width: fit-content;
        min-height: 34px;
        padding: 0 12px;
        border-radius: 999px;
        background: rgba(53, 95, 229, 0.1);
        color: #355fe5;
        font-size: 0.84rem;
        font-weight: 700;
    }

    &__catalog-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 18px;
    }

    &__lazy-wrapper {
        display: block;
        height: 100%;
    }

    &__catalog-card {
        display: flex;
        flex-direction: column;
        gap: 16px;
        height: 100%;
        padding: 20px;
        border-radius: 22px;

        &--placeholder {
            justify-content: flex-start;
        }
    }

    &__catalog-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
    }

    &__code {
        display: block;
        padding: 12px 14px;
        border-radius: 14px;
        background: #f4f7fb;
        color: #2c3c58;
        font-size: 0.84rem;
        line-height: 1.6;
        white-space: normal;
        word-break: break-word;
    }

    &__skeleton {
        display: block;
        border-radius: 999px;
        background:
            linear-gradient(90deg, #edf2f8 0%, #dbe5f4 50%, #edf2f8 100%);
        background-size: 200% 100%;
        animation: home-page-skeleton 1.6s ease-in-out infinite;

        &--badge {
            width: 88px;
            height: 30px;
        }

        &--title {
            width: 68%;
            height: 20px;
            border-radius: 12px;
        }

        &--line {
            width: 100%;
            height: 14px;
            border-radius: 10px;

            &:nth-of-type(4) {
                width: 84%;
            }
        }

        &--code {
            margin-top: auto;
            width: 100%;
            height: 48px;
            border-radius: 14px;
        }
    }

    :deep(.form-control),
    :deep(.form-textarea),
    :deep(.selected-value) {
        border-color: #d9e0ea;
        border-radius: 14px;
        box-shadow: none;
    }

    :deep(.form-control),
    :deep(.form-textarea) {
        padding: 14px 16px;
        background: #fbfcfe;
    }

    :deep(.form-control:focus),
    :deep(.form-textarea:focus) {
        border-color: #7b95e8;
        box-shadow: 0 0 0 4px rgba(74, 108, 247, 0.12);
    }

    :deep(.dropdown) {
        border-radius: 16px;
    }

    :deep(.pagination-container) {
        justify-content: flex-start;
        padding-top: 0;
    }
}

@keyframes home-page-skeleton {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
}

@media (max-width: 1100px) {
    .home-page {
        &__stats,
        &__feature-grid,
        &__catalog-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        &__content-grid {
            grid-template-columns: 1fr;
        }

        &__panel--flow {
            position: static;
        }
    }
}

@media (max-width: 820px) {
    .home-page {
        &__hero,
        &__preview-card,
        &__demo-grid {
            grid-template-columns: 1fr;
        }

        &__section-head {
            flex-direction: column;
        }

        &__preview-meta {
            grid-template-columns: 1fr;
        }
    }
}

@media (max-width: 640px) {
    .home-page {
        padding-inline: 16px;

        &__hero,
        &__panel,
        &__stat-card,
        &__catalog-card,
        &__feature-card {
            padding: 20px;
            border-radius: 22px;
        }

        &__stats,
        &__feature-grid,
        &__catalog-grid {
            grid-template-columns: 1fr;
        }
    }
}
</style>
