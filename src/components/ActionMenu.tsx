import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, FolderPlus, Share2, Edit2, Trash2, FolderInput, Palette } from 'lucide-react';

export interface ActionMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  buttonClassName?: string;
  menuClassName?: string;
  align?: 'left' | 'right';
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
  items,
  buttonClassName = '',
  menuClassName = '',
  align = 'right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`p-1.5 rounded-full hover:bg-black/15 active:scale-95 transition-all text-current cursor-pointer ${buttonClassName}`}
        aria-label="Options"
        title="More options"
      >
        <MoreVertical className="w-4 h-4 stroke-[2.2]" />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute z-30 mt-1 w-44 rounded-xl bg-white text-slate-800 shadow-xl border border-slate-200 py-1 text-xs animate-in fade-in zoom-in-95 duration-100 ${
            align === 'right' ? 'right-0' : 'left-0'
          } ${menuClassName}`}
        >
          {items.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                item.onClick();
              }}
              className={`w-full px-3 py-2 text-left flex items-center space-x-2 transition-colors cursor-pointer ${
                item.variant === 'danger'
                  ? 'text-rose-600 hover:bg-rose-50'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item.icon && <span className="w-4 h-4 shrink-0 flex items-center justify-center">{item.icon}</span>}
              <span className="font-semibold truncate">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
