import React, { useState, useEffect, useRef } from 'react';
import { HiX } from 'react-icons/hi';

interface Tag {
    id?: string;
    name: string;
    slug?: string;
}

interface TagSelectorProps {
    selectedTags: Tag[];
    onTagsChange: (tags: Tag[]) => void;
    availableTags: Tag[];
}

const TagSelector: React.FC<TagSelectorProps> = ({ selectedTags, onTagsChange, availableTags }) => {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputValue.trim()) {
            const filtered = availableTags.filter(
                tag =>
                    tag.id && !selectedTags.find(st => st.id === tag.id) &&
                    tag.name.toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredTags(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    }, [inputValue, availableTags, selectedTags]);

    const handleAddTag = (tag: Tag) => {
        if (!selectedTags.find(t => t.id === tag.id)) {
            onTagsChange([...selectedTags, tag]);
        }
        setInputValue('');
        setShowSuggestions(false);
    };

    const handleRemoveTag = (tagId?: string) => {
        if (!tagId) return;
        onTagsChange(selectedTags.filter(t => t.id !== tagId));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredTags.length > 0) {
                handleAddTag(filteredTags[0]);
            }
        }
    };

    const handleShowAllTags = () => {
        setInputValue('');
        const allAvailable = availableTags.filter(
            tag => tag.id && !selectedTags.find(st => st.id === tag.id)
        );
        setFilteredTags(allAvailable);
        setShowSuggestions(true);
        inputRef.current?.focus();
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                const dropdown = document.querySelector('.tag-suggestions-dropdown');
                if (dropdown && !dropdown.contains(event.target as Node)) {
                    setShowSuggestions(false);
                }
            }
        };

        if (showSuggestions) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showSuggestions]);

    return (
        <div className="space-y-3">
            {/* Selected Tags */}
            {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedTags.map(tag => (
                        <div
                            key={tag.id}
                            className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                            <span>{tag.name}</span>
                            <button
                                onClick={() => handleRemoveTag(tag.id)}
                                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                            >
                                <HiX className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Autocomplete Input with Dropdown Button */}
            <div className="relative flex items-center gap-2">
                <div className="relative flex-1">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => inputValue && setShowSuggestions(true)}
                        placeholder="Gõ để tìm tag..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />

                    {/* Suggestions Dropdown */}
                    {showSuggestions && (
                        <div className="tag-suggestions-dropdown absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {filteredTags.length > 0 ? (
                                filteredTags.map(tag => (
                                    <div
                                        key={tag.id}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            handleAddTag(tag);
                                        }}
                                        className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 hover:text-blue-700 transition-colors"
                                    >
                                        {tag.name}
                                    </div>
                                ))
                            ) : (
                                <div className="px-3 py-2 text-sm text-gray-500 italic">
                                    Không tìm thấy tag phù hợp
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Dropdown Toggle Button */}
                <button
                    type="button"
                    onClick={handleShowAllTags}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Hiện tất cả tags"
                >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default TagSelector;
