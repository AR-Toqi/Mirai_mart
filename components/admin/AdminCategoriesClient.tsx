"use client";

import { useState, useEffect, useTransition, useMemo } from "react";
import Image from "next/image";
import {
  FolderTree,
  FolderPlus,
  Search,
  ChevronDown,
  ChevronRight,
  Edit2,
  Trash2,
  Plus,
  ExternalLink,
  Package,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Folder,
  SlidersHorizontal,
  Loader2,
  Image as ImageIcon,
  GripVertical,
} from "lucide-react";
import { CategoryModal } from "@/components/admin/CategoryModal";
import {
  toggleAdminCategoryStatusAction,
  deleteAdminCategoryAction,
  reorderAdminCategoriesAction,
  type CategoryWithProductCount,
  type CategoryKPIMetrics,
} from "@/actions/categories";
import { useRouter } from "next/navigation";

type Props = {
  initialCategories: CategoryWithProductCount[];
  initialParents: CategoryWithProductCount[];
  initialMetrics: CategoryKPIMetrics;
};

type FilterTab = "all" | "parents" | "subcategories" | "active" | "draft";

export function AdminCategoriesClient({
  initialCategories,
  initialParents,
  initialMetrics,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Categories data state (refreshed on action success)
  const [categories, setCategories] = useState(initialCategories);
  const [parentCategories, setParentCategories] = useState(initialParents);
  const [metrics, setMetrics] = useState(initialMetrics);

  // Synchronize state when server component re-renders with fresh data
  useEffect(() => {
    setCategories(initialCategories);
    setParentCategories(initialParents);
    setMetrics(initialMetrics);
    setExpandedParentIds((prev) => {
      const next = new Set(prev);
      initialParents.forEach((p) => next.add(p.id));
      return next;
    });
  }, [initialCategories, initialParents, initialMetrics]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  // Expanded parent rows
  const [expandedParentIds, setExpandedParentIds] = useState<Set<string>>(() => {
    // Default: all parents with children expanded
    return new Set(initialParents.map((p) => p.id));
  });

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryWithProductCount | null>(null);
  const [defaultParentId, setDefaultParentId] = useState<string | null>(null);

  // Delete Guard Modal state
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryWithProductCount | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Toast / notification
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  function showNotification(type: "success" | "error", message: string) {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  }

  // Drag-and-drop sorting state & guards
  const isDragEnabled = !searchQuery.trim() && activeTab === "all";
  const [draggedParentId, setDraggedParentId] = useState<string | null>(null);
  const [dragOverParentId, setDragOverParentId] = useState<string | null>(null);

  const [draggedSubId, setDraggedSubId] = useState<string | null>(null);
  const [dragOverSubId, setDragOverSubId] = useState<string | null>(null);
  const [draggedSubParentId, setDraggedSubParentId] = useState<string | null>(null);

  // Drag handlers for Parent Departments
  function handleParentDragStart(e: React.DragEvent, id: string) {
    if (!isDragEnabled) return;
    e.dataTransfer.setData("application/x-category-parent", id);
    e.dataTransfer.effectAllowed = "move";
    setDraggedParentId(id);
  }

  function handleParentDragOver(e: React.DragEvent, id: string) {
    if (!isDragEnabled || !draggedParentId || draggedParentId === id) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverParentId !== id) {
      setDragOverParentId(id);
    }
  }

  function handleParentDrop(e: React.DragEvent, targetId: string) {
    if (!isDragEnabled) return;
    e.preventDefault();
    const sourceId = e.dataTransfer.getData("application/x-category-parent") || draggedParentId;
    setDraggedParentId(null);
    setDragOverParentId(null);

    if (!sourceId || sourceId === targetId) return;

    const sourceIdx = parentCategories.findIndex((p) => p.id === sourceId);
    const targetIdx = parentCategories.findIndex((p) => p.id === targetId);
    if (sourceIdx === -1 || targetIdx === -1) return;

    const previousParents = [...parentCategories];
    const reordered = [...parentCategories];
    const [movedItem] = reordered.splice(sourceIdx, 1);
    reordered.splice(targetIdx, 0, movedItem);

    const optimisticallyUpdated = reordered.map((cat, idx) => ({
      ...cat,
      display_order: idx,
    }));

    setParentCategories(optimisticallyUpdated);

    const payload = optimisticallyUpdated.map((cat) => ({
      id: cat.id,
      display_order: cat.display_order ?? 0,
    }));

    startTransition(async () => {
      const res = await reorderAdminCategoriesAction(payload);
      if (!res.success) {
        setParentCategories(previousParents);
        showNotification("error", res.error || "Failed to update category order.");
      } else {
        showNotification("success", "Category order updated.");
        router.refresh();
      }
    });
  }

  // Drag handlers for Subcategories within a parent
  function handleSubDragStart(e: React.DragEvent, parentId: string, subId: string) {
    if (!isDragEnabled) return;
    e.stopPropagation();
    e.dataTransfer.setData(
      "application/x-category-sub",
      JSON.stringify({ parentId, subId })
    );
    e.dataTransfer.effectAllowed = "move";
    setDraggedSubId(subId);
    setDraggedSubParentId(parentId);
  }

  function handleSubDragOver(e: React.DragEvent, parentId: string, subId: string) {
    if (
      !isDragEnabled ||
      !draggedSubId ||
      draggedSubId === subId ||
      draggedSubParentId !== parentId
    ) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    if (dragOverSubId !== subId) {
      setDragOverSubId(subId);
    }
  }

  function handleSubDrop(e: React.DragEvent, parentId: string, targetSubId: string) {
    if (!isDragEnabled) return;
    e.preventDefault();
    e.stopPropagation();

    let sourceSubId = draggedSubId;
    let sourceParentId = draggedSubParentId;

    const rawData = e.dataTransfer.getData("application/x-category-sub");
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        sourceSubId = parsed.subId;
        sourceParentId = parsed.parentId;
      } catch {
        // fallback to state
      }
    }

    setDraggedSubId(null);
    setDragOverSubId(null);
    setDraggedSubParentId(null);

    if (
      !sourceSubId ||
      sourceSubId === targetSubId ||
      sourceParentId !== parentId
    ) {
      return;
    }

    const parent = parentCategories.find((p) => p.id === parentId);
    if (!parent || !parent.subcategories) return;

    const sourceIdx = parent.subcategories.findIndex((s) => s.id === sourceSubId);
    const targetIdx = parent.subcategories.findIndex((s) => s.id === targetSubId);
    if (sourceIdx === -1 || targetIdx === -1) return;

    const previousParents = [...parentCategories];
    const reorderedSubs = [...parent.subcategories];
    const [movedSub] = reorderedSubs.splice(sourceIdx, 1);
    reorderedSubs.splice(targetIdx, 0, movedSub);

    const updatedSubs = reorderedSubs.map((s, idx) => ({
      ...s,
      display_order: idx,
    }));

    const optimisticallyUpdated = parentCategories.map((p) =>
      p.id === parentId ? { ...p, subcategories: updatedSubs } : p
    );

    setParentCategories(optimisticallyUpdated);

    const payload = updatedSubs.map((sub) => ({
      id: sub.id,
      display_order: sub.display_order ?? 0,
    }));

    startTransition(async () => {
      const res = await reorderAdminCategoriesAction(payload);
      if (!res.success) {
        setParentCategories(previousParents);
        showNotification("error", res.error || "Failed to update subcategory order.");
      } else {
        showNotification("success", "Subcategory order updated.");
        router.refresh();
      }
    });
  }

  function handleDragEnd() {
    setDraggedParentId(null);
    setDragOverParentId(null);
    setDraggedSubId(null);
    setDragOverSubId(null);
    setDraggedSubParentId(null);
  }

  // Refresh page data after mutation
  function handleDataUpdated() {
    startTransition(() => {
      router.refresh();
    });
    showNotification("success", "Category changes saved successfully.");
  }

  // Toggle expand/collapse for a parent row
  function toggleExpandParent(id: string) {
    setExpandedParentIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  // Open modal in Create mode (either top-level or with preselected parent)
  function handleOpenCreate(parentId?: string) {
    setCategoryToEdit(null);
    setDefaultParentId(parentId || null);
    setIsCategoryModalOpen(true);
  }

  // Open modal in Edit mode
  function handleOpenEdit(cat: CategoryWithProductCount) {
    setCategoryToEdit(cat);
    setDefaultParentId(cat.parent_id || null);
    setIsCategoryModalOpen(true);
  }

  // Toggle active status
  function handleToggleStatus(cat: CategoryWithProductCount) {
    startTransition(async () => {
      const newStatus = !cat.is_active;
      const res = await toggleAdminCategoryStatusAction(cat.id, newStatus);
      if (res.success) {
        // Optimistically update local state
        const updater = (list: CategoryWithProductCount[]) =>
          list.map((item) => {
            if (item.id === cat.id) {
              return { ...item, is_active: newStatus };
            }
            if (item.subcategories) {
              return {
                ...item,
                subcategories: item.subcategories.map((sub) =>
                  sub.id === cat.id ? { ...sub, is_active: newStatus } : sub
                ),
              };
            }
            return item;
          });

        setCategories((prev) => updater(prev));
        setParentCategories((prev) => updater(prev));
        setMetrics((prev) => ({
          ...prev,
          activeCount: newStatus ? prev.activeCount + 1 : Math.max(0, prev.activeCount - 1),
        }));
        showNotification("success", `Category "${cat.name}" is now ${newStatus ? "Active" : "Draft"}.`);
        router.refresh();
      } else {
        showNotification("error", res.error || "Failed to toggle status.");
      }
    });
  }

  // Execute deletion
  function confirmDelete() {
    if (!categoryToDelete) return;

    setDeleteError(null);
    startTransition(async () => {
      const res = await deleteAdminCategoryAction(categoryToDelete.id);
      if (!res.success) {
        setDeleteError(res.error || "Failed to delete category.");
      } else {
        const deletedId = categoryToDelete.id;
        setCategoryToDelete(null);
        setCategories((prev) => prev.filter((c) => c.id !== deletedId));
        setParentCategories((prev) =>
          prev
            .filter((p) => p.id !== deletedId)
            .map((p) => ({
              ...p,
              subcategories: p.subcategories?.filter((s) => s.id !== deletedId),
            }))
        );
        showNotification("success", `Category "${categoryToDelete.name}" was deleted.`);
        router.refresh();
      }
    });
  }

  // Filtered categories
  const filteredParents = useMemo(() => {
    return parentCategories.filter((parent) => {
      const q = searchQuery.toLowerCase().trim();
      const parentMatchesSearch =
        !q ||
        parent.name.toLowerCase().includes(q) ||
        parent.slug.toLowerCase().includes(q);

      const matchingSubs = (parent.subcategories || []).filter(
        (sub) =>
          !q ||
          sub.name.toLowerCase().includes(q) ||
          sub.slug.toLowerCase().includes(q)
      );

      const hasSearchMatch = parentMatchesSearch || matchingSubs.length > 0;
      if (!hasSearchMatch) return false;

      // Filter tabs
      if (activeTab === "parents") return true;
      if (activeTab === "subcategories") return matchingSubs.length > 0;
      if (activeTab === "active") return parent.is_active || matchingSubs.some((s) => s.is_active);
      if (activeTab === "draft") return !parent.is_active || matchingSubs.some((s) => !s.is_active);
      return true;
    });
  }, [parentCategories, searchQuery, activeTab]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-sans font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200 ${
            notification.type === "success"
              ? "bg-success-surface border-success/30 text-success"
              : "bg-error-surface border-error/30 text-error"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-error shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-neutral-dark">
              Category Management
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
              Live DB
            </span>
          </div>
          <p className="font-sans text-xs sm:text-sm text-neutral-muted mt-1">
            Create and organize storefront departments and nested subcategories. Zero fallbacks — changes sync live to the storefront.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleOpenCreate()}
            className="px-4 py-2.5 rounded-md font-sans text-xs font-bold bg-primary text-white hover:opacity-95 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Categories */}
        <div className="p-5 rounded-2xl bg-surface border border-neutral-border shadow-xs flex items-center justify-between">
          <div>
            <span className="font-sans text-xs text-neutral-muted uppercase tracking-wider block">
              Total Categories
            </span>
            <span className="font-heading font-bold text-2xl sm:text-3xl text-neutral-dark mt-1 block">
              {metrics.totalCategories}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary-surface text-primary flex items-center justify-center">
            <FolderTree className="w-6 h-6" />
          </div>
        </div>

        {/* Parent Departments */}
        <div className="p-5 rounded-2xl bg-surface border border-neutral-border shadow-xs flex items-center justify-between">
          <div>
            <span className="font-sans text-xs text-neutral-muted uppercase tracking-wider block">
              Parent Departments
            </span>
            <span className="font-heading font-bold text-2xl sm:text-3xl text-neutral-dark mt-1 block">
              {metrics.parentCount}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-secondary-surface text-secondary-foreground flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Subcategories */}
        <div className="p-5 rounded-2xl bg-surface border border-neutral-border shadow-xs flex items-center justify-between">
          <div>
            <span className="font-sans text-xs text-neutral-muted uppercase tracking-wider block">
              Subcategories
            </span>
            <span className="font-heading font-bold text-2xl sm:text-3xl text-neutral-dark mt-1 block">
              {metrics.subcategoryCount}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-tertiary-surface text-tertiary flex items-center justify-center">
            <Folder className="w-6 h-6" />
          </div>
        </div>

        {/* Active on Storefront */}
        <div className="p-5 rounded-2xl bg-surface border border-neutral-border shadow-xs flex items-center justify-between">
          <div>
            <span className="font-sans text-xs text-neutral-muted uppercase tracking-wider block">
              Active on Storefront
            </span>
            <span className="font-heading font-bold text-2xl sm:text-3xl text-neutral-dark mt-1 block">
              {metrics.activeCount}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-success-surface text-success flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-surface border border-neutral-border shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories by name or slug..."
            className="w-full h-10 pl-9 pr-3.5 rounded-md bg-neutral-bg border border-neutral-border text-xs font-sans text-neutral-dark placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto p-1 bg-neutral-bg rounded-lg">
          {(
            [
              { id: "all", label: "All" },
              { id: "parents", label: "Parents" },
              { id: "subcategories", label: "Subcategories" },
              { id: "active", label: "Active" },
              { id: "draft", label: "Draft" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md font-sans text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-surface text-neutral-dark shadow-2xs"
                  : "text-neutral-muted hover:text-neutral-dark"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hierarchical Categories Table / Tree */}
      <div className="rounded-2xl bg-surface border border-neutral-border shadow-xs overflow-hidden">
        {/* Drag & Reorder Instruction Banner */}
        {filteredParents.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-6 py-2.5 bg-neutral-bg/60 border-b border-neutral-border text-xs font-sans">
            <div className="flex items-center gap-2 text-neutral-muted">
              <GripVertical className="w-4 h-4 text-primary shrink-0" />
              {isDragEnabled ? (
                <span>
                  <strong className="text-neutral-dark font-medium">Drag to reorder:</strong> Grab the grip handle next to any department or subcategory to rearrange. Order is saved automatically.
                </span>
              ) : (
                <span className="text-warning-foreground font-medium">
                  Reordering is paused while search or filter tabs are active. Clear search & select &quot;All&quot; to drag categories.
                </span>
              )}
            </div>
            {isPending && (
              <div className="flex items-center gap-1.5 text-primary text-xs font-bold shrink-0 animate-in fade-in">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving order...</span>
              </div>
            )}
          </div>
        )}

        {filteredParents.length === 0 ? (
          /* Empty State */
          <div className="py-16 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-surface/40 text-primary flex items-center justify-center mx-auto mb-4">
              <FolderTree className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-bold text-lg sm:text-xl text-neutral-dark mb-1">
              {searchQuery ? "No matching categories found" : "No Categories Created Yet"}
            </h3>
            <p className="font-sans text-xs sm:text-sm text-neutral-muted max-w-md mx-auto mb-6">
              {searchQuery
                ? `No categories or subcategories matched "${searchQuery}". Try a different keyword or clear filters.`
                : "Your store does not have any categories yet. Create your first parent department to start structuring products."}
            </p>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 rounded-md font-sans text-xs font-semibold bg-neutral-bg border border-neutral-border text-neutral-dark hover:bg-neutral-border/40 transition-colors"
              >
                Clear Search
              </button>
            ) : (
              <button
                onClick={() => handleOpenCreate()}
                className="px-5 py-2.5 rounded-md font-sans text-xs font-bold bg-primary text-white hover:opacity-95 transition-all shadow-xs inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Category</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-border bg-neutral-bg/60 text-[11px] font-sans font-bold text-neutral-muted uppercase tracking-wider">
                  <th className="py-3 px-4 pl-3 sm:pl-4">Category / Department</th>
                  <th className="py-3 px-4">URL Slug</th>
                  <th className="py-3 px-4 text-center">Products</th>
                  <th className="py-3 px-4 text-center">Order</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-border/60">
                {filteredParents.map((parent) => {
                  const hasSubs = parent.subcategories && parent.subcategories.length > 0;
                  const isExpanded = expandedParentIds.has(parent.id);
                  const isParentDragged = draggedParentId === parent.id;
                  const isParentDragOver = dragOverParentId === parent.id && draggedParentId !== parent.id;

                  return (
                    <tr
                      key={parent.id}
                      onDragOver={(e) => handleParentDragOver(e, parent.id)}
                      onDrop={(e) => handleParentDrop(e, parent.id)}
                      className={`group transition-all ${
                        isParentDragged
                          ? "opacity-30 bg-primary-surface/10 border-dashed border-2 border-primary/50"
                          : isParentDragOver
                          ? "border-t-2 border-primary bg-primary-surface/20"
                          : "hover:bg-neutral-bg/30"
                      }`}
                    >
                      {/* Hierarchical Tree Row for Parent */}
                      <td colSpan={6} className="p-0">
                        {/* Parent Header Row */}
                        <div className="flex items-center py-3.5 px-4 pl-3 sm:pl-4">
                          {/* Drag Handle */}
                          <div
                            draggable={isDragEnabled}
                            onDragStart={(e) => handleParentDragStart(e, parent.id)}
                            onDragEnd={handleDragEnd}
                            title={
                              isDragEnabled
                                ? "Drag to reorder department"
                                : "Clear search and filter tabs to reorder"
                            }
                            className={`w-7 h-7 rounded-md flex items-center justify-center mr-1 text-neutral-muted transition-all select-none ${
                              isDragEnabled
                                ? "hover:text-primary hover:bg-primary-surface/40 cursor-grab active:cursor-grabbing"
                                : "opacity-30 cursor-not-allowed"
                            }`}
                          >
                            <GripVertical className="w-4 h-4" />
                          </div>

                          {/* Expand/Collapse Button */}
                          <button
                            onClick={() => toggleExpandParent(parent.id)}
                            disabled={!hasSubs}
                            className={`w-6 h-6 rounded-md flex items-center justify-center mr-2 text-neutral-muted hover:text-neutral-dark transition-colors ${
                              !hasSubs ? "opacity-30 cursor-default" : "hover:bg-neutral-border/40 cursor-pointer"
                            }`}
                          >
                            {hasSubs ? (
                              isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-primary" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )
                            ) : (
                              <div className="w-1.5 h-1.5 rounded-full bg-neutral-muted/50" />
                            )}
                          </button>

                          {/* Thumbnail */}
                          <div className="w-10 h-10 rounded-xl bg-neutral-bg border border-neutral-border overflow-hidden flex items-center justify-center shrink-0 mr-3 relative">
                            {parent.image_url ? (
                              <Image
                                src={parent.image_url}
                                alt={parent.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : (
                              <Folder className="w-5 h-5 text-primary" />
                            )}
                          </div>

                          {/* Name & Type Badge */}
                          <div className="min-w-0 flex-1 pr-4">
                            <div className="flex items-center gap-2">
                              <span className="font-heading font-bold text-sm sm:text-base text-neutral-dark">
                                {parent.name}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-primary-surface text-primary">
                                Parent Dept
                              </span>
                              {hasSubs && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-sans text-neutral-muted bg-neutral-bg">
                                  {parent.subcategories?.length} subcategory(ies)
                                </span>
                              )}
                            </div>
                            {parent.description && (
                              <p className="font-sans text-xs text-neutral-muted truncate max-w-md mt-0.5">
                                {parent.description}
                              </p>
                            )}
                          </div>

                          {/* Slug */}
                          <div className="w-44 px-4 font-mono text-xs text-neutral-muted truncate flex items-center gap-1">
                            <span>/{parent.slug}</span>
                            <a
                              href={`/category/${parent.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-neutral-muted hover:text-primary transition-colors inline-block ml-1"
                              title="View on Storefront"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>

                          {/* Product Count */}
                          <div className="w-24 px-4 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-sans font-medium bg-neutral-bg text-neutral-dark border border-neutral-border">
                              <Package className="w-3 h-3 text-neutral-muted" />
                              <span>{parent.productCount}</span>
                            </span>
                          </div>

                          {/* Display Order */}
                          <div className="w-20 px-4 text-center">
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-neutral-bg text-neutral-dark border border-neutral-border">
                              #{parent.display_order ?? 0}
                            </span>
                          </div>

                          {/* Active Toggle Switch */}
                          <div className="w-28 px-4 text-center">
                            <button
                              onClick={() => handleToggleStatus(parent)}
                              disabled={isPending}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-sans font-bold transition-all border ${
                                parent.is_active
                                  ? "bg-success-light text-success border-success/30 hover:bg-success/20"
                                  : "bg-neutral-bg text-neutral-muted border-neutral-border hover:bg-neutral-border/50"
                              }`}
                            >
                              {parent.is_active ? "Active" : "Draft"}
                            </button>
                          </div>

                          {/* Action Buttons */}
                          <div className="w-36 px-4 pr-6 text-right flex items-center justify-end gap-1.5">
                            {/* Add Subcategory Button */}
                            <button
                              onClick={() => handleOpenCreate(parent.id)}
                              className="p-1.5 rounded-md text-neutral-muted hover:text-primary hover:bg-primary-surface/40 transition-colors"
                              title="Add subcategory under this parent"
                            >
                              <FolderPlus className="w-4 h-4 text-primary" />
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => handleOpenEdit(parent)}
                              className="p-1.5 rounded-md text-neutral-muted hover:text-neutral-dark hover:bg-neutral-bg transition-colors"
                              title="Edit Category"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => setCategoryToDelete(parent)}
                              className="p-1.5 rounded-md text-neutral-muted hover:text-error hover:bg-error-surface transition-colors"
                              title="Delete Category"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Nested Subcategories (if expanded) */}
                        {hasSubs && isExpanded && (
                          <div className="bg-neutral-bg/40 border-t border-neutral-border/60 divide-y divide-neutral-border/40 pl-8 sm:pl-10">
                            {parent.subcategories?.map((sub) => {
                              const isSubDragged = draggedSubId === sub.id;
                              const isSubDragOver = dragOverSubId === sub.id && draggedSubId !== sub.id;

                              return (
                                <div
                                  key={sub.id}
                                  onDragOver={(e) => handleSubDragOver(e, parent.id, sub.id)}
                                  onDrop={(e) => handleSubDrop(e, parent.id, sub.id)}
                                  className={`flex items-center py-2.5 px-4 transition-all ${
                                    isSubDragged
                                      ? "opacity-30 bg-primary-surface/10 border-dashed border border-primary/40 rounded-lg"
                                      : isSubDragOver
                                      ? "border-t-2 border-primary bg-primary-surface/20"
                                      : "hover:bg-surface/80"
                                  }`}
                                >
                                  {/* Subcategory Drag Handle */}
                                  <div
                                    draggable={isDragEnabled}
                                    onDragStart={(e) => handleSubDragStart(e, parent.id, sub.id)}
                                    onDragEnd={handleDragEnd}
                                    title={
                                      isDragEnabled
                                        ? "Drag to reorder subcategory"
                                        : "Clear search and filter tabs to reorder"
                                    }
                                    className={`w-6 h-6 rounded-md flex items-center justify-center mr-1 text-neutral-muted transition-all select-none ${
                                      isDragEnabled
                                        ? "hover:text-primary hover:bg-primary-surface/40 cursor-grab active:cursor-grabbing"
                                        : "opacity-30 cursor-not-allowed"
                                    }`}
                                  >
                                    <GripVertical className="w-3.5 h-3.5" />
                                  </div>

                                  {/* Tree branch icon */}
                                  <div className="w-4 h-4 flex items-center justify-center text-neutral-muted mr-2">
                                    <span className="text-xs font-mono text-neutral-border">└─</span>
                                  </div>

                                  {/* Subcategory Icon/Thumbnail */}
                                  <div className="w-8 h-8 rounded-lg bg-surface border border-neutral-border overflow-hidden flex items-center justify-center shrink-0 mr-3 relative">
                                    {sub.image_url ? (
                                      <Image
                                        src={sub.image_url}
                                        alt={sub.name}
                                        fill
                                        sizes="32px"
                                        className="object-cover"
                                      />
                                    ) : (
                                      <Folder className="w-4 h-4 text-neutral-muted" />
                                    )}
                                  </div>

                                  {/* Name */}
                                  <div className="min-w-0 flex-1 pr-4">
                                    <div className="flex items-center gap-2">
                                      <span className="font-sans font-semibold text-xs sm:text-sm text-neutral-dark">
                                        {sub.name}
                                      </span>
                                      <span className="px-2 py-0.2 rounded-full text-[9px] font-sans font-medium bg-neutral-bg text-neutral-muted border border-neutral-border">
                                        Subcategory
                                      </span>
                                    </div>
                                  </div>

                                  {/* Slug */}
                                  <div className="w-44 px-4 font-mono text-xs text-neutral-muted truncate flex items-center gap-1">
                                    <span>/{sub.slug}</span>
                                    <a
                                      href={`/category/${sub.slug}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-neutral-muted hover:text-primary transition-colors inline-block ml-1"
                                      title="View on Storefront"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </div>

                                  {/* Product Count */}
                                  <div className="w-24 px-4 text-center">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-sans font-medium bg-surface text-neutral-dark border border-neutral-border">
                                      <Package className="w-3 h-3 text-neutral-muted" />
                                      <span>{sub.productCount}</span>
                                    </span>
                                  </div>

                                  {/* Order */}
                                  <div className="w-20 px-4 text-center">
                                    <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-mono text-neutral-muted bg-surface border border-neutral-border">
                                      #{sub.display_order ?? 0}
                                    </span>
                                  </div>

                                  {/* Status */}
                                  <div className="w-28 px-4 text-center">
                                    <button
                                      onClick={() => handleToggleStatus(sub)}
                                      disabled={isPending}
                                      className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-bold transition-all border ${
                                        sub.is_active
                                          ? "bg-success-light text-success border-success/30 hover:bg-success/20"
                                          : "bg-surface text-neutral-muted border-neutral-border hover:bg-neutral-border/50"
                                      }`}
                                    >
                                      {sub.is_active ? "Active" : "Draft"}
                                    </button>
                                  </div>

                                  {/* Actions */}
                                  <div className="w-36 px-4 pr-6 text-right flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => handleOpenEdit(sub)}
                                      className="p-1 rounded-md text-neutral-muted hover:text-neutral-dark hover:bg-neutral-bg transition-colors"
                                      title="Edit Subcategory"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => setCategoryToDelete(sub)}
                                      className="p-1 rounded-md text-neutral-muted hover:text-error hover:bg-error-surface transition-colors"
                                      title="Delete Subcategory"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Category Create / Edit Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSuccess={handleDataUpdated}
        categoryToEdit={categoryToEdit}
        defaultParentId={defaultParentId}
        availableParents={parentCategories}
      />

      {/* Delete Guard Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-neutral-dark/60 backdrop-blur-xs transition-opacity"
            onClick={() => {
              setCategoryToDelete(null);
              setDeleteError(null);
            }}
          />

          <div className="relative w-full max-w-md rounded-2xl bg-surface border border-neutral-border shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-error-surface text-error flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-neutral-dark">
                  Delete Category
                </h3>
                <p className="font-sans text-xs text-neutral-muted">
                  Category: &quot;{categoryToDelete.name}&quot;
                </p>
              </div>
            </div>

            {/* Error or Blocked Guard Notice */}
            {deleteError ? (
              <div className="p-3.5 rounded-xl bg-error-surface border border-error/30 text-error text-xs font-sans mb-4">
                <p className="font-bold mb-1">Deletion Blocked</p>
                <p>{deleteError}</p>
              </div>
            ) : categoryToDelete.subcategories && categoryToDelete.subcategories.length > 0 ? (
              <div className="p-3.5 rounded-xl bg-warning-surface border border-warning/30 text-neutral-dark text-xs font-sans mb-4 space-y-1.5">
                <p className="font-bold text-warning-foreground flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-warning" /> Has Child Subcategories
                </p>
                <p className="text-neutral-muted">
                  This category contains{" "}
                  <strong>{categoryToDelete.subcategories.length} subcategory(ies)</strong>. To
                  prevent orphaned navigation, please delete or reassign its subcategories first.
                </p>
              </div>
            ) : categoryToDelete.productCount > 0 ? (
              <div className="p-3.5 rounded-xl bg-warning-surface border border-warning/30 text-neutral-dark text-xs font-sans mb-4 space-y-1.5">
                <p className="font-bold text-warning-foreground flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-warning" /> Assigned Products Detected
                </p>
                <p className="text-neutral-muted">
                  There are currently{" "}
                  <strong>{categoryToDelete.productCount} product(s)</strong> assigned to this
                  category. Please reassign products to another category before deleting.
                </p>
              </div>
            ) : (
              <p className="font-sans text-xs text-neutral-muted mb-4">
                Are you sure you want to permanently delete this category? This action cannot be undone.
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setCategoryToDelete(null);
                  setDeleteError(null);
                }}
                disabled={isPending}
                className="px-4 py-2 rounded-md font-sans text-xs font-semibold text-neutral-dark bg-neutral-bg hover:bg-neutral-border/40 transition-colors"
              >
                Close
              </button>

              {/* Allow delete button only if not blocked */}
              {(!categoryToDelete.subcategories || categoryToDelete.subcategories.length === 0) &&
                categoryToDelete.productCount === 0 && (
                  <button
                    type="button"
                    onClick={confirmDelete}
                    disabled={isPending}
                    className="px-4 py-2 rounded-md font-sans text-xs font-bold bg-error text-white hover:opacity-95 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
                    <span>Confirm Delete</span>
                  </button>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
