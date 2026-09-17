"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import {
  X,
  FolderPlus,
  FolderEdit,
  Upload,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { createAdminCategoryAction, updateAdminCategoryAction } from "@/actions/categories";
import { uploadProductMediaAction } from "@/actions/admin";
import type { CategoryWithProductCount } from "@/actions/categories";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categoryToEdit?: CategoryWithProductCount | null;
  defaultParentId?: string | null;
  availableParents: CategoryWithProductCount[];
};

export function CategoryModal({
  isOpen,
  onClose,
  onSuccess,
  categoryToEdit,
  defaultParentId,
  availableParents,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [parentId, setParentId] = useState<string>("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const isEditMode = Boolean(categoryToEdit);
  const hasChildren = Boolean(categoryToEdit?.subcategories && categoryToEdit.subcategories.length > 0);

  // Helper to generate slug from name
  function generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // Populate state when modal opens or categoryToEdit changes
  useEffect(() => {
    if (!isOpen) return;

    setErrorMessage(null);
    if (categoryToEdit) {
      setName(categoryToEdit.name);
      setSlug(categoryToEdit.slug);
      setIsSlugManuallyEdited(true);
      setParentId(categoryToEdit.parent_id || "");
      setDescription(categoryToEdit.description || "");
      setImageUrl(categoryToEdit.image_url || "");
      setDisplayOrder(categoryToEdit.display_order ?? 0);
      setIsActive(categoryToEdit.is_active ?? true);
    } else {
      setName("");
      setSlug("");
      setIsSlugManuallyEdited(false);
      setParentId(defaultParentId || "");
      setDescription("");
      setImageUrl("");
      setDisplayOrder(0);
      setIsActive(true);
    }
  }, [isOpen, categoryToEdit, defaultParentId]);

  // Auto-generate slug as name changes (only in create mode if user hasn't manually altered slug)
  function handleNameChange(val: string) {
    setName(val);
    if (!isSlugManuallyEdited) {
      setSlug(generateSlug(val));
    }
  }

  // Handle direct image file upload
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image file size exceeds 5MB limit.");
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadProductMediaAction(formData);
      if (!res.success || !res.url) {
        throw new Error(res.error || "Upload failed");
      }

      setImageUrl(res.url);
    } catch (err: unknown) {
      console.error("[CategoryModal] Upload error:", err);
      setErrorMessage(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || name.length < 2) {
      setErrorMessage("Category name must be at least 2 characters.");
      return;
    }

    const cleanSlug = slug.trim() || generateSlug(name);
    if (!cleanSlug || cleanSlug.length < 2) {
      setErrorMessage("Category slug must be at least 2 characters.");
      return;
    }

    startTransition(async () => {
      if (isEditMode && categoryToEdit) {
        const res = await updateAdminCategoryAction({
          id: categoryToEdit.id,
          name: name.trim(),
          slug: cleanSlug,
          description: description.trim() || undefined,
          image_url: imageUrl.trim() || undefined,
          parent_id: parentId || null,
          display_order: displayOrder,
          is_active: isActive,
        });

        if (!res.success) {
          setErrorMessage(res.error || "Failed to update category.");
        } else {
          onSuccess();
          onClose();
        }
      } else {
        const res = await createAdminCategoryAction({
          name: name.trim(),
          slug: cleanSlug,
          description: description.trim() || undefined,
          image_url: imageUrl.trim() || undefined,
          parent_id: parentId || null,
          display_order: displayOrder,
          is_active: isActive,
        });

        if (!res.success) {
          setErrorMessage(res.error || "Failed to create category.");
        } else {
          onSuccess();
          onClose();
        }
      }
    });
  }

  if (!isOpen) return null;

  // Filter parents: when editing, category cannot choose itself
  const parentOptions = availableParents.filter(
    (p) => !categoryToEdit || p.id !== categoryToEdit.id
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-dark/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-xl rounded-2xl bg-surface border border-neutral-border shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-border bg-neutral-bg/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-surface text-primary flex items-center justify-center">
              {isEditMode ? <FolderEdit className="w-5 h-5" /> : <FolderPlus className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-neutral-dark">
                {isEditMode ? "Edit Category" : "Add New Category"}
              </h2>
              <p className="font-sans text-xs text-neutral-muted">
                {isEditMode
                  ? "Update category details and hierarchy settings"
                  : "Create a new top-level department or subcategory"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-muted hover:text-neutral-dark hover:bg-neutral-border/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-error-surface border border-error/30 flex items-start gap-2 text-error text-xs font-sans">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
          {/* Category Name */}
          <div>
            <label className="block font-sans text-xs font-bold text-neutral-dark mb-1">
              Category Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Wooden Toys, Digital Gadgets, Gift Combos"
              className="w-full h-10 px-3.5 rounded-md bg-neutral-bg border border-neutral-border text-sm font-sans text-neutral-dark placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Slug */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-sans text-xs font-bold text-neutral-dark">
                URL Slug <span className="text-error">*</span>
              </label>
              <span className="font-sans text-[11px] text-neutral-muted">
                Used in: /category/{slug || "slug"}
              </span>
            </div>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setIsSlugManuallyEdited(true);
              }}
              placeholder="e.g. wooden-toys"
              className="w-full h-10 px-3.5 rounded-md bg-neutral-bg border border-neutral-border text-sm font-mono text-neutral-dark placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Parent Category (2-Level Hierarchy Selector) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-sans text-xs font-bold text-neutral-dark">
                Parent Category
              </label>
              {hasChildren && (
                <span className="font-sans text-[11px] text-warning-foreground flex items-center gap-1">
                  <HelpCircle className="w-3 h-3" /> Has child subcategories (locked as parent)
                </span>
              )}
            </div>
            <select
              value={parentId}
              disabled={hasChildren}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full h-10 px-3.5 rounded-md bg-neutral-bg border border-neutral-border text-sm font-sans text-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="">None (Top-Level Parent Category)</option>
              {parentOptions.map((parent) => (
                <option key={parent.id} value={parent.id}>
                  Under: {parent.name}
                </option>
              ))}
            </select>
            <p className="font-sans text-[11px] text-neutral-muted mt-1">
              Leave as &quot;None&quot; for a main storefront department. Select an existing parent to create a subcategory.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block font-sans text-xs font-bold text-neutral-dark mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description displayed on category banners and SEO meta tags..."
              className="w-full p-3 rounded-md bg-neutral-bg border border-neutral-border text-sm font-sans text-neutral-dark placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            />
          </div>

          {/* Image Upload / URL */}
          <div>
            <label className="block font-sans text-xs font-bold text-neutral-dark mb-1">
              Category Image / Thumbnail
            </label>
            <div className="flex items-center gap-3">
              {/* Preview Thumbnail */}
              <div className="w-16 h-16 rounded-xl bg-neutral-bg border border-neutral-border overflow-hidden flex items-center justify-center shrink-0 relative">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={name || "Preview"}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-neutral-muted" />
                )}
              </div>

              {/* URL input and upload button */}
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste image URL (https://...)"
                  className="w-full h-9 px-3 rounded-md bg-neutral-bg border border-neutral-border text-xs font-sans text-neutral-dark placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />

                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface border border-neutral-border text-xs font-sans font-medium text-neutral-dark hover:bg-neutral-bg cursor-pointer transition-colors">
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5 text-primary" />
                      <span>Upload Photo</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploading}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Display Order & Active Status Row */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-neutral-border">
            {/* Display Order */}
            <div>
              <label className="block font-sans text-xs font-bold text-neutral-dark mb-1">
                Display Order
              </label>
              <input
                type="number"
                min={0}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
                className="w-full h-10 px-3.5 rounded-md bg-neutral-bg border border-neutral-border text-sm font-sans text-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <span className="font-sans text-[11px] text-neutral-muted">
                Lower numbers appear first
              </span>
            </div>

            {/* Active Toggle */}
            <div>
              <label className="block font-sans text-xs font-bold text-neutral-dark mb-1">
                Status
              </label>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`w-full h-10 px-3.5 rounded-md border flex items-center justify-between text-xs font-sans font-semibold transition-colors ${
                  isActive
                    ? "bg-success-surface border-success/30 text-success"
                    : "bg-neutral-bg border-neutral-border text-neutral-muted"
                }`}
              >
                <span>{isActive ? "Active (Visible)" : "Draft (Hidden)"}</span>
                <div
                  className={`w-4 h-4 rounded-full transition-colors ${
                    isActive ? "bg-success" : "bg-neutral-muted"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 rounded-md font-sans text-xs font-medium text-neutral-muted hover:text-neutral-dark hover:bg-neutral-bg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || isUploading}
              className="px-5 py-2.5 rounded-md font-sans text-xs font-bold bg-primary text-white hover:opacity-95 disabled:opacity-50 transition-all flex items-center gap-2 shadow-xs"
            >
              {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isEditMode ? "Save Changes" : "Create Category"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
