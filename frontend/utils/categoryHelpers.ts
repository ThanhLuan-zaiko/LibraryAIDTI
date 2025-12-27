import { Category } from "@/services/category.service";

/**
 * Calculate the depth/level of a category in the hierarchy
 */
export function getCategoryDepth(category: Category, allCategories: Category[]): number {
    let depth = 0;
    let current = category;

    while (current.parent_id) {
        depth++;
        const parent = allCategories.find(c => c.id === current.parent_id);
        if (!parent) break;
        current = parent;
    }

    return depth;
}

/**
 * Get total count of all descendants (children, grandchildren, etc.)
 */
export function getDescendantsCount(categoryId: string, allCategories: Category[]): number {
    const children = allCategories.filter(c => c.parent_id === categoryId);

    return children.reduce((count, child) => {
        return count + 1 + getDescendantsCount(child.id, allCategories);
    }, 0);
}

/**
 * Build a tree structure from flat category list
 */
export function buildCategoryTree(categories: Category[]): Category[] {
    // Create a map for quick lookup
    const categoryMap = new Map<string, Category>();

    // Initialize all categories with empty children array
    categories.forEach(category => {
        categoryMap.set(category.id, { ...category, children: [] });
    });

    const roots: Category[] = [];

    // Build the tree structure
    categories.forEach(category => {
        const node = categoryMap.get(category.id)!;

        if (category.parent_id) {
            const parent = categoryMap.get(category.parent_id);
            if (parent) {
                if (!parent.children) parent.children = [];
                parent.children.push(node);
            }
        } else {
            // Root category
            roots.push(node);
        }
    });

    return roots;
}

/**
 * Flatten tree structure back to array with level information
 */
export function flattenCategoryTree(tree: Category[], level: number = 0): Category[] {
    let result: Category[] = [];

    tree.forEach(node => {
        const nodeWithLevel = { ...node, level };
        result.push(nodeWithLevel);

        if (node.children && node.children.length > 0) {
            result = result.concat(flattenCategoryTree(node.children, level + 1));
        }
    });

    return result;
}

/**
 * Get all ancestor IDs of a category
 */
export function getAncestorIds(categoryId: string, allCategories: Category[]): string[] {
    const ancestors: string[] = [];
    let current = allCategories.find(c => c.id === categoryId);

    while (current?.parent_id) {
        ancestors.push(current.parent_id);
        current = allCategories.find(c => c.id === current!.parent_id);
    }

    return ancestors;
}

/**
 * Check if a category is an ancestor of another
 */
export function isAncestor(potentialAncestorId: string, categoryId: string, allCategories: Category[]): boolean {
    const ancestors = getAncestorIds(categoryId, allCategories);
    return ancestors.includes(potentialAncestorId);
}

/**
 * Get all root categories (categories without parent)
 */
export function getRootCategories(categories: Category[]): Category[] {
    return categories.filter(c => !c.parent_id);
}

/**
 * Get all child categories of a specific parent
 */
export function getChildCategories(parentId: string, categories: Category[]): Category[] {
    return categories.filter(c => c.parent_id === parentId);
}

/**
 * Sort categories by name while maintaining hierarchy
 */
export function sortCategoriesHierarchically(categories: Category[]): Category[] {
    const tree = buildCategoryTree(categories);

    // Recursively sort each level
    function sortLevel(nodes: Category[]): Category[] {
        return nodes
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(node => ({
                ...node,
                children: node.children ? sortLevel(node.children) : []
            }));
    }

    const sortedTree = sortLevel(tree);
    return flattenCategoryTree(sortedTree);
}
