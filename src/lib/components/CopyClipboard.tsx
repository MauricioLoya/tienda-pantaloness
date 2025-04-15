'use client';
import React, { useState } from 'react';

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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copiado!
                </>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002-2h2a2 2 0 002 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    {label}
                </>
            )}
        </button>
    );
};

export default CopyClipboard;