<script lang="ts" setup>
import ImageComponent from "@/components/ImageComponent.vue";
import InputComponent from "@/components/InputComponent.vue";
import SelectBoxComponent from "@/components/SelectBoxComponent.vue";
import TextareaComponent from "@/components/TextareaComponent.vue";
import { computed, shallowRef } from "vue";

interface CategoryOption {
    category_id: number;
    title: string;
}

const category = shallowRef<number | null>(1);
const description = shallowRef("");
const imageUrl = shallowRef("");

const options: CategoryOption[] = [
    {
        category_id: 1,
        title: "Tin tuc noi bo",
    },
    {
        category_id: 2,
        title: "San pham moi",
    },
    {
        category_id: 3,
        title: "Chia se kien thuc",
    },
];

const selectedCategoryTitle = computed(() => {
    return (
        options.find((option) => option.category_id === category.value)?.title ??
        "Chua chon danh muc"
    );
});

const descriptionPreview = computed(() => {
    const normalizedDescription = description.value.trim();

    if (!normalizedDescription) {
        return "Noi dung mo ta se hien thi tai day de ban xem bo cuc truoc khi luu.";
    }

    return normalizedDescription;
});
</script>

<template>
    <section class="home-page">
        <header class="home-page__hero">
            <div class="home-page__hero-copy">
                <span class="home-page__eyebrow">Content workspace</span>
                <h1 class="home-page__title">Tao noi dung gon gang, xem truoc ngay</h1>
                <p class="home-page__subtitle">
                    Giao dien duoc sap xep lai de form de nhin hon, thong tin ro rang
                    hon va co khu vuc preview hinh anh, noi dung ngay ben canh.
                </p>
            </div>

            <div class="home-page__hero-note">
                <span class="home-page__hero-label">Trang thai</span>
                <strong class="home-page__hero-value">San sang tao bai dang</strong>
            </div>
        </header>

        <div class="home-page__grid">
            <article class="home-page__panel">
                <div class="home-page__panel-head">
                    <div>
                        <p class="home-page__panel-kicker">Thong tin bai dang</p>
                        <h2 class="home-page__panel-title">Noi dung co ban</h2>
                    </div>
                    <span class="home-page__panel-badge">Draft</span>
                </div>

                <div class="home-page__field">
                    <label class="home-page__label">Danh muc</label>
                    <SelectBoxComponent
                        v-model="category"
                        :name="'category'"
                        :options="options"
                        :disabled="options.length === 0"
                        :placeholder="'Chon danh muc'"
                        :value-key="'category_id'"
                        :label-key="'title'"
                    />
                </div>

                <div class="home-page__field">
                    <label class="home-page__label">Link hinh anh</label>
                    <InputComponent
                        v-model="imageUrl"
                        :childClass="'form-control'"
                        :name="'imageUrl'"
                        :placeholder="'https://example.com/image.jpg'"
                        :type="'text'"
                        :value="imageUrl"
                    />
                </div>

                <div class="home-page__field">
                    <label class="home-page__label">Mo ta ngan</label>
                    <TextareaComponent
                        v-model="description"
                        :name="'description'"
                        :placeholder="'Nhap mo ta ngan cho bai dang'"
                        rows="5"
                        :maxlength="200"
                        :value="description"
                    />
                </div>
            </article>

            <aside class="home-page__preview">
                <div class="home-page__panel-head">
                    <div>
                        <p class="home-page__panel-kicker">Preview</p>
                        <h2 class="home-page__panel-title">Xem truoc giao dien</h2>
                    </div>
                </div>

                <ImageComponent
                    class="home-page__preview-image"
                    :src="imageUrl"
                    alt="Preview image"
                    placeholder-text="Them duong dan hinh anh de hien thi preview"
                />

                <div class="home-page__preview-content">
                    <span class="home-page__preview-category">
                        {{ selectedCategoryTitle }}
                    </span>

                    <p class="home-page__preview-description">
                        {{ descriptionPreview }}
                    </p>

                    <div class="home-page__meta">
                        <div class="home-page__meta-item">
                            <span class="home-page__meta-label">Ky tu</span>
                            <strong class="home-page__meta-value">
                                {{ description.length }}/200
                            </strong>
                        </div>
                        <div class="home-page__meta-item">
                            <span class="home-page__meta-label">Che do</span>
                            <strong class="home-page__meta-value">Tu dong preview</strong>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    </section>
