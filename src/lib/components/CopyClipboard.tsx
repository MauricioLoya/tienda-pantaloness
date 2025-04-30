'use client';
import React, { useState } from 'react';
import { FaCopy } from 'react-icons/fa';

interface CopyClipboardProps {
    text: string;
    label?: string;
    className?: string;
    buttonSize?: 'btn-xs' | 'btn-sm' | 'btn-md' | 'btn-lg';
    buttonColor?: string;
}

const CopyClipboard: React.FC<CopyClipboardProps> = ({
    text,
    label = '',
    className = '',
    buttonSize = 'btn-xs',
    buttonColor = 'btn-primary',
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Error copying to clipboard:', error);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`btn ${buttonSize} ${buttonColor} ${copied ? 'btn-disabled' : ''} ${className}`}
        >
            {copied ? (
                <>
                    <FaCopy />
                    Copiado!
                </>
            ) : (
                <>
                    <FaCopy />
                    {label}
                </>
            )}
        </button>
    );
};

export default CopyClipboard;