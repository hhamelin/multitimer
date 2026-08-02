import React, { useState } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { FilledTrashIcon } from './FilledTrashIcon';

interface TrashConfirmGroupProps {
  onDelete: () => void;
  onClear: () => void;
  isCompact?: boolean;
}

export const TrashConfirmGroup: React.FC<TrashConfirmGroupProps> = ({
  onDelete,
  onClear,
  isCompact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isExpanded) {
    return (
      <button
        className="btn-trash-trigger"
        onClick={() => setIsExpanded(true)}
        title="Delete or Clear Timer"
      >
        <FilledTrashIcon size={isCompact ? 16 : 18} />
      </button>
    );
  }

  return (
    <div className={`trash-confirm-actions ${isCompact ? 'compact' : ''}`}>
      <button
        className="btn-trash-action btn-delete"
        onClick={() => {
          onDelete();
          setIsExpanded(false);
        }}
        title="Permanently remove timer"
      >
        <FilledTrashIcon size={13} />
        <span>Delete</span>
      </button>

      <button
        className="btn-trash-action btn-clear"
        onClick={() => {
          onClear();
          setIsExpanded(false);
        }}
        title="Reset time to 00:00:00"
      >
        <RotateCcw size={13} />
        <span>Clear</span>
      </button>

      <button
        className="btn-trash-action btn-cancel"
        onClick={() => setIsExpanded(false)}
        title="Cancel"
      >
        <X size={14} />
        {!isCompact && <span>Cancel</span>}
      </button>
    </div>
  );
};