</template>

<style scoped lang="scss">
.home-page {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: min(1120px, 100%);
    margin: 0 auto;
    padding: 32px 20px 48px;

    &__hero {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        padding: 28px;
        border: 1px solid rgba(187, 202, 221, 0.7);
        border-radius: 28px;
        background:
            radial-gradient(circle at top right, rgba(74, 108, 247, 0.16), transparent 30%),
            linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(244, 247, 251, 0.92));
        box-shadow: 0 24px 60px rgba(21, 33, 56, 0.08);
    }

    &__hero-copy {
        max-width: 640px;
    }

    &__eyebrow,
    &__panel-kicker,
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
        margin: 12px 0 10px;
        font-size: clamp(2rem, 3vw, 3.15rem);
        font-weight: 700;
        line-height: 1.05;
        color: #162033;
    }

    &__subtitle {
        margin: 0;
        max-width: 580px;
        font-size: 1rem;
        line-height: 1.75;
        color: #5b677b;
    }

    &__hero-note {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 12px;
        min-width: 220px;
        padding: 18px 20px;
        border-radius: 22px;
        background: rgba(22, 32, 51, 0.94);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }

    &__hero-value {
        font-size: 1.1rem;
        line-height: 1.45;
        color: #f4f7fb;
    }

    &__grid {
        display: grid;
        grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
        gap: 24px;
        align-items: start;
    }

    &__panel,
    &__preview {
        padding: 24px;
        border: 1px solid rgba(193, 205, 221, 0.82);
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.94);
        box-shadow: 0 18px 45px rgba(21, 33, 56, 0.08);
        backdrop-filter: blur(10px);
    }

    &__panel {
        display: flex;
        flex-direction: column;
        gap: 22px;
    }

    &__preview {
        display: flex;
        flex-direction: column;
        gap: 20px;
        position: sticky;
        top: 24px;
    }

    &__panel-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
    }

    &__panel-title {
        margin: 6px 0 0;
        font-size: 1.4rem;
        font-weight: 700;
        color: #1b2436;
    }

    &__panel-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 34px;
        padding: 0 14px;
        border-radius: 999px;
        background: rgba(53, 95, 229, 0.1);
        color: #355fe5;
        font-size: 0.875rem;
        font-weight: 700;
    }

    &__field {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    &__label {
        font-size: 0.95rem;
        font-weight: 700;
        color: #23304a;
    }

    &__preview-image {
        min-height: 280px;
        aspect-ratio: 4 / 3;
        border-radius: 22px;
    }

    &__preview-content {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    &__preview-category {
        display: inline-flex;
        align-items: center;
        width: fit-content;
        min-height: 34px;
        padding: 0 14px;
        border-radius: 999px;
        background: rgba(29, 102, 245, 0.12);
        color: #2455c3;
        font-size: 0.875rem;
        font-weight: 700;
    }

    &__preview-description {
        margin: 0;
        font-size: 1rem;
        line-height: 1.8;
        color: #455066;
        white-space: pre-line;
    }

    &__meta {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
    }

    &__meta-item {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 14px 16px;
        border-radius: 18px;
        background: #f4f7fb;
    }

    &__meta-value {
        font-size: 0.98rem;
        font-weight: 700;
        color: #162033;
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
}

@media (max-width: 991px) {
    .home-page {
        &__hero,
        &__panel-head {
            flex-direction: column;
        }

        &__hero-note {
            min-width: unset;
        }

        &__grid {
            grid-template-columns: 1fr;
        }

        &__preview {
            position: static;
        }
    }
}

@media (max-width: 640px) {
    .home-page {
        padding-inline: 16px;

        &__hero,
        &__panel,
        &__preview {
            padding: 20px;
            border-radius: 22px;
        }

        &__meta {
            grid-template-columns: 1fr;
        }
    }
}
</style>
